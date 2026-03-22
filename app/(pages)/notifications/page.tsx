"use client";
import React from "react";
import { Bell, CheckCircle, Trash2 } from "lucide-react";

export default function NotificationsPage() {
	return (
		<div className="space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black uppercase">
						Notifications
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[9px] lg:text-[10px] font-black">
						Stay updated with your store activities
					</p>
				</div>
				<div className="flex gap-2">
					<button className="px-6 py-3 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-black hover:bg-gray-50 transition-all flex items-center gap-2">
						<CheckCircle size={14} />
						Mark all as read
					</button>
					<button className="px-6 py-3 rounded border border-gray-100 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all flex items-center gap-2">
						<Trash2 size={14} />
						Clear all
					</button>
				</div>
			</div>

			<div className="bg-white border border-gray-100 rounded divide-y divide-gray-50">
				{[
					{
						title: "New Order Received",
						desc: "Order #8291 has been placed for 2 items.",
						time: "10m ago",
						type: "order",
						unread: true
					},
					{
						title: "Payout Completed",
						desc: "₦450,000 was sent to your GTB account.",
						time: "2h ago",
						type: "wallet",
						unread: false
					},
					{
						title: "Stock Alert",
						desc: "Premium Watch 5 is critically low in stock.",
						time: "5h ago",
						type: "warning",
						unread: true
					},
					{
						title: "Customer Review",
						desc: "Sarah gave 5 stars for 'Speed Sneakers'",
						time: "1d ago",
						type: "review",
						unread: false
					}
				].map((item, i) => (
					<div key={i} className={`p-6 lg:p-8 hover:bg-gray-50/50 transition-colors group cursor-pointer relative ${item.unread ? 'bg-gold/2' : ''}`}>
						<div className="flex items-start gap-6">
							<div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
								item.type === 'warning' ? 'bg-red-500' : 
								item.type === 'wallet' ? 'bg-green-500' : 'bg-gold'
							}`} />
							<div className="flex-1 min-w-0">
								<div className="flex items-center justify-between mb-2">
									<h5 className="text-sm font-black uppercase tracking-tight text-black">{item.title}</h5>
									<span className="text-[10px] font-bold text-gray-400 uppercase">{item.time}</span>
								</div>
								<p className="text-xs text-gray-500 font-medium leading-relaxed">
									{item.desc}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
