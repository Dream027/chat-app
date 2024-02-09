import styles from "@/styles/Profile.module.css";
import { useSession } from "@/contexts/SessionProvider";
import Image from "next/image";

export default function ProfilePage() {
    const session = useSession();

    return (
        <div className={styles.main}>
            <div>
                <div className={styles.image}>
                    <Image src={session?.image!} alt={""} fill />
                </div>
                <div>
                    <h3>{session?.name}</h3>
                    <p>{session?.email}</p>
                </div>
            </div>
        </div>
    );
}
