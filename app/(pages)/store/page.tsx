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
	AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { getErrorMessage } from "@/lib/utils/errors";
import { PageHeader } from "@/components/ui/PageHeader";
import { getMyVendorProfile } from "@/lib/api/services/vendor";
import type { VendorProfileResponse } from "@/lib/api/types/vendor.types";
import { Button } from "@/components/ui/Button";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { FullPageLoader } from "@/components/common/FullPageLoader";

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
		return <FullPageLoader label="Loading store profile..." icon={Store} />;
	}

	if (error) {
		return (
			<ErrorComponent
				title="Store Identity Sync"
				message={error}
				onRetry={fetchVendor}
			/>
		);
	}

	if (!vendor) {
		return (
			<div className="py-20 text-center">
				<p className="text-gray-400">No profile data available.</p>
			</div>
		);
	}

	return (
		<div className="max-w-5xl mx-auto space-y-12">
			{/* Header Section */}
			<PageHeader
				title="Store Profile"
				description="Public storefront identity and business summary"
				actions={
					<Button asChild rounded="full" size="sm" className="px-8">
						<Link href="/store/edit" className="flex items-center gap-3">
							<Save size={16} />
							Edit Store Information
						</Link>
					</Button>
				}
			/>

			{/* Banner & Logo Section */}
			<div className="space-y-8">
				<div className="relative h-64 lg:h-80 w-full bg-gray-50 rounded overflow-hidden border border-gray-100">
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
						<div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-white border-4 border-white rounded overflow-hidden">
							<Image
								src={vendor.logoUrl || DEFAULT_LOGO}
								alt="Logo"
								fill
								className="object-contain p-4"
							/>
						</div>
						<div className="pb-4">
							<div className="flex items-center gap-2 mb-1.5">
								<span className="text-xs font-bold bg-gold/90 backdrop-blur-sm px-3 py-1 rounded text-black">
									{vendor.accountType} Vendor
								</span>
							</div>
							<h3 className="text-3xl lg:text-4xl font-black tracking-tighter text-white drop-shadow-2xl">
								{vendor.shopName || "Untitled Store"}
							</h3>
							<div className="flex items-center gap-2 mt-2">
								<span className="text-[10px] font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded text-white border border-white/5">
									Est. {new Date(vendor.createdAt).getFullYear()}
								</span>
								<span className="text-[10px] font-bold bg-black/40 backdrop-blur-md px-3 py-1.5 rounded text-white border border-white/5">
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
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<h4 className="text-xs font-bold text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
							<Store size={14} />
							About the Store
						</h4>
						<div className="space-y-10">
							<div className="space-y-4">
								<label className="text-xs font-bold text-gray-400 block pb-1 border-b border-gray-50/50 w-fit">
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
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<h4 className="text-xs font-bold text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
							<MapPin size={14} />
							Verified Location & Contact
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							<div className="space-y-3">
								<label className="text-xs font-bold text-gray-400 flex items-center gap-2">
									<Mail size={12} className="text-gold" />
									Official Email
								</label>
								<p className="text-sm font-black text-black tracking-tight">
									{vendor.ownerEmail}
								</p>
							</div>
							<div className="space-y-3">
								<label className="text-xs font-bold text-gray-400 flex items-center gap-2">
									<Phone size={12} className="text-gold" />
									Store Ownership
								</label>
								<p className="text-sm font-black text-black tracking-tight">
									{vendor.ownerName}
								</p>
							</div>
							<div className="space-y-3 md:col-span-2">
								<label className="text-xs font-bold text-gray-400 flex items-center gap-2">
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
					<div className="bg-black text-white rounded p-10 space-y-10 relative overflow-hidden group">
						<div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/10 rounded group-hover:bg-gold/20 transition-all duration-700" />
						<div className="absolute top-0 right-0 p-4 opacity-10">
							<Check size={80} />
						</div>

						<h4 className="text-xs font-bold text-gold pb-6 border-b border-white/5 relative z-10">
							Security & Status
						</h4>

						<div className="space-y-8 relative z-10">
							<div className="flex items-center gap-5">
								<div
									className={`w-12 h-12 rounded flex items-center justify-center border transition-colors ${vendor.verificationStatus === "Verified" ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-yellow-500/10 border-yellow-500/20 text-yellow-500"}`}
								>
									{vendor.verificationStatus === "Verified" ? (
										<Check size={24} />
									) : (
										<AlertCircle size={24} />
									)}
								</div>
								<div>
									<p className="text-xs font-bold text-white">
										{vendor.verificationStatus === "Verified"
											? "Merchant Verified"
											: "Pending Verification"}
									</p>
									<p className="text-[10px] font-bold text-gray-500 mt-1.5 flex items-center gap-1.5">
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
									<span className="text-[10px] font-bold text-gray-500">
										Inventory Cap
									</span>
									<span className="text-xs font-black text-gold">
										{vendor.productLimit} SKU Limit
									</span>
								</div>
								<div className="h-1 bg-white/5 rounded overflow-hidden">
									<div className="h-full bg-gold/40 w-1/3 rounded" />
								</div>
							</div>
						</div>
					</div>

					{/* Business Info Card */}
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<h4 className="text-xs font-bold text-gold pb-6 border-b border-gray-50 flex items-center gap-3 uppercase">
							<Briefcase size={14} />
							Legal Identity
						</h4>
						<div className="space-y-8">
							<div className="space-y-2">
								<p className="text-xs font-bold text-gray-400">
									RC Number / CAC
								</p>
								<p className="text-xs font-black text-black">
									{vendor.businessRegistrationNumber || "N/A"}
								</p>
							</div>
							<div className={`space-y-2 ${!vendor.companyName && "hidden"}`}>
								<p className="text-xs font-bold text-gray-400">
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
