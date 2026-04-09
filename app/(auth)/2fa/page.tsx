"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twoFactorSchema, TwoFactorFormValues } from "@/lib/schemas/auth";

/**
 * 2FA Security Page
 * Handles secondary authentication after initial login.
 */
export default function TwoFactorPage() {
  const router = useRouter();
  const { setTwoFactorVerified } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<TwoFactorFormValues>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: { code: "" },
  });

  const codeValue = useWatch({ control, name: "code" });

  const onSubmit = async (data: TwoFactorFormValues) => {
    setLoading(true);
    setError(null);

    // Mock logic: only 12345 is valid as per requirements
    setTimeout(() => {
      if (data.code === "12345") {
        toast("Verified", "Two-factor authentication successful!", "success");

        // 1. Mark session as 2FA verified
        setTwoFactorVerified(true);

        // 2. Redirect to dashboard
        router.replace("/dashboard");
      } else {
        const msg = "Invalid security code. Please try again.";
        setError(msg);
        toast("Auth Failed", msg, "error");
        setLoading(false);
      }
    }, 1000);
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
            Secure <br />
            Access.
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
            Your account is protected with two-factor authentication. Please
            enter the code from your authenticator app to continue.
          </p>
        </div>

        <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 relative z-10">
          © 2026 SAX-RAPID SAFETY
        </p>
      </div>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 lg:py-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-gold/10 via-white to-white">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden text-left">
            <Link href="/" className="transition-opacity hover:opacity-80">
              <Logo size="sm" className="items-start" />
            </Link>
          </div>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-black tracking-tighter mb-2">
              2FA Security.
            </h1>
            <p className="text-gray-500 text-sm font-medium">
              Enter the 5-digit security code from your authentication app.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-12 animate-in fade-in slide-in-from-bottom-2 delay-200"
          >
            {(error || errors.code) && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded text-red-600 text-xs font-semibold text-left">
                <AlertCircle size={16} />
                <p>{error || errors.code?.message}</p>
              </div>
            )}

            <div className="flex flex-col items-center gap-6">
              <input
                type="text"
                maxLength={5}
                autoFocus
                placeholder="0 0 0 0 0"
                className={`bg-transparent border-b-2 text-center text-3xl font-black tracking-[0.2em] outline-none transition-all w-full max-w-xs py-3 placeholder:text-gray-100 ${
                  errors.code || error
                    ? "border-red-500 text-red-600 focus:border-red-600"
                    : "border-gray-100 text-black focus:border-gold"
                }`}
                {...register("code", {
                  onChange: (e) => {
                    setValue("code", e.target.value.replace(/\D/g, ""));
                  },
                })}
              />
              <p className="text-[10px] text-gray-400 font-medium">
                Tip: Enter <span className="text-black font-black">12345</span>{" "}
                for demo access.
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                className="py-5"
                disabled={codeValue?.length < 5}
              >
                Authorize Access
              </Button>

              <div className="flex items-center justify-center gap-2">
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  <ArrowLeft size={14} />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>

        <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden text-center">
          © 2026 SAX-RAPID · Secure Gateway
        </p>
      </div>
    </div>
  );
}
