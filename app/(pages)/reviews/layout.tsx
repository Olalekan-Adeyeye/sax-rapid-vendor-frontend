import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Reviews & Ratings",
	description: "See your customer feedback and manage your brand reputation.",
};

export default function ReviewsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
