import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";

export async function POST(req) {
	try {
		const body = await req.json();

		const { name, email, password, role } = body;

		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: "All fields required" },
				{ status: 400 },
			);
		}

		const existingUser = await prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			return NextResponse.json(
				{ error: "User already exists" },
				{ status: 400 },
			);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role: role || "Intern",
			},
		});

		return NextResponse.json({
			message: "User created successfully",
			user,
		});
	} catch (error) {
		console.log(error);

		return NextResponse.json({ error: error }, { status: 500 });
	}
}
