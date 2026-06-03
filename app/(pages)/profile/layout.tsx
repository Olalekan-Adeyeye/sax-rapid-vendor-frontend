import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Manage your personal and business profile settings.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
