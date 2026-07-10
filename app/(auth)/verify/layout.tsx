import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getServerSession } from "@/lib/auth";
import { AuthProvider } from "@/lib/context/AuthContext";

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

  const cookieStore = await cookies();
  if (!cookieStore.get("sax_pending_verify")?.value) {
    redirect("/login");
  }

  return (
    <AuthProvider
      serverAuth={{
        user: session.user,
        vendorProfile: session.vendorProfile,
        token: session.token,
        isTwoFactorVerified: session.isTwoFactorVerified,
      }}
    >
      {children}
    </AuthProvider>
  );
}
