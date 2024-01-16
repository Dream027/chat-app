"use client";

import styles from "./styles/auth.module.css";
import Link from "next/link";
import { getSession } from "@/utils/session";
import { useForm } from "@/hooks/useForm";
import { register } from "@/utils/auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const { handleSubmit, pending } = useForm(handleRegister);
    const router = useRouter();

    async function handleRegister(data: {
        name: string;
        email: string;
        password: string;
    }) {
        const success = await register(data);
        if (success) {
            router.push("/login");
        }
    }

    return (
        <div className={styles.page}>
            <div className="card">
                <div></div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <h1>Create your account</h1>
                        <div>
                            <div>
                                <label htmlFor="name">Username</label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Username"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    required
                                />
                            </div>
                            <button disabled={pending}>
                                {pending && (
                                    <Loader2 className={styles.loader} />
                                )}
                                Create Account
                            </button>
                        </div>

                        <div>
                            <p>Already have account?</p>
                            <Link href="/login" className="link">
                                Login to existing account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
