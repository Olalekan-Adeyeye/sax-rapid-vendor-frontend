import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Subscription Plans",
	description: "Upgrade your SAX-RAPID Vendor plan for premium features and support.",
};

export default function SubscriptionsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
