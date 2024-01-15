"use client";

import styles from "./styles/auth.module.css";
import Link from "next/link";
import { useForm } from "@/hooks/useForm";
import { login } from "@/utils/auth";
import { Loader2 } from "lucide-react";

export default function LoginForm() {
    const { handleSubmit, pending } = useForm(login);

    return (
        <div className={styles.page}>
            <div className="card">
                <div></div>
                <div>
                    <form onSubmit={handleSubmit}>
                        <h1>Login to your account</h1>
                        <div>
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
                                Login
                            </button>
                        </div>

                        <div>
                            <p>Don&apos;t have account?</p>
                            <Link href="/register" className="link">
                                Create Account
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
