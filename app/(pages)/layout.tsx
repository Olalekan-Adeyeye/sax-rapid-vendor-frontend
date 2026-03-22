"use client";
import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function PageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	return (
		<div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased text-black overflow-x-hidden">
			{/* Sidebar Component */}
			<Sidebar
				isOpen={isMobileMenuOpen}
				onClose={() => setIsMobileMenuOpen(false)}
			/>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col lg:ml-64 transition-all duration-300 min-w-0 max-w-full overflow-x-hidden">
				<Header onMenuClick={() => setIsMobileMenuOpen(true)} />
				<main className="flex-1 p-4 lg:p-10 w-full max-w-full overflow-x-hidden">
					{children}
				</main>
			</div>
		</div>
	);
}
