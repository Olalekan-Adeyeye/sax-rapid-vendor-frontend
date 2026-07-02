"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I register as a vendor on SAX·RAPID?",
        a: "Click 'Start Selling' on the homepage, fill in your business details, and complete the KYC verification. Most applications are approved within 24 hours.",
      },
      {
        q: "What documents do I need for verification?",
        a: "You'll need a valid government-issued ID (NIN, BVN, International Passport, or Driver's License), proof of business registration (if applicable), and a bank account in your business name.",
      },
      {
        q: "How long does it take to set up my store?",
        a: "Basic setup takes less than 5 minutes. After KYC approval, you can start listing products immediately. Most vendors go from registration to first sale within 24 hours.",
      },
      {
        q: "Are there any setup fees?",
        a: "No. SAX·RAPID charges zero setup fees and no monthly subscriptions. You only pay a commission when you make a sale.",
      },
    ],
  },
  {
    category: "Fees & Payments",
    questions: [
      {
        q: "What commission does SAX·RAPID charge?",
        a: "Commission rates start at 5% for Basic sellers and vary based on your tier. Visit our Fees & Commissions section for a full breakdown.",
      },
      {
        q: "When do I get paid?",
        a: "Basic sellers receive payouts every Friday. Pro sellers enjoy daily payouts, and Enterprise sellers get same-day settlements.",
      },
      {
        q: "Are there any hidden fees?",
        a: "Never. SAX·RAPID is transparent about all costs. There are no listing fees, no subscription charges, and no hidden deductions.",
      },
      {
        q: "How do I withdraw my earnings?",
        a: "Earnings are automatically settled to your registered bank account. You can update your bank details anytime from your dashboard settings.",
      },
    ],
  },
  {
    category: "Shipping & Logistics",
    questions: [
      {
        q: "How does SAX·RAPID handle delivery?",
        a: "Our Rapid Delivery network handles pickup from your location, packaging, and nationwide delivery. You just pack and hand over to our dispatch rider.",
      },
      {
        q: "What if a product is damaged during delivery?",
        a: "SAX·RAPID covers all logistics-related damages. You'll be fully compensated for items damaged in transit.",
      },
      {
        q: "Do I need to handle shipping myself?",
        a: "No. Our logistics team manages everything. However, Enterprise sellers with existing logistics partners can integrate their own delivery system via API.",
      },
    ],
  },
  {
    category: "Account & Support",
    questions: [
      {
        q: "How do I contact vendor support?",
        a: "Vendors get 24/7 support via in-app chat, email (vendors@saxrapid.com), and phone. Pro and Enterprise sellers also get a dedicated account manager.",
      },
      {
        q: "Can I sell on other platforms while using SAX·RAPID?",
        a: "Yes. We have no exclusivity requirement. You're free to sell on other platforms alongside SAX·RAPID.",
      },
      {
        q: "How do I close my vendor account?",
        a: "Contact our support team from your dashboard. We'll process closure within 48 hours and release any pending balance after the standard settlement period.",
      },
    ],
  },
];

export default function FAQPage() {
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = FAQ_ITEMS.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase()),
    ),
  })).filter((cat) => cat.questions.length > 0);

  const allQuestions = FAQ_ITEMS.flatMap((cat) => cat.questions);

  return (
    <>
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-200 h-200 -translate-x-1/2 -translate-y-1/2 bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10 text-center">
          <div className="w-10 h-1.5 bg-gold rounded-full mb-6 mx-auto" />
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-400 text-lg max-w-lg mx-auto">
            Everything you need to know about selling on SAX·RAPID.
          </p>

          <div className="relative max-w-xl mx-auto mt-10">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(null);
              }}
              className="w-full bg-white/10 border border-white/10 rounded pl-12 pr-4 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-gold/50 transition-colors text-sm font-medium"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          {search && filtered.length === 0 && (
            <div className="text-center py-16">
              <HelpCircle size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                No results found for &quot;{search}&quot;
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Try a different search term or browse categories below.
              </p>
            </div>
          )}

          {!search && (
            <div className="flex flex-wrap gap-2 mb-12">
              {FAQ_ITEMS.map((cat) => (
                <a
                  key={cat.category}
                  href={`#cat-${cat.category.replace(/\s+/g, "-")}`}
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2.5 bg-white border border-gray-200 rounded hover:border-gold hover:text-gold transition-colors"
                >
                  {cat.category}
                </a>
              ))}
              <a
                href={`#cat-${FAQ_ITEMS[FAQ_ITEMS.length - 1].category.replace(/\s+/g, "-")}`}
                className="text-[10px] font-black uppercase tracking-widest px-4 py-2.5 bg-white border border-gray-200 rounded hover:border-gold hover:text-gold transition-colors"
              >
                View All ({allQuestions.length})
              </a>
            </div>
          )}

          {(search ? filtered : FAQ_ITEMS).map((cat) => (
            <div
              key={cat.category}
              id={`cat-${cat.category.replace(/\s+/g, "-")}`}
              className="mb-12 scroll-mt-32"
            >
              <h2 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-6">
                {cat.category}
              </h2>
              <div className="space-y-2">
                {cat.questions.map((item, qIdx) => {
                  const globalIdx = allQuestions.indexOf(item);
                  const isOpen = openIndex === globalIdx;
                  return (
                    <div
                      key={qIdx}
                      className="bg-white border border-gray-100 rounded overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-bold pr-4">{item.q}</span>
                        <ChevronDown
                          size={16}
                          className={`shrink-0 text-gray-400 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        <p className="px-6 pb-6 text-sm text-gray-500 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <HelpCircle size={40} className="text-gold mx-auto mb-4" />
          <h2 className="text-2xl font-black tracking-tighter mb-2">
            Still have questions?
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            Our support team is ready to help 24/7.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-black text-gold text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded hover:bg-gold hover:text-black transition-all"
            >
              Start Selling
            </Link>
            <Link
              href="mailto:vendors@saxrapid.com"
              className="inline-flex items-center gap-2 border border-gray-200 text-black text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded hover:border-gold transition-all"
            >
              Email Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
