"use client";

import Alert from "@/components/Alert";
import { useSessionState } from "@/contexts/SessionProvider";
import { SERVER_URL } from "@/utils/constants";
import { handleFetch, handleFileUpload } from "@/utils/handleFetch";
import { Camera, PenBox } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export default function UserProfile({ session }: { session: User }) {
    const [showChangePasswordAlert, setShowChangePasswordAlert] =
        useState(false);
    const [showChangeProfilePicDialog, setShowChangeProfilePicDialog] =
        useState(false);
    const [email, setEmail] = useState(session.email);
    const [name, setName] = useState(session.name);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const { setSession } = useSessionState();

    const changePassword = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const data = {
                oldPassword: formData.get("old-password"),
                newPassword: formData.get("new-password"),
            };
            const res = await handleFetch(
                "/users/profile/password",
                "PUT",
                data
            );
            if (res) {
                setShowChangePasswordAlert(false);
            }
        },
        []
    );
    const updateProfile = useCallback(async () => {
        if (!name || !email) return;
        if (name === session.name && email === session.email) {
            router.push("/");
            return;
        }

        const map: { email?: string; name?: string } = {};
        if (name !== session.name) {
            map["name"] = name;
        }
        if (email !== session.email) {
            map["email"] = email;
        }
        const res = (await handleFetch("/users/profile", "PUT", map)) as {
            name?: string;
            email?: string;
        };
        if (res) {
            setSession({
                ...session,
                ...res,
            });
            router.push("/");
        }
    }, [name, email, router, session, setSession]);

    const changeProfilePic = useCallback(async () => {
        if (!file) return;
        const data = new FormData();
        data.append("profilePicture", file);
        const res = await handleFileUpload("/api/users/profile/image", data);

        if (res) {
            setSession({
                ...session,
                image: res.image,
            });
            router.refresh();
            setShowChangeProfilePicDialog(false);
        }
    }, [file, router, session, setSession]);

    return (
        <>
            <div>
                <div className="align-center">
                    <button
                        className="btn-secondary"
                        onClick={() => setShowChangePasswordAlert(true)}
                    >
                        <PenBox />
                        Change Password
                    </button>
                    <button onClick={() => setShowChangeProfilePicDialog(true)}>
                        <Camera />
                        Change Profile Picture
                    </button>
                </div>
                <div style={{ marginTop: "4rem", maxWidth: "600px" }}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={updateProfile}
                        style={{ marginTop: "1.5rem" }}
                    >
                        Save
                    </button>
                </div>
            </div>

            <>
                <Alert active={showChangePasswordAlert}>
                    <h1>Change Password</h1>
                    <form onSubmit={changePassword}>
                        <div>
                            <label htmlFor="old-password">Old Password</label>
                            <input
                                type="password"
                                id="old-password"
                                name="old-password"
                            />
                        </div>
                        <div>
                            <label htmlFor="new-password">New Password</label>
                            <input
                                type="password"
                                id="new-password"
                                name="new-password"
                            />
                        </div>
                        <div
                            className="align-center"
                            style={{ marginTop: "2rem" }}
                        >
                            <button
                                onClick={() =>
                                    setShowChangePasswordAlert(false)
                                }
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                            <button>Change Password</button>
                        </div>
                    </form>
                </Alert>
                <Alert active={showChangeProfilePicDialog}>
                    <h1 style={{ marginBottom: "2rem" }}>
                        Change Profile Picture
                    </h1>
                    <div>
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={(e) => {
                                    if (!e.target.files?.length) return;
                                    setFile(e.target.files[0]);
                                }}
                            />
                            <div>
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    {file ? (
                                        <Image
                                            src={URL.createObjectURL(file)}
                                            alt=""
                                            width={50}
                                            height={50}
                                            style={{ borderRadius: "0" }}
                                        />
                                    ) : (
                                        "Chose an image to upload"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className="align-center"
                            style={{ marginTop: "2rem" }}
                        >
                            <button
                                className="btn-secondary"
                                onClick={() =>
                                    setShowChangeProfilePicDialog(false)
                                }
                            >
                                Cancel
                            </button>
                            <button onClick={changeProfilePic}>Save</button>
                        </div>
                    </div>
                </Alert>
            </>
        </>
    );
}
