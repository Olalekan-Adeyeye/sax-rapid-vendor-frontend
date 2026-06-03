import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Identity",
  description: "One last step to secure your SAX-RAPID vendor account. Enter the OTP sent to your email to verify your identity.",
  keywords: ["OTP verification", "account security", "SAX-RAPID verify", "identity verification"],
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
