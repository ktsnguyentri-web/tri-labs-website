"use client";

import { useState } from "react";
import type { PersonalProfile, ToolkitModule, CareerExperience, EducationEntry } from "@/types/cms";
import { LiveStatusPill } from "@/components/hero/LiveStatusPill";
import { motion, AnimatePresence } from "framer-motion";

interface AboutAccordionContentProps {
  profile: PersonalProfile;
  toolkits: ToolkitModule[];
  experiences?: CareerExperience[];
  education?: EducationEntry[];
}

function calculateDuration(start: string, end: string): string {
  const monthMap: Record<string, number> = {
    JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
    JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11,
  };

  const parseDate = (str: string, isEnd = false) => {
    const clean = str.trim().toUpperCase().replace(/\./g, "");
    if (clean === "PRES" || clean === "PRESENT" || clean === "NOW") {
      return new Date();
    }
    const parts = clean.split(/\s+/);
    if (parts.length === 2 && monthMap[parts[0]] !== undefined) {
      const month = monthMap[parts[0]];
      const year = parseInt(parts[1], 10);
      return new Date(year, month, 1);
    }
    const yr = parseInt(clean, 10);
    if (!isNaN(yr)) {
      return new Date(yr, isEnd ? 11 : 0, 1);
    }
    return new Date();
  };

  try {
    const startDate = parseDate(start, false);
    const endDate = parseDate(end, true);

    let months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1;
    if (months < 1) months = 1;

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const parts: string[] = [];
    if (years > 0) {
      parts.push(`${years} ${years === 1 ? "year" : "years"}`);
    }
    if (remainingMonths > 0) {
      parts.push(`${remainingMonths} ${remainingMonths === 1 ? "month" : "months"}`);
    }
    return parts.join(" ") || "1 month";
  } catch {
    return `${start} — ${end}`;
  }
}

