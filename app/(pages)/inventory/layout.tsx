import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Stock Management",
	description: "Track your inventory levels and manage stock alerts efficiently.",
};

export default function InventoryLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
