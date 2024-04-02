"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

type ChatHeaderProps = {
    image: string;
    name: string;
    link?: string;
};

export default function ChatHeader({ image, name, link }: ChatHeaderProps) {
    const router = useRouter();
    return (
        <div
            className="chat_header"
            onClick={() => {
                if (link) {
                    router.push(link);
                }
            }}
        >
            <Image
                src={image}
                alt="profile image"
                width={40}
                height={40}
                style={{ borderRadius: "50%" }}
            />
            <h3>{name}</h3>
        </div>
    );
}
