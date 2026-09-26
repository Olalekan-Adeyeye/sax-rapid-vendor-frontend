"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { AuthPageContainer } from "@/components/auth/AuthPageContainer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { tokenStorage } from "@/lib/api/apiClient";
import { login } from "@/lib/api/services/auth";
import { ApiError, mapAuthToProfile } from "@/lib/api/types/auth.types";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { loginSchema, LoginFormValues } from "@/lib/schemas/auth";
import {
  resolvePostAuthDestination,
  setPendingVerifyCookie,
} from "@/lib/utils/authRouting";



export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setApiError(null);

    try {
      const response = await login(data);

      // 1. Determine access
      const isMerchant =
        response.role === "Vendor" || response.role === "Seller";
      if (!isMerchant) {
        setApiError(
          "Access denied. Only Vendor and Seller accounts are allowed to access this dashboard.",
        );
        setLoading(false);
        return;
      }

      if (response.token && response.refreshToken) {
        tokenStorage.setTokens(response.token, response.refreshToken);
      }

      setUser(mapAuthToProfile(response));

      if (!response.isVerified) {
        setPendingVerifyCookie(data.email);
        router.replace("/verify");
        return;
      }
      router.replace(await resolvePostAuthDestination(response));
    } catch (err: unknown) {
      setUser(null);
      tokenStorage.clearTokens();

      if (axios.isAxiosError<ApiError>(err) && err.response?.status === 403) {
        setPendingVerifyCookie(data.email);
        toast(
          "Email Not Verified",
          "Please verify your email address before logging in.",
          "error",
        );
        router.replace("/verify");
        return;
      }

      const message = axios.isAxiosError<ApiError>(err)
        ? err.response?.data?.message || err.message
        : "An unexpected error occurred. Please try again.";
      toast("Login Failed", message, "error");
      setApiError(message);
      setLoading(false);
    }
  };

  return (
    <AuthPageContainer
      leftPanel={{
        title: (
          <>
            Welcome <br />
            Back.
          </>
        ),
        description: "Log in to your account and manage your shop.",

      }}
      mainPanel={{
        heading: "Sign In.",
        subheading: "Enter your credentials to continue.",
        bottomContent: (
          <p className="text-center mt-12 text-gray-400 text-sm font-medium">
            New Merchant?{" "}
            <Link
              href="/signup"
              className="text-gold font-black hover:text-black transition-colors underline-offset-4 hover:underline"
            >
              Join the Empire
            </Link>
          </p>
        ),
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded text-red-600 text-xs font-semibold animate-in fade-in slide-in-from-top-1">
            <AlertCircle size={16} />
            <p>{apiError}</p>
          </div>
        )}

        <Input
          id="email"
          label="Email Address"
          type="email"
          hideAsterisk={true}
          {...register("email")}
          error={errors.email?.message}
          placeholder="you@example.com"
        />

        <div className="space-y-2">
          <Input
            id="password"
            label="Password"
            type={showPass ? "text" : "password"}
            hideAsterisk={true}
            {...register("password")}
            error={errors.password?.message}
            placeholder="••••••••"
            rightSlot={
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-600 hover:text-black transition-colors p-1"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-black hover:text-gold transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={loading} fullWidth className="py-5">
          Login
        </Button>
      </form>
    </AuthPageContainer>
  );
}
