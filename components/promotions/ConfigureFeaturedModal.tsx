"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { Star, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";
import { useCurrency } from "@/lib/hooks/useCurrency";

interface ConfigureFeaturedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock products
const MOCK_PRODUCTS = [
  { id: "1", name: "Premium Human Hair", price: 45000, image: "https://via.placeholder.com/50" },
  { id: "2", name: "Lace Front Wig", price: 32000, image: "https://via.placeholder.com/50" },
  { id: "3", name: "Shea Butter Conditioner", price: 8500, image: "https://via.placeholder.com/50" },
  { id: "4", name: "Argan Oil Serum", price: 12000, image: "https://via.placeholder.com/50" },
  { id: "5", name: "Silk Hair Wrap", price: 5000, image: "https://via.placeholder.com/50" },
];

export function ConfigureFeaturedModal({ isOpen, onClose }: ConfigureFeaturedModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "3"]);
  const { currency: activeCurrency } = useCurrency();

  const toggleProduct = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configure Featured Products"
      subtitle="Select up to 5 products to highlight on your store page"
      icon={Star}
      size="lg"
    >
      <div className="space-y-6">
        <Input
          id="search-products"
          placeholder="Search products..."
          leftSlot={<Search size={14} className="text-gray-400" />}
        />

        <div className="space-y-3 max-h-75 overflow-y-auto premium-scrollbar pr-2">
          {MOCK_PRODUCTS.map((product) => (
            <div
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`p-4 rounded border transition-all cursor-pointer flex items-center justify-between ${
                selectedIds.includes(product.id)
                  ? "border-gold bg-gold/5"
                  : "border-gray-100 hover:border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-50 rounded overflow-hidden relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-black">
                    {product.name}
                  </h4>
                  <p className="text-[10px] font-bold text-gold mt-0.5">
                    {formatCurrency(product.price, activeCurrency)}
                  </p>
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  selectedIds.includes(product.id) ? "bg-gold border-gold text-white" : "border-gray-200 text-transparent"
                }`}
              >
                <Check size={14} />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">
            {selectedIds.length} / 5 PRODUCTS SELECTED
          </p>
          <Button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            loading={loading}
            variant="black"
            fullWidth
          >
            Save Selection
          </Button>
        </div>
      </div>
    </Modal>
  );
}
