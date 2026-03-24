"use client";
import React from "react";
import { UserCog, Bell, Shield, Lock, Save, ChevronRight } from "lucide-react";

export default function AccountSettingsPage() {
	const [activeTab, setActiveTab] = React.useState("Profile");

	return (
		<div className="max-w-4xl mx-auto space-y-12">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						Account Settings
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Manage your security and preferences
					</p>
				</div>
				<button className="px-8 py-4 rounded bg-gold text-[10px] font-black uppercase tracking-widest text-black hover:bg-black hover:text-white transition-all flex items-center justify-center gap-3">
					<Save size={16} />
					Save Changes
				</button>
			</div>

			<div className="flex bg-white border border-gray-100 rounded p-1.5 overflow-x-auto no-scrollbar">
				{["Profile", "Security", "Notifications"].map((tab) => (
					<button 
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`px-8 py-3 rounded text-[10px] font-black uppercase tracking-widest transition-all ${
							activeTab === tab ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-50'
						}`}
					>
						{tab}
					</button>
				))}
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
				<div className="lg:col-span-1 space-y-8">
					<div className="bg-white border border-gray-100 rounded p-8 flex flex-col items-center text-center space-y-4">
						<div className="w-24 h-24 rounded-full bg-gold/10 border-4 border-white flex items-center justify-center text-gold overflow-hidden">
							<img src="https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&h=400&fit=crop" alt="Profile" className="w-full h-full object-cover" />
						</div>
						<div>
							<h4 className="text-sm font-black uppercase tracking-tight text-black">TechWorld Enterprise</h4>
							<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Managed by Admin</p>
						</div>
					</div>
					<div className="bg-black text-white rounded p-8 space-y-6">
						<h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Security Score</h5>
						<div className="flex items-end gap-2">
							<span className="text-3xl font-black tracking-tighter">92%</span>
							<span className="text-[8px] font-black uppercase tracking-widest text-green-500 mb-1.5">Elite Level</span>
						</div>
						<div className="h-1 bg-white/10 rounded-full overflow-hidden">
							<div className="h-full bg-gold rounded-full w-[92%]" />
						</div>
					</div>
				</div>

				<div className="lg:col-span-3 space-y-10">
					{activeTab === "Profile" && (
						<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
							<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
								<UserCog size={14} />
								Personal Profiles
							</h4>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div className="space-y-3">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">First Name</label>
									<input type="text" defaultValue="Adebayo" className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all" />
								</div>
								<div className="space-y-3">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Last Name</label>
									<input type="text" defaultValue="Olatunji" className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all" />
								</div>
								<div className="space-y-3 md:col-span-2">
									<label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
									<input type="email" defaultValue="adebayo@techworld.com" className="w-full bg-gray-50 border border-transparent focus:border-gold/30 rounded px-5 py-4 text-sm font-black text-black outline-none transition-all" />
								</div>
							</div>
						</div>
					)}

					{activeTab === "Security" && (
						<div className="space-y-8">
							<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
								<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
									<Lock size={14} />
									Security Protocol
								</h4>
								<div className="space-y-6">
									<div className="flex items-center justify-between p-6 rounded bg-gray-50 group hover:border-gold border border-transparent transition-all cursor-pointer">
										<div className="flex items-center gap-6">
											<div className="w-12 h-12 rounded bg-white flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-gold transition-all">
												<Shield size={20} />
											</div>
											<div>
												<h5 className="text-[11px] font-black uppercase tracking-tight text-black">Two-Factor Authentication</h5>
												<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Recommended for high volume sellers</p>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<span className="text-[8px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-3 py-1.5 rounded-full">ENABLED</span>
											<ChevronRight size={16} className="text-gray-300" />
										</div>
									</div>
									<div className="flex items-center justify-between p-6 rounded bg-gray-50 group hover:border-gold border border-transparent transition-all cursor-pointer">
										<div className="flex items-center gap-6">
											<div className="w-12 h-12 rounded bg-white flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-gold transition-all">
												<Lock size={20} />
											</div>
											<div>
												<h5 className="text-[11px] font-black uppercase tracking-tight text-black">Change Management Password</h5>
												<p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Last changed 4 months ago</p>
											</div>
										</div>
										<ChevronRight size={16} className="text-gray-300" />
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === "Notifications" && (
						<div className="bg-white border border-gray-100 rounded p-10 space-y-10">
							<h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gold pb-6 border-b border-gray-50 flex items-center gap-3">
								<Bell size={14} />
								Communication Center
							</h4>
							<div className="space-y-10">
								{[
									{ label: "Email Notifications", desc: "Receive sales reports and order updates via email.", active: true },
									{ label: "Push Notification Alerts", desc: "Get real-time browser alerts for new messages.", active: true },
									{ label: "Campaign Analytics", desc: "Monthly breakdown of your marketing performance.", active: true },
									{ label: "Inventory Alerts", desc: "System alerts when items reach low stock levels.", active: true }
								].map((notif, i) => (
									<div key={i} className="flex items-center justify-between group">
										<div className="max-w-md">
											<h5 className="text-[11px] font-black uppercase tracking-tight text-black mb-1">{notif.label}</h5>
											<p className="text-[10px] font-medium text-gray-400 leading-relaxed">{notif.desc}</p>
										</div>
										<button className={`w-12 h-6 rounded-full p-1 flex items-center transition-all ${notif.active ? 'bg-gold justify-end' : 'bg-gray-100 justify-start'}`}>
											<div className="w-4 h-4 rounded-full bg-black" />
										</button>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
