import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Daftar route yang butuh autentikasi
const protectedPaths = ["/sys", "/admin", "/dashboard"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    const isProtected = protectedPaths.some((path) =>
        pathname.startsWith(path)
    );

    if (isProtected && !token) {
        // const loginUrl = new URL("/login", request.url);
        const loginUrl = new URL("/", request.url);
        loginUrl.searchParams.set("redirect", pathname); // agar bisa redirect balik
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
