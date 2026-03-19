import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function PUT(req) {
	try {
		const body = await req.json();
		const { id, departmentId, role } = body;

		if (!id) {
			return NextResponse.json(
				{ error: "User ID is required" },
				{ status: 400 },
			);
		}

		// Check if user exists
		const existingUser = await prisma.user.findUnique({
			where: { id },
		});

		if (!existingUser) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Validate department if provided and role is NOT Admin
		let department = null;
		if (role !== "Admin" && departmentId) {
			department = await prisma.department.findUnique({
				where: { id: departmentId },
			});
			if (!department) {
				return NextResponse.json(
					{ error: "Department not found" },
					{ status: 404 },
				);
			}
		}

		// Start transaction to handle role + department updates
		const updatedUser = await prisma.$transaction(async (tx) => {
			const updateData = {};

			// Assign department only if not Admin
			if (role !== "Admin") {
				updateData.departmentId = departmentId || null;
			} else {
				updateData.departmentId = null; // Admins don't need a department
			}

			if (role) {
				updateData.role = role;

				// Special logic: promote Intern -> Head
				if (existingUser.role === "Intern" && role === "Head" && department) {
					updateData.isHead = true;
				} else if (role === "Admin") {
					updateData.isHead = false; // Admins cannot be Heads of a department
				}
			}

			const user = await tx.user.update({
				where: { id },
				data: updateData,
				include: { department: true },
			});

			return user;
		});

		return NextResponse.json({
			message: "User updated successfully",
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
