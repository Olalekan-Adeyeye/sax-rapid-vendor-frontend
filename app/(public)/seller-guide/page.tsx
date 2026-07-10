"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ExternalLink,
  Mail,
  MessageCircle,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Package,
  Store,
  ShieldCheck,
  Camera,
  FileText,
  BarChart3,
  Truck,
  Wallet,
  TrendingUp,
  Star,
  Percent,
  BookOpen,
  Users,
  Scale,
  Gavel,
} from "lucide-react";

const STEPS = [
  { number: 1, title: "Create Your Seller Account", desc: "Register your business and complete your seller profile." },
  { number: 2, title: "Verify Your Business", desc: "Submit the required documents for account verification." },
  { number: 3, title: "Set Up Your Store", desc: "Customize your storefront with your logo, banner, description, and business information." },
  { number: 4, title: "Add Your Products", desc: "Upload products with clear images, accurate descriptions, pricing, and inventory." },
  { number: 5, title: "Receive Orders", desc: "Get notified whenever customers purchase your products." },
  { number: 6, title: "Pack & Ship", desc: "Prepare your orders and arrange delivery through approved logistics partners." },
  { number: 7, title: "Get Paid", desc: "Receive secure payouts directly to your registered bank account." },
  { number: 8, title: "Grow Your Business", desc: "Use promotions, analytics, advertising, and customer reviews to increase sales." },
];

interface Guide {
  title: string;
  desc: string;
  topics: string[];
  icon: React.ReactNode;
}

interface Category {
  title: string;
  guides: Guide[];
}

