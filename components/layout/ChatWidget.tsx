"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Check, CheckCheck, Loader2 } from "lucide-react";
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
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  // ─── Pusher Subscription ─────────────────────────────────────────────────
  useEffect(() => {
    const pusher = new Pusher(CHAT_CONFIG.PUSHER_APP_KEY, {
      cluster: CHAT_CONFIG.PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(CHAT_CONFIG.CHANNEL);

    channel.bind(CHAT_CONFIG.EVENT, (data: { text: string; sender?: string }) => {
      // Don't duplicate messages from the user (those are added optimistically)
      if (data.sender === "user") return;

      const incomingMessage: Message = {
        id: `incoming-${Date.now()}`,
        text: data.text,
        sender: "support",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, incomingMessage]);
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(CHAT_CONFIG.CHANNEL);
      pusher.disconnect();
    };
  }, []);

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
        body: JSON.stringify({ text, sender: "user" }),
      });

      if (!res.ok) throw new Error("Send failed");

      // 2. Mark as "sent" on success
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, status: "sent" } : m))
      );
    } catch {
      // 3. Mark as failed (show an error indicator)
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, status: "sent", text: `${m.text} ⚠️` } : m
        )
      );
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

      {/* Trigger Button — circular, matches nav arrows */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-full border border-white/10 bg-background flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all duration-300 shadow-xl z-[101]"
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </motion.button>

    </div>
  );
}
