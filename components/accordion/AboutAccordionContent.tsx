"use client";

import type { PersonalProfile, ToolkitModule } from "@/types/cms";
import { ArrowUpRight } from "lucide-react";
import { LiveStatusPill } from "@/components/hero/LiveStatusPill";

interface AboutAccordionContentProps {
  profile: PersonalProfile;
  toolkits: ToolkitModule[];
}

export function AboutAccordionContent({
  profile,
  toolkits,
}: AboutAccordionContentProps) {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-2">
      {/* ── Left Column: Narrative Bio (7 cols) ────────────────────── */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="pb-3 border-b border-white/20">
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white/50">
            Statement &amp; Approach
          </span>
        </div>

        <p className="font-serif text-xl sm:text-2xl text-white/90 leading-snug">
          &ldquo;{profile.tagline}&rdquo;
        </p>

        <div className="flex flex-col gap-4 text-[14px] md:text-[15px] text-white/70 font-sans leading-relaxed">
          {profile.bioParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Live Status Pill */}
        <div className="mt-4">
          <LiveStatusPill manualStatus={profile.status.manualOverride} />
        </div>
      </div>

      {/* ── Right Column: Toolkit & Contact (5 cols) ───────────────── */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        {/* Toolkits */}
        <div className="flex flex-col gap-4">
          <div className="pb-3 border-b border-white/20">
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white/50">
              Technical Arsenal
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {toolkits.map((mod) => (
              <div key={mod.module} className="flex flex-col gap-2">
                <span className="font-mono text-[11px] text-white/40 uppercase tracking-widest">
                  {mod.module}
                </span>
                <div className="flex flex-wrap gap-2">
                  {mod.tools.map((tool) => (
                    <span
                      key={tool.name}
                      className="font-mono text-[11px] tracking-wide px-2.5 py-1 bg-white/[0.03] border border-white/10 text-white/80"
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Connect */}
        <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white/50">
            Direct Inquiries
          </span>
          <div className="flex flex-col gap-1 font-mono text-xs text-white/80">
            <a
              href={`mailto:${profile.contact.email}`}
              className="hover:text-white underline underline-offset-4 decoration-white/30 transition-colors"
            >
              {profile.contact.email}
            </a>
            <span className="text-white/40">{profile.contact.location}</span>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4 mt-2">
            {profile.contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 font-mono text-[11px] tracking-wider text-white/60 hover:text-white transition-colors"
              >
                {social.label}
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
