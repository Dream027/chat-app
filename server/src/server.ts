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

let users: { socketId: string; userId: string }[] = [];

io.use(async (socket, next) => {
    if (socket.handshake.headers.cookie?.split("=")[0] !== "token") {
        next(new Error("Authentication error"));
    }

    const session = await redis.get(
        `session-${socket.handshake.headers.cookie?.split("=")[1]}`
    );
    if (!session) {
        next(new Error("Authentication error"));
    } else {
        const sessionData = JSON.parse(session);
        users.push({
            socketId: socket.id,
            userId: sessionData._id,
        });
        next();
    }
});

io.on("connection", (socket) => {
    socket.on("chat-message", async (message) => {
        await redis.rpush(
            `chat-${generateChatId(message.sender, message.receiver)}`,
            JSON.stringify(message)
        );
        if (users.find((user) => user.userId === message.receiver)) {
            io.to(
                users.find((user) => user.userId === message.receiver)!.socketId
            ).emit("chat-message", message);
        }
        socket.emit("chat-message", message);
    });

    socket.on("group-message", async (message: any) => {
        const key = `groupJoined-${message.id}`;
        const members = await redis.lrange(key, 0, -1);

        await redis.lpush(`groupChat-${message.id}`, message);
        members.forEach((member) => {
            if (users.find((user) => user.userId === member)) {
                io.to(
                    users.find((user) => user.userId === member)!.socketId
                ).emit("group-message", message);
            }
        });
    });

    socket.on("disconnect", () => {
        users = users.filter((user) => user.socketId !== socket.id);
    });
});
