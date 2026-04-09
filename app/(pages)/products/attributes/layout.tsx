import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Attributes | Vendor Dashboard",
  description: "Configure reusable product attributes like size, color, and material.",
};

export default function AttributesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
