"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/lib/schemas/auth";
import { forgotPassword } from "@/lib/api/services/auth";
import { ApiError } from "@/lib/api/types/auth.types";
import { useToast } from "@/lib/context/ToastContext";
import axios from "axios";

import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setLoading(true);
    try {
      await forgotPassword({ email: data.email });
      toast(
        "Email Sent",
        "Check your inbox for the password reset code.",
        "success",
      );
      router.push(`/reset-password?email=${encodeURIComponent(data.email)}`);
    } catch (err: unknown) {
      let message = "Failed to send reset email. Please try again.";
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
            Account <br />
            Recovery.
          </>
        ),
        description:
          "Don't worry, it happens to the best of us. We'll help you get back into your empire in no time.",
      }}
      mainPanel={{
        heading: "Forgot Password?",
        subheading:
          "Enter your email and we'll send you a code to reset your password.",
        bottomContent: (
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
            Send Reset Code
          </Button>
        </form>
      </div>
    </AuthPageContainer>
  );
}
