"use client";

import {
  AlertCircle,
  BarChart3,
  Bell,
  DollarSign,
  Eye,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";
import { getNotifications } from "@/lib/api/services/notifications";
import { getVendorOrders } from "@/lib/api/services/orders";
import {
  getVendorDashboardStats,
  getVendorPerformanceAnalytics,
  getVendorTopSellers,
} from "@/lib/api/services/analytics";
import { getRelativeTime, formatDate } from "@/lib/utils/date";
import { getOrderStatusColor } from "@/lib/utils/orderStatus";
import { StatCard } from "@/components/dashboard/StatCard";
import { TopSellerCard } from "@/components/dashboard/TopSellerCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { InventoryHealth } from "@/components/dashboard/InventoryHealth";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency } from "@/lib/utils/currency";
import { useCurrency } from "@/lib/hooks/useCurrency";

export default function DashboardOverview() {
  const {
    data: orders,
    isLoading: loadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["vendor-orders", 1, 5],
    queryFn: () => getVendorOrders(1, 5),
  });

  const {
    data: notificationsData,
    isLoading: loadingNotifications,
    error: notificationsError,
  } = useQuery({
    queryKey: ["notifications", 1, 4],
    queryFn: () => getNotifications(1, 4),
  });

  const {
    data: dashboardStats,
    isLoading: loadingDashboardStats,
    error: dashboardStatsError,
  } = useQuery({
    queryKey: ["vendor-analytics-dashboard"],
    queryFn: () => getVendorDashboardStats(),
  });

  const {
    data: performanceData,
    isLoading: loadingPerformance,
    error: performanceError,
  } = useQuery({
    queryKey: ["vendor-analytics-performance"],
    queryFn: () =>
      getVendorPerformanceAnalytics({
        groupBy: "Month",
      }),
  });

  const {
    data: topSellers,
    isLoading: loadingTopSellers,
    error: topSellersError,
  } = useQuery({
    queryKey: ["vendor-analytics-top-sellers"],
    queryFn: () =>
      getVendorTopSellers({
        pageNumber: 1,
        pageSize: 3,
      }),
  });

  const notifications = useMemo(
    () =>
      (notificationsData || []).map((notification) => ({
        ...notification,
        relativeTime: getRelativeTime(notification.createdAt),
      })),
    [notificationsData],
  );
  const latestOrders = orders || [];
  const topSellerItems = topSellers?.items || [];

  const { currency: activeCurrency } = useCurrency();

  const isInitialLoading = loadingDashboardStats && !dashboardStats;
  if (isInitialLoading) {
    return <FullPageLoader label="Loading dashboard..." icon={BarChart3} />;
  }

  return (
    <div className="space-y-10 lg:space-y-14">
      <PageHeader
        title="Vendor Performance"
        description="Live Dashboard Overview"
        actions={
          <Link href="/withdrawals">
            <Button
              variant="primary"
              rounded="full"
              size="sm"
              disabled={loadingDashboardStats}
              className="font-bold flex-1 sm:flex-none whitespace-nowrap"
            >
              Withdraw Funds
            </Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={
            dashboardStatsError
              ? "N/A"
              : formatCurrency(dashboardStats?.revenue || 0, activeCurrency)
          }
          isError={!!dashboardStatsError}
          detail={
            dashboardStats?.currency
              ? `in ${dashboardStats.currency}`
              : "Available earnings"
          }
          isLoading={loadingDashboardStats}
          variant="dark"
        />
        <StatCard
          icon={ShoppingBag}
          title="Total Orders"
          value={
            dashboardStatsError
              ? "N/A"
              : (dashboardStats?.totalOrders || 0).toLocaleString()
          }
          isError={!!dashboardStatsError}
          isLoading={loadingDashboardStats}
          detail="Completed transactions"
        />
        <StatCard
          icon={Package}
          title="Active Products"
          value={
            dashboardStatsError
              ? "N/A"
              : (dashboardStats?.activeProducts || 0).toLocaleString()
          }
          isError={!!dashboardStatsError}
          isLoading={loadingDashboardStats}
          detail={`of ${dashboardStats?.totalProducts || 0} total`}
        />
        <StatCard
          icon={Users}
          title="Unique Customers"
          value={
            dashboardStatsError
              ? "N/A"
              : (dashboardStats?.uniqueCustomers || 0).toLocaleString()
          }
          isError={!!dashboardStatsError}
          isLoading={loadingDashboardStats}
          detail="Total buyers"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12">
        <div className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye size={18} className="text-gold" />
              <h4 className="text-sm font-bold text-black">
                Top Selling Products
              </h4>
            </div>
            <Link
              href="/analytics"
              className={`text-xs font-bold transition-colors ${loadingTopSellers ? "text-gray-200 pointer-events-none" : "text-gray-400 hover:text-gold"}`}
            >
              View Analytics
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {loadingTopSellers ? (
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white border border-gray-100 rounded overflow-hidden flex flex-col"
                >
                  <Skeleton className="aspect-square bg-gray-100" />
                  <div className="p-4 flex-1 flex flex-col">
                    <Skeleton className="h-3 w-16 mb-2" />
                    <Skeleton className="h-4 w-4/5 mb-6" />
                    <div className="space-y-4 mt-auto">
                      <Skeleton className="h-4 w-28" />
                      <div className="pt-3 border-t border-gray-50 space-y-2">
                        <Skeleton className="h-2 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : topSellersError ? (
              <div className="col-span-full p-8 text-center bg-red-50/10 rounded flex flex-col items-center justify-center space-y-2">
                <AlertCircle size={20} className="text-red-500" />
                <p className="text-xs font-bold text-red-500">
                  Failed to load top sellers
                </p>
              </div>
            ) : topSellerItems.length > 0 ? (
              topSellerItems.map((product) => (
                <TopSellerCard
                  key={product.productId}
                  productId={product.productId}
                  image={product.imageUrl || ""}
                  name={product.productName || "Product"}
                  sales={product.unitsSold.toLocaleString()}
                  revenue={formatCurrency(product.revenueGenerated, activeCurrency)}
                />
              ))
            ) : (
              <div className="col-span-full p-8 text-center text-gray-400">
                <p className="text-xs font-bold">No sales data yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-gold" />
              <h4 className="text-sm font-bold text-black">Latest Updates</h4>
            </div>
            <Link
              href="/notifications"
              className={`text-xs font-bold transition-colors ${loadingNotifications ? "text-gray-200 pointer-events-none" : "text-gray-400 hover:text-gold"}`}
            >
              See All
            </Link>
          </div>

          <div className="bg-white border border-gray-100 rounded divide-y divide-gray-50 overflow-hidden min-h-75 flex flex-col">
            {notificationsError ? (
              <div className="p-10 text-center flex-1 flex flex-col items-center justify-center space-y-4 bg-red-50/10">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-1">
                  <AlertCircle size={20} className="text-red-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                    Failed to load updates
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                    Connection Sync Interrupted
                  </p>
                </div>
              </div>
            ) : loadingNotifications ? (
              [1, 2, 3, 4].map((item) => (
                <div key={item} className="p-5">
                  <div className="flex items-start gap-4">
                    <Skeleton
                      circle
                      className="w-2 h-2 mt-1.5 bg-gray-100 shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  </div>
                </div>
              ))
            ) : notifications?.length > 0 ? (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer relative overflow-hidden ${!item.isRead ? "bg-gold/2" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        item.type === "Warning"
                          ? "bg-red-500"
                          : item.type === "Wallet"
                            ? "bg-green-500"
                            : "bg-gold"
                      } ${item.isRead ? "opacity-30" : ""}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h5
                          className={`text-[11px] tracking-tight truncate ${!item.isRead ? "font-black text-black" : "font-bold text-gray-500"}`}
                        >
                          {item.title}
                        </h5>
                        <span className="text-[8px] font-bold text-gray-400 uppercase font-mono">
                          {item.relativeTime}
                        </span>
                      </div>
                      <p
                        className={`text-[10px] font-medium leading-relaxed line-clamp-2 ${!item.isRead ? "text-gray-700" : "text-gray-400"}`}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-10 text-center flex-1 flex items-center justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  No new updates
                </p>
              </div>
            )}
          </div>
          <Button
            asChild
            variant="outline"
            rounded="full"
            size="sm"
            fullWidth
            disabled={loadingNotifications}
            className="text-gray-400 hover:text-black hover:bg-gray-50/50 py-4"
          >
            <Link href="/notifications">View All Notifications</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="bg-white border border-gray-100 rounded p-6">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-xs font-bold text-black">
              Revenue Performance
            </h4>
            <select className="bg-transparent text-xs font-bold text-gray-400 outline-none cursor-pointer hover:text-black transition-colors">
              <option>Last 12 Months</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <RevenueChart
            data={performanceData}
            isLoading={loadingPerformance}
            isError={!!performanceError}
          />
        </div>

        <div className="space-y-6">
          <InventoryHealth
            activeProducts={dashboardStats?.activeProducts || 0}
            outOfStockProducts={dashboardStats?.outOfStockProducts || 0}
            totalProducts={dashboardStats?.totalProducts}
            isLoading={loadingDashboardStats}
            isError={!!dashboardStatsError}
          />

          <div className="bg-white border border-gray-100 rounded p-6">
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-xs font-bold text-black">
                Product Revenue Share
              </h4>
            </div>
            <div className="space-y-6">
              {loadingTopSellers ? (
                [1, 2, 3, 4].map((item) => (
                  <div key={item} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-2 w-1/3" />
                      <Skeleton className="h-2 w-1/4" />
                    </div>
                    <Skeleton circle className="h-1.5 w-full" />
                  </div>
                ))
              ) : topSellersError || topSellerItems.length === 0 ? (
                <EmptyState icon={Package} title="No data available" className="py-10" />
              ) : (
                topSellerItems.slice(0, 4).map((product) => {
                  const share = dashboardStats?.revenue
                    ? Math.round(
                        (product.revenueGenerated / dashboardStats.revenue) *
                          100,
                      )
                    : 0;
                  return (
                    <div key={product.productId} className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <Link
                          href={`/products/${product.productId}`}
                          className="text-black truncate max-w-[70%] hover:text-gold transition-colors"
                        >
                          {product.productName}
                        </Link>
                        <span className="text-gray-400">{share}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full transition-all duration-1000"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h4 className="text-xs font-bold text-black">Latest Orders</h4>
          <Link
            href="/orders"
            className={`text-xs font-bold transition-colors ${loadingOrders ? "text-gray-300 pointer-events-none" : "text-gold hover:text-black"}`}
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Product",
                  "Amount",
                  "Date",
                  "Status",
                  "",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ordersError ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-8 py-20 text-center bg-red-50/5"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mb-1">
                        <AlertCircle size={20} className="text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">
                          Failed to load orders
                        </p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">
                          Transactional Data Unavailable
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : loadingOrders ? (
                [1, 2, 3].map((item) => (
                  <tr key={item}>
                    <td className="px-8 py-6" colSpan={7}>
                      <div className="flex items-center gap-4">
                        <Skeleton className="w-12 h-4" />
                        <Skeleton className="flex-1 h-4" />
                        <Skeleton className="w-24 h-4" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : latestOrders.length > 0 ? (
                latestOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-5 text-xs font-black text-black">
                      #{order.orderNumber || order.id.slice(0, 8)}
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-gray-500">
                      {order.user
                        ? `${order.user.firstName} ${order.user.lastName}`
                        : "Guest Customer"}
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-black truncate max-w-50">
                      {order.items && order.items.length > 0
                        ? order.items[0].productName
                        : "Multiple Items"}
                      {order.items && order.items.length > 1 && (
                        <span className="ml-1.5 text-[9px] text-gray-400">
                          +{order.items.length - 1} more
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-xs font-black text-black">
                      {formatCurrency(order.totalAmount, activeCurrency)}
                    </td>
                    <td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${getOrderStatusColor(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        disabled={loadingOrders}
                        className="text-gray-300 hover:text-black px-3!"
                      >
                        <Link href={`/orders/${order.id}`}>
                          <Eye size={16} />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={ShoppingBag} title="No orders found yet" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
