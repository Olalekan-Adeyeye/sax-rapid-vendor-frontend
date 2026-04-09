"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/schemas/auth";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: ForgotPasswordFormValues) => {
    setLoading(true);
    setSubmittedEmail(data.email);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased overflow-hidden text-black">
      {/* ── LEFT PANEL ─────────────────────────── */}
      <div className="hidden lg:flex flex-col justify-between w-120 shrink-0 bg-[#f8f8f8] border-r border-gray-200/50 p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-100 h-100 bg-gold/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-56 h-56 bg-gold/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-100 h-100 bg-vibrant-blue/15 rounded-full -ml-40 -mb-40" />

        <Link
          href="/"
          className="group w-fit relative z-20 transition-opacity hover:opacity-80"
        >
          <Logo size="md" />
        </Link>

        <div className="relative z-10 mt-10">
          <div className="w-12 h-1.5 bg-gold rounded-full mb-10" />
          <h2 className="text-5xl font-black text-black leading-[1.1] tracking-tighter mb-6 underline decoration-gold/50">
            Account <br />
            Recovery.
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
            Don&apos;t worry, it happens to the best of us. We&apos;ll help you
            get back into your empire in no time.
          </p>

          <div className="bg-white border border-gray-100 rounded p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-gold">
                <KeyRound size={20} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-black">
                Secure Step
              </p>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-medium capitalize">
              &quot;Use a password manager to ensure your account stays both
              secure and accessible.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:px-20 lg:py-12 bg-[radial-gradient(circle_at_bottom_left,var(--tw-gradient-stops))] from-gold/10 via-white to-white transition-all duration-700">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden text-left">
            <Link
              href="/"
              className="group w-fit transition-opacity hover:opacity-80"
            >
              <Logo size="md" className="items-start" />
            </Link>
          </div>

          {!submitted ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="mb-10">
                <h1 className="text-4xl font-black text-black tracking-tighter mb-2">
                  Forgot Password?
                </h1>
                <p className="text-gray-500 text-sm font-medium">
                  Enter your email and we&apos;ll send you a link to reset your
                  password.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                  placeholder="ceo@yourbrand.com"
                  leftSlot={<Mail size={16} className="text-gray-400" />}
                />

                <Button
                  type="submit"
                  loading={loading}
                  fullWidth
                  className="py-5"
                >
                  Send Reset Link
                </Button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all group"
                >
                  <ArrowLeft
                    size={14}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  Back to Login
                </Link>
              </form>
            </div>
          ) : (
            <div className="text-center animate-in zoom-in-95 fade-in duration-500">
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/40">
                <Mail size={32} className="text-gold" />
              </div>
              <h2 className="text-3xl font-black text-black tracking-tighter mb-4">
                Check Your Mail.
              </h2>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">
                We have sent a password recovery link to <br />
                <span className="text-black font-bold">{submittedEmail}</span>.
              </p>
              <div className="space-y-4">
                <Button asChild fullWidth variant="black">
                  <Link href="/login">Return to Login</Link>
                </Button>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                  Didn&apos;t get the mail? Try again
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-auto pt-16 text-[10px] font-black uppercase tracking-widest text-gray-300 lg:hidden text-center">
          © 2026 SAX-RAPID · Secure Access
        </p>
      </div>
    </div>
  );
}
