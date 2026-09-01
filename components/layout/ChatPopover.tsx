"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, CheckCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Pusher from "pusher-js";
import { CHAT_CONFIG } from "@/lib/chat-config";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageStatus = "sending" | "sent" | "received";

interface Message {
  id: string;
  text: string;
  sender: "user" | "support";
  timestamp: Date;
  status?: MessageStatus;
}

// ─── Session ID ───────────────────────────────────────────────────────────────

function getSessionId(): string {
  const KEY = "tri_labs_session_id";
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;
  const id = "ID-" + Math.random().toString(36).slice(2, 7);
  localStorage.setItem(KEY, id);
  return id;
}

// ─── Chat Popover Props ───────────────────────────────────────────────────────

interface ChatPopoverProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatPopover({ isOpen, onClose }: ChatPopoverProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome to Tri Labs. How can I help you navigate my architectural works?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const popoverRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionIdRef = useRef<string>(
    typeof window !== "undefined" ? getSessionId() : ""
  );

  // ─── Auto-scroll ────────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  // ─── Focus input on open ────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // ─── Escape Key & Outside Click Handler ──────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ─── Pusher Subscription ────────────────────────────────────────────────────
  useEffect(() => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;

    const CHANNEL_NAME   = `chat-${sessionId}`;
    const PUSHER_KEY     = "19d32477f5acc14b340e";
    const PUSHER_CLUSTER = "ap1";

    let destroyed = false;

    const pusher = new Pusher(PUSHER_KEY, {
      cluster:           PUSHER_CLUSTER,
      enabledTransports: ["ws", "wss"],
      disableStats:      true,
    });

    const channel = pusher.subscribe(CHANNEL_NAME);

    const appendSupport = (data: { text: string }) => {
      if (destroyed) return;
      setMessages((prev) => [
        ...prev,
        {
          id:        `support-${Date.now()}`,
          text:      data.text,
          sender:    "support" as const,
          timestamp: new Date(),
        },
      ]);
    };

    channel.bind(CHAT_CONFIG.EVENT, (data: { text: string; sender?: string }) => {
      if (data.sender === "user") return;
      appendSupport(data);
    });

    channel.bind(CHAT_CONFIG.REPLY_EVENT, appendSupport);

    return () => {
      destroyed = true;
      const state = pusher.connection.state;
      if (state !== "disconnected" && state !== "disconnecting") {
        channel.unbind_all();
        pusher.unsubscribe(CHANNEL_NAME);
        pusher.disconnect();
      }
    };
  }, []);

  // ─── Send Message ───────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isSending) return;

    const msgId = `msg-${Date.now()}`;

    const optimisticMsg: Message = {
      id: msgId,
      text,
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInputValue("");
    setIsSending(true);

    try {
      const res = await fetch(CHAT_CONFIG.WORKER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, sender: "user", session_id: sessionIdRef.current }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !(json as { ok?: boolean }).ok) throw new Error("Send failed");

      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: "sent" } : m))
      );
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: "sent" } : m))
      );
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSending(false);
    }
  }, [inputValue, isSending]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasContentOrFocus = isFocused || inputValue.trim().length > 0;

  return (
    <>
      {/* Backdrop for Outside Click */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/10 dark:bg-black/30 backdrop-blur-[1px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Anchored Popover Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute bottom-full left-0 mb-3 z-50 w-[calc(100vw-40px)] sm:w-[380px] h-[500px] max-h-[75vh] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800/90 flex flex-col overflow-hidden shadow-2xl rounded-[24px] text-neutral-900 dark:text-neutral-100"
            style={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.03)",
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-neutral-100/70 dark:bg-white/[0.04] border-b border-neutral-200/60 dark:border-neutral-800/60 flex justify-between items-center shrink-0 select-none">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-neutral-900 dark:text-neutral-100 text-xs font-bold tracking-[0.2em] uppercase font-sans">
                  Tri Labs
                </h3>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono tracking-wider uppercase">
                  Live Direct Message
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 px-4 py-4 overflow-y-auto flex flex-col gap-3.5 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 max-w-[85%] ${
                    msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-normal rounded-[16px] rounded-br-[4px]"
                        : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800/70 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/50 rounded-[16px] rounded-bl-[4px]"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {msg.sender === "user" && (
                    <div className="flex items-center gap-1 px-1">
                      {msg.status === "sending" && (
                        <Loader2 size={10} className="text-neutral-400 dark:text-neutral-500 animate-spin" />
                      )}
                      {msg.status === "sent" && (
                        <CheckCheck size={11} className="text-neutral-400 dark:text-neutral-500" />
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Success / Error Banner */}
            <AnimatePresence>
              {submitStatus !== "idle" && (
                <motion.div
                  key={submitStatus}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25 }}
                  className={`mx-4 mb-2 px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-xs font-medium ${
                    submitStatus === "success"
                      ? "bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      : "bg-rose-500/10 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <>
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                      <span>Tri đã nhận được tin nhắn của bạn ✓</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="shrink-0 text-rose-600 dark:text-rose-400" />
                      <span>Có chút trục trặc kỹ thuật, bạn vui lòng nhắn lại sau nhé!</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Liquid Gooey Input Area */}
            <div className="relative p-3 bg-neutral-100/70 dark:bg-white/[0.04] border-t border-neutral-200/60 dark:border-neutral-800/60">
              {/* SVG Gooey Filter */}
              <svg className="absolute w-0 h-0 pointer-events-none" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
                <defs>
                  <filter id="gooey">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                    <feColorMatrix
                      in="blur"
                      mode="matrix"
                      values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                      result="goo"
                    />
                    <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                  </filter>
                </defs>
              </svg>

              <div className="relative flex items-center">
                {/* Gooey Metaball Background Layer */}
                <div
                  className="absolute inset-0 flex items-center justify-end pointer-events-none"
                  style={{ filter: "url(#gooey)" }}
                >
                  {/* Input Base Pill */}
                  <div className="w-full h-10 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 transition-colors" />

                  {/* Liquid Detaching Send Bubble */}
                  <AnimatePresence>
                    {hasContentOrFocus && (
                      <motion.div
                        initial={{ x: -24, scale: 0.6, opacity: 0 }}
                        animate={{ x: 6, scale: 1, opacity: 1 }}
                        exit={{ x: -24, scale: 0.6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        className="w-10 h-10 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 shrink-0 ml-1.5"
                      />
                    )}
                  </AnimatePresence>
                </div>

                {/* Foreground Crisp Layer */}
                <div className="relative z-10 flex items-center w-full">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message…"
                    disabled={isSending}
                    className="w-full h-10 bg-transparent text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm px-4 outline-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500 disabled:opacity-50"
                  />

                  <AnimatePresence>
                    {hasContentOrFocus && (
                      <motion.button
                        type="button"
                        initial={{ x: -24, scale: 0.6, opacity: 0 }}
                        animate={{ x: 6, scale: 1, opacity: 1 }}
                        exit={{ x: -24, scale: 0.6, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                        onClick={sendMessage}
                        disabled={!inputValue.trim() || isSending}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0 cursor-pointer active:scale-95 ml-1.5"
                        aria-label="Send message"
                      >
                        {isSending ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Send size={15} className="translate-x-[0.5px]" />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
