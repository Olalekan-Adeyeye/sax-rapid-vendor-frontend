import { Metadata } from "next";

export const metadata: Metadata = {
	title: "All Products",
	description: "Manage your product catalog, listings, and stock levels.",
};

export default function ProductsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
