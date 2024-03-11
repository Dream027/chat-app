"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSessionState } from "@/contexts/SessionProvider";
import { handleFetch } from "@/utils/handleFetch";

type FormFields = {
    name: string;
    email: string;
    password: string;
};

export default function RegisterForm({ state }: { state: boolean }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>();

    const router = useRouter();
    const { setSession } = useSessionState();

    const onSubmit = useCallback(async (data: FormFields) => {
        const res = await handleFetch("/users/register", "POST", data);
        if (res) {
            setSession(res.user);
            router.replace("/");
        }
    }, []);

    useEffect(() => {
        reset();
    }, [state]);

    return (
        <form className="auth_form" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h1>Register</h1>
                <div>
                    <div>
                        <label htmlFor="register_name">Name</label>
                        <input
                            type="text"
                            id="register_name"
                            {...register("name")}
                        />
                    </div>
                    <div>
                        <label htmlFor="register_email">Email Address</label>
                        <input
                            type="email"
                            id="register_email"
                            {...register("email")}
                        />
                    </div>
                    <div>
                        <label htmlFor="register_password">Password</label>
                        <input
                            type="password"
                            id="register_password"
                            {...register("password")}
                        />
                    </div>
                </div>
                <button disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="loader" />}
                    Create Account
                </button>
            </div>
        </form>
    );
}
