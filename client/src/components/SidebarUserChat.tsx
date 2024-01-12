import Image from "next/image";

type SidebarUserChatProps = {
    image: string;
    name: string;
    lastMessage: string;
    lastSeen: number;
    unreadMessages: number;
};

export default function SidebarUserChat({
    image,
    lastMessage,
    unreadMessages,
    lastSeen,
    name,
}: SidebarUserChatProps) {
    return (
        <div className="flex cursor-pointer items-center justify-between gap-4 rounded-lg p-4 hover:bg-sky-50">
            <div>
                {/*<Image src={image} alt="Profile Image" width={40} height={40} />*/}
                <div className="h-12 w-12 rounded-lg bg-sky-200"></div>
            </div>
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-gray-600">{name}</p>
                    <p className="text-sm text-gray-500">{lastSeen}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                    <p className="line-clamp-1 text-sm text-gray-500">
                        {lastMessage}
                    </p>
                    {unreadMessages > 0 && (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-300 p-2">
                            <p className="text-sm text-white">
                                {unreadMessages}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
