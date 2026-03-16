"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useRouter } from "next/navigation"; 
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/authSclice";

export default function Login() {
	const [message, setMessage] = useState({ text: "", isError: false });
	const router = useRouter();
	const dispatch = useDispatch();


	const { user, token, isLoggedIn } = useSelector((state) => state.auth);
	console.log("Logged In:", isLoggedIn);
	console.log("User:", user);


	const initialValues = {
		email: "",
		password: "",
	};

	const validationSchema = Yup.object({
		email: Yup.string()
			.email("Invalid email address")
			.required("Email is required"),
		password: Yup.string()
			.min(6, "Minimum 6 characters")
			.required("Password is required"),
	});

	const handleSubmit = async (values, { setSubmitting }) => {
		setMessage({ text: "", isError: false });

		try {
			const res = await fetch("/api/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
				credentials: "include",
			});

			let data;
			try {
				data = await res.json();
			} catch (err) {
				console.error("Failed to parse JSON:", err);
				setMessage({ text: "Server returned invalid response", isError: true });
				return;
			}


			if (res.ok) {
				setMessage({
					text: "Login successful! Redirecting...",
					isError: false,
				});

				dispatch(
					loginSuccess({
						user: data.user,
						token: data.token,
					}),
				);

				document.cookie = `token=${data.token}; path=/;`;

				setTimeout(() => router.push("/"), 400);
			} else {
				setMessage({
					text: data.error || "Invalid credentials",
					isError: true,
				});
			}
		} catch (error) {
			setMessage({ text: "Server connection failed", isError: true });
			console.log(error);
		} finally {
			setSubmitting(false); // ALWAYS executes
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
			<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
				<div className="text-center mb-8">
					<h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
					<p className="text-gray-500 mt-2">Please enter your details</p>
				</div>

				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}>
					{({ isSubmitting }) => (
						<Form className="space-y-6">
							{/* Email Field */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email Address
								</label>
								<Field
									name="email"
									type="email"
									placeholder="name@company.com"
									className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-black"
								/>
								<ErrorMessage
									name="email"
									component="div"
									className="text-red-500 text-xs mt-1 font-medium"
								/>
							</div>

							{/* Password Field */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Password
								</label>
								<Field
									name="password"
									type="password"
									placeholder="••••••••"
									className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-black"
								/>
								<ErrorMessage
									name="password"
									component="div"
									className="text-red-500 text-xs mt-1 font-medium"
								/>
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								disabled={isSubmitting}
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all active:scale-[0.98] disabled:bg-blue-300 disabled:cursor-not-allowed">
								{isSubmitting ? "Signing in..." : "Login"}
							</button>
						</Form>
					)}
				</Formik>

				{/* Status Message */}
				{message.text && (
					<div
						className={`mt-6 p-3 rounded-lg text-center text-sm font-medium ${
							message.isError
								? "bg-red-50 text-red-600 border border-red-100"
								: "bg-green-50 text-green-600 border border-green-100"
						}`}>
						{message.text}
					</div>
				)}

				<p className="mt-8 text-center text-sm text-gray-600">
					Do not have an account?{" "}
					<a
						href="/Register"
						className="text-blue-600 font-semibold hover:underline">
						Sign up free
					</a>
				</p>
			</div>
		</div>
	);
}
