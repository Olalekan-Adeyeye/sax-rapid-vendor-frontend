"use client";
import React from "react";
import { Store, Camera, Save, MapPin, Phone, Mail, Globe, Briefcase, Trash2, Check } from "lucide-react";
import Image from "next/image";

export default function StoreManagement() {
	return (
		<div className="max-w-5xl mx-auto space-y-12">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						Store Profile
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Manage your public storefront and business details
					</p>
				</div>
				<button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
					<Save size={16} />
					Save Changes
				</button>
			</div>

			{/* Banner & Logo Section */}
			<div className="space-y-8">
				<div className="relative h-64 lg:h-80 w-full bg-gray-50 rounded overflow-hidden group">
					<Image
						src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&h=400&fit=crop"
						alt="Store Banner"
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-60"
						priority
					/>
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
						<button className="px-8 py-4 rounded bg-white text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3">
							<Camera size={16} />
							Update Banner
						</button>
					</div>

					{/* Logo Overlay */}
					<div className="absolute bottom-8 left-8 flex items-end gap-6">
						<div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-white border-4 border-white rounded overflow-hidden group/logo">
							<Image
								src="/assets/icons/SaxRapid-Logo.png"
								alt="Logo"
								fill
								className="object-contain p-4 group-hover/logo:scale-110 transition-transform duration-500"
							/>
							<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity bg-black/40">
								<Camera size={24} className="text-white" />
							</div>
						</div>
						<div className="pb-4">
							<h3 className="text-2xl font-black tracking-tighter text-white drop-shadow-lg">TechWorld Enterprise</h3>
							<div className="flex items-center gap-2 mt-2">
								<span className="text-[9px] font-black uppercase tracking-widest bg-gold px-2 py-1 rounded text-black">Platinum Seller</span>
								<span className="text-[9px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded text-white border border-white/10">Est. 2024</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				<div className="lg:col-span-2 space-y-10">
					{/* About Store */}
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<h4 className="text-[11px] font-black tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
							<Store size={14} />
							Store Information
						</h4>
						<div className="space-y-8">
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store Name</label>
								<input 
									type="text" 
									defaultValue="TechWorld Enterprise"
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all"
								/>
							</div>
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Store Description</label>
								<textarea 
									rows={8}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-medium text-gray-400 leading-relaxed outline-none transition-all resize-none"
									defaultValue="Your premium destination for high-end electronics and lifestyle gadgets. We pride ourselves on sourcing only the most authentic and state-of-the-art technology for our elite clientele."
								/>
							</div>
						</div>
					</div>

					{/* Contact Details */}
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<h4 className="text-[11px] font-black tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
							<MapPin size={14} />
							Contact Information
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400"><Mail size={12} className="inline mr-2" />Email Address</label>
								<input 
									type="email" 
									defaultValue="support@techworld.com"
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all"
								/>
							</div>
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400"><Phone size={12} className="inline mr-2" />Phone Number</label>
								<input 
									type="text" 
									defaultValue="+234 812 345 6789"
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all"
								/>
							</div>
							<div className="space-y-3 md:col-span-2">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400"><Globe size={12} className="inline mr-2" />Website (Optional)</label>
								<input 
									type="text" 
									defaultValue="https://techworld.rapid.com"
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-10">
					{/* Business Status */}
					<div className="bg-black text-white rounded p-10 space-y-10 relative overflow-hidden group">
						<div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-gold/10 transition-colors" />
						<h4 className="text-[11px] font-black tracking-[0.2em] text-gold pb-6 border-b border-white/5 relative z-10">Verification Status</h4>
						<div className="space-y-8 relative z-10">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
									<Check size={20} />
								</div>
								<div>
									<p className="text-[10px] font-black uppercase tracking-widest text-white">Identity Verified</p>
									<p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mt-1">Confirmed Dec 2024</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
									<Check size={20} />
								</div>
								<div>
									<p className="text-[10px] font-black uppercase tracking-widest text-white">Address Verified</p>
									<p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mt-1">Lagos, Nigeria</p>
								</div>
							</div>
						</div>
					</div>

					{/* Business Details */}
					<div className="bg-white border border-gray-100 rounded p-10 space-y-8 self-start">
						<h4 className="text-[11px] font-black tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
							<Briefcase size={14} />
							Business Info
						</h4>
						<div className="space-y-6">
							<div className="space-y-2">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">RC Number / Registration</p>
								<p className="text-xs font-black text-black">RC-9821-X4812</p>
							</div>
							<div className="space-y-2">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Tax Identification</p>
								<p className="text-xs font-black text-black">TIN-882193-Y</p>
							</div>
							<div className="space-y-2 text-red-500 pt-6 border-t border-gray-50">
								<button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest hover:bg-red-50 px-4 py-3 rounded transition-all w-full border border-red-50 border-dashed">
									<Trash2 size={12} />
									Delete Business Account
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
