import { prisma } from "./prisma"


export const userlist = async () => {
	const users = await prisma.user.findMany({
		where: {
			role: "Intern",
		},
		orderBy: {
			createdAt: "desc",
		},
		select:{
			id: true,
			name: true,
			email: true,
			password: false,
			role: true,
			createdAt: true,
		}			

	});

	return users;
};

