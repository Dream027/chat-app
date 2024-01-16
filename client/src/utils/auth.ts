import { handleFetch } from "@/utils/fetch";
import cookie from "js-cookie";

export async function login({
    password,
    email,
}: {
    email: string;
    password: string;
}) {
    const response = await handleFetch<{ token: string }>(
        "/users/login",
        "POST",
        {
            email,
            password,
        },
    );

    localStorage.setItem("accessToken", response?.token ?? "");
    cookie.set("accessToken", response?.token ?? "", {
        expires: new Date(2030, 1),
    });
    return !!response;
}

export async function register({
    password,
    name,
    email,
}: {
    email: string;
    name: string;
    password: string;
}) {
    const response = await handleFetch("/users/register", "POST", {
        name,
        email,
        password,
    });
    return !!response;
}

export async function logout() {
    const response = await handleFetch("/users/logout", "POST", {});

    cookie.remove("accessToken");
    localStorage.removeItem("accessToken");
    return !!response;
}
