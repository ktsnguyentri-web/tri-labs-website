"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";

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
      school: "Graduate School of Design, Harvard University"
    },
    {
      period: "2006 — 2011",
      degree: "Bachelor of Architecture",
      school: "Southern California Institute of Architecture (SCI-Arc)"
    }
  ];

  const skills = [
    { category: "Design", items: ["Rhino/Grasshopper", "Revit/BIM", "Maya", "Adobe Suite"] },
    { category: "Tech", items: ["React/Next.js", "Three.js", "Python", "Unreal Engine 5"] },
    { category: "Languages", items: ["English (Native)", "Vietnamese (Native)", "Mandarin (Basic)"] }
  ];

  return (
    <section className="bg-background py-20 w-full mx-auto relative scroll-mt-[60px]" id="cv-section">
      <div className="max-w-[1440px] mx-auto px-6 md:px-10">
        
        {/* TOP INTRO SECTION (Adham Style) */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-24 mb-32">
          {/* Left: Avatar */}
          <div className="w-full md:w-[40%]">
            <Reveal delay={0.2}>
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EEEEEE]">
                <Image
                  src="/portrait.jpg"
                  alt="Tri Nguyen Minh Portrait"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  priority
                />
              </div>
            </Reveal>
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-[60%] flex flex-col justify-center">
            <Reveal delay={0.3}>
              <h1 className="text-[80px] md:text-[140px] font-light tracking-tighter text-white leading-none mb-10">
                about.
              </h1>
              <div className="flex flex-col gap-8 max-w-xl">
                <p className="text-[20px] md:text-[24px] text-white/80 font-light leading-snug">
                  I'm an architectural designer and creative coder based in Ho Chi Minh City, Vietnam.
                </p>
                <p className="text-[16px] md:text-[18px] text-white/50 leading-relaxed">
                  Since 2013, I've enjoyed turning complex spatial problems into simple, beautiful and intuitive architectural solutions. When I'm not pushing pixels or drafting forms, you'll find me exploring the intersection of BIM and creative technology.
                </p>
                <div className="pt-4 flex flex-wrap gap-4">
                  <Button size="sm" variant="outline" className="text-[10px] h-9 px-6 border-white/20 hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                    Download Full CV
                  </Button>
                  <Button size="sm" variant="outline" className="text-[10px] h-9 px-6 border-white/20 hover:bg-white hover:text-black transition-all uppercase tracking-widest">
                    Get in Touch
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* DETAILED CV SECTIONS (Vertical Sequence) */}
        <div className="flex flex-col gap-32">
          
          {/* 1. Experience Section */}
          <div className="flex flex-col gap-16">
            <Reveal>
              <h2 className="text-[28px] font-light tracking-tight text-white uppercase border-b border-white/10 pb-4">
                My Journey
              </h2>
            </Reveal>
            <div className="flex flex-col gap-16">
              {experiences.map((exp, i) => (
                <Reveal key={i} delay={0.2 + (i * 0.1)}>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-24">
                    <div className="data-mono text-white/20 text-[10px] w-32 shrink-0 pt-2">{exp.period}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-medium text-white mb-2">{exp.role}</h3>
                      <p className="text-white/60 font-medium mb-4">{exp.company}</p>
                      <p className="text-base text-white/40 leading-relaxed max-w-3xl">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 2. Education Section */}
          <div className="flex flex-col gap-16">
            <Reveal>
              <h2 className="text-[28px] font-light tracking-tight text-white uppercase border-b border-white/10 pb-4">
                Roots & Foundations
              </h2>
            </Reveal>
            <div className="flex flex-col gap-12">
              {education.map((edu, i) => (
                <Reveal key={i} delay={0.2 + (i * 0.1)}>
                  <div className="flex flex-col md:flex-row gap-4 md:gap-24">
                    <div className="data-mono text-white/20 text-[10px] w-32 shrink-0 pt-2">{edu.period}</div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-medium text-white mb-2">{edu.degree}</h3>
                      <p className="text-lg text-white/60">{edu.school}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* 3. Skills Section */}
          <div className="flex flex-col gap-16">
            <Reveal>
              <h2 className="text-[28px] font-light tracking-tight text-white uppercase border-b border-white/10 pb-4">
                My Toolkit
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {skills.map((skill, i) => (
                <Reveal key={i} delay={0.2 + (i * 0.1)}>
                  <div className="flex flex-col gap-6">
                    <div className="label-caps text-white/20 text-[10px] border-l border-white/10 pl-4">{skill.category}</div>
                    <ul className="flex flex-wrap md:flex-col gap-x-6 gap-y-3 pl-4">
                      {skill.items.map((item, j) => (
                        <li key={j} className="text-lg text-white/60">{item}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
