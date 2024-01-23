import styles from "@/styles/auth.module.css";
import Link from "next/link";

export default function SignupForm() {
    return (
        <div className={styles.page}>
            <div className={`card ${styles.container}`}>
                <div className={styles.image_container}></div>
                <div>
                    <h2>Create to your account</h2>
                    <div>
                        <form>
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
