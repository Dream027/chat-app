import toast from "react-hot-toast";
import { fetchServer } from "@/utils/fetchServer";

export async function getSession() {
    try {
        console.log(localStorage.getItem("accessToken"));
        const response = await fetchServer(
            "/users/profile",
            "GET",
            {},
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem(
                        "accessToken",
                    )}`,
                },
            },
        );
        const data = await response.json();
        console.log(data);

        if (!response.ok) {
            toast.error(
                data.message || "Something went wrong. Please try again.",
            );
            return null;
        }
        if (!data.success) {
            toast.error(
                data.message || "Something went wrong. Please try again.",
            );
            return null;
        }
        return data;
    } catch (error: any) {
        toast.error(error.message);
        return null;
    }
}
