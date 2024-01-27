import styles from "./SidebarLayout.module.css";
import Image from "next/image";
import { Loader, LogOut } from "lucide-react";
import { logout } from "@/utils/auth";
import { useSession } from "@/contexts/SessionProvider";
import { useFetch } from "@/hooks/useFetch";
import { useRouter } from "next/router";
import { generateChatId } from "@/utils/generateChatId";
import Link from "next/link";

type FriendChat = User & {
    lastMessage: string;
    unreadMessages: number;
};

export default function SidebarLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = useSession();
    const router = useRouter();
    const [friends, loading] = useFetch<FriendChat[]>("/friends");

    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <div className={styles.chat_container}>
                    {loading ? (
                        <Loader className="loader" />
                    ) : !friends || friends.length === 0 ? (
                        <div>
                            <h4>Add friends to start messaging</h4>
                            <br />
                            <Link
                                href="/friends/add"
                                className={"btn btn-link"}
                            >
                                Add friends
                            </Link>
                        </div>
                    ) : (
                        <>
                            {friends.map((friend) => (
                                <Link
                                    key={friend._id}
                                    href={`/chat/${generateChatId(session?._id ?? "", friend._id)}`}
                                >
                                    <div
                                        className={`${router.pathname === `/chat/${generateChatId(session?._id ?? "", friend._id)}` ? styles.active_chat : ""} ${styles.chat}`}
                                    >
                                        <div className="image-container">
                                            <Image
                                                src={friend.image}
                                                alt="Friend profile image"
                                                fill
                                            />
                                        </div>
                                        <div>
                                            <h3>{friend.name}</h3>
                                            <p>{friend.lastMessage}</p>
                                        </div>
                                        <div>
                                            {friend.unreadMessages && (
                                                <span>
                                                    {friend.unreadMessages}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </>
                    )}
                </div>
                <div className={styles.session}>
                    <div className="image-container">
                        <Image
                            src={session?.image ?? ""}
                            alt="Profile Image"
                            className="image"
                            fill
                        />
                    </div>
                    <div>
                        <h3>{session?.name}</h3>
                        <p>{session?.email}</p>
                    </div>
                    <div
                        onClick={async () => {
                            await logout();
                            router.push("/login");
                        }}
                    >
                        <LogOut className={styles.logout_btn} />
                    </div>
                </div>
            </div>

            <div>{children}</div>
        </div>
    );
}
