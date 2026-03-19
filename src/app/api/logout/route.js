import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../lib/prisma";

export async function POST(req) {
	try {
		const cookieStore = cookies();
		const token = cookieStore.get("token")?.value;

		if (token) {
			// Delete session from database
			await prisma.session.deleteMany({
				where: { sessionToken: token },
			});
		}

		// Remove the cookie by setting it expired
		const res = NextResponse.json({ message: "Logged out" });
		res.cookies.set("token", "", { maxAge: 0, path: "/" });

		return res;
	} catch (error) {
		console.error("Logout Error:", error);

		const res = NextResponse.json({ error: "Logged out with errors" });
		res.cookies.set("token", "", { maxAge: 0, path: "/" });

		return res;
	}
}
