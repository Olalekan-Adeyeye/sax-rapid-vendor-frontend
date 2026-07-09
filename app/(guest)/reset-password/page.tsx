"use client";
import { useState, Suspense } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lock, Eye, EyeOff, KeyRound, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/lib/schemas/auth";
import { resetPassword, forgotPassword } from "@/lib/api/services/auth";
import { ApiError } from "@/lib/api/types/auth.types";
import { useToast } from "@/lib/context/ToastContext";
import axios from "axios";

import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromUrl = searchParams.get("email") || "";
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
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

  const handleResend = async () => {
    const email = emailFromUrl;
    if (!email) return;
    setResending(true);
    try {
      await forgotPassword({ email });
      toast(
        "Code Sent",
        "A new reset code has been sent to your email.",
        "success",
      );
    } catch (err: unknown) {
      let message = "Failed to resend code. Please try again.";
      if (axios.isAxiosError<ApiError>(err)) {
        message = err.response?.data?.message || message;
      }
      toast("Error", message, "error");
    } finally {
      setResending(false);
    }
  };

  const onSubmit = async (data: ResetPasswordFormValues) => {
    setLoading(true);
    try {
      await resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.password,
      });

      toast(
        "Password Reset",
        "Your password has been updated successfully.",
        "success",
      );
      router.push("/login");
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
      }}
      mainPanel={{
        heading: "Reset Password.",
        subheading:
          "Create a new password that is secure and easy to remember.",
        gradientClass:
          "bg-[radial-gradient(circle_at_bottom_right,var(--tw-gradient-stops))] from-gold/10 via-white to-white",
      }}
    >
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

          <div className="space-y-2">
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
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors disabled:opacity-50"
              >
                <Mail size={12} />
                {resending ? "Sending..." : "Resend code"}
              </button>
            </div>
          </div>

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
