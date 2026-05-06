"use client";

import { Mail, ExternalLink, ArrowRight, Link2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Contact() {
  const currentYear = new Date().getFullYear();
  
  return (
    <section 
      className="w-full bg-background pt-12 pb-0 scroll-mt-[60px]" 
      id="contact"
    >
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="flex flex-col gap-6 border-t border-white/10 pt-10 pb-10">
          
          {/* Top Row: Brand & Socials */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <h2 className="text-[24px] md:text-[32px] font-light tracking-tight text-white leading-none">
              Tri Labs
            </h2>

            <div className="flex items-center gap-3">
              {[
                { icon: <ExternalLink className="w-4 h-4" />, label: "LinkedIn" },
                { icon: <Link2 className="w-4 h-4" />, label: "Instagram" },
                { icon: <Mail className="w-4 h-4" />, label: "Email" },
                { icon: <ArrowRight className="w-4 h-4" />, label: "X" },
              ].map((social, i) => (
                <a 
                  key={i}
                  href="#" 
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-white hover:border-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Row: Links & Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 leading-none">
            <div className="flex flex-wrap gap-x-8 gap-y-4">
              {[
                { label: "Info", href: "/cv" },
                { label: "Projects", href: "/work" },
                { label: "Research & Insights", href: "/research" },
                { label: "Gallery", href: "#" },
                { label: "Contact", href: "/#contact" },
              ].map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  className="text-[12px] font-sans text-white/40 hover:text-white underline decoration-white/20 hover:decoration-white underline-offset-4 transition-all duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-6 text-[12px] font-sans text-white/40 whitespace-nowrap">
              <span className="underline decoration-white/20 underline-offset-4 cursor-pointer hover:text-white transition-colors duration-300">Site by Tri Nguyen Minh</span>
              <span>© {currentYear}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
