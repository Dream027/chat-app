import { LogOut } from "lucide-react";
import { SessionContext, useSession } from "@/contexts/SessionProvider";
import styles from "./styles/Sidebar.module.css";
import Image from "next/image";
import { useContext } from "react";
import { useRouter } from "next/router";
import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";

export default function Sidebar() {
    const context = useContext(SessionContext);
    const session = context?.session;
    const router = useRouter();

    async function handleLogout() {
        try {
            const res = await fetchClient("/users/logout", "POST");
            if (res.success) {
                toast.success(res.message);
                router.replace("/login");
            } else {
                toast.error(res.message);
            }
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.session_container}>
                <div>
                    <div
                        className={styles.session_image}
                        onClick={() => router.push("/profile")}
                    >
                        <Image src={session?.image!} alt={""} fill />
                    </div>
                    <div>
                        <div>
                            <h4>{session?.name}</h4>
                            <p>{session?.email}</p>
                        </div>
                        <div className={styles.logout} onClick={handleLogout}>
                            <LogOut />
                        </div>
                    </div>
                </div>
            </div>

            {/*Chats*/}
            <div></div>
        </div>
    );
}
