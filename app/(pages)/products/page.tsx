"use client";
import React, { useState, useMemo } from "react";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  ShoppingBag,
  ExternalLink,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import * as productsService from "@/lib/api/services/products";
import * as categoriesService from "@/lib/api/services/categories";
import { useAuth } from "@/lib/context/AuthContext";
import { ProductListItemDto } from "@/lib/api/types/products.types";
import { CategoryResponseDTO } from "@/lib/api/types/categories.types";
import { useToast } from "@/lib/context/ToastContext";
import { getErrorMessage } from "@/lib/utils/errors";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { SearchInput } from "@/components/ui/SearchInput";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui/Dropdown";
import { ProductDeleteModal } from "@/components/products/ProductDeleteModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 20;

export default function ProductsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Local UI state — these don't belong in the server cache
  const [searchInput, setSearchInput] = useState("");
  const [committedSearch, setCommittedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<ProductListItemDto | null>(null);

  const categoryIdFilter = searchParams.get("categoryId");
  const sortFilter = searchParams.get("sort") || "newest";

  // Reset to page 1 whenever filters change
  const handleFilterChange = (newParams: URLSearchParams) => {
    setCurrentPage(1);
    router.push(`/products?${newParams.toString()}`);
  };

  // ── Queries ──────────────────────────────────────────────────────────────

  const productsQuery = useQuery({
    queryKey: ["my-products", user?.userId, committedSearch, categoryIdFilter, sortFilter, currentPage],
    queryFn: () =>
      productsService.getMyProducts({
        SearchTerm: committedSearch || undefined,
        CategoryId: categoryIdFilter ? Number(categoryIdFilter) : undefined,
        PageIndex: currentPage,
        PageSize: PAGE_SIZE,
      }),
    enabled: !!user?.userId,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesService.getCategories(),
    staleTime: 5 * 60 * 1000, // categories rarely change — cache for 5 min
  });

  // ── Mutation ─────────────────────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: () => {
      toast(
        "Product Deleted",
        "The product has been permanently removed.",
        "success",
      );
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["my-products"] });
    },
    onError: (error) => {
      toast("Deletion Failed", getErrorMessage(error), "error");
    },
  });

  // ── Derived state ─────────────────────────────────────────────────────────

  const products = Array.isArray(productsQuery.data) ? productsQuery.data : [];
  const totalCount = products.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const categories: CategoryResponseDTO[] = categoriesQuery.data ?? [];

  const displayedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (sortFilter === "price_asc")
        return a.effectivePrice - b.effectivePrice;
      if (sortFilter === "price_desc")
        return b.effectivePrice - a.effectivePrice;
      if (sortFilter === "name_asc")
        return (a.name || "").localeCompare(b.name || "");
      if (sortFilter === "name_desc")
        return (b.name || "").localeCompare(a.name || "");
      if (sortFilter === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, sortFilter]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const confirmDelete = (product: ProductListItemDto) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const findCategory = (
    cats: CategoryResponseDTO[],
    id: number,
  ): string | null => {
    for (const cat of cats) {
      if (cat.id === id) return cat.name;
      if (cat.subCategories) {
        const sub = findCategory(cat.subCategories, id);
        if (sub) return sub;
      }
    }
    return null;
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const isInitialLoading = productsQuery.isLoading;
  const isError = productsQuery.isError && products.length === 0;
  const isFetching = productsQuery.isFetching;

  if (isInitialLoading) {
    return <FullPageLoader label="Loading products..." icon={ShoppingBag} />;
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title={
          <span className="flex items-center gap-3">
            All Products
            {!productsQuery.isLoading && (
              <span className="text-[10px] font-black tracking-[0.2em] uppercase bg-black text-white px-2.5 py-1 rounded-full">
                {totalCount.toLocaleString()}
              </span>
            )}
          </span>
        }
        description="Manage your product inventory and listings"
        actions={
          <Button asChild rounded="full" size="sm" disabled={isInitialLoading}>
            <Link href="/products/add" className="flex items-center gap-3">
              <Plus size={16} />
              Add New Product
            </Link>
          </Button>
        }
      />

      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        {/* Toolbar */}
        <div
          className={`p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isInitialLoading ? "pointer-events-none opacity-50" : ""}`}
        >
          <div className="relative flex-1 max-w-md">
            <SearchInput
              placeholder="Search by product name, SKU..."
              value={searchInput}
              onChange={setSearchInput}
              onSearch={(val) => {
                setCommittedSearch(val);
                setCurrentPage(1);
              }}
              variant="muted"
              fullWidth
              focusColor="gold"
              disabled={isInitialLoading || isFetching}
            />
          </div>
          <div className="flex items-center gap-3">
            <Select
              id="sortFilter"
              value={sortFilter}
              onChange={(e) => {
                const val = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (val && val !== "newest") params.set("sort", val);
                else params.delete("sort");
                handleFilterChange(params);
              }}
              options={[
                { label: "Sort: Newest", value: "newest" },
                { label: "Sort: Oldest", value: "oldest" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" },
                { label: "Name: A to Z", value: "name_asc" },
                { label: "Name: Z to A", value: "name_desc" },
              ]}
              outerClassName="w-44 mb-0"
              className="text-xs! transition-colors py-2.5! pl-5! pr-10! rounded-full border border-gray-100 hover:border-gold shadow-none"
            />
            <Select
              id="categoryFilter"
              value={categoryIdFilter || "all"}
              onChange={(e) => {
                const val = e.target.value;
                const params = new URLSearchParams(searchParams.toString());
                if (val && val !== "all") params.set("categoryId", val);
                else params.delete("categoryId");
                handleFilterChange(params);
              }}
              options={[
                { label: "All Categories", value: "all" },
                ...categories.map((cat) => ({
                  label: cat.name || "Unnamed Category",
                  value: String(cat.id),
                })),
              ]}
              outerClassName="w-48 mb-0"
              className="text-xs! transition-colors py-2.5! pl-5! pr-10! rounded-full border border-gray-100 hover:border-gold shadow-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-250">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[
                  "Product",
                  "Category",
                  "Price",
                  "SKU",
                  "Stock",
                  "Status",
                  "",
                ].map((th) => (
                  <th
                    key={th}
                    className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400"
                  >
                    {th}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isError ? (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                        <AlertCircle size={24} className="text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-red-600">
                          Failed to load products
                        </p>
                        <p className="text-xs font-bold text-gray-400 max-w-md">
                          {getErrorMessage(productsQuery.error)}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => productsQuery.refetch()}
                        className="rounded-full text-xs font-bold mt-2"
                      >
                        <RefreshCw size={14} className="mr-1.5" />
                        Retry
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : isFetching && products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Loading products...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={ShoppingBag} title="No products found" />
                  </td>
                </tr>
              ) : (
                displayedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50/50 transition-colors group ${isFetching ? "opacity-60" : ""}`}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0 relative flex items-center justify-center">
                          {product.images && product.images.length > 0 ? (
                            <Image
                              src={
                                (typeof product.images[0] === "string"
                                  ? product.images[0]
                                  : product.images.find((img) => img.isPrimary)
                                      ?.imageUrl ||
                                    product.images[0].imageUrl) ||
                                "/assets/icons/SaxRapid-Logo.png"
                              }
                              alt={product.name || "Product"}
                              fill
                              unoptimized
                              className="object-cover relative z-10"
                            />
                          ) : (
                            <div className="w-1/2 h-1/2 relative opacity-20 filter grayscale brightness-0">
                              <Image
                                src="/assets/icons/SaxRapid-Logo.png"
                                alt="Placeholder"
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 items-start">
                          <Link
                            href={`/products/${product.id}`}
                            className="text-sm font-bold text-black hover:text-gold transition-colors"
                          >
                            {product.name}
                          </Link>
                          {product.variations &&
                            product.variations.length > 0 && (
                              <span className="text-[8px] font-black uppercase tracking-[0.2em] bg-black text-white px-1.5 py-0.5 rounded">
                                Variable
                              </span>
                            )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-500 uppercase">
                      {findCategory(categories, product.categoryId) ||
                        product.categoryName ||
                        "Uncategorized"}
                    </td>
                    <td className="px-8 py-5">
                      {product.variations && product.variations.length > 0 ? (
                        <span className="text-xs font-bold text-gray-400">
                          ---
                        </span>
                      ) : (
                        <div className="flex flex-col items-start gap-0.5">
                          <span className="text-sm font-black text-black">
                            ₦{product.effectivePrice.toLocaleString()}
                          </span>
                          {product.effectivePrice < product.basePrice && (
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400 line-through font-bold">
                                ₦{product.basePrice.toLocaleString()}
                              </span>
                              <span className="text-[8px] font-black bg-black text-white px-1.5 py-0.5 rounded uppercase tracking-[0.2em]">
                                Sale
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                      {product.sku || "N/A"}
                    </td>
                    <td className="px-8 py-5">
                      {product.variations && product.variations.length > 0 ? (
                        <span className="text-xs font-bold text-gray-400">
                          Multiple
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1.5 min-w-25">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span
                              className={
                                product.stockQuantity === 0
                                  ? "text-red-500"
                                  : "text-black"
                              }
                            >
                              {product.stockQuantity} in stock
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                product.stockQuantity === 0
                                  ? "bg-red-500"
                                  : product.stockQuantity < 10
                                    ? "bg-amber-400"
                                    : "bg-gold"
                              }`}
                              style={{
                                width:
                                  product.stockQuantity === 0 ? "0%" : "100%",
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
                          product.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : product.status === "Draft"
                              ? "bg-black text-white"
                              : product.status === "Pending"
                                ? "bg-amber-50 text-amber-600"
                                : product.status === "Rejected"
                                  ? "bg-red-50 text-red-600"
                                  : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {product.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right w-40">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/products/edit/${product.id}`} passHref>
                          <Button
                            variant="outline"
                            disabled={isFetching}
                            className="w-8 h-8 p-0! bg-white border-gray-100 text-black hover:border-black rounded-none flex items-center justify-center transition-all"
                            title="Edit Product"
                          >
                            <Edit size={14} />
                          </Button>
                        </Link>
                        <Button
                          onClick={() => confirmDelete(product)}
                          disabled={
                            deleteMutation.isPending &&
                            productToDelete?.id === product.id
                          }
                          variant="outline"
                          className="w-8 h-8 p-0! bg-white border-gray-100 text-black hover:text-red-600 hover:border-red-600 rounded-none flex items-center justify-center transition-all"
                          loading={
                            deleteMutation.isPending &&
                            productToDelete?.id === product.id
                          }
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </Button>
                        <Dropdown
                          trigger={
                            <Button
                              variant="outline"
                              disabled={isFetching}
                              className="w-8 h-8 p-0! bg-white border-gray-100 text-black hover:text-gold hover:border-gold rounded-none flex items-center justify-center transition-all"
                            >
                              <MoreVertical size={14} />
                            </Button>
                          }
                        >
                          <DropdownDivider />
                          <DropdownItem
                            icon={
                              <ExternalLink
                                size={14}
                                className="text-gray-400"
                              />
                            }
                          >
                            <Link href={`/products/${product.id}`}>
                              View Details
                            </Link>
                          </DropdownItem>
                          <DropdownItem
                            icon={<Edit size={14} className="text-gray-400" />}
                          >
                            <Link href={`/products/edit/${product.id}`}>
                              Detailed Edit
                            </Link>
                          </DropdownItem>
                          <DropdownItem
                            icon={
                              <ShoppingBag
                                size={14}
                                className="text-gray-400"
                              />
                            }
                          >
                            <Link href={`/reviews?productId=${product.id}`}>
                              View Reviews
                            </Link>
                          </DropdownItem>
                          <DropdownDivider />
                          <DropdownItem
                            variant="danger"
                            icon={<Trash2 size={14} />}
                            onClick={() => confirmDelete(product)}
                            disabled={
                              deleteMutation.isPending &&
                              productToDelete?.id === product.id
                            }
                          >
                            Delete Product
                          </DropdownItem>
                        </Dropdown>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}

        <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/20">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalCount={totalCount}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ProductDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={() => {
          if (productToDelete) deleteMutation.mutate(productToDelete.id);
        }}
        productName={productToDelete?.name}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
