// app/api/me/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/prisma";


export async function GET(req) {
	const token = req.cookies.get("token")?.value;

	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: {
				id: true,
				name: true,
				email: true,
				role: true,
			},
		});

		return NextResponse.json({ user });
	} catch (error) {
        console.error("Token verification or DB fetch failed:", error.message);
		return NextResponse.json({ error: "Invalid token" }, { status: 401 });
	}
}
