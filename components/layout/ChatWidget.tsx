"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, CheckCheck, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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

// ─── Session ID — persisted per browser via localStorage ─────────────────────

function getSessionId(): string {
  const KEY = "tri_labs_session_id";
  const existing = localStorage.getItem(KEY);
  if (existing) return existing;
  const id = "ID-" + Math.random().toString(36).slice(2, 7);
  localStorage.setItem(KEY, id);
  return id;
}

// ─── Chat Widget ──────────────────────────────────────────────────────────────

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Welcome to Tri Labs. How can I help you navigate my architectural works?",
      sender: "support",
      timestamp: new Date(),
    },
  ]);

  // Listen for custom event to open the chat window
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // Initialised once on mount; safe from SSR because getSessionId() is called
  // inside useRef initialiser which only runs on the client.
  const sessionIdRef = useRef<string>(
    typeof window !== "undefined" ? getSessionId() : ""
  );

  // ─── Auto-scroll to bottom on new message ────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ─── Focus input when chat opens ─────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ─── Pusher Subscription (per-session channel) ───────────────────────────
  //
  //  Channel : chat-[SESSION_ID]  (e.g. "chat-ID-a7b2c")
  //  Events  : new-message  ← echo of visitor's own message (filtered out)
  //            bot-reply    ← owner's Telegram reply routed via Worker webhook
  //
  useEffect(() => {
    // sessionIdRef is guaranteed populated on the client (set via localStorage).
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;

    const CHANNEL_NAME   = `chat-${sessionId}`; // must match Worker: `chat-${sessionId}`
    const PUSHER_KEY     = "19d32477f5acc14b340e";
    const PUSHER_CLUSTER = "ap1";

    console.debug(`[Pusher] subscribing → channel="${CHANNEL_NAME}" key="${PUSHER_KEY}"`);

    // ── Destroyed flag ────────────────────────────────────────────────────────
    // React Strict Mode runs the effect twice in development. The second cleanup
    // fires while the first Pusher instance is still in CONNECTING state, which
    // throws "WebSocket is already in CLOSING or CLOSED state" if we call
    // disconnect() blindly. The flag + state-guard below prevent this.
    let destroyed = false;

    // ── Pusher instance ───────────────────────────────────────────────────────
    const pusher = new Pusher(PUSHER_KEY, {
      cluster:           PUSHER_CLUSTER,
      enabledTransports: ["ws", "wss"], // force WebSocket; skip SockJS fallback race
      disableStats:      true,
    });

    const channel = pusher.subscribe(CHANNEL_NAME);

    // ── Append helper (safe after destroy) ───────────────────────────────────
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

    // ── Event bindings ────────────────────────────────────────────────────────
    // new-message: echo of visitor's own send — skip to avoid duplicate display.
    channel.bind(
      CHAT_CONFIG.EVENT,
      (data: { text: string; sender?: string }) => {
        if (data.sender === "user") return;
        appendSupport(data);
      },
    );

    // bot-reply: owner's reply from Telegram → Worker webhook → Pusher → here.
    channel.bind(CHAT_CONFIG.REPLY_EVENT, appendSupport);

    // ── Connection state logging ──────────────────────────────────────────────
    pusher.connection.bind(
      "state_change",
      ({ previous, current }: { previous: string; current: string }) => {
        if (destroyed) return;
        console.debug(`[Pusher] ${previous} → ${current}`);
      },
    );

    // ── Auto-reconnect on failure ─────────────────────────────────────────────
    // "unavailable" = Pusher gave up after multiple internal retries (network issue).
    // "failed"      = TLS / protocol error — also needs a manual reconnect.
    const scheduleReconnect = (reason: string) => {
      if (destroyed) return;
      console.warn(`[Pusher] ${reason} — will reconnect in 5 s`);
      setTimeout(() => {
        if (!destroyed && pusher.connection.state !== "connected") {
          pusher.connect();
        }
      }, 5_000);
    };

    pusher.connection.bind("unavailable", () => scheduleReconnect("unavailable"));
    pusher.connection.bind("failed",      () => scheduleReconnect("failed"));

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      destroyed = true; // prevent any callback from touching state after cleanup

      // Guard against calling disconnect() on an already-closing socket.
      // States "disconnected" and "disconnecting" mean the WS is already gone.
      const state = pusher.connection.state;
      if (state !== "disconnected" && state !== "disconnecting") {
        channel.unbind_all();
        pusher.unsubscribe(CHANNEL_NAME);
        pusher.disconnect();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — session ID is stable for the lifetime of the page

  // ─── Send Message ─────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isSending) return;

    const msgId = `msg-${Date.now()}`;

    // 1. Optimistic UI — add as "sending"
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

      // 2. Mark as "sent" on success + show success banner
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: "sent" } : m))
      );
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 4000);
    } catch {
      // 3. Keep message visible, show error banner
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: "sent" } : m))
      );
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSending(false);
    }
  }, [inputValue, isSending]);

  // ─── Keyboard handler ─────────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      <style>{`
        @keyframes ai-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .ai-glow-wrapper {
          position: relative;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-glow-ring {
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #4285F4,
            #9B72F3,
            #EA4335,
            #FBBC05,
            #34A853,
            #4285F4
          );
          filter: blur(8px);
          animation: ai-rotate 4s linear infinite;
          opacity: 0.4;
          pointer-events: none;
        }
        .ai-glow-border {
          position: absolute;
          inset: -0.5px;
          border-radius: 50%;
          background: conic-gradient(
            from 0deg,
            #4285F4, #9B72F3, #EA4335, #FBBC05, #34A853, #4285F4
          );
          animation: ai-rotate 4s linear infinite;
          pointer-events: none;
        }
      `}</style>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-[320px] md:w-[380px] h-[500px] bg-white/10 backdrop-blur-xl flex flex-col overflow-hidden shadow-2xl rounded-[24px]"
            style={{
              border: "none",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Header */}
            <div className="px-6 py-5 bg-white/5 flex justify-between items-center shrink-0">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-white text-sm font-bold tracking-[0.2em] uppercase">
                  Tri Labs
                </h3>
                <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">
                  Live Support
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 px-5 py-4 overflow-y-auto flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-1 max-w-[85%] ${
                    msg.sender === "user" ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 text-sm leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-white/20 text-white"
                        : "bg-white/5 text-white/80"
                    } rounded-[16px] ${
                      msg.sender === "user" ? "rounded-br-[4px]" : "rounded-bl-[4px]"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Status indicator for user messages */}
                  {msg.sender === "user" && (
                    <div className="flex items-center gap-1 px-1">
                      {msg.status === "sending" && (
                        <Loader2 size={10} className="text-white/30 animate-spin" />
                      )}
                      {msg.status === "sent" && (
                        <CheckCheck size={10} className="text-white/50" />
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
                  className={`mx-4 mb-1 px-4 py-2.5 rounded-[12px] flex items-center gap-2.5 text-xs font-medium ${
                    submitStatus === "success"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  {submitStatus === "success" ? (
                    <>
                      <CheckCircle2 size={14} className="shrink-0" />
                      <span>Tri đã nhận được tin nhắn của bạn ✓</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="shrink-0" />
                      <span>Có chút trục trặc kỹ thuật, bạn vui lòng nhắn lại sau nhé!</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="px-4 py-4 bg-white/5 flex gap-3 items-center shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message…"
                disabled={isSending}
                className="flex-1 bg-white/5 border-none outline-none text-white text-sm px-4 py-3 rounded-full focus:bg-white/10 transition-colors placeholder:text-white/25 disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isSending}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                {isSending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button — circular with Google AI Glow */}
      <div className="ai-glow-wrapper">
        <div className="ai-glow-ring" />
        <div className="ai-glow-border" />
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-full h-full rounded-full bg-[#1A1A1A] flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 shadow-xl z-10"
        >
          {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        </motion.button>
      </div>

    </div>
  );
}
