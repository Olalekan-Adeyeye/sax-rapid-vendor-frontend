import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Password",
  description: "Securely update your SAX-RAPID account password. Ensure your business remains protected with our high-security protocols.",
  keywords: ["reset password", "security update", "SAX-RAPID merchant", "password change"],
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
