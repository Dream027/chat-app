import { createServer } from "http";
import { app } from "./app";
import { connectToDb, redis } from "./db";
import { Server, Socket } from "socket.io";
import { generateChatId } from "./utils/generateChatId";

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

// variables for socket
let users: { socketId: string; userId: string }[] = [];
let groups: { id: string; users: string[] }[] = [];

io.use(async (socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    const cookies = cookieHeader?.split(";");

    if (!cookieHeader || !cookies) {
        next(new Error("Authentication error"));
    }
    cookies?.forEach((cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key === "token" && value) {
            socket.handshake.headers.token = value;
        }
    });
    if (!socket.handshake.headers.token) {
        next(new Error("Authentication error"));
    }

    const session = await redis.get(
        `session-${socket.handshake.headers.token}`
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

io.engine.on("connection_error", (err) => {
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
});

io.on("connection", (socket: Socket) => {
    socket.on("chat-message", async (message: any) => {
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

        await redis.lpush(`groupChat-${message.id}`, JSON.stringify(message));
        members.forEach((member) => {
            if (users.find((user) => user.userId === member)) {
                io.to(
                    users.find((user) => user.userId === member)!.socketId
                ).emit("group-message", message);
            }
        });
    });

    socket.on("join-group", (id) => {
        io.to(id).emit("user-joined", socket.id);
        socket.join(id);
    });

    socket.on("offer", ({ offer, id }) => {
        socket.broadcast.to(id).emit("offer", offer);
    });

    socket.on("answer", ({ answer, id }) => {
        socket.broadcast.to(id).emit("answer", answer);
    });

    socket.on("candidate", ({ candidate, id }) => {
        socket.broadcast.to(id).emit("candidate", candidate);
    });

    socket.on("disconnect", () => {
        users = users.filter((user) => user.socketId !== socket.id);
    });
});

//
//
//
// Server Listening

const PORT = process.env.PORT || 4000;
(async () => {
    await connectToDb();
    server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
})();
