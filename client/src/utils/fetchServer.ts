import toast from "react-hot-toast";

export function fetchServer(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: any,
    options?: RequestInit,
) {
    const body = data instanceof FormData ? Object.fromEntries(data) : data;

    return fetch(`http://localhost:4000/api/v1${url}`, {
        method,
        headers: {
            ...options?.headers,
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
        ...options,
    });
}

export async function handleFetch(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data: any,
    options?: RequestInit,
) {
    try {
        const response = await fetchServer(url, method, data, options);
        const dataResponse = await response.json();
        if (!response.ok) {
            toast.error(
                dataResponse.message ||
                    "Something went wrong. Please try again.",
            );
            return null;
        }
        if (!dataResponse.success) {
            toast.error(
                dataResponse.message ||
                    "Something went wrong. Please try again.",
            );
            return null;
        }
        toast.success(dataResponse.message);
        return dataResponse;
    } catch {
        toast.error("Something went wrong. Please try again.");
        return null;
    }
}
