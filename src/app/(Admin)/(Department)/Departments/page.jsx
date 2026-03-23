"use client";

import { useEffect, useState } from "react";
import { Department } from "../../../lib/useAdmin";

const page = () => {
	const [departments, setDepatrments] = useState([]);

	useEffect(() => {
		const fetchDepatrment = async () => {
			const data = await Department();
			setDepatrments(data);
		};
		fetchDepatrment();
	}, []);

    console.log(departments);


	return (
		<div className="min-h-screen p-6 bg-gray-900 text-white">
			<h1 className="text-3xl font-bold mb-6">Departments</h1>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				{departments.map((dept) => {
					const head = dept.user.find((u) => u.id === dept.headId);

					return (
						<div
							key={dept.id}
							className="bg-gray-800 rounded-xl p-5 shadow-md border border-gray-700">
							{/* Department Name */}
							<h2 className="text-xl font-semibold mb-2">{dept.name}</h2>
							<p className="text-xs text-gray-400 mb-2">
								{dept.user.length} Members
							</p>
							{/* Head */}
							<p className="text-sm text-gray-400 mb-3">
								Head:{" "}
								<span className="text-white font-medium">
									{head ? head.name : "Not assigned"}
								</span>
							</p>

							{/* Members */}
							<div>
								<p className="text-sm text-gray-400 mb-2">Members:</p>

								<div className="space-y-2">
									{dept.user.map((user) => (
										<div
											key={user.id}
											className="flex justify-between items-center bg-gray-700 px-3 py-2 rounded-md">
											<div>
												<p className="text-sm font-medium">{user.name}</p>
												<p className="text-xs text-gray-300">{user.email}</p>
											</div>

											<div className="text-xs px-2 py-1 rounded bg-blue-600">
												{user.role}
											</div>
										</div>
									))}

									{dept.user.length === 0 && (
										<p className="text-xs text-gray-400">No members yet</p>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);;
};

export default page;
