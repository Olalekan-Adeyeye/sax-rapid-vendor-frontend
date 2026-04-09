"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import {
  Mail,
  Lock,
  User,
  Sparkle,
  Check,
  Phone,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/common/Logo";
import axios from "axios";
import { register as registerUser } from "@/lib/api/services/auth";
import { useRouter } from "next/navigation";
import { ApiError, mapAuthToProfile } from "@/lib/api/types/auth.types";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import { tokenStorage } from "@/lib/api/apiClient";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "@/lib/schemas/auth";

const countries = [
  { label: "Nigeria", value: "NG", code: "+234" },
  { label: "South Africa", value: "ZA", code: "+27" },
  { label: "Ghana (Coming Soon)", value: "GH", code: "+233", disabled: true },
  { label: "Kenya (Coming Soon)", value: "KE", code: "+254", disabled: true },
  {
    label: "United Kingdom (Coming Soon)",
    value: "GB",
    code: "+44",
    disabled: true,
  },
];

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      countryCode: "NG",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    },
    mode: "onBlur",
  });

  const countryCode = useWatch({ control, name: "countryCode" });
  const phoneNumber = useWatch({ control, name: "phoneNumber" });
  const confirmPassword = useWatch({ control, name: "confirmPassword" });

  const selectedCountry = countries.find((c) => c.value === countryCode);
  const isComingSoon = selectedCountry?.disabled;

  // Toast for coming soon
  useEffect(() => {
    if (isComingSoon) {
      toast(
        "Coming Soon",
        `Launching in ${selectedCountry?.label.split(" (")[0]} soon. Stay tuned!`,
        "warning",
      );
    }
  }, [countryCode, isComingSoon, selectedCountry, toast]);

  const onSubmit = async (data: SignupFormValues) => {
    if (isComingSoon) return;

    setLoading(true);
    setApiError(null);

    try {
      // Persist registration
      const response = await registerUser({
        ...data,
        role: "Vendor",
      });

      // 1. Update context with user
      setUser(mapAuthToProfile(response));

      // 2. Manually manage tokens
      if (response.token && response.refreshToken) {
        tokenStorage.setTokens(response.token, response.refreshToken);
      }

      // Navigate to verify
      toast(
        "Account Created",
        "Your account was created successfully. Let's verify your email.",
        "success",
      );
      router.push("/verify");
    } catch (err: unknown) {
      setUser(null);
      tokenStorage.clearTokens();
      let message = "Registration failed. Please try again.";
      if (axios.isAxiosError<ApiError>(err)) {
        message = err.response?.data?.message || message;
      }
      toast("Error", message, "error");
      setApiError(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased overflow-hidden text-black">
      {/* ── LEFT PANEL ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-120 shrink-0 bg-[#f8f8f8] border-r border-gray-200/50 p-16 relative overflow-hidden">
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
            Ready to <br />
            Start?
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
            Join the thousands of sellers growing their business with us.
          </p>

          <div className="space-y-8">
            {[
              "Reach over 5 Million buyers",
              "We handle your delivery",
              "Get paid every week",
              "Get help to grow your sales",
            ].map((perk) => (
              <div
                key={perk}
                className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-gray-400"
              >
                <Sparkle size={14} className=" fill-current" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 relative z-10">
          © 2026 SAX-RAPID · Seller Account Information
        </p>
      </div>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 lg:py-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-gold/10 via-white to-white">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Logo size="md" className="items-start" />
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-black tracking-tighter mb-2">
              Create Account.
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Provide your details to get started.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 animate-in fade-in slide-in-from-bottom-4"
          >
            {apiError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded text-red-600 text-xs font-semibold">
                <AlertCircle size={16} />
                <p>{apiError}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First Name"
                type="text"
                placeholder="Arthur"
                {...register("firstName")}
                error={errors.firstName?.message}
                leftSlot={<User size={16} className="text-gray-400" />}
              />
              <Input
                id="lastName"
                label="Last Name"
                type="text"
                placeholder="Morgan"
                {...register("lastName")}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              id="email"
              label="Email Address"
              type="email"
              placeholder="ceo@company.com"
              {...register("email")}
              error={errors.email?.message}
              leftSlot={<Mail size={16} className="text-gray-400" />}
            />

            <Select
              label="Country"
              id="countryCode"
              options={countries}
              {...register("countryCode")}
              className="h-12.5 rounded"
            />

            <div className="space-y-2">
              <Input
                id="phoneNumber"
                label="Phone Number"
                type="tel"
                placeholder="08012345678"
                error={errors.phoneNumber?.message}
                {...register("phoneNumber", {
                  onChange: (e) => {
                    setValue("phoneNumber", e.target.value.replace(/\D/g, ""), {
                      shouldValidate: true,
                    });
                  },
                })}
                className="h-12.5 rounded pl-28!"
                leftSlot={
                  <div className="flex items-center gap-3 pr-5 border-r border-gray-200 transition-colors group-focus-within:border-gold/30 h-5">
                    <Phone size={16} className="text-gray-400 shrink-0" />
                    <span className="text-xs font-bold text-gray-400 pointer-events-none select-none">
                      {selectedCountry?.code}
                    </span>
                  </div>
                }
                rightSlot={
                  phoneNumber?.length > 7 ? (
                    <Check size={18} className="text-gold animate-in zoom-in" />
                  ) : null
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-5">
              <Input
                label="Password"
                id="password"
                type={showPass ? "text" : "password"}
                {...register("password")}
                error={errors.password?.message}
                leftSlot={<Lock size={16} className="text-gray-400" />}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="text-[9px] font-black text-gray-400 hover:text-gold transition-colors uppercase"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                }
              />
              <div className="flex flex-col gap-2">
                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  type={showConfirmPass ? "text" : "password"}
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                  leftSlot={<Lock size={16} className="text-gray-400" />}
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass(!showConfirmPass)}
                      className="text-[9px] font-black text-gray-400 hover:text-gold transition-colors uppercase"
                    >
                      {showConfirmPass ? "Hide" : "Show"}
                    </button>
                  }
                />
              </div>
            </div>

            <Button
              fullWidth
              type="submit"
              loading={loading}
              disabled={isComingSoon}
              className="mt-2 py-5"
            >
              Create Account
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
              Join with Google
            </Button>
          </form>

          <p className="text-center mt-12 text-gray-400 text-sm font-medium">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-gold font-black hover:text-black transition-colors underline-offset-4 hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>

        <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden text-center">
          © 2026 SAX-RAPID · Official Merchant Registration
        </p>
      </div>
    </div>
  );
}
