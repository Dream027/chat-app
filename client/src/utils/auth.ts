import { handleFetch } from "@/utils/fetchServer";

export async function register(data: {
    name: string;
    email: string;
    password: string;
}) {
    await handleFetch("/users/register", "POST", {
        name: data.name,
        email: data.email,
        password: data.password,
    });
}

export async function login(data: { email: string; password: string }) {
    const response = await handleFetch("/users/login", "POST", {
        email: data.email,
        password: data.password,
    });
    if (response) {
        console.log(response);
        localStorage.setItem("accessToken", response.data.token);
    }
}

export async function logout() {
    const response = await handleFetch(
        "/users/logout",
        "POST",
        {},
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
        },
    );
    localStorage.setItem("accessToken", "");
}
