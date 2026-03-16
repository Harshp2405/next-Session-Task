import { prisma } from "./prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function UserList() {
	const users = await prisma.user.findMany();
	return users;
}

export async function getAuthUser() {
	try {
		const cookieStore = await cookies();
		const cookie = cookieStore.get("token");
		const token = cookie?.value;

		if (!token) {
			console.log("No token found in cookies");
			return null;
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		const user = await prisma.user.findUnique({
			where: { id: decoded.id },
			select: {
				id: true,
				name: true,
				email: true,
				role:true
			},
		});

		return user; // Returns user object or null if not found
	} catch (error) {
		console.error("Token verification or DB fetch failed:", error.message);
		return null;
	}
}
