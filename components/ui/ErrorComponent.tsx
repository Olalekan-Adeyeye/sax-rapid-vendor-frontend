"use client";
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface ErrorComponentProps {
	message: string;
	onRetry: () => void;
	title?: string;
}

export const ErrorComponent: React.FC<ErrorComponentProps> = ({
	message,
	onRetry,
	title = "Operational Error",
}) => {
	return (
		<div className="flex flex-col items-center justify-center p-8 lg:p-12 text-center min-h-100 animate-in fade-in duration-700">
			<div className="relative mb-8">
				<div className="absolute inset-0 bg-red-500/10 blur-[100px] rounded-full" />
				<div className="relative w-24 h-24 rounded-3xl bg-white border border-red-50 flex items-center justify-center shadow-[0_20px_50px_rgba(239,68,68,0.05)]">
					<div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
						<AlertCircle size={36} className="text-red-500" />
					</div>
				</div>
				<div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border border-red-100 flex items-center justify-center animate-bounce">
					<div className="w-2 h-2 rounded-full bg-red-500" />
				</div>
			</div>

			<h2 className="text-2xl lg:text-3xl font-black tracking-tighter text-black mb-3">
				{title}
			</h2>

			<div className="max-w-md w-full mb-10">
				<p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] text-center leading-relaxed">
					{message}
				</p>
			</div>

			<Button
				variant="black"
				size="lg"
				onClick={onRetry}
				className="group px-12!"
			>
				<RefreshCw
					size={16}
					className="group-hover:rotate-180 transition-transform duration-700"
				/>
				Retry Connection
			</Button>

			<div className="mt-12 flex items-center gap-4">
				<div className="h-px w-8 bg-gray-100" />
				<p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em]">
					Sax Rapid Terminal
				</p>
				<div className="h-px w-8 bg-gray-100" />
			</div>
		</div>
	);
};
