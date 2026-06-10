"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Lightbulb, Eye, EyeOff, AlertCircle } from "lucide-react";
import Image from "next/image";
import { login } from "@/lib/api/services/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ApiError, mapAuthToProfile } from "@/lib/api/types/auth.types";
import { tokenStorage } from "@/lib/api/apiClient";
import { useAuth } from "@/lib/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/lib/schemas/auth";
import { useToast } from "@/lib/context/ToastContext";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

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

      // 2. Update context with user
      setUser(mapAuthToProfile(response));

      // 3. Manually manage tokens
      if (response.token && response.refreshToken) {
        tokenStorage.setTokens(response.token, response.refreshToken);
      }
      // LAX mode currently - to be enabled later
      // 4. Redirect path
      // if (!response.isVerified) {
      //   router.push("/verify");
      // } else
      // if (response.isTwoFactorEnabled) {
      // 	router.push("/2fa");
      // } else {
      // 	router.push("/dashboard");
      // }
      router.push("/dashboard");
    } catch (err: unknown) {
      setUser(null);
      tokenStorage.clearTokens();
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
        extraContent: (
          <div className="bg-white border border-gray-100 rounded p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded bg-gold flex items-center justify-center text-black">
                <Lightbulb size={20} fill="currentColor" />
              </div>
              <p className="text-xs font-bold text-black">Daily Tip</p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium capitalize">
              &quot;Update your stock levels early to maintain your high seller
              score.&quot;
            </p>
          </div>
        ),
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

        {/* <div className="flex items-center gap-4 py-4">
					<div className="flex-1 h-px bg-gray-100" />
					<span className="text-xs font-bold text-gray-400">or</span>
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
				</Button> */}
      </form>
    </AuthPageContainer>
  );
}
