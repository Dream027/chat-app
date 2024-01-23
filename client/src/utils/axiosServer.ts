import axios from "axios";
import { cookies } from "next/headers";

export const axiosServer = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
    headers: {
        Authorization: `Bearer ${cookies().get("accessToken")}`,
    },
});
