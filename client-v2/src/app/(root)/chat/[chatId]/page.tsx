import ChatHeader from "@/components/ChatHeader";
import InputUserChats from "@/components/InputUserChats";
import UserChats from "@/components/UserChats";
import { fetchServer } from "@/utils/fetchServer";
import { getServerSession } from "@/utils/getServerSession";
import { notFound } from "next/navigation";

export default async function ChatRoomPage({
    params: { chatId },
}: {
    params: { chatId: string };
}) {
    const session = await getServerSession();
    if (!session) notFound();
    const freindId = chatId.split("-").filter((id) => id !== session._id)[0];
    const friend = (await fetchServer(
        `/users/friends?id=${freindId}`,
        "GET"
    )) as User;
    if (!friend) notFound();

    const chats = await fetchServer(`/friends/chats?chatId=${chatId}`, "GET");
    if (!chats) {
        notFound();
    }

    return (
        <div>
            <ChatHeader image={friend.image} name={friend.name} />
            <UserChats chats={chats} />
            <InputUserChats friend={friend} />
        </div>
    );
}
