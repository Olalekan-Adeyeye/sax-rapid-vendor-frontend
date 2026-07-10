import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recover Your Account",
  description: "Forgot your password? No problem. Securely reset your SAX-RAPID vendor account credentials and get back to business.",
  keywords: ["forgot password", "account recovery", "SAX-RAPID security", "reset credentials", "secure login"],
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
