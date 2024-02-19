import { ForwardedRef, forwardRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { fetchClient } from "@/utils/fetchClient";
import { useRouter } from "next/router";
import { useSessionState } from "@/contexts/SessionProvider";

const schema = z.object({
    firstName: z.string().min(1, "This cannot be empty"),
    secondName: z.string().min(1, "This cannot be empty"),
    email: z.string().email("Email must be valid"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

type FormFields = z.infer<typeof schema>;

const RegisterForm = forwardRef(function RegisterForm(
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
    const [toggle, setToggle] = useState({
        email: false,
        password: false,
        firstName: false,
        secondName: false,
    });

    async function onSubmit(data: FormFields) {
        try {
            console.log(data);
            const res = await fetchClient("/users/register", "POST", {
                name: `${data.firstName} ${data.secondName}`,
                email: data.email,
                password: data.password,
            });
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

    return (
        <form {...props} ref={ref} onSubmit={handleSubmit(onSubmit)}>
            <h1>Register</h1>
            <div>
                <div className={"second-input"}>
                    <div className={"input-container"}>
                        <label
                            className={"label"}
                            htmlFor="register-first-name"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="register-first-name"
                            {...register("firstName")}
                            onChange={(e) => {
                                setToggle({
                                    ...toggle,
                                    firstName: !!e.currentTarget.value,
                                });
                            }}
                            className={toggle.firstName ? "toggle" : ""}
                        />
                        {errors.firstName ? (
                            <div className={"input-error"}>
                                {errors.firstName.message}
                            </div>
                        ) : null}
                    </div>
                    <div className={"input-container"}>
                        <label
                            className={"label"}
                            htmlFor="register-second-name"
                        >
                            Second Name
                        </label>
                        <input
                            type="text"
                            id="register-second-name"
                            {...register("secondName")}
                            onChange={(e) => {
                                setToggle({
                                    ...toggle,
                                    secondName: !!e.currentTarget.value,
                                });
                            }}
                            className={toggle.secondName ? "toggle" : ""}
                        />
                        {errors.secondName ? (
                            <div className={"input-error"}>
                                {errors.secondName.message}
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className={"input-container"}>
                    <label className={"label"} htmlFor="register-email">
                        Email
                    </label>
                    <input
                        type="text"
                        id="register-email"
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
                    <label className={"label"} htmlFor="register-password">
                        Password
                    </label>
                    <input
                        type="password"
                        id="register-password"
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
                    {isSubmitting && <Loader2 className={"loader"} />} Create
                    Account
                </button>
            </div>
        </form>
    );
});

export default RegisterForm;
