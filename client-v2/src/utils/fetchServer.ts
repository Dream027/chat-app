import { cookies } from "next/headers";
import { fetchClient } from "./fetchClient";

export async function fetchServer(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
) {
    const token = cookies().get("token")?.value;
    if (!token) {
        return null;
    }

    const res = await fetchClient(url, method, body, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return res?.data ?? null;
}
