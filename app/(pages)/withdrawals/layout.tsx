import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Payouts & Withdrawals",
	description: "Request payouts and track your withdrawal history.",
};

export default function WithdrawalsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
