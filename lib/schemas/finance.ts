import * as z from "zod";

export const bankAccountSchema = z.object({
  bankCode: z.string().min(1, "Please select a bank"),
  accountNumber: z
    .string()
    .regex(/^\d{10}$/, "Account number must be exactly 10 digits"),
  accountName: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
});

export type BankAccountFormValues = z.infer<typeof bankAccountSchema>;
