import SidebarUserChat from "@/components/SidebarUserChat";
import { User, UserPlus } from "lucide-react";
import Link from "next/link";
import SidebarUserSession from "@/components/SidebarUserSession";
import UserChatsAndGroups from "@/components/UserChatsAndGroups";

export default function SidebarChatView() {
    return (
        <div className="grid grid-rows-[auto_1fr] p-4">
            <div className="grid gap-2">
                <p className="text-lg font-semibold text-gray-400">Overview</p>
                <div>
                    <Link
                        href="/friends/requests"
                        className="text-gray-400 hover:text-sky-400"
                    >
                        <div className="flex items-center justify-start gap-4 p-1">
                            <UserPlus />
                            <p>Add Friend</p>
                        </div>
                    </Link>
                    <Link
                        href="/friends/invite"
                        className="text-gray-400 hover:text-sky-400"
                    >
                        <div className="flex items-center justify-start gap-4 p-1">
                            <User />
                            <p>Invite Friends</p>
                        </div>
                    </Link>
                </div>
            </div>

            <div className="mt-4 grid gap-2">
                <div className="grid grid-rows-[1fr_auto] gap-4">
                    <UserChatsAndGroups />

                    <div className="">
                        <SidebarUserSession />
                    </div>
                </div>
            </div>
        </div>
    );
}
