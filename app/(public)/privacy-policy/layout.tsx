import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "SAX RAPID MARKET privacy policy. How we collect, use, store, disclose, and protect personal information across Nigeria and South Africa.",
  keywords: [
    "SAX RAPID privacy policy",
    "data protection Nigeria",
    "POPIA",
    "marketplace privacy",
  ],
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
