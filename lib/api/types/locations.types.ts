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

export interface CityResponseDTO {
  id: number;
  name: string | null;
  stateId: number;
  stateName: string | null;
  latitude: number | null;
  longitude: number | null;
  isActive: boolean;
}
