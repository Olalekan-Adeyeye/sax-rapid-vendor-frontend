"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  CheckCircle,
  Trash2,
  ShoppingBag,
  CreditCard,
  AlertTriangle,
  Star,
  Shield,
  Check,
  Inbox,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getNotificationCount,
} from "@/lib/api/services/notifications";
import type { NotificationResponse } from "@/lib/api/types/notifications.types";
import { getRelativeTime } from "@/lib/utils/date";
import { useToast } from "@/lib/context/ToastContext";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getErrorMessage } from "@/lib/utils/errors";
import { PageHeader } from "@/components/ui/PageHeader";
import { Skeleton } from "@/components/ui/Skeleton";

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
  General: { icon: Bell, color: "bg-gray-400" },
  NewMessage: { icon: ShoppingBag, color: "bg-gold" },
  PaymentReceived: { icon: CreditCard, color: "bg-green-500" },
  SubscriptionActivated: { icon: Shield, color: "bg-black" },
  BoostActivated: { icon: Star, color: "bg-blue-500" },
  VendorRejected: { icon: AlertTriangle, color: "bg-red-500" },
  Order: { icon: ShoppingBag, color: "bg-gold" },
  Wallet: { icon: CreditCard, color: "bg-green-500" },
  Warning: { icon: AlertTriangle, color: "bg-red-500" },
  Review: { icon: Star, color: "bg-blue-500" },
  System: { icon: Bell, color: "bg-gray-400" },
  Admin: { icon: Shield, color: "bg-black" },
};

const notificationRouteMap: Record<string, (id?: string | null) => string> = {
  Product: (id) => `/products/${id}`,
  Payment: () => "/wallet",
  Conversation: () => "/messages",
  ProductBoost: () => "/ads",
  VendorSubscription: () => "/subscriptions",
};

export default function NotificationsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const {
    data: notificationsData,
    isLoading: loadingNotifications,
    isFetching: fetchingNotifications,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(1, 100),
  });

  const { data: countData, isLoading: loadingCount } = useQuery({
    queryKey: ["notification-count"],
    queryFn: getNotificationCount,
  });

  const notifications = notificationsData || [];
  const counts = {
    total: countData?.totalCount || 0,
    unread: countData?.unreadCount || 0,
  };
  const loading = loadingNotifications;
  const error = queryError ? getErrorMessage(queryError) : null;

  // Mutations
  const markAllReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
      toast("Success", "All notifications marked as read", "success");
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const markReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
      toast("Deleted", "Notification deleted", "success");
    },
    onError: (error) => {
      toast("Error", getErrorMessage(error), "error");
    },
  });

  const handleMarkAllRead = () => {
    if (counts.unread === 0) return;
    markAllReadMutation.mutate();
  };

  const handleMarkOneRead = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification || notification.isRead) return;
    markReadMutation.mutate(id);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  const handleNavigate = (item: NotificationResponse) => {
    if (!item.isRead) markReadMutation.mutate(item.id);
    const path = item.referenceType
      ? notificationRouteMap[item.referenceType]?.(item.referenceId)
      : null;
    if (path) router.push(path);
  };

  const handleRefresh = async () => {
    try {
      await refetch();
      toast("Refreshed", "Notification list updated", "success");
    } catch (err) {
      toast("Refresh Failed", "Could not sync notifications", "error");
    }
  };

  const renderNotificationSkeletons = () => (
    <div className="divide-y divide-gray-50">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="p-6 lg:p-8">
          <div className="flex items-start gap-6">
            <Skeleton circle className="w-10 h-10 bg-gray-100 shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center gap-6">
                <Skeleton className="h-4 w-1/4 bg-gray-100" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      {error && notifications.length === 0 ? (
        <ErrorComponent
          title="Failed to load notifications"
          message={error!}
          onRetry={() =>
            queryClient.invalidateQueries({ queryKey: ["notifications"] })
          }
        />
      ) : (
        <>
          <PageHeader
            title={
              <span className="flex items-center gap-4">
                Notifications
                {loadingCount ? (
                  <Skeleton circle className="h-6 w-8 bg-gold/20" />
                ) : counts.unread > 0 ? (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-black bg-gold text-black rounded-full min-w-6">
                    {counts.unread}
                  </span>
                ) : null}
              </span>
            }
            description="Stay updated with your store activities"
            actions={
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllRead}
                  loading={markAllReadMutation.isPending}
                  disabled={counts.unread === 0 || loading}
                  className="px-6 rounded-full text-xs font-bold"
                >
                  <CheckCircle size={14} />
                  Mark all read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={fetchingNotifications}
                  className="px-6 rounded-full text-xs font-bold gap-2"
                >
                  <RefreshCw
                    size={14}
                    className={fetchingNotifications ? "animate-spin" : ""}
                  />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast("Coming Soon", "Functionality coming soon", "info")
                  }
                  disabled={(notifications?.length || 0) === 0 || loading}
                  className="px-6 rounded-full text-xs font-bold text-red-500 border-red-50 hover:bg-red-50 hover:border-red-100"
                >
                  <Trash2 size={14} />
                  Clear all
                </Button>
              </>
            }
          />

          <div className="bg-white border border-gray-100 rounded overflow-hidden shadow-sm shadow-gray-100/50">
            {loading ? (
              renderNotificationSkeletons()
            ) : notifications?.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {notifications.map((item) => {
                  const Config = typeConfig[item.type] || typeConfig.System;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleNavigate(item)}
                      className={`p-6 lg:p-8 hover:bg-gray-50/80 transition-all duration-300 group cursor-pointer relative ${!item.isRead ? "bg-gold/3" : ""}`}
                    >
                      {!item.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />
                      )}
                      <div className="flex items-start gap-6">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${Config.color}`}
                        >
                          <Config.icon
                            size={18}
                            className={
                              item.type === "Admin" ? "text-gold" : "text-white"
                            }
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2 gap-4">
                            <h5
                              className={`text-sm tracking-tight break-words transition-colors ${!item.isRead ? "font-black text-black" : "font-bold text-gray-600"}`}
                            >
                              {item.title}
                            </h5>
                            <div className="flex items-center gap-4 shrink-0">
                              <span className="text-[10px] font-bold text-gray-400 font-mono uppercase whitespace-nowrap">
                                {getRelativeTime(item.createdAt)}
                              </span>
                              <button
                                onClick={(e) => handleDelete(e, item.id)}
                                disabled={deleteMutation.isPending}
                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-full transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p
                            className={`text-xs leading-relaxed break-words ${!item.isRead ? "text-gray-900 font-bold" : "text-gray-500 font-medium"}`}
                          >
                            {item.body}
                          </p>
                          {!item.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkOneRead(item.id);
                              }}
                              disabled={markReadMutation.isPending}
                              className="mt-3 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-300 hover:text-green-600 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Check size={10} />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-200">
                  <Inbox size={40} />
                </div>
                <h3 className="text-2xl font-black text-black tracking-tight">
                  No Notifications Yet
                </h3>
                <p className="text-gray-500 text-sm mt-3 max-w-xs font-medium leading-relaxed">
                  When you have activities like new orders, payouts or reviews,
                  they will appear here.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-8 rounded-full px-8 gap-2 font-bold"
                  onClick={handleRefresh}
                  disabled={fetchingNotifications}
                >
                  <RefreshCw
                    size={16}
                    className={fetchingNotifications ? "animate-spin" : ""}
                  />
                  {fetchingNotifications ? "Refreshing..." : "Refresh List"}
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
