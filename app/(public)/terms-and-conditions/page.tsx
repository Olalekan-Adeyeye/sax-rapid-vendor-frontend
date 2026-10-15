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
      "These Terms and Conditions (“Terms”) govern your access to and use of our website, marketplace, seller services, and related features.",
      "By accessing our website, creating an account, purchasing products, or registering as a seller, you agree to be bound by these Terms and our applicable policies.",
      "If you do not agree with these Terms, you should not use the Platform.",
    ],
  },
  {
    title: "2. About SAX RAPID MARKET",
    paragraphs: [
      "SAX RAPID MARKET is an online marketplace intended to connect customers with sellers offering products through our Platform.",
      "Depending on the services available in your location, the Platform may allow users to browse products, place orders, manage seller accounts, make payments, and arrange order fulfilment.",
      "Unless expressly stated otherwise, SAX RAPID MARKET acts as a marketplace facilitating transactions between independent sellers and customers. Individual sellers are responsible for the products they list, the accuracy of their product descriptions, and fulfilling their obligations to customers.",
    ],
  },
  {
    title: "3. Eligibility and Account Registration",
    paragraphs: [
      "To use certain features, you may be required to create an account.",
      "By registering, you agree to:",
      "You must meet the applicable legal age and capacity requirements to enter into transactions through the Platform. Where permitted by law, a minor may use certain services only with appropriate parental or guardian involvement.",
      "We reserve the right to suspend or restrict accounts where information is materially inaccurate, fraudulent, or in breach of these Terms, subject to applicable law.",
    ],
    bullets: [
      "Provide accurate, complete, and current information.",
      "Keep your account details up to date.",
      "Maintain the confidentiality of your login credentials.",
      "Notify us promptly of suspected unauthorized access.",
      "Use the Platform only for lawful purposes.",
      "Not impersonate another person or provide misleading information.",
    ],
  },
  {
    title: "4. Customer Terms",
    paragraphs: [],
    subSections: [
      {
        heading: "4.1 Placing Orders",
        paragraphs: [
          "Customers may purchase products listed by participating sellers through the Platform.",
          "Submitting an order constitutes an offer to purchase the selected products. Order confirmation, acceptance, payment authorization, and contract formation will depend on the checkout process and applicable transaction terms.",
          "We reserve the right to cancel or reject an order where permitted by law, including in cases of suspected fraud, incorrect pricing, unavailable stock, or technical errors. Where payment has been collected for an order that is cancelled, applicable refunds will be processed in accordance with our refund policy and applicable law.",
        ],
      },
      {
        heading: "4.2 Product Information",
        paragraphs: [
          "Sellers are responsible for ensuring that product descriptions, photographs, prices, specifications, availability, and other listing details are accurate and not misleading.",
          "We make reasonable efforts to present product information accurately but cannot guarantee that every image, description, or listing is error-free.",
          "If you identify inaccurate or misleading product information, please contact our support team.",
        ],
      },
      {
        heading: "4.3 Pricing and Currency",
        paragraphs: [
          "Product prices will be displayed in the currency applicable to the relevant market or transaction.",
          "Depending on the seller, location, and available services, additional charges may apply, including delivery fees, applicable taxes, or payment processing charges disclosed at checkout.",
          "Customers should review the final order total before completing a purchase.",
        ],
      },
    ],
  },
  {
    title: "5. Seller Terms",
    paragraphs: [],
    subSections: [
      {
        heading: "5.1 Seller Registration",
        paragraphs: [
          "Individuals and businesses wishing to sell through SAX RAPID MARKET must complete the applicable registration process and provide the information reasonably required for account verification.",
          "We may request business registration documents, identity verification, contact details, payment information, and other documentation necessary for legal compliance, fraud prevention, and marketplace operations.",
          "Approval to register does not guarantee permanent access to the Platform.",
        ],
      },
      {
        heading: "5.2 Seller Responsibilities",
        paragraphs: [
          "Sellers agree to:",
          "Sellers remain responsible for their business operations, products, and obligations to customers, subject to applicable law and any separate agreement with SAX RAPID MARKET.",
        ],
        bullets: [
          "Provide accurate and complete product listings.",
          "Ensure they have the legal right to sell listed products.",
          "Comply with applicable product safety, labelling, consumer protection, tax, and trading laws.",
          "Maintain accurate stock and pricing information.",
          "Fulfil accepted orders within the stated or agreed timeframe.",
          "Package products appropriately for delivery.",
          "Respond reasonably to customer enquiries and complaints.",
          "Honour applicable return, refund, warranty, and cancellation obligations.",
          "Avoid misleading advertising, counterfeit goods, prohibited products, and fraudulent activities.",
          "Maintain accurate payment and business information.",
          "Comply with our Seller Policies and any applicable marketplace rules.",
        ],
      },
      {
        heading: "5.3 Product Restrictions",
        paragraphs: [
          "Sellers must not list products or services that are illegal, counterfeit, stolen, unsafe, prohibited by applicable law, or otherwise restricted by our policies.",
          "We may remove listings or restrict accounts where necessary to address suspected violations, protect users, comply with the law, or maintain marketplace integrity.",
        ],
      },
      {
        heading: "5.4 Seller Payouts",
        paragraphs: [
          "Seller payouts are subject to the applicable payment arrangements, verification requirements, transaction status, and any disclosed fees or lawful deductions.",
          "Payout timing, settlement frequency, minimum payout thresholds, and applicable charges will be communicated through the relevant seller documentation or Platform interface.",
          "We do not guarantee a particular payout schedule unless it has been expressly confirmed in the applicable seller agreement or published payout policy.",
          "Where a transaction is disputed, reversed, refunded, or suspected to involve fraud, we may take reasonable and lawful steps to review or temporarily restrict the relevant funds.",
        ],
      },
    ],
  },
  {
    title: "6. Fees and Commissions",
    paragraphs: [
      "SAX RAPID MARKET may charge sellers commissions, transaction fees, subscription fees, listing fees, or other charges where applicable.",
      "Any applicable fees and the basis for calculating them will be disclosed through the relevant seller terms, fee schedule, or Platform interface.",
      "Sellers are responsible for reviewing the applicable charges before accepting the relevant commercial terms.",
      "We may change our fees by providing notice where required under the applicable agreement and law. Changes will not override mandatory consumer rights or other legal protections.",
    ],
  },
  {
    title: "7. Payments",
    paragraphs: [
      "Payments may be processed through third-party payment gateways, banks, or other authorized payment service providers.",
      "Users agree to provide accurate payment information and use payment methods they are authorized to use.",
      "Payment processing may be subject to the terms, conditions, verification requirements, and privacy policies of the relevant payment provider.",
      "SAX RAPID MARKET does not guarantee uninterrupted availability of third-party payment services and is not responsible for disruptions beyond our reasonable control. This does not exclude any liability that cannot lawfully be excluded.",
    ],
  },
  {
    title: "8. Delivery and Order Fulfilment",
    paragraphs: [
      "Delivery options, charges, estimated delivery times, and service coverage may vary according to the seller, product, delivery destination, and available logistics providers.",
      "Delivery estimates are not guarantees unless expressly stated as such.",
      "Sellers must prepare and hand over orders in accordance with the applicable fulfilment arrangements. Customers must provide accurate delivery information and cooperate with reasonable delivery requirements.",
      "Where an order is delayed, lost, damaged, or incorrectly delivered, the customer should contact our support team or follow the applicable order dispute procedure.",
      "Nothing in these Terms removes any mandatory rights customers may have under applicable consumer protection laws.",
    ],
  },
  {
    title: "9. Returns, Refunds, and Cancellations",
    paragraphs: [
      "Returns, refunds, and cancellations are governed by our separate Returns and Refunds Policy, the relevant seller terms, and applicable law.",
      "Eligibility may depend on the product, its condition, the reason for the request, and the timing of the request.",
      "Certain products may be subject to lawful restrictions on returns, including products that are perishable, personalized, sealed for hygiene reasons, or otherwise exempt where applicable law permits.",
      "Any such restrictions will not override statutory consumer rights.",
      "Refunds, where approved or legally required, will generally be processed using the original payment method where reasonably possible. Processing times may depend on the payment provider or financial institution.",
      "Customers should review the Returns and Refunds Policy before completing a purchase.",
    ],
  },
  {
    title: "10. Cancellations and Account Restrictions",
    paragraphs: [
      "We may cancel orders, remove listings, suspend accounts, or restrict access to certain features where reasonably necessary to:",
      "Where appropriate and legally permitted, we will provide notice and an opportunity to resolve the issue.",
      "Users may request account closure by contacting us, subject to outstanding transactions, legal obligations, and necessary record retention.",
    ],
    bullets: [
      "Investigate suspected fraud or unlawful activity.",
      "Address breaches of these Terms or applicable policies.",
      "Protect customers, sellers, or the Platform.",
      "Comply with legal or regulatory obligations.",
      "Address security threats or misuse.",
    ],
  },
  {
    title: "11. Prohibited Conduct",
    paragraphs: [
      "You must not:",
      "We may investigate suspected violations and take appropriate action in accordance with these Terms and applicable law.",
    ],
    bullets: [
      "Use the Platform for unlawful or fraudulent purposes.",
      "Provide false identity, business, or payment information.",
      "Upload malicious software or attempt unauthorized access.",
      "Interfere with the operation, security, or availability of the Platform.",
      "Manipulate orders, reviews, ratings, or transactions.",
      "Use the Platform to distribute counterfeit or prohibited products.",
      "Harass, threaten, defraud, or mislead other users.",
      "Collect or misuse other users’ personal information without lawful authority.",
      "Circumvent applicable fees, verification procedures, or security controls.",
      "Use automated tools to access or extract Platform data without authorization.",
    ],
  },
  {
    title: "12. Reviews and User-Generated Content",
    paragraphs: [
      "Where review or feedback features are available, users must ensure their submissions are honest, relevant, and based on genuine experiences.",
      "You must not submit content that is unlawful, defamatory, fraudulent, discriminatory, threatening, misleading, or infringing on another person's rights.",
      "By submitting content to the Platform, you grant SAX RAPID MARKET a non-exclusive, worldwide, royalty-free licence to host, reproduce, display, and use that content as reasonably necessary to operate, promote, and improve the Platform, subject to applicable law and your rights.",
      "We may remove content that violates these Terms or applicable policies.",
    ],
  },
  {
    title: "13. Intellectual Property",
    paragraphs: [
      "The Platform, including its branding, logos, website design, software, text, graphics, and other materials, is owned by or licensed to SAX RAPID MARKET LIMITED or the relevant rights holders.",
      "You may use the Platform only for its intended purposes and in accordance with these Terms.",
      "You must not copy, reproduce, distribute, modify, commercially exploit, or create derivative works from our protected materials without prior authorization, except where permitted by law.",
      "Sellers retain responsibility for ensuring that they have the necessary rights to use the photographs, descriptions, trademarks, and other materials included in their listings.",
    ],
  },
  {
    title: "14. Privacy and Personal Information",
    paragraphs: [
      "Our collection and use of personal information are described in our Privacy Policy.",
      "By using the Platform, you acknowledge that personal information may be processed as described in that policy and in accordance with applicable data protection laws.",
      "Users must handle other users’ personal information only for legitimate purposes connected with their transactions and in accordance with applicable privacy obligations.",
    ],
  },
  {
    title: "15. Third-Party Services",
    paragraphs: [
      "The Platform may rely on or link to third-party services, including payment processors, delivery providers, hosting providers, and external websites.",
      "Those services may be governed by separate terms and privacy policies.",
      "We are not responsible for third-party services that we do not operate, except to the extent responsibility cannot lawfully be excluded or where we are otherwise legally responsible.",
    ],
  },
  {
    title: "16. Disclaimer of Warranties",
    paragraphs: [
      "We aim to provide a reliable and accessible marketplace. However, to the extent permitted by law, the Platform is provided on an “as available” basis.",
      "We do not guarantee that the Platform will always be uninterrupted, error-free, or available at all times.",
      "We do not independently guarantee every product listed by a third-party seller, and listing a product does not necessarily constitute our endorsement of that product or seller.",
      "Nothing in this section excludes warranties, guarantees, or rights that cannot lawfully be excluded under applicable law.",
    ],
  },
  {
    title: "17. Limitation of Liability",
    paragraphs: [
      "To the extent permitted by applicable law, SAX RAPID MARKET LIMITED will not be liable for indirect or consequential losses arising from the use of the Platform where those losses are lawfully excludable.",
      "Our liability, where legally permitted to be limited, will be assessed in light of the circumstances, the applicable agreement, and the nature of the claim.",
      "Nothing in these Terms excludes or limits liability for fraud, fraudulent misrepresentation, wilful misconduct, or any other liability that cannot lawfully be excluded or limited.",
      "These Terms do not remove any mandatory consumer rights or remedies available under Nigerian or South African law, as applicable.",
    ],
  },
  {
    title: "18. Indemnity",
    paragraphs: [
      "To the extent permitted by law, sellers and other users may be responsible for losses, claims, or reasonable costs arising from their unlawful conduct, infringement of third-party rights, material breach of these Terms, or misuse of the Platform.",
      "Any indemnity under these Terms applies only to the extent legally enforceable and does not remove rights or protections that cannot lawfully be waived.",
    ],
  },
  {
    title: "19. Changes to These Terms",
    paragraphs: [
      "We may update these Terms to reflect changes in our services, business operations, marketplace policies, or legal requirements.",
      "The updated version will be published on our website with a revised “Last Updated” date.",
      "Where required by law or an applicable agreement, we will provide notice of material changes before they take effect.",
      "Your continued use of the Platform after changes take effect constitutes acceptance only to the extent recognized by applicable law.",
    ],
  },
  {
    title: "20. Governing Law and Disputes",
    paragraphs: [
      "These Terms are subject to applicable laws and mandatory consumer protections in the jurisdictions in which we operate, including Nigeria and South Africa where relevant.",
      "We encourage users to contact our support team first to attempt to resolve complaints or disputes informally.",
      "Nothing in these Terms prevents a customer or other user from exercising a statutory right to bring a complaint or legal claim before a competent court, regulator, or dispute-resolution body.",
      "The specific governing law, jurisdiction, and dispute-resolution arrangements should be confirmed in accordance with the registered business details and the applicable laws of the markets served.",
    ],
  },
  {
    title: "21. Severability",
    paragraphs: [
      "If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in effect to the extent permitted by law.",
    ],
  },
  {
    title: "22. No Waiver",
    paragraphs: [
      "Failure or delay in exercising a right under these Terms does not constitute a waiver of that right, except where applicable law provides otherwise.",
    ],
  },
  {
    title: "23. Entire Agreement",
    paragraphs: [
      "These Terms, together with the Privacy Policy, Returns and Refunds Policy, Seller Policies, and other applicable terms referenced on the Platform, form the agreement governing your use of the relevant services, subject to any separate written agreement and applicable law.",
    ],
  },
  {
    title: "24. Contact Information",
    paragraphs: [
      "For questions about these Terms, marketplace transactions, or account-related matters, contact us using the details below.",
      "We will review enquiries and respond within a reasonable period, subject to applicable legal requirements.",
    ],
    bullets: [
      "Registered Business Name: SAX RAPID MARKET LIMITED",
      "Website Brand: SAX RAPID MARKET",
      "Website: www.saxrapidmarket.com",
      "Email: Vendor@saxrapidmarket.com",
    ],
  },
];

export default function TermsAndConditionsPage() {
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
            Terms and Conditions
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Operated by SAX RAPID MARKET LIMITED. The rules governing your
            access to and use of our marketplace, seller services, and related
            features.
          </p>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-6">
            Last Updated: 9 October 2026
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <p className="text-sm text-gray-500 leading-relaxed mb-10 bg-white border border-gray-100 rounded-xl p-6">
            By accessing our website, creating an account, purchasing products,
            or registering as a seller, you agree to be bound by these Terms
            and our applicable policies. If you do not agree with these Terms,
            you should not use the Platform.
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
