"use client";
import React from "react";
import {
	Database,
	AlertCircle,
	TrendingDown,
	PackageOpen,
	ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { PageHeader } from "@/components/ui/PageHeader";

export default function InventoryManagementPage() {
	return (
		<div className="space-y-10">
			<PageHeader
				title="Stock Management"
				description="Track inventory levels and low stock alerts"
				actions={
					<Button rounded="full" className="py-3.5" size="sm">
						<Database size={16} />
						Stock Update
					</Button>
				}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white border border-gray-100 rounded p-6 lg:p-8 hover:border-gold transition-all group">
					<p className="text-xs font-bold text-gray-500 mb-4 transition-colors">
						Total Items in Stock
					</p>
					<h3 className="text-3xl font-black text-black tracking-tighter mb-2">
						4,821
					</h3>
					<div className="flex items-center gap-2">
						<div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
						<p className="text-[10px] font-bold text-gray-400">
							Healthy levels
						</p>
					</div>
				</div>
				<div className="bg-white border border-gray-100 rounded p-6 lg:p-8 hover:border-red-500 transition-all group">
					<p className="text-xs font-bold text-gray-500 mb-4 transition-colors">
						Low Stock Alerts
					</p>
					<h3 className="text-3xl font-black text-red-500 tracking-tighter mb-2">
						12
					</h3>
					<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
						<AlertCircle size={12} className="text-red-500" />
						Needs restock soon
					</p>
				</div>
				<div className="bg-white border border-gray-100 rounded p-6 lg:p-8 hover:border-black transition-all group">
					<p className="text-xs font-bold text-gray-500 mb-4 transition-colors">
						Out of Stock
					</p>
					<h3 className="text-3xl font-black text-gray-400 tracking-tighter mb-2">
						8
					</h3>
					<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
						<TrendingDown size={12} className="text-gray-400" />
						Potential sales lost
					</p>
				</div>
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-6 border-b border-gray-50 bg-gray-50/10">
					<SearchInput
						placeholder="Search inventory..."
						variant="white"
						focusColor="black"
						fullWidth
						className="max-w-md"
					/>
				</div>

				<div className="divide-y divide-gray-50">
					{[
						{
							name: "Premium Watch 5 (Silver)",
							sku: "JW-8291-SL",
							level: 5,
							total: 100,
							status: "Low Stock",
						},
						{
							name: "Studio Headphones (Gray)",
							sku: "AUD-9102-G",
							level: 12,
							total: 50,
							status: "Healthy",
						},
						{
							name: "Speed Sneakers (Red/42)",
							sku: "FTW-3829-R-42",
							level: 0,
							total: 30,
							status: "Out of Stock",
						},
						{
							name: "Dashed Fragrance (100ml)",
							sku: "BTY-1102-100",
							level: 156,
							total: 200,
							status: "Healthy",
						},
					].map((item, i) => (
						<div
							key={i}
							className="p-6 lg:p-8 hover:bg-gray-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6 group"
						>
							<div className="flex items-center gap-6 flex-1">
								<div
									className={`w-12 h-12 rounded bg-gray-50 flex items-center justify-center ${item.level === 0 ? "text-red-500 bg-red-50" : item.level <= 10 ? "text-gold bg-gold/5" : "text-gray-300"}`}
								>
									<PackageOpen size={20} />
								</div>
								<div>
									<h4 className="text-sm font-bold text-black">{item.name}</h4>
									<p className="text-[10px] font-bold text-gray-400 mt-1">
										SKU: {item.sku}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-10 md:gap-14 shrink-0">
								<div className="w-32">
									<div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
										<span
											className={
												item.level <= 10 ? "text-red-500" : "text-black"
											}
										>
											{item.level} units
										</span>
										<span className="text-gray-300">{item.total} max</span>
									</div>
									<div className="h-1 bg-gray-100 rounded-full overflow-hidden">
										<div
											className={`h-full transition-all duration-1000 ${
												item.level === 0
													? "w-0"
													: item.level <= 10
														? "bg-red-500"
														: "bg-gold"
											}`}
											style={{ width: `${(item.level / item.total) * 100}%` }}
										/>
									</div>
								</div>
								<div className="flex items-center gap-4">
									<span
										className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
											item.status === "Healthy"
												? "bg-green-50 text-green-600"
												: item.status === "Low Stock"
													? "bg-gold/20 text-gold"
													: "bg-red-50 text-red-600"
										}`}
									>
										{item.status}
									</span>
									<button className="text-gray-300 hover:text-black transition-all group-hover:translate-x-1">
										<ArrowUpRight size={18} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
