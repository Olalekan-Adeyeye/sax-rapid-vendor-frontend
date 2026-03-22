import React from "react";

interface BenefitCardProps {
	title: string;
	desc: string;
	icon: React.ReactNode;
	accent?: boolean;
}

export function BenefitCard({ title, desc, icon, accent }: BenefitCardProps) {
	return (
		<div
			className={`${
				accent
					? "bg-black text-white"
					: "bg-white text-black border border-gray-100"
			} p-8 rounded group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-default`}
		>
			<div
				className={`w-16 h-16 rounded flex items-center justify-center text-3xl mb-7 transition-transform duration-300 group-hover:scale-110 ${
					accent ? "bg-gold/10" : "bg-gray-50"
				}`}
			>
				{icon}
			</div>
			<h3
				className={`text-base font-black uppercase tracking-widest mb-3 ${
					accent ? "text-gold" : "text-black"
				}`}
			>
				{title}
			</h3>
			<p
				className={`text-sm leading-relaxed ${
					accent ? "text-white/60" : "text-gray-500"
				}`}
			>
				{desc}
			</p>
		</div>
	);
}
