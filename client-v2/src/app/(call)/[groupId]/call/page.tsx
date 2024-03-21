import SocketProvider from "@/contexts/SocketProvider";
import "@/styles/Call.css";
import GroupCall from "../../GroupCall";

export default function GroupCallPage() {
    return (
        <SocketProvider>
            <GroupCall />
        </SocketProvider>
    );
}
