"use client";

import { useEffect } from "react";
import { getSingleUser, userlist } from "../../lib/useAdmin";


export default function Admin() {
	useEffect(() => {
		const fetchUsers = async () => {
			const users = await userlist();
			console.log(users , "All Users ==================================");
		};
		fetchUsers();
	}, []);

	const handleClick = async () => {
		const user = await getSingleUser("69b8db248099b8293368bb8d");
		console.log(user , "Single User===================================");
	};

	return (
		<div>
			Admin page
			<button onClick={handleClick}>Click</button>
		</div>
	);
}
