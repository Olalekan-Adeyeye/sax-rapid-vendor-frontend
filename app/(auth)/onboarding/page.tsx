"use client";
import { useState } from "react";
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
	ChevronLeft,
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
} from "lucide-react";
import Image from "next/image";
import { Logo } from "@/components/common/Logo";

const STEPS = [
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
	{ label: "United Kingdom (Coming Soon)", value: "GB", code: "+44", disabled: true },
];

const idTypes = [
	{ label: "NIN (National Identity Number)", value: "NIN" },
	{ label: "Driver's License", value: "DL" },
	{ label: "International Passport", value: "IP" },
];

const accountTypes = [
	{ label: "Individual Vendor", value: "individual" },
	{ label: "Business Entity", value: "business" },
];

export default function OnboardingPage() {
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);

	const [form, setForm] = useState({
		firstName: "Arthur",
		lastName: "Sax",
		accountType: "individual",
		country: "NG",
		phone: "",
		shopName: "",
		companyName: "",
        businessRegNumber: "",
		address: "",
		suite: "",
		postalCode: "",
		idType: "",
		idFile: null as File | null,
		bizFile: null as File | null,
        regFile: null as File | null,
		avatar: null as File | null,
		businessCategory: "handmade",
		agreedToTerms: false,
	});

	const update = (
		field: keyof typeof form,
		value: string | boolean | File | null,
	) => setForm((f) => ({ ...f, [field]: value }));

	const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
	const back = () => setStep((s) => Math.max(s - 1, 0));

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (step === 4 && !form.agreedToTerms) return;

		if (step < STEPS.length - 1) {
			next();
		} else {
			setLoading(true);
			setTimeout(() => (window.location.href = "/dashboard"), 2000);
		}
	};

	const currentStepData = STEPS[step];

	return (
		<div className="min-h-screen bg-[#fcfcfc] flex font-sans antialiased overflow-hidden text-black">
			{/* ── LEFT SIDEBAR ─────────────────────────── */}
			<div className="hidden lg:flex flex-col gap-6 w-120 shrink-0 bg-[#f8f8f8] border-r border-gray-200/50 p-16 relative overflow-hidden font-sans">
				<div className="absolute top-0 right-0 w-100 h-100 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
				<div className="absolute top-1/2 -left-20 w-56 h-56 bg-gold/5 rounded-full blur-[80px]" />

				<Link
					href="/"
					className="group w-fit relative z-20 transition-opacity hover:opacity-80"
				>
					<Logo size="md" />
				</Link>

				<div className="relative z-10 mt-10">
					<div className="w-12 h-1.5 bg-gold rounded-full mb-10" />
					<h2 className="text-5xl font-black text-black leading-[1.1] tracking-tighter mb-6">
						Hey {form.firstName}, <br />
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
									<span className="text-xs font-black text-black">{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
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
			<div className="flex-1 flex flex-col p-8 lg:px-20 lg:py-12 overflow-y-auto bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-gold/5 via-white to-white font-sans">
				<div className="lg:hidden mb-12 flex items-center justify-between">
					<Link href="/" className="transition-opacity hover:opacity-80">
						<Logo size="md" />
					</Link>
					<div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
						Step {step + 1} / 5
					</div>
				</div>

				<div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center py-10">
					<div
						key={`header-${step}`}
						className="mb-12 animate-in slide-in-from-right-8 fade-in duration-500 ease-out"
					>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-black text-gold text-[9px] font-black uppercase tracking-widest mb-6 border border-black hover:border-gold transition-colors">
                            <currentStepData.icon size={12} />
                            Step 0{step + 1} · {currentStepData.title}
                        </div>
						<h1 className="text-5xl font-black text-black leading-tight mb-4 tracking-tighter">
							{currentStepData.heading}
						</h1>
						<p className="text-gray-500 text-lg font-medium">
							{currentStepData.subheading}
						</p>
					</div>

					<form onSubmit={handleSubmit} className="space-y-12">
						<div
							key={`body-${step}`}
							className="animate-in slide-in-from-right-8 fade-in duration-500 ease-out fill-mode-both"
						>
							{/* STEP 1: SETUP */}
							{step === 0 && (
								<div className="space-y-10">
									<div className="bg-white border border-gray-100 p-8 rounded">
										<div className="flex items-center justify-between mb-2">
											<h3 className="text-lg font-black text-black uppercase tracking-tighter">
												Country & Account Type
											</h3>
											<Globe size={24} className="text-gray-200" />
										</div>
                                        
                                        <div className="space-y-6 mt-8">
                                            <Select
                                                label="Vendor Type"
                                                id="accountType"
                                                options={accountTypes}
                                                value={form.accountType}
                                                onChange={(e) => update("accountType", e.target.value)}
                                                className="h-14 rounded"
                                            />

                                            <Select
                                                label="Country"
                                                id="country"
                                                options={countries}
                                                value={form.country}
                                                onChange={(e) => update("country", e.target.value)}
                                                className="h-14 rounded"
                                            />
                                        </div>

										<div className="mt-8">
											<Input
												label="Business Phone Number"
												id="phone"
												placeholder="XXXXXXXXX"
												value={form.phone}
												onChange={(e) =>
													update("phone", e.target.value.replace(/\D/g, ""))
												}
												required
												className="h-14 rounded pl-20!"
                                                leftSlot={
													<span className="text-xs font-black text-gray-400 border-r border-gray-200 pr-3 transition-colors group-focus-within:border-gold group-focus-within:text-gold block w-12">
														{countries.find((c) => c.value === form.country)?.code}
													</span>
												}
												rightSlot={
													form.phone.length > 6 ? (
														<Check size={20} className="text-gold animate-in zoom-in" />
													) : null
												}
											/>
										</div>
									</div>

                                    {/* COMING SOON ALERT */}
                                    {form.country !== "NG" && form.country !== "ZA" && (
                                        <div className="bg-black text-white p-8 rounded flex items-center gap-6 animate-in slide-in-from-left-4 fade-in">
                                            <div className="w-12 h-12 rounded bg-gold/20 flex items-center justify-center text-gold">
                                                <AlertCircle size={28} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-gold text-lg mb-1">Coming Soon!</h4>
                                                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                                                    Our platform is currently launching in Nigeria and South Africa. 
                                                    Wait-listed for {countries.find(c => c.value === form.country)?.label.split(' ')[0]}.
                                                </p>
                                            </div>
                                        </div>
                                    )}
								</div>
							)}

							{/* STEP 2: SHOP INFO */}
							{step === 1 && (
								<div className="space-y-10">
									<div className="bg-white border border-gray-100 p-8 rounded">
										<div className="flex items-center justify-between mb-2">
											<h3 className="text-lg font-black text-black">
												Brand Details
											</h3>
											<Store size={24} className="text-gray-200" />
										</div>
										<p className="text-sm text-gray-500 font-medium mb-8">
											Define how customers identify you on the platform.
										</p>

										<div className="space-y-6">
											<Input
												label="Public Shop Name"
												id="shopName"
												placeholder="e.g. Apex Electronics"
												value={form.shopName}
												onChange={(e) => update("shopName", e.target.value)}
												required
												className="h-14 rounded"
											/>
											<Input
												label="Store Bio / Description"
												id="companyName"
												placeholder="Describe your brand in one sentence..."
												value={form.companyName}
												onChange={(e) => update("companyName", e.target.value)}
												required
												className="h-14 rounded"
											/>

                                            {/* CONDITIONAL BUSINESS FIELDS */}
                                            {form.accountType === "business" && (
                                                <div className="pt-6 space-y-6 animate-in slide-in-from-top-4 fade-in">
                                                    <div className="h-px bg-gray-100 w-full mb-6" />
                                                    <Input
                                                        label={form.country === "NG" ? "Legally Registered Company Name" : "Registered Business Name"}
                                                        id="companyLegalName"
                                                        placeholder="e.g. Apex Global Limited"
                                                        className="h-14 rounded"
                                                        required
                                                    />
                                                    <Input
                                                        label={form.country === "NG" ? "RC / Business Number (CAC)" : "Business ID (CIPC)"}
                                                        id="businessReg"
                                                        placeholder="e.g. BN-1234567"
                                                        value={form.businessRegNumber}
                                                        onChange={(e) => update("businessRegNumber", e.target.value)}
                                                        required
                                                        className="h-14 rounded"
                                                    />
                                                </div>
                                            )}
										</div>
									</div>

									<div className="bg-white border border-gray-100 p-8 rounded">
										<div className="flex items-center justify-between mb-2">
											<h3 className="text-lg font-black text-black">
												What do you sell?
											</h3>
											<LayoutDashboard size={24} className="text-gray-200" />
										</div>
										<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
											{[
												{ id: "handmade", icon: Palette, title: "Handmade" },
												{ id: "culinary", icon: UtensilsCrossed, title: "Food" },
												{ id: "apparel", icon: Shirt, title: "Clothing" },
												{ id: "other", icon: MoreHorizontal, title: "Other" },
											].map((cat) => (
												<button
													key={cat.id}
													type="button"
													onClick={() => update("businessCategory", cat.id)}
													className={`p-6 rounded flex flex-col items-center justify-center text-center transition-all border-2 ${
														form.businessCategory === cat.id
															? "border-black bg-black text-gold"
															: "border-gray-50 bg-gray-50/30 hover:border-gray-100"
													}`}
												>
													<cat.icon size={24} className="mb-3" />
													<h4 className="text-[10px] font-black uppercase tracking-widest">
														{cat.title}
													</h4>
												</button>
											))}
										</div>
									</div>
								</div>
							)}

							{/* STEP 3: ADDRESS */}
							{step === 2 && (
								<div className="space-y-10">
									<div className="bg-white border border-gray-100 p-8 rounded">
										<div className="flex items-center justify-between mb-2">
											<h3 className="text-lg font-black text-black">
												Pick-up Office
											</h3>
											<MapPin size={24} className="text-gray-200" />
										</div>
										<p className="text-sm text-gray-500 font-medium mb-8">
											Please provide your detailed street address for courier logistics.
										</p>
										<Input
											label="Store or Pick up Address"
											id="address"
											placeholder="Start typing your address..."
											value={form.address}
											onChange={(e) => update("address", e.target.value)}
											required
											className="h-14 rounded pl-12"
                                            leftSlot={<Image src="/assets/icons/google.svg" alt="G" width={16} height={16} />}
										/>
                                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                            Address verified via Google Cloud Service
                                        </p>
                                        
										<div className="grid grid-cols-2 gap-6 mt-10">
											<Input
												label="Suite / Unit"
												id="suite"
												placeholder="e.g. Shop 2"
												value={form.suite}
												onChange={(e) => update("suite", e.target.value)}
												className="h-14 rounded"
											/>
											<Input
												label="Region / Postal"
												id="postalCode"
												placeholder="100001"
												value={form.postalCode}
												onChange={(e) => update("postalCode", e.target.value)}
												required
												className="h-14 rounded"
											/>
										</div>
									</div>

									<div className="h-48 bg-gray-200 rounded flex items-center justify-center relative overflow-hidden grayscale opacity-50">
										<Image src="https://www.transparenttextures.com/patterns/cubes.png" alt="Map" fill className="object-cover opacity-20" unoptimized />
										<div className="flex flex-col items-center relative z-10 text-black">
											<MapPin size={32} />
											<p className="text-[10px] font-black uppercase tracking-[0.2em] mt-2">
												Global Map Node Loading...
											</p>
										</div>
									</div>
								</div>
							)}

							{/* STEP 4: IDENTITY */}
							{step === 3 && (
								<div className="space-y-10">
									<div className="bg-white border border-gray-100 p-8 rounded">
										<div className="flex items-center justify-between mb-2">
											<h3 className="text-lg font-black text-black">
												Personal Verification
											</h3>
											<ShieldCheck size={24} className="text-gray-200" />
										</div>
										<div className="mb-8">
											<Select
												label="Choose Identification Type"
												id="idType"
												options={idTypes}
												value={form.idType}
												onChange={(e) => update("idType", e.target.value)}
												className="h-14 rounded"
											/>
										</div>
										<FileUpload
											label="Upload Official Govt ID Proof"
											id="idFile"
											onChange={(f) => update("idFile", f)}
										/>
									</div>

                                    {/* CONDITIONAL BUSINESS DOCS */}
                                    {form.accountType === "business" && (
                                        <div className="bg-white border border-gray-100 p-8 rounded animate-in slide-in-from-bottom-4 fade-in">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-lg font-black text-black">
                                                    Business Verification
                                                </h3>
                                                <Image src={form.country === "NG" ? "https://www.cac.gov.ng/wp-content/uploads/2021/01/cac_logo.png" : "https://www.cipc.co.za/wp-content/themes/cipc/images/logo.png"} alt="CERT" width={24} height={24} className="grayscale" unoptimized />
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium mb-8">
                                                Please upload your official business registration certificate.
                                            </p>
                                            <FileUpload
                                                label={form.country === "NG" ? "Upload CAC Certificate" : "Upload CIPC Certificate"}
                                                id="regFile"
                                                onChange={(f) => update("regFile", f)}
                                            />
                                        </div>
                                    )}

									<div className="bg-white border border-gray-100 p-8 rounded">
										<div className="flex items-center justify-between mb-2">
											<h3 className="text-lg font-black text-black">
												Address Proof
											</h3>
											<MapPin size={24} className="text-gray-200" />
										</div>
										<FileUpload
											label="Bank Statement or Utility Bill"
											id="bizFile"
											onChange={(f) => update("bizFile", f)}
										/>
									</div>
								</div>
							)}

							{/* STEP 5: REVIEW */}
							{step === 4 && (
								<div className="space-y-8">
									<div className="bg-black text-white p-10 rounded relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
										<p className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mb-6 relative z-10">
											Profile Summary
										</p>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
											<div>
												<h4 className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">
													Merchant Admin
												</h4>
												<p className="text-xl font-bold">{form.firstName} {form.lastName}</p>
												<p className="text-xs text-gray-500 mt-1 capitalize">
													{form.accountType} Category
												</p>
											</div>
											<div>
												<h4 className="text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">
													Active Shop
												</h4>
												<p className="text-xl font-bold">
													{form.shopName || "Untitled Store"}
												</p>
												<p className="text-xs text-gray-500 mt-1 capitalize underline decoration-gold/40 decoration-2">
													{form.businessCategory} Segment
												</p>
											</div>
										</div>
									</div>

									<div className="bg-gold/5 border border-gold/20 p-8 rounded flex items-center gap-6">
										<div className="w-16 h-16 rounded bg-black text-gold flex items-center justify-center shrink-0">
											<CheckCircle2 size={32} />
										</div>
										<div>
											<h4 className="font-black text-black mb-1">Verification Sync Active</h4>
											<p className="text-xs text-gray-500 font-medium leading-relaxed">
												Review your details carefully. If everything is correct, accept the terms and finish the setup.
											</p>
										</div>
									</div>

									<label className="flex items-start gap-4 cursor-pointer p-6 bg-white border border-gray-100 rounded hover:border-black transition-all group">
										<div
											className={`w-6 h-6 rounded border-2 shrink-0 flex items-center justify-center transition-all ${form.agreedToTerms ? "bg-black border-black text-gold" : "border-gray-200 group-hover:border-black"}`}
										>
											{form.agreedToTerms && <Check size={14} strokeWidth={4} />}
										</div>
										<input
											type="checkbox"
											checked={form.agreedToTerms}
											onChange={(e) => update("agreedToTerms", e.target.checked)}
											className="hidden"
										/>
										<span className="text-xs text-black font-bold leading-relaxed pt-1">
											I confirm that the information provided is accurate and I accept the <span className="underline decoration-gold/50">Terms and Conditions</span>.
										</span>
									</label>
								</div>
							)}
						</div>

						{/* NAVIGATION */}
						<div className="flex items-center justify-between pt-12 border-t border-gray-100 mt-12">
							{step > 0 ? (
								<button
									type="button"
									onClick={back}
									className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-black flex items-center gap-2 transition-all p-2"
								>
									<ChevronLeft size={16} /> Back
								</button>
							) : (
								<div />
							)}

							<Button
								type="submit"
								loading={loading}
								variant="black"
								disabled={(step === 4 && !form.agreedToTerms) || (step === 0 && form.country !== "NG" && form.country !== "ZA")}
								className="min-w-55"
							>
								{step === 4 ? "Go to Dashboard" : "Continue"}
								<ChevronRight size={18} className="ml-2" />
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
