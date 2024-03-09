import toast from "react-hot-toast";
import { fetchClient } from "./fetchClient";

export async function handleFetch(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: any
) {
    const res = await fetchClient(url, method, body);
    if (!res?.success) {
        toast.error(res.message ?? "Something went wrong");
        return null;
    } else {
        toast.success(res.message);
        return res.data;
    }
}
