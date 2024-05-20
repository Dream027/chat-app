"use client";

import { socket } from "@/utils/socket";
import { LucidePhoneCall } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import Peer from "peerjs";
import { useCallback, useEffect, useRef, useState } from "react";

export default function RoomCall() {
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const currentUserVideoRef = useRef<HTMLVideoElement | null>(null);
    const peerInstance = useRef<Peer | null>(null);
    const [selfStream, setSelfStream] = useState<MediaStream>();
    const router = useRouter();
    const params = useParams();

    // useEffect(() => {
    //     socket.on("peer-left", () => {
    //         remoteVideoRef.current!.srcObject = null;
    //     });

    //     socket.off("peer-left");
    // }, []);

    useEffect(() => {
        if (!navigator) return;
        if (!selfStream) return;
        socket.on("peer-joined", (id) => {
            socket.emit("peer-data", {
                id: peerInstance.current?.id,
                room: params.roomId,
            });
            peerInstance.current?.call(id, selfStream);
        });

        socket.on("peer-data", (id: string) => {
            peerInstance.current?.call(id, selfStream);
        });

        return () => {
            socket.off("peer-joined");
            socket.off("peer-data");
        };
    }, [selfStream]);

    useEffect(() => {
        if (!navigator) return;
        const peer = new Peer({ host: "localhost", port: 9000 });
        peer.on("open", (id) => {
            socket.emit("room-joined", { id: peer.id, room: params.roomId });
        });

        peer.on("call", (call) => {
            call.answer(selfStream);
            call.on("stream", (stream) => {
                console.log("call received");
                remoteVideoRef.current!.srcObject = stream;
                remoteVideoRef.current!.play();
            });
        });

        peerInstance.current = peer;

        return () => {
            peer.disconnect();
        };
    }, [selfStream]);

    useEffect(() => {
        if (!navigator) return;
        navigator.mediaDevices
            .getUserMedia({ audio: false, video: true })
            .then((stream) => {
                setSelfStream(stream);
                currentUserVideoRef.current!.srcObject = stream;
            });
    }, []);

    const endCall = useCallback(() => {
        socket.emit("end-call");
        peerInstance.current?.disconnect();
        peerInstance.current = null;
        router.push("/");
    }, [router]);

    return (
        <div className="main">
            <div className="video-container">
                <video ref={currentUserVideoRef} muted autoPlay></video>
                <video ref={remoteVideoRef}></video>
            </div>
            <button onClick={endCall}>
                <LucidePhoneCall />
            </button>
        </div>
    );
}
