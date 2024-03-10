import { fetchServer } from "@/utils/fetchServer";
import SidebarHeader from "./SidebarHeader";
import "./styles/Sidebar.css";
import Link from "next/link";
import { generateChatId } from "@/utils/generateChatId";
import Image from "next/image";
import { getServerSession } from "@/utils/getServerSession";
import { notFound } from "next/navigation";

export default async function Sidebar() {
    const chats = (await fetchServer("/friends", "GET")) as {
        groups: Group[];
        friends: User[];
    } | null;
    const session = await getServerSession();
    if (!session) {
        notFound();
    }

    return (
        <div>
            <SidebarHeader />
            <div className="sidebar_chat-container">
                {chats?.friends.length === 0 && chats.groups.length === 0 ? (
                    <div className="sidebar_placeholder">
                        No friends added yet
                    </div>
                ) : (
                    <>
                        <div className="sidebar_chats">
                            {chats?.friends.length === 0 ? null : (
                                <>
                                    <h3>Chats</h3>
                                    <div>
                                        {chats?.friends.map((friend) => (
                                            <UserChats
                                                key={friend._id}
                                                friend={friend}
                                                session={session}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="sidebar_chats">
                            {chats?.groups.length === 0 ? null : (
                                <>
                                    <h3>Groups</h3>
                                    <div>
                                        {chats?.groups.map((group) => (
                                            <GroupChats
                                                key={group._id}
                                                group={group}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function UserChats({ friend, session }: { session: User; friend: User }) {
    return (
        <Link href={`/chat/${generateChatId(session._id, friend._id)}`}>
            <Image
                src={friend.image}
                alt="friend logo"
                width={60}
                height={60}
            />
            <h3>{friend.name}</h3>
        </Link>
    );
}

function GroupChats({ group }: { group: Group }) {
    return (
        <Link href={`/groups/${group._id}/chat`}>
            <Image src={group.image} alt="friend logo" width={60} height={60} />
            <h3>{group.name}</h3>
        </Link>
    );
}
