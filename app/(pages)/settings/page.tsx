"use client";
import React, { useEffect, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UserCog,
  Bell,
  Shield,
  ShieldCheck,
  Lock,
  ChevronRight,
  Loader2,
  Upload,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/lib/schemas/vendor";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { PageHeader } from "@/components/ui/PageHeader";
import { updateUserProfile } from "@/lib/api/services/user";
import { uploadFile } from "@/lib/api/services/files";
import { setupTwoFactor } from "@/lib/api/services/auth";
import { getErrorMessage } from "@/lib/utils/errors";
import { UserProfile } from "@/lib/api/types/auth.types";
import { ChangePasswordModal } from "@/components/auth/ChangePasswordModal";
import { TwoFactorSetupModal } from "@/components/auth/TwoFactorSetupModal";
import { Disable2faModal } from "@/components/auth/Disable2faModal";

export default function AccountSettingsPage() {
  const { user, updateUser, setTwoFactorVerified } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState("Profile");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = React.useState(false);
  const [isDisableModalOpen, setIsDisableModalOpen] = React.useState(false);
  const [twoFactorData, setTwoFactorData] = React.useState<{
    isOpen: boolean;
    qrCode: string;
    key: string;
  }>({ isOpen: false, qrCode: "", key: "" });
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast("Error", "Please select an image file (PNG, JPG, WebP)", "error");
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("Error", "Image must be smaller than 5MB", "error");
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      return;
    }

    try {
      setAvatarUploading(true);
      const { url } = await uploadFile(file, "profiles");
      updateMutation.mutate({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email,
        profileImageUrl: url,
      });
    } catch {
      toast("Error", "Failed to upload image", "error");
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    updateMutation.mutate({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email,
      profileImageUrl: null,
    });
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_, variables) => {
      updateUser({
        firstName: variables.firstName,
        lastName: variables.lastName,
        avatarUrl: variables.profileImageUrl ?? undefined,
      });
      toast("Success", "Profile updated successfully.", "success");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const setup2FAMutation = useMutation({
    mutationFn: setupTwoFactor,
    onSuccess: (data) => {
      setTwoFactorData({
        isOpen: true,
        qrCode: data.qrCodeUri || "",
        key: data.manualEntryKey || "",
      });
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const handle2FAToggle = () => {
    if (user?.isTwoFactorEnabled) {
      setIsDisableModalOpen(true);
    } else {
      setup2FAMutation.mutate();
    }
  };

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: user?.email,
    });
  };

  return (
    <div className="space-y-12">
      <PageHeader
        title="Account Settings"
        description="Manage your security and preferences"
      />

      <div className="flex bg-white border border-gray-100 rounded p-1.5 overflow-x-auto no-scrollbar">
        {["Profile", "Security"].map((tab) => (
          <Button
            key={tab}
            onClick={() => setActiveTab(tab)}
            variant={activeTab === tab ? "black" : "ghost"}
            size="sm"
            className={`px-8 py-3 h-auto border-none ${
              activeTab === tab
                ? "bg-black text-white"
                : "text-black hover:text-black hover:bg-gray-50"
            }`}
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-gray-100 rounded p-8 flex flex-col items-center text-center space-y-4">
            <div className="w-24 h-24 rounded-full bg-gold/20 border-4 border-white flex items-center justify-center text-gold overflow-hidden relative group/avatar">
              <Image
                src={
                  user?.avatarUrl ||
                  "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop"
                }
                alt="Profile"
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center rounded-full cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarUploading ? (
                  <LoaderCircle size={20} className="text-white animate-spin" />
                ) : (
                  <Upload size={20} className="text-white" />
                )}
              </div>
            </div>
            <input
              type="file"
              ref={avatarInputRef}
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            {user?.avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="text-[9px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 size={12} className="inline mr-1" />
                Remove Photo
              </button>
            )}
            <div>
              <h4 className="text-sm font-bold text-black">
                {user?.firstName && user?.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : "TechWorld Enterprise"}
              </h4>
              <div className="flex flex-col items-center gap-2 mt-2">
                <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[9px] font-black uppercase tracking-tighter border border-gold/20">
                  {user?.role || "Vendor"}
                </span>
                {user?.isVerified && (
                  <span className="flex items-center gap-1 text-[9px] font-bold text-green-500 uppercase tracking-widest">
                    <ShieldCheck size={10} />
                    Verified Account
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-10">
          {activeTab === "Profile" && (
            <div className="bg-white border border-gray-100 rounded p-10 space-y-10">
              <h4 className="text-sm font-bold text-gold pb-6 border-b border-gray-100 flex items-center gap-3">
                <UserCog size={14} />
                Personal Profiles
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Input
                  id="first-name"
                  label="First Name"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
                <Input
                  id="last-name"
                  label="Last Name"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
                <Input
                  id="email-address"
                  label="Email Address"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                  outerClassName="md:col-span-2"
                />
              </div>

              <div className="flex justify-end pt-8 mt-10 border-t border-gray-100">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  disabled={updateMutation.isPending || !isDirty}
                  className="px-10 h-12"
                  loading={updateMutation.isPending}
                >
                  Save Profile Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === "Security" && (
            <div className="space-y-8">
              <div className="bg-white border border-gray-100 rounded p-10 space-y-10">
                <h4 className="text-sm font-bold text-gold pb-6 border-b border-gray-100 flex items-center gap-3">
                  <Lock size={14} />
                  Security Protocol
                </h4>
                <div className="space-y-6">
                  <div
                    className={`flex items-center justify-between p-6 rounded bg-gray-50 group hover:border-black border border-transparent transition-all ${setup2FAMutation.isPending ? "pointer-events-none opacity-70" : ""}`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded bg-white flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-gold transition-all">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-black">
                          Two-Factor Authentication
                        </h5>
                        <p
                          className={`text-[10px] font-bold mt-1 uppercase tracking-widest ${user?.isTwoFactorEnabled ? "text-green-500" : "text-red-500"}`}
                        >
                          {user?.isTwoFactorEnabled
                            ? "Active & Secured"
                            : "Disabled / At Risk"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {setup2FAMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      ) : (
                        <Switch
                          checked={!!user?.isTwoFactorEnabled}
                          onChange={handle2FAToggle}
                        />
                      )}
                    </div>
                  </div>
                  <div
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="flex items-center justify-between p-6 rounded bg-gray-50 group hover:border-black border border-transparent transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded bg-white flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-gold transition-all">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-black">
                          Change Management Password
                        </h5>
                        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">
                          Last changed 4 months ago
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
          />

          <TwoFactorSetupModal
            isOpen={twoFactorData.isOpen}
            onClose={() =>
              setTwoFactorData((prev) => ({ ...prev, isOpen: false }))
            }
            qrCodeUri={twoFactorData.qrCode}
            manualEntryKey={twoFactorData.key}
            onSuccess={() => {
              updateUser({ isTwoFactorEnabled: true });
              setTwoFactorVerified(true);
              queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            }}
          />

          <Disable2faModal
            isOpen={isDisableModalOpen}
            onClose={() => setIsDisableModalOpen(false)}
            onSuccess={() => {
              updateUser({ isTwoFactorEnabled: false });
              queryClient.invalidateQueries({ queryKey: ["user-profile"] });
            }}
          />
        </div>
      </div>
    </div>
  );
}
