import { Store, Clock, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { VerificationStatus } from "@/lib/api/types/auth.types";

const STATUS_CONFIG = {
  NotVerified: {
    icon: Store,
    title: "Complete Your Store Setup",
    message:
      "Fill in your store details and submit for review to start selling.",
    action: { label: "Continue Setup", href: "/store/edit" },
  },
  Pending: {
    icon: Clock,
    title: "Under Review",
    message:
      "Your store is being reviewed by our team. This usually takes 1–2 business days.",
    action: null,
  },
  Rejected: {
    icon: XCircle,
    title: "Verification Failed",
    message:
      "Your store verification was not approved. Update your information and resubmit.",
    action: { label: "Update Store", href: "/store/edit" },
  },
};

export default function VendorVerificationStatus({
  status,
}: {
  status: VerificationStatus;
}) {
  const config =
    STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.NotVerified;
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-center bg-black px-6 py-5">
          <Image
            src="/assets/icons/Sax-Rapid-Logo1.png"
            alt="SAX-RAPID"
            width={100}
            height={50}
            priority
          />
        </div>

        <div className="flex flex-col items-center text-center px-10 py-10">
          <div className="mb-5 flex items-center justify-center w-14 h-14 rounded-full bg-amber-50">
            <Icon size={28} className="text-amber-500" />
          </div>

          <h1 className="text-xl font-black text-gray-900 mb-2">
            {config.title}
          </h1>

          <p className="text-sm text-gray-500 leading-relaxed mb-8">
            {config.message}
          </p>

          {config.action && (
            <Link
              href={config.action.href}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-all hover:scale-105"
            >
              {config.action.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
