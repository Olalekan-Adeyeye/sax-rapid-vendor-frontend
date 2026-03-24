import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Boost My Ads",
	description: "Promote your products for maximum visibility and drive more traffic.",
};

export default function AdsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
