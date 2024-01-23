import { useState } from "react";

export function useForm() {
    const [loading, setLoading] = useState(false);

    function handleSubmit(fn: (data?: any) => Promise<void>) {
        return async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            setLoading(true);
            const data = new FormData(e.currentTarget);
            await fn(Object.fromEntries(data.entries()));
            setLoading(false);
        };
    }

    return {
        loading,
        handleSubmit,
    };
}
