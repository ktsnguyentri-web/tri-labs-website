"use client";

import Image from "next/image";
import { motion } from "framer-motion";
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
          <div className="flex-1 flex flex-col items-start gap-4">
            {/* 1. Live Status Pill */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex items-center"
            >
              <LiveStatusPill manualStatus={profile.status.manualOverride} />
            </motion.div>

            {/* 2. Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-1"
            >
              <h1 className="font-sans font-semibold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-100 tracking-tight leading-[1.2]">
                {profile.name}
              </h1>
            </motion.div>

            {/* 3. Concise Bio Statement */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-base text-neutral-600 dark:text-neutral-400 font-sans font-normal max-w-xl leading-relaxed"
            >
              {profile.tagline}
            </motion.p>
          </div>

          {/* ── Right Column: Circular Monochrome Avatar ─────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 self-start sm:self-center"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden group border border-neutral-200 dark:border-neutral-800">
              <Image
                src="/portrait.jpeg"
                alt={profile.name}
                fill
                sizes="(max-width: 640px) 96px, 112px"
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
