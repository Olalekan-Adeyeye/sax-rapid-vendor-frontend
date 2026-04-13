"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/schemas/auth";

import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

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
    <AuthPageContainer
      leftPanel={{
        title: (
          <>
            Account <br />
            Recovery.
          </>
        ),
        description:
          "Don't worry, it happens to the best of us. We'll help you get back into your empire in no time.",
        extraContent: (
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
        ),
      }}
      mainPanel={{
        heading: submitted ? undefined : "Forgot Password?",
        subheading: submitted
          ? undefined
          : "Enter your email and we'll send you a link to reset your password.",
        bottomContent: submitted ? null : (
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-all group mt-10"
          >
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back to Login
          </Link>
        ),
      }}
    >
      {!submitted ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
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

            <Button type="submit" loading={loading} fullWidth className="py-5">
              Send Reset Link
            </Button>
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
    </AuthPageContainer>
  );
}
