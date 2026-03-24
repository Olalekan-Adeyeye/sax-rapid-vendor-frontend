import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Sign Up",
	description: "Create your SAX-RAPID Vendor account and reach millions of buyers in minutes.",
};

export default function SignupLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
