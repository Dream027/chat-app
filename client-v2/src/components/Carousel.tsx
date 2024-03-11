import { ChevronDownIcon, ChevronUp } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction } from "react";

type CarouselProps = {
    children: ReactNode;
    open: boolean;
    title: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Carousel({
    children,
    open,
    title,
    setOpen,
}: CarouselProps) {
    return (
        <div className="carousel">
            <div onClick={() => setOpen(!open)}>
                <h3>{title}</h3>
                {open ? <ChevronUp /> : <ChevronDownIcon />}
            </div>
            <div
                className={`carousel_content ${open ? "carousel_active" : ""}`}
            >
                {children}
            </div>
        </div>
    );
}
