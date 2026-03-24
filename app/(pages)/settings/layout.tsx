import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Account Settings",
	description: "Update your profile security, notification preferences, and business details.",
};

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
