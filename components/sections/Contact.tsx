"use client";

import { useState, useEffect, useRef } from "react";
import { ChatPopover } from "@/components/layout/ChatPopover";

interface ContactProps {
  theme?: "light" | "dark";
  email?: string;
}

export function Contact({ theme = "dark", email = "contact@tringuyen-design.com" }: ContactProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const currentYear = new Date().getFullYear();
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleOpenChat = () => {
      contactRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      setIsChatOpen(true);
    };
    window.addEventListener("open-chat", handleOpenChat);
    return () => window.removeEventListener("open-chat", handleOpenChat);
  }, []);

  return (
    <footer 
      ref={contactRef}
      className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-neutral-800/40 py-6 sm:py-8 transition-colors duration-300" 
      id="contact"
    >
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="flex justify-between items-center gap-4">
          {/* Left-aligned item: Minimal CTA button with text "Let’s chat" */}
          <div className="relative inline-flex items-center">
            <button
              type="button"
              onClick={() => setIsChatOpen((prev) => !prev)}
              aria-expanded={isChatOpen}
              className="font-sans text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer select-none"
            >
              Let’s chat
            </button>

            {/* Anchored Popover directly above the button */}
            <ChatPopover 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)} 
            />
          </div>

          {/* Right-aligned item: Minimal copyright text © 2026 + back-to-top glyph ↑ */}
          <div className="flex items-center gap-3 font-mono text-xs text-neutral-400 select-none">
            <span>© 2026</span>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Contact as Footer };
