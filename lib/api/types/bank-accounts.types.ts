export interface AddBankAccountDTO {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode: string;
  currency?: string | null;
}

export interface BankResponseDTO {
  name: string | null;
  code: string | null;
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
