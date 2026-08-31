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
        <div className="flex items-center justify-between pb-3 border-b border-white/20 mb-4">
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white/50">
            Professional Practice (2019 — Present)
          </span>
          <Link
            href="/cv"
            className="group flex items-center gap-1 font-mono text-[10px] md:text-[11px] tracking-[0.2em] uppercase text-white hover:text-white/70 transition-colors"
          >
            Full CV Detail
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="divide-y divide-white/10">
          {experiences.map((exp, idx) => (
            <div
              key={`${exp.company}-${idx}`}
              className="py-5 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-6 items-baseline group hover:bg-white/[0.01] transition-colors"
            >
              {/* Period */}
              <div className="md:col-span-3 flex items-center gap-2">
                <span className="font-mono text-xs text-white/60 tracking-wider">
                  {exp.periodStart} — {exp.periodEnd}
                </span>
                {exp.isFreelancer && (
                  <span className="font-mono text-[9px] px-1.5 py-0.5 bg-white/10 text-white/70 uppercase">
                    Freelance
                  </span>
                )}
              </div>

              {/* Role & Company */}
              <div className="md:col-span-4 flex flex-col">
                <h4 className="font-serif text-lg text-white group-hover:text-white/80 transition-colors">
                  {exp.role}
                </h4>
                <span className="font-mono text-[11px] text-white/40 tracking-wider uppercase mt-0.5">
                  {exp.company}
                </span>
              </div>

              {/* Description & Key Projects */}
              <div className="md:col-span-5 flex flex-col gap-2">
                <p className="text-[13px] text-white/60 leading-relaxed font-sans">
                  {exp.description}
                </p>
                {exp.keyProjects && exp.keyProjects.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="font-mono text-[10px] text-white/30 uppercase">
                      Projects:
                    </span>
                    {exp.keyProjects.map((proj, pIdx) => (
                      <span
                        key={proj.name}
                        className="font-mono text-[11px] text-white/70"
                      >
                        {proj.slug ? (
                          <Link
                            href={`/work/${proj.slug}`}
                            scroll={false}
                            className="underline underline-offset-4 decoration-white/20 hover:decoration-white transition-colors"
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
        <div className="pb-3 border-b border-white/20 mb-4">
          <span className="font-mono text-[10px] md:text-[11px] tracking-[0.25em] uppercase text-white/50">
            Academic Background &amp; Degrees
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, idx) => (
            <div
              key={`${edu.school}-${idx}`}
              className="p-5 border border-white/10 bg-white/[0.01] flex flex-col justify-between gap-3"
            >
              <div>
                <span className="font-mono text-[10px] text-white/40 tracking-wider">
                  {edu.period}
                </span>
                <h4 className="font-serif text-lg text-white mt-1">
                  {edu.degree}
                </h4>
                <p className="font-sans text-xs text-white/60 mt-0.5">
                  {edu.school}
                </p>
              </div>
              {edu.note && (
                <div className="font-mono text-[10px] text-white/40 border-t border-white/5 pt-2 tracking-wider">
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
