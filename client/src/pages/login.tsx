import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Auth.module.css";
import Link from "next/link";
import { useContext, useState } from "react";
import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { SessionContext } from "@/contexts/SessionProvider";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const context = useContext(SessionContext);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const res = await fetchClient("/users/login", "POST", data);
            if (res.success) {
                toast.success(res.message);
                context?.setSession(res.data.user);
                router.replace("/");
            } else {
                toast.error(res.message || "Something went wrong");
            }
        } catch (e: any) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Login to your account</title>
            </Head>
            <div className={styles.main}>
                <div className={styles.card}>
                    <div>
                        <Image
                            src={"/logo.jpeg"}
                            alt={""}
                            width={200}
                            height={110}
                        />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <h1>Login to your account</h1>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                            />
                        </div>
                        <button disabled={loading}>
                            {loading ? <Loader2 className={"loader"} /> : null}
                            Login
                        </button>
                    </form>
                    <div>
                        <p>Don&apos;t have an account? </p>
                        <Link href="/register">Register</Link>
                    </div>
                </div>
            </div>
        </>
    );
}

LoginPage.excludeMainLayout = true;
