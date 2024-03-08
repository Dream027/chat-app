import { fetchClient } from "@/utils/fetchClient";
import { createContext, useContext, useEffect, useState } from "react";

type SessionContextType = {
    session: User | null;
    setSession: React.Dispatch<React.SetStateAction<User | null>>;
} | null;
const SessionContext = createContext<SessionContextType>(null);

export function useSession() {
    const session = useContext(SessionContext);
    if (!session) {
        throw new Error("Session is undefined");
    }
    return session.session;
}

export default function SessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<User | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        fetchClient("/users/session", "GET", null, {
            signal: controller.signal,
        })
            .then((res) => {
                if (res.success) {
                    setSession(res.data);
                }
            })
            .catch((err) => console.error(err));

        return () => {
            controller.abort();
        };
    }, []);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}
