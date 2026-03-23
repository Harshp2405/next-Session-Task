import { prisma } from "./prisma";
import jwt from "jsonwebtoken";


export async function UserList() {
	const user = await prisma.user.findMany();
	return user;
}
