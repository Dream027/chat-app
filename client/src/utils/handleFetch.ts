import toast from "react-hot-toast";

export async function handleFetch<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body: any = {},
): Promise<T | null> {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1${url}`,
            {
                credentials: "include",
                method,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "application/json",
                },
                body: method === "GET" ? null : JSON.stringify(body),
                cache: "no-store",
            },
        );
        const data = await res.json();
        if (!res.ok || !data.success) {
            toast.error(data.message || "Something went wrong.");
            return null;
        }
        toast.success(data.message);
        return data.data as T;
    } catch (e: any) {
        toast.error("Something went wrong.");
        console.error(e.message);
        return null;
    }
}
