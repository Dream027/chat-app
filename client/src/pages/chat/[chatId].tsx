import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/utils/socket";
import styles from "@/styles/ChatRoom.module.css";
import { Send } from "lucide-react";
import { useSession } from "@/contexts/SessionProvider";
import { fetchClient } from "@/utils/fetchClient";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ChatRoomPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const session = useSession();
    const [loading, setLoading] = useState(true);
    const [friend, setFriend] = useState<User | null>(null);
    const [input, setInput] = useState("");
    const chatsRef = useRef<HTMLDivElement>(null);

    function sendMessage() {
        if (!socket.connected) {
            toast.error("Socket is not connected");
            return;
        }
        socket.emit("chat-message", {
            sender: session?._id,
            data: input,
            receiver: friend?._id,
        });
        setInput("");
    }

    useEffect(() => {
        (async () => {
            try {
                const chatId = router.query.chatId as string;
                if (!chatId) return;

                const friendId = chatId
                    .split("-")
                    .filter((id) => id !== session?._id)[0];

                const res = await fetchClient(
                    `/users/friends?id=${friendId}`,
                    "GET"
                );
                if (res.success) {
                    setFriend(res.data);
                } else {
                    console.error(res.message);
                }

                const friendsRes = await fetchClient(
                    `/friends/chats?chatId=${chatId}`,
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

        function onmessage(message: Message) {
            setMessages((prev) => [...prev, message]);
            chatsRef.current?.scrollTo(0, chatsRef.current.scrollHeight);
        }

        socket.on("chat-message", onmessage);

        return () => {
            socket.off("chat-message", onmessage);
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
                            <Image src={friend?.image!} alt={""} fill />
                        </div>
                        <h2>{friend?.name}</h2>
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