const CATEGORIES: Category[] = [
  {
    title: "Getting Started",
    guides: [
      {
        title: "Register as a Seller",
        desc: "Learn how to create your seller account and complete your registration.",
        topics: ["Seller registration", "Business information", "Account verification", "Required documents", "Choosing your subscription"],
        icon: <Users size={24} />,
      },
      {
        title: "Complete Your Store Profile",
        desc: "A complete store profile builds trust and increases customer confidence.",
        topics: ["Upload your logo", "Add a store banner", "Write your business description", "Set business hours", "Configure contact information"],
        icon: <Store size={24} />,
      },
      {
        title: "Verify Your Seller Account",
        desc: "Verification helps customers shop with confidence.",
        topics: ["Verification requirements", "Required documents", "Review process", "Approval timeline", "Benefits of verification"],
        icon: <ShieldCheck size={24} />,
      },
    ],
  },
  {
    title: "Product Management",
    guides: [
      {
        title: "Add Your First Product",
        desc: "Learn how to create attractive product listings.",
        topics: ["Product title", "Product descriptions", "Product categories", "Pricing", "Inventory", "Product variations", "Shipping information"],
        icon: <Package size={24} />,
      },
      {
        title: "Product Photography Tips",
        desc: "Great photos increase sales.",
        topics: ["High-resolution images", "White background", "Multiple angles", "Lifestyle images", "Zoom-friendly photos"],
        icon: <Camera size={24} />,
      },
      {
        title: "Writing Great Product Descriptions",
        desc: "Help customers understand exactly what you're selling.",
        topics: ["Key features", "Benefits", "Specifications", "Materials", "Dimensions", "Warranty information"],
        icon: <FileText size={24} />,
      },
      {
        title: "Inventory Management",
        desc: "Keep your inventory accurate.",
        topics: ["Update stock", "Prevent overselling", "Manage product availability", "Handle low inventory"],
        icon: <BarChart3 size={24} />,
      },
    ],
  },
  {
    title: "Orders & Fulfilment",
    guides: [
      {
        title: "Managing Orders",
        desc: "Understand every order status.",
        topics: ["Pending", "Confirmed", "Processing", "Ready for Pickup", "Shipped", "Delivered", "Cancelled", "Returned"],
        icon: <Package size={24} />,
      },
      {
        title: "Preparing Orders",
        desc: "Learn proper packaging techniques.",
        topics: ["Secure packaging", "Accurate labeling", "Include invoices", "Protect fragile items"],
        icon: <CheckCircle size={24} />,
      },
      {
        title: "Shipping Products",
        desc: "Learn how delivery works.",
        topics: ["Delivery options", "Pickup scheduling", "Tracking shipments", "Delivery confirmation"],
        icon: <Truck size={24} />,
      },
      {
        title: "Returns",
        desc: "Learn how to process customer returns professionally.",
        topics: ["Return requests", "Approvals", "Replacement orders", "Refunds"],
        icon: <ArrowRight size={24} />,
      },
    ],
  },
  {
    title: "Payments & Payouts",
    guides: [
      {
        title: "Understanding Your Wallet",
        desc: "Learn how seller earnings work.",
        topics: ["Available Balance", "Pending Balance", "Withdrawals", "Transaction History"],
        icon: <Wallet size={24} />,
      },
      {
        title: "Payout Schedule",
        desc: "Understand when you'll receive payments.",
        topics: ["Settlement periods", "Withdrawal requests", "Processing time", "Bank transfers"],
        icon: <TrendingUp size={24} />,
      },
      {
        title: "Marketplace Fees",
        desc: "Understand applicable fees.",
        topics: ["Commission", "Subscription", "Promotions", "Payment processing"],
        icon: <Percent size={24} />,
      },
    ],
  },
  {
    title: "Marketing & Sales",
    guides: [
      {
        title: "Increase Your Sales",
        desc: "Practical strategies to attract more customers.",
        topics: ["Better product titles", "Better images", "Competitive pricing", "Customer reviews"],
        icon: <TrendingUp size={24} />,
      },
      {
        title: "Flash Deals",
        desc: "Learn how to participate in Flash Deals.",
        topics: ["Increased visibility", "Higher traffic", "More sales"],
        icon: <Percent size={24} />,
      },
      {
        title: "Sponsored Products",
        desc: "Advertise your products across SAX Rapid Marketplace.",
        topics: ["Campaign setup", "Budget", "Performance tracking"],
        icon: <BarChart3 size={24} />,
      },
      {
        title: "Customer Reviews",
        desc: "Learn how to improve your seller rating.",
        topics: ["Fast shipping", "Accurate descriptions", "Quality products", "Excellent customer service"],
        icon: <Star size={24} />,
      },
    ],
  },
  {
    title: "Store Growth",
    guides: [
      {
        title: "Analytics",
        desc: "Understand your store performance.",
        topics: ["Revenue", "Orders", "Visitors", "Conversion Rate", "Best Selling Products", "Repeat Customers"],
        icon: <BarChart3 size={24} />,
      },
      {
        title: "Promotions",
        desc: "Create store-wide promotions.",
        topics: ["Percentage discounts", "Buy One Get One Free", "Shipping coupons"],
        icon: <Percent size={24} />,
      },
      {
        title: "Building Customer Loyalty",
        desc: "Turn first-time buyers into repeat customers.",
        topics: ["Excellent customer service", "Fast responses", "Reliable delivery", "Quality packaging"],
        icon: <Star size={24} />,
      },
    ],
  },
  {
    title: "Marketplace Policies",
    guides: [
      {
        title: "Seller Code of Conduct",
        desc: "Understand your responsibilities.",
        topics: ["Professional behaviour", "Honest listings", "Customer communication", "Fair pricing"],
        icon: <Scale size={24} />,
      },
      {
        title: "Prohibited Products",
        desc: "Know what cannot be sold.",
        topics: ["Counterfeit goods", "Illegal products", "Dangerous items", "Restricted products"],
        icon: <Gavel size={24} />,
      },
      {
        title: "Marketplace Standards",
        desc: "Maintain excellent seller performance.",
        topics: ["Order Fulfilment Rate", "Cancellation Rate", "Late Shipment Rate", "Customer Rating"],
        icon: <ShieldCheck size={24} />,
      },
    ],
  },
];

const FAQS = [
  { q: "How do I become a seller?", a: "Create a seller account, complete verification, and publish your first product." },
  { q: "How long does verification take?", a: "Verification is typically completed within 2\u20135 business days, provided all required documents are submitted accurately." },
  { q: "How do I receive payments?", a: "Payments are transferred to your registered bank account according to the marketplace payout schedule." },
  { q: "Can I edit my products after publishing?", a: "Yes. You can update pricing, inventory, descriptions, and images at any time through your Seller Dashboard." },
  { q: "How do I increase my sales?", a: "Use high-quality product images, competitive pricing, detailed descriptions, excellent customer service, and participate in promotions like Flash Deals." },
];

