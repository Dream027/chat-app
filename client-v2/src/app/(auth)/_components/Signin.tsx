"use client";

import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function Signin() {
    const [showLoginForm, setShowLoginForm] = useState(true);

    useEffect(() => {
        document.title = showLoginForm
            ? "Login to your account"
            : "Create your account";
    }, [showLoginForm]);

    return (
        <div
            className={`auth_card ${
                !showLoginForm ? "auth_show-register" : ""
            }`}
        >
            <div>
                <LoginForm state={showLoginForm} />
                <RegisterForm state={showLoginForm} />
            </div>
            <div className="auth_float">
                <div>
                    <h1>Login to your existing account</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Voluptas at asperiores maiores.
                    </p>
                    <div>
                        <p>Don&apos;t have an account?</p>
                        <button
                            onClick={() => setShowLoginForm(!showLoginForm)}
                        >
                            Register
                        </button>
                    </div>
                </div>
                <div>
                    <h1>Create your new account</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Temporibus nobis omnis facere?
                    </p>
                    <div>
                        <p>Already have an account?</p>
                        <button
                            onClick={() => setShowLoginForm(!showLoginForm)}
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
