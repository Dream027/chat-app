import { createServer } from "http";
import { app } from "./app";
import { connectToDb, redis } from "./db";
import { Server, Socket } from "socket.io";
import { generateChatId } from "./utils/generateChatId";
import fs from "fs/promises";
import { generateFileLink } from "./utils/generateFileLink";

const server = createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    maxHttpBufferSize: 1e8,
});

// variables for socket
let users: { socketId: string; userId: string }[] = [];
let groups: { id: string; users: string[] }[] = [];

io.use(async (socket, next) => {
    // const token = socket.handshake.headers.cookie
    //     ?.split(";")
    //     .filter((c) => c.startsWith("token="))[0]
    //     ?.split("=")[1]
    //     .trim();

    console.log("auth -> ", socket.handshake.auth);
    const token = socket.handshake.auth.token;
    if (!token) {
        next(new Error("No token available"));
    }

    const session = await redis.get(`session-${token}`);
    console.log("session -> ", session);
    if (!session) {
        next(new Error("No session found"));
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

    socket.on("chat-message-files", async (message: any) => {
        const fileData = message.data;
        const filePath = `${__dirname}/../uploads/media/`;
        const randomName = `${Date.now()}-${message.fileName.replaceAll(
            " ",
            "_"
        )}`;

        await fs
            .writeFile(`${filePath}${randomName}`, fileData)
            .catch((err) => {
                socket.emit("file-error", err.message);
            });
        message.data = generateFileLink(`media/${randomName}`);

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

    socket.on(
        "delete-chats",
        async ({ timestamps, id }: { timestamps: number[]; id: string }) => {
            const key = `chat-${id}`;
            const chats = await redis.lrange(key, 0, -1);
            const arr = chats;
            const filteredArr: string[] = [];
            await redis.del(key);

            arr.forEach((a) => {
                const v = JSON.parse(a) as { timestamp: number };
                if (!timestamps.includes(v.timestamp)) {
                    filteredArr.push(JSON.stringify(v));
                }
            });

            filteredArr.forEach(async (a) => {
                await redis.rpush(key, a);
            });

            const userIds = id.split("-");
            users.forEach((user) => {
                if (userIds.includes(user.userId)) {
                    io.to(user.socketId).emit("messages-deleted", timestamps);
                }
            });
        }
    );

    socket.on("group-message-files", async (message: any) => {
        const fileData = message.data;
        const filePath = `${__dirname}/../uploads/media/`;
        const randomName = `${Date.now()}-${message.fileName.replaceAll(
            " ",
            "_"
        )}`;

        await fs
            .writeFile(`${filePath}${randomName}`, fileData)
            .catch((err) => {
                socket.emit("file-error", err.message);
            });
        message.data = generateFileLink(`media/${randomName}`);

        await redis.lpush(`groupChat-${message.id}`, JSON.stringify(message));

        const members = await redis.lrange(`groupJoined-${message.id}`, 0, -1);
        members.forEach((member) => {
            if (users.find((user) => user.userId === member)) {
                io.to(
                    users.find((user) => user.userId === member)!.socketId
                ).emit("group-message", message);
            }
        });
    });

    socket.on(
        "group-message-delete",
        async ({ id, timestamps }: { id: string; timestamps: number[] }) => {
            const key = `groupChat-${id}`;
            const members = await redis.lrange(`groupJoined-${id}`, 0, -1);
            const chats = await redis.lrange(key, 0, -1);
            const arr = chats;
            const filteredArr: string[] = [];
            await redis.del(key);

            arr.forEach((a) => {
                const v = JSON.parse(a) as { timestamp: number };
                if (!timestamps.includes(v.timestamp)) {
                    filteredArr.push(JSON.stringify(v));
                }
            });

            filteredArr.forEach(async (a) => {
                await redis.rpush(key, a);
            });

            members.forEach((member) => {
                if (users.find((user) => user.userId === member)) {
                    io.to(
                        users.find((user) => user.userId === member)!.socketId
                    ).emit("group-message-deleted", timestamps);
                }
            });
        }
    );

    socket.on("join-group", ({ id, groupId }) => {
        io.to(groupId).emit("user-joined", id);
        socket.join(groupId);
    });

    socket.on("leave-group", ({ id, groupId }) => {
        socket.leave(groupId);
        io.to(groupId).emit("user-left", id);
    });

    socket.on("disconnect", () => {
        users = users.filter((user) => user.socketId !== socket.id);
        Array.from(socket.rooms).forEach((room) => {
            socket.to(room).emit("user-disconnected");
        });
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
