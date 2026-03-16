import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "../../lib/prisma";


export async function POST(req) {
	try {
		const cookieStore = await cookies();
		const token = cookieStore.get("token")?.value;

		if (token && prisma.session) {
			await prisma.session.deleteMany({
				where: { token: token },
			});
		}
		cookieStore.delete("token");

		return NextResponse.json({ message: "Logged out" }, { status: 200 });
	} catch (error) {
		console.error("Logout Error:", error);
		const cookieStore = await cookies();
		cookieStore.delete("token");

		return NextResponse.json(
			{ error: "Logged out with errors" },
			{ status: 200 },
		);
	}
}
