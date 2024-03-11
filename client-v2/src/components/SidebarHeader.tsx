"use client";

import { useSession } from "@/contexts/SessionProvider";
import { handleFetch } from "@/utils/handleFetch";
import { LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function SidebarHeader() {
    const session = useSession();
    const router = useRouter();

    const logout = useCallback(async () => {
        const res = await handleFetch("/users/logout", "POST");
        if (res) {
            router.replace("/signin");
        }
    }, [router]);
    return (
        <div className="sidebar_header">
            <div>
                <div className="sidebar_image">
                    <Image
                        src={session?.image!}
                        alt="profile image"
                        width={100}
                        height={100}
                        onClick={() => router.push("/users/profile")}
                    />
                </div>
                <div>
                    <div>
                        <h3>{session?.name}</h3>
                        <p>{session?.email}</p>
                    </div>
                    <div onClick={logout}>
                        <LogOut />
                    </div>
                </div>
            </div>
        </div>
    );
}
