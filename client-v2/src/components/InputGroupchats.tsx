"use client";

import { useSession } from "@/contexts/SessionProvider";
import { socket } from "@/utils/socket";
import { Send } from "lucide-react";
import { useCallback, useState } from "react";

type InputGroupchatsProps = {
    group: Group;
};

export default function InputGroupchats({ group }: InputGroupchatsProps) {
    const [value, setValue] = useState("");
    const sesion = useSession();

    const sendmessage = useCallback(() => {
        if (!value) return;
        if (!socket.connected) {
            socket.connect();
            return;
        }

        socket.emit("group-message", {
            sender: sesion?._id,
            id: group._id,
            data: value,
        });
        setValue("");
    }, [value]);

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
