import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { socket } from "@/utils/socket";
import styles from "@/styles/ChatRoom.module.css";
import { Send } from "lucide-react";
import { useSession } from "@/contexts/SessionProvider";
import { fetchClient } from "@/utils/fetchClient";
import Image from "next/image";

export default function ChatRoomPage() {
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const session = useSession();
    const [loading, setLoading] = useState(true);
    const [friend, setFriend] = useState<User | null>(null);

    function sendMessage() {
        socket.emit("chat-message", {
            sender: session?._id,
            data: inputRef.current?.value,
            receiver: friend?._id,
        });
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
                console.log(friendsRes);
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
            console.log(message);
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
                <div className={styles.chats}>
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
                            ref={inputRef}
                            type="text"
                            placeholder="Send a message"
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
