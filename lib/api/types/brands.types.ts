export interface BrandResponseDTO {
  id: number;
  name: string | null;
  description: string | null;
  logoUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateBrandDTO {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
}
