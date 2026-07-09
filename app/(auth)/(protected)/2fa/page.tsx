"use client";
import { Button } from "@/components/ui/Button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/lib/context/ToastContext";
import { useAuth } from "@/lib/context/AuthContext";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twoFactorSchema, TwoFactorFormValues } from "@/lib/schemas/auth";
import { verifyTwoFactor } from "@/lib/api/services/auth";
import { getErrorMessage } from "@/lib/utils/errors";
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export default function TwoFactorPage() {
  const router = useRouter();
  const { setTwoFactorVerified } = useAuth();
  const { toast } = useToast();

  const verificationMutation = useMutation({
    mutationFn: verifyTwoFactor,
    onSuccess: () => {
      toast("Verified", "Two-factor authentication successful!", "success");
      setTwoFactorVerified(true);
      router.replace("/dashboard");
    },
    onError: (error) => {
      toast("Invalid Code", getErrorMessage(error), "error");
    },
  });

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

  const onSubmit = (data: TwoFactorFormValues) => {
    verificationMutation.mutate({ code: data.code });
  };

  const errorMessage = verificationMutation.error
    ? getErrorMessage(verificationMutation.error)
    : null;

  return (
    <AuthPageContainer
      leftPanel={{
        title: (
          <>
            Secure <br />
            Access.
          </>
        ),
        description:
          "Your account is protected with two-factor authentication. Please enter the code from your authenticator app to continue.",
      }}
      mainPanel={{
        heading: "2FA Security.",
        subheading:
          "Enter the 6-digit security code from your authentication app.",
        bottomContent: (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Link
              href="/login"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        ),
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-12 animate-in fade-in slide-in-from-bottom-2 delay-200"
      >
        {(errorMessage || errors.code) && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded text-red-600 text-xs font-semibold text-left">
            <AlertCircle size={16} />
            <p>{errorMessage || errors.code?.message}</p>
          </div>
        )}

        <div className="flex flex-col items-center gap-6">
          <input
            type="text"
            maxLength={6}
            autoFocus
            placeholder="0 0 0 0 0 0"
            className={`bg-transparent border-b-2 text-center text-3xl font-black tracking-[0.2em] outline-none transition-all w-full max-w-xs py-3 placeholder:text-gray-100 ${
              errors.code || errorMessage
                ? "border-red-500 text-red-600 focus:border-red-600"
                : "border-gray-100 text-black focus:border-gold"
            }`}
            {...register("code", {
              onChange: (e) => {
                setValue("code", e.target.value.replace(/\D/g, ""));
              },
            })}
          />
        </div>

        <div className="flex flex-col gap-6">
          <Button
            type="submit"
            loading={verificationMutation.isPending}
            fullWidth
            size="lg"
            className="py-5"
            disabled={codeValue?.length < 6}
          >
            Authorize Access
          </Button>
        </div>
      </form>
    </AuthPageContainer>
  );
}
