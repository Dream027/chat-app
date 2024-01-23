import axios from "axios";

export const axiosClient = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1`,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
});
