import { cookies } from "next/headers";
import { fetchClient } from "./fetchClient";

export async function getServerSession() {
    if (!cookies().get("token")?.value) return null;
    const session = await fetchClient("/users/session", "GET", null, {
        headers: {
            Authorization: `Bearer ${cookies().get("token")?.value}`,
        },
    });
    if (!session.success) return null;
    return session.data as User;
}
