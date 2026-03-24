import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Verify Account",
	description: "Verify your identity to secure your SAX-RAPID Vendor account.",
};

export default function VerifyLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
