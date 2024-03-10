import { SERVER_URL } from "./constants";

export function fetchClient(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: any = {},
    options?: RequestInit
): Promise<{ data: any; success: boolean; message: string }> {
    return fetch(`${SERVER_URL}/api${url}`, {
        ...options,
        credentials: "include",
        method,
        headers: {
            "Content-Type": "application/json",
            ...options?.headers,
        },
        body: method === "GET" ? undefined : JSON.stringify(body),
        cache: "no-store",
    })
        .then((res) => res.json())
        .catch((err) => {
            throw err;
        });
}
