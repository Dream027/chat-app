"use client";

import { LogOut } from "lucide-react";
import Button from "@/components/ui/Button";
import { logout } from "@/utils/auth";

export default function SidebarUserSession() {
    return (
        <div className="flex items-center justify-start gap-6">
            <div className="h-16 w-16 rounded-lg bg-sky-200"></div>
            <div>
                <p className="text-lg font-semibold text-gray-500">User Name</p>
                <p className="text-sm text-gray-400">testemail@email.com</p>
            </div>
            <Button variant="icon" className="text-gray-400" onClick={logout}>
                <LogOut />
            </Button>
        </div>
    );
}
