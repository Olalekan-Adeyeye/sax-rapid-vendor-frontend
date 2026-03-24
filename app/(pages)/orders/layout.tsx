import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Customer Orders",
	description: "Process new orders, track shipping, and manage customer fulfillment.",
};

export default function OrdersLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
