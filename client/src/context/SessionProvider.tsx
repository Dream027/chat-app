"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchData } from "@/utils/fetch";
import { getSession } from "@/utils/session";

type SessionContextType = {
    user: User | null;
    setSession: (session: any) => void;
};

const SessionContext = createContext<SessionContextType | null>(null);

export function useSession() {
    const session = useContext(SessionContext);
    return session?.user;
}

export default function SessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            const session = await getSession();
            setSession(session);
        })();
    }, []);

    return (
        <SessionContext.Provider value={{ user: session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}
