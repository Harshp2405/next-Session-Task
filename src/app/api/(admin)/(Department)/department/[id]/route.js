import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PUT(req) {
	try {
		
        const body = await req.json();
		const { departmentId , id } = body;
        
		if (!id) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 },
			);
		}

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { id },
			include: { headOf: true },
		});

		if (!existingUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// If departmentId is provided, validate it
		if (departmentId) {
			const department = await prisma.department.findUnique({
				where: { id: departmentId },
			});

			if (!department) {
				return NextResponse.json(
					{ error: "Department not found" },
					{ status: 404 },
				);
			}
		}

		// 🚀 Update user
		const updatedUser = await prisma.user.update({
			where: { id },
			data: {
				departmentId: departmentId || null, // allow unassign
			},
			include: {
				department: true,
			},
		});

		return NextResponse.json({
			message: "User department updated successfully",
			user: updatedUser,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 },
		);
	}
}
