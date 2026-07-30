import { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Wallet Transactions",
	description: "See your earnings, fund your wallet, and manage your financial transactions.",
};

export default function WalletLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
