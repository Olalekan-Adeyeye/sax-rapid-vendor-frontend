import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "SAX RAPID MARKET terms and conditions governing marketplace access, seller services, payouts, delivery, and dispute resolution.",
  keywords: [
    "SAX RAPID terms",
    "seller terms",
    "marketplace agreement",
    "vendor terms and conditions",
  ],
};

export default function TermsAndConditionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
