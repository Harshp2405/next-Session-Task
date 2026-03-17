"use server";
import { prisma } from "./prisma";

export const userlist = async () => {
	const users = await prisma.user.findMany({
		where: {
			role: "Intern",
		},
		orderBy: {
			createdAt: "desc",
		},
		select: {
			id: true,
			name: true,
			email: true,
			password: false,
			role: true,
			createdAt: true,
		},
	});

	return users;
};

export const getSingleUser = async (InternId) => {
	const user = await prisma.user.findUnique({
		where: {
			id: InternId,
		},
		select: {
			id: true,
			name: true,
			email: true,
			password: false,
			role: true,
			createdAt: true,
		},
	});
	return user;
};
