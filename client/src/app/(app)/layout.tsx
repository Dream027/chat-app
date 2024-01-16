import styles from "./layout.module.css";
import { UserRoundPlus, UsersRound } from "lucide-react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "@/utils/getServerSession";
import { notFound } from "next/navigation";

type AppLayoutProps = {
    children: React.ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
    const session = await getServerSession();
    if (!session) {
        notFound();
    }

    return (
        <main className={styles.main}>
            <div>
                <div className={styles.overview}>
                    <h4>Overview</h4>
                    <div>
                        <Link href="/add-friends" className={styles.link}>
                            <UserRoundPlus />
                            <p>Add Friends</p>
                        </Link>
                        <Link href="/groups" className={styles.link}>
                            <UsersRound />
                            <p>Manage Groups</p>
                        </Link>
                    </div>
                </div>

                <div className={styles.chats}></div>

                <div className={styles.session}>
                    <div></div>
                    <div>
                        <h3>{session.name}</h3>
                        <p>{session.email}</p>
                    </div>
                    <LogoutButton />
                </div>
            </div>

            <div>{children}</div>
        </main>
    );
}
