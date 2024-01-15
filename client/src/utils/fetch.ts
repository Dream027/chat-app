import toast from "react-hot-toast";

export async function fetchData<T extends any>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body: any = null,
): Promise<T | null> {
    try {
        const response = await fetchFromServer(url, method, body);
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data.success ? data.data : null;
    } catch {
        return null;
    }
}

export async function handleFetch<T extends any>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body: any = null,
): Promise<T | null> {
    try {
        const response = await fetchFromServer(url, method, body);
        const data = await response?.json();

        if (!response.ok || !data.success) {
            toast.error(data.message || "Something went wrong.");
            return null;
        }

        toast.success(data.message || "Success.");
        return data.data;
    } catch {
        return null;
    }
}

export function fetchFromServer(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: any = null,
) {
    return fetch("http://localhost:4000/api/v1" + url, {
        method,
        body: method === "GET" ? null : JSON.stringify(body),
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
}
