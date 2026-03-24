import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Performance Analytics",
	description: "Gain deeper insights into your store's sales trends and consumer audience.",
};

export default function AnalyticsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
