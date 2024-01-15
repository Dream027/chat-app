"use client";

import { LogOut } from "lucide-react";
import { logout } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    async function handleLogout() {
        await logout();
        router.push("/login");
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
