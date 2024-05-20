"use client";

import { useSession } from "@/contexts/SessionProvider";
import { socket } from "@/utils/socket";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function JoinCall() {
    const [roomName, setRoomName] = useState("");
    const router = useRouter();

    function joinRoom() {
        if (!roomName) {
            toast.error("Room name cannot be empty");
            return;
        }

        router.push(`/call/${roomName}`);
    }

    return (
        <main>
            <div className="card">
                <h2>Join Call</h2>
                <div className="input-container">
                    <label htmlFor="room-name">Room Name</label>
                    <input
                        type="text"
                        id="room-name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className={roomName === "" ? "" : "toggle"}
                    />
                </div>
                <button onClick={joinRoom}>Join</button>
            </div>
        </main>
    );
}
