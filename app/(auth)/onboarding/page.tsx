"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { FileUpload } from "@/components/ui/FileUpload";
import {
  Store,
  ShieldCheck,
  Check,
  ChevronRight,
  MapPin,
  Palette,
  Shirt,
  UtensilsCrossed,
  MoreHorizontal,
  LayoutDashboard,
  Globe,
  CheckCircle2,
  Rocket,
  AlertCircle,
  User,
  Building2,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  createVendorProfile,
  uploadVendorDocuments,
} from "@/lib/api/services/vendor";
import type { AccountType } from "@/lib/api/types/vendor.types";

const STEPS = [
  {
    title: "Welcome",
    heading: "Let's get started.",
    subheading: "Welcome! A quick setup to get to know you and your store.",
    icon: Rocket,
  },
  {
    title: "Setup",
    heading: "Basic Settings.",
    subheading: "Where are you from and what are you selling?",
    icon: Globe,
  },
  {
    title: "Shop Info",
    heading: "About your shop.",
    subheading: "Help customers discover your products.",
    icon: Store,
  },
  {
    title: "Address",
    heading: "Your location.",
    subheading: "Where will our riders pick up orders?",
    icon: MapPin,
  },
  {
    title: "Identity",
    heading: "Security check.",
    subheading: "Upload your ID cards for verification.",
    icon: ShieldCheck,
  },
  {
    title: "Review",
    heading: "Final step.",
    subheading: "Please check your details before you start.",
    icon: CheckCircle2,
  },
];

const countries = [
  { label: "Nigeria", value: "NG", code: "+234" },
  { label: "South Africa", value: "ZA", code: "+27" },
  { label: "Ghana (Coming Soon)", value: "GH", code: "+233", disabled: true },
  { label: "Kenya (Coming Soon)", value: "KE", code: "+254", disabled: true },
  {
    label: "United Kingdom (Coming Soon)",
    value: "GB",
    code: "+44",
    disabled: true,
  },
];

const idTypes = [
  { label: "NIN (National Identity Number)", value: "NIN" },
  { label: "Driver's License", value: "DL" },
  { label: "International Passport", value: "IP" },
];

