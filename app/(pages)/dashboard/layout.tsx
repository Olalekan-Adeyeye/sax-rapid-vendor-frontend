import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Vendor Dashboard",
	description: "See your business performance, recent orders, and inventory status at a glance.",
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
