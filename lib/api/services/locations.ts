import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
  CountryResponseDTO,
  StateResponseDTO,
} from "../types/locations.types";

const BASE = "/Location";

/**
 * GET /api/Location/countries
 * Get all countries
 */
export async function getCountries(): Promise<CountryResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<CountryResponseDTO[]>>(`${BASE}/countries`);
  return response.data.data;
}

/**
 * GET /api/Location/countries/{id}
 * Get country by ID
 */
export async function getCountryById(id: number): Promise<CountryResponseDTO> {
  const response = await apiClient.get<ApiResponse<CountryResponseDTO>>(`${BASE}/countries/${id}`);
  return response.data.data;
}

/**
 * GET /api/Location/countries/code/{code}
 * Get country by code
 */
export async function getCountryByCode(code: string): Promise<CountryResponseDTO> {
  const response = await apiClient.get<ApiResponse<CountryResponseDTO>>(`${BASE}/countries/code/${code}`);
  return response.data.data;
}

/**
 * GET /api/Location/countries/{countryId}/states
 * Get states by country ID
 */
export async function getStatesByCountry(countryId: number): Promise<StateResponseDTO[]> {
  const response = await apiClient.get<ApiResponse<StateResponseDTO[]>>(`${BASE}/countries/${countryId}/states`);
  return response.data.data;
}

/**
 * GET /api/Location/states/{id}
 * Get state by ID
 */
export async function getStateById(id: number): Promise<StateResponseDTO> {
  const response = await apiClient.get<ApiResponse<StateResponseDTO>>(`${BASE}/states/${id}`);
  return response.data.data;
}

/**
 * GET /api/Location/states/{stateId}/cities
 * Get cities by state ID
 */
export async function getCitiesByState(stateId: number): Promise<string[]> {
  const response = await apiClient.get<ApiResponse<string[]>>(`${BASE}/states/${stateId}/cities`);
  return response.data.data;
}

/**
 * GET /api/Location/cities/{id}
 * Get city by ID
 */
export async function getCityById(id: number): Promise<string> {
  const response = await apiClient.get<ApiResponse<string>>(`${BASE}/cities/${id}`);
  return response.data.data;
}
