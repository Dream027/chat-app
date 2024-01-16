import { useEffect, useState } from "react";
import { fetchData } from "@/utils/fetch";

export function useFetch<T>(
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
) {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        fetchData<T>(url, method)
            .then((data) => setData(data))
            .finally(() => setLoading(false));
    }, [method, url]);

    return { loading, data };
}
