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
      className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-neutral-800/40 pt-5 pb-10 transition-colors duration-300" 
      id="contact"
    >
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="flex justify-between items-center gap-4 pt-1">
          {/* Left: Anchored Popover Trigger with Running Luminous Online Border */}
          <div className="relative inline-flex">
            <div className="relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden group">
              {/* Running luminous border beam ("always online" indicator) */}
              <span 
                className="absolute inset-[-150%] animate-[spin_3.5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0_70%,#10B981_88%,#6EE7B7_95%,transparent_100%)] dark:bg-[conic-gradient(from_0deg,transparent_0_70%,#10B981_88%,#34D399_95%,transparent_100%)] pointer-events-none"
                aria-hidden="true"
              />

              {/* High-Contrast Pill Button */}
              <button
                type="button"
                onClick={() => setIsChatOpen((prev) => !prev)}
                aria-expanded={isChatOpen}
                className="relative z-10 px-5 py-2 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-sans font-medium text-base tracking-normal hover:bg-neutral-900 dark:hover:bg-neutral-100 transition-all duration-300 active:scale-[0.98] cursor-pointer whitespace-nowrap select-none"
              >
                <span>&ldquo;Let&apos;s chat&rdquo;</span>
              </button>
            </div>

            {/* Anchored Popover directly above the button */}
            <ChatPopover 
              isOpen={isChatOpen} 
              onClose={() => setIsChatOpen(false)} 
            />
          </div>

          {/* Right: Copyright Only */}
          <div className="flex items-center text-[12px] font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
            <span>© {currentYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
