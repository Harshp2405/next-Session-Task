import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../../lib/prisma";
import crypto from "crypto";

export const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const user = await prisma.user.findUnique({
					where: { email: credentials.email.toLowerCase() },
				});

				if (!user) return null;

				const isValid = await bcrypt.compare(
					credentials.password,
					user.password,
				);
				if (!isValid) return null;

				const sessionToken = crypto.randomUUID();
				const expires = new Date(Date.now() + 60 * 60 * 1000);

				await prisma.session.create({
					data: {
						userId: user.id,
						sessionToken,
						expires,
					},
				});

				const accessToken = jwt.sign(
					{ id: user.id, email: user.email, role: user.role },
					process.env.JWT_SECRET,
					{ expiresIn: "1h" },
				);

				

				return {
					id: user.id,
					name: user.name,
					email: user.email,
					role: user.role,
					sessionToken,
					accessToken,
				};
			},
		}),
	],

	session: {
		strategy: "jwt", // can still use JWT sessions for frontend
	},

	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.accessToken = user.accessToken;
				token.sessionToken = user.sessionToken;
			}
			return token;
		},

		async session({ session, token }) {
			session.user.id = token.id;
			session.user.role = token.role;
			session.accessToken = token.accessToken;
			session.sessionToken = token.sessionToken; // optional
			return session;
		},

		async signOut({ token }) {
			try {
				if (token?.sessionToken) {
					await prisma.session.delete({
						where: { sessionToken: token.sessionToken },
					});
				}
			} catch (err) {
				console.error("Error deleting session on signOut:", err);
			}
			return true;
		},
	},

	pages: {
		signIn: "/Login",
	},

	secret: process.env.NEXTAUTH_SECRET,

	cookies: {
		sessionToken: {
			name: "next-auth.session-token",
			options: {
				httpOnly: true, // cannot be accessed by JS
				secure: process.env.NODE_ENV === "production",
				sameSite: "lax",
				path: "/",
			},
		},
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
