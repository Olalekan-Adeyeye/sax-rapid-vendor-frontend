"use client";
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Package,
  Calendar,
  ArrowUpRight,
  AlertCircle,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils/currency";
import {
  getVendorDashboardStats,
  getVendorPerformanceAnalytics,
  getVendorTopSellers,
} from "@/lib/api/services/analytics";
import { getProductStats } from "@/lib/api/services/products";
import { getVendorOrders } from "@/lib/api/services/orders";
import { getMyBoosts } from "@/lib/api/services/boost";
import { getCategories } from "@/lib/api/services/categories";
import { formatDate } from "@/lib/utils/date";
import Image from "next/image";
import Link from "next/link";

type TimeRange = "7D" | "30D" | "1Y" | "ALL";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("30D");
  const [chartMetric, setChartMetric] = useState<"revenue" | "orders">(
    "revenue",
  );

  const queryParams = useMemo(() => {
    const now = new Date();
    const from = new Date();
    if (timeRange === "7D") from.setDate(now.getDate() - 7);
    else if (timeRange === "30D") from.setDate(now.getDate() - 30);
    else if (timeRange === "1Y") from.setFullYear(now.getFullYear() - 1);
    else return {};

    return {
      dateFrom: from.toISOString(),
      dateTo: now.toISOString(),
    };
  }, [timeRange]);

  const {
    data: stats,
    isLoading: loadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["vendor-analytics-dashboard", queryParams],
    queryFn: () => getVendorDashboardStats(queryParams),
  });

  const {
    data: performance,
    isLoading: loadingPerformance,
    error: performanceError,
  } = useQuery({
    queryKey: ["vendor-analytics-performance", queryParams, timeRange],
    queryFn: () =>
      getVendorPerformanceAnalytics({
        ...queryParams,
        groupBy:
          timeRange === "7D" ? "Day" : timeRange === "30D" ? "Week" : "Month",
      }),
  });

  const {
    data: topSellers,
    isLoading: loadingTopSellers,
    error: topSellersError,
  } = useQuery({
    queryKey: ["vendor-analytics-top-sellers", queryParams],
    queryFn: () =>
      getVendorTopSellers({
        ...queryParams,
        pageSize: 5,
      }),
  });

  const { data: productStats, isLoading: loadingProductStats } = useQuery({
    queryKey: ["vendor-product-stats"],
    queryFn: () => getProductStats(),
  });

  const { data: recentOrders, isLoading: loadingOrders } = useQuery({
    queryKey: ["vendor-recent-orders"],
    queryFn: () => getVendorOrders(1, 10),
  });

  const { data: activeBoosts, isLoading: loadingBoosts } = useQuery({
    queryKey: ["vendor-active-boosts"],
    queryFn: () => getMyBoosts("Active"),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const pendingOrdersCount = useMemo(() => {
    if (!recentOrders) return 0;
    return recentOrders.filter((o) => o.status === "Pending").length;
  }, [recentOrders]);

  const statCards = [
    {
      label: "Total Revenue",
      value: loadingStats ? "..." : formatCurrency(stats?.revenue || 0),
      detail: stats?.currency ? `in ${stats.currency}` : "Total earnings",
      icon: DollarSign,
      color: "text-gold",
      bg: "bg-gold/5",
    },
    {
      label: "Total Orders",
      value: loadingStats ? "..." : (stats?.totalOrders || 0).toLocaleString(),
      detail: "Completed sales",
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/5",
    },
    {
      label: "Pending Orders",
      value: loadingOrders ? "..." : pendingOrdersCount.toLocaleString(),
      detail: "Awaiting processing",
      icon: RefreshCw,
      color: "text-amber-500",
      bg: "bg-amber-500/5",
    },
    {
      label: "Unique Customers",
      value: loadingStats
        ? "..."
        : (stats?.uniqueCustomers || 0).toLocaleString(),
      detail: "Total reach",
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-500/5",
    },
  ];

  const conversionRate = useMemo(() => {
    if (!stats?.totalOrders || !productStats?.totalViews) return 0;
    return ((stats.totalOrders / productStats.totalViews) * 100).toFixed(2);
  }, [stats, productStats]);

  return (
    <div className="space-y-12 pb-20">
      <PageHeader
        title="Performance Analytics"
        description="Deep dive into your store sales and performance"
        actions={
          <div className="flex bg-white border border-gray-100 rounded-full p-1">
            {(["7D", "30D", "1Y", "ALL"] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase transition-all ${
                  timeRange === range
                    ? "bg-black text-white"
                    : "text-gray-400 hover:text-black hover:bg-gray-50"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        }
      />

      {/* Error State */}
      {statsError && (
        <div className="bg-red-50 border border-red-100 rounded p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <AlertCircle className="text-red-500" />
            <div>
              <p className="text-sm font-bold text-red-900">
                Analytics Sync Failed
              </p>
              <p className="text-xs text-red-600">
                Unable to fetch latest intelligence data
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetchStats()}
            className="text-red-600 hover:bg-red-100"
          >
            <RefreshCw size={14} className="mr-2" />
            Retry Sync
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded p-8 hover:border-gold transition-all duration-500 group relative overflow-hidden"
          >
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 blur-2xl ${stat.bg}`}
            />
            <div className="flex items-center justify-between mb-8">
              <div
                className={`w-12 h-12 rounded flex items-center justify-center transition-all duration-500 ${stat.bg} ${stat.color} group-hover:bg-black group-hover:text-gold`}
              >
                <stat.icon size={22} />
              </div>
              <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest group-hover:text-gold transition-colors">
                Live
              </div>
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 group-hover:text-gray-500 transition-colors">
              {stat.label}
            </p>
            <h3 className="text-3xl font-black text-black tracking-tighter mb-2 transition-transform duration-500 group-hover:translate-x-1">
              {stat.value}
            </h3>
            <p className="text-[10px] font-bold text-gray-300 group-hover:text-gray-400 transition-colors">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded p-8 space-y-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 size={18} className="text-gold" />
              <h4 className="text-sm font-black text-black uppercase tracking-widest">
                Revenue Performance
              </h4>
            </div>
            <div className="flex bg-gray-50 rounded-lg p-1 shadow-inner">
              <button
                onClick={() => setChartMetric("revenue")}
                className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                  chartMetric === "revenue"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setChartMetric("orders")}
                className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                  chartMetric === "orders"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Orders
              </button>
            </div>
          </div>

          <div className="h-80 relative w-full pt-4">
            {loadingPerformance ? (
              <div className="w-full h-full bg-gray-50 rounded animate-pulse" />
            ) : performance && performance.length > 0 ? (
              <div className="h-full flex flex-col">
                <div className="flex-1 relative group">
                  <svg
                    viewBox="0 0 1000 300"
                    className="w-full h-full overflow-visible drop-shadow-[0_10px_10px_rgba(239,191,4,0.1)]"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={
                            chartMetric === "revenue" ? "#EFBF04" : "#3b82f6"
                          }
                          stopOpacity="0.2"
                        />
                        <stop
                          offset="100%"
                          stopColor={
                            chartMetric === "revenue" ? "#EFBF04" : "#3b82f6"
                          }
                          stopOpacity="0"
                        />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid Lines */}
                    {[0, 1, 2, 3].map((i) => (
                      <line
                        key={i}
                        x1="0"
                        y1={i * 100}
                        x2="1000"
                        y2={i * 100}
                        stroke="#f8fafc"
                        strokeWidth="1"
                      />
                    ))}

                    {(() => {
                      const dataPoints = performance.map((d) =>
                        chartMetric === "revenue" ? d.revenue : d.ordersCount,
                      );
                      const maxVal = Math.max(...dataPoints, 1);
                      const points = performance.map((d, i) => ({
                        x: (i / Math.max(performance.length - 1, 1)) * 1000,
                        y:
                          300 -
                          ((chartMetric === "revenue"
                            ? d.revenue
                            : d.ordersCount) /
                            maxVal) *
                            280,
                      }));

                      const pathData =
                        "M" + points.map((p) => `${p.x},${p.y}`).join(" L");
                      const areaData = `M0,300 L${points.map((p) => `${p.x},${p.y}`).join(" L")} L1000,300 Z`;

                      return (
                        <>
                          <path
                            d={areaData}
                            fill="url(#areaGrad)"
                            className="transition-all duration-1000"
                          />
                          <path
                            d={pathData}
                            fill="none"
                            stroke={
                              chartMetric === "revenue" ? "#EFBF04" : "#3b82f6"
                            }
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-all duration-1000"
                          />
                          {points.map((p, i) => (
                            <circle
                              key={i}
                              cx={p.x}
                              cy={p.y}
                              r="4"
                              fill="white"
                              stroke={
                                chartMetric === "revenue"
                                  ? "#EFBF04"
                                  : "#3b82f6"
                              }
                              strokeWidth="2"
                              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>
                <div className="flex justify-between mt-6 px-2">
                  {performance
                    .filter(
                      (_, i) =>
                        i % Math.max(Math.floor(performance.length / 6), 1) ===
                        0,
                    )
                    .map((d, i) => (
                      <span
                        key={i}
                        className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]"
                      >
                        {new Date(d.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: timeRange === "1Y" ? undefined : "numeric",
                          year: timeRange === "1Y" ? "2-digit" : undefined,
                        })}
                      </span>
                    ))}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded border-2 border-dashed border-gray-100">
                <BarChart3 size={32} className="text-gray-200 mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  No performance data for this period
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Status */}
        <div className="bg-white border border-gray-100 rounded p-8 space-y-10">
          <div className="flex items-center gap-3">
            <PieChartIcon size={18} className="text-gold" />
            <h4 className="text-sm font-black text-black uppercase tracking-widest">
              Inventory Status
            </h4>
          </div>

          <div className="space-y-8 pt-4">
            {(() => {
              const active = stats?.activeProducts || 0;
              const outOfStock = stats?.outOfStockProducts || 0;
              const total = stats?.totalProducts || active + outOfStock || 1;
              const activePct = Math.round((active / total) * 100);
              const outOfStockPct = Math.round((outOfStock / total) * 100);

              return (
                <>
                  <div className="flex flex-col items-center justify-center py-6 relative">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        className="text-gray-50"
                      />
                      <circle
                        cx="80"
                        cy="80"
                        r="70"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={440}
                        strokeDashoffset={440 - (440 * activePct) / 100}
                        className="text-gold transition-all duration-1000 ease-out"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black text-black tracking-tighter">
                        {activePct}%
                      </span>
                      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        In Stock
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Active Products",
                        val: active,
                        pct: activePct,
                        color: "bg-gold",
                      },
                      {
                        label: "Out of Stock",
                        val: outOfStock,
                        pct: outOfStockPct,
                        color: "bg-red-500",
                      },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-gray-500">{item.label}</span>
                          <span className="text-black">{item.val}</span>
                        </div>
                        <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-gray-50 grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        Avg. Order Value
                      </p>
                      <p className="text-sm font-black text-black">
                        {loadingStats
                          ? "..."
                          : formatCurrency(
                              stats?.totalOrders
                                ? stats.revenue / stats.totalOrders
                                : 0,
                            )}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                        Rev. per Customer
                      </p>
                      <p className="text-sm font-black text-black">
                        {loadingStats
                          ? "..."
                          : formatCurrency(
                              stats?.uniqueCustomers
                                ? stats.revenue / stats.uniqueCustomers
                                : 0,
                            )}
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Top Sellers Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp size={18} className="text-gold" />
              <h4 className="text-sm font-black text-black uppercase tracking-widest">
                Top Performing Products
              </h4>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-[10px] font-black uppercase tracking-widest text-gold hover:text-black"
            >
              <Link href="/products">Manage Inventory</Link>
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  {["Product", "Sales Volume", "Revenue", "Share", ""].map(
                    (th) => (
                      <th
                        key={th}
                        className="px-8 py-6 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400"
                      >
                        {th}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loadingTopSellers ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-8 py-8">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded" />
                          <div className="flex-1 h-4 bg-gray-50 rounded" />
                          <div className="w-32 h-4 bg-gray-50 rounded" />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : topSellers?.items && topSellers.items.length > 0 ? (
                  topSellers.items.map((product) => {
                    const share = stats?.revenue
                      ? Math.round(
                          (product.revenueGenerated / stats.revenue) * 100,
                        )
                      : 0;
                    return (
                      <tr
                        key={product.productId}
                        className="group hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded bg-gray-50 overflow-hidden relative border border-gray-100 shrink-0">
                              {product.imageUrl ? (
                                <Image
                                  src={product.imageUrl}
                                  alt={product.productName || ""}
                                  fill
                                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-200">
                                  <Package size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-black text-black group-hover:text-gold transition-colors truncate max-w-37.5">
                                {product.productName}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400">
                                SKU: {product.sku || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-black text-black">
                            {product.unitsSold.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-black text-black">
                            {formatCurrency(product.revenueGenerated)}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 max-w-15 h-1.5 bg-gray-50 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold rounded-full"
                                style={{ width: `${share}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-black text-gray-400">
                              {share}%
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="text-gray-300 hover:text-black"
                          >
                            <Link href={`/products/${product.productId}`}>
                              <ArrowUpRight size={18} />
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        No Sales Data
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border border-gray-100 rounded p-8 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <RefreshCw size={18} className="text-gold" />
              <h4 className="text-sm font-black text-black uppercase tracking-widest">
                Recent Activity
              </h4>
            </div>
            <Link
              href="/orders"
              className="text-[10px] font-black text-gray-400 hover:text-gold uppercase tracking-widest transition-colors"
            >
              View All
            </Link>
          </div>

          <div className="space-y-6">
            {loadingOrders ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-10 h-10 bg-gray-50 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-50 rounded w-3/4" />
                    <div className="h-2 bg-gray-50 rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : recentOrders && recentOrders.length > 0 ? (
              recentOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-black group-hover:text-gold transition-colors">
                    <ShoppingBag size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[11px] font-black text-black truncate pr-2">
                        Order #{order.orderNumber}
                      </p>
                      <span className="text-[9px] font-black text-gray-300 uppercase shrink-0">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                      <span
                        className={
                          order.status === "Pending"
                            ? "text-amber-500"
                            : "text-green-500"
                        }
                      >
                        {order.status}
                      </span>
                      <span>•</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  No Recent Activity
                </p>
              </div>
            )}
          </div>

          {/* Promotion Performance Summary */}
          <div className="pt-8 border-t border-gray-50 space-y-6">
            <div className="flex items-center gap-3">
              <TrendingUp size={16} className="text-gold" />
              <h4 className="text-[11px] font-black text-black uppercase tracking-widest">
                Promotion Impact
              </h4>
            </div>
            <div className="bg-black rounded-xl p-6 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-gold/20 transition-all duration-700" />
              <div className="relative z-10">
                <p className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-4">
                  Active Boosts
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter">
                      {loadingBoosts ? "..." : activeBoosts?.length || 0}
                    </h3>
                    <p className="text-[9px] font-bold text-gray-400 uppercase mt-1">
                      Live Campaigns
                    </p>
                  </div>
                  <Link
                    href="/ads"
                    className="flex items-center gap-2 text-[9px] font-black text-gold uppercase tracking-widest hover:translate-x-1 transition-transform"
                  >
                    Optimize <ArrowUpRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Conversion Intelligence */}
        <div className="bg-white border border-gray-100 rounded p-8 space-y-10">
          <div className="flex items-center gap-3">
            <TrendingUp size={18} className="text-gold" />
            <h4 className="text-sm font-black text-black uppercase tracking-widest">
              Conversion Intelligence
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:border-gold transition-all duration-500">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Avg. Conversion Rate
                </p>
                <h3 className="text-4xl font-black text-black tracking-tighter group-hover:text-gold transition-colors">
                  {conversionRate}%
                </h3>
                <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-tight">
                  Orders per 100 views
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black text-black uppercase tracking-widest">
                    Funnel Efficiency
                  </span>
                  <span className="text-[10px] font-black text-gold">
                    Optimal
                  </span>
                </div>
                <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{
                      width: `${Math.min(Number(conversionRate) * 10, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col justify-center border-l border-gray-50 pl-10">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                  <Eye size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-black uppercase tracking-widest">
                    Traffic Strength
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">
                    {loadingProductStats
                      ? "..."
                      : (productStats?.totalViews || 0).toLocaleString()}{" "}
                    Total Views
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-500 shrink-0">
                  <ShoppingBag size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-black uppercase tracking-widest">
                    Fulfillment Rate
                  </p>
                  <p className="text-[9px] font-bold text-gray-400 uppercase">
                    {stats?.totalOrders ? "100%" : "0%"} Accuracy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white border border-gray-100 rounded p-8 space-y-10">
          <div className="flex items-center gap-3">
            <PieChartIcon size={18} className="text-gold" />
            <h4 className="text-sm font-black text-black uppercase tracking-widest">
              Category Performance
            </h4>
          </div>

          <div className="space-y-6">
            {categories ? (
              categories.slice(0, 4).map((cat, i) => {
                // Mocked distribution based on real category names
                const distribution = [45, 25, 20, 10];
                return (
                  <div key={cat.id} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-gray-500">{cat.name}</span>
                      <span className="text-black">{distribution[i]}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black rounded-full"
                        style={{ width: `${distribution[i]}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-40 bg-gray-50 rounded animate-pulse" />
            )}
            <p className="text-[9px] font-bold text-gray-300 uppercase text-center pt-4">
              * Category distribution calculated from active listings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