export default function SellerGuidesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <>
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-200 h-200 -translate-x-1/2 -translate-y-1/2 bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="w-10 h-1.5 bg-gold rounded-full mb-6 mx-auto" />
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            Seller Guides
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to succeed on SAX Rapid Marketplace. Whether
            you&apos;re opening your first online store or you&apos;re an
            experienced merchant, our guides will help you set up your business,
            attract customers, manage orders, and grow your sales.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gold text-black text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded hover:bg-white transition-all"
            >
              Start Selling
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded hover:border-gold hover:text-gold transition-all"
            >
              Vendor Hub
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gold mb-4">
              Seller Journey
            </h2>
            <p className="text-3xl font-black text-black tracking-tighter">
              Follow these simple steps to start selling
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => (
              <div
                key={step.number}
                className="bg-white border border-gray-100 rounded p-6 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <span className="text-5xl font-black text-gray-100 absolute top-3 right-4 leading-none select-none">
                  {String(step.number).padStart(2, "0")}
                </span>
                <div className="w-10 h-10 rounded bg-gold/10 flex items-center justify-center text-gold font-black text-sm mb-4 relative">
                  {step.number}
                </div>
                <h3 className="font-black text-sm uppercase tracking-wider mb-2 relative">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed relative">
                  {step.desc}
                </p>
                {i < STEPS.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 text-gray-200">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gold mb-4">
              Guides Library
            </h2>
            <p className="text-3xl font-black text-black tracking-tighter">
              Browse by category
            </p>
          </div>

          <div className="space-y-8">
            {CATEGORIES.map((cat) => (
              <div key={cat.title} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === cat.title ? null : cat.title)
                  }
                  className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <h3 className="font-black text-sm uppercase tracking-wider">
                    {cat.title}
                  </h3>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 transition-transform duration-300 ${
                      openCategory === cat.title ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300 ${
                    openCategory === cat.title
                      ? "max-h-[2000px] opacity-100 p-5"
                      : "max-h-0 opacity-0 p-0 overflow-hidden"
                  }`}
                >
                  {cat.guides.map((guide) => (
                    <div
                      key={guide.title}
                      className="flex items-start gap-4 group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded bg-gold/10 flex items-center justify-center text-gold shrink-0 mt-0.5">
                        {guide.icon}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-black text-sm uppercase tracking-wider mb-1 group-hover:text-gold transition-colors">
                          {guide.title}
                        </h4>
                        <p className="text-xs text-gray-500 mb-2">
                          {guide.desc}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {guide.topics.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gold mb-4">
              FAQ
            </h2>
            <p className="text-3xl font-black text-black tracking-tighter">
              Frequently Asked Questions
            </p>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-bold text-sm pr-4">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    openFaq === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gold mb-4">
              Seller Resources
            </h2>
            <p className="text-3xl font-black text-black tracking-tighter">
              Access tools designed to help your business succeed
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Help Center", icon: <HelpCircle size={20} />, href: "#" },
              { label: "Seller Policies", icon: <Scale size={20} />, href: "#" },
              { label: "Shipping Guidelines", icon: <Truck size={20} />, href: "#" },
              { label: "Marketing Resources", icon: <TrendingUp size={20} />, href: "#" },
              { label: "Community Forum", icon: <Users size={20} />, sub: "Coming Soon", href: "#" },
              { label: "API Documentation", icon: <FileText size={20} />, sub: "Coming Soon", href: "#" },
              { label: "Seller Academy", icon: <BookOpen size={20} />, sub: "Coming Soon", href: "#" },
            ].map((r) => (
              <Link
                key={r.label}
                href={r.href}
                className="flex flex-col items-center text-center p-6 bg-gray-50 border border-gray-100 rounded hover:border-gold hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded bg-gold/10 flex items-center justify-center text-gold mb-4 group-hover:scale-110 transition-transform">
                  {r.icon}
                </div>
                <span className="font-black text-xs uppercase tracking-wider">
                  {r.label}
                </span>
                {r.sub && (
                  <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                    {r.sub}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-200 h-200 -translate-x-1/2 -translate-y-1/2 bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-4">
              Need Help?
            </h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Our Seller Success Team is here to support you every step of the way.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Start Live Chat", icon: <MessageCircle size={18} /> },
              { label: "Email Seller Support", icon: <Mail size={18} /> },
              { label: "Visit the Help Center", icon: <HelpCircle size={18} /> },
            ].map((item) => (
              <Link
                key={item.label}
                href="#"
                className="flex items-center justify-center gap-3 border border-gray-800 text-gray-300 text-[11px] font-black uppercase tracking-widest px-6 py-5 rounded hover:border-gold hover:text-gold transition-all"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-black text-white tracking-tighter mb-4">
              Ready to Grow Your Business?
            </h3>
            <p className="text-gray-400 text-sm mb-8">
              Join thousands of businesses using SAX Rapid Marketplace to reach
              more customers across Nigeria and South Africa.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-gold text-black text-[11px] font-black uppercase tracking-widest px-10 py-5 rounded hover:bg-white transition-all"
              >
                Start Selling Today
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-gray-700 text-gray-300 text-[11px] font-black uppercase tracking-widest px-10 py-5 rounded hover:border-gold hover:text-gold transition-all"
              >
                Go to Vendor Hub
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
