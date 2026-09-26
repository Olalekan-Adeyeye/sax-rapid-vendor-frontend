"use client";
import { X, LucideIcon } from "lucide-react";
import React, { useEffect, useState, useId, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	subtitle?: string;
	icon?: LucideIcon;
	children: React.ReactNode;
	size?: "md" | "lg" | "xl";
}

export function Modal({
	isOpen,
	onClose,
	title,
	subtitle,
	icon: Icon,
	children,
	size = "md",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Handle hydration properly to avoid cascading render warnings
		const timer = setTimeout(() => {
			setMounted(true);
		}, 0);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}
		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	useEffect(() => {
		if (!isOpen || !mounted) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		dialogRef.current?.focus();
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, mounted, onClose]);

	if (!isOpen || !mounted) return null;

	const sizeClasses = {
		md: "max-w-md",
		lg: "max-w-lg",
		xl: "max-w-xl",
	};

	const modalContent = (
		<>
			{/* 1. Backdrop (stays fixed behind everything) */}
			<div
				className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity z-9998"
				onClick={onClose}
			/>

			{/* 2. Scrollable Layer */}
			<div className="fixed inset-0 z-9999 overflow-y-auto premium-scrollbar">
				{/* 3. Flex container to handle centering and padding */}
				<div className="flex min-h-full items-center justify-center p-4 md:p-20">
					{/* 4. Actual Modal Box */}
					<div
						ref={dialogRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						tabIndex={-1}
						className={`bg-white rounded w-full ${sizeClasses[size]} relative animate-in fade-in zoom-in duration-200 shadow-2xl shadow-black/20 overflow-hidden outline-none`}
					>
						{/* Header */}
						<div className="p-8 border-b border-gray-50 flex items-center justify-between">
							<div className="flex items-center gap-4">
								{Icon && (
									<div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-black border border-gray-100">
										<Icon size={20} />
									</div>
								)}
								<div>
									<h3
										id={titleId}
										className="text-sm font-black uppercase tracking-widest text-black"
									>
										{title}
									</h3>
									{subtitle && (
										<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-0.5">
											{subtitle}
										</p>
									)}
								</div>
							</div>
							<button
								onClick={onClose}
								aria-label="Close dialog"
								className="text-gray-300 hover:text-black transition-colors p-2"
							>
								<X size={20} />
							</button>
						</div>

						{/* Content */}
						<div className="p-8">{children}</div>
					</div>
				</div>
			</div>
		</>
	);

	return createPortal(modalContent, document.body);
}
