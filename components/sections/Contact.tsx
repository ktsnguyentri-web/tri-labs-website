"use client";

import { Mail, ExternalLink, ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Contact() {
  return (
    <section 
      className="w-full bg-background pt-16 pb-8 scroll-mt-[60px]" 
      id="contact"
    >

      {/* Footer Area */}
      <div className="w-full max-w-[1440px] mx-auto px-10">
        <div className="border-t border-border pt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10 md:gap-0">
          
          {/* Logo */}
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-2xl font-bold tracking-[0.2em] text-foreground">
              TRI LABS
            </Link>
            <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
              Architectural Excellence
            </p>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-left">
            <p className="font-sans text-[13px] text-muted-foreground tracking-tight">
              © 2026 Tri Nguyen Minh. All rights reserved.
            </p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-2 border border-transparent hover:border-border rounded-full">
              <ExternalLink className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-2 border border-transparent hover:border-border rounded-full">
              <Link2 className="w-5 h-5" />
            </a>
            <a href="mailto:hello@tri-labs.com" className="text-muted-foreground hover:text-foreground transition-colors p-2 border border-transparent hover:border-border rounded-full">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
}
