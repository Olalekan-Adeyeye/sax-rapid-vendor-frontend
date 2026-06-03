import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Your Vendor Account",
  description: "Start your journey as a SAX-RAPID vendor. Reach millions of customers across Africa and the world with our premium marketplace tools.",
  keywords: ["vendor signup", "sell products", "global marketplace", "business merchant", "SAX-RAPID registration"],
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
