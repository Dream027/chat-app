"use client";

import { socket } from "@/utils/socket";
import { PhoneCall } from "lucide-react";
import { useParams } from "next/navigation";
import Peer from "peerjs";
import { useEffect, useMemo, useRef, useState } from "react";

export default function GroupCall() {
    const selfVideoRef = useRef<HTMLVideoElement>(null);
    const params = useParams();

    // useEffect(() => {
    //     (async () => {
    //         const stream = await navigator.mediaDevices.getUserMedia({
    //             video: true,
    //             audio: true,
    //         });
    //         setselfMedia(stream);
    //         selfVideoRef.current!.srcObject = stream;
    //         const peer = new Peer(undefined as any, {
    //             host: "localhost",
    //             port: 9000,
    //         });
    //         peer.on("open", (id) => {
    //             socket.emit("join-group", { id, groupId: params.groupId });
    //         });

    //         const domVidContainer =
    //             document.getElementsByClassName("call_container")[0];

    //         function onUserJoined(id: string) {
    //             const call = peer.call(id, stream);
    //             const video = document.createElement("video");
    //             video.autoplay = true;
    //             video.muted = true;

    //             call.on("stream", (remoteStream) => {
    //                 video.srcObject = remoteStream;
    //                 domVidContainer?.appendChild(video);
    //             });
    //             call.on("close", () => {
    //                 video.remove();
    //             });
    //         }

    //         peer.on("call", (call) => {
    //             console.log("call", call);
    //         });

    //         socket.on("user-joined", onUserJoined);
    //     })();

    //     return () => {
    //         socket.emit("leave-group", {
    //             groupId: params.groupId,
    //             id: myPeer?.id,
    //         });
    //         myPeer?.disconnect();
    //         myPeer?.destroy();
    //         socket.off("user-joined");
    //         myPeer?.off
    //     };
    // }, []);

    // useEffect(() => {
    //     function onUserLeft(id: string) {
    //         console.log("user left", id);
    //     }

    //     socket.on("user-left", onUserLeft);

    //     return () => {
    //         socket.off("user-left", onUserLeft);
    //     };
    // }, []);

    useEffect(() => {
        let peer: Peer;
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((stream) => {
                selfVideoRef.current!.srcObject = stream;
                peer = new Peer(undefined as any, {
                    host: process.env.NEXT_PUBLIC_PEER_HOST!,
                    port: parseInt(process.env.NEXT_PUBLIC_PEER_PORT!),
                });
                peer.on("open", (id) => {
                    socket.emit("join-group", { id, groupId: params.groupId });
                });

                const domVidContainer =
                    document.getElementsByClassName("call_container")[0];
                const remoteVideo = domVidContainer
                    .children[1] as HTMLVideoElement;

                peer.on("call", (call) => {
                    console.log("call ", call);
                    call.answer(stream);
                    call.on("stream", (remoteStream) => {
                        remoteVideo.srcObject = remoteStream;
                    });

                    call.on("close", () => {
                        console.log("call closed");
                        remoteVideo.srcObject = null;
                        remoteVideo.style.display = "none";
                    });
                });

                socket.on("user-joined", (id) => {
                    console.log("user joined", id);
                    const call = peer.call(id, stream);
                    call.on("stream", (remoteStream) => {
                        remoteVideo.style.display = "block";
                        remoteVideo.srcObject = remoteStream;
                    });

                    call.on("close", () => {
                        console.log("call closed");
                        remoteVideo.srcObject = null;
                        remoteVideo.style.display = "none";
                    });
                });

                socket.on("user-left", (id) => {
                    console.log("user left", id);
                });
                socket.on("user-disconnected", () => {
                    console.log("user disconnected");
                    remoteVideo.srcObject = null;
                    remoteVideo.style.display = "none";
                });
            });

        return () => {
            socket.emit("leave-group", {
                groupId: params.groupId,
                id: peer?.id,
            });
            peer?.disconnect();
            peer?.destroy();
            socket.off("user-joined");
            socket.off("user-left");
            socket.off("user-disconnected");
        };
    }, [params.groupId]);

    return (
        <div className="call_main">
            <div className="call_container">
                <video muted autoPlay ref={selfVideoRef}></video>
                <video muted autoPlay></video>
            </div>

            <div className="call_controls">
                <button
                    onClick={() => {
                        window.location.href = "/";
                    }}
                >
                    <PhoneCall />
                </button>
            </div>
        </div>
    );
}
