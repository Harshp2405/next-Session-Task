
import Image from "next/image";
import Link from "next/link";
import { UserList } from "./lib/useAuth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";



export default async function Home() {

	const session = await getServerSession(authOptions);

	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			Welcome to Home Page {session.user.name}
		</div>
	);
}
