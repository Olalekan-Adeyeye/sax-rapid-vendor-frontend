import { Metadata } from "next";
import { AuthProvider } from "@/lib/context/AuthContext";

export const metadata: Metadata = {
  description: "Log in or sign up to your SAX-RAPID Vendor account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
