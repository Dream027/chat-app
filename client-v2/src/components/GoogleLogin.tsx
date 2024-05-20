"use client";

import Image from "next/image";
import "@/styles/Auth.css";
import { useCallback, useRef, useState } from "react";
import { handleFetch } from "@/utils/handleFetch";
import { useSessionState } from "@/contexts/SessionProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { SERVER_URL } from "@/utils/constants";

export default function GoogleLogin({
    searchParams: { email, image, name },
}: {
    searchParams: { name: string; email: string; image: string };
}) {
    const [showPasswordState, setShowPasswordState] = useState(true);
    const { setSession } = useSessionState();
    const router = useRouter();

    const showPassword = useCallback(() => {
        setShowPasswordState(false);
    }, []);

    const hidePassword = useCallback(() => {
        setShowPasswordState(true);
    }, []);

    const submitForm = useCallback(
        async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();

            try {
                const formData = new FormData(e.currentTarget);
                if (
                    !formData.get("password") ||
                    !formData.get("confirm-password")
                ) {
                    toast.error("Password is required");
                    return;
                }
                if (
                    formData.get("password") !==
                    formData.get("confirm-password")
                ) {
                    toast.error("Passwords do not match");
                    return;
                }

                const url = new URL(
                    "/api/users/login/google/create",
                    SERVER_URL
                );
                url.searchParams.append("email", email);
                url.searchParams.append("name", name);
                url.searchParams.append("image", image);

                const res = await fetch(url.toString(), {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        password: formData.get("password"),
                    }),
                }).then((r) => r.json());

                if (res.success) {
                    toast.success(res.message);
                    setSession(res.data);
                    router.push("/");
                } else {
                    toast.error(res.message);
                    console.error(res.message);
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong");
            }
        },
        [email, name, image, router, setSession]
    );

    return (
        <div className="margined-layout google_main">
            <div className="google_header">
                <h1>Create New Account</h1>
                <div>
                    <Image src={image} alt="" width={120} height={120} />
                    <div>
                        <h2>{name}</h2>
                        <p>{email}</p>
                    </div>
                </div>
            </div>
            <form className="google_form" onSubmit={submitForm}>
                <div>
                    <label htmlFor="password">Create Password</label>
                    <input
                        type={showPasswordState ? "password" : "text"}
                        id="password"
                        name="password"
                    />
                </div>
                <div>
                    <label htmlFor="c-password">Confirm Password</label>
                    <input
                        type={showPasswordState ? "password" : "text"}
                        id="c-password"
                        name="confirm-password"
                    />
                </div>
                <div className="align-center">
                    {showPasswordState ? (
                        <button
                            className="btn-secondary"
                            type="button"
                            onClick={showPassword}
                        >
                            Show Password
                        </button>
                    ) : (
                        <button
                            onClick={hidePassword}
                            className="btn-secondary"
                            type="button"
                        >
                            Hide Password
                        </button>
                    )}
                    <button>Create</button>
                </div>
            </form>
        </div>
    );
}
