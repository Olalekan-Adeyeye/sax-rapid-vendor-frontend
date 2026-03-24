import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Store Profile",
	description: "Manage your storefront details, logo, and brand representation on SAX-RAPID.",
};

export default function StoreLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
