import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Notifications",
	description: "Stay updated with your latest sales, orders, and system alerts.",
};

export default function NotificationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
