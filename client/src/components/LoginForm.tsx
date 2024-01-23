import styles from "@/styles/auth.module.css";
import Link from "next/link";
import { useForm } from "@/hooks/useForm";

export default function LoginForm() {
    const { handleSubmit } = useForm();

    return (
        <div className={styles.page}>
            <div className={`card ${styles.container}`}>
                <div className={styles.image_container}></div>
                <div>
                    <h2>Login in to your account</h2>
                    <div>
                        <form>
                            <div>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    required
                                />
                            </div>
                            <button className="btn-primary">Login</button>
                        </form>
                    </div>
                    <div className={styles.links}>
                        <p>Don&apos;t have an account?</p>
                        <Link href="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
