"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lightbulb, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/common/Logo";
import { login } from "@/lib/api/services/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ApiError, mapAuthToProfile } from "@/lib/api/types/auth.types";
import { tokenStorage } from "@/lib/api/apiClient";
import { useAuth } from "@/lib/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/schemas/auth";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
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
      if (response.role !== "Seller") {
        setApiError(
          "Access denied. Only Vendor accounts are allowed to access this dashboard.",
        );
        setLoading(false);
        return;
      }

      // 2. Update context with user
      setUser(mapAuthToProfile(response));

      // 3. Manually manage tokens
      if (response.token && response.refreshToken) {
        tokenStorage.setTokens(response.token, response.refreshToken);
      }

      // 4. Redirect path
      if (!response.isVerified) {
        router.push("/verify");
      } else if (response.isTwoFactorEnabled) {
        router.push("/2fa");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setUser(null);
      tokenStorage.clearTokens();
      let message = "Invalid email or password";
      if (axios.isAxiosError<ApiError>(err)) {
        message = err.response?.data?.message || message;
      }
      setApiError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased overflow-hidden text-black">
      {/* ── LEFT PANEL ─────────────────────────── */}
      <div className="hidden lg:flex flex-col w-120 shrink-0 bg-[#f8f8f8] border-r border-gray-200/50 p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-100 h-100 bg-gold/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-vibrant-pink/20 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-vibrant-blue/15 rounded-full -ml-40 -mb-40" />
        <div className="absolute top-1/2 -left-20 w-56 h-56 bg-vibrant-purple/20 rounded-full" />
        <div className="absolute top-1/4 -right-10 w-40 h-40 bg-gold/40 rounded-full" />

        <Link
          href="/"
          className="group w-fit relative z-20 transition-opacity hover:opacity-80"
        >
          <Logo size="md" />
        </Link>

        <div className="relative z-10 mt-10">
          <div className="w-12 h-1.5 bg-gold rounded-full mb-10" />
          <h2 className="text-5xl font-black text-black leading-[1.1] tracking-tighter mb-6 underline decoration-gold/50">
            Welcome <br />
            Back.
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
            Log in to your account and manage your shop.
          </p>

          <div className="bg-white border border-gray-100 rounded p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded bg-gold flex items-center justify-center text-black">
                <Lightbulb size={20} fill="currentColor" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black">
                Daily Tip
              </p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium capitalize">
              &quot;Update your stock levels early to maintain your high seller
              score.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 lg:py-12 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-gold/10 via-white to-white">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Logo size="md" className="items-start" />
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-black tracking-tighter mb-2">
              Sign In.
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Enter your credentials to continue.
            </p>
          </div>

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
                  className="text-[10px] font-black uppercase tracking-widest text-black hover:text-gold transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" loading={loading} fullWidth className="py-5">
              Login
            </Button>

            <div className="flex items-center gap-4 py-4">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                or
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <Button
              type="button"
              variant="outline"
              fullWidth
              className="gap-3 transition-all"
            >
              <Image
                src="/assets/icons/google.svg"
                alt="Google"
                width={16}
                height={16}
                className="shrink-0"
              />
              Sign in with Google
            </Button>
          </form>

          <p className="text-center mt-12 text-gray-400 text-sm font-medium">
            New Merchant?{" "}
            <Link
              href="/signup"
              className="text-gold font-black hover:text-black transition-colors underline-offset-4 hover:underline"
            >
              Join the Empire
            </Link>
          </p>
        </div>

        <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden">
          © 2026 SAX-RAPID · All Rights Reserved
        </p>
      </div>
    </div>
  );
}
