"use client";

import { Mail, ExternalLink, ArrowRight, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Logo } from "../layout/Logo";

export function Contact() {
  const currentYear = new Date().getFullYear();
  
  return (
    <section 
      className="w-full bg-background pt-10 pb-0 scroll-mt-[60px]" 
      id="contact"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="border-t border-white/10 pt-10 pb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <Logo className="text-white" />
            
            <div className="flex items-center gap-6 text-[12px] font-sans text-white/40 whitespace-nowrap leading-none">
              <span className="no-underline hover:underline decoration-white/20 underline-offset-4 cursor-pointer hover:text-white transition-colors duration-300">Site by Tri Nguyen Minh</span>
              <span>© {currentYear}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
