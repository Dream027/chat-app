import { cookies } from "next/headers";

export async function getServerSession() {
    const response = await fetch("http://localhost:4000/api/v1/users/profile", {
        headers: {
            Authorization: `Bearer ${cookies().get("accessToken")?.value}`,
        },
    });
    if (!response.ok) {
        return null;
    }
    const data = await response.json();
    if (!data.success) {
        return null;
    }
    return data.data;
}
