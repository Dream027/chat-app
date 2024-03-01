import { NextRequest, NextResponse } from "next/server";
import { fetchClient } from "@/utils/fetchClient";

export default async function middleware(req: NextRequest) {
    // const res = await fetchClient("/users/session", "GET", null, {
    //     headers: {
    //         Authorization: `Bearer ${req.cookies.get("token")?.value}`,
    //     },
    // });
    // if (!res?.success) {
    //     return NextResponse.redirect(new URL("/signin", req.nextUrl));
    // }
    // return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/profile",
        "/users/:path*",
        "/friends/:path*",
        "/chat/:path*",
        "/group/:path*",
    ],
};
