import SocketProvider from "@/contexts/SocketProvider";
import "@/styles/Call.css";

export default function CallLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SocketProvider>{children}</SocketProvider>;
}
