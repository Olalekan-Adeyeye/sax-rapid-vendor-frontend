import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Verify Your Identity",
  description:
    "One last step to secure your SAX-RAPID vendor account. Enter the OTP sent to your email to verify your identity.",
  keywords: [
    "OTP verification",
    "account security",
    "SAX-RAPID verify",
    "identity verification",
  ],
};

export default async function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (session.token && session.user?.isVerified) {
    redirect("/dashboard");
  }
  return <>{children}</>;
}
