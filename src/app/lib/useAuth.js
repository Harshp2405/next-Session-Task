import { prisma } from "./prisma";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function UserList() {
	const users = await prisma.user.findMany();
	return users;
}
