"use client";

import React, { useState, useEffect } from "react";

interface LiveStatusPillProps {
  manualStatus?: string | null;
  className?: string;
}

export function LiveStatusPill({ manualStatus, className = "" }: LiveStatusPillProps) {
  const [mounted, setMounted] = useState(false);
  const [saigonTime, setSaigonTime] = useState<string>("");
  const [isWorkingHours, setIsWorkingHours] = useState<boolean>(false);
  const [isSunday, setIsSunday] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    const updateStatus = () => {
      try {
        const now = new Date();

        // Extract hour, minute, and day in Asia/Ho_Chi_Minh (UTC+7)
        const hourFormatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "numeric",
          hour12: false,
        });
        const timeFormatter = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Ho_Chi_Minh",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Ho_Chi_Minh",
          weekday: "short",
        });

        const hour = parseInt(hourFormatter.format(now), 10);
        const weekday = weekdayFormatter.format(now);
        setSaigonTime(timeFormatter.format(now));

        setIsSunday(weekday === "Sun");
        // Working hours: 08:00 to 16:59 on non-Sunday
        setIsWorkingHours(hour >= 8 && hour < 17 && weekday !== "Sun");
      } catch {
        // Fallback calculation using UTC+7 offset
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const vnTime = new Date(utc + 3600000 * 7);
        const hour = vnTime.getHours();
        const minutes = String(vnTime.getMinutes()).padStart(2, "0");
        const hours = String(hour).padStart(2, "0");
        const day = vnTime.getDay();
        setSaigonTime(`${hours}:${minutes}`);
        setIsSunday(day === 0);
        setIsWorkingHours(hour >= 8 && hour < 17 && day !== 0);
      }
    };

    updateStatus();
    // Update every minute (60,000 ms)
    const interval = setInterval(updateStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  // SSR Skeleton / Hydration Guard
  if (!mounted) {
    return (
      <div
        className={`inline-flex items-center gap-2 font-mono text-[12px] tracking-normal text-neutral-400 dark:text-neutral-500 select-none ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 animate-pulse" />
        <span>SAIGON (UTC+7) — INITIALIZING STATUS...</span>
      </div>
    );
  }

  // 1. Manual Override Status (if provided)
  if (manualStatus) {
    return (
      <div
        className={`inline-flex items-center gap-2 font-mono text-[12px] tracking-normal text-neutral-700 dark:text-neutral-300 select-none ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="text-neutral-400 dark:text-neutral-500">[{saigonTime} SGN]</span>
        <span>{manualStatus}</span>
      </div>
    );
  }

  // 2. Sunday Rule (UTC+7)
  if (isSunday) {
    return (
      <div
        className={`inline-flex flex-wrap items-center gap-2 font-mono text-[12px] tracking-normal select-none ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0" />
        <span className="text-neutral-400 dark:text-neutral-500 flex-shrink-0">[{saigonTime} SGN]</span>
        <span className="text-neutral-700 dark:text-neutral-300">
          SUNDAY — TOUCHING GRASS / NO CAD, NO DEADLINES
        </span>
      </div>
    );
  }

  // 3. Automatic Weekday Time-based Status
  return (
    <div
      className={`inline-flex flex-wrap items-center gap-2 font-mono text-[12px] tracking-normal select-none ${className}`}
    >
      {isWorkingHours ? (
        <>
          {/* Active Work Mode: Glowing Green Dot */}
          <span className="relative flex h-2 w-2 flex-shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-neutral-400 dark:text-neutral-500 flex-shrink-0">[{saigonTime} SGN]</span>
          <span className="text-neutral-700 dark:text-neutral-300 font-medium">
            AT WORK (8:00 – 17:00) — ONLY AVAILABLE FOR COFFEE &amp; EMERGENCIES
          </span>
        </>
      ) : (
        <>
          {/* Night / Lab Mode: Muted Dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-500 flex-shrink-0" />
          <span className="text-neutral-400 dark:text-neutral-500 flex-shrink-0">[{saigonTime} SGN]</span>
          <span className="text-neutral-600 dark:text-neutral-400">
            AFTER 17:00 — ARCHITECTURE MODE OFF, LAB MODE ON
          </span>
        </>
      )}
    </div>
  );
}
