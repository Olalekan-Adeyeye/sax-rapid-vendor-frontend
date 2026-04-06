export interface CategoryResponseDTO {
	id: number;
	name: string | null;
	description: string | null;
	parentId: number | null;
	parentName: string | null;
	iconUrl: string | null;
	displayOrder: number;
	isActive: boolean;
	createdAt: string;
	subCategories: CategoryResponseDTO[] | null;
}

export interface CreateCategoryRequestDTO {
	name: string;
	description?: string | null;
	parentId?: number | null;
	iconUrl?: string | null;
	isActive: boolean;
	displayOrder: number;
}

export interface UpdateCategoryRequestDTO {
	name?: string | null;
	iconUrl?: string | null;
	description?: string | null;
	isActive?: boolean | null;
}
