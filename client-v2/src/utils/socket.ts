import { io } from "socket.io-client";
import { SERVER_URL } from "./constants";

export const socket = io(SERVER_URL, {
    transports: ["websocket"],
    autoConnect: false,
    withCredentials: true,
    auth: (cb) => {
        const token = document.cookie
            .split("; ")
            .find((cookie) => cookie.startsWith("token="))
            ?.split("=")[1];
        cb({ token });
    },
});
