import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import SocketProvider from "@/contexts/SocketProvider";
import "@/styles/Profile.css";
import "@/styles/Group.css";
import "@/styles/Chat.css";

export const metadata = {
    description: "ChatterUp: Where real-time connections thrive, effortlessly.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SocketProvider>
            <Navbar />
            <div className="sidebar">
                <Sidebar />
                {children}
            </div>
        </SocketProvider>
    );
}
