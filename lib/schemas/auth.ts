import * as z from "zod";

/**
 * Common Rules
 */
const passwordRules = z
	.string()
	.min(8, "Password must be at least 8 characters")
	.regex(
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
		"Password must contain uppercase, lowercase, number, and special character",
	);

/**
 * Login Schema
 */
export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Signup Schema
 */
export const signupSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		email: z.email("Invalid email address"),
		phoneNumber: z.string().min(1, "Phone number is required"),
		countryCode: z.string().min(1, "Please select a country"),
		password: passwordRules,
		confirmPassword: z.string().min(1, "Confirm password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type SignupFormValues = z.infer<typeof signupSchema>;

/**
 * Forgot Password Schema
 */
export const forgotPasswordSchema = z.object({
	email: z.string().min(1, "Email is required").email("Invalid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset Password Schema
 */
export const resetPasswordSchema = z
	.object({
		password: passwordRules,
		confirmPassword: z.string().min(1, "Confirm password is required"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

/**
 * OTP / Verify Schema
 */
export const otpSchema = z.object({
	otp: z
		.string()
		.length(6, "OTP must be exactly 6 digits")
		.regex(/^\d+$/, "OTP must be numeric"),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

/**
 * 2FA Schema (5 digits as per mock)
 */
export const twoFactorSchema = z.object({
	code: z
		.string()
		.length(5, "Code must be exactly 5 digits")
		.regex(/^\d+$/, "Code must be numeric"),
});

export type TwoFactorFormValues = z.infer<typeof twoFactorSchema>;

/**
 * Onboarding Schema
 */
export const onboardingSchema = z
	.object({
		firstName: z.string().min(1, "First name is required"),
		lastName: z.string().min(1, "Last name is required"),
		accountType: z.enum(["individual", "business"]),
		country: z.string().min(1, "Country is required"),
		phone: z.string().min(1, "Phone number is required"),
		shopName: z.string().min(1, "Shop name is required"),
		companyName: z.string().optional(),
		businessRegNumber: z.string().optional(),
		address: z.string().min(1, "Address is required"),
		city: z.string().min(1, "City is required"),
		state: z.string().min(1, "State is required"),
		postalCode: z.string().min(1, "Postal code is required"),
		suite: z.string().optional(),
		idType: z.string().min(1, "Identification type is required"),
		idFile: z.any().optional(),
		bizFile: z.any().optional(),
		regFile: z.any().optional(),
		businessCategory: z.string().min(1, "Business category is required"),
		agreedToTerms: z.boolean().refine((val) => val === true, {
			message: "You must agree to the terms",
		}),
	})
	.refine(
		(data) => {
			if (data.accountType === "business") {
				return !!data.companyName && !!data.businessRegNumber;
			}
			return true;
		},
		{
			message: "Business details are required for company accounts",
			path: ["businessRegNumber"],
		},
	);

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
