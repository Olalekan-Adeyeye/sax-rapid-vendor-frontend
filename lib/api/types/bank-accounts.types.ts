export interface AddBankAccountDTO {
  accountName: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  currency?: string | null;
  isDefault?: boolean;
}

export interface BankAccountResponseDTO {
  id: string;
  userId: string;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  bankCode: string | null;
  currency: string | null;
  isDefault: boolean;
  createdAt: string;
}
