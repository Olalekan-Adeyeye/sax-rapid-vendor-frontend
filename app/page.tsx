"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { BenefitCard } from "@/components/vendor/BenefitCard";
import { StepItem } from "@/components/vendor/StepItem";
import { Logo } from "@/components/common/Logo";
import { LandingNav } from "@/components/vendor/LandingNav";
import { NAV_LINKS } from "@/lib/constants/navLinks";
import {
  Globe,
  Zap,
  BarChart3,
  Gem,
  CheckCircle2,
  Star,
  Sparkle,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  ShieldCheck,
  HeadphonesIcon,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const stats = [
  { value: "5M+", label: "Active Buyers" },
  { value: "50K+", label: "Active Sellers" },
  { value: "$12.5B+", label: "Paid to Sellers" },
  { value: "24/7", label: "Vendor Support" },
];

const steps = [
  {
    number: "01",
    title: "Register & Verify",
    desc: "Submit your business details and ID for fast KYC verification.",
  },
  {
    number: "02",
    title: "List Your Products",
    desc: "Upload your catalog with images, pricing, and stock in minutes.",
  },
  {
    number: "03",
    title: "Sell & Ship",
    desc: "Receive orders and let our Rapid Delivery network handle fulfilment.",
  },
  {
    number: "04",
    title: "Get Paid Weekly",
    desc: "Guaranteed weekly settlements directly to your registered bank account.",
  },
];

const testimonials = [
  {
    name: "John Dada",
    role: "Tech Store Owner · Lagos",
    quote:
      "My sales tripled within three months of joining. The logistics are absolutely unmatched.",
    avatar: "JD",
  },
  {
    name: "Amaka Eze",
    role: "Fashion Designer · Abuja",
    quote:
      "The premium feel of the platform matches my brand perfectly. Every step is a class act.",
    avatar: "AE",
  },
  {
    name: "Ibrahim Kolo",
    role: "Appliances Vendor · PH",
    quote:
      "Weekly payments transformed my cash flow. Best business decision I have ever made.",
    avatar: "IK",
  },
];

import Script from "next/script";

export default function VendorCenter() {
  const [activeStep, setActiveStep] = useState(0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SAX-RAPID",
    url: "https://saxrapid.com",
    logo: "https://saxrapid.com/assets/icons/SaxRapid-Logo.png",
    description: "A premier online marketplace for premium vendors.",
    sameAs: [
      "https://twitter.com/sax_rapid",
      "https://facebook.com/sax_rapid",
      "https://linkedin.com/company/sax_rapid",
    ],
  };

  return (
    <main className="min-h-screen bg-white font-sans antialiased text-black overflow-x-hidden relative">
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingNav navLinks={NAV_LINKS} />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-170 flex items-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600&q=90&auto=format&fit=crop"
            alt="Hero background"
            fill
            priority
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
          <div className="absolute -top-32 right-1/3 w-150 h-150 rounded-full bg-gold/5 blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 py-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-8">
                SAX·RAPID Vendor Center
              </p>
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-[1.05] tracking-tighter mb-6">
                Expand Your
                <br />
                <span className="text-gold">Empire.</span>
              </h1>
              <p className="text-gray-300 text-xl mb-10 max-w-lg leading-relaxed font-medium">
                Reach millions of premium shoppers across the world with
                world-class logistics, real-time analytics, and payouts
                built for serious sellers.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  asChild
                  className="hover:bg-white! hover:text-black! border border-transparent hover:border-white! transition-all"
                >
                  <Link href="/signup">Register Free</Link>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  asChild
                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 tracking-widest transition-all"
                >
                  <Link href="/login">Vendor Login</Link>
                </Button>
              </div>
            </div>

            <div className="hidden lg:grid grid-cols-2 gap-4">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={`rounded p-8 ${
                    i === 0
                      ? "bg-gold text-black"
                      : "bg-white/5 border border-white/10 text-white"
                  }`}
                >
                  <div
                    className={`text-4xl font-black mb-2 ${
                      i === 0 ? "text-black" : "text-gold"
                    }`}
                  >
                    {s.value}
                  </div>
                  <div
                    className={`text-xs font-black uppercase tracking-widest ${
                      i === 0 ? "text-black/60" : "text-white/40"
                    }`}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE STRIP ────────────────────────── */}
      <div className="bg-gold py-4 overflow-hidden">
        <div className="flex animate-ticker whitespace-nowrap gap-12">
          {[...Array(3)].flatMap((_, outerIndex) =>
            [
              "5 Million Buyers",
              "Payouts",
              "Rapid Nationwide Delivery",
              "24/7 Seller Support",
              "Real-time Analytics",
              "Zero Setup Fees",
            ].map((t, i) => (
              <span
                key={`${t}-${outerIndex}-${i}`}
                className="text-black font-black uppercase tracking-[0.2em] text-xs flex items-center gap-6"
              >
                {t}
                <Sparkle size={12} className="text-black/30 fill-current" />
              </span>
            )),
          )}
        </div>
      </div>

      {/* ── SOLUTIONS ─────────────────────────────── */}
      <section id="solutions" className="py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="w-10 h-1.5 bg-gold rounded-full mb-6" />
            <h2 className="text-4xl font-black tracking-tighter mb-4">
              Why Top Sellers Choose SAX·RAPID
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              We give you everything you need to build, grow and manage a
              successful online business — all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <BenefitCard
              icon={<Globe size={32} strokeWidth={1.5} />}
              title="Massive Reach"
              desc="Direct access to over 5 million premium, intent-driven shoppers across the world."
              accent
            />
            <BenefitCard
              icon={<Zap size={32} strokeWidth={1.5} />}
              title="Rapid Logistics"
              desc="Our nationwide fleet handles pickup, packaging and same-day shipping at scale."
            />
            <BenefitCard
              icon={<BarChart3 size={32} strokeWidth={1.5} />}
              title="Smart Analytics"
              desc="Live dashboards with sales trends, traffic insights, and competitor benchmarks."
            />
            <BenefitCard
              icon={<Gem size={32} strokeWidth={1.5} />}
              title="Dedicated Support"
              desc="A personal account manager and a 24/7 support line — always in your corner."
            />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────── */}
      <section className="py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="w-10 h-1.5 bg-gold rounded-full mb-6" />
              <h2 className="text-4xl font-black tracking-tighter mb-4">
                Up and selling <br />
                <span className="text-gold">in under 24 hours.</span>
              </h2>
              <p className="text-gray-500 mb-10 leading-relaxed font-medium">
                Our streamlined onboarding gets you from zero to your first sale
                in as little as one business day.
              </p>

              <div className="flex flex-col gap-3">
                {steps.map((s, i) => (
                  <StepItem
                    key={i}
                    {...s}
                    active={activeStep === i}
                    onClick={() => setActiveStep(i)}
                  />
                ))}
              </div>
            </div>

            <div className="relative shrink-0">
              <div className="bg-black rounded p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-white font-black text-sm uppercase tracking-widest">
                    Vendor Dashboard
                  </span>
                  <span className="bg-gold text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 rounded p-5">
                    <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">
                      Today&apos;s Revenue
                    </div>
                    <div className="text-2xl font-black text-white">
                      $247,500
                    </div>
                    <div className="text-xs text-green-400 font-bold mt-1">
                      ▲ 18% vs yesterday
                    </div>
                  </div>
                  <div className="bg-gold/10 border border-gold/20 rounded p-5">
                    <div className="text-xs text-gold/60 font-bold uppercase tracking-widest mb-2">
                      Pending Orders
                    </div>
                    <div className="text-2xl font-black text-gold">34</div>
                    <div className="text-xs text-gold/60 font-bold mt-1">
                      Avg. $7,279 / order
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded p-5">
                  <div className="text-xs text-white/40 font-bold uppercase tracking-widest mb-4">
                    Weekly Sales
                  </div>
                  <div className="flex items-end gap-2 h-16">
                    {[40, 65, 45, 80, 55, 95, 70].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t transition-all"
                        style={{
                          height: `${h}%`,
                          backgroundColor:
                            i === 5 ? "#FFD700" : "rgba(255,255,255,0.15)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
                      <span
                        key={d}
                        className="text-[9px] text-white/30 font-bold"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white border border-gray-100 rounded shadow-2xl p-5 flex items-center gap-4 min-w-55">
                <div className="w-10 h-10 rounded bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                    Payment Sent
                  </div>
                  <div className="text-base font-black text-black">
                    +$63,000
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-black rounded p-5 shadow-2xl">
                <div className="text-gold flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <div className="text-xs text-white/50 font-bold uppercase tracking-widest">
                  Seller Score
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  98 / 100
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEES & COMMISSIONS ────────────────────── */}
      <section id="fees" className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="w-10 h-1.5 bg-gold rounded-full mb-6" />
            <h2 className="text-4xl font-black tracking-tighter mb-4">
              Fees & Commissions
            </h2>
            <p className="text-gray-500 text-base leading-relaxed">
              Zero setup fees. No monthly subscriptions. You only pay when you
              sell.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-gray-50 border border-gray-100 rounded p-8 flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4">
                Listings
              </p>
              <div className="text-5xl font-black text-black mb-2">Free</div>
              <p className="text-sm text-gray-500 font-medium mb-8">
                No cost to list your products
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Unlimited product uploads",
                  "High-res images & videos",
                  "Category & attribute setup",
                  "Bulk import tools",
                ].map((f) => (
                  <li
                    key={f}
                    className="text-sm text-gray-600 flex items-center gap-3"
                  >
                    <CheckCircle2 size={16} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" fullWidth asChild>
                <Link href="/signup">Start Listing</Link>
              </Button>
            </div>

            <div className="bg-black border-2 border-gold rounded p-8 flex flex-col relative">
              <span className="absolute -top-3 right-6 bg-gold text-black text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">
                Popular
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gold/60 mb-4">
                Onboarding
              </p>
              <div className="text-5xl font-black text-gold mb-2">Fast</div>
              <p className="text-sm text-gray-400 font-medium mb-8">
                Get selling in minutes
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Quick KYC verification",
                  "Instant store setup",
                  "Easy product uploads",
                  "Built-in delivery network",
                  "Seller dashboard access",
                ].map((f) => (
                  <li
                    key={f}
                    className="text-sm text-gray-300 flex items-center gap-3"
                  >
                    <CheckCircle2 size={16} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="primary" fullWidth asChild>
                <Link href="/signup">Start Selling</Link>
              </Button>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded p-8 flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-4">
                Support
              </p>
              <div className="text-5xl font-black text-black mb-2">24/7</div>
              <p className="text-sm text-gray-500 font-medium mb-8">
                Round-the-clock assistance
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Dedicated vendor support",
                  "Live chat & email",
                  "Comprehensive help centre",
                  "Onboarding assistance",
                  "Seller community access",
                  "Account management",
                ].map((f) => (
                  <li
                    key={f}
                    className="text-sm text-gray-600 flex items-center gap-3"
                  >
                    <CheckCircle2 size={16} className="text-gold shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" fullWidth asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: <ShieldCheck size={20} />,
                label: "No Hidden Fees",
              },
              {
                icon: <DollarSign size={20} />,
                label: "Payouts",
              },
              {
                icon: <TrendingUp size={20} />,
                label: "Free Listings",
              },
              {
                icon: <HeadphonesIcon size={20} />,
                label: "24/7 Support",
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded"
              >
                <div className="w-12 h-12 rounded bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  {f.icon}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────── */}
      <section className="py-28 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-200 h-200 -translate-x-1/2 -translate-y-1/2 bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="w-10 h-1.5 bg-gold rounded-full mb-6 mx-auto" />
            <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
              Sellers Love SAX·RAPID
            </h2>
            <p className="text-gray-500 max-w-lg mx-auto text-sm font-medium">
              Real results from real vendors growing their businesses on our
              platform every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`${
                  i === 1
                    ? "bg-gold text-black"
                    : "bg-white/5 border border-white/10 text-white"
                } rounded p-10`}
              >
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`w-14 h-14 rounded flex items-center justify-center font-black text-lg ${
                      i === 1
                        ? "bg-black/10 text-black"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div
                      className={`font-black text-base ${
                        i === 1 ? "text-black" : "text-white"
                      }`}
                    >
                      {t.name}
                    </div>
                    <div
                      className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                        i === 1 ? "text-black/50" : "text-white/40"
                      }`}
                    >
                      {t.role}
                    </div>
                  </div>
                </div>
                <div
                  className={`leading-relaxed font-medium text-sm ${
                    i === 1 ? "text-black/80" : "text-gray-400"
                  }`}
                >
                  {t.quote}
                </div>
                <div
                  className={`mt-6 flex gap-1 ${
                    i === 1 ? "text-black" : "text-gold"
                  }`}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────── */}
      <section className="py-4 bg-gold">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-14">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-black tracking-tighter">
                Don&apos;t wait for the future.
                <br />
                Build it now.
              </h2>
              <p className="text-black/60 font-bold mt-4 text-base">
                It takes less than 5 minutes to get started.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 shrink-0">
              <Button
                variant="primary"
                size="lg"
                asChild
                className="bg-black! text-gold hover:bg-white! hover:text-black shadow-2xl px-14"
              >
                <Link href="/signup">Create Your Store</Link>
              </Button>
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Zero setup fees. Zero risk.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
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
                {[
                  { icon: <Twitter size={18} />, label: "𝕏" },
                  { icon: <Facebook size={18} />, label: "f" },
                  { icon: <Linkedin size={18} />, label: "in" },
                  { icon: <Instagram size={18} />, label: "📸" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-gold hover:text-gold flex items-center justify-center cursor-pointer transition-all"
                  >
                    {s.icon}
                  </div>
                ))}
              </div>
            </div>
            {[
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
                  { label: "Guides", href: "/resources" },
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
            ].map((col) => (
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
              © 2026 SAX-RAPID Vendor Center. All Rights Reserved.
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
