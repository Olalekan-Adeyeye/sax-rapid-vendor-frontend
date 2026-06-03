import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Product",
  description: "Create and publish a new product listing to the marketplace.",
};

export default function AddProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
