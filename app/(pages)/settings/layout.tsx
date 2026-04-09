import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings | Vendor Dashboard",
  description: "Manage your business account preferences, security, and notification settings.",
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
