"use client";

import React, { useEffect, useState } from "react";
import { ListOfHead } from "../../../lib/useAdmin";
import {
	ShieldCheck,
	Building2,
	Mail,
	School,
	Calendar,
	Search,
	UserCircle2,
	Loader2,
	ChevronRight,
} from "lucide-react";

const HeadListPage = () => {
	const [heads, setHeads] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		const fetchHeads = async () => {
			try {
				const hd = await ListOfHead();
				console.log(hd)
				setHeads(Array.isArray(hd) ? hd : []);
			} catch (err) {
				console.error("Error fetching heads:", err);
			} finally {
				setLoading(false);
			}
		};
		fetchHeads();
	}, []);

	// SAFE FILTER: Prevents "toLowerCase of undefined" crash
	const filteredHeads = heads.filter((head) => {
		const name = (head?.headOf.name || "").toLowerCase();
		const email = (head?.headOf.email || "").toLowerCase();
		const query = searchTerm.toLowerCase();

		return name.includes(query) || email.includes(query);
	});

	return (
		<div className="min-h-screen bg-black text-zinc-100 p-6 md:p-12 selection:bg-blue-500/30">
			{/* Header Section */}
			<div className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
				<div className="space-y-2">
					<div className="flex items-center gap-2 text-blue-500 font-medium text-sm tracking-wider uppercase">
						<span className="w-8 h-[1px] bg-blue-500"></span>
						Administration
					</div>
					<h1 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
						Department Heads
						<span className="text-sm font-normal bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full border border-zinc-700">
							{filteredHeads.length} Total
						</span>
					</h1>
				</div>

				{/* Search Input */}
				<div className="relative w-full md:w-80 group">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
					<input
						type="text"
						placeholder="Search by name or email..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-zinc-600 text-sm"
					/>
				</div>
			</div>

			{loading ? (
				<div className="flex flex-col items-center justify-center py-32">
					<Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
					<p className="text-zinc-500 font-medium animate-pulse">
						Syncing administrative records...
					</p>
				</div>
			) : (
				<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredHeads.map((head, key) => (
						<div
							key={key}
							className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-6 hover:border-zinc-600 hover:bg-zinc-900 transition-all group relative">
							{/* Top Row: Avatar & Identity */}
							<div className="flex items-start justify-between mb-6">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 rounded-xl bg-white text-black flex items-center justify-center text-lg font-black shadow-[0_0_20px_rgba(255,255,255,0.1)]">
										{head?.headOf.head.name
											? head.headOf.head.name.charAt(0).toUpperCase()
											: "?"}
									</div>
									<div className="space-y-1">
										<h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
											{head?.headOf.head.name || "Unknown User"}
										</h3>
										<div className="flex items-center gap-2">
											<span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded border border-zinc-700">
												{head?.headOf.head.role || "Staff"}
											</span>
										</div>
									</div>
								</div>

								{/* Active Indicator */}
								<div className="flex items-center gap-1.5 bg-green-500/5 border border-green-500/10 px-2 py-1 rounded-md">
									<div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
									<span className="text-[9px] font-bold text-green-500 uppercase">
										Live
									</span>
								</div>
							</div>

							{/* Middle: Details */}
							<div className="space-y-3 pt-2">
								<div className="flex items-center gap-3 text-zinc-400 text-sm">
									<div className="p-1.5 bg-zinc-800 rounded-lg">
										<Mail className="w-3.5 h-3.5" />
									</div>
									<span className="truncate hover:text-white transition-colors cursor-pointer">
										{head?.headOf.head.email || "No email provided"}
									</span>
								</div>

								<div className="flex items-center gap-3 text-zinc-400 text-sm">
									<div className="p-1.5 bg-zinc-800 rounded-lg">
										<Building2 className="w-3.5 h-3.5" />
									</div>
									<span>
										Dept:{" "}
										<span className="text-blue-400 font-medium">
											{head?.headOf.name || "Unassigned"}
										</span>
									</span>
								</div>

								<div className="flex items-center gap-3 text-zinc-400 text-sm">
									<div className="p-1.5 bg-zinc-800 rounded-lg">
										<School className="w-3.5 h-3.5" />
									</div>
									<span className="truncate">
										{head?.headOf.head.college || "Internal Staff"}
									</span>
								</div>
							</div>

							{/* Footer: Date & Link */}
							<div className="mt-6 pt-5 border-t border-zinc-800/50 flex items-center justify-between">
								<div className="flex items-center gap-2 text-zinc-600 text-[11px] font-medium">
									<Calendar className="w-3.5 h-3.5" />
									{head?.createdAt
										? new Date(head.headOf.createdAt).toLocaleDateString(
												undefined,
												{
													month: "short",
													day: "numeric",
													year: "numeric",
												},
											)
										: "N/A"}
								</div>
								<button className="text-zinc-400 hover:text-white flex items-center gap-1 text-xs font-semibold transition-all group/btn">
									View Profile
									<ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Empty State */}
			{!loading && filteredHeads.length === 0 && (
				<div className="max-w-md mx-auto text-center py-24 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
					<div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<UserCircle2 className="w-8 h-8 text-zinc-600" />
					</div>
					<h3 className="text-xl font-bold text-white mb-2">
						No results found
					</h3>
					<p className="text-zinc-500 text-sm px-8">
						We couldn't find any department heads matching "
						<span className="text-blue-400">{searchTerm}</span>".
					</p>
					<button
						onClick={() => setSearchTerm("")}
						className="mt-6 text-blue-500 text-sm font-bold hover:underline">
						Clear search
					</button>
				</div>
			)}

			<footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-zinc-900 text-center">
				<p className="text-zinc-700 text-xs font-medium tracking-widest uppercase">
					Administrative Control Panel v2.0
				</p>
			</footer>
		</div>
	);
};

export default HeadListPage;
