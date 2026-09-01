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
        <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <span className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 tracking-normal">
            Statement &amp; Approach
          </span>
        </div>

        <p className="font-sans text-lg sm:text-xl font-normal text-neutral-900 dark:text-[#EDEDED] leading-snug">
          &ldquo;{profile.tagline}&rdquo;
        </p>

        <div className="flex flex-col gap-4 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
          {profile.bioParagraphs.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Live Status Pill */}
        <div className="mt-2">
          <LiveStatusPill manualStatus={profile.status.manualOverride} />
        </div>
      </div>

      {/* ── Right Column: Toolkit & Contact (5 cols) ───────────────── */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        {/* Toolkits */}
        <div className="flex flex-col gap-4">
          <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <span className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 tracking-normal">
              Technical Arsenal
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {toolkits.map((mod) => (
              <div key={mod.module} className="flex flex-col gap-2">
                <span className="font-mono text-[12px] text-neutral-400 dark:text-neutral-500 tracking-normal">
                  {mod.module}
                </span>
                <div className="flex flex-wrap gap-2">
                  {mod.tools.map((tool) => (
                    <span
                      key={tool.name}
                      className="font-mono text-[11px] px-2.5 py-1 bg-black/[0.02] dark:bg-white/[0.03] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-sm"
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
        <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <span className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 tracking-normal">
            Direct Inquiries
          </span>
          <div className="flex flex-col gap-1 font-mono text-[12px] text-neutral-700 dark:text-neutral-300">
            <a
              href={`mailto:${profile.contact.email}`}
              className="hover:text-black dark:hover:text-white underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 transition-colors"
            >
              {profile.contact.email}
            </a>
            <span className="text-neutral-400 dark:text-neutral-500">{profile.contact.location}</span>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4 mt-2">
            {profile.contact.socials.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1 font-mono text-[12px] text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
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
