import styles from "@/styles/auth.module.css";
import Link from "next/link";
import { useForm } from "@/hooks/useForm";
import { register } from "@/utils/auth";
import { useRouter } from "next/router";

export default function SignupForm() {
    const { handleSubmit } = useForm();
    const router = useRouter();

    async function handleSignup(data?: any) {
        const success = await register(data);
        if (success) {
            router.push("/login");
        }
    }

    return (
        <div className={styles.page}>
            <div className={`card ${styles.container}`}>
                <div className={styles.image_container}></div>
                <div>
                    <h2>Create to your account</h2>
                    <div>
                        <form onSubmit={handleSubmit(handleSignup)}>
                            <div>
                                <label htmlFor="name">Username</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                />
                            </div>
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
                            <button className="btn-primary">
                                Create Account
                            </button>
                        </form>
                    </div>
                    <div className={styles.links}>
                        <p>Already have an account?</p>
                        <Link href="/login">Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
