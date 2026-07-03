"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { TextArea } from "@/components/ui/TextArea";
import { FileUpload } from "@/components/ui/FileUpload";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("@/components/ui/LocationPicker").then((m) => m.LocationPicker),
  { ssr: false },
);
import {
  Store,
  ShieldCheck,
  Check,
  ChevronRight,
  MapPin,
  Globe,
  CheckCircle2,
  Rocket,
  User,
  Building2,
  Crosshair,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import {
  createVendorProfile,
  uploadVendorDocuments,
} from "@/lib/api/services/vendor";
import { uploadFile } from "@/lib/api/services/files";
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
import { AuthPageContainer } from "@/components/auth/AuthPageContainer";

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [locationPickerOpen, setLocationPickerOpen] = useState(false);
  const [storeLat, setStoreLat] = useState<number | undefined>(undefined);
  const [storeLng, setStoreLng] = useState<number | undefined>(undefined);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    setError,
    control,
    reset,
    formState: { errors },
  } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      accountType: "individual",
      country: user?.countryCode || "",
      phone: user?.phoneNumber || "",
      shopName: "",
      companyName: "",
      businessRegNumber: "",
      address: "",
      suite: "",
      city: "",
      state: "",
      idType: "",
      idFile: null,
      bizFile: null,
      description: "",
      agreedToTerms: false,
    },
    mode: "onBlur",
  });

  // Subscriptions
  const formValues = useWatch({ control });
  const { firstName, accountType, agreedToTerms } = formValues;

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        accountType: "individual",
        country: user.countryCode || "",
        phone: user.phoneNumber || "",
        shopName: "",
        companyName: "",
        businessRegNumber: "",
        address: "",
        suite: "",
        city: "",
        state: "",
        idType: "",
        idFile: null,
        bizFile: null,
        description: "",
        agreedToTerms: false,
      });
      setTimeout(() => {
        setStoreLat(undefined);
        setStoreLng(undefined);
      }, 0);
    }
  }, [user, reset]);

  const next = async () => {
    const stepFields: (keyof OnboardingFormValues)[][] = [
      [], // Step 0: Welcome
      ["accountType"], // Step 1: Setup
      ["shopName", "companyName", "businessRegNumber", "description"], // Step 2: Shop Info
      ["address", "city", "state"], // Step 3: Address
      ["idType", "idFile", "bizFile"], // Step 4: Identity
      ["agreedToTerms"], // Step 5: Review
    ];

    const fieldsToValidate = stepFields[step];
    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate);
      if (!isValid) return;
    }

    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = async (data: OnboardingFormValues) => {
    if (step === 5 && !data.agreedToTerms) {
      setError("agreedToTerms", {
        type: "manual",
        message: "You must agree to the terms and conditions",
      });
      return;
    }

    if (step < STEPS.length - 1) {
      await next();
    } else {
      setLoading(true);
      try {
        // 1. Create the Vendor Profile
        await createVendorProfile({
          shopName: data.shopName,
          accountType: (data.accountType.charAt(0).toUpperCase() +
            data.accountType.slice(1)) as AccountType,
          companyName: data.companyName || null,
          businessRegistrationNumber: data.businessRegNumber || null,
          storeAddress: data.suite
            ? `${data.address}, ${data.suite}`
            : data.address,
          storeCity: data.city,
          storeState: data.state,
          storeLatitude: storeLat ?? null,
          storeLongitude: storeLng ?? null,
          description: data.description || null,
        });

        // 2. Upload Documents to File Storage
        let governmentIdUrl = "";
        let businessDocumentUrl = "";

        if (data.idFile) {
          try {
            const res = await uploadFile(data.idFile, "kyc");
            if (res?.url) governmentIdUrl = res.url;
          } catch (err) {
            console.error("ID upload failed:", err);
          }
        }

        if (data.bizFile) {
          try {
            const res = await uploadFile(data.bizFile, "kyc");
            if (res?.url) businessDocumentUrl = res.url;
          } catch (err) {
            console.error("Business doc upload failed:", err);
          }
        }

        // 3. Link Documents to Vendor Profile
        if (governmentIdUrl || businessDocumentUrl) {
          await uploadVendorDocuments({
            governmentIdUrl,
            businessDocumentUrl,
          });
        }

        toast(
          "Success",
          "Your shop has been created and is pending review.",
          "success",
        );
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
        toast("Error", message, "error");
      } finally {
        setLoading(false);
      }
    }
  };

  const currentStepData = STEPS[step];

  return (
    <AuthPageContainer
      leftPanel={{
        title: (
          <>
            Hey {firstName}, <br />
            <span className="text-gray-400">Welcome.</span>
          </>
        ),
        description:
          "Finish the setup and start selling your products on SAX RAPID today.",
        hideTitleUnderline: true,
      }}
      mainPanel={{
        gradientClass:
          "bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-gold/10 via-white to-white font-sans relative",
        containerClass: "lg:px-20",
        maxWidthClass:
          "w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center py-8 lg:py-16",
        stickyMobileHeader: true,
        showMobileHeaderBorder: true,
        mobileHeaderExtra: (
          <div className="text-[10px] font-black uppercase tracking-widest text-white/70">
            Step {step + 1} / {STEPS.length}
          </div>
        ),
        bottomContent: (
          <div className="flex items-center justify-between pt-8 border-t border-gray-100 mt-12">
            <button
              type="button"
              onClick={back}
              disabled={step === 0 || loading}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black disabled:opacity-0 transition-all px-4 py-2"
            >
              <ChevronLeft size={14} /> Back
            </button>

            <Button
              type="button"
              loading={loading}
              disabled={loading}
              onClick={
                step === STEPS.length - 1 ? handleSubmit(onSubmit) : next
              }
              className="px-6 py-3 text-[10px] uppercase font-black tracking-widest"
            >
              {step === STEPS.length - 1 ? "Finish Setup" : "Continue"}
              <ChevronRight size={14} className="ml-2" />
            </Button>
          </div>
        ),
      }}
    >
      <div key={`header-${step}`} className="mb-8 lg:mb-12">
        <div className="inline-flex items-center gap-2 text-gold text-sm font-bold mb-4 lg:mb-6 hover:border-gold transition-colors">
          <currentStepData.icon size={12} />
          Step {step + 1}/{STEPS.length} · {currentStepData.title}
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
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction * 48 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -48 }}
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
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
                        <p className="text-xs font-bold text-gold">
                          Onboarding · Journey Starts
                        </p>
                        <h3 className="text-2xl lg:text-4xl font-black text-black tracking-tight leading-tight">
                          Build your dream shop <br /> with SAX RAPID.
                        </h3>
                        <p className="text-gray-500 text-sm lg:text-base font-medium leading-relaxed max-w-lg">
                          We&apos;ve designed a seamless experience to get your
                          products in front of thousands of customers.
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
                          className="group p-5 lg:p-6 rounded bg-gray-50/50 border border-transparent hover:bg-white hover:border-gold/30 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-3 lg:mb-4">
                            <div className="w-9 h-9 lg:w-10 lg:h-10 rounded bg-white flex items-center justify-center text-black group-hover:bg-gold transition-colors">
                              <item.icon size={18} />
                            </div>
                            <span className="text-[10px] font-black text-gray-200 group-hover:text-gold/50 transition-colors">
                              {item.num}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-black mb-1.5 lg:mb-2">
                            {item.title}
                          </h4>
                          <p className="text-xs font-medium text-gray-400 group-hover:text-gray-500 leading-relaxed">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 lg:pt-6 flex items-center gap-4 text-gray-300">
                      <div className="h-px flex-1 bg-gray-100" />
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={12} className="text-green-500" />
                        <span className="text-xs font-bold text-gray-400">
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
                      <h3 className="text-lg font-bold text-black">
                        Country & Account Type
                      </h3>
                      <Globe size={20} className="text-gray-200" />
                    </div>
                  </div>

                  <div className="space-y-4 lg:space-y-6">
                    <p className="text-xs font-bold text-gray-400">
                      What best describes you?
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
                            <div className="absolute top-3 lg:top-4 right-3 lg:right-4 w-5 h-5 lg:w-6 lg:h-6 rounded bg-gold flex items-center justify-center text-black animate-in zoom-in duration-300">
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
                            <h4 className="font-bold text-base lg:text-lg mb-1.5 lg:mb-2 tracking-tight">
                              {type.label}
                            </h4>
                            <p
                              className={`text-xs font-medium leading-relaxed ${
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
                </div>
              </div>
            )}

            {/* STEP 2: SHOP INFO */}
            {step === 2 && (
              <div className="space-y-6 lg:space-y-10">
                <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded">
                  <div className="flex items-center justify-between mb-1.5 lg:mb-2 text-black">
                    <h3 className="text-lg font-bold">Brand Details</h3>
                    <Store size={22} className="text-gray-200" />
                  </div>
                  <p className="text-gray-500 font-medium mb-6 lg:mb-8 text-sm">
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

                    {accountType === "business" && (
                      <div className="space-y-5 lg:space-y-6 animate-in slide-in-from-top-4 fade-in">
                        <Input
                          label="Registered Company Name"
                          id="companyName"
                          placeholder="e.g. Apex Solutions Ltd"
                          {...register("companyName")}
                          error={errors.companyName?.message}
                          required
                          className="h-12 lg:h-14 rounded"
                        />
                        <Input
                          label="Business Registration Number"
                          id="businessRegNumber"
                          placeholder="e.g. BN-1234567"
                          {...register("businessRegNumber")}
                          error={errors.businessRegNumber?.message}
                          required
                          className="h-12 lg:h-14 rounded"
                        />
                      </div>
                    )}

                    <TextArea
                      label="Store Bio / Short Description"
                      id="description"
                      placeholder="Tell customers about your shop, what you sell, and your brand story..."
                      {...register("description")}
                      error={errors.description?.message}
                      rows={4}
                    />
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
                  <div className="space-y-5 lg:space-y-6">
                    <Input
                      label="Address"
                      id="address"
                      placeholder="Start typing your address..."
                      {...register("address")}
                      error={errors.address?.message}
                      required
                      className="h-12 lg:h-14 rounded"
                    />

                    <div className="grid grid-cols-2 gap-4 lg:gap-5">
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

                    <Input
                      label="Suite / Unit"
                      id="suite"
                      placeholder="e.g. Shop 2"
                      {...register("suite")}
                      error={errors.suite?.message}
                      className="h-12 lg:h-14 rounded w-full"
                    />

                    {/* Map Location Picker */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs font-bold text-black mb-3">
                        Pickup Location (Optional)
                      </p>
                      {storeLat !== undefined && storeLng !== undefined ? (
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded">
                          <div className="flex items-center gap-2">
                            <MapPin size={14} className="text-green-600" />
                            <span className="text-xs font-bold text-green-700">
                              {storeLat.toFixed(6)}°N, {storeLng.toFixed(6)}°E
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setStoreLat(undefined);
                              setStoreLng(undefined);
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                          >
                            <Trash2 size={12} />
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setLocationPickerOpen(true)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold bg-gold/5 border border-gold/20 rounded px-4 py-3 hover:bg-gold/10 transition-colors w-full"
                        >
                          <Crosshair size={14} />
                          Set Store Location on Map
                        </button>
                      )}
                    </div>
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
                      Verification Documents
                    </h3>
                    <ShieldCheck size={22} className="text-gray-200" />
                  </div>
                  <p className="text-xs lg:text-sm text-gray-500 font-medium mb-6 lg:mb-8">
                    Upload required documents to verify your identity and
                    business.
                  </p>

                  <div className="space-y-8">
                    <div className="space-y-5 lg:space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-bold text-black">
                          Goverment ID
                        </h4>
                      </div>
                      <Select
                        label="ID Type"
                        id="idType"
                        options={idTypes}
                        {...register("idType")}
                        error={errors.idType?.message}
                        className="h-12 lg:h-14 rounded"
                      />
                      <FileUpload
                        label="Upload ID Proof"
                        id="idFile"
                        file={formValues.idFile as File | null}
                        error={errors.idFile?.message as string}
                        onChange={(f: File | null) =>
                          setValue("idFile", f, { shouldValidate: true })
                        }
                      />
                    </div>

                    {accountType === "business" && (
                      <div className="pt-8 border-t border-gray-100 space-y-4 lg:space-y-6 animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-bold text-black">
                            Business Registration
                          </h4>
                        </div>
                        <div className="p-4 bg-gray-50 rounded border border-gray-100 mb-4">
                          <p className="text-xs font-bold text-black mb-1">
                            Document Type:{" "}
                            {user?.countryCode === "+27"
                              ? "CIPC Certificate"
                              : "CAC Certificate"}
                          </p>
                          <p className="text-[10px] text-gray-400 font-medium">
                            Auto-selected based on your location (
                            {user?.countryCode || "+234"})
                          </p>
                        </div>
                        <FileUpload
                          label={`Upload ${user?.countryCode === "+27" ? "CIPC" : "CAC"} Certificate`}
                          id="bizFile"
                          file={formValues.bizFile as File | null}
                          error={errors.bizFile?.message as string}
                          onChange={(f: File | null) =>
                            setValue("bizFile", f, { shouldValidate: true })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW */}
            {step === 5 && (
              <div className="space-y-6 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-6">
                  {/* Profile Header Summary */}
                  <div className="bg-black text-white p-8 lg:p-12 rounded relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded blur-3xl -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-black uppercase tracking-widest mb-4">
                          {accountType === "business" ? (
                            <Building2 size={12} />
                          ) : (
                            <User size={12} />
                          )}
                          {accountType} Account
                        </div>
                        <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter mb-2">
                          {formValues.shopName}
                        </h3>
                        <p className="text-gray-400 font-medium text-sm lg:text-base max-w-md line-clamp-2">
                          {formValues.description || "No description provided."}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded bg-white/5 border border-white/10 flex items-center justify-center text-gold">
                          <CheckCircle2 size={32} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Store Details Box */}
                    <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-black">
                          <Store size={16} />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Shop Overview
                        </h4>
                      </div>
                      <div className="space-y-4">
                        <DetailRow
                          label="Merchant"
                          value={`${firstName} ${formValues.lastName}`}
                        />
                        {accountType === "business" && (
                          <DetailRow
                            label="Reg Number"
                            value={formValues.businessRegNumber || "N/A"}
                          />
                        )}
                      </div>
                    </div>

                    {/* Pick-up Address Box */}
                    <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-black">
                          <MapPin size={16} />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Pick-up Location
                        </h4>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-black">
                          {formValues.address}
                        </p>
                        {formValues.suite && (
                          <p className="text-xs text-gray-500 font-medium">
                            {formValues.suite}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 font-medium">
                          {formValues.city}, {formValues.state}
                        </p>
                        {storeLat !== undefined && storeLng !== undefined && (
                          <p className="text-[10px] font-bold text-gold mt-2">
                            {storeLat.toFixed(6)}°N, {storeLng.toFixed(6)}°E
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Documents Box */}
                    <div className="bg-white border border-gray-100 p-6 lg:p-8 rounded md:col-span-2">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-black">
                          <ShieldCheck size={16} />
                        </div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-gray-400">
                          Verification Files
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded">
                          <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-gold border border-gray-100">
                            <Check size={20} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                              Government ID
                            </p>
                            <p className="text-xs font-bold text-black">
                              {formValues.idType} Card
                            </p>
                          </div>
                        </div>
                        {accountType === "business" && (
                          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded">
                            <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-gold border border-gray-100">
                              <Check size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                                Business Doc
                              </p>
                              <p className="text-xs font-bold text-black">
                                {user?.countryCode === "+27" ? "CIPC" : "CAC"}{" "}
                                Certificate
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
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
          </motion.div>
        </AnimatePresence>
      </form>

      {locationPickerOpen && (
        <LocationPicker
          onClose={() => setLocationPickerOpen(false)}
          onConfirm={(lat, lng) => {
            setStoreLat(lat);
            setStoreLng(lng);
          }}
          onClear={() => {
            setStoreLat(undefined);
            setStoreLng(undefined);
          }}
          initialLat={storeLat}
          initialLng={storeLng}
        />
      )}
    </AuthPageContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="text-xs font-bold text-black">{value}</span>
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
