"use client";

import Link from "next/link";
import type { CareerExperience, EducationEntry } from "@/types/cms";
import { ArrowUpRight } from "lucide-react";

interface CareerAccordionContentProps {
  experiences: CareerExperience[];
  education: EducationEntry[];
}

export function CareerAccordionContent({
  experiences,
  education,
}: CareerAccordionContentProps) {
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 flex flex-col gap-12 md:gap-16 pt-2">
      {/* ── Experience Timeline Table ────────────────────────────── */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-4">
          <span className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 tracking-normal">
            Professional Practice (2019 — Present)
          </span>
          <Link
            href="/cv"
            className="group flex items-center gap-1 font-mono text-[12px] text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors"
          >
            Full CV Detail
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
          {experiences.map((exp, idx) => (
            <div
              key={`${exp.company}-${idx}`}
              className="py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline group hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors"
            >
              {/* Period */}
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 tracking-normal">
                  {exp.periodStart} — {exp.periodEnd}
                </span>
                {exp.isFreelancer && (
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-sm">
                    Freelance
                  </span>
                )}
              </div>

              {/* Role & Company */}
              <div className="md:col-span-4 flex flex-col">
                <h4 className="font-sans font-medium text-base text-neutral-900 dark:text-[#EDEDED] group-hover:text-black dark:group-hover:text-white transition-colors">
                  {exp.role}
                </h4>
                <span className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 tracking-normal mt-0.5">
                  {exp.company}
                </span>
              </div>

              {/* Description & Key Projects */}
              <div className="md:col-span-5 flex flex-col gap-2">
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-sans">
                  {exp.description}
                </p>
                {exp.keyProjects && exp.keyProjects.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500">
                      Projects:
                    </span>
                    {exp.keyProjects.map((proj, pIdx) => (
                      <span
                        key={proj.name}
                        className="font-mono text-[12px] text-neutral-700 dark:text-neutral-300"
                      >
                        {proj.slug ? (
                          <Link
                            href={`/work/${proj.slug}`}
                            scroll={false}
                            className="underline underline-offset-4 decoration-neutral-300 dark:decoration-neutral-700 hover:decoration-neutral-900 dark:hover:decoration-white transition-colors"
                          >
                            {proj.name}
                          </Link>
                        ) : (
                          proj.name
                        )}
                        {pIdx < (exp.keyProjects?.length ?? 0) - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Education & Degrees ─────────────────────────────────── */}
      <div className="flex flex-col">
        <div className="pb-3 border-b border-neutral-200 dark:border-neutral-800 mb-4">
          <span className="font-mono text-[12px] text-neutral-500 dark:text-neutral-400 tracking-normal">
            Academic Background &amp; Degrees
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, idx) => (
            <div
              key={`${edu.school}-${idx}`}
              className="p-5 border border-neutral-200 dark:border-neutral-800 bg-black/[0.01] dark:bg-white/[0.01] flex flex-col justify-between gap-3 rounded-sm"
            >
              <div>
                <span className="font-mono text-[12px] text-neutral-400 dark:text-neutral-500 tracking-normal">
                  {edu.period}
                </span>
                <h4 className="font-sans font-medium text-base text-neutral-900 dark:text-[#EDEDED] mt-1">
                  {edu.degree}
                </h4>
                <p className="font-sans text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {edu.school}
                </p>
              </div>
              {edu.note && (
                <div className="font-mono text-[11px] text-neutral-400 dark:text-neutral-500 border-t border-neutral-200 dark:border-neutral-800/60 pt-2">
                  {edu.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
