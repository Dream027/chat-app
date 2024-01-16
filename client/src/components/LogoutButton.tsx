"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { SessionContext, useSession } from "@/context/SessionProvider";

export default function LogoutButton() {
    const router = useRouter();
    const session = useContext(SessionContext);

    async function handleLogout() {
        await logout();
        router.push("/login");
        session?.setSession(null);
    }

    return (
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: "var(--clr-background, #fff)",
                color: "var(--clr-text-light, #aaa)",
            }}
        >
            <LogOut />
        </button>
    );
}
