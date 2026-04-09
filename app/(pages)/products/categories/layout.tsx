import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Categories | Vendor Dashboard",
  description: "Browse and assign categories to your products for better marketplace visibility.",
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
