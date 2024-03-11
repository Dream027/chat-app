"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { fetchClient } from "@/utils/fetchClient";
import { useRouter } from "next/navigation";
import { useSessionState } from "@/contexts/SessionProvider";
import Image from "next/image";
import { handleFetch } from "@/utils/handleFetch";
import { SERVER_URL } from "@/utils/constants";

type FormFields = {
    email: string;
    password: string;
};

export default function LoginForm({ state }: { state: boolean }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>();
    const router = useRouter();
    const { setSession } = useSessionState();

    const onSubmit = useCallback(
        async (data: FormFields) => {
            const res = await handleFetch("/users/login", "POST", data);
            if (res) {
                setSession(res.user);
                router.replace("/");
            }
        },
        [router, setSession]
    );

    useEffect(() => {
        reset();
    }, [state]);

    return (
        <form className="auth_form" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h1>Login</h1>
                <div>
                    <div>
                        <label htmlFor="login_email">Email Address</label>
                        <input
                            type="email"
                            id="login_email"
                            {...register("email")}
                        />
                    </div>
                    <div>
                        <label htmlFor="login_password">Password</label>
                        <input
                            type="password"
                            id="login_password"
                            {...register("password")}
                        />
                    </div>
                </div>
                <button disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="loader" />}
                    Login
                </button>
            </div>
            <div className="auth_or">
                <div></div>
                <div>or</div>
                <div></div>
            </div>
            <button
                type="button"
                className="auth_google"
                onClick={() => {
                    window.open(
                        `${SERVER_URL}/api/users/callback/google`,
                        "_self"
                    );
                }}
            >
                <Image src="/google.svg" alt="google" width={24} height={24} />
                Continue with Google
            </button>
        </form>
    );
}
