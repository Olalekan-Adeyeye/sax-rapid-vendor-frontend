import { AlertCircle } from "lucide-react";

interface PerformanceDataPoint {
	revenue: number;
	ordersCount: number;
	date: string;
}

interface RevenueChartProps {
	data: PerformanceDataPoint[] | undefined;
	isLoading: boolean;
	isError: boolean;
}

export function RevenueChart({ data, isLoading, isError }: RevenueChartProps) {
	return (
		<div className="h-48 relative w-full group">
			{isLoading ? (
				<div className="w-full h-full bg-gray-50 rounded animate-pulse" />
			) : isError ? (
				<div className="w-full h-full flex items-center justify-center bg-red-50/10 rounded">
					<div className="text-center space-y-2">
						<AlertCircle size={20} className="text-red-500 mx-auto" />
						<p className="text-xs font-bold text-red-500">
							Failed to load performance data
						</p>
					</div>
				</div>
			) : data && data.length > 0 ? (
				<svg
					viewBox="0 0 1200 300"
					className="w-full h-full overflow-visible drop-shadow-[0_10px_10px_rgba(239,191,4,0.05)]"
					preserveAspectRatio="none"
				>
					<defs>
						<linearGradient
							id="chartGradient"
							x1="0"
							y1="0"
							x2="0"
							y2="1"
						>
							<stop offset="0%" stopColor="#EFBF04" stopOpacity="0.15" />
							<stop offset="100%" stopColor="#EFBF04" stopOpacity="0" />
						</linearGradient>
					</defs>

					<line
						x1="0"
						y1="0"
						x2="1200"
						y2="0"
						stroke="#f1f5f9"
						strokeWidth="1"
					/>
					<line
						x1="0"
						y1="100"
						x2="1200"
						y2="100"
						stroke="#f1f5f9"
						strokeWidth="1"
					/>
					<line
						x1="0"
						y1="200"
						x2="1200"
						y2="200"
						stroke="#f1f5f9"
						strokeWidth="1"
					/>
					<line
						x1="0"
						y1="300"
						x2="1200"
						y2="300"
						stroke="#f1f5f9"
						strokeWidth="1"
					/>

					{(() => {
						const maxRevenue = Math.max(
							...data.map((d) => d.revenue),
							1,
						);
						const points = data.map((d, i) => ({
							x: (i / Math.max(data.length - 1, 1)) * 1200,
							y: 300 - (d.revenue / maxRevenue) * 280,
							...d,
						}));

						const pathData =
							"M" + points.map((p) => `${p.x},${p.y}`).join(" L");
						const areaData = `M0,300 L${points.map((p) => `${p.x},${p.y}`).join(" L")} L1200,300 Z`;

						return (
							<>
								<path d={areaData} fill="url(#chartGradient)" />
								<path
									d={pathData}
									fill="none"
									stroke="#EFBF04"
									strokeWidth="4"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								{points
									.filter(
										(_, i) =>
											i % Math.max(Math.floor(points.length / 4), 1) ===
											0,
									)
									.map((p, i) => (
										<circle
											key={i}
											cx={p.x}
											cy={p.y}
											r="5"
											fill="white"
											stroke="#EFBF04"
											strokeWidth="2"
											className="transition-all duration-300"
										/>
									))}
							</>
						);
					})()}
				</svg>
			) : (
				<div className="w-full h-full flex items-center justify-center bg-gray-50 rounded">
					<p className="text-xs font-bold text-gray-400">
						No performance data available
					</p>
				</div>
			)}

			{/* X-Axis Labels */}
			<div className="absolute -bottom-4 left-0 right-0 flex justify-between text-[8px] font-black uppercase tracking-widest text-gray-300">
				{data && data.length > 0 ? (
					data
						.filter(
							(_, i) =>
								i %
									Math.max(Math.floor(data.length / 7), 1) ===
									0,
						)
						.map((d, i) => {
							const date = new Date(d.date);
							return (
								<span key={i}>
									{date.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									})}
								</span>
							);
						})
				) : (
					<>
						{["Jan", "Mar", "May", "Jul", "Sep", "Nov", "Dec"].map(
							(m) => (
								<span key={m}>{m}</span>
							),
						)}
					</>
				)}
			</div>
		</div>
	);
}
