"use client";
import React from "react";
import {
	User,
	Send,
	MoreHorizontal,
	Phone,
	Paperclip,
	Smile,
	MessageSquare,
	ChevronLeft,
	Loader2,
	Inbox,
} from "lucide-react";
import {
	getConversations,
	getMessages,
	markAsRead,
	sendMessage,
} from "@/lib/api/services/chat";
import type {
	ConversationResponseDTO,
	MessageResponseDTO,
} from "@/lib/api/types/chat.types";
import { getRelativeTime } from "@/lib/utils/date";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import Image from "next/image";
import { ErrorComponent } from "@/components/ui/ErrorComponent";
import { getErrorMessage } from "@/lib/utils/errors";
import { PageHeader } from "@/components/ui/PageHeader";

export default function MessagesPage() {
	const { user } = useAuth();
	const { toast } = useToast();
	const [selectedChatId, setSelectedChatId] = React.useState<string | null>(
		null,
	);
	const [conversations, setConversations] = React.useState<
		ConversationResponseDTO[]
	>([]);
	const [messages, setMessages] = React.useState<MessageResponseDTO[]>([]);
	const [loadingConversations, setLoadingConversations] = React.useState(true);
	const [loadingMessages, setLoadingMessages] = React.useState(false);
	const [sendingMessage, setSendingMessage] = React.useState(false);
	const [newMessage, setNewMessage] = React.useState("");
	const [error, setError] = React.useState<string | null>(null);

	const fetchConversations = React.useCallback(async () => {
		try {
			setLoadingConversations(true);
			setError(null);
			const data = await getConversations();
			setConversations(data || []);
		} catch (_error) {
			console.error("Failed to fetch conversations:", _error);
			setError(getErrorMessage(_error));
		} finally {
			setLoadingConversations(false);
		}
	}, []);

	const fetchMessages = React.useCallback(
		async (id: string) => {
			try {
				setLoadingMessages(true);
				const data = await getMessages(id, 1, 100);
				setMessages(data.items || []);

				// Mark as read after fetching
				const convo = conversations.find((c) => c.id === id);
				if (convo && convo.unreadCount > 0) {
					await markAsRead(id);
					setConversations((prev) =>
						prev.map((c) => (c.id === id ? { ...c, unreadCount: 0 } : c)),
					);
				}
			} catch (_error) {
				console.error("Failed to fetch messages:", _error);
				toast("Error", "Could not load conversation history", "error");
			} finally {
				setLoadingMessages(false);
			}
		},
		[conversations, toast],
	);

	React.useEffect(() => {
		fetchConversations();
	}, [fetchConversations]);

	React.useEffect(() => {
		if (selectedChatId) {
			fetchMessages(selectedChatId);
		}
	}, [selectedChatId, fetchMessages]);

	const handleSendMessage = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		if (!selectedChatId || !newMessage.trim() || sendingMessage) return;

		try {
			setSendingMessage(true);
			const sentMsg = await sendMessage({
				conversationId: selectedChatId,
				content: newMessage.trim(),
			});
			setMessages((prev) => [...prev, sentMsg]);
			setNewMessage("");

			// Update last message in conversations list
			setConversations((prev) =>
				prev.map((c) =>
					c.id === selectedChatId
						? {
								...c,
								lastMessage: sentMsg.content,
								lastMessageAt: sentMsg.createdAt,
							}
						: c,
				),
			);
		} catch {
			toast("Error", "Failed to send message", "error");
		} finally {
			setSendingMessage(false);
		}
	};

	const selectedConversation = conversations.find(
		(c) => c.id === selectedChatId,
	);

	return (
		<div className="space-y-8 lg:space-y-10">
			{error ? (
				<ErrorComponent
					title="Failed to load messages"
					message={error!}
					onRetry={fetchConversations}
				/>
			) : (
				<>
					<PageHeader
						title="Messages"
						description="Direct communication with your customers and support team"
					/>

					<div className="flex h-[calc(100vh-180px)] bg-white border border-gray-100 rounded overflow-hidden relative">
						{/* Chat List Sidebar */}
						<div
							className={`w-full md:w-80 lg:w-96 border-r border-gray-100 flex flex-col shrink-0 transition-all duration-300 ${
								selectedChatId !== null ? "hidden md:flex" : "flex"
							}`}
						>
							<div className="p-6 border-b border-gray-100">
								<SearchInput
									placeholder="Search messages..."
									variant="muted"
									fullWidth
								/>
							</div>
							<div className="flex-1 overflow-y-auto no-scrollbar">
								{loadingConversations ? (
									<div className="p-10 flex justify-center">
										<Loader2 className="animate-spin text-gold" size={24} />
									</div>
								) : conversations.length > 0 ? (
									<div className="divide-y divide-gray-50">
										{conversations.map((chat) => (
											<div
												key={chat.id}
												onClick={() => setSelectedChatId(chat.id)}
												className={`p-5 hover:bg-gray-50/50 transition-colors group cursor-pointer relative ${
													chat.unreadCount > 0 ? "bg-gold/5" : ""
												} ${selectedChatId === chat.id ? "bg-gray-50" : ""}`}
											>
												{selectedChatId === chat.id && (
													<div className="absolute top-0 left-0 bottom-0 w-1 bg-gold z-10" />
												)}
												<div className="flex items-start gap-4">
													{chat.otherParticipantAvatar ? (
														<Image
															src={chat.otherParticipantAvatar}
															alt={chat.otherParticipantName}
															width={40}
															height={40}
															unoptimized
															className="w-10 h-10 rounded object-cover shrink-0 border border-gray-100"
														/>
													) : (
														<div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 font-bold uppercase text-xs">
															{chat.otherParticipantName?.charAt(0) || "U"}
														</div>
													)}
													<div className="flex-1 min-w-0">
														<div className="flex items-center justify-between mb-1">
															<h4 className="text-sm font-bold text-black truncate">
																{chat.otherParticipantName}
															</h4>
															<span className="text-xs font-bold text-gray-400">
																{getRelativeTime(chat.lastMessageAt)}
															</span>
														</div>
														<p
															className={`text-xs truncate leading-relaxed ${chat.unreadCount > 0 ? "text-black font-bold" : "text-gray-500 font-medium"}`}
														>
															{chat.lastMessage || "No messages yet"}
														</p>
													</div>
													{chat.unreadCount > 0 && (
														<div className="w-5 h-5 rounded bg-gold flex items-center justify-center text-xs font-bold text-black shrink-0 ml-2">
															{chat.unreadCount}
														</div>
													)}
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="p-12 text-center">
										<p className="text-xs font-bold text-gray-400 leading-relaxed">
											No active conversations found
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Chat Area */}
						<div
							className={`flex-1 flex flex-col bg-gray-50/20 transition-all duration-300 ${
								selectedChatId === null ? "hidden md:flex" : "flex"
							}`}
						>
							{selectedChatId !== null && selectedConversation ? (
								<>
									{/* Chat Header */}
									<div className="px-6 md:px-8 py-5 bg-white border-b border-gray-100 flex items-center justify-between">
										<div className="flex items-center gap-4">
											<button
												onClick={() => setSelectedChatId(null)}
												className="md:hidden w-8 h-8 rounded bg-gray-50 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
											>
												<ChevronLeft size={18} />
											</button>
											{selectedConversation.otherParticipantAvatar ? (
												<Image
													src={selectedConversation.otherParticipantAvatar}
													alt={selectedConversation.otherParticipantName}
													width={36}
													height={36}
													unoptimized
													className="w-9 h-9 md:w-10 md:h-10 rounded object-cover border border-gray-100"
												/>
											) : (
												<div className="w-9 h-9 md:w-10 md:h-10 rounded bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
													<User size={18} />
												</div>
											)}
											<div>
												<h4 className="text-sm font-bold text-black">
													{selectedConversation.otherParticipantName}
												</h4>
												<p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
													<span className="w-1.5 h-1.5 rounded bg-green-500" />
													Online
												</p>
											</div>
										</div>
										<div className="flex items-center gap-4">
											<button
												className="text-gray-400 hover:text-black transition-colors"
												title="Call - Coming Soon"
											>
												<Phone size={16} />
											</button>
											<button className="text-gray-400 hover:text-black transition-colors">
												<MoreHorizontal size={16} />
											</button>
										</div>
									</div>

									{/* Messages Display */}
									<div className="flex-1 p-6 md:p-8 overflow-y-auto no-scrollbar space-y-8">
										{loadingMessages ? (
											<div className="flex justify-center py-20">
												<Loader2 className="animate-spin text-gold" size={32} />
											</div>
										) : messages.length > 0 ? (
											<>
												<div className="flex flex-col items-center">
													<span className="text-xs font-bold bg-white px-4 py-1 rounded text-gray-400 border border-gray-100">
														Today
													</span>
												</div>

												{messages.map((item) => {
													const isMe = item.senderId === user?.userId;
													return (
														<div
															key={item.id}
															className={`flex gap-4 max-w-[85%] sm:max-w-lg ${isMe ? "flex-row-reverse ml-auto" : ""}`}
														>
															<div
																className={`w-8 h-8 rounded flex items-center justify-center shrink-0 border uppercase font-bold text-[10px] ${
																	isMe
																		? "bg-gold/20 text-gold border-gold/20"
																		: "bg-gray-100 text-gray-400 border-gray-100"
																}`}
															>
																{item.senderName?.charAt(0) || (
																	<User size={14} />
																)}
															</div>
															<div
																className={`space-y-2 ${isMe ? "text-right" : ""}`}
															>
																<div
																	className={`p-4 rounded text-sm leading-relaxed max-w-full wrap-break-word ${
																		isMe
																			? "bg-black text-white rounded-tr-none"
																			: "bg-white text-gray-600 border border-gray-100 rounded-tl-none"
																	}`}
																>
																	{item.content}
																</div>
																<span className="text-[8px] font-black text-gray-300">
																	{new Date(item.createdAt).toLocaleTimeString(
																		[],
																		{
																			hour: "2-digit",
																			minute: "2-digit",
																		},
																	)}
																</span>
															</div>
														</div>
													);
												})}
											</>
										) : (
											<div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
												<MessageSquare
													size={48}
													className="text-gray-300 mb-4"
												/>
												<p className="text-xs font-bold uppercase tracking-widest">
													No messages in this conversation
												</p>
											</div>
										)}
									</div>

									{/* Input Area */}
									<div className="p-4 md:p-6 bg-white border-t border-gray-100">
										<form
											onSubmit={handleSendMessage}
											className="flex items-center gap-2 md:gap-4 bg-gray-50 rounded p-2 border border-gray-100 focus-within:border-black transition-all"
										>
											<button
												type="button"
												className="p-2 md:p-3 text-gray-400 hover:text-gold transition-colors"
											>
												<Paperclip size={18} />
											</button>
											<input
												type="text"
												value={newMessage}
												onChange={(e) => setNewMessage(e.target.value)}
												placeholder="Type your message..."
												className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-black py-2 md:py-3"
												disabled={sendingMessage}
											/>
											<button
												type="button"
												className="hidden sm:block p-3 text-gray-400 hover:text-gold transition-colors"
											>
												<Smile size={18} />
											</button>
											<button
												type="submit"
												disabled={!newMessage.trim() || sendingMessage}
												className="bg-gold text-black p-2 md:p-3 rounded hover:bg-black hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{sendingMessage ? (
													<Loader2 className="animate-spin" size={18} />
												) : (
													<Send size={18} />
												)}
											</button>
										</form>
									</div>
								</>
							) : (
								<div className="hidden md:flex flex-1 flex-col items-center justify-center text-center p-12">
									<div className="max-w-xs space-y-4">
										<div className="w-20 h-20 rounded bg-gray-50 flex items-center justify-center text-gray-200 border border-gray-100 mx-auto">
											<Inbox size={40} />
										</div>
										<h3 className="text-2xl font-black tracking-tighter text-black">
											Direct Messages
										</h3>
										<p className="text-sm font-medium text-gray-400 leading-relaxed max-w-xs mx-auto">
											Select a customer to start high-performance communication
											and close more deals.
										</p>
										<Button
											variant="outline"
											size="sm"
											className="mt-4 rounded-full mx-auto"
											onClick={fetchConversations}
											loading={loadingConversations}
										>
											Refresh Conversations
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
