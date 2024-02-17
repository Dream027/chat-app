import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import Head from "next/head";
import styles from "@/styles/Auth.module.css";
import { useEffect, useRef, useState } from "react";

export default function SigninPage() {
    const [showLoginForm, setShowLoginForm] = useState(false);
    const loginFormRef = useRef<HTMLFormElement>(null);
    const registerFormRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        loginFormRef.current?.reset();
        registerFormRef.current?.reset();

        document.title = !showLoginForm
            ? "Login to your account"
            : "Create your account";
    }, [showLoginForm]);

    return (
        <>
            <Head>
                <title>Login to your account</title>
            </Head>
            <div className={styles.main}>
                <div
                    className={`${showLoginForm ? styles.active_login : ""} ${styles.card}`}
                >
                    <div className={styles.form_container}>
                        <LoginForm ref={loginFormRef} />
                    </div>
                    <div className={styles.form_container}>
                        <RegisterForm ref={registerFormRef} />
                    </div>

                    <div className={styles.float}>
                        <div className={styles.floating_container}>
                            <h1>Login to your account</h1>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Accusantium aperiam at
                                consequatur delectus eius eum numquam odit,
                                officiis reiciendis reprehenderit.
                            </p>
                            <div>
                                <p>Don&apos;t have account</p>
                                <button
                                    className={"btn-outlined"}
                                    onClick={() =>
                                        setShowLoginForm(!showLoginForm)
                                    }
                                >
                                    Create account
                                </button>
                            </div>
                        </div>

                        <div className={styles.floating_container}>
                            <h1>Create your account</h1>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Accusamus asperiores corporis
                                cumque cupiditate error in!
                            </p>
                            <div>
                                <p>Already have account</p>
                                <button
                                    className={"btn-outlined"}
                                    onClick={() =>
                                        setShowLoginForm(!showLoginForm)
                                    }
                                >
                                    Login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

SigninPage.excludeMainLayout = true;
