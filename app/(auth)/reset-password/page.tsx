"use client";
import { useState, Suspense } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/schemas/auth";
import { resetPassword } from "@/lib/api/services/auth";
import { ApiError } from "@/lib/api/types/auth.types";
import { useToast } from "@/lib/context/ToastContext";
import axios from "axios";

import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: emailFromUrl,
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      await resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.password,
      });
      setSuccess(true);
      toast(
        "Password Reset",
        "Your password has been updated successfully.",
        "success",
      );
    } catch (err: unknown) {
      let message = "Failed to reset password. Please try again.";
      if (axios.isAxiosError<ApiError>(err)) {
        message = err.response?.data?.message || message;
      }
      toast("Error", message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageContainer
      leftPanel={{
        title: (
          <>
            Secure <br />
            Reset.
          </>
        ),
        description:
          "Choose a strong password and get your business back online in seconds.",
        extraContent: (
          <div className="bg-white border border-gray-100 rounded p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-gold">
                <ShieldCheck size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black">
                Authentication
              </p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium capitalize">
              &quot;Choose a unique and complex combination to protect your
              account from unwanted access.&quot;
            </p>
          </div>
        ),
      }}
      mainPanel={{
        heading: success ? undefined : "Reset Password.",
        subheading: success
          ? undefined
          : "Create a new password that is secure and easy to remember.",
        gradientClass:
          "bg-[radial-gradient(circle_at_bottom_right,var(--tw-gradient-stops))] from-gold/10 via-white to-white",
      }}
    >
      {!success ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!emailFromUrl && (
              <Input
                id="email"
                label="Email Address"
                type="email"
                {...register("email")}
                error={errors.email?.message}
                placeholder="ceo@yourbrand.com"
                leftSlot={<KeyRound size={16} className="text-gray-400" />}
              />
            )}

            <Input
              id="otp"
              label="Verification Code"
              type="text"
              maxLength={6}
              {...register("otp", {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "");
                },
              })}
              error={errors.otp?.message}
              placeholder="0 0 0 0 0 0"
              leftSlot={<KeyRound size={16} className="text-gray-400" />}
            />

            <Input
              id="password"
              label="New Password"
              type={showPass ? "text" : "password"}
              autoComplete="new-password"
              disableAutofill
              {...register("password")}
              error={errors.password?.message}
              placeholder="••••••••"
              leftSlot={<Lock size={16} className="text-gray-400" />}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-gray-600 hover:text-black transition-colors p-1"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Input
              id="confirmPassword"
              label="Confirm New Password"
              type={showPass ? "text" : "password"}
              autoComplete="off"
              disableAutofill
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              placeholder="••••••••"
              leftSlot={<Lock size={16} className="text-gray-400" />}
            />

            <Button type="submit" loading={loading} fullWidth className="py-5">
              Update Password
            </Button>
          </form>
        </div>
      ) : (
        <div className="text-center animate-in zoom-in-95 fade-in duration-500">
          <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/40">
            <CheckCircle2 size={32} className="text-gold" />
          </div>
          <h2 className="text-3xl font-black text-black tracking-tighter mb-4">
            Access Restored.
          </h2>
          <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">
            Your password has been successfully updated. You can now use your
            new credentials to log in.
          </p>
          <Button asChild fullWidth variant="black">
            <Link href="/login">Log In to Your Store</Link>
          </Button>
        </div>
      )}
    </AuthPageContainer>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin w-8 h-8 border-2 border-gold border-t-transparent rounded-full" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
