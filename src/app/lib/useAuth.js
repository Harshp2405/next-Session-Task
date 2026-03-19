import { prisma } from "./prisma";
import jwt from "jsonwebtoken";


export async function UserList() {
	const users = await prisma.user.findMany();
	return users;
}
