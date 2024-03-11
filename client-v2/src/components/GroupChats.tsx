"use client";

import { useSession } from "@/contexts/SessionProvider";
import { socket } from "@/utils/socket";
import { useEffect, useState } from "react";

type GroupChatsProps = {
    chats: Message[];
};

export default function GroupChats({ chats }: GroupChatsProps) {
    const session = useSession();
    const [messages, setMessages] = useState(chats);

    useEffect(() => {
        function onMessage(message: Message) {
            setMessages((prev) => [...prev, message]);
        }

        socket.on("group-message", onMessage);

        return () => {
            socket.off("group-message", onMessage);
        };
    }, []);

    return (
        <div className="chat_container">
            {messages.map((chat, i) => (
                <div key={i}>
                    <p
                        className={
                            chat.sender === session?._id ? "chat_sent" : ""
                        }
                    >
                        {chat.data}
                    </p>
                </div>
            ))}
        </div>
    );
}
