import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  AddressResponseDTO,
  CreateAddressRequestDTO,
  UpdateAddressRequestDTO,
} from "../types/addresses.types";

const BASE = "/Address";

/**
 * GET /api/Address
 * Get all saved addresses for the current authenticated user
 */
export async function getAddresses(): Promise<AddressResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<AddressResponseDTO[]>>(`${BASE}`);
  return response.data.data;
}

/**
 * POST /api/Address
 * Create a new address
 */
export async function createAddress(
  data: CreateAddressRequestDTO
): Promise<AddressResponseDTO> {
  const response = await apiClient.post<ApiResponse<AddressResponseDTO>>(`${BASE}`, data);
  return response.data.data;
}

/**
 * GET /api/Address/{addressId}
 * Get address by ID
 */
export async function getAddressById(addressId: string): Promise<AddressResponseDTO> {
  const response = await apiClient.get<ApiResponse<AddressResponseDTO>>(`${BASE}/${addressId}`);
  return response.data.data;
}

/**
 * PUT /api/Address/{addressId}
 * Update an address
 */
export async function updateAddress(
  addressId: string,
  data: UpdateAddressRequestDTO
): Promise<AddressResponseDTO> {
  const response = await apiClient.put<ApiResponse<AddressResponseDTO>>(`${BASE}/${addressId}`, data);
  return response.data.data;
}

/**
 * DELETE /api/Address/{addressId}
 * Delete an address
 */
export async function deleteAddress(addressId: string): Promise<void> {
  await apiClient.delete(`${BASE}/${addressId}`);
}

/**
 * POST /api/Address/{addressId}/set-default
 * Set an address as the default
 */
export async function setDefaultAddress(addressId: string): Promise<void> {
  await apiClient.post(`${BASE}/${addressId}/set-default`);
}
