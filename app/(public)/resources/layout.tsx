import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Access guides, tutorials, and tools to build and grow your business on SAX·RAPID Marketplace.",
  keywords: [
    "SAX-RAPID resources",
    "seller guides",
    "vendor tools",
    "marketplace help",
    "ecommerce resources",
  ],
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
