"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { LiveStatusPill } from "@/components/hero/LiveStatusPill";
import type { PersonalProfile } from "@/types/cms";

interface HeroPersonalProps {
  profile: PersonalProfile;
}

export function HeroPersonal({ profile }: HeroPersonalProps) {
  return (
    <section className="w-full pt-16 sm:pt-20 md:pt-22 pb-4 sm:pb-5">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 md:gap-8">
          {/* ── Left Column: Identity & Bio ──────────────────────────── */}
          <div className="flex-1 flex flex-col gap-3 sm:gap-3.5">
            {/* 1. Live Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center"
            >
              <LiveStatusPill manualStatus={profile.status.manualOverride} />
            </motion.div>

            {/* 2. Name & Role Tag */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-1"
            >
              <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] text-white tracking-tight font-light leading-[1.12]">
                {profile.name}
              </h1>
              <p className="font-mono text-[10px] sm:text-[11px] text-neutral-400 tracking-[0.2em] uppercase">
                {profile.title}
              </p>
            </motion.div>

            {/* 3. Concise Bio Statement */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-xs sm:text-sm text-neutral-400 font-sans font-light max-w-xl leading-relaxed"
            >
              {profile.tagline}
            </motion.p>

            {/* 4. Actionable CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 pt-0.5"
            >
              <Link
                href="/cv"
                className="inline-flex items-center gap-2 px-4 md:px-5 py-2.5 bg-white text-black font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-neutral-200 active:scale-[0.98] transition-all"
              >
                <FileText className="w-3.5 h-3.5" />
                View CV / Resume
              </Link>
            </motion.div>
          </div>

          {/* ── Right Column: Circular Monochrome Avatar ─────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 self-start sm:self-center"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden group">
              <Image
                src="/portrait.jpeg"
                alt={profile.name}
                fill
                sizes="(max-width: 640px) 112px, 160px"
                className="object-cover object-top grayscale contrast-110 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
