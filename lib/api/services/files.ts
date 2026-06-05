import apiClient from "../apiClient";
import { FileUploadResponse, FileBatchUploadResponse } from "../types/files.types";

const BASE_PATH = "/File";

/**
 * Upload a single file
 * @param file The file to upload
 * @param folder Optional folder name (defaults to 'general')
 */
export async function uploadFile(file: File | Blob, folder: string = "general"): Promise<FileUploadResponse> {
	const formData = new FormData();
	formData.append("file", file);

	const response = await apiClient.post<FileUploadResponse>(
		`${BASE_PATH}/upload`,
		formData,
		{
			params: { folder },
			headers: { "Content-Type": "multipart/form-data" },
		}
	);
	return response.data;
}

/**
 * Upload multiple files in batch
 * @param files Array of files to upload
 * @param folder Optional folder name (defaults to 'general')
 */
export async function uploadFiles(files: (File | Blob)[], folder: string = "general"): Promise<FileBatchUploadResponse> {
	const formData = new FormData();
	files.forEach((file) => formData.append("files", file));

	const response = await apiClient.post<FileBatchUploadResponse>(
		`${BASE_PATH}/upload/batch`,
		formData,
		{
			params: { folder },
			headers: { "Content-Type": "multipart/form-data" },
		}
	);
	return response.data;
}

/**
 * Check if a file exists by key
 */
export async function checkFileExists(key: string): Promise<boolean> {
	const response = await apiClient.get<{ exists: boolean }>(`${BASE_PATH}/exists`, {
		params: { key },
	});
	return response.data.exists;
}

/**
 * Get a presigned URL for a file
 */
export async function getPresignedUrl(key: string, expiryMinutes: number = 60): Promise<string> {
	const response = await apiClient.get<{ url: string }>(`${BASE_PATH}/presign`, {
		params: { key, expiryMinutes },
	});
	return response.data.url;
}

/**
 * Get a public URL for a file
 */
export async function getFileUrl(key: string): Promise<string> {
	const response = await apiClient.get<{ url: string }>(`${BASE_PATH}/url`, {
		params: { key },
	});
	return response.data.url;
}

/**
 * Delete a file by key
 */
export async function deleteFile(key: string): Promise<void> {
	await apiClient.delete(`${BASE_PATH}/delete`, {
		params: { key },
	});
}
