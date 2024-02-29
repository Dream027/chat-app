import { ForwardedRef, forwardRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { fetchClient } from "@/utils/fetchClient";
import { useRouter } from "next/router";
import { useSessionState } from "@/contexts/SessionProvider";
import { GoogleLogin } from "@react-oauth/google";

const schema = z.object({
    email: z.string().email("Email must be valid"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormFields = z.infer<typeof schema>;

const LoginForm = forwardRef(function LoginForm(
    props,
    ref: ForwardedRef<HTMLFormElement>
) {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<FormFields>({ resolver: zodResolver(schema) });
    const router = useRouter();
    const [_, setSession] = useSessionState();
    const [toggle, setToggle] = useState({ email: false, password: false });

    async function onSubmit(data: FormFields) {
        try {
            const res = await fetchClient("/users/login", "POST", data);
            if (res.success) {
                toast.success(res.message);
                router.replace("/");
                setSession(res.data.user);
            } else {
                toast.error(res.message);
            }
        } catch (e) {
            toast.error("Something went wrong");
            console.error(e);
        }
    }

    async function loginWithGoogle() {
        window.open("http://localhost:4000/api/users/callback/google", "_self");
    }

    return (
        <form
            {...props}
            ref={ref}
            onSubmit={handleSubmit(onSubmit)}
            className="form"
        >
            <h1>Login</h1>
            <div>
                <div className={"input-container"}>
                    <label className={"label"} htmlFor="login-email">
                        Email
                    </label>
                    <input
                        type="text"
                        id="login-email"
                        {...register("email")}
                        onChange={(e) => {
                            setToggle({
                                ...toggle,
                                email: !!e.currentTarget.value,
                            });
                        }}
                        className={toggle.email ? "toggle" : ""}
                    />
                    {errors.email ? (
                        <div className={"input-error"}>
                            {errors.email.message}
                        </div>
                    ) : null}
                </div>
                <div className={"input-container"}>
                    <label className={"label"} htmlFor="login-password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="login-password"
                        {...register("password")}
                        onChange={(e) => {
                            setToggle({
                                ...toggle,
                                password: !!e.currentTarget.value,
                            });
                        }}
                        className={toggle.password ? "toggle" : ""}
                    />
                    {errors.password ? (
                        <div className={"input-error"}>
                            {errors.password.message}
                        </div>
                    ) : null}
                </div>
                <button disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className={"loader"} />} Login
                </button>
            </div>

            <div>
                <div></div>
                <div>or</div>
                <div></div>
            </div>
            <div>
                <button type="button" onClick={loginWithGoogle}>
                    Login with google
                </button>
            </div>
        </form>
    );
});

export default LoginForm;
