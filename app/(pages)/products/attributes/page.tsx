"use client";
import React from "react";
import { Plus, Search, Settings2, Trash2, Edit } from "lucide-react";

export default function ProductAttributesPage() {
	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black capitalize">
						Product Features
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Create and manage reusable product attributes
					</p>
				</div>
				<button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
					<Plus size={16} />
					New Attribute
				</button>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				<div className="lg:col-span-2 space-y-8">
					<div className="bg-white border border-gray-100 rounded overflow-hidden">
						<div className="p-6 border-b border-gray-50 bg-gray-50/30">
							<div className="relative">
								<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
								<input 
									type="text" 
									placeholder="Search attributes..." 
									className="w-full bg-white rounded py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-gray-100 focus:border-gold/30 transition-all"
								/>
							</div>
						</div>
						<div className="divide-y divide-gray-50">
							{[
								{ name: "Size", values: ["S", "M", "L", "XL", "XXL"], type: "Selectable" },
								{ name: "Color", values: ["Red", "Blue", "Black", "Gold", "White"], type: "Color Swatch" },
								{ name: "Material", values: ["Leather", "Cotton", "Premium Metal", "Sustainable Wood"], type: "Selectable" },
								{ name: "Weight", values: ["500g", "1kg", "2.5kg", "5kg", "10kg"], type: "Selectable" },
								{ name: "Capacity", values: ["128GB", "256GB", "512GB", "1TB"], type: "Selectable" },
								{ name: "Length", values: ["12\"", "14\"", "16\"", "18\"", "22\"", "30\""], type: "Selectable" },
							].map((attr, i) => (
								<div key={i} className="p-6 lg:p-8 hover:bg-gray-50/50 transition-colors group">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-4">
											<div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-gold group-hover:text-black transition-all">
												<Settings2 size={18} />
											</div>
											<div>
												<h4 className="text-sm font-black uppercase tracking-tight text-black">{attr.name}</h4>
												<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-0.5">{attr.type}</p>
											</div>
										</div>
										<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
											<button className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:bg-white transition-all"><Edit size={14} /></button>
											<button className="w-8 h-8 rounded border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all"><Trash2 size={14} /></button>
										</div>
									</div>
									<div className="flex flex-wrap gap-2">
										{attr.values.map((v, j) => (
											<span key={j} className="text-[9px] font-black uppercase tracking-widest bg-gray-50 border border-transparent hover:border-gold/30 px-3 py-1.5 rounded transition-all cursor-pointer text-gray-400 hover:text-black">
												{v}
											</span>
										))}
										<button className="w-8 h-8 rounded border-2 border-dashed border-gray-100 flex items-center justify-center text-gray-200 hover:border-gold hover:text-gold transition-all">
											<Plus size={14} />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="bg-white border border-gray-100 rounded p-8 space-y-8 self-start">
					<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">Configurable Features</h4>
					<p className="text-[10px] font-medium text-gray-400 leading-relaxed">
						Features allow customers to choose variations of your products. These can be reuseable across all your listings.
					</p>
					<div className="space-y-4">
						<div className="space-y-2.5">
							<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rapid Creation</label>
							<input 
								type="text" 
								placeholder="Feature Name (e.g. Fabric)" 
								className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-black text-black outline-none transition-all placeholder:text-gray-300"
							/>
						</div>
						<button className="w-full py-4 rounded bg-black text-[10px] font-black uppercase tracking-widest text-white hover:bg-gold hover:text-black transition-all">
							Quick Create
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
