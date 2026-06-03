import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Variations",
  description: "Manage specific variations and combinations for your product listings.",
};

export default function VariationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
