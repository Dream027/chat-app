import { fetchData } from "@/utils/fetch";

export async function getSession() {
    const response = await fetchData<{ user: User }>("/users/profile");
    return response?.user ?? null;
}
