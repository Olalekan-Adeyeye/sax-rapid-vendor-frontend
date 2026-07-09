"use client";
import React from "react";
import {
  User,
  Send,
  MoreHorizontal,
  MessageSquare,
  Loader2,
  Inbox,
  RefreshCw,
  ChevronLeft,
  Check,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getMessages,
  markAsRead,
  sendMessage,
} from "@/lib/api/services/chat";
import { getRelativeTime } from "@/lib/utils/date";
import { useAuth } from "@/lib/context/AuthContext";
import { useToast } from "@/lib/context/ToastContext";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";
import { Input } from "@/components/ui/Input";

import { getErrorMessage } from "@/lib/utils/errors";
import { PageHeader } from "@/components/ui/PageHeader";
import { FullPageLoader } from "@/components/common/FullPageLoader";
import { EmptyState } from "@/components/common/EmptyState";

export default function MessagesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = React.useState<string | null>(
    null,
  );
  const [newMessage, setNewMessage] = React.useState("");
  const [searchInput, setSearchInput] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Queries
  const {
    data: conversationsData,
    isLoading: loadingConversations,
    isFetching: fetchingConversations,
    error: conversationsError,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const {
    data: messagesData,
    isLoading: loadingMessages,
    error: messagesError,
  } = useQuery({
    queryKey: ["messages", selectedChatId],
    queryFn: () =>
      selectedChatId ? getMessages(selectedChatId, 1, 100) : null,
    enabled: !!selectedChatId,
  });

  const conversations = React.useMemo(
    () => conversationsData || [],
    [conversationsData],
  );
  const filteredConversations = React.useMemo(
    () =>
      conversations.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.buyerName.toLowerCase().includes(q) ||
          c.vendorName.toLowerCase().includes(q)
        );
      }),
    [conversations, searchQuery],
  );
  const messages = React.useMemo(() => messagesData?.items || [], [messagesData]);
  const conversationsErrorMsg = conversationsError
    ? getErrorMessage(conversationsError)
    : null;
  const messagesErrorMsg = messagesError
    ? getErrorMessage(messagesError)
    : null;

  // Mutations
  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["messages", selectedChatId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
    onError: () => {
      toast("Error", "Failed to send message", "error");
    },
  });

  React.useEffect(() => {
    if (selectedChatId) {
      const convo = conversations.find((c) => c.id === selectedChatId);
      if (convo && convo.unreadCount > 0) {
        markAsReadMutation.mutate(selectedChatId);
      }
    }
  }, [selectedChatId, conversations, markAsReadMutation]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedChatId || !newMessage.trim() || sendMutation.isPending) return;

    sendMutation.mutate({
      conversationId: selectedChatId,
      content: newMessage.trim(),
    });
  };

  const handleRefresh = async () => {
    try {
      await refetchConversations();
      toast("Refreshed", "Conversation list updated", "success");
    } catch {
      toast("Refresh Failed", "Could not sync conversations", "error");
    }
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedChatId,
  );

  // Helper to get other participant info based on current user
  const getOtherParticipant = (conversation: (typeof conversations)[0]) => {
    if (user?.userId === conversation.buyerId) {
      return {
        id: conversation.vendorId,
        name: conversation.vendorName,
      };
    }
    return {
      id: conversation.buyerId,
      name: conversation.buyerName,
    };
  };

  const groupedMessages = React.useMemo(() => {
    const groupMessagesByDate = (msgs: typeof messages) => {
      const groups: { [key: string]: typeof messages } = {};
      msgs.forEach((msg) => {
        const date = new Date(msg.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
      });
      return groups;
    };
    return groupMessagesByDate(messages);
  }, [messages]);

  // Check if message should show avatar (first in group or after different sender)
  const shouldShowAvatar = (index: number, msgs: typeof messages) => {
    if (index === 0) return true;
    return msgs[index].senderId !== msgs[index - 1].senderId;
  };

  // Format date for display
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isInitialLoading = loadingConversations && conversations.length === 0;
  if (isInitialLoading) {
    return <FullPageLoader label="Loading messages..." icon={MessageSquare} />;
  }

  return (
    <div className="space-y-8 lg:space-y-10">
      <PageHeader
        title="Messages"
        description="Direct communication with your customers and support team"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={fetchingConversations}
            className="px-6 rounded-full text-xs font-bold gap-2"
          >
            <RefreshCw
              size={14}
              className={`${fetchingConversations ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        }
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
              focusColor="gold"
              value={searchInput}
              onChange={setSearchInput}
              onSearch={setSearchQuery}
              disabled={loadingConversations}
            />
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {loadingConversations ? (
              <div className="flex items-center justify-center h-full py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : conversationsErrorMsg ? (
              <div className="p-8 text-center">
                <p className="text-sm font-bold text-red-600 mb-2">
                  Failed to load conversations
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  {conversationsErrorMsg}
                </p>
              </div>
            ) : filteredConversations.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {filteredConversations.map((chat) => (
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
                      {(() => {
                        const otherParticipant = getOtherParticipant(chat);
                        return (
                          <>
                            <div className="w-10 h-10 rounded bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 font-bold uppercase text-xs">
                              {otherParticipant.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-bold text-black truncate">
                                  {otherParticipant.name}
                                </h4>
                                <span className="text-xs font-bold text-gray-400">
                                  {getRelativeTime(chat.lastMessageAt)}
                                </span>
                              </div>
                              <p
                                className={`text-xs truncate leading-relaxed ${chat.unreadCount > 0 ? "text-black font-bold" : "text-gray-500 font-medium"}`}
                              >
                                {chat.lastMessage?.content || "No messages yet"}
                              </p>
                            </div>
                          </>
                        );
                      })()}
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
              <EmptyState icon={MessageSquare} title="No active conversations found" className="py-12" />
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedChatId(null)}
                    className="md:hidden !p-2 !bg-gray-50 !text-gray-400 !hover:text-black !transition-colors !rounded !border-0"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                  {(() => {
                    const otherParticipant =
                      getOtherParticipant(selectedConversation);
                    return (
                      <>
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded bg-gray-50 flex items-center justify-center text-gray-300 border border-gray-100">
                          <User size={18} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-black">
                            {otherParticipant.name}
                          </h4>
                          <p className="text-xs font-bold text-green-600 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded bg-green-500" />
                            Customer
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={sendMutation.isPending}
                    className="p-2! text-gray-400! hover:text-black! transition-colors! border-0! !bg-transparent!"
                  >
                    <MoreHorizontal size={16} />
                  </Button>
                </div>
              </div>

              {/* Messages Display */}
              <div className="flex-1 p-4 md:p-6 overflow-y-auto no-scrollbar space-y-4">
                {messagesErrorMsg ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-sm font-bold text-red-600 mb-2">
                      Error loading messages
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      {messagesErrorMsg}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        queryClient.invalidateQueries({
                          queryKey: ["messages", selectedChatId],
                        })
                      }
                      className="rounded-full text-xs font-bold"
                    >
                      <RefreshCw size={12} className="mr-1.5" />
                      Retry
                    </Button>
                  </div>
                ) : loadingMessages ? (
                  <div className="flex items-center justify-center h-full py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-gold" />
                  </div>
                ) : messages.length > 0 ? (
                  <>
                    {Object.entries(groupedMessages).map(
                      ([dateStr, dateMessages]) => (
                        <div key={dateStr} className="space-y-3">
                          {/* Date Divider */}
                          <div className="flex items-center gap-3 py-2">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-xs font-bold text-gray-400 px-2.5 py-1 bg-white rounded border border-gray-100">
                              {formatDateHeader(dateStr)}
                            </span>
                            <div className="flex-1 h-px bg-gray-100" />
                          </div>

                          {/* Messages for this date */}
                          <div className="space-y-1.5">
                            {dateMessages.map((item, index) => {
                              const isMe = item.senderId === user?.userId;
                              const showAvatar = shouldShowAvatar(
                                index,
                                dateMessages,
                              );

                              return (
                                <div
                                  key={item.id}
                                  className={`flex gap-2 ${
                                    isMe ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  {/* Avatar - Left side for received only */}
                                  {!isMe && (
                                    <div className="w-7 h-7 shrink-0 flex-shrink-0">
                                      {showAvatar ? (
                                        <div className="w-full h-full rounded bg-gold flex items-center justify-center text-black font-bold text-xs">
                                          {item.senderName?.charAt(0) || "?"}
                                        </div>
                                      ) : (
                                        <div className="w-full h-full" />
                                      )}
                                    </div>
                                  )}

                                  {/* Message Bubble with Timestamp */}
                                  <div
                                    className={`flex flex-col gap-1 max-w-xs ${
                                      isMe ? "items-end" : "items-start"
                                    }`}
                                  >
                                    <div
                                      className={`px-3 py-2 rounded text-sm leading-snug ${
                                        isMe
                                          ? "bg-black text-white"
                                          : "bg-gold/10 text-black"
                                      }`}
                                    >
                                      {item.content}
                                    </div>

                                    {/* Timestamp and Read Receipt - Every message */}
                                    <div
                                      className={`flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 px-1 ${
                                        isMe ? "flex-row-reverse" : ""
                                      }`}
                                    >
                                      {isMe && (
                                        <div className="flex items-center gap-0.5">
                                          <Check
                                            size={11}
                                            className={
                                              item.isRead
                                                ? "text-gold"
                                                : "text-gray-300"
                                            }
                                            strokeWidth={3}
                                          />
                                          {item.isRead && (
                                            <Check
                                              size={11}
                                              className="text-gold -ml-1"
                                              strokeWidth={3}
                                            />
                                          )}
                                        </div>
                                      )}
                                      <span>
                                        {new Date(
                                          item.createdAt,
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ),
                    )}
                  </>
                ) : (
                  <EmptyState icon={MessageSquare} title="No messages in this conversation" className="py-20 opacity-40" />
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 md:p-6 bg-white border-t border-gray-100">
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-2 md:gap-3"
                >
                  <Input
                    id="message-input"
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sendMutation.isPending}
                    className="!bg-gray-50 !border-gray-100 !rounded !px-3 !py-2 !text-sm !font-medium !focus:border-black"
                    outerClassName="!flex-1 !gap-0"
                  />

                  <Button
                    type="submit"
                    disabled={!newMessage.trim() || sendMutation.isPending}
                    className="!bg-gold !text-black !p-2 !md:p-3 !rounded !hover:bg-black !hover:text-white !transition-all !disabled:opacity-50 !disabled:cursor-not-allowed"
                  >
                    {sendMutation.isPending ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
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
                  Select a customer to start high-performance communication and
                  close more deals.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
