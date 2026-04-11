"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
	id: string;
	title: string;
	message: string;
	type: ToastType;
}

interface ToastContextType {
	toast: (title: string, message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const toast = useCallback(
		(title: string, message: string, type: ToastType = "info") => {
			const id = Math.random().toString(36).substring(2, 9);
			setToasts((prev) => [...prev, { id, title, message, type }]);

			// Auto remove after 5 seconds
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, 5000);
		},
		[],
	);

	const removeToast = (id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	};

	return (
		<ToastContext.Provider value={{ toast }}>
			{children}
			{/* Toast Container */}
			<div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-10001 flex flex-col gap-3 sm:gap-4 w-full max-w-[calc(100%-2rem)] sm:max-w-sm pointer-events-none">
				<AnimatePresence mode="popLayout">
					{toasts.map((t) => (
						<motion.div
							key={t.id}
							layout
							initial={{ opacity: 0, x: 50, scale: 0.9 }}
							animate={{ opacity: 1, x: 0, scale: 1 }}
							exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
							className="pointer-events-auto"
						>
							<div className="group relative overflow-hidden bg-white/80 backdrop-blur-xl border border-gray-100 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
								{/* Type Accent */}
								<div
									className={`absolute left-0 top-0 bottom-0 w-1 ${
										t.type === "success"
											? "bg-green-500"
											: t.type === "error"
												? "bg-red-500"
												: t.type === "warning"
													? "bg-gold"
													: "bg-black"
									}`}
								/>

								<div
									className={`w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center shrink-0 ${
										t.type === "success"
											? "bg-green-50 text-green-600"
											: t.type === "error"
												? "bg-red-50 text-red-600"
												: t.type === "warning"
													? "bg-gold/20 text-gold"
													: "bg-gray-50 text-black"
									}`}
								>
									{t.type === "success" && (
										<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
									)}
									{t.type === "error" && (
										<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
									)}
									{t.type === "warning" && (
										<AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
									)}
									{t.type === "info" && (
										<Info className="w-4 h-4 sm:w-5 sm:h-5" />
									)}
								</div>

								<div className="flex-1 min-w-0">
									<h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-black mb-0.5 sm:mb-1">
										{t.title}
									</h4>
									<p className="text-[11px] sm:text-xs text-gray-500 font-medium leading-relaxed">
										{t.message}
									</p>
								</div>

								<button
									onClick={() => removeToast(t.id)}
									className="p-1 text-gray-300 hover:text-black transition-colors"
								>
									<X size={14} />
								</button>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</ToastContext.Provider>
	);
};

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
};
