export interface CountryResponseDTO {
  id: number;
  name: string | null;
  code: string | null;
  phoneCode: string | null;
  currency: string | null;
  currencySymbol: string | null;
  isActive: boolean;
  isComingSoon: boolean;
}

export interface StateResponseDTO {
  id: number;
  name: string | null;
  countryId: number;
  countryName: string | null;
  isActive: boolean;
}
