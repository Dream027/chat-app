"use client";

import { useSession } from "@/contexts/SessionProvider";
import { socket } from "@/utils/socket";
import { Trash } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type UserChatsProps = {
    chats: Message[];
};

export default function UserChats({ chats }: UserChatsProps) {
    const session = useSession();
    const [messages, setMessages] = useState(chats);
    const chatsRef = useRef<HTMLDivElement>(null);
    const [selectedChats, setSelectedChats] = useState<number[]>([]);
    const params = useParams();

    useEffect(() => {
        chatsRef.current?.scrollTo(0, chatsRef.current.scrollHeight);
    }, [messages]);

    useEffect(() => {
        function onMessage(message: Message) {
            setMessages((prev) => [...prev, message]);
        }

        socket.on("chat-message", onMessage);
        socket.on("messages-deleted", (timestamp: number[]) => {
            setSelectedChats([]);
            setMessages((prev) =>
                prev.filter((p) => !timestamp.includes(p.timestamp))
            );
        });

        return () => {
            socket.off("chat-message", onMessage);
            socket.off("messages-deleted");
        };
    }, []);

    const selectChat = useCallback(
        (timestamp: number, sender: string) => {
            if (session?._id !== sender) {
                return;
            }
            if (selectedChats.includes(timestamp)) {
                setSelectedChats((prev) =>
                    prev.filter((chat) => chat !== timestamp)
                );
            } else {
                setSelectedChats((prev) => [...prev, timestamp]);
            }
        },
        [selectedChats]
    );

    const deleteChats = useCallback(() => {
        socket.emit("delete-chats", {
            timestamps: selectedChats,
            id: params.chatId,
        });
    }, [selectedChats, params.chatId]);

    return (
        <div className="chat_container" ref={chatsRef}>
            {selectedChats.length === 0 ? null : (
                <span className="chat_delete" onClick={deleteChats}>
                    <Trash />
                </span>
            )}
            {messages.map((chat) =>
                chat.fileType?.startsWith("image") ? (
                    <div
                        className={`${
                            chat.sender === session?._id
                                ? "chat_image_sent"
                                : ""
                        } chat_image ${
                            selectedChats.includes(chat.timestamp)
                                ? "chat_selected"
                                : ""
                        }`}
                        key={chat.timestamp}
                        onClick={() => selectChat(chat.timestamp, chat.sender)}
                    >
                        <img src={chat.data} alt="" />
                    </div>
                ) : (
                    <div
                        key={chat.timestamp}
                        onClick={() => selectChat(chat.timestamp, chat.sender)}
                        className={
                            selectedChats.includes(chat.timestamp)
                                ? "chat_selected"
                                : ""
                        }
                    >
                        <p
                            className={
                                chat.sender === session?._id ? "chat_sent" : ""
                            }
                        >
                            {chat.data}
                        </p>
                    </div>
                )
            )}
        </div>
    );
}
