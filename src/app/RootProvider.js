"use client";

import { SessionProvider, useSession } from "next-auth/react";
import ReduxProvider from "../redux/provider";
import Navbar from "../components/navbar";

export default function RootLayout({ children }) {
	return (
		<SessionProvider>
			<ReduxProvider>
				<NavbarWrapper />
				{children}
			</ReduxProvider>
		</SessionProvider>
	);
}

// Separate component to conditionally render Navbar
function NavbarWrapper() {
	const { data: session, status } = useSession();

	// Show nothing while checking session
	if (status === "loading") return null;

	// Render Navbar only if user is logged in
	if (session?.user) {
		return <Navbar />;
	}

	return null;
}
