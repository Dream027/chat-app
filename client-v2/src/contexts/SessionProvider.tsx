"use client";

import { createContext, useContext, useState } from "react";

type SessionContextType = {
    session: User | null;
    setSession: React.Dispatch<React.SetStateAction<User | null>>;
} | null;
const SessionContext = createContext<SessionContextType>(null);

export function useSessionState() {
    const session = useContext(SessionContext);
    if (!session) {
        throw new Error("Session is undefined");
    }
    return {
        session: session.session,
        setSession: session.setSession,
    };
}

export function useSession() {
    const session = useContext(SessionContext);
    if (!session) {
        throw new Error("Session is undefined");
    }
    return session.session;
}

export default function SessionProvider({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User | null;
}) {
    const [session, setSession] = useState<User | null>(user);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}
