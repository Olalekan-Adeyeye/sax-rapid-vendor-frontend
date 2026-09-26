"use client";
import React, { useState } from "react";
import {
  Zap,
  Plus,
  Wallet as WalletIcon,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBoostPricing,
  getMyBoosts,
  boostProduct,
} from "@/lib/api/services/boost";
import * as walletService from "@/lib/api/services/wallet";
import { getMyVendorProfile } from "@/lib/api/services/vendor";
import { getProducts } from "@/lib/api/services/products";
import type { BoostPricingResponseDTO } from "@/lib/api/types/boost.types";
import { formatCurrency } from "@/lib/utils/currency";
import { useToast } from "@/lib/context/ToastContext";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { OptionPickerModal } from "@/components/ui/OptionPickerModal";
import { Pagination } from "@/components/ui/Pagination";
import { getErrorMessage } from "@/lib/utils/errors";
import { useAuth } from "@/lib/context/AuthContext";
import { getCountryByPhoneCode } from "@/lib/utils/countries";

export default function BoostAdsPage() {
  const { toast } = useToast();
  const { currency: activeCurrency } = useCurrency();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDays, setSelectedDays] = useState(7);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBoostTypePickerOpen, setIsBoostTypePickerOpen] = useState(false);
  const [selectedBoost, setSelectedBoost] =
    useState<BoostPricingResponseDTO | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [boostsPage, setBoostsPage] = useState(1);
  const BOOSTS_PER_PAGE = 10;

  const countryName =
    getCountryByPhoneCode(user?.countryCode ?? "")?.name || null;

  const {
    data: wallet,
    isLoading: loadingWallet,
    isError: walletError,
  } = useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: walletService.getWalletDetails,
    enabled: isAuthenticated,
  });

  // Queries
  const { data: vendor } = useQuery({
    queryKey: ["vendor-profile"],
    queryFn: getMyVendorProfile,
    enabled: isAuthenticated,
  });

  const {
    data: pricingData,
    isLoading: loadingPricing,
    isError: pricingQueryError,
  } = useQuery({
    queryKey: ["boost-pricing", countryName],
    queryFn: () => getBoostPricing(countryName!),
    enabled: !!countryName && isAuthenticated,
  });

  const {
    data: activeBoostsData,
    isLoading: loadingBoosts,
    isError: boostsError,
  } = useQuery({
    queryKey: ["my-boosts"],
    queryFn: () => getMyBoosts(),
    enabled: isAuthenticated,
  });

  const {
    data: productsData,
    isLoading: loadingProducts,
    isError: productsError,
  } = useQuery({
    queryKey: ["vendor-products", vendor?.userId],
    queryFn: () =>
      vendor
        ? getProducts({ VendorId: vendor.userId, PageIndex: 1, PageSize: 100 })
        : null,
    enabled: !!vendor?.userId && isAuthenticated,
  });

  const pricing = pricingData || [];
  const products = productsData?.items || [];
  const activeBoosts = activeBoostsData || [];

  const boostsTotalPages = Math.ceil(activeBoosts.length / BOOSTS_PER_PAGE);
  const paginatedBoosts = activeBoosts.slice(
    (boostsPage - 1) * BOOSTS_PER_PAGE,
    boostsPage * BOOSTS_PER_PAGE,
  );

  const errors = [
    !loadingPricing && pricingQueryError ? "Pricing failed" : null,
    !loadingBoosts && boostsError ? "Boosts failed" : null,
    !loadingWallet && walletError ? "Wallet failed" : null,
    !loadingProducts && productsError ? "Products failed" : null,
  ].filter(Boolean);

  const error =
    errors.length > 0
      ? "Failed to load all promotion data. Please refresh."
      : null;
  const loading =
    loadingPricing ||
    loadingBoosts ||
    loadingWallet ||
    loadingProducts ||
    !vendor;

  // Mutation
  const boostMutation = useMutation({
    mutationFn: boostProduct,
    onSuccess: () => {
      toast("Success", "Product boost activated successfully!", "success");
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["my-boosts"] });
      queryClient.invalidateQueries({ queryKey: ["vendor-wallet"] });
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const calculateCost = () => {
    if (!selectedBoost) return 0;
    return selectedBoost.pricingByDays[selectedDays.toString()] || 0;
  };

  const handleConfirmBoost = async () => {
    if (!selectedProductId) {
      toast(
        "Selection Required",
        "Please select a product to boost",
        "warning",
      );
      return;
    }
    if (!selectedBoost) return;

    const totalCost = calculateCost();
    if (wallet && wallet.balance < totalCost) {
      toast(
        "Insufficient Funds",
        "Please fund your wallet to continue",
        "error",
      );
      return;
    }

    boostMutation.mutate({
      productId: selectedProductId,
      boostType: selectedBoost.boostType,
      durationDays: selectedDays,
    });
  };

  if (loading) {
    return <FullPageLoader label="Loading promotions..." icon={Zap} />;
  }

  if (error) {
    return (
      <ErrorComponent
        title="Oops! Something went wrong"
        message={error}
        onRetry={() => queryClient.invalidateQueries()}
      />
    );
  }

  const displayPricing = pricing;

  const boostDays = selectedBoost
    ? Object.keys(selectedBoost.pricingByDays)
        .map(Number)
        .sort((a, b) => a - b)
    : [];

  return (
    <div className="space-y-10">
      {/* Header */}
      <PageHeader
        title="Boost My Ads"
        description="Promote your products for maximum visibility"
        actions={
          <Button
            size="sm"
            variant="primary"
            onClick={() => setIsBoostTypePickerOpen(true)}
            className="rounded-full"
          >
            <Plus size={16} />
            New Promotion
          </Button>
        }
      />

      {/* Boost Type Picker Modal */}
      <OptionPickerModal
        isOpen={isBoostTypePickerOpen}
        onClose={() => setIsBoostTypePickerOpen(false)}
        onSelect={(type) => {
          setIsBoostTypePickerOpen(false);
          const boost = displayPricing.find((p) => p.boostType === type);
          if (boost) {
            setSelectedBoost(boost);
            setIsModalOpen(true);
          }
        }}
        title="Choose Promotion Type"
        subtitle="Select how you want to promote your product"
        options={displayPricing.map((item) => {
          const [days, price] = Object.entries(item.pricingByDays).sort(
            ([a], [b]) => Number(a) - Number(b),
          )[0] || [];
          return {
            key: item.boostType,
            title: item.boostTypeName,
            desc:
              days !== undefined && price !== undefined
                ? `From ${formatCurrency(Number(price), item.currency)} for ${days} day(s)`
                : null,
            icon: Zap,
          };
        })}
      />

      {/* Active Promotions List */}
      <div className="bg-white border border-gray-100 rounded overflow-hidden shadow-sm shadow-gray-100/50">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h4 className="text-sm font-bold text-black">Active Promotions</h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Product
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Type
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Duration
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Amount
                </th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedBoosts.length > 0 ? (
                paginatedBoosts.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-[11px] font-black uppercase tracking-tight text-black whitespace-nowrap">
                      {p.productName}
                    </td>
                    <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap">
                      {p.boostType}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-black whitespace-nowrap">
                      {p.durationDays} Days
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-black whitespace-nowrap">
                      {formatCurrency(
                        p.totalAmount || p.amount || 0,
                        activeCurrency,
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${p.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={AlertCircle}
                      title="No active promotions found"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-gray-50">
          <Pagination
            currentPage={boostsPage}
            totalPages={boostsTotalPages}
            onPageChange={setBoostsPage}
            totalCount={activeBoosts.length}
            pageSize={BOOSTS_PER_PAGE}
          />
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedBoost?.boostTypeName || ""}
        subtitle="Configure your product promotion"
        icon={Zap}
        size="lg"
      >
        <div className="space-y-8">
          {/* Duration Selector */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
              Promotion Duration (Fixed Rates)
            </label>
            <div className="grid grid-cols-4 gap-4">
              {boostDays.map((days) => {
                const price = selectedBoost?.pricingByDays[days.toString()];
                return (
                  <button
                    key={days}
                    onClick={() => setSelectedDays(days)}
                    disabled={!price}
                    className={`py-6 rounded border-2 transition-all flex flex-col items-center gap-2 group ${selectedDays === days ? "bg-black text-white border-black" : "bg-white text-black border-gray-100 hover:border-gold hover:text-gold"} ${!price && "opacity-20 cursor-not-allowed"}`}
                  >
                    <span className="text-xl font-black tracking-tighter">
                      {days}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-tighter opacity-60">
                      DAYS
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Selector */}
          <div className="space-y-4">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400">
              Select Product to Boost
            </label>
            <Select
              id="product-boost-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              options={products.map((p) => ({
                label: p.name || "Unnamed Product",
                value: p.id,
              }))}
              leftSlot={<ShoppingBag size={14} />}
              outerClassName="!mb-0"
              searchable
            />
          </div>

          {/* Checkout Summary */}
          <div className="bg-gray-50 p-6 rounded flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black shadow-sm">
                <WalletIcon size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                  Total Deduction
                </p>
                <p className="text-sm font-black text-black">
                  {formatCurrency(calculateCost(), activeCurrency)}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span
                className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${wallet && wallet.balance >= calculateCost() ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
              >
                {wallet && wallet.balance >= calculateCost()
                  ? "Wallet Sufficient"
                  : "Insufficient Funds"}
              </span>
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                Balance: {formatCurrency(wallet?.balance || 0, activeCurrency)}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleConfirmBoost}
              loading={boostMutation.isPending}
              disabled={
                !wallet || !selectedBoost || wallet.balance < calculateCost()
              }
            >
              <CheckCircle size={16} />
              Confirm
            </Button>
          </div>

          <p className="text-[9px] font-black text-center text-gray-300 uppercase tracking-widest">
            Non-refundable once activated
          </p>
        </div>
      </Modal>
    </div>
  );
}
