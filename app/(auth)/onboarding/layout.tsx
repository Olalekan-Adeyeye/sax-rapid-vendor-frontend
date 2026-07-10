import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Complete Your Onboarding",
  description: "Complete your store setup to start selling on SAX-RAPID.",
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (session.token && session.user) {
    if (session.vendorProfile !== null) {
      redirect("/dashboard");
    }
  }

  return <>{children}</>;
}
