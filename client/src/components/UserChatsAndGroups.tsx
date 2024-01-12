"use client";

export default function UserChatsAndGroups() {
    return (
        <div className="">
            <div className="grid grid-rows-[auto_1fr]">
                <p className="text-lg font-semibold text-gray-400">Chats</p>
                <div className="flex max-h-[70vh] w-full flex-col items-start justify-center gap-2 overflow-y-auto"></div>
            </div>
        </div>
    );
}
