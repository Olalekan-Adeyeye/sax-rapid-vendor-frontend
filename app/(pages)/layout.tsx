import { Metadata } from "next";
import PageLayoutWrapper from "@/components/layout/PageLayoutWrapper";

export const metadata: Metadata = {
	description: "SAX-RAPID Vendor Center — All-in-one business management tool.",
};

export default function PageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <PageLayoutWrapper>{children}</PageLayoutWrapper>;
}
