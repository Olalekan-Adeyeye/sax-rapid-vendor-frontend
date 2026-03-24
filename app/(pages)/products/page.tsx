"use client";
import React from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ProductsPage() {
	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						All Products
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Manage your product inventory and listings
					</p>
				</div>
				<Link
					href="/products/add"
					className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3"
				>
					<Plus size={16} />
					Add New Product
				</Link>
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="relative flex-1 max-w-md">
						<Search
							className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
							size={16}
						/>
						<input
							type="text"
							placeholder="Search by product name, SKU..."
							className="w-full bg-gray-50 rounded py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-transparent focus:border-gold/30 transition-all placeholder:text-gray-300"
						/>
					</div>
					<div className="flex items-center gap-3">
						<button className="px-6 py-3 rounded border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2">
							<Filter size={14} />
							Filter
						</button>
						<select className="px-6 py-3 rounded border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 outline-none bg-white">
							<option>All Categories</option>
							<option>Electronics</option>
							<option>Fashion</option>
						</select>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left min-w-250">
						<thead className="bg-gray-50 border-b border-gray-100">
							<tr>
								{[
									"Product",
									"Category",
									"Base Price",
									"SKU",
									"Stock",
									"Status",
									"",
								].map((th) => (
									<th
										key={th}
										className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400"
									>
										{th}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{[
								{
									name: "Premium Watch 5",
									cat: "Electronics",
									price: "₦125,000",
									sku: "JW-8291-BL",
									stock: 42,
									status: "Active",
									img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop",
								},
								{
									name: "Studio Headphones",
									cat: "Electronics",
									price: "₦85,000",
									sku: "AUD-9102-S",
									stock: 12,
									status: "Active",
									img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
								},
								{
									name: "Speed Sneakers",
									cat: "Fashion",
									price: "₦45,000",
									sku: "FTW-3829-R",
									stock: 0,
									status: "Out of Stock",
									img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
								},
								{
									name: "Dashed Fragrance",
									cat: "Beauty",
									price: "₦25,000",
									sku: "BTY-1102-V",
									stock: 156,
									status: "Draft",
									img: "https://images.unsplash.com/photo-1585333127302-3f8d9560f63b?w=100&h=100&fit=crop",
								},
							].map((product, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 transition-colors group"
								>
									<td className="px-8 py-5">
										<div className="flex items-center gap-4">
											<div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0 relative flex items-center justify-center">
												<div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
													<div className="w-1/2 h-1/2 relative opacity-20 filter grayscale brightness-0">
														<Image
															src="/assets/icons/SaxRapid-Logo.png"
															alt="Placeholder"
															fill
															className="object-contain"
														/>
													</div>
												</div>
												<Image
													src={product.img}
													alt={product.name}
													fill
													className="object-cover relative z-10"
												/>
											</div>
											<span className="text-sm font-black text-black">
												{product.name}
											</span>
										</div>
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase">
										{product.cat}
									</td>
									<td className="px-8 py-5 text-xs font-black text-black">
										{product.price}
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
										{product.sku}
									</td>
									<td className="px-8 py-5">
										<div className="flex flex-col gap-1.5 min-w-25">
											<div className="flex items-center justify-between text-[10px] font-black uppercase">
												<span
													className={
														product.stock === 0 ? "text-red-500" : "text-black"
													}
												>
													{product.stock} left
												</span>
												<span className="text-gray-300">/ 200</span>
											</div>
											<div className="h-1 bg-gray-50 rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full ${product.stock === 0 ? "bg-red-500" : "bg-gold"}`}
													style={{ width: `${(product.stock / 200) * 100}%` }}
												/>
											</div>
										</div>
									</td>
									<td className="px-8 py-5">
										<span
											className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
												product.status === "Active"
													? "bg-green-50 text-green-600"
													: product.status === "Out of Stock"
														? "bg-red-50 text-red-600"
														: "bg-gray-100 text-gray-400"
											}`}
										>
											{product.status}
										</span>
									</td>
									<td className="px-8 py-5 text-right">
										<div className="flex items-center justify-end gap-2">
											<button className="w-9 h-9 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-gold transition-all">
												<Edit size={14} />
											</button>
											<button className="w-9 h-9 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all">
												<Trash2 size={14} />
											</button>
											<button className="w-9 h-9 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gold transition-all">
												<MoreVertical size={14} />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
