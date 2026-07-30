/**
 * File related type definitions
 * Derived from the Sax Rapid Marketplace OpenAPI spec v1
 */

/**
 * Request DTO for uploading vendor verification documents
 */
export interface UploadDocumentsRequestDTO {
	governmentIdUrl: string | null;
	businessDocumentUrl: string | null;
}

/**
 * Single file upload response
 */
export interface FileUploadResponse {
  url: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
  folder: string;
}

/**
 * Batch file upload response
 */
export interface FileBatchUploadResponse {
  uploaded: FileUploadResponse[];
  failed: { fileName: string; error: string }[];
  totalUploaded: number;
  totalFailed: number;
}
