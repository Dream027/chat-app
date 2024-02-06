import {
    useContext,
    createContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import { fetchClient } from "@/utils/fetchClient";

type SessionContext = {
    session: User | null;
    setSession: Dispatch<SetStateAction<User | null>>;
};
export const SessionContext = createContext<SessionContext | null>(null);

export function useSession() {
    return useContext<SessionContext | null>(SessionContext)?.session;
}

export default function SessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [session, setSession] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetchClient("/users/session", "GET");
                if (res.success) {
                    setSession(res.data);
                }
            } catch (e: any) {
                console.error(e.message);
            }
        })();
    }, []);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}
