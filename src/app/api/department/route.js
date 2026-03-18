import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";


export async function POST(req) {
	try {
		const body = await req.json();
		const { name, headId } = body;

		if (!name || !headId) {
			return NextResponse.json(
				{ error: "Name and headId are required" },
				{ status: 400 },
			);
		}

		// Check if user exists
		const user = await prisma.user.findUnique({
			where: { id: headId },
		});

		if (!user) {
			return NextResponse.json(
				{ error: "Head user not found" },
				{ status: 404 },
			);
		}

		// Create department
		// const department = await prisma.department.create({
		// 	data: {
		// 		name,
		// 		head: {
		// 			connect: { id: headId },
		// 		},
		// 	},
		// });

        // const updateUser = await prisma.user.update({
		// 			where: { id: headId },
		// 			data: {
		// 				isHead: true,
		// 				departmentId: department.id
		// 			},
		// 		});

        // console.log(updateUser);
        const result = await prisma.$transaction(async (tx) => {
					// Create department
					const department = await tx.department.create({
						data: {
							name,
							head: {
								connect: { id: headId },
							},
						},
					});

					// Update user
					const updatedUser = await tx.user.update({
						where: { id: headId },
						data: {
							isHead: true,
							departmentId: department.id,
                            role:"Head"
						},
					});

					return { department, updatedUser };
				});

		return NextResponse.json({
			message: "Department created",
			department: result.department,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 },
		);
	}
}
