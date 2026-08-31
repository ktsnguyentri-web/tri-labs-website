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
      className={`w-full ${isLight ? "bg-white" : "bg-black"} pt-4 pb-8`} 
      id="contact"
    >
      <div className="w-full max-w-3xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 pt-2">
          {/* Brand Monogram */}
          <Logo className={isLight ? "text-black" : "text-white"} />

          {/* Action & Metadata */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[11px] font-mono">
            {/* Get In Touch Action */}
            <a
              href={`mailto:${email}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 border ${
                isLight
                  ? "border-black/20 text-black hover:border-black hover:bg-black/[0.04]"
                  : "border-white/20 text-white hover:border-white hover:bg-white/[0.04]"
              } tracking-[0.2em] uppercase transition-all duration-300 active:scale-[0.98]`}
            >
              <Mail className="w-3 h-3" />
              Get In Touch
            </a>

            <div className={`flex items-center gap-4 ${isLight ? "text-black/40" : "text-white/40"} whitespace-nowrap`}>
              <span>© {currentYear}</span>

              {/* Back to Top Arrow */}
              <button
                onClick={scrollToTop}
                className={`w-8 h-8 border ${
                  isLight
                    ? "border-black/10 text-black/40 hover:text-black hover:border-black"
                    : "border-white/10 text-white/40 hover:text-white hover:border-white"
                } flex items-center justify-center transition-all duration-300 group`}
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
