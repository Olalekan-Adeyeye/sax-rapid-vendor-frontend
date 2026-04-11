"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Plus,
  MoreVertical,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import * as categoriesService from "@/lib/api/services/categories";
import { CategoryResponseDTO } from "@/lib/api/types/categories.types";
import { getErrorMessage } from "@/lib/utils/errors";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { PageHeader } from "@/components/ui/PageHeader";

export default function ProductCategoriesPage() {
  const [categories, setCategories] = useState<CategoryResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriesService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading && categories.length === 0) {
    return (
      <FullPageLoader label="Loading categories..." icon={Layers} />
    );
  }

  if (error && categories.length === 0) {
    return (
      <ErrorComponent
        title="Failed to load categories"
        message={error}
        onRetry={fetchCategories}
      />
    );
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Product Categories"
        description="Organize your products into marketplace categories"
        actions={
          <Button
            variant="primary"
            rounded="full"
            size="sm"
            className="font-bold whitespace-nowrap"
          >
            <Plus size={16} />
            New Category Request
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
              <SearchInput
                placeholder="Search categories..."
                value={searchQuery}
                onChange={setSearchQuery}
                variant="white"
                focusColor="gold"
                fullWidth
              />
            </div>
            <div className="divide-y divide-gray-50">
              {filteredCategories.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  No categories found
                </div>
              ) : (
                filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="p-6 lg:p-8 hover:bg-gray-50/50 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-gold group-hover:text-black transition-all">
                        <Layers size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-black flex items-center gap-3">
                          {cat.name}
                        </h4>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">
                          {cat.description || "Marketplace category"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                          cat.isActive
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {cat.isActive ? "Active" : "Draft"}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-300 hover:text-black p-0 h-auto"
                      >
                        <MoreVertical size={18} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded p-8 flex flex-col items-center text-center space-y-6 self-start">
          <div className="w-16 h-16 rounded bg-gold/20 flex items-center justify-center text-gold">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-2">
              Can&apos;t find a category?
            </h4>
            <p className="text-[10px] font-medium text-gray-400 leading-relaxed px-4">
              Our marketplace is constantly growing. If your product type is not
              listed, you can request a new category.
            </p>
          </div>
          <Button
            variant="outline"
            rounded="full"
            size="sm"
            fullWidth
            className="font-bold"
          >
            Submit Proposal
          </Button>
        </div>
      </div>
    </div>
  );
}
