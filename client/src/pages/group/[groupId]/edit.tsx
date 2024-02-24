import { fetchClient } from "@/utils/fetchClient";
import Image from "next/image";
import styles from "@/styles/Profile.module.css";
import { Camera } from "lucide-react";
import AlertDialog from "@/components/AlertDialog";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export default function GroupEditPage({ group }: { group: Group }) {
    const descRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const [showChangeGroupPicAlert, setSetshowChangeGroupPicAlert] =
        useState(false);
    const [groupState, setGroup] = useState(group);

    async function changeProfile() {
        try {
            if (
                nameRef.current?.value === "" &&
                descRef.current?.value === ""
            ) {
                throw new Error("All values are empty");
            }

            const body = new Map();
            if (
                descRef.current?.value !== groupState.description &&
                descRef.current?.value !== ""
            ) {
                body.set("description", descRef.current?.value);
            }
            if (
                nameRef.current?.value !== groupState.name &&
                nameRef.current?.value !== ""
            ) {
                body.set("name", nameRef.current?.value);
            }

            const res = await fetchClient(
                `/groups/${group._id}/profile`,
                "PUT",
                Object.fromEntries(body.entries())
            );
            if (res.success) {
                toast.success(res.message);
                setGroup({ ...groupState, ...res.data });
            } else {
                toast.error(res.message);
            }
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
            console.error(e.message);
        }
    }

    async function updateGroupPicture(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);
            const res = await fetch(`/api/groups/${group._id}/image`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            }).then((data) => data.json());
            if (res.success) {
                toast.success(res.message);
                setSetshowChangeGroupPicAlert(false);
                setGroup((prev) => {
                    return { ...prev, image: res.data.image };
                });
            } else {
                toast.error(res.message);
            }
        } catch (e: any) {
            console.error(e.message);
            toast.error("Something went wrong");
        }
    }

    return (
        <>
            <div className={styles.main}>
                <div>
                    <h1>{groupState.name}</h1>
                    <div className={styles.session}>
                        <div>
                            <div className={styles.image}>
                                <Image src={groupState.image} alt={""} fill />
                            </div>
                            <div>
                                <p>{groupState.description}</p>
                            </div>
                        </div>
                        <div>
                            <button
                                className={"btn-secondary"}
                                onClick={() => {
                                    setSetshowChangeGroupPicAlert(true);
                                }}
                            >
                                <Camera /> Change group picture
                            </button>
                        </div>
                        <div className={styles.form}>
                            <div>
                                <label htmlFor="name">Name</label>
                                <input
                                    ref={nameRef}
                                    type="text"
                                    id="name"
                                    placeholder={group?.name}
                                />
                            </div>
                            <div>
                                <label htmlFor="description">Descrition</label>
                                <input
                                    ref={descRef}
                                    type="text"
                                    id="description"
                                    placeholder={group.description}
                                />
                            </div>
                            <div>
                                <button onClick={changeProfile}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AlertDialog active={showChangeGroupPicAlert}>
                <form
                    style={{ minWidth: "400px" }}
                    onSubmit={updateGroupPicture}
                >
                    <h2>Change Group Picture</h2>
                    <div>
                        <input
                            type="file"
                            id="groupPicture"
                            name="groupPicture"
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            type={"button"}
                            className={"btn-secondary"}
                            onClick={() => setSetshowChangeGroupPicAlert(false)}
                        >
                            Cancel
                        </button>
                        <button>Change</button>
                    </div>
                </form>
            </AlertDialog>
        </>
    );
}

export async function getServerSideProps(context: any) {
    const { groupId } = context.query;
    const res = await fetchClient(`/groups?id=${groupId}`, "GET", null, {
        headers: {
            Authorization: `Bearer ${context.req.cookies.token}`,
        },
    });

    if (!res?.success) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            group: res.data,
        },
    };
}
