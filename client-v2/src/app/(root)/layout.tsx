import SocketProvider from "@/contexts/SocketProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SocketProvider>{children}</SocketProvider>;
}
