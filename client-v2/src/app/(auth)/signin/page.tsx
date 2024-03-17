import "@/styles/Auth.css";
import Signin from "../_components/Signin";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login to your account",
};

export default function SigninPage() {
    return (
        <div className="auth_main">
            <Signin />
        </div>
    );
}
