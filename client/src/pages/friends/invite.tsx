import styles from "@/styles/Invitation.module.css";
import Image from "next/image";

export default function InvitationsSendPage() {
    return (
        <div className={styles.send}>
            <div>
                <h1>Send Invitation</h1>
                <div>
                    <label htmlFor="send-to">Email Address</label>
                    <input type="email" id="send-to" />
                </div>
                <button>Search</button>
            </div>
            <div className={styles.result_container}>
                <h3>Results</h3>
                <div className={styles.result}>
                    <Image
                        src={"/avatar.png"}
                        alt={""}
                        width={100}
                        height={100}
                    />
                    <div>
                        <h3>test2</h3>
                        <p>test@gmail.com</p>
                    </div>
                    <div>
                        <button>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
