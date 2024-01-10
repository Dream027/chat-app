"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "@/utils/session";

type SessionProviderProps = {
    children: React.ReactNode;
};

const SessionContext = createContext<SessionContextT | null>(null);
type SessionContextT = {
    session?: Session;
};

export function useSession(): Session | null | undefined {
    const session = useContext(SessionContext);
    return session?.session;
}

export default function SessionProvider({ children }: SessionProviderProps) {
    const [session, setSession] = useState<SessionContextT | null>(null);

    useEffect(() => {
        (async function fetchSession() {
            const session = await getSession();
            setSession({ session: session?.user });
        })();
    }, []);

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    );
}