function ExperienceDurationBadge({ start, end }: { start: string; end: string }) {
  const [hovered, setHovered] = useState(false);
  const [duration, setDuration] = useState("");
  const dateRange = `${start} — ${end}`;

  const handleMouseEnter = () => {
    if (!duration) {
      setDuration(calculateDuration(start, end));
    }
    setHovered(true);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
      className="group/time relative inline-flex items-center justify-end font-mono text-[11px] cursor-pointer select-none py-0.5 px-1.5 -mr-1.5 rounded transition-colors"
      title="Hover to view duration"
    >
      <span className="relative overflow-hidden flex items-center justify-end">
        {/* Normal Date Range */}
        <span
          className={`transition-all duration-200 ease-out whitespace-nowrap text-neutral-400 dark:text-neutral-500 group-hover/time:text-neutral-900 dark:group-hover/time:text-neutral-100 ${
            hovered ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          {dateRange}
        </span>

        {/* Hover Duration */}
        <span
          className={`absolute inset-0 flex items-center justify-end font-mono font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap transition-all duration-200 ease-out ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
          }`}
        >
          {duration || calculateDuration(start, end)}
        </span>
      </span>
    </span>
  );
}

export function AboutAccordionContent({
  profile,
  toolkits,
  experiences,
  education,
}: AboutAccordionContentProps) {
  const [expOpen, setExpOpen] = useState(false);
  const [eduOpen, setEduOpen] = useState(false);

const defaultProficiencies: Record<string, number> = {
  AutoCAD: 95,
  Revit: 92,
  Rhino: 88,
  SketchUp: 96,
  "D5 Render": 90,
  "Adobe CC": 92,
  "Three.js": 85,
  "Next.js": 90,
  WebGL: 82,
};

function renderSocialIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes("youtube")) {
    return (
      <svg className="w-3.5 h-3.5 shrink-0 text-red-600 dark:text-red-500 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    );
  }
  if (l.includes("linkedin")) {
    return (
      <svg className="w-3.5 h-3.5 shrink-0 text-[#0A66C2] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }
  if (l.includes("github")) {
    return (
      <svg className="w-3.5 h-3.5 shrink-0 text-neutral-900 dark:text-neutral-100 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    );
  }
  if (l.includes("facebook")) {
    return (
      <svg className="w-3.5 h-3.5 shrink-0 text-[#1877F2] transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    );
  }
  return null;
}
  const defaultToolkits: ToolkitModule[] = [
    {
      module: "Architecture",
      tools: [
        { name: "AutoCAD", proficiency: 95, category: "primary" },
        { name: "Revit", proficiency: 92, category: "primary" },
        { name: "Rhino", proficiency: 88, category: "primary" },
        { name: "SketchUp", proficiency: 96, category: "primary" },
        { name: "D5 Render", proficiency: 90, category: "primary" },
        { name: "Adobe CC", proficiency: 92, category: "primary" },
      ],
    },
    {
      module: "Digital / Web",
      tools: [
        { name: "Three.js", proficiency: 85, category: "primary" },
        { name: "Next.js", proficiency: 90, category: "primary" },
        { name: "WebGL", proficiency: 82, category: "primary" },
      ],
    },
  ];

  const defaultExperiences: CareerExperience[] = [
    {
      periodStart: "JAN 2024",
      periodEnd: "PRES.",
      role: "Interior Architect",
      company: "Thien Phuoc Company",
      description: "",
    },
    {
      periodStart: "MAR 2022",
      periodEnd: "JAN 2024",
      role: "Concept Architect",
      company: "HTA+Pizzini Architects",
      description: "",
    },
    {
      periodStart: "FEB 2021",
      periodEnd: "FEB 2022",
      role: "Project Architect",
      company: "Studio Duo",
      description: "",
    },
    {
      periodStart: "AUG 2019",
      periodEnd: "DEC 2020",
      role: "Project Architect",
      company: "Philippe Pierga Design",
      description: "",
    },
    {
      periodStart: "APR 2021",
      periodEnd: "MAY 2023",
      role: "Freelance Architect",
      company: "DI+Architects",
      description: "",
    },
  ];

  const defaultEducation: EducationEntry[] = [
    {
      period: "2013 — 2018",
      degree: "Bachelor of Architecture",
      school: "University of Architecture Ho Chi Minh City (UAH)",
    },
  ];

  const activeToolkits = toolkits && toolkits.length > 0 ? toolkits : defaultToolkits;
  const activeExperiences = experiences && experiences.length > 0 ? experiences : defaultExperiences;
  const activeEducation = education && education.length > 0 ? education : defaultEducation;

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-2 pb-2">
      {/* ── Left Column: Narrative Bio, Focus, Experience, Education & Status (7 cols) ── */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <h3 className="font-sans text-lg sm:text-xl font-medium text-neutral-900 dark:text-[#EDEDED] leading-snug">
          &ldquo;I design buildings. I also build tools for designing them.&rdquo;
        </h3>

        <div className="flex flex-col gap-3 text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
          <p>
            Architect based in Saigon with 8+ years of experience in residential architecture and façade design.
          </p>
          <p>
            Along the way, I build small web and 3D tools around problems I encounter in practice—making design work clearer, faster, and more interactive.
          </p>
        </div>

        {/* WORK EXPERIENCE */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-1">
          <button
            type="button"
            onClick={() => setExpOpen((prev) => !prev)}
            className="inline-flex items-center gap-2.5 py-2.5 text-left group cursor-pointer select-none transition-colors"
            aria-expanded={expOpen}
          >
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
              WORK EXPERIENCE
            </span>
            <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
              {expOpen ? "−" : "+"}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {expOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-2.5 pb-3 flex flex-col gap-4 font-mono text-xs">
                  {activeExperiences.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-sans font-medium text-[13px] text-neutral-900 dark:text-neutral-100 tracking-tight">
                          {item.company}
                        </span>
                        <ExperienceDurationBadge start={item.periodStart} end={item.periodEnd} />
                      </div>
                      <div className="text-neutral-500 dark:text-neutral-400 text-xs font-mono">
                        {item.role}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* EDUCATION */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-1">
          <button
            type="button"
            onClick={() => setEduOpen((prev) => !prev)}
            className="inline-flex items-center gap-2.5 py-2.5 text-left group cursor-pointer select-none transition-colors"
            aria-expanded={eduOpen}
          >
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">
              EDUCATION
            </span>
            <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-800 dark:group-hover:text-neutral-200 transition-colors">
              {eduOpen ? "−" : "+"}
            </span>
          </button>

          <AnimatePresence initial={false}>
            {eduOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <div className="pt-2.5 pb-3 flex flex-col gap-3.5 font-mono text-xs">
                  {activeEducation.map((item, idx) => (
                    <div key={idx} className="flex flex-col gap-0.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-sans font-medium text-[13px] text-neutral-900 dark:text-neutral-100 tracking-tight">
                          {item.degree}
                        </span>
                        <span className="text-neutral-400 dark:text-neutral-500 text-[11px] shrink-0 font-mono">
                          {item.period}
                        </span>
                      </div>
                      <div className="text-neutral-500 dark:text-neutral-400 text-xs font-mono">
                        {item.school}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dynamic Status Dot / Sunday Status (Final personal note in left column) */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <LiveStatusPill manualStatus={profile?.status?.manualOverride} />
        </div>
      </div>

      {/* ── Right Column: TOOLS & CONTACT (5 cols) ─────────────────── */}
      <div className="lg:col-span-5 flex flex-col gap-8 lg:-mt-6">
        {/* TOOLS */}
        <div className="flex flex-col gap-4">
          <div className="pb-2.5 border-b border-neutral-200 dark:border-neutral-800">
            <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              TOOLS
            </span>
          </div>

          <div className="flex flex-col gap-5">
            {activeToolkits.map((mod) => (
              <div key={mod.module} className="flex flex-col gap-2.5">
                <span className="font-mono text-xs text-neutral-400 dark:text-neutral-500 tracking-normal">
                  {mod.module}
                </span>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {mod.tools.map((tool) => {
                    const prof = tool.proficiency || defaultProficiencies[tool.name] || 85;
                    return (
                      <div key={tool.name} className="relative group/tool inline-block">
                        <div
                          className="relative font-mono text-xs px-3 py-1.5 rounded-full border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover/tool:border-neutral-900 dark:group-hover/tool:border-neutral-100 group-hover/tool:text-neutral-900 dark:group-hover/tool:text-white transition-all duration-200 cursor-default select-none bg-neutral-100/40 dark:bg-neutral-900/40 overflow-hidden"
                        >
                          <span className="relative z-10">{tool.name}</span>
                          {/* Subtle accent progress line at bottom of pill */}
                          <span
                            className="absolute bottom-0 left-0 h-[2px] bg-neutral-900 dark:bg-neutral-100 opacity-0 group-hover/tool:opacity-100 transition-all duration-300 ease-out"
                            style={{ width: `${prof}%` }}
                          />
                        </div>

                        {/* Floating Proficiency Bar Tooltip on Hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 pointer-events-none opacity-0 group-hover/tool:opacity-100 -translate-y-0.5 group-hover/tool:-translate-y-1.5 transition-all duration-200 ease-out z-30 min-w-[130px] bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-700/80 rounded-lg p-2.5 shadow-xl shadow-black/10 dark:shadow-black/60">
                          <div className="flex items-center justify-between gap-3 mb-1.5 font-mono text-[10px]">
                            <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-[9px]">Proficiency</span>
                            <span className="font-semibold text-neutral-900 dark:text-neutral-100">{prof}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-neutral-900 dark:bg-neutral-100 rounded-full transition-all duration-500 ease-out"
                              style={{ width: `${prof}%` }}
                            />
                          </div>
                          {/* Downward triangle arrow */}
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-[#141414] border-b border-r border-neutral-200 dark:border-neutral-700/80 rotate-45" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <div className="flex flex-col gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            CONTACT
          </span>
          <div className="flex flex-col gap-1 font-mono text-[12px] text-neutral-700 dark:text-neutral-300">
            <a
              href={`mailto:${profile?.contact?.email || "kts.nguyentri@gmail.com"}`}
              className="hover:text-black dark:hover:text-white underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 transition-colors"
            >
              {profile?.contact?.email || "kts.nguyentri@gmail.com"}
            </a>
            <span className="text-neutral-400 dark:text-neutral-500">
              {profile?.contact?.location || "Saigon, Vietnam (UTC+7)"}
            </span>
          </div>

          {/* Modern Social Badges */}
          <div className="flex flex-wrap gap-2.5 mt-2">
            {profile?.contact?.socials?.map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-600 font-mono text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-all duration-200 cursor-pointer shadow-xs active:scale-95"
              >
                {renderSocialIcon(social.label)}
                <span>{social.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
