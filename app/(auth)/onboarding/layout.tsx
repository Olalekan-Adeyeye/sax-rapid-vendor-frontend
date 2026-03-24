import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Onboarding",
	description: "Complete your store setup to start selling on SAX-RAPID.",
};

export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
