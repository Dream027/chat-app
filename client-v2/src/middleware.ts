import { NextRequest, NextResponse } from "next/server";
import { fetchClient } from "./utils/fetchClient";

export default async function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const isSigninPage = req.nextUrl.pathname === "/signin";
    if (!token && !isSigninPage) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    const session = await fetchClient("/users/session", "GET", null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!session?.success && !isSigninPage) {
        return NextResponse.redirect(new URL("/signin", req.url));
    }
    if (session.success && isSigninPage) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/signin",
        "/users/:path*",
        "/groups/:path*",
        "/chat/:path*",
        "/friends/:path*",
    ],
};
