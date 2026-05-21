"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Circle, MessageCircleMore, SendHorizonal } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useEffectEvent, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useLocale, useTranslations } from "next-intl";

import { AlertMessage } from "@/components/shared/alert-message";
import { EmptyState } from "@/components/shared/empty-state";
import { usePolling } from "@/components/shared/use-polling";
import { Button, buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ConversationDto, MessageDto } from "@/types";

type Scope = "customer" | "shop" | "admin";

type ConversationDetailResponse = {
  success: boolean;
  message?: string;
  data: {
    conversation: ConversationDto;
    messages: MessageDto[];
  };
};

type ConversationsResponse = {
  success: boolean;
  message?: string;
  data: ConversationDto[];
};

let socketInstance: Socket | null = null;
const socketEnabled = process.env.NEXT_PUBLIC_ENABLE_SOCKET !== "false";

export function MessageCenter({
  scope,
  currentUserId,
  initialConversationId,
}: {
  scope: Scope;
  currentUserId: string;
  initialConversationId?: string;
}) {
  const t = useTranslations("Messages");
  const common = useTranslations("Common");
  const locale = useLocale() as "ar" | "en" | "tr";
  const router = useRouter();
  const pathname = usePathname();
  const [conversations, setConversations] = useState<ConversationDto[]>([]);
  const [activeConversation, setActiveConversation] = useState<ConversationDto | null>(null);
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [draft, setDraft] = useState("");
  const [loadingList, setLoadingList] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(Boolean(initialConversationId));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const basePath = `/${scope}/messages`;
  const messagesUrl = (conversationId: string) => `/api/${scope}/conversations/${conversationId}/messages`;

  const sortedConversations = useMemo(
    () =>
      [...conversations].sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime(),
      ),
    [conversations],
  );

  const otherTypingUsers = Object.entries(typingUsers).filter(([userId]) => userId !== currentUserId);
  const isOtherParticipantOnline = onlineUserIds.some((userId) => userId !== currentUserId);

  function getConversationTitle(conversation: ConversationDto) {
    if (scope === "customer") {
      return conversation.shop?.name ?? t("shopConversation");
    }

    if (scope === "shop") {
      return conversation.customer?.name ?? t("adminConversation");
    }

    return conversation.shop?.name ?? t("shopConversation");
  }

  function getConversationSubtitle(conversation: ConversationDto) {
    if (scope === "customer") {
      return conversation.shop?.city ?? "";
    }

    if (scope === "shop") {
      return conversation.customer?.email ?? t("adminConversation");
    }

    return conversation.customer?.name ?? t("shopConversation");
  }

  async function loadConversations() {
    try {
      const response = await fetch(`/api/${scope}/conversations`, {
        cache: "no-store",
      });
      const payload: ConversationsResponse = await response.json();

      if (!response.ok) {
        setError(payload.message ?? common("loading"));
        return;
      }

      setConversations(payload.data);
      setError(null);
    } catch {
      setError(common("loading"));
    } finally {
      setLoadingList(false);
    }
  }

  async function loadConversation(conversationId: string) {
    setLoadingMessages(true);

    try {
      const response = await fetch(messagesUrl(conversationId), {
        cache: "no-store",
      });
      const payload: ConversationDetailResponse = await response.json();

      if (!response.ok) {
        setError(payload.message ?? common("loading"));
        return;
      }

      setActiveConversation(payload.data.conversation);
      setMessages(payload.data.messages);
      setError(null);
    } catch {
      setError(common("loading"));
    } finally {
      setLoadingMessages(false);
    }
  }

  const onConversationsRefresh = useEffectEvent(() => {
    void loadConversations();
  });

  usePolling(() => loadConversations(), 10000);
  usePolling(
    () => (initialConversationId ? loadConversation(initialConversationId) : Promise.resolve()),
    6000,
    Boolean(initialConversationId),
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherTypingUsers.length]);

  useEffect(() => {
    if (!socketEnabled) {
      return;
    }

    let mounted = true;

    async function setupSocket() {
      try {
        await fetch("/api/socket");

        if (!socketInstance) {
          socketInstance = io({
            transports: ["websocket", "polling"],
          });
        }

        if (!mounted) {
          return;
        }

        const socket = socketInstance;

        if (initialConversationId) {
          socket.emit("conversation:join", initialConversationId);
        }

        socket.on("message:new", (payload: { conversationId: string; message: MessageDto }) => {
          if (payload.conversationId === initialConversationId) {
            setMessages((current) =>
              current.some((message) => message.id === payload.message.id)
                ? current
                : [...current, payload.message],
            );
          }

          onConversationsRefresh();
        });

        socket.on(
          "typing:update",
          (payload: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => {
            if (payload.conversationId !== initialConversationId) {
              return;
            }

            setTypingUsers((current) => {
              const next = { ...current };

              if (payload.isTyping) {
                next[payload.userId] = payload.userName;
              } else {
                delete next[payload.userId];
              }

              return next;
            });
          },
        );

        socket.on(
          "presence:update",
          (payload: { conversationId: string; onlineUserIds: string[] }) => {
            if (payload.conversationId === initialConversationId) {
              setOnlineUserIds(payload.onlineUserIds);
            }
          },
        );
      } catch {
        return;
      }
    }

    void setupSocket();

    return () => {
      mounted = false;

      if (socketInstance && initialConversationId) {
        socketInstance.emit("conversation:leave", initialConversationId);
        socketInstance.off("message:new");
        socketInstance.off("typing:update");
        socketInstance.off("presence:update");
      }
    };
  }, [initialConversationId]);

  async function sendMessage() {
    if (!initialConversationId || !draft.trim()) {
      return;
    }

    setSending(true);

    try {
      const response = await fetch(messagesUrl(initialConversationId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: draft,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message ?? common("loading"));
        return;
      }

      setDraft("");
      socketInstance?.emit("typing:stop", initialConversationId);
      setMessages((current) => [...current, payload.data as MessageDto]);
      void loadConversations();
    } catch {
      setError(common("loading"));
    } finally {
      setSending(false);
    }
  }

  function handleDraftChange(value: string) {
    setDraft(value);

    if (!socketEnabled || !initialConversationId || !socketInstance) {
      return;
    }

    socketInstance.emit("typing:start", initialConversationId);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketInstance?.emit("typing:stop", initialConversationId);
    }, 1200);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[340px_minmax(0,1fr)]">
      <aside className="panel overflow-hidden p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-950 p-2 text-white">
              <MessageCircleMore className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-950">{t("title")}</div>
              <div className="text-sm text-slate-500">{t("subtitle")}</div>
            </div>
          </div>
        </div>

        <div className="max-h-[70vh] space-y-2 overflow-y-auto p-3">
          <AlertMessage variant="error" message={error} />

          {loadingList ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse rounded-3xl bg-slate-100 p-4">
                  <div className="h-4 w-32 rounded-full bg-slate-200" />
                  <div className="mt-3 h-3 w-24 rounded-full bg-slate-200" />
                </div>
              ))}
            </div>
          ) : sortedConversations.length === 0 ? (
            <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
          ) : (
            sortedConversations.map((conversation) => {
              const isActive = conversation.id === initialConversationId;
              const lastMessageText = conversation.lastMessage?.text ?? t("openConversation");

              return (
                <Link
                  key={conversation.id}
                  href={`${basePath}/${conversation.id}`}
                  className={cn(
                    "block rounded-3xl border px-4 py-4 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50",
                    isActive
                      ? "border-slate-950 bg-slate-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.24)]"
                      : "border-transparent bg-white",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate font-bold">{getConversationTitle(conversation)}</div>
                      <div className={cn("mt-1 truncate text-xs", isActive ? "text-white/70" : "text-slate-500")}>
                        {getConversationSubtitle(conversation)}
                      </div>
                    </div>
                    {conversation.unreadCount > 0 ? (
                      <span className="rounded-full bg-amber-400 px-2 py-1 text-xs font-bold text-slate-950">
                        {conversation.unreadCount}
                      </span>
                    ) : null}
                  </div>
                  <div className={cn("mt-3 line-clamp-2 text-sm", isActive ? "text-white/80" : "text-slate-600")}>
                    {lastMessageText}
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </aside>

      <section className="panel min-h-[70vh] overflow-hidden p-0">
        {!initialConversationId ? (
          <div className="flex h-full items-center justify-center p-8">
            <EmptyState title={t("emptyTitle")} description={t("selectConversation")} />
          </div>
        ) : loadingMessages ? (
          <div className="space-y-4 p-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-14 animate-pulse rounded-3xl bg-slate-100",
                  index % 2 === 0 ? "ms-auto w-2/3" : "w-3/4",
                )}
              />
            ))}
          </div>
        ) : activeConversation ? (
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="rounded-2xl border border-slate-200 p-2 text-slate-600 lg:hidden"
                    onClick={() => router.push(basePath)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <div className="font-black text-slate-950">{getConversationTitle(activeConversation)}</div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <Circle
                        className={cn(
                          "h-2.5 w-2.5 fill-current",
                          isOtherParticipantOnline ? "text-emerald-500" : "text-slate-300",
                        )}
                      />
                      {isOtherParticipantOnline ? t("online") : t("offline")}
                    </div>
                  </div>
                </div>
                <Link href={(pathname ?? basePath).replace(`/messages/${activeConversation.id}`, "") || basePath} className={buttonClasses({ variant: "secondary", size: "sm" })}>
                  {common("close")}
                </Link>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.04),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(248,250,252,0.98))] px-5 py-6">
              {messages.map((message) => {
                const isOwn = message.senderId === currentUserId;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex", isOwn ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-[28px] px-4 py-3 shadow-sm",
                        isOwn
                          ? "bg-slate-950 text-white"
                          : "border border-slate-200 bg-white text-slate-800",
                      )}
                    >
                      <div className="text-sm leading-7">{message.text}</div>
                      <div className={cn("mt-2 text-[11px]", isOwn ? "text-white/60" : "text-slate-400")}>
                        {formatDate(message.createdAt, locale)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {otherTypingUsers.length > 0 ? (
                <div className="text-xs text-slate-500">{otherTypingUsers[0][1]} {t("typing")}</div>
              ) : null}
              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-slate-200 p-4">
              <div className="flex items-end gap-3">
                <Input
                  value={draft}
                  placeholder={t("inputPlaceholder")}
                  onChange={(event) => handleDraftChange(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void sendMessage();
                    }
                  }}
                />
                <Button type="button" onClick={() => void sendMessage()} loading={sending}>
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-8">
            <EmptyState title={t("emptyTitle")} description={t("selectConversation")} />
          </div>
        )}
      </section>
    </div>
  );
}
