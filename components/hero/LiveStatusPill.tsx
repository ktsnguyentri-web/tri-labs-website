"use client";

import React, { useState, useEffect } from "react";

export interface SaigonStatus {
  dotColor: string;
  text: string;
  isWorking: boolean;
}

export function getSaigonStatus(manualOverride?: string | null): SaigonStatus {
  if (manualOverride) {
    return {
      dotColor: "#10B981",
      text: manualOverride,
      isWorking: false,
    };
  }

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
      return { dotColor: "#E5E5E5", text: "SUNDAY — PERFECT DAY", isWorking: false };
    }
    if (weekday === "Sat") {
      return { dotColor: "#A3A3A3", text: "WEEKEND — OFF THE CLOCK", isWorking: false };
    }
    if (hour >= 8 && hour < 17) {
      return { dotColor: "#3B82F6", text: "SAIGON — AT WORK / 08–17", isWorking: true };
    }
    // Sau 17:00:
    return {
      dotColor: "#22C55E",
      text: "SAIGON — RELAXING, THINKING ABOUT SOMETHING",
      isWorking: false,
    };
  } catch {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const vnTime = new Date(utc + 3600000 * 7);
    const day = vnTime.getDay();
    const hour = vnTime.getHours();

    if (day === 0) {
      return { dotColor: "#E5E5E5", text: "SUNDAY — PERFECT DAY", isWorking: false };
    }
    if (day === 6) {
      return { dotColor: "#A3A3A3", text: "WEEKEND — OFF THE CLOCK", isWorking: false };
    }
    if (hour >= 8 && hour < 17) {
      return { dotColor: "#3B82F6", text: "SAIGON — AT WORK / 08–17", isWorking: true };
    }
    return {
      dotColor: "#22C55E",
      text: "SAIGON — RELAXING, THINKING ABOUT SOMETHING",
      isWorking: false,
    };
  }
}

interface LiveStatusPillProps {
  manualStatus?: string | null;
  className?: string;
}

export function LiveStatusPill({ manualStatus, className = "" }: LiveStatusPillProps) {
  const [status, setStatus] = useState(() => getSaigonStatus(manualStatus));

  useEffect(() => {
    setStatus(getSaigonStatus(manualStatus));
    const interval = setInterval(() => {
      setStatus(getSaigonStatus(manualStatus));
    }, 30000);
    return () => clearInterval(interval);
  }, [manualStatus]);

  return (
    <div
      suppressHydrationWarning
      className={`inline-flex items-center gap-2 font-mono text-xs text-neutral-400 tracking-wider select-none ${className}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0"
        style={{ backgroundColor: status.dotColor }}
        aria-hidden="true"
      />
      <span className="sr-only">● </span>
      <span>{status.text}</span>
    </div>
  );
}
