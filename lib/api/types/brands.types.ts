export interface BrandResponseDTO {
  id: number;
  name: string | null;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  categoryId: number | null;
  categoryName: string | null;
  createdAt: string;
}

export interface CreateBrandDTO {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
}
