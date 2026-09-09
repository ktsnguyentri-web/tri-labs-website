"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PersonalProfile } from "@/types/cms";

interface HeroPersonalProps {
  profile: PersonalProfile;
}

function getSaigonStatus() {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      weekday: "short",
      hour: "numeric",
      hourCycle: "h23",
    }).formatToParts(now);

    const weekday = parts.find((p) => p.type === "weekday")?.value;
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);

    if (weekday === "Sun") {
      return { dotColor: "#E5E5E5", text: "SUNDAY — PERFECT DAY" };
    }
    if (weekday === "Sat") {
      return { dotColor: "#A3A3A3", text: "WEEKEND — OFF THE CLOCK" };
    }
    if (hour >= 8 && hour < 17) {
      return { dotColor: "#3B82F6", text: "SAIGON — AT WORK / 08–17" };
    }
    return { dotColor: "#22C55E", text: "SAIGON — FREE HOURS / OPEN TO IDEAS" };
  } catch {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const vnTime = new Date(utc + 3600000 * 7);
    const day = vnTime.getDay();
    const hour = vnTime.getHours();

    if (day === 0) {
      return { dotColor: "#E5E5E5", text: "SUNDAY — PERFECT DAY" };
    }
    if (day === 6) {
      return { dotColor: "#A3A3A3", text: "WEEKEND — OFF THE CLOCK" };
    }
    if (hour >= 8 && hour < 17) {
      return { dotColor: "#3B82F6", text: "SAIGON — AT WORK / 08–17" };
    }
    return { dotColor: "#22C55E", text: "SAIGON — FREE HOURS / OPEN TO IDEAS" };
  }
}

export function HeroPersonal({ profile }: HeroPersonalProps) {
  const [status, setStatus] = useState(() => getSaigonStatus());

  useEffect(() => {
    setStatus(getSaigonStatus());
    const interval = setInterval(() => {
      setStatus(getSaigonStatus());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
              <div
                suppressHydrationWarning
                className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400 tracking-wider select-none"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
                  style={{ backgroundColor: status.dotColor }}
                  aria-hidden="true"
                />
                <span className="sr-only">● </span>
                <span>{status.text}</span>
              </div>
            </motion.div>

            {/* 2. Name */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-1"
            >
              <h1 className="font-sans font-medium text-3xl sm:text-4xl tracking-tight text-neutral-900 dark:text-neutral-100">
                {profile.name || "Tri Nguyen Minh"}
              </h1>
            </motion.div>

            {/* 3. Concise Bio Statement */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xl font-sans mt-3"
            >
              I design buildings, systems, and small tools for architects.
            </motion.p>
          </div>

          {/* ── Right Column: Circular Monochrome Avatar ─────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