const accountTypes = [
  {
    label: "Individual Vendor",
    value: "individual",
    description: "Perfect for independent sellers, artisans, and sole traders.",
    icon: User,
  },
  {
    label: "Business Entity",
    value: "business",
    description: "For registered companies and multi-vendor organizations.",
    icon: Building2,
  },
];

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, OnboardingFormValues } from "@/lib/schemas/auth";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [stepLoading, setStepLoading] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      accountType: "individual",
      country: "NG",
      phone: user?.phoneNumber || "",
      shopName: "",
      companyName: "",
      businessRegNumber: "",
      address: "",
      suite: "",
      city: "",
      state: "",
      postalCode: "",
      idType: "",
      idFile: null,
      bizFile: null,
      regFile: null,
      businessCategory: "handmade",
      agreedToTerms: false,
    },
    mode: "onBlur",
  });

  // Subscriptions
  const formValues = useWatch({ control });
  const { firstName, accountType, country, shopName, agreedToTerms } =
    formValues;

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        accountType:
          (user.accountType?.toLowerCase() as "individual" | "business") ||
          "individual",
        country: user.country || "NG",
        phone: user.phoneNumber || "",
        shopName: "",
        companyName: "",
        businessRegNumber: "",
        address: "",
        suite: "",
        city: "",
        state: "",
        postalCode: "",
        idType: "",
        idFile: null,
        bizFile: null,
        regFile: null,
        businessCategory: "handmade",
        agreedToTerms: false,
      });
    }
  }, [user, reset]);

  const next = async () => {
    // Define fields to validate for each step
    const stepFields: (keyof OnboardingFormValues)[][] = [
      [], // Step 0: Welcome (no fields)
      ["accountType", "country", "phone"], // Step 1: Setup
      ["shopName", "companyName", "businessRegNumber", "businessCategory"], // Step 2: Shop Info
      ["address", "city", "state", "postalCode"], // Step 3: Address
      ["idType", "idFile"], // Step 4: Identity
      ["agreedToTerms"], // Step 5: Review
    ];

    const fieldsToValidate = stepFields[step];
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    setStepLoading(true);
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      setTimeout(() => {
        setStepLoading(false);
      }, 600);
    }, 600);
  };
  const back = () => {
    setStepLoading(true);
    setTimeout(() => {
      setStep((s) => Math.max(s - 1, 0));
      setTimeout(() => {
        setStepLoading(false);
      }, 600);
    }, 600);
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    if (step === 5 && !data.agreedToTerms) return;

    if (step < STEPS.length - 1) {
      next();
    } else {
      setLoading(true);
      try {
        // 1. Create the Vendor Profile
        await createVendorProfile({
          shopName: data.shopName,
          accountType: (data.accountType.charAt(0).toUpperCase() +
            data.accountType.slice(1)) as AccountType,
          companyName: data.companyName || "",
          businessRegNumber: data.businessRegNumber || "",
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          category: data.businessCategory,
        });

        // 2. Upload Documents
        if (data.idFile || data.bizFile) {
          const formData = new FormData();
          if (data.idFile) formData.append("identityProof", data.idFile);
          if (data.bizFile) formData.append("businessProof", data.bizFile);
          await uploadVendorDocuments(formData);
        }

        toast.success(
          "Success",
          "Your shop has been created and is pending review.",
        );
        updateUser({ role: "Seller" });
        router.push("/dashboard");
      } catch (err: unknown) {
        console.error("Onboarding failed:", err);
        let message =
          "We encountered an issue while setting up your shop. Please try again.";
        if (isAxiosError(err)) {
          const responseData = err.response?.data;
          message =
            responseData?.Result ||
            responseData?.Message ||
            responseData?.message ||
            err.message ||
            message;
        }
        toast.error("Error", message);
      } finally {
        setLoading(false);
      }
    }
  };

  const currentStepData = STEPS[step];

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [step]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased text-black">
      {/* ── LEFT SIDEBAR ─────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-6 w-120 shrink-0 bg-[#f8f8f8] border-r border-gray-200/50 p-16 relative overflow-hidden font-sans">
        <div className="absolute top-0 right-0 w-100 h-100 bg-gold/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -left-20 w-56 h-56 bg-gold/15 rounded-full blur-[80px]" />

        <Link
          href="/"
          className="group w-fit relative z-20 transition-opacity hover:opacity-80"
        >
          <Logo size="md" />
        </Link>

        <div className="relative z-10 mt-10">
          <div className="w-12 h-1.5 bg-gold rounded-full mb-10" />
          <h2 className="text-5xl font-black text-black leading-[1.1] tracking-tighter mb-6">
            Hey {firstName}, <br />
            <span className="text-gray-400">Welcome.</span>
          </h2>
          <p className="text-gray-600 text-base leading-relaxed max-w-sm mb-12 font-medium">
            Finish the setup and start selling your products on SAX RAPID today.
          </p>

          <div className="space-y-8">
            <div className="flex items-center gap-5 p-6 bg-white border border-gray-100 rounded">
              <div className="w-12 h-12 rounded bg-black flex items-center justify-center text-gold">
                <Rocket size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-black mb-1">
                  Setup Status
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded w-32">
                    <div
                      className="h-full bg-gold rounded transition-all duration-500"
                      style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-black text-black">
                    {Math.round(((step + 1) / STEPS.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col gap-4 justify-end">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            © 2026 SAX-RAPID · Official Merchant Hub
          </p>
        </div>
      </div>

      {/* ── MAIN CONTENT ───────────────────────── */}
      <div className="flex-1 flex flex-col px-4 lg:px-20 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-gold/10 via-white to-white font-sans relative">
        <div className="lg:hidden sticky top-0 bg-white/90 backdrop-blur-md z-30 flex items-center justify-between py-2 px-4 -mx-4 border-b border-gray-100 transition-all duration-300">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <Logo size="md" className="items-start" />
          </Link>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Step {step + 1} / 6
          </div>
        </div>

        <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center py-8 lg:py-16">
          <div
            key={`header-${step}`}
            className="mb-8 lg:mb-12 animate-in slide-in-from-right-8 fade-in duration-500 ease-out"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black text-gold text-[9px] font-black uppercase tracking-widest mb-4 lg:mb-6 border border-black hover:border-gold transition-colors">
              <currentStepData.icon size={12} />
              Step 0{step + 1} · {currentStepData.title}
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-black leading-tight mb-3 lg:mb-4 tracking-tighter">
              {currentStepData.heading}
            </h1>
            <p className="text-gray-500 text-base lg:text-lg font-medium">
              {currentStepData.subheading}
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8 lg:space-y-12"
          >
            <div
              key={`body-${step}`}
              className="animate-in slide-in-from-right-8 fade-in duration-500 ease-out fill-mode-both"
            >
              {/* STEP 0: WELCOME */}
              {step === 0 && (
                <div className="space-y-8 lg:space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out fill-mode-both">
                  <div className="bg-white border border-gray-100 rounded overflow-hidden relative">
                    <div className="p-7 md:p-14 space-y-8 lg:space-y-12">
                      <div className="flex flex-col md:flex-row items-start gap-8 lg:gap-10">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded bg-black flex items-center justify-center text-gold shrink-0 border-4 border-gold/40 rotate-3 hover:rotate-0 transition-transform duration-500">
                          <Rocket
                            className="w-10 h-10 lg:w-11 lg:h-11"
                            strokeWidth={1.5}
                          />
                        </div>
                        <div className="space-y-3 lg:space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gold">
                            Onboarding · Journey Starts
                          </p>
                          <h3 className="text-2xl lg:text-4xl font-black text-black tracking-tight leading-tight">
                            Build your dream shop <br /> with SAX RAPID.
                          </h3>
                          <p className="text-gray-500 text-sm lg:text-base font-medium leading-relaxed max-w-lg">
                            We&apos;ve designed a seamless experience to get
                            your products in front of thousands of customers.
                            Let&apos;s get to know you and your business.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                        {[
                          {
                            icon: User,
                            title: "You",
                            desc: "Personal & Account identity setup.",
                            num: "01",
                          },
                          {
                            icon: Store,
                            title: "Store",
                            desc: "Define your brand & product categories.",
                            num: "02",
                          },
                          {
                            icon: ShieldCheck,
                            title: "Trust",
                            desc: "Secure document & location verification.",
                            num: "03",
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="group p-5 lg:p-6 rounded bg-gray-50/50 border border-gray-100/80 hover:bg-white hover:border-gold/30 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between mb-3 lg:mb-4">
                              <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-white flex items-center justify-center text-black group-hover:bg-gold transition-colors">
                                <item.icon size={18} />
                              </div>
                              <span className="text-[10px] font-black text-gray-200 group-hover:text-gold/50 transition-colors">
                                {item.num}
                              </span>
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-widest text-black mb-1.5 lg:mb-2">
                              {item.title}
                            </h4>
                            <p className="text-[10px] font-medium text-gray-400 group-hover:text-gray-500 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 lg:pt-6 flex items-center gap-4 text-gray-300">
                        <div className="h-px flex-1 bg-gray-100" />
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-green-500" />
                          <span className="text-[8px] lg:text-[9px] font-black uppercase tracking-widest text-gray-400">
                            Estimated time: 3-5 Minutes
                          </span>
                        </div>
                        <div className="h-px flex-1 bg-gray-100" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: SETUP */}
              {step === 1 && (
                <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded">
                  <div className="space-y-8 lg:space-y-12">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base lg:text-lg font-black text-black uppercase tracking-tighter">
                          Country & Account Type
                        </h3>
                        <Globe size={20} className="text-gray-200" />
                      </div>
                    </div>

                    <div className="space-y-4 lg:space-y-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        Who are you?
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
                        {accountTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setValue(
                                "accountType",
                                type.value as "individual" | "business",
                                { shouldValidate: true },
                              )
                            }
                            className={`relative p-6 lg:p-8 rounded border-2 text-left transition-all duration-300 ${
                              accountType === type.value
                                ? "border-black bg-black text-white"
                                : "border-gray-100 bg-white hover:border-gold/30"
                            }`}
                          >
                            {accountType === type.value && (
                              <div className="absolute top-3 lg:top-4 right-3 lg:right-4 w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-gold flex items-center justify-center text-black animate-in zoom-in duration-300">
                                <Check size={12} strokeWidth={4} />
                              </div>
                            )}

                            <div
                              className={`w-10 h-10 lg:w-12 lg:h-12 rounded flex items-center justify-center mb-5 lg:mb-6 transition-colors duration-300 ${
                                accountType === type.value
                                  ? "bg-gold text-black"
                                  : "bg-gray-50 text-gray-400"
                              }`}
                            >
                              <type.icon size={20} />
                            </div>

                            <div>
                              <h4 className="font-black text-base lg:text-lg mb-1.5 lg:mb-2 tracking-tight">
                                {type.label}
                              </h4>
                              <p
                                className={`text-[11px] lg:text-xs font-medium leading-relaxed ${
                                  accountType === type.value
                                    ? "text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {type.description}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Select
                      label="Country"
                      id="country"
                      options={countries}
                      {...register("country")}
                      error={errors.country?.message}
                      className="h-12 lg:h-14 rounded"
                    />

                    <Input
                      label="Business Phone Number"
                      id="phone"
                      placeholder="XXXXXXXXX"
                      {...register("phone")}
                      error={errors.phone?.message}
                      onChange={(e) =>
                        setValue("phone", e.target.value.replace(/\D/g, ""), {
                          shouldValidate: true,
                        })
                      }
                      required
                      className="h-12 lg:h-14 rounded pl-20!"
                      leftSlot={
                        <span className="text-xs font-black text-gray-400 border-r border-gray-200 pr-3 transition-colors group-focus-within:border-gold group-focus-within:text-gold block w-12 text-center">
                          {countries.find((c) => c.value === country)?.code}
                        </span>
                      }
                    />

                    {country !== "NG" && country !== "ZA" && (
                      <div className="bg-black text-white p-6 lg:p-8 rounded flex items-center gap-5 lg:gap-6 animate-in slide-in-from-left-4 fade-in">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded bg-gold/40 flex items-center justify-center text-gold shrink-0">
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <h4 className="font-black text-gold text-base lg:text-lg mb-0.5 lg:mb-1">
                            Coming Soon!
                          </h4>
                          <p className="text-xs lg:text-sm text-gray-400 font-medium leading-relaxed">
                            Our platform is currently launching in Nigeria and
                            South Africa.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: SHOP INFO */}
              {step === 2 && (
                <div className="space-y-6 lg:space-y-10">
                  <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded">
                    <div className="flex items-center justify-between mb-1.5 lg:mb-2 text-black">
                      <h3 className="text-base lg:text-lg font-black">
                        Brand Details
                      </h3>
                      <Store size={22} className="text-gray-200" />
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 font-medium mb-6 lg:mb-8">
                      Define how customers identify you on the platform.
                    </p>

                    <div className="space-y-5 lg:space-y-6">
                      <Input
                        label="Public Shop Name"
                        id="shopName"
                        placeholder="e.g. Apex Electronics"
                        {...register("shopName")}
                        error={errors.shopName?.message}
                        required
                        className="h-12 lg:h-14 rounded"
                      />
                      <Input
                        label="Store Bio / Description"
                        id="companyName"
                        placeholder="Describe your brand in one sentence..."
                        {...register("companyName")}
                        error={errors.companyName?.message}
                        className="h-12 lg:h-14 rounded"
                      />

                      {accountType === "business" && (
                        <div className="pt-4 lg:pt-6 space-y-5 lg:space-y-6 animate-in slide-in-from-top-4 fade-in">
                          <div className="h-px bg-gray-100 w-full mb-5 lg:mb-6" />
                          <Input
                            label="Business ID Number"
                            id="businessReg"
                            placeholder="e.g. BN-1234567"
                            {...register("businessRegNumber")}
                            error={errors.businessRegNumber?.message}
                            required
                            className="h-12 lg:h-14 rounded"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded">
                    <div className="flex items-center justify-between mb-1.5 lg:mb-2 text-black">
                      <h3 className="text-base lg:text-lg font-black">
                        What do you sell?
                      </h3>
                      <LayoutDashboard size={22} className="text-gray-200" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4 mt-5 lg:mt-6">
                      {[
                        { id: "handmade", icon: Palette, title: "Handmade" },
                        {
                          id: "culinary",
                          icon: UtensilsCrossed,
                          title: "Food",
                        },
                        { id: "apparel", icon: Shirt, title: "Clothing" },
                        { id: "other", icon: MoreHorizontal, title: "Other" },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setValue("businessCategory", cat.id)}
                          className={`p-5 lg:p-6 rounded flex flex-col items-center justify-center text-center transition-all border-2 ${
                            formValues.businessCategory === cat.id
                              ? "border-black bg-black text-gold"
                              : "border-gray-50 bg-gray-50/30 hover:border-gray-100"
                          }`}
                        >
                          <cat.icon size={20} className="mb-2 lg:mb-3" />
                          <h4 className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest leading-tight">
                            {cat.title}
                          </h4>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: ADDRESS */}
              {step === 3 && (
                <div className="space-y-6 lg:space-y-10">
                  <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded">
                    <div className="flex items-center justify-between mb-1.5 lg:mb-2 text-black">
                      <h3 className="text-base lg:text-lg font-black">
                        Pick-up Office
                      </h3>
                      <MapPin size={22} className="text-gray-200" />
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 font-medium mb-6 lg:mb-8">
                      Please provide your detailed street address.
                    </p>
                    <Input
                      label="Address"
                      id="address"
                      placeholder="Start typing your address..."
                      {...register("address")}
                      error={errors.address?.message}
                      required
                      className="h-12 lg:h-14 rounded"
                    />

                    <div className="grid grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-10">
                      <Input
                        label="City"
                        id="city"
                        placeholder="e.g. Lagos"
                        {...register("city")}
                        error={errors.city?.message}
                        required
                        className="h-12 lg:h-14 rounded"
                      />
                      <Input
                        label="State / Region"
                        id="state"
                        placeholder="e.g. Ikeja"
                        {...register("state")}
                        error={errors.state?.message}
                        required
                        className="h-12 lg:h-14 rounded"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 lg:gap-6 mt-8 lg:mt-10">
                      <Input
                        label="Suite / Unit"
                        id="suite"
                        placeholder="e.g. Shop 2"
                        {...register("suite")}
                        error={errors.suite?.message}
                        className="h-12 lg:h-14 rounded"
                      />
                      <Input
                        label="Postal Code"
                        id="postalCode"
                        placeholder="100001"
                        {...register("postalCode")}
                        error={errors.postalCode?.message}
                        required
                        className="h-12 lg:h-14 rounded"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: IDENTITY */}
              {step === 4 && (
                <div className="space-y-6 lg:space-y-10">
                  <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded">
                    <div className="flex items-center justify-between mb-1.5 lg:mb-2 text-black">
                      <h3 className="text-base lg:text-lg font-black">
                        Personal Verification
                      </h3>
                      <ShieldCheck size={22} className="text-gray-200" />
                    </div>
                    <div className="mb-6 lg:mb-8">
                      <Select
                        label="ID Type"
                        id="idType"
                        options={idTypes}
                        {...register("idType")}
                        error={errors.idType?.message}
                        className="h-12 lg:h-14 rounded"
                      />
                    </div>
                    <FileUpload
                      label="Upload ID Proof"
                      id="idFile"
                      file={idFile as File | null}
                      error={errors.idFile?.message as string}
                      onChange={(f: File | null) =>
                        setValue("idFile", f, { shouldValidate: true })
                      }
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: REVIEW */}
              {step === 5 && (
                <div className="space-y-6 lg:space-y-8">
                  <div className="bg-black text-white p-7 lg:p-10 rounded">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-5">
                      Profile Summary
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">
                          Merchant
                        </h4>
                        <p className="text-lg font-bold">
                          {firstName} {formValues.lastName}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">
                          Store
                        </h4>
                        <p className="text-lg font-bold">{shopName}</p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start gap-4 cursor-pointer p-6 bg-white border border-gray-100 rounded hover:border-black transition-all group font-sans relative">
                    <div
                      className={`w-6 h-6 rounded border-2 shrink-0 flex items-center justify-center transition-all ${agreedToTerms ? "bg-black border-black text-gold" : "border-gray-200"}`}
                    >
                      {agreedToTerms && <Check size={14} strokeWidth={4} />}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      {...register("agreedToTerms")}
                    />
                    <div className="text-xs font-medium text-gray-500 leading-relaxed">
                      I agree to the{" "}
                      <span className="text-black font-black underline decoration-gold/50">
                        Merchant Services Agreement
                      </span>{" "}
                      and the SAX RAPID Privacy Policy.
                      {errors.agreedToTerms && (
                        <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-1 animate-in fade-in slide-in-from-left-2">
                          {errors.agreedToTerms.message}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-gray-100">
              <button
                type="button"
                onClick={back}
                disabled={step === 0 || loading || stepLoading}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black disabled:opacity-0 transition-all px-4 py-2"
              >
                <ChevronLeft size={14} /> Back
              </button>

              <Button
                type={step === STEPS.length - 1 ? "submit" : "button"}
                loading={loading}
                disabled={stepLoading}
                onClick={step === STEPS.length - 1 ? undefined : next}
                className="min-w-40 lg:min-w-56 py-4 lg:py-6 text-[10px] uppercase font-black tracking-widest shadow-xl hover:shadow-gold/20"
              >
                {step === STEPS.length - 1 ? "Finish Setup" : "Continue"}
                <ChevronRight size={14} className="ml-2" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const ChevronLeft = ({
  size,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);
