import { Metadata } from "next";
import { AuthProvider } from "@/lib/context/AuthContext";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export const metadata: Metadata = {
  description: "Log in or sign up to your SAX-RAPID Vendor account.",
};

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (
    session.token &&
    session.user &&
    session.user.isVerified &&
    session.vendorProfile !== null &&
    (!session.user.isTwoFactorEnabled || session.isTwoFactorVerified)
  ) {
    redirect("/dashboard");
  }

  return (
    <AuthProvider
      serverAuth={
        session.token
          ? {
              user: session.user,
              vendorProfile: session.vendorProfile,
              token: session.token,
              isTwoFactorVerified: session.isTwoFactorVerified,
            }
          : undefined
      }
    >
      {children}
    </AuthProvider>
  );
}
