"use client";
import React from "react";
import { ArrowLeft, Save, Plus, Upload } from "lucide-react";
import Link from "next/link";

export default function AddProductPage() {
	return (
		<div className="max-w-4xl mx-auto space-y-12">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-6">
					<Link
						href="/products"
						className="w-10 h-10 rounded border border-gray-100 flex items-center justify-center text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
					>
						<ArrowLeft size={16} />
					</Link>
					<div>
						<h2 className="text-2xl lg:text-3xl font-black tracking-tighter text-black">
							Add New Product
						</h2>
						<p className="text-gray-400 mt-1 uppercase tracking-[0.2em] block text-[10px] font-black">
							Create and publish a new marketplace listing
						</p>
					</div>
				</div>
				<div className="flex gap-3">
					<button className="px-8 py-3.5 rounded border border-gray-100 block text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all">
						Save Draft
					</button>
					<button className="px-8 py-3.5 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center gap-2">
						<Save size={14} />
						Publish Product
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				<div className="lg:col-span-2 space-y-10">
					{/* Basic Info */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">
							General Information
						</h4>
						<div className="space-y-6">
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Product Name
								</label>
								<input
									type="text"
									placeholder="e.g. Premium Wireless Headphones"
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
								/>
							</div>
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Product Description
								</label>
								<textarea
									rows={6}
									placeholder="Describe your product details..."
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300 resize-none"
								/>
							</div>
						</div>
					</div>

					{/* Media */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">
							Product Gallery
						</h4>
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							<div className="aspect-square border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-gold hover:text-gold transition-all cursor-pointer group">
								<Upload
									size={24}
									className="mb-2 group-hover:-translate-y-1 transition-transform"
								/>
								<span className="text-[8px] font-black uppercase tracking-widest">
									Main Product
								</span>
							</div>
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="aspect-square border-2 border-dashed border-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-200 hover:border-gold hover:text-gold transition-all cursor-pointer group"
								>
									<Plus size={20} />
								</div>
							))}
						</div>
						<p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
							Max 4 images. Files must be less than 2MB. Recommended size:
							1000x1000px.
						</p>
					</div>
				</div>

				<div className="space-y-10">
					{/* Pricing & Logic */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">
							Inventory & Pricing
						</h4>
						<div className="space-y-6">
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Base Price (₦)
								</label>
								<input
									type="text"
									placeholder="0.00"
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-black text-black outline-none transition-all placeholder:text-gray-300"
								/>
							</div>
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									SKU Number
								</label>
								<input
									type="text"
									placeholder="PROD-8291-BL"
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
								/>
							</div>
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Stock Quantity
								</label>
								<input
									type="number"
									placeholder="0"
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all placeholder:text-gray-300"
								/>
							</div>
						</div>
					</div>

					{/* Category */}
					<div className="bg-white border border-gray-100 rounded p-8 space-y-8">
						<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50">
							Organization
						</h4>
						<div className="space-y-6">
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Category Selection
								</label>
								<select className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-xs font-bold text-black outline-none transition-all appearance-none">
									<option>Select Category</option>
									<option>Electronics</option>
									<option>Fashion & Accessories</option>
									<option>Home & Garden</option>
								</select>
							</div>
							<div className="space-y-2.5">
								<label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
									Launch Status
								</label>
								<div className="flex gap-2">
									<button className="flex-1 py-3.5 rounded bg-black text-[9px] font-black uppercase tracking-widest text-white border border-black transition-all">
										Publish
									</button>
									<button className="flex-1 py-3.5 rounded bg-white text-[9px] font-black uppercase tracking-widest text-gray-400 border border-gray-100 hover:border-gold transition-all">
										Schedule
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
