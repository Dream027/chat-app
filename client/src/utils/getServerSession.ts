import { axiosClient } from "@/utils/axios";

export async function getServerSession(cookie: string) {
    try {
        const { data } = await axiosClient.get("/users/profile", {
            headers: {
                Authorization: `Bearer ${cookie}`,
            },
        });
        return data.data.user || null;
    } catch (e: any) {
        console.log(e.message);
        return null;
    }
}
