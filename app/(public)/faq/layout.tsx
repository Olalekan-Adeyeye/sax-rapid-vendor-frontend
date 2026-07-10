import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find answers to commonly asked questions about selling on SAX·RAPID Marketplace. Account setup, verification, payments, and more.",
  keywords: [
    "SAX-RAPID FAQ",
    "vendor questions",
    "seller help",
    "marketplace FAQ",
    "vendor center",
  ],
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
