"use client";
import React from "react";
import {
	Search,
	User,
	Send,
	MoreHorizontal,
	Phone,
	Paperclip,
	Smile,
	MessageSquare,
	ChevronLeft,
} from "lucide-react";

export default function MessagesPage() {
	const [selectedChat, setSelectedChat] = React.useState<number | null>(null);

	const chats = [
		{
			name: "John Doe",
			lastMsg: "When will my order #8291 arrive?",
			time: "10m ago",
			unread: true,
		},
		{
			name: "Sarah Smith",
			lastMsg: "Thank you for the quick response!",
			time: "1h ago",
			unread: false,
		},
		{
			name: "Michael Obi",
			lastMsg: "Is the watch still in stock?",
			time: "2h ago",
			unread: false,
		},
		{
			name: "Jessica Brown",
			lastMsg: "Can I return this item?",
			time: "1d ago",
			unread: false,
		},
	];

	return (
		<div className="space-y-8 lg:space-y-10">
			<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
				<div>
					<h2 className="text-2xl lg:text-4xl font-black tracking-tighter text-black">
						Messages
					</h2>
					<p className="text-gray-400 mt-2 uppercase tracking-[0.2em] text-[10px] font-black">
						Direct communication with your customers and support team
					</p>
				</div>
			</div>

			<div className="flex h-[calc(100vh-280px)] bg-white border border-gray-100 rounded overflow-hidden relative">
			{/* Chat List Sidebar */}
			<div
				className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300 ${
					selectedChat !== null ? "hidden md:flex" : "flex"
				}`}
			>
				<div className="p-6 border-b border-gray-100">
					<div className="relative">
						<Search
							className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
							size={16}
						/>
						<input
							type="text"
							placeholder="Search messages..."
							className="w-full bg-gray-50 rounded py-3 pl-12 pr-4 text-[10px] font-black uppercase tracking-widest text-black outline-none border border-transparent focus:border-gold/30 transition-all"
						/>
					</div>
				</div>
				<div className="flex-1 overflow-y-auto no-scrollbar">
					<div className="divide-y divide-gray-50">
						{chats.map((chat, i) => (
							<div
								key={i}
								onClick={() => setSelectedChat(i)}
								className={`p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer relative ${
									chat.unread ? "bg-gold/5" : ""
								} ${selectedChat === i ? "bg-gray-50" : ""}`}
							>
								{selectedChat === i && (
									<div className="absolute top-0 left-0 bottom-0 w-1 bg-gold z-10" />
								)}
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
										<User size={18} />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center justify-between mb-1">
											<h4 className="text-[11px] font-black uppercase tracking-tight text-black truncate">
												{chat.name}
											</h4>
											<span className="text-[8px] font-bold text-gray-400 uppercase">
												{chat.time}
											</span>
										</div>
										<p className="text-[10px] text-gray-500 font-medium truncate leading-relaxed">
											{chat.lastMsg}
										</p>
									</div>
									{chat.unread && (
										<div className="w-2 h-2 rounded-full bg-gold absolute right-5 top-1/2 -translate-y-1/2" />
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Chat Area */}
			<div
				className={`flex-1 flex flex-col bg-gray-50/20 transition-all duration-300 ${
					selectedChat === null ? "hidden md:flex" : "flex"
				}`}
			>
				{selectedChat !== null ? (
					<>
						{/* Chat Header */}
						<div className="px-6 md:px-8 py-5 bg-white border-b border-gray-100 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<button
									onClick={() => setSelectedChat(null)}
									className="md:hidden w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
								>
									<ChevronLeft size={18} />
								</button>
								<div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
									<User size={18} />
								</div>
								<div>
									<h4 className="text-[11px] font-black uppercase tracking-widest text-black">
										{chats[selectedChat].name}
									</h4>
									<p className="text-[9px] font-black uppercase tracking-widest text-green-500">
										Online
									</p>
								</div>
							</div>
							<div className="flex items-center gap-4">
								<button className="text-gray-400 hover:text-black transition-colors">
									<Phone size={16} />
								</button>
								<button className="text-gray-400 hover:text-black transition-colors">
									<MoreHorizontal size={16} />
								</button>
							</div>
						</div>

						{/* Messages Display */}
						<div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar space-y-8">
							<div className="flex flex-col items-center">
								<span className="text-[8px] font-black uppercase bg-white px-4 py-1 rounded-full text-gray-400 border border-gray-100">
									Today, March 22
								</span>
							</div>

							<div className="flex gap-4 max-w-lg">
								<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100">
									<User size={14} />
								</div>
								<div className="space-y-2">
									<div className="bg-white border border-gray-100 p-4 rounded text-xs font-medium text-gray-600 leading-relaxed">
										&quot;It&apos;s a beautiful piece! I&apos;m definitely
										interested.&quot;
									</div>
									<span className="text-[8px] font-black text-gray-300 ml-1">
										10:42 AM
									</span>
								</div>
							</div>

							<div className="flex flex-row-reverse gap-4 max-w-lg ml-auto">
								<div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/10">
									<User size={14} />
								</div>
								<div className="space-y-2 text-right">
									<div className="bg-black text-white p-4 rounded text-xs font-medium leading-relaxed">
										Thank you, John! We have only 5 left in stock. Would you
										like me to hold one for you or provide a quick layout guide?
									</div>
									<span className="text-[8px] font-black text-gray-300 mr-1">
										10:45 AM
									</span>
								</div>
							</div>
						</div>

						{/* Input Area */}
						<div className="p-4 md:p-6 bg-white border-t border-gray-100">
							<div className="flex items-center gap-2 md:gap-4 bg-gray-50 rounded p-2 border border-transparent focus-within:border-gold/30 transition-all">
								<button className="p-2 md:p-3 text-gray-400 hover:text-gold transition-colors">
									<Paperclip size={18} />
								</button>
								<input
									type="text"
									placeholder="Type your message..."
									className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-black py-2 md:py-3"
								/>
								<button className="hidden sm:block p-3 text-gray-400 hover:text-gold transition-colors">
									<Smile size={18} />
								</button>
								<button className="bg-gold text-black p-2 md:p-3 rounded hover:bg-black hover:text-white transition-all">
									<Send size={18} />
								</button>
							</div>
						</div>
					</>
				) : (
					<div className="hidden md:flex flex-1 items-center justify-center text-center p-12">
						<div className="max-w-xs space-y-4">
							<div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100 mx-auto">
								<MessageSquare size={32} />
							</div>
							<h3 className="text-xs font-black uppercase tracking-widest text-black">
								Select a Conversation
							</h3>
							<p className="text-[10px] font-medium text-gray-400 leading-relaxed uppercase tracking-widest">
								Experience high-performance communication with your customers.
							</p>
						</div>
					</div>
				)}
			</div>
		</div>
		</div>
	);
}
