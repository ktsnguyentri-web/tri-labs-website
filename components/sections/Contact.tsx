"use client";

import { Mail, ExternalLink, ArrowRight, Link2, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../layout/Logo";

export function Contact({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const isLight = theme === "light";
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <section 
      className={`w-full ${isLight ? "bg-white" : "bg-black"} pt-20 pb-0 scroll-mt-[60px]`} 
      id="contact"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className={`border-t ${isLight ? "border-black/10" : "border-white/10"} pt-8 pb-8`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <Logo className={isLight ? "text-black" : "text-white"} />
            
            <div className={`flex items-center gap-8 text-[12px] font-sans ${isLight ? "text-black/40" : "text-white/40"} whitespace-nowrap leading-none`}>
              <div className="flex items-center gap-6">
                <span className={`no-underline hover:underline ${isLight ? "decoration-black/20 hover:text-black" : "decoration-white/20 hover:text-white"} underline-offset-4 cursor-pointer transition-colors duration-300`}>Site by Tri Nguyen Minh</span>
                <span>© {currentYear}</span>
              </div>

              {/* Back to Top Arrow */}
              <button
                onClick={scrollToTop}
                className={`w-10 h-10 rounded-full border ${isLight ? "border-black/10 text-black/40 hover:text-black hover:border-black" : "border-white/10 text-white/40 hover:text-white hover:border-white"} flex items-center justify-center transition-all duration-300 group`}
                aria-label="Back to top"
              >
                <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
