import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Promotions & Coupons",
	description: "Create discount campaigns and marketing tools for your store.",
};

export default function PromotionsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
