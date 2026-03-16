
import Link from 'next/link';
import React from 'react';

const About = () => {


  const blog = [
		{ id: 1, title: "Getting Started with Next.js", href: "/About/1" },
		{ id: 2, title: "Mastering Tailwind CSS", href: "/About/2" },
		{ id: 3, title: "Understanding Route Groups", href: "/About/3" },
		{ id: 4, title: "Deploying to Vercel", href: "/About/4" },
	];

  return (
		<div className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-8">
			{blog.map((item , id) => (
					<div key={id} className="flex flex-col space-y-2 group p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
						<span className="text-sm font-medium text-blue-600">
							Article #{item.id}
						</span>
						<h2 className="text-xl font-bold text-gray-900 ">
							{item.title}
						</h2>
						<p className="text-gray-500 text-sm">
							Click to read more about this topic and explore our latest
							insights.
						</p>
						<Link
							key={item.id}
							href={item.href}
							className=" hover:border-blue-800 transition-all">
							<div className="pt-4 text-blue-500 font-semibold inline-flex items-center">
								Read More
								<span className="ml-1 group-hover:translate-x-1 transition-transform">
									→
								</span>
							</div>
						</Link>
					</div>
			))}
			<h1 className="text-4xl font-bold mb-4">About Us</h1>
			<p className="max-w-2xl text-center mb-6">
				Welcome to our company! We are dedicated to providing the best services
				and products to our customers. Our mission is to deliver high-quality
				solutions with integrity and innovation.
			</p>
			<div className="flex space-x-4">
				<span className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition">
					Contact Us
				</span>
				<span className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded transition">
					Our Products
				</span>
			</div>
		</div>
	);
};

export default About;