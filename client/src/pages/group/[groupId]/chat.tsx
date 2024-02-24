import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/contexts/SessionProvider";
import { socket } from "@/utils/socket";
import toast from "react-hot-toast";
import { fetchClient } from "@/utils/fetchClient";
import Head from "next/head";
import styles from "@/styles/ChatRoom.module.css";
import Image from "next/image";
import { Send } from "lucide-react";

export default function GroupChatPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<
        { sender: string; data: string; id: string }[]
    >([]);
    const session = useSession();
    const [loading, setLoading] = useState(true);
    const [group, setGroup] = useState<Group | null>(null);
    const [input, setInput] = useState("");
    const chatsRef = useRef<HTMLDivElement>(null);

    function sendMessage() {
        if (!socket.connected) {
            toast.error("Socket is not connected");
            socket.connect();
            return;
        }
        socket.emit("group-message", {
            id: router.query.groupId,
            data: input,
            sender: session?._id,
        });
        setInput("");
    }

    useEffect(() => {
        chatsRef.current?.scrollTo(0, chatsRef.current.scrollHeight);
    }, [messages]);

    useEffect(() => {
        (async () => {
            try {
                const groupId = router.query.groupId as string;
                if (!groupId) return;

                const res = await fetchClient(`/groups?id=${groupId}`, "GET");
                if (res.success) {
                    setGroup(res.data);
                } else {
                    console.error(res.message);
                }

                const friendsRes = await fetchClient(
                    `/groups/chats/${groupId}`,
                    "GET"
                );
                setMessages(friendsRes.data);
            } catch (e: any) {
                console.error(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [router.query, session?._id]);

    useEffect(() => {
        if (loading) return;

        function onmessage(message: {
            sender: string;
            data: string;
            id: string;
        }) {
            setMessages((prev) => [...prev, message]);
        }

        socket.on("group-message", onmessage);

        return () => {
            socket.off("group-message", onmessage);
        };
    }, [loading, session]);

    return (
        <>
            <Head>
                <title>Chat with friends</title>
            </Head>
            <div className={styles.main}>
                <div className={styles.header}>
                    <div>
                        <div className={styles.image_container}>
                            <Image src={group?.image!} alt={""} fill />
                        </div>
                        <h2>{group?.name}</h2>
                    </div>
                    <div></div>
                </div>
                <div className={styles.chats} ref={chatsRef}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={
                                session?._id === message.sender
                                    ? styles.sent_by_me
                                    : ""
                            }
                        >
                            <p>{message.data}</p>
                        </div>
                    ))}
                </div>
                <div className={styles.input}>
                    <div>
                        <input
                            type="text"
                            placeholder="Send a message"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button onClick={sendMessage}>
                            <Send />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
