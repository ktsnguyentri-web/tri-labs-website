"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";

const STAGGER_DELAY = 0.12;

export function CVSection() {
  const experiences = [
    {
      period: "2020 — PRES.",
      role: "Founder & Principal Architect",
      company: "TRI NGUYEN Studio, Ho Chi Minh City",
      description: "Leading a studio focused on experimental architectural forms and custom BIM plugins. We integrate generative design with traditional craft to create high-performance structures."
    },
    {
      period: "2015 — 2020",
      role: "Senior Associate / Lead Designer",
      company: "Global Design Partners, London / HK",
      description: "Headed the Computational Design Group. Focused on parametric façade systems for high-rise residential towers and cultural institutions."
    },
    {
      period: "2013 — 2015",
      role: "Architectural Designer",
      company: "Format & Scale, New York",
      description: "Implemented BIM workflows for complex geometry projects. Specialized in environmental simulation and sustainable material analysis."
    }
  ];

  const education = [
    {
      period: "2011 — 2013",
      degree: "M.Arch II",
      school: "Graduate School of Design, Harvard University",
      note: "Thesis: Adaptive High-Rise Envelopes"
    },
    {
      period: "2006 — 2011",
      degree: "Bachelor of Architecture",
      school: "Southern California Institute of Architecture (SCI-Arc)",
      note: "Honours Graduate"
    }
  ];

  const toolkits = [
    {
      module: "Design",
      tools: ["Rhino / Grasshopper", "Revit / BIM", "Maya", "Adobe Suite", "SketchUp", "AutoCAD"]
    },
    {
      module: "Code",
      tools: ["React / Next.js", "Three.js / WebGL", "Python", "Unreal Engine 5", "Dynamo", "Blender"]
    }
  ];

  return (
    <section className="bg-background scroll-mt-[60px]" id="cv-section">
      {/* INTRO BLOCK — full bleed above the central column */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-10 pt-20 pb-24">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-24">
          {/* Left: Avatar */}
          <Reveal delay={0.1}>
            <div className="w-full md:w-[380px] shrink-0">
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#1A1A1A]">
                <Image
                  src="/portrait.jpg"
                  alt="Tri Nguyen Minh Portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 380px"
                  priority
                />
              </div>
            </div>
          </Reveal>

          {/* Right: Identity */}
          <div className="flex flex-col justify-center gap-8 max-w-xl">
            <Reveal delay={0.2}>
              <h1 className="text-[80px] md:text-[120px] font-light tracking-tighter text-white leading-none">
                about.
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-[20px] md:text-[22px] text-white/80 font-light leading-snug">
                I'm an architectural designer and creative coder based in Ho Chi Minh City, Vietnam.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="text-base text-white/50 leading-relaxed">
                Since 2013, I've enjoyed turning complex spatial problems into simple, beautiful and intuitive architectural solutions. When I'm not pushing pixels or drafting forms, you'll find me exploring the intersection of BIM and creative technology.
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="sm" variant="outline" className="text-[10px] h-9 px-6 border-white/20 hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                  Download Full CV
                </Button>
                <Button size="sm" variant="outline" className="text-[10px] h-9 px-6 border-white/20 hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                  Get in Touch
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── CENTRAL COLUMN ───────────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-6 pb-32 flex flex-col gap-28">

        {/* 1. MY JOURNEY */}
        <div>
          <Reveal>
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">01</span>
              <h2 className="text-[28px] font-light tracking-tight text-white uppercase border-b border-white/10 pb-3 flex-1">
                My Journey
              </h2>
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div className="absolute left-[80px] top-0 bottom-0 w-px bg-white/5 hidden md:block" />

            {experiences.map((exp, i) => (
              <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                <div className="flex flex-col md:flex-row gap-4 md:gap-10 relative pb-14">
                  {/* Date pill */}
                  <div className="md:w-[80px] shrink-0 pt-1">
                    <span className="font-mono text-[10px] text-white/25 tracking-[0.1em] leading-tight block">{exp.period}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 md:pl-8">
                    {/* Dot on timeline */}
                    <div className="hidden md:block absolute left-[78px] top-[6px] w-[5px] h-[5px] rounded-full bg-white/30" />
                    <h3 className="text-xl font-medium text-white mb-1 leading-snug">{exp.role}</h3>
                    <p className="font-mono text-[11px] text-white/40 uppercase tracking-[0.1em] mb-4">{exp.company}</p>
                    <p className="text-base text-white/40 leading-relaxed">{exp.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 2. MY TOOLKIT */}
        <div>
          <Reveal>
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">02</span>
              <h2 className="text-[28px] font-light tracking-tight text-white uppercase border-b border-white/10 pb-3 flex-1">
                My Toolkit
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {toolkits.map((tk, i) => (
              <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                <div className="border border-white/5 p-8 flex flex-col gap-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 border-l border-white/10 pl-4">{tk.module}</p>
                  <ul className="flex flex-col gap-3">
                    {tk.tools.map((tool, j) => (
                      <li key={j} className="text-[17px] font-light text-white/60 flex items-center gap-3">
                        <span className="w-1.5 h-px bg-white/20 shrink-0" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* 3. FOUNDATIONS */}
        <div>
          <Reveal>
            <div className="flex items-center gap-4 mb-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20">03</span>
              <h2 className="text-[28px] font-light tracking-tight text-white uppercase border-b border-white/10 pb-3 flex-1">
                Foundations
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-12">
            {education.map((edu, i) => (
              <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                  <div className="md:w-[80px] shrink-0 pt-1">
                    <span className="font-mono text-[10px] text-white/25 tracking-[0.1em] leading-tight block">{edu.period}</span>
                  </div>
                  <div className="flex-1 md:pl-8">
                    <h3 className="text-xl font-medium text-white mb-1">{edu.degree}</h3>
                    <p className="text-base text-white/60 mb-2">{edu.school}</p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/25">{edu.note}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

      </div>
      {/* ── END CENTRAL COLUMN ───────────────────────────────────────── */}
    </section>
  );
}
