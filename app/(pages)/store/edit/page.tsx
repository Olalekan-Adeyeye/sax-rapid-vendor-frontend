"use client";
import React, { useState, useEffect } from "react";
import {
  Store,
  Camera,
  MapPin,
  Phone,
  Mail,
  Trash2,
  Check,
  AlertCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/lib/utils/errors";
import {
  getMyVendorProfile,
  updateVendorProfile,
} from "@/lib/api/services/vendor";
import { uploadFile } from "@/lib/api/services/files";
import type {
  VendorProfileResponse,
  UpdateVendorProfileRequest,
} from "@/lib/api/types/vendor.types";
import { useToast } from "@/lib/context/ToastContext";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { ErrorComponent } from "@/components/ui/ErrorComponent";

export default function EditStoreProfile() {
  const router = useRouter();
  const { toast } = useToast();
  const [vendor, setVendor] = useState<VendorProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerUploading, setBannerUploading] = useState(false);
  const logoInputRef = React.useRef<HTMLInputElement>(null);
  const bannerInputRef = React.useRef<HTMLInputElement>(null);

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

  const handleImageUpload = async (
    file: File,
    type: "logo" | "banner",
  ) => {
    const setLoading = type === "logo" ? setLogoUploading : setBannerUploading;
    setLoading(true);
    try {
      const folder = "store";
      const res = await uploadFile(file, folder);
      if (res?.url) {
        setFormData((prev) => ({ ...prev, [`${type}Url`]: res.url }));
      }
    } catch (err) {
      console.error(`${type} upload failed:`, err);
      toast("Upload Failed", `Could not upload ${type}. Please try again.`, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateVendorProfile(formData);
      toast("Success", "Store profile updated successfully", "success");
      router.push("/store");
    } catch (err: unknown) {
      console.error("Failed to update vendor profile:", err);
      const message = getErrorMessage(
        err,
        "We couldn't save your changes. Please check your connection.",
      );
      toast("Update Failed", message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const GENERIC_BANNER = "/assets/images/signup_bg.png";
  const DEFAULT_LOGO = "/assets/icons/SaxRapid-Logo.png";

  if (loading) {
    return <FullPageLoader label="Loading store data..." icon={Store} />;
  }

  if (error || !vendor) {
    return (
      <ErrorComponent
        title="Failed to Load Store Profile"
        message={
          error ||
          "We couldn't retrieve your store details. Please check your internet connection and try again."
        }
        onRetry={fetchVendor}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
            Edit Store Profile
          </h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Update your public storefront and business details
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/store"
            className="px-6 py-2.5 rounded-full bg-gray-100 text-sm font-bold text-black hover:bg-gray-200 transition-all flex items-center justify-center gap-3"
          >
            <X size={16} />
            Cancel
          </Link>
          <Button
            size="md"
            onClick={handleSave}
            disabled={isSaving}
            rounded="full"
            loading={isSaving}
            className="px-8 py-2.5!"
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Banner & Logo Section */}
      <div className="space-y-8">
        <div className="relative h-64 lg:h-80 w-full bg-gray-50 rounded-xl overflow-hidden group border border-gray-100">
          <Image
            src={formData.bannerUrl || GENERIC_BANNER}
            alt="Store Banner"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
            priority
            unoptimized
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
            <Button
              rounded="full"
              variant="outline"
              className="px-8 bg-white text-black border-none"
              onClick={() => bannerInputRef.current?.click()}
              disabled={bannerUploading}
              loading={bannerUploading}
            >
              <Camera size={16} />
              Update Banner
            </Button>
          </div>

          {/* Logo Overlay */}
          <div className="absolute bottom-8 left-8 flex items-end gap-6">
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-white border-4 border-white rounded overflow-hidden group/logo shadow-xl">
              <Image
                src={formData.logoUrl || DEFAULT_LOGO}
                alt="Logo"
                fill
                className="object-contain p-4 group-hover/logo:scale-110 transition-transform duration-500"
              />
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/logo:opacity-100 transition-opacity bg-black/40 cursor-pointer"
                onClick={() => logoInputRef.current?.click()}
              >
                {logoUploading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={24} className="text-white" />
                )}
              </div>
            </div>
            <div className="pb-4">
              <h3 className="text-2xl font-black tracking-tighter text-white drop-shadow-lg">
                {vendor.shopName || "Untitled Store"}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold bg-gold px-3 py-1 rounded-full text-black shadow-sm">
                  {vendor.accountType} Seller
                </span>
                <span className="text-[10px] font-bold bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/10 shadow-sm">
                  Est. {new Date(vendor.createdAt).getFullYear()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file, "logo");
        }}
      />
      <input
        ref={bannerInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageUpload(file, "banner");
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* About Store */}
          <div className="bg-white border border-gray-100 rounded p-10 space-y-10">
            <h4 className="text-xs font-bold text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
              <Store size={14} />
              Store Information
            </h4>
            <div className="space-y-8">
              <Input
                id="shopName"
                label="Store Name"
                value={formData.shopName || ""}
                onChange={handleChange}
              />
              <TextArea
                id="description"
                label="Store Description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={8}
                placeholder="Describe your store to customers..."
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white border border-gray-100 rounded p-10 space-y-10">
            <h4 className="text-xs font-bold text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
              <MapPin size={14} />
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                id="email-readonly"
                label="Email Address"
                leftSlot={<Mail size={12} />}
                defaultValue={vendor.ownerEmail || ""}
                readOnly
                className="bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
              />
              <Input
                id="phone-readonly"
                label="Phone Number"
                leftSlot={<Phone size={12} />}
                defaultValue={vendor.ownerName || ""}
                readOnly
                className="bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
              />
              <Input
                id="storeAddress"
                label="Store Address"
                leftSlot={<MapPin size={12} />}
                value={formData.storeAddress || ""}
                onChange={handleChange}
                outerClassName="md:col-span-2"
              />
              <Input
                id="storeCity"
                label="City"
                value={formData.storeCity || ""}
                onChange={handleChange}
              />
              <Input
                id="storeState"
                label="State / Region"
                value={formData.storeState || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Status Card */}
          <div className="bg-black text-white rounded p-10 space-y-10 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-gold/10 transition-colors" />
            <h4 className="text-xs font-bold text-gold pb-6 border-b border-white/5 relative z-10">
              Legal Information
            </h4>
            <div className="space-y-6 relative z-10">
              <Input
                id="businessRegistrationNumber"
                label="Business Registration (RC)"
                value={formData.businessRegistrationNumber || ""}
                onChange={handleChange}
                className="bg-white/5 border-white/10 text-white focus:border-gold/50"
              />
              <div className={`${!vendor.companyName && "hidden"}`}>
                <Input
                  id="companyName"
                  label="Registered company"
                  value={formData.companyName || ""}
                  onChange={handleChange}
                  className="bg-white/5 border-white/10 text-white focus:border-gold/50"
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
                <p className="text-[10px] font-bold text-gray-400">
                  Verification:{" "}
                  <span className="text-white">
                    {vendor.verificationStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-10 space-y-6">
            <h4 className="text-xs font-bold text-red-500">Danger Zone</h4>
            <p className="text-xs font-medium text-red-400/80 leading-relaxed">
              Deleting your business account is permanent and will remove all
              product listings, sales history, and storefront data.
            </p>
            <Button
              variant="outline"
              rounded="full"
              fullWidth
              className="bg-white text-red-500 border-red-100 hover:bg-red-500 hover:text-white py-3! px-2!"
            >
              <Trash2 size={16} />
              Request Deletion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
