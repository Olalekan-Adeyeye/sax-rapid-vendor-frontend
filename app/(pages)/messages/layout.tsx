import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Messages",
	description: "Communicate with your customers and support team directly from the Vendor Center.",
};

export default function MessagesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
