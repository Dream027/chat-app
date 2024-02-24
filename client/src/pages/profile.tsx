import styles from "@/styles/Profile.module.css";
import { useSessionState } from "@/contexts/SessionProvider";
import Image from "next/image";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { fetchClient } from "@/utils/fetchClient";
import AlertDialog from "@/components/AlertDialog";

export default function ProfilePage() {
    const [session, setSession] = useSessionState();
    const emailRef = useRef<HTMLInputElement>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    const [showChangePasswordDialog, setShowChangePasswordDialog] =
        useState(false);
    const [showChangeProfilePicDialog, setShowChangeProfilePicDialog] =
        useState(false);

    async function updateProfile() {
        if (!setSession || !session) return;
        try {
            if (
                nameRef.current?.value === "" &&
                emailRef.current?.value === ""
            ) {
                throw new Error("All values are empty");
            }

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

            const res = await fetchClient(
                "/users/profile",
                "PUT",
                Object.fromEntries(body.entries())
            );
            if (res.success) {
                toast.success(res.message);
                setSession({ ...session, ...res.data });
            } else {
                toast.error(res.message);
            }
        } catch (e: any) {
            toast.error(e.message || "Something went wrong");
            console.error(e.message);
        }
    }

    async function changePassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const res = await fetchClient(
                "/users/profile/password",
                "PUT",
                data
            );
            if (res.success) {
                toast.success(res.message);
                setShowChangePasswordDialog(false);
            } else {
                toast.error(res.message);
            }
        } catch (e: any) {
            console.error(e.message);
            toast.error("Something went wrong");
        }
    }

    async function changeProfile(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            const formData = new FormData(e.currentTarget);
            const res = await fetch("/api/users/profile/image", {
                method: "PUT",
                credentials: "include",
                body: formData,
            }).then((data) => data.json());
            if (res.success) {
                toast.success(res.message);
                setShowChangePasswordDialog(false);
                setSession({ ...session, image: res.data.image });
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
            {" "}
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
                            <button
                                className={"btn-secondary"}
                                onClick={() =>
                                    setShowChangeProfilePicDialog(true)
                                }
                            >
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
                                    className={"btn-secondary"}
                                    onClick={() =>
                                        setShowChangePasswordDialog(true)
                                    }
                                >
                                    Change Password
                                </button>
                                <button onClick={updateProfile}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AlertDialog active={showChangePasswordDialog}>
                <form style={{ minWidth: "400px" }} onSubmit={changePassword}>
                    <h2>Change Password</h2>
                    <div>
                        <input
                            type="password"
                            placeholder="Old Password"
                            id="oldPassword"
                            name="oldPassword"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            id="newPassword"
                            name="newPassword"
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            type={"button"}
                            className={"btn-secondary"}
                            onClick={() => setShowChangePasswordDialog(false)}
                        >
                            Cancel
                        </button>
                        <button>Save</button>
                    </div>
                </form>
            </AlertDialog>
            <AlertDialog active={showChangeProfilePicDialog}>
                <form style={{ minWidth: "400px" }} onSubmit={changeProfile}>
                    <h2>Change Profile Picture</h2>
                    <div>
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                        />
                    </div>
                    <div style={{ display: "flex", gap: "0.75rem" }}>
                        <button
                            type={"button"}
                            className={"btn-secondary"}
                            onClick={() => setShowChangeProfilePicDialog(false)}
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
