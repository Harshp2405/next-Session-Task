import { prisma } from "../../lib/prisma";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
	try {
		const body = await req.json();
		const { email, password } = body;

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and Password required" },
				{ status: 400 },
			);
		}

		const user = await prisma.user.findUnique({
			where: { email },
		});
		console.log(user , " ============================from route")

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return NextResponse.json({ error: "Invalid password" }, { status: 401 });
		}

		const token = jwt.sign(
			{ id: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" },
		);


		await prisma.session.create({
			data: {
				userId: user.id,
				token: token,
				expiresAt: new Date(Date.now() + 60 * 60 * 1000),
			},
		});

		// 2. Set the Cookie securely
		const cookieStore = await cookies();
		cookieStore.set("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24,
			path: "/",
		});


		return NextResponse.json({
			message: "Login successful",
			user: {
				id: user.id,
				email: user.email,
				name: user.name,
				role:user.role
			},
			token,
		});
	} catch (error) {
		console.error("Login Error:", error);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
