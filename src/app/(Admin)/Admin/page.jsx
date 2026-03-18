"use client";


import { useEffect, useState } from "react";
import { getSingleUser, userlist } from "../../lib/useAdmin";
import { useRouter } from "next/navigation";

export default function Admin() {
	const [users, setUsers] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const router = useRouter()

	useEffect(() => {
		const fetchUsers = async () => {
			const data = await userlist();
			setUsers(data);
		};
		fetchUsers();
	}, []);

	const handleClick = async (id) => {
		const user = await getSingleUser(id);
		router.push(`/${id}`)
		// setSelectedUser(user);
	};

	return (
		<div className="min-h-screen  p-6">
			<h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

			{/* Users List */}
			<div className="shadow rounded-xl p-4 mb-6">
				<h2 className="text-lg font-semibold mb-4">All Users</h2>

				{users.length === 0 ? (
					<p className="text-gray-500">No users found</p>
				) : (
					<div className="space-y-3">
						{users.map((user) => (
							<div
								key={user.id}
								className="flex justify-between items-center border p-3 rounded-lg">
								<div>
									<p className="font-medium">{user.name}</p>
									<p className="text-sm text-gray-500">{user.email}</p>
									<span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
										{user.role}
									</span>
								</div>

								<button
									onClick={() => handleClick(user.id)}
									className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
									View
								</button>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Selected User */}
			{selectedUser && (
				<div className=" shadow rounded-xl p-4">
					<h2 className="text-lg font-semibold mb-4">User Details</h2>

					<p>
						<strong>Name:</strong> {selectedUser.name}
					</p>
					<p>
						<strong>Email:</strong> {selectedUser.email}
					</p>
					<p>
						<strong>Role:</strong> {selectedUser.role}
					</p>
					<p>
						<strong>Created At:</strong>{" "}
						{new Date(selectedUser.createdAt).toLocaleString()}
					</p>
				</div>
			)}
		</div>
	);
}