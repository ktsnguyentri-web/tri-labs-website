"use client";

import { Mail, ExternalLink, ArrowRight, Link2, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../layout/Logo";

interface ContactProps {
  theme?: "light" | "dark";
  email?: string;
}

export function Contact({ theme = "dark", email = "contact@tringuyen-design.com" }: ContactProps) {
  const isLight = theme === "light";
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <footer 
      className="w-full bg-[#FAFAFA] dark:bg-[#0A0A0A] border-t border-neutral-200 dark:border-neutral-800/40 pt-4 pb-8 transition-colors duration-300" 
      id="contact"
    >
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pt-2">
          {/* Brand Monogram */}
          <Logo />

          {/* Action & Metadata */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[12px] font-mono">
            {/* Get In Touch Action */}
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-300 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-900 dark:hover:border-neutral-600 hover:bg-black/[0.03] dark:hover:bg-white/[0.03] font-sans text-xs font-medium tracking-normal rounded-md transition-all duration-300 active:scale-[0.98]"
            >
              <Mail className="w-3.5 h-3.5" />
              Get In Touch
            </a>

            <div className="flex items-center gap-4 text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
              <span>© {currentYear}</span>

              {/* Back to Top Arrow */}
              <button
                onClick={scrollToTop}
                className="w-8 h-8 border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:border-neutral-900 dark:hover:border-neutral-600 rounded-sm flex items-center justify-center transition-all duration-300 group cursor-pointer"
                aria-label="Back to top"
              >
                <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
