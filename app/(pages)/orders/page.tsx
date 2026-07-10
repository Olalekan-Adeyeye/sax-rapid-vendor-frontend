"use client";
import { useState, useMemo } from "react";
import {
  ShoppingBag,
  MoreVertical,
  Eye,
  Loader2,
  Printer,
  Mail,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui/Dropdown";
import { useQuery } from "@tanstack/react-query";
import * as ordersService from "@/lib/api/services/orders";
import { OrderStatus, type OrderResponseDTO } from "@/lib/api/types/orders.types";
import { formatCurrency } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { downloadInvoicePdf } from "@/lib/utils/invoice";
import { getOrderStatusColor } from "@/lib/utils/orderStatus";
import { useToast } from "@/lib/context/ToastContext";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getErrorMessage } from "@/lib/utils/errors";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { useCurrency } from "@/lib/hooks/useCurrency";
import { PageHeader } from "@/components/ui/PageHeader";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useSearchParams, useRouter } from "next/navigation";

const PAGE_SIZE = 20;

function exportOrdersToCsv(orders: OrderResponseDTO[]) {
  if (!orders.length) return;

  const headers = [
    "Order ID", "Order Number", "Status", "Payment Status", "Payment Method",
    "Customer Name", "Customer Email", "Customer Phone",
    "Items Count", "Subtotal", "Shipping", "Tax", "Discount", "Total",
    "Shipping Address", "City", "State", "Tracking Number",
    "Created At",
  ];

  const rows = orders.map((o) => [
    o.id,
    o.orderNumber || "",
    o.status,
    o.paymentStatus,
    o.paymentMethod,
    [o.user?.firstName, o.user?.lastName].filter(Boolean).join(" "),
    o.user?.email || "",
    o.user?.phoneNumber || "",
    (o.items?.length || 0).toString(),
    o.subTotal.toString(),
    o.shippingFee.toString(),
    o.taxAmount.toString(),
    o.discountAmount.toString(),
    o.totalAmount.toString(),
    o.shippingAddress || "",
    o.shippingCity || "",
    o.shippingState || "",
    o.trackingNumber || "",
    o.createdAt,
  ]);

  const csv = [
    headers.join(","),
    ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `orders-export-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { currency: activeCurrency } = useCurrency();

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const searchQuery = searchParams.get("search") || "";
  const sortFilter = searchParams.get("sort") || "newest";
  const shippingFilter = searchParams.get("shipping") || "all";
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: ordersData,
    isLoading: loading,
    isFetching,
    error: ordersError,
    refetch,
  } = useQuery({
    queryKey: ["vendor-orders"],
    queryFn: () => ordersService.getVendorOrders(1, 1000),
  });

  const orders = useMemo(() => ordersData || [], [ordersData]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (shippingFilter !== "all" && order.status !== shippingFilter) return false;

      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          order.orderNumber?.toLowerCase().includes(q) ||
          order.id.toLowerCase().includes(q) ||
          `${order.user?.firstName || ""} ${order.user?.lastName || ""}`
            .toLowerCase()
            .includes(q) ||
          order.user?.email?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }

      return true;
    });
    }, [orders, searchQuery, shippingFilter]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (sortFilter === "oldest")
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      if (sortFilter === "amount_desc") return b.totalAmount - a.totalAmount;
      if (sortFilter === "amount_asc") return a.totalAmount - b.totalAmount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [filteredOrders, sortFilter]);

  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / PAGE_SIZE));
  const displayedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedOrders.slice(start, start + PAGE_SIZE);
  }, [sortedOrders, currentPage]);

  // Reset to page 1 when filters change
  const handleFilterChange = (params: URLSearchParams) => {
    setCurrentPage(1);
    router.push(`/orders?${params.toString()}`);
  };

  const isInitialLoading = loading && orders.length === 0;
  const isError = ordersError && orders.length === 0;

  return (
    <div className="space-y-10">
      {isInitialLoading ? (
        <FullPageLoader label="Loading orders..." icon={ShoppingBag} />
      ) : isError ? (
        <ErrorComponent
          title="Failed to load Orders"
          message={getErrorMessage(ordersError)}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <PageHeader
            title={
              <span className="flex items-center gap-3">
                Customer Orders
                {!loading && (
                  <span className="text-[10px] font-black tracking-[0.2em] uppercase bg-black text-white px-2.5 py-1 rounded-full">
                    {orders.length.toLocaleString()}
                  </span>
                )}
              </span>
            }
            description="Manage and track all customer purchases"
            actions={
              <Button
                onClick={() => exportOrdersToCsv(sortedOrders)}
                rounded="full"
                variant="outline"
                size="sm"
                className="px-8 py-3.5"
              >
                <ShoppingBag size={16} />
                Export Orders
              </Button>
            }
          />

          <div className="bg-white border border-gray-100 rounded overflow-hidden">
            <div
              className={`p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 ${isInitialLoading ? "pointer-events-none opacity-50" : ""}`}
            >
              <div className="relative flex-1 max-w-md">
                <SearchInput
                  placeholder="Search by order ID, customer..."
                  value={searchInput}
                  onChange={setSearchInput}
                  onSearch={(val) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (val) params.set("search", val);
                    else params.delete("search");
                    handleFilterChange(params);
                  }}
                  variant="muted"
                  fullWidth
                  focusColor="gold"
                  disabled={loading}
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
                    { label: "Amount: High to Low", value: "amount_desc" },
                    { label: "Amount: Low to High", value: "amount_asc" },
                  ]}
                  outerClassName="w-44 mb-0"
                  className="text-xs! transition-colors py-2.5! pl-5! pr-10! rounded-full border border-gray-100 hover:border-gold shadow-none"
                />
                <Select
                  id="shippingFilter"
                  value={shippingFilter}
                  onChange={(e) => {
                    const val = e.target.value;
                    const params = new URLSearchParams(searchParams.toString());
                    if (val && val !== "all") params.set("shipping", val);
                    else params.delete("shipping");
                    handleFilterChange(params);
                  }}
                  options={[
                    { label: "All Shipping", value: "all" },
                    { label: "Pending", value: OrderStatus.Pending },
                    { label: "Confirmed", value: OrderStatus.Confirmed },
                    { label: "Shipped", value: OrderStatus.Shipped },
                    { label: "Completed", value: OrderStatus.Completed },
                    { label: "Cancelled", value: OrderStatus.Cancelled },
                  ]}
                  outerClassName="w-44 mb-0"
                  className="text-xs! transition-colors py-2.5! pl-5! pr-10! rounded-full border border-gray-100 hover:border-gold shadow-none"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-250">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {[
                      "Order ID",
                      "Customer",
                      "Items",
                      "Amount",
                      "Status",
                      "Date",
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
                  {isFetching && orders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-8 py-20 text-center">
                        <Loader2
                          className="animate-spin text-gold mx-auto"
                          size={40}
                        />
                        <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          Loading orders...
                        </p>
                      </td>
                    </tr>
                  ) : displayedOrders.length > 0 ? (
                    displayedOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50/50 transition-colors group ${isFetching ? "opacity-60" : ""}`}
                      >
                        <td className="px-8 py-5 text-[11px] font-black text-black">
                          #{order.orderNumber || order.id.slice(0, 8)}
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-black uppercase tracking-tighter">
                              {order.user
                                ? `${order.user.firstName || ""} ${order.user.lastName || ""}`
                                : "Customer"}
                            </span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                              {order.user?.email ||
                                `ID: ${order.id.slice(0, 6)}...`}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-gray-500 uppercase">
                          {order.items?.length || 0}{" "}
                          {order.items?.length === 1 ? "Item" : "Items"}
                        </td>
                        <td className="px-8 py-5 text-sm font-black text-black">
                          {formatCurrency(order.totalAmount, activeCurrency)}
                        </td>
                        <td className="px-8 py-5">
                          <span
                            className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${getOrderStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              asChild
                              className="w-9 h-9 p-0! text-gray-400!"
                            >
                              <Link href={`/orders/${order.id}`}>
                                <Eye size={14} />
                              </Link>
                            </Button>

                            <Dropdown
                              trigger={
                                <Button
                                  variant="outline"
                                  className="w-9 h-9 p-0! text-gray-400!"
                                >
                                  <MoreVertical size={14} />
                                </Button>
                              }
                            >
							<DropdownItem
                                icon={<Printer size={14} />}
                                onClick={() => {
                                  toast("Invoice", "Generating invoice PDF...", "info");
                                  downloadInvoicePdf(order, activeCurrency);
                                }}
                              >
                                Print Invoice
                              </DropdownItem>
                              <DropdownItem
                                icon={<Mail size={14} />}
                                onClick={() =>
                                  toast(
                                    "Message",
                                    "Opening customer chat...",
                                    "info",
                                  )
                                }
                              >
                                Contact Customer
                              </DropdownItem> 
                              <DropdownDivider />
                              {order.status !== OrderStatus.Cancelled &&
                                order.status !== OrderStatus.Delivered && (
                                  <DropdownItem
                                    icon={<XCircle size={14} />}
                                    variant="danger"
                                    onClick={() =>
                                      toast(
                                        "Order Status",
                                        "Requesting order cancellation...",
                                        "info",
                                      )
                                    }
                                  >
                                    Cancel Order
                                  </DropdownItem>
                                )}
                              <DropdownItem icon={<AlertCircle size={14} />}>
                                Flag Order
                              </DropdownItem>
                            </Dropdown>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState icon={ShoppingBag} title="No orders found" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-50 bg-gray-50/20">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalCount={filteredOrders.length}
                pageSize={PAGE_SIZE}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
