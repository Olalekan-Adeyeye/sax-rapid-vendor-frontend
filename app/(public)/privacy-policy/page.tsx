import Link from "next/link";

interface LegalSubSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface LegalSection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  subSections?: LegalSubSection[];
}

const SECTIONS: LegalSection[] = [
  {
    title: "1. Introduction",
    paragraphs: [
      "Welcome to SAX RAPID MARKET (“we”, “our”, “us”, or the “Platform”), operated by SAX RAPID MARKET LIMITED.",
      "We respect your privacy and are committed to protecting the personal information of our customers, sellers, website visitors, and other users.",
      "This Privacy Policy explains how we collect, use, store, disclose, and protect your personal information when you visit our website, create an account, purchase products, sell products, or use our services.",
      "Our services are intended to support users in Nigeria and South Africa. We handle personal information in accordance with applicable data protection laws, including the Nigeria Data Protection Act 2023 and, where applicable, South Africa’s Protection of Personal Information Act 2013 (POPIA).",
      "By using our Platform, you acknowledge that you have read this Privacy Policy.",
    ],
  },
  {
    title: "2. Information We Collect",
    paragraphs: [
      "We may collect the following categories of personal information, depending on how you use our Platform.",
    ],
    subSections: [
      {
        heading: "2.1 Personal Identification Information",
        paragraphs: ["This may include:"],
        bullets: [
          "Full name.",
          "Email address.",
          "Telephone number.",
          "Account username and login details.",
          "Billing and delivery addresses.",
          "Business name and business contact information.",
          "Identity or business verification information where required.",
        ],
      },
      {
        heading: "2.2 Account Information",
        paragraphs: [
          "When you register for an account, we may collect information such as your account preferences, profile details, registration information, and account activity.",
          "Sellers may also be required to provide business registration details, relevant identification documents, and other information necessary to verify their accounts.",
        ],
      },
      {
        heading: "2.3 Order and Transaction Information",
        paragraphs: [
          "When you buy or sell products through SAX RAPID MARKET, we may collect:",
        ],
        bullets: [
          "Order details and purchase history.",
          "Products purchased or listed.",
          "Transaction references and payment status.",
          "Delivery addresses and fulfilment information.",
          "Refund, cancellation, and dispute records.",
          "Seller payout details necessary to process payments.",
        ],
      },
      {
        heading: "2.4 Technical and Usage Information",
        paragraphs: [
          "When you access our Platform, we may automatically collect:",
          "We use this information to maintain the security, functionality, and performance of our services.",
        ],
        bullets: [
          "IP address.",
          "Browser type and device information.",
          "Operating system.",
          "Pages visited and interactions with the Platform.",
          "Access dates and times.",
          "Cookies and similar tracking technologies.",
          "Security logs and diagnostic information.",
        ],
      },
      {
        heading: "2.5 Communications and Support Information",
        paragraphs: [
          "If you contact us, submit a complaint, request assistance, or communicate with our support team, we may retain your messages and the information necessary to respond to your enquiry.",
        ],
      },
    ],
  },
  {
    title: "3. How We Use Your Information",
    paragraphs: ["We may use personal information for the following purposes:"],
    bullets: [
      "To create, verify, and manage customer and seller accounts.",
      "To facilitate purchases, sales, payments, refunds, and seller payouts.",
      "To process and coordinate order fulfilment and delivery.",
      "To communicate order updates, account notifications, and service announcements.",
      "To provide customer support and resolve disputes.",
      "To detect fraud, prevent unauthorized access, and protect users.",
      "To monitor and improve our website, services, and user experience.",
      "To comply with applicable legal, regulatory, accounting, and reporting obligations.",
      "To send promotional communications where permitted by law and subject to applicable consent or opt-out requirements.",
      "To enforce our Terms of Service and other applicable policies.",
    ],
  },
  {
    title: "4. Legal Basis for Processing",
    paragraphs: [
      "Where required by applicable law, we process personal information on one or more of the following legal bases:",
      "Where processing relies on consent, you may withdraw that consent subject to applicable legal requirements.",
    ],
    bullets: [
      "Contract: To create and manage accounts, process orders, facilitate payments, and provide requested services.",
      "Legal obligation: To comply with applicable laws, lawful requests, recordkeeping requirements, and regulatory obligations.",
      "Legitimate interests: To protect our Platform, prevent fraud, improve our services, and manage our business, where these interests do not override your applicable rights.",
      "Consent: Where you have provided consent for a specific purpose, such as certain marketing communications or non-essential cookies, where required.",
    ],
  },
  {
    title: "5. How We Share Your Information",
    paragraphs: [
      "We do not sell your personal information to third parties as part of our ordinary business operations.",
      "However, we may share relevant information with the following categories of recipients where necessary and lawful.",
    ],
    subSections: [
      {
        heading: "5.1 Sellers and Customers",
        paragraphs: [
          "To complete marketplace transactions, relevant order information may be shared between customers and sellers. This may include customer names, delivery details, order information, and contact details where necessary for fulfilment or customer support.",
        ],
      },
      {
        heading: "5.2 Payment Service Providers",
        paragraphs: [
          "We may share transaction and account information with payment processors, banks, payment gateways, and other financial service providers to process payments, refunds, verification, fraud prevention, and seller payouts.",
        ],
      },
      {
        heading: "5.3 Delivery and Logistics Partners",
        paragraphs: [
          "We may share necessary delivery information with courier companies, logistics providers, and fulfilment partners to enable collection, shipment, tracking, and delivery of orders.",
        ],
      },
      {
        heading: "5.4 Technology and Service Providers",
        paragraphs: [
          "We may use third-party providers for website hosting, cloud storage, analytics, email communications, security, customer support, and other operational services.",
          "These providers may process personal information on our behalf in accordance with applicable agreements and legal requirements.",
        ],
      },
      {
        heading: "5.5 Legal and Regulatory Authorities",
        paragraphs: [
          "We may disclose information where required by law, a valid legal process, a regulatory obligation, or where reasonably necessary to protect our rights, users, property, or the security of our Platform.",
        ],
      },
      {
        heading: "5.6 Business Transfers",
        paragraphs: [
          "If SAX RAPID MARKET LIMITED undergoes a merger, acquisition, restructuring, or sale of assets, personal information may be transferred as part of that transaction, subject to applicable legal requirements and appropriate safeguards.",
        ],
      },
    ],
  },
  {
    title: "6. International Data Transfers",
    paragraphs: [
      "Because SAX RAPID MARKET serves users in Nigeria and South Africa, personal information may be processed or stored in a country different from the country in which it was collected.",
      "Some of our service providers may operate servers or systems outside Nigeria or South Africa.",
      "Where personal information is transferred internationally, we will take steps required by applicable law to ensure that the transfer is lawful and that appropriate safeguards are in place to protect the information.",
    ],
  },
  {
    title: "7. Data Retention",
    paragraphs: [
      "We retain personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, including providing services, maintaining transaction records, resolving disputes, preventing fraud, and complying with legal obligations.",
      "Retention periods may vary depending on the type of information, the nature of the transaction, applicable legal requirements, and the circumstances of the account.",
      "When information is no longer required, we will take appropriate steps to delete, anonymize, or securely dispose of it, subject to applicable legal obligations and legitimate recordkeeping needs.",
    ],
  },
  {
    title: "8. Data Security",
    paragraphs: [
      "We implement appropriate technical and organizational measures designed to protect personal information against unauthorized access, loss, misuse, alteration, disclosure, or destruction.",
      "These measures may include access controls, authentication procedures, security monitoring, and safeguards provided by our technology partners.",
      "However, no website, electronic transmission, or storage system can be guaranteed to be completely secure. You are responsible for keeping your login credentials confidential and notifying us promptly if you suspect unauthorized access to your account.",
      "Where required by applicable law, we will take appropriate action and notify affected individuals or relevant authorities of personal data breaches.",
    ],
  },
  {
    title: "9. Cookies and Similar Technologies",
    paragraphs: [
      "Our website may use cookies and similar technologies to:",
      "Some cookies are essential to the operation of the Platform, while others may be optional.",
      "You may be able to control cookies through your browser settings or any cookie preference tool we provide. Disabling certain cookies may affect website functionality.",
      "Where required by law, we will obtain consent before using non-essential cookies or similar technologies.",
    ],
    bullets: [
      "Keep users signed in.",
      "Maintain shopping cart and checkout functionality.",
      "Remember preferences.",
      "Understand website traffic and usage.",
      "Improve performance and security.",
      "Support marketing activities where enabled and legally permitted.",
    ],
  },
  {
    title: "10. Your Privacy Rights",
    paragraphs: [
      "Depending on your location and applicable law, you may have the right to:",
      "These rights are subject to applicable legal conditions and exceptions. We may need to verify your identity before responding to a request.",
      "To exercise your rights, please contact us using the details provided in the Contact Us section.",
    ],
    bullets: [
      "Request access to personal information we hold about you.",
      "Request correction of inaccurate or incomplete information.",
      "Request deletion of personal information where legally applicable.",
      "Object to certain types of processing.",
      "Request restriction of processing in qualifying circumstances.",
      "Request a copy of certain personal information in a portable format, where applicable.",
      "Withdraw consent where processing is based on consent.",
      "Opt out of direct marketing communications.",
      "Lodge a complaint with the relevant data protection authority.",
    ],
  },
  {
    title: "11. Nigeria-Specific Privacy Information",
    paragraphs: [
      "For individuals in Nigeria, we aim to handle personal information in accordance with the Nigeria Data Protection Act 2023 and other applicable data protection requirements.",
      "You may have rights concerning access, correction, deletion, objection, consent withdrawal, and complaints, subject to applicable law.",
      "You may also contact the Nigeria Data Protection Commission where appropriate if you believe your personal information has been handled unlawfully.",
    ],
  },
  {
    title: "12. South Africa-Specific Privacy Information",
    paragraphs: [
      "For individuals in South Africa, we aim to handle personal information in accordance with the Protection of Personal Information Act 2013 (POPIA), where applicable.",
      "You may have rights concerning access to, correction of, and deletion of personal information, as well as objection to certain processing activities, subject to applicable law.",
      "Where applicable, you may lodge a complaint with the Information Regulator of South Africa if you believe your personal information has been processed unlawfully.",
    ],
  },
  {
    title: "13. Children's Privacy",
    paragraphs: [
      "SAX RAPID MARKET is intended for individuals who can legally enter into transactions and create accounts under applicable law.",
      "We do not knowingly collect personal information directly from children in circumstances where parental consent or other legal authorization is required and has not been obtained.",
      "If you believe that a child has provided personal information to us unlawfully, please contact us so that we can review the situation and take appropriate action.",
    ],
  },
  {
    title: "14. Third-Party Websites and Services",
    paragraphs: [
      "Our Platform may contain links to third-party websites, payment providers, delivery services, or other external platforms.",
      "We are not responsible for the privacy practices, content, or security of third-party services that we do not operate.",
      "We encourage you to review the relevant privacy policies before providing personal information to those services.",
    ],
  },
  {
    title: "15. Marketing Communications",
    paragraphs: [
      "We may send you service-related messages concerning your account, orders, transactions, security, and important changes to our services.",
      "Where permitted by law, we may also send promotional communications about products, services, and marketplace updates.",
      "You may unsubscribe from promotional emails using the unsubscribe link provided or contact us directly. You may still receive essential service and transactional communications where necessary.",
    ],
  },
  {
    title: "16. Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our services, business operations, technology, or applicable legal requirements.",
      "Any updated version will be published on our website with a revised “Last Updated” date.",
      "Where required by applicable law, we will provide additional notice or obtain consent for material changes.",
      "We encourage you to review this page periodically.",
    ],
  },
  {
    title: "17. Contact Us",
    paragraphs: [
      "If you have questions about this Privacy Policy, wish to exercise your privacy rights, or want to raise a concern about how your personal information is handled, please contact:",
      "Please include sufficient information to help us understand your request. We may ask you to verify your identity before processing certain requests.",
    ],
    bullets: [
      "Business Name: SAX RAPID MARKET LIMITED",
      "Website Brand: SAX RAPID MARKET",
      "Email: vendor@saxrapidmarket.com",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="py-24 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-200 h-200 -translate-x-1/2 -translate-y-1/2 bg-gold/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="w-10 h-1.5 bg-gold rounded-full mb-6 mx-auto" />
          <p className="text-gold text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            SAX RAPID MARKET
          </p>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Operated by SAX RAPID MARKET LIMITED. Learn how we collect, use,
            store, disclose, and protect your personal information.
          </p>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-6">
            Last Updated: 9 October 2026
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm text-gray-500 leading-relaxed mb-10 bg-white border border-gray-100 rounded-xl p-6">
            Payment card information and other sensitive payment credentials may
            be collected and processed directly by our payment service
            providers. Where this applies, their own privacy policies and
            security practices also govern their processing of that information.
            We will not use personal information for purposes incompatible with
            the reasons for which it was collected unless permitted by
            applicable law.
          </p>
          <div className="space-y-6">
            {SECTIONS.map((section) => (
              <div
                key={section.title}
                className="bg-white border border-gray-100 rounded-xl p-8"
              >
                <h2 className="font-black text-lg tracking-tight mb-4">
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 48)}
                    className="text-sm text-gray-500 leading-relaxed mb-3"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 mt-4 mb-2">
                    {section.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="text-sm text-gray-600 flex items-start gap-3"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}
                {section.subSections?.map((sub) => (
                  <div
                    key={sub.heading}
                    className="mt-6 pt-6 border-t border-gray-100"
                  >
                    <h3 className="font-black text-sm uppercase tracking-wider mb-3">
                      {sub.heading}
                    </h3>
                    {sub.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph.slice(0, 48)}
                        className="text-sm text-gray-500 leading-relaxed mb-3"
                      >
                        {paragraph}
                      </p>
                    ))}
                    {sub.bullets && (
                      <ul className="space-y-2 mt-4">
                        {sub.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="text-sm text-gray-600 flex items-start gap-3"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gold relative overflow-hidden">
        <div className="absolute top-0 left-1/2 w-200 h-200 -translate-x-1/2 -translate-y-1/2 bg-black/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h3 className="text-3xl font-black text-black tracking-tighter mb-4">
              Ready to Grow Your Business?
            </h3>
            <p className="text-black/60 text-sm mb-8">
              Join thousands of businesses using SAX Rapid Marketplace to reach
              more customers across Nigeria and South Africa.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-black text-white text-[11px] font-black uppercase tracking-widest px-10 py-5 rounded hover:bg-white hover:text-black transition-all"
              >
                Start Selling Today
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-black/30 text-black text-[11px] font-black uppercase tracking-widest px-10 py-5 rounded hover:bg-black hover:text-white transition-all"
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
