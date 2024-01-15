import { useEffect, useState } from "react";

export function useForm(cb: (data?: any) => Promise<any>) {
    const [pending, setPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPending(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        await cb(data);
        setPending(false);
    };

    return {
        pending,
        handleSubmit,
    };
}
