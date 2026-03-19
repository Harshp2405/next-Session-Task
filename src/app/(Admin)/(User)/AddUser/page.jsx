"use client";

import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import {
	UserPlus,
	Mail,
	Lock,
	User,
	School,
	ChevronLeft,
	AlertCircle,
	Loader2,
} from "lucide-react";

export default function Register() {
	const router = useRouter();

	const validationSchema = Yup.object({
		name: Yup.string()
			.min(2, "Name is too short")
			.max(50, "Name is too long")
			.required("Full name is required"),
		email: Yup.string()
			.email("Invalid email address")
			.required("Email is required"),
		password: Yup.string()
			.min(8, "8+ characters required")
			.matches(/[A-Z]/, "Uppercase required")
			.required("Password is required"),
		gender: Yup.string().required("Required"),
		role: Yup.string().required("Required"),
		college: Yup.string().required("Required"),
	});

	const formik = useFormik({
		initialValues: {
			name: "",
			email: "",
			password: "",
			role: "",
			college: "",
			gender: "",
		},

		validationSchema: validationSchema,
		onSubmit: async (values, { setSubmitting, resetForm }) => {
			try {
				const res = await fetch("/api/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(values),
				});
				if (res.ok) {
					router.push("/Admin");
					resetForm();
				} else {
					const data = await res.json();
					alert(data.error || "Registration failed");
				}
			} catch (err) {
				console.error("Network error:", err);
			} finally {
				setSubmitting(false);
			}
		},
	});

	return (
		<div className="min-h-screen bg-black text-slate-200 flex flex-col items-center justify-center p-6 selection:bg-blue-500/30">
			{/* Back Button */}
			<div className="w-full max-w-lg mb-6">
				<button
					onClick={() => router.back()}
					className="flex items-center text-sm text-slate-400 hover:text-white transition-colors group">
					<ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
					Back to Dashboard
				</button>
			</div>

			<div className="max-w-lg w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-sm overflow-hidden">
				{/* Header Section */}
				<div className="p-8 border-b border-zinc-800 bg-linear-to-b from-zinc-800/50 to-transparent">
					<div className="flex items-center gap-4">
						<div className="bg-blue-600/10 p-3 rounded-xl border border-blue-500/20">
							<UserPlus className="text-blue-500 w-6 h-6" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-white">Create User</h2>
							<p className="text-zinc-500 text-sm">
								Add a new member to your organization.
							</p>
						</div>
					</div>
				</div>

				<form onSubmit={formik.handleSubmit} className="p-8 space-y-6">
					{/* Full Name */}
					<div className="space-y-2">
						<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
							<User className="w-3.5 h-3.5" /> FULL NAME
						</label>
						<input
							{...formik.getFieldProps("name")}
							placeholder="e.g. Alex Rivera"
							className={`w-full bg-zinc-950 border px-4 py-2.5 rounded-lg outline-none transition-all placeholder:text-zinc-700 ${
								formik.touched.name && formik.errors.name
									? "border-red-500/50 ring-2 ring-red-500/10"
									: "border-zinc-800 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
							}`}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{/* Email */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
								<Mail className="w-3.5 h-3.5" /> EMAIL
							</label>
							<input
								type="email"
								{...formik.getFieldProps("email")}
								placeholder="alex@company.com"
								className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700"
							/>
						</div>

						{/* Password */}
						<div className="space-y-2">
							<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
								<Lock className="w-3.5 h-3.5" /> PASSWORD
							</label>
							<input
								type="password"
								{...formik.getFieldProps("password")}
								placeholder="••••••••"
								className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all"
							/>
						</div>
					</div>

					{/* College */}
					<div className="space-y-2">
						<label className="text-xs font-medium text-zinc-400 flex items-center gap-2">
							<School className="w-3.5 h-3.5" /> COLLEGE
						</label>
						<input
							{...formik.getFieldProps("college")}
							placeholder="Institution Name"
							className="w-full bg-zinc-950 border border-zinc-800 px-4 py-2.5 rounded-lg outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-zinc-700"
						/>
					</div>

					{/* Role & Gender Selectors */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
						{/* Role */}
						<div className="space-y-3">
							<span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
								Role
							</span>
							<div className="flex gap-2">
								{["Intern", "Admin", "Head"].map((role) => (
									<label key={role} className="cursor-pointer">
										<input
											type="radio"
											name="role"
											value={role}
											className="sr-only"
											onChange={formik.handleChange}
										/>
										<span
											className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
												formik.values.role === role
													? "bg-blue-600 border-blue-500 text-white"
													: "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
											}`}>
											{role}
										</span>
									</label>
								))}
							</div>
						</div>

						{/* Gender */}
						<div className="space-y-3">
							<span className="text-xs font-medium text-zinc-400 block uppercase tracking-wider">
								Gender
							</span>
							<div className="flex gap-2">
								{["MALE", "FEMALE"].map((g) => (
									<label key={g} className="cursor-pointer">
										<input
											type="radio"
											name="gender"
											value={g}
											className="sr-only"
											onChange={formik.handleChange}
										/>
										<span
											className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${
												formik.values.gender === g
													? "bg-blue-600 border-blue-500 text-white"
													: "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
											}`}>
											{g.charAt(0) + g.slice(1).toLowerCase()}
										</span>
									</label>
								))}
							</div>
						</div>
					</div>

					{/* Error Message Summary */}
					{(formik.errors.name || formik.errors.email) &&
						formik.submitCount > 0 && (
							<div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-xs">
								<AlertCircle className="w-4 h-4" />
								Please fill in all required fields correctly.
							</div>
						)}

					{/* Submit Button */}
					<button
						type="submit"
						disabled={formik.isSubmitting}
						className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-white">
						{formik.isSubmitting ? (
							<Loader2 className="w-5 h-5 animate-spin" />
						) : (
							"Create Account"
						)}
					</button>
				</form>
			</div>

			<p className="mt-8 text-zinc-600 text-xs">
				Secure Admin Registration System • {new Date().getFullYear()}
			</p>
		</div>
	);
}
