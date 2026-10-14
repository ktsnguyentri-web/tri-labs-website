"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PersonalProfile } from "@/types/cms";
import { LiveStatusPill } from "@/components/hero/LiveStatusPill";
import { usePreloader } from "@/lib/preloader-context";

interface HeroPersonalProps {
  profile: PersonalProfile;
}

export function HeroPersonal({ profile }: HeroPersonalProps) {
  const { isDocked, hasLoadedBefore } = usePreloader();

  return (
    <section className="w-full pt-16 sm:pt-20 md:pt-22 pb-4 sm:pb-5">
      <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6 md:gap-8">
          {/* ── Left Column: Identity & Bio ──────────────────────────── */}
          <div className="flex-1 flex flex-col items-start">
            {/* 1. Live Status Pill */}
            <motion.div
              initial={hasLoadedBefore ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: isDocked ? 1 : 0, y: isDocked ? 0 : 10 }}
              transition={{
                duration: 0.5,
                delay: hasLoadedBefore ? 0 : 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex items-center mb-3"
            >
              <LiveStatusPill
                manualStatus={profile?.status?.manualOverride}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-neutral-500 dark:text-[#787672]"
              />
            </motion.div>

            {/* 2. Name & Title */}
            <motion.div
              initial={hasLoadedBefore ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: isDocked ? 1 : 0, y: isDocked ? 0 : 10 }}
              transition={{
                duration: 0.5,
                delay: hasLoadedBefore ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-col"
            >
              <h1 className="font-sans font-normal text-3xl sm:text-[36px] tracking-[-0.025em] leading-[1.15] text-neutral-900 dark:text-[#EAE8E1]">
                {profile.name || "Tri Nguyen Minh"}
              </h1>
              <p className="font-mono text-[13px] tracking-[-0.01em] text-neutral-600 dark:text-[#B5B3AD] mt-1.5">
                {profile?.title || "Architect · Tinkerer"}
              </p>
            </motion.div>

            {/* 3. Personal Motto */}
            <motion.p
              initial={hasLoadedBefore ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: isDocked ? 1 : 0, y: isDocked ? 0 : 10 }}
              transition={{
                duration: 0.5,
                delay: hasLoadedBefore ? 0 : 0.26,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-sans font-normal text-[15px] leading-relaxed text-neutral-500 dark:text-[#787672] mt-5 max-w-xl"
            >
              &ldquo;Do what you love. Love what you do.&rdquo;
            </motion.p>
          </div>

          {/* ── Right Column: Circular Monochrome Avatar ─────────────── */}
          <motion.div
            initial={hasLoadedBefore ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: isDocked ? 1 : 0, y: isDocked ? 0 : 10 }}
            transition={{
              duration: 0.5,
              delay: hasLoadedBefore ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-shrink-0 self-start sm:self-center"
          >
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800">
              <Image
                src="/portrait.jpeg"
                alt={profile.name || "Tri Nguyen Minh"}
                fill
                sizes="(max-width: 640px) 96px, 112px"
                className="object-cover object-top grayscale"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
