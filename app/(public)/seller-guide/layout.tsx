import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Guides",
  description:
    "Step-by-step guides for selling on SAX·RAPID Marketplace. From account setup to order fulfilment and growth.",
  keywords: [
    "SAX-RAPID seller guides",
    "how to sell online",
    "vendor guide",
    "marketplace selling",
    "ecommerce guide",
  ],
};

export default function SellerGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
