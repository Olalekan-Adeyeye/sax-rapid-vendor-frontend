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
 * Single file upload response usually returns the key/url
 */
export type FileUploadResponse = string;

/**
 * Batch file upload response usually returns array of keys/urls
 */
export type FileBatchUploadResponse = string[];
