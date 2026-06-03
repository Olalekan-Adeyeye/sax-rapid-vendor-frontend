import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/lib/context/ToastContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { QueryProvider } from "@/lib/context/QueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});


export const metadata: Metadata = {
  title: {
    default: "Sax-RAPID | Online Marketplace",
    template: "%s | Sax-RAPID Vendor Center",
  },
  description:
    "Join SAX-RAPID — Nigeria's premier online marketplace. Expand your business reach with world-class logistics, real-time analytics, and guaranteed weekly payouts.",
  keywords: [
    "marketplace",
    "sell online",
    "Nigeria ecommerce",
    "vendor center",
    "SAX-RAPID",
  ],
  authors: [{ name: "SAX-RAPID Team" }],
  creator: "SAX-RAPID",
  publisher: "SAX-RAPID",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SAX-RAPID | Online Marketplace",
    description: "Nigeria's premier online marketplace for serious sellers.",
    siteName: "SAX-RAPID",
    images: [
      {
        url: "/assets/icons/SRM-Logo.png",
        width: 800,
        height: 600,
        alt: "SAX-RAPID Branding",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SAX-RAPID Vendor Center",
    description: "Reach millions of premium shoppers across Nigeria.",
    creator: "@sax_rapid",
    images: [`/assets/icons/SRM-Logo.png`],
  },
  icons: {
    icon: "/assets/icons/SRM-Logo.png",
    shortcut: "/assets/icons/SRM-Logo.png",
    apple: "/assets/icons/SRM-Logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-white text-black">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <AuthGuard>{children}</AuthGuard>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
