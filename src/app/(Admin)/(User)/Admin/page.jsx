"use client";

import { useEffect, useState } from "react";
import { userlist } from "../../../lib/useAdmin";
import { useRouter } from "next/navigation";
import {
	Users,
	Search,
	ExternalLink,
	ShieldCheck,
	ShieldAlert,
	MoreHorizontal,
	Loader2,
} from "lucide-react";
import { loadUser } from "../../../../redux/authActions";
import { useDispatch } from "react-redux";

export default function Admin() {
	const [user, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const dispatch = useDispatch();
	
	const router = useRouter();
	// console.log(user)

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const me = await dispatch(loadUser());
				console.log(me.id);
				if (!me?.id) {
					console.error("User not found");
					return;
				}
				const data = await userlist(me.id.toString());
				console.log(data)
				setUsers(data);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		};
		

		

		fetchUsers();
	}, []);

	// Filter logic for the search bar
	const filteredUsers = user.filter(
		(user) =>
			user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleClick = (id) => {
		router.push(`/Admin/${id}`);
	};

	return (
		<div className="min-h-screen  p-4 md:p-8">
			{/* Header Section */}
			<div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold text-white-900 flex items-center gap-2">
						<Users className="text-blue-600" /> Users
					</h1>
					<p className="text-white-500 mt-1">
						Manage employee permissions and department assignments.
					</p>
				</div>

				{/* Search Bar */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white-400 w-4 h-4" />
					<input
						type="text"
						placeholder="Search user..."
						className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg  focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			{/* Main Content Card */}
			<div className="max-w-6xl mx-auto  rounded-xl shadow-sm border border-slate-200 overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead className=" border-b border-slate-200">
							<tr>
								<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white-500">
									User
								</th>
								<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white-500">
									Role
								</th>
								<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white-500">
									Department
								</th>
								<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white-500">
									Status
								</th>
								<th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white-500 text-right">
									Actions
								</th>
							</tr>
						</thead>

						<tbody className="divide-y divide-slate-100">
							{loading ? (
								<tr>
									<td colSpan={4} className="py-20 text-center">
										<Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
										<p className="text-white-400">Loading user database...</p>
									</td>
								</tr>
							) : filteredUsers.length === 0 ? (
								<tr>
									<td colSpan={4} className="py-20 text-center text-white-500">
										No user matching your search.
									</td>
								</tr>
							) : (
								filteredUsers.map((user) => (
									<tr
										key={user.id}
										className="hover:/50 transition-colors group">
										<td className="px-6 py-4">
											<div className="flex items-center gap-3">
												{/* Simple Avatar Circle */}
												<div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
													{user.name.charAt(0).toUpperCase()}
												</div>
												<div>
													<p className="font-semibold text-white-800">
														{user.name}
													</p>
													<p className="text-xs text-white-500">{user.email}</p>
												</div>
											</div>
										</td>
										<td className="px-6 py-4">
											<span
												className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
													user.role === "Admin"
														? "bg-purple-100 text-purple-700"
														: user.role === "Head"
															? "bg-green-100 text-green-700"
															: "bg-blue-100 text-blue-700"
												}`}>
												{user.role === "Admin" ? (
													<ShieldCheck className="w-3 h-3" />
												) : (
													<ShieldAlert className="w-3 h-3" />
												)}
												{user.role}
											</span>
										</td>
										<td className="px-6 py-4">
											{user.Department?.name ? (
												<span
													className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
														user.role === "Intern"
															? "bg-purple-100 text-purple-700"
															: user.role === "Head"
																? "bg-red-100 text-red-700"
																: "bg-blue-100 text-blue-700"
													}`}>
													{user.Department.name}
												</span>
											) : (
												"Not Allotted"
											)}
										</td>
										<td className="px-6 py-4">
											<div className="flex items-center gap-1.5">
												<div className="w-2 h-2 rounded-full bg-green-500"></div>
												<span className="text-sm text-white-600">Active</span>
											</div>
										</td>
										<td className="px-6 py-4 text-right">
											<button
												onClick={() => handleClick(user.id)}
												className="inline-flex items-center gap-2 px-3 py-1.5  border border-slate-200 text-white-700 rounded-md hover: hover:border-slate-300 transition-all text-sm font-medium shadow-sm">
												Details
												<ExternalLink className="w-3.5 h-3.5" />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>

				{/* Footer info */}
				<div className="p-4  border-t border-slate-200 text-xs text-white-400 flex justify-between">
					<span>Showing {filteredUsers.length} total user</span>
					<span>System updated: {new Date().toLocaleDateString()}</span>
				</div>
			</div>
		</div>
	);
}
