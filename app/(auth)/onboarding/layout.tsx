import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Complete Your Onboarding | SAX-RAPID Vendor Center",
	description: "Complete your store setup to start selling on SAX-RAPID.",
};

export default function OnboardingLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
