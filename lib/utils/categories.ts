import type { BrandResponseDTO } from "@/lib/api/types/brands.types";
import type { CategoryResponseDTO } from "@/lib/api/types/categories.types";

export function findCategoryInTree(
  cats: CategoryResponseDTO[],
  id: string,
): CategoryResponseDTO | undefined {
  for (const cat of cats) {
    if (!cat) continue;
    if (cat.id?.toString() === id) return cat;
    if (cat.subCategories) {
      const found = findCategoryInTree(cat.subCategories, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function getCategoryBrands(
  cats: CategoryResponseDTO[],
  categoryId: string,
): BrandResponseDTO[] {
  if (!categoryId) return [];
  const selected = findCategoryInTree(cats, categoryId);
  if (selected?.brands?.length) return selected.brands;
  const parentId = selected?.parentId?.toString();
  if (!parentId) return [];
  return findCategoryInTree(cats, parentId)?.brands ?? [];
}
