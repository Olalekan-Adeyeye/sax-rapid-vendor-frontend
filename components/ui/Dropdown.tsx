"use client";

import React, {
	useState,
	useRef,
	useEffect,
	ReactNode,
	useCallback,
	useSyncExternalStore,
	useLayoutEffect,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Custom hook to handle client-side rendering detection (hydration safe)
 */
const emptySubscribe = () => () => {};
function useIsClient() {
	return useSyncExternalStore(
		emptySubscribe,
		() => true,
		() => false,
	);
}

/**
 * Custom hook to handle coordinate calculation and viewport boundary awareness
 */
function useDropdownPosition(
	triggerRef: React.RefObject<HTMLElement | null>,
	menuRef: React.RefObject<HTMLElement | null>,
	align: "left" | "right",
	isOpen: boolean,
) {
	const [coords, setCoords] = useState({
		top: 0,
		left: 0,
		right: 0,
		isFlipped: false,
		actualAlign: align,
	});

	const updateCoords = useCallback(() => {
		const trigger = triggerRef.current;
		const menu = menuRef.current;
		if (!trigger) return;

		const rect = trigger.getBoundingClientRect();
		const vh = window.innerHeight;
		const vw = window.innerWidth;

		// Initial guesses based on common CSS, will be updated once menuRef is attached
		const menuHeight = menu?.offsetHeight || 200;
		const menuWidth = menu?.offsetWidth || 192;

		const spaceBelow = vh - rect.bottom;
		const shouldFlip = spaceBelow < menuHeight && rect.top > menuHeight;

		let actualAlign = align;
		// Horizontal boundary check: logic to prevent menu from going off-screen
		if (align === "left" && rect.left + menuWidth > vw) actualAlign = "right";
		else if (align === "right" && rect.right - menuWidth < 0) actualAlign = "left";

		setCoords({
			top: shouldFlip ? rect.top : rect.bottom,
			left: rect.left,
			right: vw - rect.right,
			isFlipped: shouldFlip,
			actualAlign,
		});
	}, [triggerRef, menuRef, align]);

	// Use useLayoutEffect for smoother coordinate calculation before paint
	useLayoutEffect(() => {
		if (isOpen) {
			updateCoords();
			const handler = () => updateCoords();
			window.addEventListener("scroll", handler, true);
			window.addEventListener("resize", handler);
			return () => {
				window.removeEventListener("scroll", handler, true);
				window.removeEventListener("resize", handler);
			};
		}
	}, [isOpen, updateCoords]);

	return coords;
}

interface DropdownProps {
	trigger: ReactNode;
	children: ReactNode;
	align?: "left" | "right";
	className?: string;
}

export function Dropdown({
	trigger,
	children,
	align = "right",
	className = "",
}: DropdownProps) {
	const [isOpen, setIsOpen] = useState(false);
	const isClient = useIsClient();
	const dropdownRef = useRef<HTMLDivElement>(null);
	const menuRef = useRef<HTMLDivElement>(null);

	const { top, left, right, isFlipped, actualAlign } = useDropdownPosition(
		dropdownRef,
		menuRef,
		align,
		isOpen,
	);

	// Unified click outside handler
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isOpen]);

	const toggle = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsOpen((prev) => !prev);
	};

	return (
		<div className={`relative inline-block ${className}`} ref={dropdownRef}>
			<div onClick={toggle} className="flex items-center">
				{trigger}
			</div>

			{isClient &&
				createPortal(
					<AnimatePresence>
						{isOpen && (
							<motion.div
								ref={menuRef}
								initial={{ opacity: 0, y: isFlipped ? 10 : -10, scale: 0.95 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: isFlipped ? 10 : -10, scale: 0.95 }}
								transition={{ duration: 0.15, ease: "easeOut" }}
								style={{
									position: "fixed",
									top,
									...(actualAlign === "right" ? { right } : { left }),
									transform: isFlipped ? "translateY(-100%)" : "none",
								}}
								className="z-99999 mt-2 min-w-48 bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-sm"
								onClick={() => setIsOpen(false)}
							>
								{children}
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</div>
	);
}

interface DropdownItemProps {
	children: ReactNode;
	onClick?: (e: React.MouseEvent) => void;
	icon?: ReactNode;
	variant?: "default" | "danger" | "warning";
	className?: string;
	disabled?: boolean;
}

const VARIANT_STYLES = {
	default: "text-gray-600 hover:bg-gray-50 hover:text-black",
	danger: "text-red-500 hover:bg-red-50 hover:text-red-600",
	warning: "text-gold hover:bg-gold/10 hover:text-gold-600",
};

export function DropdownItem({
	children,
	onClick,
	icon,
	variant = "default",
	className = "",
	disabled = false,
}: DropdownItemProps) {
	return (
		<button
			onClick={onClick}
			disabled={disabled}
			className={`w-full px-4 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_STYLES[variant]} ${className}`}
		>
			{icon && <span className="shrink-0">{icon}</span>}
			<span className="truncate">{children}</span>
		</button>
	);
}

export function DropdownDivider() {
	return <div className="h-px bg-gray-50 my-1" />;
}

