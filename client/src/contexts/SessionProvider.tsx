import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";
import { axiosClient } from "@/utils/axios";

type SessionContext = {
    session: User | null;
    setSession: Dispatch<SetStateAction<User | null>> | null;
};

const SessionContext = createContext<SessionContext>({
    session: null,
    setSession: null,
});

export function useSession() {
    return useContext(SessionContext).session;
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
                const { data } = await axiosClient.get("/users/profile", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "accessToken",
                        )}`,
                    },
                });
                setSession(data.data.user);
            } catch {}
        })();
    }, []);

    return (
        <SessionContext.Provider value={{ session, setSession }}>
            {children}
        </SessionContext.Provider>
    );
}
