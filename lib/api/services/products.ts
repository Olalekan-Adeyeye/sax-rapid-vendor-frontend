import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
	ProductResponseDTO,
	PagedProductResponseDTO,
	CreateProductDTO,
	UpdateProductDTO,
	ProductQueryParams,
	ProductVariationResponseDTO,
	ProductStatsResponseDTO,
} from "../types/products.types";

const BASE_PATH = "/Products";

export async function getProducts(
	params?: ProductQueryParams
): Promise<PagedProductResponseDTO> {
	const response = await apiClient.get<ApiResponse<PagedProductResponseDTO>>(`${BASE_PATH}`, { params });
	return response.data.data;
}

export async function getProductById(id: string): Promise<ProductResponseDTO> {
	const response = await apiClient.get<ApiResponse<ProductResponseDTO>>(`${BASE_PATH}/${id}`);
	return response.data.data;
}

export async function getProductsByVendor(
	vendorId: string,
	pageIndex = 1,
	pageSize = 10
): Promise<PagedProductResponseDTO> {
	const response = await apiClient.get<ApiResponse<PagedProductResponseDTO>>(
		`${BASE_PATH}/vendor/${vendorId}`,
		{ params: { PageIndex: pageIndex, PageSize: pageSize } }
	);
	return response.data.data;
}

export async function getProductVariations(id: string): Promise<ProductVariationResponseDTO[]> {
	const response = await apiClient.get<ApiResponse<ProductVariationResponseDTO[]>>(
		`${BASE_PATH}/${id}/variations`
	);
	return response.data.data;
}

export async function createProduct(
	data: CreateProductDTO
): Promise<ProductResponseDTO> {
	const response = await apiClient.post<ApiResponse<ProductResponseDTO>>(
		`${BASE_PATH}`,
		data
	);
	return response.data.data;
}

export async function updateProduct(
	id: string,
	data: UpdateProductDTO
): Promise<ProductResponseDTO> {
	const response = await apiClient.put<ApiResponse<ProductResponseDTO>>(
		`${BASE_PATH}/${id}`,
		data
	);
	return response.data.data;
}

export async function deleteProduct(id: string): Promise<void> {
	await apiClient.delete(`${BASE_PATH}/${id}`);
}

export async function getProductStats(): Promise<ProductStatsResponseDTO> {
	const response = await apiClient.get<ApiResponse<ProductStatsResponseDTO>>(`${BASE_PATH}/stats`);
	return response.data.data;
}

