import styles from "@/styles/Invitation.module.css";
import Image from "next/image";
import { useRef, useState } from "react";
import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function InvitationsSendPage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(0);
    const [data, setData] = useState<User | null>(null);

    async function search() {
        setLoading(1);
        try {
            const res = await fetchClient(
                `/users/friends/search?email=${inputRef.current?.value}`,
                "GET"
            );
            if (res.success) {
                toast.success(res.message);
                setData(res.data);
            } else {
                toast.error(res.message);
            }
        } catch (err: any) {
            console.error(err.message);
            toast.error("Something went wrong");
        } finally {
            setLoading(2);
        }
    }

    async function inviteFriend(id: string) {
        try {
            const res = await fetchClient(`/users/${id}/invite`, "POST");
            if (res.success) {
                toast.success(res.message);
                setLoading(0);
            } else {
                toast.error(res.message);
            }
        } catch (err: any) {
            console.error(err.message);
            toast.error("Something went wrong");
        }
    }

    return (
        <div className={styles.send}>
            <div>
                <h1>Send Invitation</h1>
                <div>
                    <label htmlFor="send-to">Email Address</label>
                    <input ref={inputRef} type="email" id="send-to" />
                </div>
                <button onClick={search}>Search</button>
            </div>
            <div className={styles.result_container}>
                {loading === 0 ? (
                    <h3>Nothing to show here</h3>
                ) : loading === 1 ? (
                    <Loader className={"loader"} />
                ) : loading === 2 && data !== null ? (
                    <>
                        <h3>Result</h3>
                        <div className={styles.result}>
                            <Image
                                src={data.image}
                                alt={""}
                                width={100}
                                height={95}
                            />
                            <div>
                                <h3>{data.name}</h3>
                                <p>{data.email}</p>
                            </div>
                            <div>
                                <button onClick={() => inviteFriend(data._id)}>
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <h3>Friend not found</h3>
                )}
            </div>
        </div>
    );
}
