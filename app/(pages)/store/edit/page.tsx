"use client";
import React, { useState, useEffect } from "react";
import {
	Store,
	Camera,
	Save,
	MapPin,
	Phone,
	Mail,
	Trash2,
	Check,
	Loader2,
	AlertCircle,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils/errors";
import { getMyVendorProfile, updateVendorProfile } from "@/lib/api/services/vendor";
import type { VendorProfileResponse, UpdateVendorProfileRequest } from "@/lib/api/types/vendor.types";
import { useToast } from "@/lib/context/ToastContext";

export default function EditStoreProfile() {
	const router = useRouter();
	const { toast } = useToast();
	const [vendor, setVendor] = useState<VendorProfileResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const [formData, setFormData] = useState<UpdateVendorProfileRequest>({
		shopName: "",
		description: "",
		storeAddress: "",
		storeCity: "",
		storeState: "",
		businessRegistrationNumber: "",
		companyName: "",
	});

	const fetchVendor = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getMyVendorProfile();
			setVendor(data);
			setFormData({
				shopName: data.shopName || "",
				description: data.description || "",
				storeAddress: data.storeAddress || "",
				storeCity: data.storeCity || "",
				storeState: data.storeState || "",
				businessRegistrationNumber: data.businessRegistrationNumber || "",
				companyName: data.companyName || "",
				logoUrl: data.logoUrl,
				bannerUrl: data.bannerUrl,
			});
		} catch (err) {
			console.error("Failed to fetch vendor profile:", err);
			setError("Failed to load store profile. Please try again later.");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchVendor();
	}, [fetchVendor]);

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSave = async () => {
		try {
			setIsSaving(true);
			await updateVendorProfile(formData);
			toast("Success", "Store profile updated successfully", "success");
			router.push("/store");
		} catch (err: unknown) {
			console.error("Failed to update vendor profile:", err);
			const message = getErrorMessage(err, "We couldn't save your changes. Please check your connection.");
			toast("Update Failed", message, "error");
		} finally {
			setIsSaving(false);
		}
	};

	const GENERIC_BANNER = "/assets/images/signup_bg.png";
	const DEFAULT_LOGO = "/assets/icons/SaxRapid-Logo.png";

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
				<Loader2 className="w-12 h-12 text-gold animate-spin" />
				<p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 animate-pulse">
					Syncing Store Data...
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
		<div className="max-w-5xl mx-auto space-y-12 pb-20">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						Edit Store Profile
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Update your public storefront and business details
					</p>
				</div>
				<div className="flex items-center gap-4">
					<Link
						href="/store"
						className="px-6 py-4 rounded bg-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
					>
						<X size={16} />
						Cancel
					</Link>
					<button
						onClick={handleSave}
						disabled={isSaving}
						className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-wait"
					>
						{isSaving ? (
							<Loader2 size={16} className="animate-spin" />
						) : (
							<Save size={16} />
						)}
						{isSaving ? "Saving..." : "Save Changes"}
					</button>
				</div>
			</div>

			{/* Banner & Logo Section */}
			<div className="space-y-8">
				<div className="relative h-64 lg:h-80 w-full bg-gray-50 rounded overflow-hidden group border border-gray-100">
					<Image
						src={vendor.bannerUrl || GENERIC_BANNER}
						alt="Store Banner"
						fill
						className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
						priority
						unoptimized
					/>
					<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
						<button className="px-8 py-4 rounded bg-white text-[10px] font-black uppercase tracking-widest text-black flex items-center gap-3 shadow-2xl">
							<Camera size={16} />
							Update Banner
						</button>
					</div>

					{/* Logo Overlay */}
					<div className="absolute bottom-8 left-8 flex items-end gap-6">
						<div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-white border-4 border-white rounded overflow-hidden group/logo shadow-xl">
							<Image
								src={vendor.logoUrl || DEFAULT_LOGO}
								alt="Logo"
								fill
								className="object-contain p-4 group-hover/logo:scale-110 transition-transform duration-500"
							/>
							<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity bg-black/40 cursor-pointer">
								<Camera size={24} className="text-white" />
							</div>
						</div>
						<div className="pb-4">
							<h3 className="text-2xl font-black tracking-tighter text-white drop-shadow-lg">
								{vendor.shopName || "Untitled Store"}
							</h3>
							<div className="flex items-center gap-2 mt-2">
								<span className="text-[9px] font-black uppercase tracking-widest bg-gold px-2 py-1 rounded text-black shadow-sm">
									{vendor.accountType} Seller
								</span>
								<span className="text-[9px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded text-white border border-white/10 shadow-sm">
									Est. {new Date(vendor.createdAt).getFullYear()}
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
						<h4 className="text-[11px] font-black tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3 uppercase">
							<Store size={14} />
							Store Information
						</h4>
						<div className="space-y-8">
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									Store Name
								</label>
								<input
									type="text"
									id="shopName"
									value={formData.shopName || ""}
									onChange={handleChange}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all"
								/>
							</div>
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									Store Description
								</label>
								<textarea
									id="description"
									value={formData.description || ""}
									onChange={handleChange}
									rows={8}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-medium text-gray-700 leading-relaxed outline-none transition-all resize-none"
									placeholder="Describe your store to customers..."
								/>
							</div>
						</div>
					</div>

					{/* Contact Details */}
					<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
						<h4 className="text-[11px] font-black tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3 uppercase">
							<MapPin size={14} />
							Contact Information
						</h4>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									<Mail size={12} className="inline mr-2" />
									Email Address
								</label>
								<input
									type="email"
									defaultValue={vendor.ownerEmail || ""}
									readOnly
									className="w-full bg-gray-100 border border-transparent rounded px-5 py-4 text-sm font-black text-gray-400 outline-none cursor-not-allowed"
								/>
							</div>
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									<Phone size={12} className="inline mr-2" />
									Phone Number
								</label>
								<input
									type="text"
									defaultValue={vendor.ownerName || ""}
									readOnly
									className="w-full bg-gray-100 border border-transparent rounded px-5 py-4 text-sm font-black text-gray-400 outline-none cursor-not-allowed"
								/>
							</div>
							<div className="space-y-3 md:col-span-2">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									<MapPin size={12} className="inline mr-2" />
									Store Address
								</label>
								<input
									type="text"
									id="storeAddress"
									value={formData.storeAddress || ""}
									onChange={handleChange}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all"
								/>
							</div>
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									City
								</label>
								<input
									type="text"
									id="storeCity"
									value={formData.storeCity || ""}
									onChange={handleChange}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all"
								/>
							</div>
							<div className="space-y-3">
								<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
									State / Region
								</label>
								<input
									type="text"
									id="storeState"
									value={formData.storeState || ""}
									onChange={handleChange}
									className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all"
								/>
							</div>
						</div>
					</div>
				</div>

				<div className="space-y-10">
					{/* Status Card */}
					<div className="bg-black text-white rounded p-10 space-y-10 relative overflow-hidden group">
						<div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-gold/10 transition-colors" />
						<h4 className="text-[11px] font-black tracking-[0.2em] text-gold pb-6 border-b border-white/5 relative z-10 uppercase">
							Legal Information
						</h4>
						<div className="space-y-8 relative z-10">
							<div className="space-y-1">
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
									Business Registration (RC)
								</p>
								<input
									type="text"
									id="businessRegistrationNumber"
									value={formData.businessRegistrationNumber || ""}
									onChange={handleChange}
									className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs font-black text-white outline-none focus:border-gold/50 transition-all mt-2"
								/>
							</div>
							<div className={`space-y-1 ${!vendor.companyName && "hidden"}`}>
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-500">
									Registered company
								</p>
								<input
									type="text"
									id="companyName"
									value={formData.companyName || ""}
									onChange={handleChange}
									className="w-full bg-white/5 border border-white/10 rounded px-4 py-3 text-xs font-black text-white outline-none focus:border-gold/50 transition-all mt-2"
								/>
							</div>
							<div className="pt-4 flex items-center gap-3">
								<div
									className={`w-8 h-8 rounded-full flex items-center justify-center ${vendor.verificationStatus === "Verified" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}`}
								>
									{vendor.verificationStatus === "Verified" ? (
										<Check size={14} />
									) : (
										<AlertCircle size={14} />
									)}
								</div>
								<p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
									Verification:{" "}
									<span className="text-white">
										{vendor.verificationStatus}
									</span>
								</p>
							</div>
						</div>
					</div>

					{/* Danger Zone */}
					<div className="bg-red-50 border border-red-100 rounded p-10 space-y-6">
						<h4 className="text-[11px] font-black tracking-[0.2em] text-red-500 uppercase">
							Danger Zone
						</h4>
						<p className="text-[9px] font-medium text-red-400/80 leading-relaxed uppercase tracking-wider">
							Deleting your business account is permanent and will remove all
							product listings, sales history, and storefront data.
						</p>
						<button className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white text-red-500 text-center px-2 py-4 rounded hover:bg-red-500 hover:text-white transition-all w-full border border-red-100 shadow-sm">
							<Trash2 size={12} />
							Request Account Deletion
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
