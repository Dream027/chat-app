import Image from "next/image";
import { cn } from "@/utils/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode;
    title?: string;
    logo?: string;
};

export default function Card({ logo, title, children, className }: CardProps) {
    return (
        <div
            className={cn(
                "rounded border border-gray-100 bg-white p-8 shadow-md",
                className,
            )}
        >
            <div className="mb-4 grid place-items-center gap-8">
                {logo && (
                    <div className="relative h-24 w-44">
                        <Image src={logo} alt="Logo" fill />
                    </div>
                )}
                {title && (
                    <div className="mb-4 text-center text-2xl font-bold">
                        {title}
                    </div>
                )}
            </div>
            <div>{children}</div>
        </div>
    );
}
