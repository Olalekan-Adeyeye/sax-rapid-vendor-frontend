import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Login",
	description: "Log in to your SAX-RAPID Vendor account and manage your store.",
};

export default function LoginLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
