"use client";
import React, { useState, useEffect } from "react";
import {
	Store,
	Save,
	MapPin,
	Mail,
	Phone,
	Briefcase,
	Check,
	Loader2,
	AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { getErrorMessage } from "@/lib/utils/errors";
import { getMyVendorProfile } from "@/lib/api/services/vendor";
import type { VendorProfileResponse } from "@/lib/api/types/vendor.types";

export default function StoreProfile() {
	const [vendor, setVendor] = useState<VendorProfileResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchVendor = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getMyVendorProfile();
			setVendor(data);
		} catch (err: unknown) {
			console.error("Failed to fetch vendor profile:", err);
			const message = getErrorMessage(err, "Failed to load store profile. Please try again later.");
			setError(message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchVendor();
	}, [fetchVendor]);

	const GENERIC_BANNER = "/assets/images/signup_bg.png";
	const DEFAULT_LOGO = "/assets/icons/SaxRapid-Logo.png";

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
				<div className="relative w-16 h-16">
					<Loader2 className="w-full h-full text-gold animate-spin" />
					<div className="absolute inset-0 flex items-center justify-center">
						<Store size={16} className="text-black" />
					</div>
				</div>
				<p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
					Syncing Store Identity...
				</p>
			</div>
		);
	}

	if (error || !vendor) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center max-w-md mx-auto">
				<div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500">
					<AlertCircle size={40} />
				</div>
				<div>
					<h3 className="text-xl font-black tracking-tighter text-black">
						Initialization Failed
					</h3>
					<p className="text-gray-400 mt-2 text-sm leading-relaxed">
						{error || "We couldn't retrieve your store profile at this time."}
					</p>
				</div>
				<button
					onClick={fetchVendor}
					className="px-8 py-4 rounded bg-black text-[10px] font-black uppercase tracking-widest text-white hover:bg-gold hover:text-black transition-all"
				>
					Retry Connection
				</button>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto space-y-12">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						Store Profile
					</h2>
					<p className="text-gray-400 mt-1 uppercase tracking-[0.2em] text-[10px] font-black">
						Public storefront identity and business summary
					</p>
				</div>
				<Link
					href="/store/edit"
					className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 shadow-sm active:scale-95"
				>
					<Save size={16} />
					Edit Store Profile
				</Link>
			</div>

			{/* Banner & Logo Section */}
			<div className="space-y-8">
				<div className="relative h-64 lg:h-80 w-full bg-gray-50 rounded overflow-hidden shadow-sm border border-gray-100">
					<Image
						src={vendor.bannerUrl || GENERIC_BANNER}
						alt="Store Banner"
						fill
						className="object-cover opacity-90"
						priority
						unoptimized
					/>

					{/* Logo Overlay */}
					<div className="absolute bottom-8 left-8 flex items-end gap-6">
						<div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-white border-4 border-white rounded overflow-hidden shadow-xl">
							<Image
								src={vendor.logoUrl || DEFAULT_LOGO}
								alt="Logo"
								fill
								className="object-contain p-4"
							/>
						</div>
						<div className="pb-4">
							<div className="flex items-center gap-2 mb-1.5">
								<span className="text-[10px] font-black uppercase tracking-widest bg-gold/90 backdrop-blur-sm px-2.5 py-1 rounded-sm text-black shadow-sm">
									{vendor.accountType} Vendor
								</span>
							</div>
							<h3 className="text-3xl lg:text-4xl font-black tracking-tighter text-white drop-shadow-2xl">
								{vendor.shopName || "Untitled Store"}
							</h3>
							<div className="flex items-center gap-2 mt-2">
								<span className="text-[9px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-sm text-white border border-white/5 shadow-sm">
									Est. {new Date(vendor.createdAt).getFullYear()}
								</span>
								<span className="text-[9px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-sm text-white border border-white/5 shadow-sm">
									ID: {vendor.id?.slice(0, 8) || "N/A"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
				<div className="lg:col-span-2 space-y-10">
					{/* About Store */}
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
						<h4 className="text-[11px] font-black tracking-[0.3em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3 uppercase">
							<Store size={14} />
							About the Store
						</h4>
						<div className="space-y-10">
							<div className="space-y-4">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block pb-1 border-b border-gray-50/50 w-fit">
									Description
								</label>
								<p className="text-sm font-medium text-gray-600 leading-8 lg:leading-loose">
									{vendor.description ||
										"No description provided yet. Complete your profile to help customers find you."}
								</p>
							</div>
						</div>
					</div>

					{/* Contact Details */}
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
						<h4 className="text-[11px] font-black tracking-[0.3em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3 uppercase">
							<MapPin size={14} />
							Verified Location & Contact
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
									<Mail size={12} className="text-gold" />
									Official Email
								</label>
								<p className="text-sm font-black text-black tracking-tight">
									{vendor.ownerEmail}
								</p>
							</div>
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
									<Phone size={12} className="text-gold" />
									Store Ownership
								</label>
								<p className="text-sm font-black text-black tracking-tight">
									{vendor.ownerName}
								</p>
							</div>
							<div className="space-y-3 md:col-span-2">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
									<MapPin size={12} className="text-gold" />
									Primary Store Address
								</label>
								<p className="text-sm font-black text-black tracking-tight leading-relaxed">
									{vendor.storeAddress || "Address not provided"}
									{vendor.storeCity && `, ${vendor.storeCity}`}
									{vendor.storeState && `, ${vendor.storeState}`}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-10">
					{/* Status Card */}
					<div className="bg-black text-white rounded p-10 space-y-10 relative overflow-hidden group shadow-xl">
						<div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded-full group-hover:bg-gold/20 transition-all duration-700" />
						<div className="absolute top-0 right-0 p-4 opacity-10">
							<Check size={80} />
						</div>

						<h4 className="text-[11px] font-black tracking-[0.3em] text-gold pb-6 border-b border-white/5 relative z-10 uppercase">
							Security & Status
						</h4>

						<div className="space-y-8 relative z-10">
							<div className="flex items-center gap-5">
								<div
									className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${vendor.verificationStatus === "Verified" ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"}`}
								>
									{vendor.verificationStatus === "Verified" ? (
										<Check size={24} />
									) : (
										<AlertCircle size={24} />
									)}
								</div>
								<div>
									<p className="text-[10px] font-black uppercase tracking-widest text-white">
										{vendor.verificationStatus === "Verified"
											? "Merchant Verified"
											: "Pending Verification"}
									</p>
									<p className="text-[8px] font-black uppercase tracking-widest text-gray-500 mt-1.5 flex items-center gap-1.5">
										<Check size={8} /> Since{" "}
										{new Date(vendor.createdAt).toLocaleDateString("en-US", {
											month: "short",
											year: "numeric",
										})}
									</p>
								</div>
							</div>

							<div className="pt-6 border-t border-white/5 space-y-4">
								<div className="flex items-center justify-between">
									<span className="text-[9px] font-black uppercase tracking-widest text-gray-500">
										Inventory Cap
									</span>
									<span className="text-xs font-black text-gold">
										{vendor.productLimit} SKU Limit
									</span>
								</div>
								<div className="h-1 bg-white/5 rounded-full overflow-hidden">
									<div className="h-full bg-gold/40 w-1/3 rounded-full" />
								</div>
							</div>
						</div>
					</div>

					{/* Business Info Card */}
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)]">
						<h4 className="text-[11px] font-black tracking-[0.3em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3 uppercase">
							<Briefcase size={14} />
							Legal Identity
						</h4>
						<div className="space-y-8">
							<div className="space-y-2">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									RC Number / CAC
								</p>
								<p className="text-xs font-black text-black">
									{vendor.businessRegistrationNumber || "N/A"}
								</p>
							</div>
							<div className={`space-y-2 ${!vendor.companyName && "hidden"}`}>
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									Registered Business Name
								</p>
								<p className="text-xs font-black text-black leading-relaxed">
									{vendor.companyName}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
