"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ApiError, mapAuthToProfile } from "@/lib/api/types/auth.types";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { verifyOtp, resendOtp } from "@/lib/api/services/auth";
import { tokenStorage } from "@/lib/api/apiClient";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, OtpFormValues } from "@/lib/schemas/auth";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";
import { cookies } from "@/lib/utils/cookies";

export default function VerifyPage() {
  const router = useRouter();
  const { user, setUser, refreshProfile } = useAuth();
  const { toast } = useToast();
  const email = user?.email || cookies.get("sax_pending_verify") || "";
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const autoSent = useRef(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = useWatch({ control, name: "otp" });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const OTPSEND_KEY = "last_otp_send";
  const OTP_COOLDOWN = 30000;

  useEffect(() => {
    if (email && !autoSent.current) {
      autoSent.current = true;
      const lastSend = Number(sessionStorage.getItem(OTPSEND_KEY));
      if (Date.now() - lastSend > OTP_COOLDOWN) {
        handleResend();
      }
    }
  }, [email]);

  const onSubmit = async (data: OtpFormValues) => {
    setLoading(true);
    try {
      const response = await verifyOtp({
        email,
        otpCode: data.otp,
      });

      // 1. Manually manage tokens
      if (response.token && response.refreshToken) {
        tokenStorage.setTokens(response.token, response.refreshToken);
      }

      // 2. Immediately set user in cache so AuthGuard can see it
      setUser(mapAuthToProfile(response));

      // 3. Refresh profile state
      await refreshProfile();

      toast("Success", "Email verified successfully!", "success");

      document.cookie = "sax_pending_verify=; path=/; max-age=0";

      router.replace("/dashboard");
    } catch (err: unknown) {
      let message = "Invalid or expired OTP";
      if (axios.isAxiosError<ApiError>(err)) {
        message = err.response?.data?.message || message;
      }
      toast("Verification Failed", message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await resendOtp({ email });
      sessionStorage.setItem(OTPSEND_KEY, String(Date.now()));
      toast("OTP Resent", "A new code has been sent to your email.", "success");
      setTimer(45);
    } catch {
      toast("Error", "Failed to resend OTP. Please try again.", "error");
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthPageContainer
      leftPanel={{
        title: (
          <>
            Security <br />
            Check.
          </>
        ),
        description:
          "We take security seriously. Please verify your email address to gain access to the vendor empire.",
      }}
      mainPanel={{
        heading: "Verify Code.",
        subheading:
          "Enter the 6-digit verification code sent to your registered email address.",
        gradientClass:
          "bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-gold/10 via-white to-white",
        bottomContent: (
          <div className="flex items-center justify-center gap-2 mt-12">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">
              Incorrect Email?
            </span>
            <Link
              href="/signup"
              className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-black transition-colors underline underline-offset-4"
            >
              Back to Signup
            </Link>
          </div>
        ),
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-12 animate-in fade-in slide-in-from-bottom-2 delay-200"
      >
        <div className="flex flex-col items-center gap-2">
          <input
            type="text"
            maxLength={6}
            autoFocus
            placeholder="0 0 0 0 0 0"
            className={`bg-transparent border-b-2 text-center text-3xl font-black tracking-[0.2em] outline-none transition-all w-full max-w-xs py-3 placeholder:text-gray-100 ${
              errors.otp
                ? "border-red-500 text-red-600 focus:border-red-600"
                : "border-gray-100 text-black focus:border-gold"
            }`}
            {...register("otp", {
              onChange: (e) => {
                setValue("otp", e.target.value.replace(/\D/g, ""));
              },
            })}
          />
          {errors.otp && (
            <p className="text-xs font-bold text-red-500 -mt-2 animate-in slide-in-from-top-1">
              {errors.otp.message}
            </p>
          )}
          <div className="flex flex-col gap-2">
            {timer > 0 ? (
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                Resend code in{" "}
                <span className="text-gold">
                  0:{timer < 10 ? `0${timer}` : timer}
                </span>
              </p>
            ) : (
              <Button
                type="button"
                onClick={handleResend}
                disabled={resending}
                variant="link"
                loading={resending}
                className="-mt-4"
              >
                Resend Code Now
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 -mt-6">
          <Button
            fullWidth
            size="lg"
            loading={loading}
            type="submit"
            disabled={otpValue?.length < 6}
            className="py-5"
          >
            Authorize Access
          </Button>
        </div>
      </form>
    </AuthPageContainer>
  );
}
