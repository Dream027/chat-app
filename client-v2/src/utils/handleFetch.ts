import toast from "react-hot-toast";
import { fetchClient } from "./fetchClient";
import { SERVER_URL } from "./constants";

export async function handleFetch(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
) {
    const cookies = document.cookie.split(";");
    let token = "";
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0].trim() === "token") {
            token = cookie[1].trim();
        }
    }
    if (!token && !(url.includes("login") || url.includes("register"))) {
        toast.error("Login first");
        return null;
    }
    const res = await fetchClient(url, method, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!res?.success) {
        toast.error(res.message ?? "Something went wrong");
        return null;
    } else {
        toast.success(res.message);
        return res.data;
    }
}

export async function handleFileUpload(url: string, body: FormData) {
    const cookies = document.cookie.split(";");
    let token = "";
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].split("=");
        if (cookie[0].trim() === "token") {
            token = cookie[1].trim();
        }
    }
    if (!token && !(url.includes("login") || url.includes("register"))) {
        toast.error("Login first");
        return null;
    }
    const res = await fetch(SERVER_URL + url, {
        method: "PUT",
        body,
        credentials: "include",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (!data?.success) {
        toast.error(data.message ?? "Something went wrong");
        return null;
    } else {
        toast.success(data.message);
        return data.data;
    }
}
