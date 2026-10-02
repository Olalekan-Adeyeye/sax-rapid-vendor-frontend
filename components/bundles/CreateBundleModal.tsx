"use client";
import { useQuery } from "@tanstack/react-query";
import { Boxes, Plus, Minus, X, Search } from "lucide-react";
import React, { useState, useMemo } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { TextArea } from "@/components/ui/TextArea";
import { createBundle } from "@/lib/api/services/bundles";
import { getMyProducts } from "@/lib/api/services/products";
import type { BundleItemRequestDTO } from "@/lib/api/types/bundles.types";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { formatCurrency } from "@/lib/utils/currency";
import { getErrorMessage } from "@/lib/utils/errors";

interface CreateBundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateBundleModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateBundleModalProps) {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { currency: activeCurrency } = useCurrency();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<BundleItemRequestDTO[]>([]);
  const [saving, setSaving] = useState(false);

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["my-products-picker"],
    queryFn: () => getMyProducts({ PageIndex: 1, PageSize: 100 }),
    enabled: isOpen && isAuthenticated,
    retry: false,
  });

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products || [];
    return (products || []).filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q),
    );
  }, [products, search]);

  const reset = () => {
    setName("");
    setDescription("");
    setPrice("");
    setSearch("");
    setSelected([]);
  };

  const setQty = (productId: string, delta: number) => {
    setSelected((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (!existing) {
        return delta > 0 ? [...prev, { productId, quantity: delta }] : prev;
      }
      const nextQty = existing.quantity + delta;
      if (nextQty <= 0) return prev.filter((i) => i.productId !== productId);
      return prev.map((i) =>
        i.productId === productId ? { ...i, quantity: nextQty } : i,
      );
    });
  };

  const removeItem = (productId: string) => {
    setSelected((prev) => prev.filter((i) => i.productId !== productId));
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast("Missing name", "Give your bundle a name", "warning");
      return;
    }
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast("Invalid price", "Enter a bundle price greater than zero", "warning");
      return;
    }
    if (selected.length === 0) {
      toast("No products", "Add at least one product to the bundle", "warning");
      return;
    }
    try {
      setSaving(true);
      await createBundle({
        name: name.trim(),
        description: description.trim() || null,
        price: amount,
        currency: activeCurrency,
        items: selected,
      });
      toast("Success", "Bundle created successfully", "success");
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      toast("Error", getErrorMessage(err), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!saving) {
          reset();
          onClose();
        }
      }}
      title="New Product Bundle"
      subtitle="Group products into a discounted combo deal"
      icon={Boxes}
      size="lg"
    >
      <div className="space-y-6">
        <Input
          id="bundle-name"
          label="Bundle Name"
          required
          placeholder="e.g. Starter Kitchen Combo"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextArea
          id="bundle-description"
          label="Description"
          placeholder="What makes this bundle a great deal?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
        <Input
          id="bundle-price"
          label={`Bundle Price (${activeCurrency})`}
          required
          type="number"
          min="0"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className="space-y-3">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Products ({selected.length} selected)
          </p>
          {selected.length > 0 && (
            <div className="space-y-2">
              {selected.map((item) => {
                const product = (products || []).find(
                  (p) => p.id === item.productId,
                );
                return (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-3 p-3 bg-gold/5 border border-gold/20 rounded"
                  >
                    <p className="text-xs font-bold text-black truncate flex-1">
                      {product?.name || item.productId.slice(0, 8)}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setQty(item.productId, -1)}
                        className="w-7 h-7 rounded bg-white border border-gray-100 flex items-center justify-center text-black hover:bg-gray-50"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-black text-black w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.productId, 1)}
                        className="w-7 h-7 rounded bg-white border border-gray-100 flex items-center justify-center text-black hover:bg-gray-50"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="w-7 h-7 rounded flex items-center justify-center text-gray-300 hover:text-red-500"
                        aria-label="Remove product"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
            />
            <input
              placeholder="Search your products to add..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs font-medium bg-gray-50 border border-gray-100 rounded focus:outline-none focus:border-gold placeholder:text-gray-300"
            />
          </div>
          <div className="max-h-56 overflow-y-auto divide-y divide-gray-50 border border-gray-100 rounded">
            {loadingProducts ? (
              <div className="p-6 space-y-3 animate-pulse">
                <div className="h-8 bg-gray-50 rounded" />
                <div className="h-8 bg-gray-50 rounded" />
              </div>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                const added = selected.some((i) => i.productId === p.id);
                return (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-3 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-black truncate">
                        {p.name || "Unnamed product"}
                      </p>
                      <p className="text-[10px] font-bold text-gray-400">
                        {p.sku || "No SKU"} •{" "}
                        {formatCurrency(
                          p.effectivePrice || 0,
                          p.currency || activeCurrency,
                        )}
                      </p>
                    </div>
                    <Button
                      variant={added ? "outline" : "black"}
                      size="sm"
                      onClick={() => setQty(p.id, 1)}
                      disabled={added}
                      className="rounded-full px-4 text-[10px] font-black uppercase tracking-widest shrink-0"
                    >
                      {added ? "Added" : "Add"}
                    </Button>
                  </div>
                );
              })
            ) : (
              <p className="p-6 text-center text-xs font-bold text-gray-400">
                No products found
              </p>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-full py-3 text-xs font-black uppercase tracking-widest"
        >
          {saving ? "Creating..." : "Create Bundle"}
        </Button>
      </div>
    </Modal>
  );
}
