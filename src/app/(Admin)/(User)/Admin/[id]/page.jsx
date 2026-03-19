"use client";

import { useParams, useRouter } from "next/navigation";
import { getSingleUser, selectDepartment } from "../../../../lib/useAdmin";
import { useEffect, useLayoutEffect, useState } from "react";
import {
	ArrowLeft,
	Save,
	User,
	Building2,
	Mail,
	Loader2,
	CheckCircle2,
} from "lucide-react";

const GetById = () => {
	const { id } = useParams();
	const router = useRouter();

	const [data, setData] = useState(null);
	const [selectedDept, setSelectedDept] = useState("");
	const [isUpdating, setIsUpdating] = useState(false);
	const [message, setMessage] = useState({ type: "", text: "" });
  const [selectedRole, setSelectedRole] = useState("");

	useLayoutEffect(() => {
		const fetchData = async () => {
			try {
				const user = await getSingleUser(id);
				const dept = await selectDepartment();
				setData({ user, dept });
				setSelectedDept(user.department?.id || "");
        setSelectedRole(user.role || "");
			} catch (err) {
				setMessage({ type: "error", text: "Failed to load user data." });
			}
		};
		fetchData();
	}, [id]);


	const handleUpdate = async () => {
		if (!selectedDept) {
			setMessage({ type: "error", text: "Please select a department" });
			return;
		}

		setIsUpdating(true);
		setMessage({ type: "", text: "" });

		try {
			const res = await fetch(`/api/department/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ departmentId: selectedDept , id:id}),
			});


			if (res.ok) {
				setMessage({
					type: "success",
					text: "Department updated successfully!",
				});
				
			} else {
				const err = await res.json();
				setMessage({ type: "error", text: err.error || "Update failed" });
			}
		} catch (error) {
			setMessage({ type: "error", text: "A network error occurred." });
		} finally {
			setIsUpdating(false);
		}
	};
	const handleUpdateRole = async () => {
		if (!selectedRole) {
			setMessage({ type: "error", text: "Please select a department" });
			return;
		}

		setIsUpdating(true);
		setMessage({ type: "", text: "" });

		try {
			const res = await fetch(`/api/role/${id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ departmentId: selectedDept , id:id , role:selectedRole}),
			});


			if (res.ok) {
				setMessage({
					type: "success",
					text: "Role updated successfully!",
				});
				
			} else {
				const err = await res.json();
				setMessage({ type: "error", text: err.error || "Update failed" });
			}
		} catch (error) {
			setMessage({ type: "error", text: "A network error occurred." });
		} finally {
			setIsUpdating(false);
		}
	};

	if (!data) {
		return (
			<div className="flex flex-col items-center justify-center min-h-100 space-y-4">
				<Loader2 className="w-8 md:w-12 h-8 md:h-12 animate-spin text-blue-600" />
				<p className="text-slate-500 font-medium">Loading user details...</p>
			</div>
		);
	}

	const { user, dept } = data;

	return (
		<div className="max-w-2xl mx-auto mt-8 p-4">
			{/* Back Button */}
			<button
				onClick={() => router.back()}
				className="flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6">
				<ArrowLeft className="w-4 h-4 mr-1" /> Back to Users
			</button>

			<div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
				{/* Header */}
				<div className="bg-slate-50 border-b border-slate-200 p-6">
					<h1 className="text-xl font-semibold text-slate-800">
						Edit User Assignment
					</h1>
					<p className="text-sm text-slate-500">
						Update the organizational department for this employee.
					</p>
				</div>

				<div className="p-6 space-y-8">
					{/* User Info Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="flex items-start space-x-3">
							<div className="p-2 bg-blue-50 rounded-lg">
								<User className="w-5 h-5 text-blue-600" />
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
									Full Name
								</p>
								<p className="text-slate-900 font-medium">{user.name}</p>
							</div>
						</div>

						<div className="flex items-start space-x-3">
							<div className="p-2 bg-purple-50 rounded-lg">
								<Mail className="w-5 h-5 text-purple-600" />
							</div>
							<div>
								<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
									Email Address
								</p>
								<p className="text-slate-900 font-medium">{user.email}</p>
							</div>
						</div>
					</div>

					<hr className="border-slate-100" />

					{/* Form Section */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2 mb-2">
							<Building2 className="w-5 h-5 text-slate-400" />
							<label className="font-semibold text-slate-700">
								Department Assignment
							</label>
						</div>

						<select
							value={selectedDept}
							onChange={(e) => setSelectedDept(e.target.value)}
							className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none">
							<option value="">Unassigned / Select Department</option>
							{dept.map((d) => (
								<option key={d.id} value={d.id}>
									{d.name}
								</option>
							))}
						</select>

						<p className="text-xs text-slate-400 italic">
							Currently assigned to:{" "}
							<span className="text-slate-600 font-medium">
								{user.department?.name || "None"}
							</span>
						</p>
						<button
							onClick={handleUpdate}
							disabled={isUpdating}
							className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100">
							{isUpdating ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Updating...
								</>
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save DepartMent
								</>
							)}
						</button>
					</div>

					{/* Role Update */}

					<div className="space-y-2">
						<label className="block font-semibold text-slate-700">
							Role Assignment
						</label>
						<select
							value={selectedRole}
							onChange={(e) => setSelectedRole(e.target.value)}
							className="w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 transition-all outline-none">
							<option value={""}>{selectedRole}</option>
							
							<option value="Intern">Intern</option>
							<option value="Head">Head</option>
							<option value="Admin">Admin</option>
						</select>
						<p className="text-xs text-slate-400 italic">
							Current role:{" "}
							<span className="text-slate-600 font-medium">{user.role}</span>
						</p>
						<button
							onClick={handleUpdateRole}
							disabled={isUpdating}
							className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100">
							{isUpdating ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Updating...
								</>
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save Role
								</>
							)}
						</button>
					</div>

					{/* Feedback Messages */}
					{message.text && (
						<div
							className={`flex items-center p-4 rounded-lg text-sm ${
								message.type === "success"
									? "bg-green-50 text-green-700 border border-green-100"
									: "bg-red-50 text-red-700 border border-red-100"
							}`}>
							{message.type === "success" && (
								<CheckCircle2 className="w-4 h-4 mr-2" />
							)}
							{message.text}
						</div>
					)}

					{/* Action Buttons */}
					<div className="pt-4 flex items-center justify-end space-x-3">
						<button
							onClick={() => router.back()}
							className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
							Cancel
						</button>
						{/* <button
							onClick={handleUpdate}
							disabled={isUpdating}
							className="flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-blue-100">
							{isUpdating ? (
								<>
									<Loader2 className="w-4 h-4 mr-2 animate-spin" />
									Updating...
								</>
							) : (
								<>
									<Save className="w-4 h-4 mr-2" />
									Save DepartMent
								</>
							)}
						</button> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default GetById;
