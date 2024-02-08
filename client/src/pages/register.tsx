import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Auth.module.css";
import Link from "next/link";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { SessionContext } from "@/contexts/SessionProvider";
import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const context = useContext(SessionContext);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData(e.currentTarget);
            const data = Object.fromEntries(formData.entries());
            const res = await fetchClient("/users/register", "POST", data);
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
                <title>Create an account</title>
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
                        <h1>Create your account</h1>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input type="text" name="name" id="name" />
                        </div>
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
                            Create Account
                        </button>
                    </form>
                    <div>
                        <p>Already have an account? </p>
                        <Link href="/login">Login</Link>
                    </div>
                </div>
            </div>
            ;
        </>
    );
}

RegisterPage.excludeMainLayout = true;
