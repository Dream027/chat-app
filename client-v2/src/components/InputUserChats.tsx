"use client";

import { useSession } from "@/contexts/SessionProvider";
import { socket } from "@/utils/socket";
import { Send } from "lucide-react";
import { useCallback, useState } from "react";

export default function InputUserChats({ friend }: { friend: User }) {
    const [value, setValue] = useState("");
    const session = useSession();

    const sendmessage = useCallback(() => {
        if (!value) return;
        if (!socket.connected) {
            socket.connect();
            return;
        }

        socket.emit("chat-message", {
            sender: session?._id,
            receiver: friend._id,
            data: value,
        });
        setValue("");
    }, [value, friend, session]);

    return (
        <div className="chat_input">
            <div className="align-center">
                <input
                    type="text"
                    placeholder="Type something..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") sendmessage();
                    }}
                />
                <button onClick={sendmessage}>
                    <Send />
                    Send
                </button>
            </div>
        </div>
    );
}
