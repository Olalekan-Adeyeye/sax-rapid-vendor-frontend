"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  ShieldCheck,
  Edit3,
  BadgeCheck,
  AlertTriangle,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/lib/context/ToastContext";
import { getUserProfile } from "@/lib/api/services/user";
import { UserProfileResponse } from "@/lib/api/types/user.types";
import { formatDate } from "@/lib/utils/date";

export default function ProfilePage() {
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const data = await getUserProfile();
        setProfile(data);
      } catch {
        toast("Error", "Failed to load profile details", "error");
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Loading User Data...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header / Hero Section */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gold/5 rounded-2xl -m-4 sm:-m-6 blur-3xl group-hover:bg-gold/10 transition-all duration-500" />
        <div className="relative flex flex-col md:flex-row items-center md:items-end gap-10 bg-white border border-gray-100 rounded p-4 sm:p-10">
          {/* Avatar Container */}
          <div className="relative">
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded bg-gray-50 border border-gray-100 p-1.5 relative group/avatar overflow-hidden">
              <div className="w-full h-full rounded bg-gray-100 relative overflow-hidden">
                <Image
                  src={
                    profile.profileImageUrl ||
                    `https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=facc15&color=000&size=200`
                  }
                  alt={profile.fullName || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            {/* Status Badge */}
            <div className="absolute -bottom-2 -right-2 bg-black text-white px-4 py-1.5 rounded text-[8px] font-black uppercase tracking-widest border-4 border-white">
              {profile.status}
            </div>
          </div>

          {/* Info Section */}
          <div className="flex flex-col flex-1 space-y-4 text-center md:text-left">
            <Button
              asChild
              rounded="full"
              size="sm"
              className="px-8 flex gap-3 w-fit place-self-end"
            >
              <Link href="/settings">
                <Edit3 size={14} />
                Edit Profile
              </Link>
            </Button>
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start ">
                <h1 className="text-3xl sm:text-5xl font-black tracking-tighter text-black">
                  {profile.fullName ||
                    `${profile.firstName} ${profile.lastName}`}
                </h1>
                {profile.verificationStatus === "Verified" && (
                  <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full w-fit mx-auto md:mx-0">
                    <BadgeCheck size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      Verified Vendor
                    </span>
                  </div>
                )}
              </div>
              <p className="text-gray-400 font-bold text-sm tracking-tight flex items-center justify-center md:justify-start gap-2">
                User Tier:{" "}
                <span className="text-gold uppercase tracking-widest text-[10px] bg-black px-2 py-0.5 rounded">
                  {profile.role}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded border border-gray-100/50">
                <Mail size={14} className="text-gold" />
                <span className="text-xs font-bold">{profile.email}</span>
              </div>
              {profile.phoneNumber && (
                <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded border border-gray-100/50">
                  <Phone size={14} className="text-gold" />
                  <span className="text-xs font-bold">
                    {profile.phoneNumber}
                  </span>
                </div>
              )}
              {profile.countryCode && (
                <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-4 py-2 rounded border border-gray-100/50">
                  <Globe size={14} className="text-gold" />
                  <span className="text-xs font-bold uppercase">
                    {profile.countryCode}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Account Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded p-8 sm:p-10 space-y-8">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
              <User size={14} />
              Account Verification
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Authentication Level
                </label>
                <div className="flex items-center gap-4 p-5 rounded bg-gray-50 border border-gray-100 group hover:border-gold transition-all">
                  <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-gold group-hover:bg-black group-hover:text-gold transition-all">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-tight text-black">
                      Two-Factor Auth
                    </h5>
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest mt-1 ${profile.isTwoFactorEnabled ? "text-green-500" : "text-red-500"}`}
                    >
                      {profile.isTwoFactorEnabled
                        ? "Active & Secured"
                        : "Vulnerable / Disabled"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
                  KYC Status
                </label>
                <div className="flex items-center gap-4 p-5 rounded bg-gray-50 border border-gray-100 group hover:border-gold transition-all">
                  <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-gold group-hover:bg-black group-hover:text-gold transition-all">
                    {profile.verificationStatus === "Verified" ? (
                      <BadgeCheck size={20} />
                    ) : (
                      <AlertTriangle size={20} />
                    )}
                  </div>
                  <div>
                    <h5 className="text-[10px] font-black uppercase tracking-tight text-black">
                      Profile Vetting
                    </h5>
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest mt-1 ${profile.verificationStatus === "Verified" ? "text-green-500" : "text-amber-500"}`}
                    >
                      {profile.verificationStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-50">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">
                Meta Information
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded bg-gray-50 space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={12} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                      Joined Since
                    </span>
                  </div>
                  <p className="text-xs font-black text-black">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
                <div className="p-5 rounded bg-gray-50 space-y-1.5">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock size={12} />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                      Last Active
                    </span>
                  </div>
                  <p className="text-xs font-black text-black">
                    {profile.updatedAt
                      ? formatDate(profile.updatedAt)
                      : "Recently Managed"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar stats */}
        <div className="space-y-8">
          <div className="bg-black text-white rounded p-8 sm:p-10 space-y-8">
            <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold">
              Quick Actions
            </h5>
            <div className="space-y-4">
              <Link
                href="/products"
                className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/10 hover:border-gold transition-all group"
              >
                <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-gold transition-colors">
                  Manage Products
                </span>
                <ExternalLink
                  size={14}
                  className="text-white/20 group-hover:text-gold transition-colors"
                />
              </Link>
              <Link
                href="/orders"
                className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/10 hover:border-gold transition-all group"
              >
                <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-gold transition-colors">
                  Order Statistics
                </span>
                <ExternalLink
                  size={14}
                  className="text-white/20 group-hover:text-gold transition-colors"
                />
              </Link>
              <Link
                href="/settings?tab=Security"
                className="flex items-center justify-between p-4 rounded bg-white/5 border border-white/10 hover:border-gold transition-all group"
              >
                <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-gold transition-colors">
                  Lock Account
                </span>
                <ShieldCheck
                  size={14}
                  className="text-white/20 group-hover:text-gold transition-colors"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
