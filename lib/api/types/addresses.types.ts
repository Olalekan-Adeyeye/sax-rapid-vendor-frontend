export type AddressTag = "Home" | "Office" | "Other";

export interface AddressResponseDTO {
  id: string;
  label: string | null;
  tag: AddressTag;
  addressLine: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateAddressRequestDTO {
  addressLine: string;
  label: string;
  tag?: AddressTag;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean;
}

export interface UpdateAddressRequestDTO {
  addressLine?: string | null;
  label?: string | null;
  tag?: AddressTag | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  isDefault?: boolean | null;
}
