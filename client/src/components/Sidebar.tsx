import { Loader, LogOut } from "lucide-react";
import {
    SessionContext,
    useSession,
    useSessionState,
} from "@/contexts/SessionProvider";
import styles from "./styles/Sidebar.module.css";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";
import Link from "next/link";
import { generateChatId } from "@/utils/generateChatId";

export default function Sidebar() {
    const [session, setSession] = useSessionState();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [chats, setChats] = useState<{ friends: User[]; groups: Group[] }>({
        friends: [],
        groups: [],
    });

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchClient("/friends", "GET");
                setChats(res.data);
            } catch (e: any) {
                console.error(e.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    async function handleLogout() {
        try {
            const res = await fetchClient("/users/logout", "POST");
            if (res.success) {
                toast.success(res.message);
                router.replace("/signin");
                setSession(null);
            } else {
                toast.error(res.message);
            }
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.session_container}>
                <div>
                    <div
                        className={styles.session_image}
                        onClick={() => router.push("/profile")}
                    >
                        <Image src={session?.image!} alt={""} fill />
                    </div>
                    <div>
                        <div>
                            <h4>{session?.name}</h4>
                            <p>{session?.email}</p>
                        </div>
                        <div className={styles.logout} onClick={handleLogout}>
                            <LogOut />
                        </div>
                    </div>
                </div>
            </div>

            {/*Chats*/}
            <div>
                <h3>Chats</h3>
                {loading ? (
                    <Loader className={`loader ${styles.loader}`} />
                ) : chats.friends.length === 0 ? (
                    <div className={styles.placeholder}>
                        <h3>Add a friend to chatting</h3>
                        <Link href={"/friends/invite"}>Add Friend</Link>
                    </div>
                ) : (
                    <>
                        {chats.friends.map((chat) => (
                            <div
                                key={chat._id}
                                className={`${styles.chat}`}
                                onClick={() => {
                                    router.push(
                                        `/chat/${generateChatId(
                                            session?._id!,
                                            chat._id
                                        )}`
                                    );
                                }}
                            >
                                <div>
                                    <Image src={chat.image} alt={""} fill />
                                </div>
                                <h3>{chat.name}</h3>
                            </div>
                        ))}
                    </>
                )}
                {chats.groups.length > 0 && <h3>Groups</h3>}
                {loading ? (
                    <Loader className={`loader ${styles.loader}`} />
                ) : chats.groups.length === 0 ? null : (
                    <>
                        {chats.groups.map((chat) => (
                            <div
                                key={chat._id}
                                className={`${styles.chat}`}
                                onClick={() => {
                                    router.push(`/group/${chat._id}/chat`);
                                }}
                            >
                                <div>
                                    <Image src={chat.image} alt={""} fill />
                                </div>
                                <h3>{chat.name}</h3>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}
