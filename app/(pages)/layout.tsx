import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthProvider } from "@/lib/context/AuthContext";
import { getServerSession } from "@/lib/auth";
import PageLayoutWrapper from "@/components/layout/PageLayoutWrapper";

export const metadata: Metadata = {
  description: "SAX-RAPID Vendor Center — All-in-one business management tool.",
};

export default async function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session.token || !session.user) {
    redirect("/login");
  }

  if (!session.user.isVerified) {
    redirect("/verify");
  }

  if (session.user.isTwoFactorEnabled && !session.isTwoFactorVerified) {
    redirect("/2fa");
  }

  if (session.vendorProfile === null) {
    redirect("/onboarding");
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
      <PageLayoutWrapper>{children}</PageLayoutWrapper>
    </AuthProvider>
  );
}
