import styles from "@/styles/Profile.module.css";
import { useSession, useSessionState } from "@/contexts/SessionProvider";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { fetchClient } from "@/utils/fetchClient";

export default function ProfilePage() {
    const [session, setSession] = useSessionState();
    const emailRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);

    async function updateProfile() {
        if (!setSession || !session) return;
        try {
            const body = new Map();
            if (
                emailRef.current?.value !== session?.email &&
                emailRef.current?.value !== ""
            ) {
                body.set("email", emailRef.current?.value);
            }
            if (
                nameRef.current?.value !== session?.name &&
                nameRef.current?.value !== ""
            ) {
                body.set("name", nameRef.current?.value);
            }

            if (
                nameRef.current?.value === "" &&
                emailRef.current?.value === ""
            ) {
                throw new Error("All values are empty");
            }

            const res = await fetchClient(
                "/users/profile",
                "PUT",
                Object.fromEntries(body.entries())
            );
            if (res.success) {
                toast.success(res.message);

                // Todo: fix this
                // setSession(...session, ...res.data);
            } else {
                toast.error(res.message);
            }
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
            console.error(e.message);
        }
    }

    async function changePassword() {}

    return (
        <div className={styles.main}>
            <div>
                <h1>My Profile</h1>
                <div className={styles.session}>
                    <div>
                        <div className={styles.image}>
                            <Image src={session?.image!} alt={""} fill />
                        </div>
                        <div>
                            <h3>{session?.name}</h3>
                            <p>{session?.email}</p>
                        </div>
                    </div>
                    <div>
                        <button className={"btn-secondary"}>
                            <Camera /> Change profile picture
                        </button>
                    </div>
                    <div className={styles.form}>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                ref={nameRef}
                                type="text"
                                id="name"
                                placeholder={session?.name}
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                ref={emailRef}
                                type="email"
                                id="email"
                                placeholder={session?.email}
                            />
                        </div>
                        <div>
                            <button
                                onClick={changePassword}
                                className={"btn-secondary"}
                            >
                                Change Password
                            </button>
                            <button onClick={updateProfile}>Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
