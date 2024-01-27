import { handleFetch } from "@/utils/handleFetch";

export async function login(data: { email: string; password: string }) {
    const res = await handleFetch<{ token: string }>(
        "/users/login",
        "POST",
        data,
    );
    if (res) {
        localStorage.setItem("accessToken", res.token);
        return true;
    }
    return false;
}

export async function register(data: {
    name: string;
    email: string;
    password: string;
}) {
    const res = await handleFetch("/users/register", "POST", data);
    return !!res;
}

export async function logout() {
    await handleFetch("/users/logout", "POST");
    localStorage.removeItem("accessToken");
}
