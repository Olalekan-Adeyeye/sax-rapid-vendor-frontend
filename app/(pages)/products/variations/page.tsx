"use client";
import React from "react";
import { Plus, Search, Edit, Trash2, Layers2 } from "lucide-react";

export default function ProductVariationsPage() {
	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black uppercase">
						Product Variations
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Manage multiple versions of a single product listing
					</p>
				</div>
				<button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
					<Plus size={16} />
					Bulk Variations
				</button>
			</div>

			<div className="bg-white border border-gray-100 rounded overflow-hidden">
				<div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
						<input 
							type="text" 
							placeholder="Search by parent product or SKU..." 
							className="w-full bg-gray-50 rounded py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-transparent focus:border-gold/30 transition-all placeholder:text-gray-300"
						/>
					</div>
					<div className="flex items-center gap-3">
						<button className="px-6 py-3 rounded border border-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2">
							<Plus size={14} />
							Add Variation
						</button>
					</div>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full text-left min-w-250">
						<thead className="bg-gray-50 border-b border-gray-100">
							<tr>
								{["Parent Product", "Variation Details", "SKU", "Price", "Stock", "Status", ""].map((th) => (
									<th key={th} className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">{th}</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-50">
							{[
								{ parent: "Premium T-Shirt", details: "Size: XL · Color: Black", sku: "TS-8291-XL-B", price: "₦12,500", stock: 84, status: "Active" },
								{ parent: "Premium T-Shirt", details: "Size: M · Color: Black", sku: "TS-8291-M-B", price: "₦12,500", stock: 12, status: "Active" },
								{ parent: "Classic Sneakers", details: "Size: 42 · Color: White", sku: "FTW-9102-42-W", price: "₦45,000", stock: 0, status: "Out of Stock" },
								{ parent: "Hair Extension", details: "Length: 22\" · Color: Honey Blonde", sku: "HAIR-381-22-HB", price: "₦85,000", stock: 15, status: "Active" },
								{ parent: "Hair Extension", details: "Length: 18\" · Color: Natural Black", sku: "HAIR-381-18-NB", price: "₦65,000", stock: 32, status: "Active" },
							].map((v, i) => (
								<tr key={i} className="hover:bg-gray-50/50 transition-colors group">
									<td className="px-8 py-5">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gray-300">
												<Layers2 size={18} />
											</div>
											<span className="text-xs font-black text-black uppercase tracking-tight">{v.parent}</span>
										</div>
									</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase">{v.details}</td>
									<td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">{v.sku}</td>
									<td className="px-8 py-5 text-xs font-black text-black">{v.price}</td>
									<td className="px-8 py-5 text-xs font-black text-black">{v.stock} pcs</td>
									<td className="px-8 py-5">
										<span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${v.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
											{v.status}
										</span>
									</td>
									<td className="px-8 py-5 text-right">
										<div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:border-gold transition-all"><Edit size={12} /></button>
											<button className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all"><Trash2 size={12} /></button>
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
