import { AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface StatCardProps {
	title: string;
	value: React.ReactNode;
	detail: React.ReactNode;
	trend?: string;
	icon: React.ElementType;
	variant?: "light" | "dark";
	isError?: boolean;
	isLoading?: boolean;
}

export function StatCard({
	title,
	value,
	detail,
	icon: Icon,
	variant = "light",
	isError,
	isLoading,
}: StatCardProps) {
	const isDark = variant === "dark";
	const skeletonClass = isDark ? "bg-white/10" : "bg-gray-50";

	return (
		<div
			className={`rounded p-6 transition-all duration-300 group border h-full flex flex-col justify-between ${
				isDark
					? "bg-black border-black text-white hover:border-gold/40"
				: "bg-white border-gray-100 text-black hover:bg-gold hover:border-gold"
			}`}
		>
			{isLoading ? (
				<>
					<div>
						<Skeleton className={`w-10 h-10 mb-4 ${skeletonClass}`} />
						<Skeleton className={`h-3 w-24 mb-3 ${skeletonClass}`} />
						<Skeleton className={`h-8 w-32 mb-2 ${skeletonClass}`} />
					</div>
					<Skeleton className={`h-3 w-28 ${skeletonClass}`} />
				</>
			) : (
				<>
					<div>
						<div className="flex items-start justify-between mb-4">
							<div
								className={`w-10 h-10 rounded flex items-center justify-center transition-all duration-300 ${
									isDark
										? "bg-white/10 text-gold group-hover:bg-gold group-hover:text-black"
										: "bg-gray-50 text-gray-400 group-hover:bg-black/10 group-hover:text-black"
								}`}
							>
								<Icon size={20} />
							</div>
						</div>
						<p
							className={`text-xs font-bold mb-1.5 transition-colors duration-300 ${
								isDark
									? "text-gray-500 group-hover:text-gold"
									: "text-gray-500 group-hover:text-black/70"
							}`}
						>
							{title}
						</p>
						<h3
							className={`text-2xl lg:text-3xl font-black tracking-tighter mb-2 transition-colors duration-300 flex items-center gap-2 ${
								!isDark && "group-hover:text-black"
							} ${isError ? "text-red-500" : ""}`}
						>
							{value}
							{isError && (
								<AlertCircle size={16} className="text-red-500 animate-pulse" />
							)}
						</h3>
					</div>
					<p
						className={`text-[10px] font-bold transition-colors duration-300 ${
							isDark ? "text-gray-500" : "text-gray-500 group-hover:text-black/60"
						}`}
					>
						{detail}
					</p>
				</>
			)}
		</div>
	);
}
