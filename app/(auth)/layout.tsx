import { Metadata } from "next";

export const metadata: Metadata = {
	description: "Log in or sign up to your SAX-RAPID Vendor account.",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
