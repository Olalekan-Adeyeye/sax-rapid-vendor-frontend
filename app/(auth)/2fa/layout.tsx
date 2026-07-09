import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Two-Factor Authentication",
  description:
    "Secure your SAX-RAPID vendor account with two-factor authentication. Enter the verification code sent to your device.",
  keywords: [
    "two-factor authentication",
    "2FA",
    "account security",
    "SAX-RAPID",
    "verification code",
    "secure login",
  ],
};

export default async function TwoFALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (session.token && session.user) {
    if (!session.user.isTwoFactorEnabled) {
      redirect("/dashboard");
    }

    if (session.user.isTwoFactorEnabled && session.isTwoFactorVerified) {
      redirect("/dashboard");
    }
  }

  return <>{children}</>;
}
