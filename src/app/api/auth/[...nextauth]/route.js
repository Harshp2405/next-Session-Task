import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user || !user.password) return null;

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password,
				);
				if (!isValid) return null;

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
				};
			},
		}),
	],

	session: {
		strategy: "jwt", // must be "jwt" for CredentialsProvider
	},

	callbacks: {
		async session({ session, token }) {
			session.user.id = token.id;
			session.user.role = token.role;
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
	},

	pages: {
		signIn: "/Login", // your custom login page
	},

	secret: process.env.NEXTAUTH_SECRET,
};

// App Router requires named exports for HTTP methods
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
