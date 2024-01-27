import { useEffect, useState } from "react";
import { axiosClient } from "@/utils/axios";

export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axiosClient
            .get(url, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            })
            .then((res) => {
                setData(res.data.data);
            })
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [url]);

    return [data, loading] as const;
}
