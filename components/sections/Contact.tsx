"use client";

import { Mail, ExternalLink, ArrowRight, Link2, ArrowUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../layout/Logo";

export function Contact() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <section 
      className="w-full bg-background pt-10 pb-0 scroll-mt-[60px]" 
      id="contact"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="border-t border-white/10 pt-10 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <Logo className="text-white" />
            
            <div className="flex items-center gap-8 text-[12px] font-sans text-white/40 whitespace-nowrap leading-none">
              <div className="flex items-center gap-6">
                <span className="no-underline hover:underline decoration-white/20 underline-offset-4 cursor-pointer hover:text-white transition-colors duration-300">Site by Tri Nguyen Minh</span>
                <span>© {currentYear}</span>
              </div>

              {/* Back to Top Arrow */}
              <button
                onClick={scrollToTop}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all duration-300 group"
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
