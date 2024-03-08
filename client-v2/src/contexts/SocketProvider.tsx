import { createContext, useEffect } from "react";
import { Socket } from "socket.io-client";
import { socket } from "@/utils/socket";

type SocketContextType =
    | undefined
    | {
          socket: Socket;
      };
const SocketContext = createContext<SocketContextType>(undefined);

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        if (socket.connected) return;
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);
    return (
        <SocketContext.Provider value={{ socket: socket }}>
            {children}
        </SocketContext.Provider>
    );
}
