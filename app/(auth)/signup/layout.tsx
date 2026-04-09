import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Join SAX-RAPID | Create Your Global Vendor Account",
  description: "Start your journey as a SAX-RAPID vendor. Reach millions of customers across Africa and the world with our premium marketplace tools.",
  keywords: ["vendor signup", "sell products", "global marketplace", "business merchant", "SAX-RAPID registration"],
  openGraph: {
    title: "SAX-RAPID Vendor Registration",
    description: "The fastest way to take your business global. Register as a vendor today.",
    type: "website",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
