import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vendor Login | SAX-RAPID Business Center",
  description: "Access your SAX-RAPID vendor dashboard. Manage orders, products, and insights in real-time.",
  keywords: ["vendor login", "merchant portal", "SAX-RAPID business", "order management", "dashboard login"],
  openGraph: {
    title: "SAX-RAPID Vendor Portal",
    description: "Manage your business effectively on the world's most premium marketplace.",
    type: "website",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
