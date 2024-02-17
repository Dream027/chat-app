import { createServer } from "http";
import { app } from "./app";
import "dotenv/config";
import { connectToDb, redis } from "./db";
import { Server } from "socket.io";
import { generateChatId } from "./utils/generateChatId";

const server = createServer(app);

const PORT = process.env.PORT || 4000;
(async () => {
    await connectToDb();
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})();

const io = new Server(server, {
    cors: {
        origin: (req, cb) => {
            cb(null, true);
        },
        credentials: true,
    },
});

io.use((socket, next) => {
    console.log(socket.handshake.headers.cookie);
    next(new Error("Authentication error"));
});

io.on("connection", (socket) => {
    socket.on("chat-message", async (message) => {
        await redis.rpush(
            `chat-${generateChatId(message.sender, message.receiver)}`,
            JSON.stringify(message)
        );
        io.emit("chat-message", message);
    });
});
