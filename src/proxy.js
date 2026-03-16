// import { NextResponse } from "next/server";

// export function middleware(req) {
// 	const token = req.cookies.get("token")?.value;
// 	const { pathname } = req.nextUrl;

// 	// 1. Define your paths
// 	const isPublicPath = pathname === "/Login" || pathname === "/Register";
// 	const isProtectedPath =
// 		pathname === "/" ||
// 		pathname.startsWith("/Admin") ||
// 		pathname.startsWith("/Intern");

// 	// 2. If user is NOT logged in and tries to access a protected page
// 	if (!token && isProtectedPath) {
// 		return NextResponse.redirect(new URL("/Login", req.url));
// 	}

// 	// 3. If user IS logged in and tries to access Login/Register
// 	// We redirect them to home so they don't log in twice
// 	if (token && isPublicPath) {
// 		return NextResponse.redirect(new URL("/", req.url));
// 	}

// 	return NextResponse.next();
// }


// export const config = {
// 	matcher: ["/", "/Login", "/Register", "/Admin/:path*", "/Intern/:path*"],
// };


// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(req) {
	const token = req.cookies.get("token")?.value;
	const { pathname } = req.nextUrl;

	const isPublicPath = pathname === "/Login" || pathname === "/Register";

	// 1️⃣ Not logged in
	if (!token && !isPublicPath) {
		return NextResponse.redirect(new URL("/Login", req.url));
	}

	if (token) {
		try {
			const secret = new TextEncoder().encode(process.env.JWT_SECRET);
			const { payload } = await jwtVerify(token, secret);

			const role = payload.role;

			if (isPublicPath) {
				return NextResponse.redirect(new URL("/", req.url));
			}

			if (pathname.startsWith("/Admin") && role !== "Admin") {
				return NextResponse.redirect(new URL("/", req.url));
			}

			if (pathname.startsWith("/Intern") && role !== "Intern") {
				return NextResponse.redirect(new URL("/", req.url));
			}

		} catch (error) {
			return NextResponse.redirect(new URL("/Login", req.url));
		}
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};