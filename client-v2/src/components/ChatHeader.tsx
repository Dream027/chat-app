import Image from "next/image";

type ChatHeaderProps = {
    image: string;
    name: string;
};

export default function ChatHeader({ image, name }: ChatHeaderProps) {
    return (
        <div className="chat_header">
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
