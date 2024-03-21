"use client";

import peerConnection from "@/utils/PeerConnection";
import { socket } from "@/utils/socket";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function GroupCall() {
    const selfVideoRef = useRef<HTMLVideoElement>(null);
    const params = useParams();
    const [selfMedia, setselfMedia] = useState<MediaStream>();
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream>();

    useEffect(() => {
        (async () => {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            setselfMedia(stream);
            selfVideoRef.current!.srcObject = stream;
            const offer = await peerConnection.createOffer();
            socket.emit("offer", { id: params.groupId, offer });
        })();
    }, []);

    useEffect(() => {
        function onUserJoined(id: string) {}

        async function onGetOffer(offer: any) {
            const answer = await peerConnection.createAnswer(offer);
            socket.emit("answer", { id: params.groupId, answer });
        }

        async function onGetAnswer(answer: any) {
            await peerConnection.setRemoteDescription(answer);

            selfMedia?.getTracks().forEach((track) => {
                peerConnection.instance?.addTrack(track, selfMedia);
            });
        }

        socket.emit("join-group", params.groupId);
        socket.on("user-joined", onUserJoined);
        socket.on("offer", onGetOffer);
        socket.on("answer", onGetAnswer);

        return () => {
            socket.emit("leave-group", params.groupId);
            socket.off("user-joined", onUserJoined);
            socket.off("answer", onGetAnswer);
            socket.off("offer", onGetOffer);
        };
    }, []);

    useEffect(() => {
        peerConnection.instance?.addEventListener("track", (event) => {
            console.log("track event", event);
            const streams = event.streams;

            if (streams.length > 0) {
                setRemoteStream(streams[0]);
                remoteVideoRef.current!.srcObject = streams[0];
            }
        });
    }, []);

    return (
        <div className="call_main">
            <div className="call_container">
                <video muted autoPlay ref={selfVideoRef}></video>
                <video autoPlay ref={remoteVideoRef}></video>
            </div>

            <div className="call_controls"></div>
        </div>
    );
}
