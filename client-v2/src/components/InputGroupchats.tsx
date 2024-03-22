"use client";

import { useSession } from "@/contexts/SessionProvider";
import { socket } from "@/utils/socket";
import { MousePointer2, Send } from "lucide-react";
import { useCallback, useRef, useState } from "react";

type InputGroupchatsProps = {
    group: Group;
};

export default function InputGroupchats({ group }: InputGroupchatsProps) {
    const [value, setValue] = useState("");
    const sesion = useSession();
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            timestamp: Date.now(),
        });
        setValue("");
    }, [value, group, sesion]);

    const sendFiles = useCallback(() => {
        if (!fileInputRef.current) return;
        if (!fileInputRef.current.files) return;
        if (!socket.connected) {
            socket.connect();
            return;
        }

        socket.emit("group-message-files", {
            sender: sesion?._id,
            id: group._id,
            data: fileInputRef.current.files[0],
            fileName: fileInputRef.current.files[0].name,
            fileType: fileInputRef.current.files[0].type,
            timestamp: Date.now(),
        });
        fileInputRef.current.files = null;
    }, [group, sesion]);

    return (
        <div className="chat_input">
            <div className="align-center">
                <div className="file_input">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={sendFiles}
                    />
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{ appearance: "none", color: "black" }}
                    >
                        <MousePointer2 />
                    </div>
                </div>
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
