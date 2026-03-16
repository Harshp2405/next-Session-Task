import { prisma } from "./prisma"


export const userlist = async () => {
	const users = await prisma.user.findMany({
		where: {
			role: "Intern",
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return users;
};
