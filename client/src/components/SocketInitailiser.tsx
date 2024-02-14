import { useEffect } from "react";
import { socket } from "@/utils/socket";

export default function SocketInitailiser() {
    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    return null;
}
