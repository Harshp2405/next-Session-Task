"use client";
import React from "react";
import LogoutButton from "./logout";
import { useSelector } from "react-redux";
import { User } from "../../types/User";

interface NavLink {
	label: string;
	href: string;
	roles?: ("Admin" | "Intern")[];
}

interface NavbarProps {
	title: string;
	links?: NavLink[];
}

interface AuthState {
	user: User | null;
	token: string | null;
	isLoggedIn: boolean;
}

interface RootState {
	auth: AuthState;
}

// Default nav items
const NavItems: NavLink[] = [
	{ label: "Home", href: "/" },
	{ label: "About us", href: "/About" },
	{ label: "Intern", href: "/Intern", roles: ["Intern"] },
	{ label: "Admin", href: "/Admin", roles: ["Admin"] },
	{ label: "Add User", href: "/AddUser", roles: ["Admin"] },
];

const Navbar: React.FC<NavbarProps> = ({ title, links = NavItems }) => {
	const { user } = useSelector((state: RootState) => state.auth);
	// console.log(user)

	// Filter links by role
	const filteredLinks = links.filter((link) => {
		if (!link.roles) return true;
		if (!user) return false;
		return link.roles.includes(user.role);
	});

	return (
		<nav className="text-white bg-black text-base p-4">
			<div className="flex justify-items-start items-center">
				<h1 className="text-xl font-bold mr-6">{title}</h1>
				<ul className="flex space-x-4">
					{filteredLinks.map((link) => (
						<li key={link.href}>
							<a
								href={link.href}
								className="text-white text-base hover:underline">
								{link.label}
							</a>
						</li>
					))}
				</ul>
				<div className="mx-2">
					<LogoutButton />
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
