"use client";

import { Mail, ExternalLink, ArrowRight, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Contact() {
  return (
    <section 
      className="w-full bg-background pt-12 pb-8 px-[5vw] scroll-mt-[60px]" 
      id="contact"
    >
      {/* Hero Contact Area */}
      <div className="relative w-full max-w-[1440px] mx-auto h-[600px] md:h-[800px] rounded-[24px] overflow-hidden group mb-16">
        {/* Background Image */}
        <Image
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          alt="Architectural background"
          fill
          className="object-cover rounded-[24px] transition-transform duration-1000 group-hover:scale-105"
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 rounded-[24px] bg-black/40 backdrop-blur-[2px] transition-colors group-hover:bg-black/50" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 gap-10">
          
          {/* Quick Links (Left - Desktop only) */}
          <div className="absolute left-16 bottom-16 hidden lg:flex flex-col gap-5 text-left">
            {[
              { label: 'About', href: '/#about' },
              { label: 'Research & Insights', href: '/research' },
              { label: 'Work', href: '/work' },
              { label: 'CV', href: '/cv' }
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors label-caps"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <h2 className="text-display-xl text-white leading-[1.1] max-w-4xl">
            Let&apos;s build<br />something together
          </h2>

          
          <Button 
            asChild 
            className="bg-white text-black hover:bg-white/90 px-10 py-6 rounded-full text-lg md:text-xl font-medium tracking-normal h-auto gap-3"
          >
            <a href="mailto:hello@tri-labs.com">
              hello@tri-labs.com
              <ArrowRight className="w-5 h-5 shrink-0" strokeWidth={2.5} />
            </a>
          </Button>
        </div>
      </div>


      {/* Footer Area */}
      <div className="w-full max-w-[1440px] mx-auto border-t border-border pt-12">
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
    </section>
  );
}
