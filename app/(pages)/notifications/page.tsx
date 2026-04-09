"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Bell, CheckCircle, Trash2, ShoppingBag, CreditCard, AlertTriangle, Star, Shield, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { 
  getNotifications, 
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  getNotificationCount 
} from "@/lib/api/services/notifications";
import type { NotificationResponse } from "@/lib/api/types/notifications.types";
import { getRelativeTime } from "@/lib/utils/date";
import { useToast } from "@/lib/context/ToastContext";

const typeConfig: Record<string, { icon: React.ElementType, color: string }> = {
	Order: { icon: ShoppingBag, color: 'bg-gold' },
	Wallet: { icon: CreditCard, color: 'bg-green-500' },
	Warning: { icon: AlertTriangle, color: 'bg-red-500' },
	Review: { icon: Star, color: 'bg-blue-500' },
	System: { icon: Bell, color: 'bg-gray-400' },
	Admin: { icon: Shield, color: 'bg-black' },
};

export default function NotificationsPage() {
	const { toast } = useToast();
	const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
	const [loading, setLoading] = useState(true);
	const [counts, setCounts] = useState({ total: 0, unread: 0 });
	const [markingAll, setMarkingAll] = useState(false);

	const fetchNotifications = useCallback(async () => {
		try {
			setLoading(true);
			const data = await getNotifications(1, 100);
			setNotifications(data?.items || []);
			
			const countData = await getNotificationCount();
			setCounts({ 
				total: countData?.totalCount || 0, 
				unread: countData?.unreadCount || 0 
			});
		} catch (error) {
			console.error("Failed to fetch notifications:", error);
			toast("Error", "Could not load notifications", "error");
		} finally {
			setLoading(false);
		}
	}, [toast]);

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	const handleMarkAllRead = async () => {
		if (counts.unread === 0) return;
		try {
			setMarkingAll(true);
			await markAllAsRead();
			setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
			setCounts(prev => ({ ...prev, unread: 0 }));
			toast("Success", "All notifications marked as read", "success");
		} catch {
			toast("Error", "Failed to mark notifications as read", "error");
		} finally {
			setMarkingAll(false);
		}
	};

	const handleMarkOneRead = async (id: string) => {
		const notification = notifications.find(n => n.id === id);
		if (!notification || notification.isRead) return;

		try {
			await markAsRead(id);
			setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
			setCounts(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
		} catch (error) {
			console.error("Failed to mark notification as read:", error);
		}
	};

	const handleDelete = async (e: React.MouseEvent, id: string) => {
		e.stopPropagation();
		try {
			await deleteNotification(id);
			setNotifications(prev => {
				const filtered = prev.filter(n => n.id !== id);
				const deleted = prev.find(n => n.id === id);
				if (deleted && !deleted.isRead) {
					setCounts(c => ({ ...c, unread: Math.max(0, c.unread - 1), total: c.total - 1 }));
				} else {
					setCounts(c => ({ ...c, total: c.total - 1 }));
				}
				return filtered;
			});
			toast("Deleted", "Notification deleted", "success");
		} catch {
			toast("Error", "Failed to delete notification", "error");
		}
	};

	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black flex items-center gap-4">
						Notifications
						{counts.unread > 0 && (
							<span className="inline-flex items-center justify-center px-2 py-1 text-[10px] font-black bg-gold text-black rounded-full min-w-6">
								{counts.unread}
							</span>
						)}
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[9px] lg:text-[10px] font-black">
						Stay updated with your store activities
					</p>
				</div>
				<div className="flex gap-2">
					<Button 
						variant="outline" 
						size="sm" 
						onClick={handleMarkAllRead} 
						loading={markingAll}
						disabled={counts.unread === 0 || loading}
						className="px-4!"
					>
						<CheckCircle size={14} />
						Mark all read
					</Button>
					{/* Placeholder for "Clear all" as there's no single endpoint for it in swagger, 
					    we could loop delete but that's inefficient. For now let's keep it disabled or hidden if no notifications. */}
					<Button 
						variant="outline" 
						size="sm" 
						onClick={() => toast("Coming Soon", "Functionality coming soon", "info")}
						disabled={(notifications?.length || 0) === 0 || loading}
						className="px-4! text-red-500 border-red-50 hover:bg-red-50 hover:border-red-100"
					>
						<Trash2 size={14} />
						Clear all
					</Button>
				</div>
			</div>

			<div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm shadow-gray-100/50">
				{loading ? (
					<div className="divide-y divide-gray-50">
						{[1, 2, 3, 4].map((i) => (
							<div key={i} className="p-6 lg:p-8 animate-pulse">
								<div className="flex items-start gap-6">
									<div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
									<div className="flex-1 space-y-3">
										<div className="flex justify-between items-center">
											<div className="h-4 bg-gray-100 rounded w-1/4" />
											<div className="h-3 bg-gray-50 rounded w-12" />
										</div>
										<div className="h-3 bg-gray-50 rounded w-full" />
										<div className="h-3 bg-gray-50 rounded w-2/3" />
									</div>
								</div>
							</div>
						))}
					</div>
				) : notifications?.length > 0 ? (
					<div className="divide-y divide-gray-50">
						{notifications.map((item) => {
							const Config = typeConfig[item.type] || typeConfig.System;
							return (
								<div 
									key={item.id} 
									onClick={() => handleMarkOneRead(item.id)}
									className={`p-6 lg:p-8 hover:bg-gray-50/80 transition-all duration-300 group cursor-pointer relative ${!item.isRead ? 'bg-gold/3' : ''}`}
								>
									{!item.isRead && (
										<div className="absolute left-0 top-0 bottom-0 w-1 bg-gold" />
									)}
									<div className="flex items-start gap-6">
										<div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${Config.color}`}>
											<Config.icon size={18} className={item.type === 'Admin' ? 'text-gold' : 'text-white'} />
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between mb-2">
												<h5 className={`text-sm tracking-tight transition-colors ${!item.isRead ? 'font-black text-black' : 'font-bold text-gray-600'}`}>
													{item.title}
												</h5>
												<div className="flex items-center gap-4">
													<span className="text-[10px] font-bold text-gray-400 font-mono uppercase">
														{getRelativeTime(item.createdAt)}
													</span>
													<button 
														onClick={(e) => handleDelete(e, item.id)}
														className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 text-gray-300 hover:text-red-500 rounded-full transition-all"
													>
														<Trash2 size={14} />
													</button>
												</div>
											</div>
											<p className={`text-xs leading-relaxed ${!item.isRead ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>
												{item.message}
											</p>
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
						<h3 className="text-xl font-black text-black uppercase tracking-tight">No Notifications Yet</h3>
						<p className="text-gray-400 text-xs mt-2 max-w-xs font-medium leading-relaxed">
							When you have activities like new orders, payouts or reviews, they will appear here.
						</p>
						<Button 
							variant="outline" 
							size="sm" 
							className="mt-8"
							onClick={fetchNotifications}
						>
							Refresh List
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
