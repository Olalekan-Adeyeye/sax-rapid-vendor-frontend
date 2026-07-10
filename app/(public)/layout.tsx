import Link from "next/link";
import { LandingNav } from "@/components/vendor/LandingNav";
import { Logo } from "@/components/common/Logo";
import { NAV_LINKS } from "@/lib/constants/navLinks";
import { redirect } from "next/navigation";
import { getServerSession, shouldRedirectToDashboard } from "@/lib/auth";
import {
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";

const FOOTER_COLUMNS = [
  {
    heading: "Sell",
    links: [
      { label: "Register", href: "/signup" },
      { label: "Pricing", href: "/#fees" },
      { label: "Logistics", href: "/#solutions" },
      { label: "Payments", href: "/#fees" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { label: "Academy", href: "/resources" },
      { label: "Webinars", href: "/resources" },
      { label: "Guides", href: "/seller-guide" },
      { label: "Blog", href: "/resources" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "/faq" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact Us", href: "/faq" },
      { label: "Raise a Claim", href: "/faq" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: <Twitter size={18} />, label: "𝕏" },
  { icon: <Facebook size={18} />, label: "f" },
  { icon: <Linkedin size={18} />, label: "in" },
  { icon: <Instagram size={18} />, label: "📸" },
];

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (shouldRedirectToDashboard(session)) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-white font-sans antialiased text-black">
      <LandingNav navLinks={NAV_LINKS} />
      {children}
      <footer className="bg-black text-white pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-16 border-b border-white/10">
            <div className="col-span-2">
              <Link
                href="/"
                className="inline-block mb-4 transition-opacity hover:opacity-80"
              >
                <Logo size="md" withBackground />
              </Link>
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm mb-8 font-medium">
                The premier marketplace built for vendors who demand excellence
                in every transaction.
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map((s, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center cursor-pointer transition-all"
                  >
                    {s.icon}
                  </div>
                ))}
              </div>
            </div>
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.heading}>
                <h5 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-500 mb-6">
                  {col.heading}
                </h5>
                <ul className="flex flex-col gap-4">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        href={l.href}
                        className="text-xs text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-widest"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              &copy; 2026 SAX-RAPID Vendor Center. All Rights Reserved.
            </p>
            <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-600">
              <Link href="/" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
