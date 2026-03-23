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

import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function proxy(req) {
  const url = req.nextUrl.clone();
  const { pathname } = url;

  // Paths that don't require authentication
  const publicPaths = ["/Login", "/Register", "/api/auth"];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // Get JWT from NextAuth cookies
  const token = await getToken({
		req,
		secret: process.env.NEXTAUTH_SECRET,
		decode: async ({ token, secret }) => {
			try {
				return jwt.verify(token, secret);
			} catch (e) {
				return null;
			}
		},
	});

  // Print the token returned by getToken
//   console.log("Decoded token from getToken():", token);

  

  // If no token and trying to access a protected route → redirect to login
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/Login", req.url));
  }

  // If token exists, check roles
  if (token) {
    const role = token.role;

    // Role-based access control
    if (pathname.startsWith("/Admin") && role !== "Admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (pathname.startsWith("/Intern") && role !== "Intern") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // Optional: prevent authenticated user from visiting public pages
    if (isPublic) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};