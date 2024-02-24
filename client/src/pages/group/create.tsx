import styles from "@/styles/GroupCreate.module.css";
import { useRef } from "react";
import toast from "react-hot-toast";
import { fetchClient } from "@/utils/fetchClient";
import { useRouter } from "next/router";

export default function CreateGroupPage() {
    const nameRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLTextAreaElement>(null);
    const router = useRouter();

    async function createGroup() {
        try {
            const res = await fetchClient("/groups/create", "POST", {
                name: nameRef.current?.value,
                description: descRef.current?.value,
            });
            console.log(res.data);
            if (res.success) {
                toast.success(res.message);
                router.push(`/group/${res.data._id}`);
                router.reload();
            } else {
                toast.error(res.message);
            }
        } catch (e: any) {
            console.error(e.message);
            toast.error("Something went wrong");
        }
    }

    return (
        <div className={styles.main}>
            <div>
                <div>
                    <label htmlFor={"name"}>Group name</label>
                    <input
                        ref={nameRef}
                        type={"text"}
                        id={"name"}
                        name={"name"}
                    />
                </div>
                <div>
                    <label htmlFor={"name"}>Group Description</label>
                    <textarea
                        ref={descRef}
                        id={"name"}
                        placeholder={"Description"}
                    />
                </div>
                <div>
                    <button onClick={createGroup}>Create Group</button>
                </div>
            </div>
        </div>
    );
}
