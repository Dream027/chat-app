import { useState } from "react";

export function useForm() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    function handleSubmit(fn: (data?: any) => Promise<any>) {
        return async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            const data = new FormData(e.currentTarget);
            try {
                const res = await fn(Object.fromEntries(data.entries()));
                setData(res);
            } catch {
                setData(null);
            } finally {
                setLoading(false);
            }
        };
    }

    return {
        data,
        loading,
        handleSubmit,
    };
}
