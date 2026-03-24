"use client";
import React from "react";
import { Plus, Search, MoreVertical, Layers, ArrowUpRight } from "lucide-react";

export default function ProductCategoriesPage() {
	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						Product Categories
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Organize your products into marketplace categories
					</p>
				</div>
				<button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
					<Plus size={16} />
					New Category Request
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
									placeholder="Search categories..." 
									className="w-full bg-white rounded py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-gray-100 focus:border-gold/30 transition-all"
								/>
							</div>
						</div>
						<div className="divide-y divide-gray-50">
							{[
								{ name: "Electronics", items: 124, status: "Active" },
								{ name: "Fast Fashion", items: 82, status: "Active" },
								{ name: "Beauty & Skin Care", items: 45, status: "Active" },
								{ name: "Home Appliances", items: 23, status: "Active" },
								{ name: "Audio Gear", items: 12, status: "Draft" },
							].map((cat, i) => (
								<div key={i} className="p-6 lg:p-8 hover:bg-gray-50/50 transition-colors flex items-center justify-between group">
									<div className="flex items-center gap-6">
										<div className="w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-gold group-hover:text-black transition-all">
											<Layers size={20} />
										</div>
										<div>
											<h4 className="text-sm font-black uppercase tracking-tight text-black flex items-center gap-3">
												{cat.name}
												<span className="text-[9px] font-black tracking-widest bg-gray-100 px-2 py-0.5 rounded text-gray-400">{cat.items} products</span>
											</h4>
											<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Main marketplace category</p>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${cat.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
											{cat.status}
										</span>
										<button className="text-gray-300 hover:text-black transition-colors">
											<MoreVertical size={18} />
										</button>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="bg-white border border-gray-100 rounded p-8 flex flex-col items-center text-center space-y-6 self-start">
					<div className="w-16 h-16 rounded bg-gold/10 flex items-center justify-center text-gold">
						<ArrowUpRight size={24} />
					</div>
					<div>
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-2">Can't find a category?</h4>
						<p className="text-[10px] font-medium text-gray-400 leading-relaxed px-4">
							Our marketplace is constantly growing. If your product type is not listed, you can request a new category.
						</p>
					</div>
					<button className="w-full py-4 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all">
						Submit Proposal
					</button>
				</div>
			</div>
		</div>
	);
}
