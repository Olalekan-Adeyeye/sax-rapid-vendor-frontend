import apiClient from "../apiClient";
import type { ApiResponse } from "../types/auth.types";
import type {
	CategoryResponseDTO,
	CreateCategoryRequestDTO,
	UpdateCategoryRequestDTO,
} from "../types/categories.types";

const BASE_PATH = "/Category";

export async function getCategories(): Promise<CategoryResponseDTO[]> {
	const response = await apiClient.get<ApiResponse<CategoryResponseDTO[]>>(`${BASE_PATH}`);
	return response.data.data;
}

export async function getCategoryTree(): Promise<CategoryResponseDTO[]> {
	const response = await apiClient.get<ApiResponse<CategoryResponseDTO[]>>(`${BASE_PATH}/tree`);
	return response.data.data;
}

export async function getCategoryParents(): Promise<CategoryResponseDTO[]> {
	const response = await apiClient.get<ApiResponse<CategoryResponseDTO[]>>(`${BASE_PATH}/parents`);
	return response.data.data;
}

export async function getSubcategories(parentId: number): Promise<CategoryResponseDTO[]> {
	const response = await apiClient.get<ApiResponse<CategoryResponseDTO[]>>(`${BASE_PATH}/${parentId}/subcategories`);
	return response.data.data;
}

export async function getCategoryById(id: number): Promise<CategoryResponseDTO> {
	const response = await apiClient.get<ApiResponse<CategoryResponseDTO>>(`${BASE_PATH}/${id}`);
	return response.data.data;
}

export async function createCategory(data: CreateCategoryRequestDTO): Promise<CategoryResponseDTO> {
	const response = await apiClient.post<ApiResponse<CategoryResponseDTO>>(`${BASE_PATH}`, data);
	return response.data.data;
}

export async function updateCategory(id: number, data: UpdateCategoryRequestDTO): Promise<CategoryResponseDTO> {
	const response = await apiClient.put<ApiResponse<CategoryResponseDTO>>(`${BASE_PATH}/${id}`, data);
	return response.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
	await apiClient.delete(`${BASE_PATH}/${id}`);
}

