import { useRouter } from "next/router";
import styles from "@/styles/GoogleLogin.module.css";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchClient } from "@/utils/fetchClient";
import toast from "react-hot-toast";
import { useSessionState } from "@/contexts/SessionProvider";

export default function GoogleLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [session, setSession] = useSessionState();

    useEffect(() => {
        console.log("hey");
        if (!router.query.email && !router.query.name) return;

        setEmail(router.query.email as string);
        setName(router.query.name as string);
    }, [router.query]);

    async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            const url = new URL(
                "/api/users/login/google/create",
                process.env.NEXT_PUBLIC_SERVER_URL
            );
            url.searchParams.append("email", email);
            url.searchParams.append("name", name);
            url.searchParams.append("image", router.query.image as string);

            const res = await fetch(url.toString(), {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            }).then((r) => r.json());

            if (res.success) {
                toast.success("Account created successfully");
                setSession(res.data);
                router.push("/");
            } else {
                toast.error(res.message);
                console.error(res.message);
            }
        } catch (e: any) {
            toast.error(e.message || "Failed to create account");
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <Image
                            src={router.query.image as string}
                            alt="User image"
                            height={130}
                            width={130}
                        />
                        <h2>{name}</h2>
                    </div>
                    <div>
                        <button className="btn-secondary">
                            Change Profile Picture
                        </button>
                    </div>
                </div>

                <div className={styles.body}>
                    <form onSubmit={submitHandler}>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <button
                                className="btn-secondary"
                                onClick={() => router.replace("/signin")}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button>Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

GoogleLoginPage.excludeMainLayout = true;
