"use client";

import { useFormik } from "formik";
import * as Yup from "yup";

import { useEffect, useState } from "react";
import { getUser } from "../../../lib/useAdmin";

export default function CreateDepartment() {

    const [User, setUser] = useState([]);
	
	useEffect(() => {
		const userList = async ()=>{
			const userList = await getUser();
			setUser(userList);
        }
		
        userList();
    }, [])
	// console.log(User)

	const formik = useFormik({
		initialValues: {
			name: "",
			headId: "",
		},
		validationSchema: Yup.object({
			name: Yup.string().required("Department name is required"),
			headId: Yup.string().required("Head is required"),
		}),
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			try {
				const res = await fetch("/api/department", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(values),
				});

                console.log(values)

				const data = await res.json();

				if (res.ok) {
					alert("Department created");
					resetForm();
				} else {
					alert(data.error || "Error creating department");
				}
			} catch (err) {
				console.error(err);
			} finally {
				setSubmitting(false);
			}
		},
	});

	return (
		<div className="min-h-screen flex items-center justify-center">
			<form
				onSubmit={formik.handleSubmit}
				className="p-6 border rounded-lg w-full max-w-md space-y-4">
				<h2 className="text-xl font-bold text-white">Create Department</h2>

				{/* Department Name */}
				<div>
					<input
						type="text"
						name="name"
						placeholder="Department Name"
						{...formik.getFieldProps("name")}
						className="w-full px-3 py-2 border rounded text-black bg-white"
					/>
					{formik.touched.name && formik.errors.name && (
						<p className="text-red-500 text-sm">{formik.errors.name}</p>
					)}
				</div>

				{/* Head ID */}

				<div className="">
					<select name="departmentId" {...formik.getFieldProps("headId")}>
						<option value="">Select User As head of department</option>
						{User.map((user) => (
							<option key={user.id} value={user.id} className="text-black">
								{user.name}
							</option>
						))}
					</select>
				</div>

				<button
					type="submit"
					disabled={formik.isSubmitting}
					className="bg-blue-600 text-white px-4 py-2 rounded w-full">
					{formik.isSubmitting ? "Creating..." : "Create Department"}
				</button>
			</form>
		</div>
	);
}
