import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory Management | Vendor Dashboard",
  description: "View and manage all your listed products, stock levels, and active promotions.",
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
