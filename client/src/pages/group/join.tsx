import { useRef, useState } from "react";
import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";
import styles from "@/styles/Invitation.module.css";
import { Loader } from "lucide-react";
import Image from "next/image";

export default function GroupJoinPage() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(0);
    const [data, setData] = useState<Group | null>(null);

    async function search() {
        setLoading(1);
        try {
            const res = await fetchClient(
                `/groups/search?name=${inputRef.current?.value}`,
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

    async function joinGroup(id: string) {
        try {
            const res = await fetchClient(`/groups/${id}/join`, "POST");
            console.log(res);
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
                <h1>Join Group</h1>
                <div>
                    <label htmlFor="send-to">Group Name</label>
                    <input ref={inputRef} type="text" id="send-to" />
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
                            </div>
                            <div>
                                <button onClick={() => joinGroup(data._id)}>
                                    Join
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <h3>Group not found</h3>
                )}
            </div>
        </div>
    );
}
