"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/Reveal";

const STAGGER_DELAY = 0.12;

interface CVSectionProps {
  theme?: "light" | "dark";
}

export function CVSection({ theme = "dark" }: CVSectionProps) {
  const isLight = theme === "light";
  const [expandedExperiences, setExpandedExperiences] = useState<Record<number, boolean>>({});
  const [hoveredTool, setHoveredTool] = useState<string | null>(null);

  const toggleExperience = (index: number) => {
    setExpandedExperiences((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const textColor = isLight ? "text-black" : "text-white";
  const subTextColor = isLight ? "text-black/40" : "text-white/40";
  const mutedTextColor = isLight ? "text-black/20" : "text-white/20";
  const borderColor = isLight ? "border-black/10" : "border-white/10";
  const dotColor = isLight ? "bg-black/30" : "bg-white/30";

  const experiences = [
    {
      periodStart: "JAN 2024 —",
      periodEnd: "PRES.",
      role: "Interior Architect",
      company: "THIEN PHUOC COMPANY",
      logo: "",
      description: "Received concept design from the Korean team, developed detailed drawings, and executed shop drawings on-site.",
      keyProjects: [
        { name: "Chavana Boutique Hotel", slug: "chavana-boutique-hotel" },
        { name: "Clover House", slug: "clover-house" }
      ]
    },
    {
      periodStart: "MAR 2022 —",
      periodEnd: "JAN 2024",
      role: "Concept Architect",
      company: "HTA+PIZZINI ARCHITECTS",
      logo: "",
      description: "Worked directly with the director to develop the project from concept to schematic design stage.",
      keyProjects: [
        { name: "Shenzhen Bay Culture Park", slug: "shenzhen-bay-culture-park" },
        { name: "Harbin Opera House", slug: "harbin-opera-house" }
      ]
    },
    {
      periodStart: "FEB 2021 —",
      periodEnd: "FEB 2022",
      role: "Project Architect",
      company: "STUDIO DUO",
      logo: "",
      description: "Responsible for concept design and the development of construction documents across multiple projects.",
      keyProjects: [
        { name: "Huzhou Sheraton", slug: "huzhou-sheraton" },
        { name: "Chaoyang Park Plaza", slug: "chaoyang-park-plaza" }
      ]
    },
    {
      periodStart: "AUG 2019 —",
      periodEnd: "DEC 2020",
      role: "Project Architect",
      company: "PHILIPPE PIERGA DESIGN",
      logo: "",
      description: "Assisted senior architects in developing design concepts and producing construction drawings for high-rise buildings and upscale resort projects.",
      keyProjects: [
        { name: "Huangshan Mountain Village", slug: "huangshan-mountain-village" },
        { name: "Nanjing Zendai Himalayas", slug: "nanjing-zendai-himalayas" }
      ]
    },
    {
      periodStart: "APR 2021 —",
      periodEnd: "MAY 2023",
      role: "Freelancer Architect",
      company: "DI+ARCHITECTS",
      logo: "",
      description: "Assisted in construction drawings for Singapore townhouses and supported concept design on some large-scale projects.",
      keyProjects: [
        { name: "Absolute Towers", slug: "absolute-towers" },
        { name: "Ordos Museum", slug: "ordos-museum" }
      ],
      isFreelancer: true
    }
  ];

  const education = [
    {
      period: "2011 — 2013",
      degree: "M.Arch II",
      school: "Graduate School of Design, Harvard University",
      logo: "",
      note: "Thesis: Adaptive High-Rise Envelopes"
    },
    {
      period: "2006 — 2011",
      degree: "Bachelor of Architecture",
      school: "Southern California Institute of Architecture (SCI-Arc)",
      logo: "",
      note: "Honours Graduate"
    }
  ];

  const toolkits = [
    {
      module: "Design",
      tools: [
        { name: "Rhino / Grasshopper", proficiency: 95 },
        { name: "Revit / BIM", proficiency: 90 },
        { name: "Maya", proficiency: 85 },
        { name: "Adobe Suite", proficiency: 95 },
        { name: "SketchUp", proficiency: 90 },
        { name: "AutoCAD", proficiency: 95 }
      ]
    },
    {
      module: "Code",
      tools: [
        { name: "React / Next.js", proficiency: 90 },
        { name: "Three.js / WebGL", proficiency: 85 },
        { name: "Python", proficiency: 80 },
        { name: "Unreal Engine 5", proficiency: 85 },
        { name: "Dynamo", proficiency: 88 },
        { name: "Blender", proficiency: 82 }
      ]
    }
  ];

  return (
    <section className={`${isLight ? "bg-white" : "bg-black"} scroll-mt-[60px]`} id="cv-section">
      {/* ── HEADER: 800px focused, sliding entrance ──────────────────── */}
      <div className="max-w-[800px] mx-auto px-6 pt-20 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* Left: Portrait — slides in from left */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className={`relative w-full aspect-[4/5] overflow-hidden rounded-[24px] ${isLight ? "bg-black/5" : "bg-black"}`}>
              <Image
                src="/portrait.jpeg"
                alt="Tri Nguyen Minh Portrait"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 380px"
                priority
              />
            </div>
          </motion.div>

          {/* Right: Content — slides in from right */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col justify-center gap-7"
          >
            <h1 className={`text-[64px] md:text-[80px] font-bold tracking-tighter ${textColor} leading-none`}>
              about.
            </h1>
            <p className={`text-[18px] md:text-[20px] ${isLight ? "text-black/80" : "text-white/80"} font-light leading-snug`}>
              I'm an architectural designer and creative coder based in Ho Chi Minh City, Vietnam.
            </p>
            <p className={`text-base ${isLight ? "text-black/50" : "text-white/50"} leading-relaxed`}>
              Since 2013, I've enjoyed turning complex spatial problems into simple, beautiful and intuitive architectural solutions. When I'm not pushing pixels or drafting forms, you'll find me exploring the intersection of BIM and creative technology.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="sm"
                variant="outline"
                className={`text-[9px] h-8 px-4 ${isLight ? "border-black/20 text-black hover:bg-black hover:text-white" : "border-white/20 text-white hover:bg-white hover:text-black"} transition-all uppercase tracking-widest`}
              >
                Download Full CV
              </Button>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── CENTRAL COLUMN ───────────────────────────────────────────── */}
      <div className="max-w-[800px] mx-auto px-6 pb-32 flex flex-col gap-28">

        {/* 1. MY JOURNEY */}
        <div>
          <Reveal>
            <div className="flex items-center gap-4 mb-12">
              <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${mutedTextColor}`}>01</span>
              <h2 className={`text-[28px] font-light tracking-tight ${textColor} uppercase border-b ${borderColor} pb-3 flex-1`}>
                My Journey
              </h2>
            </div>
          </Reveal>

          {/* Timeline */}
          <div className="relative flex flex-col gap-0">
            {experiences.map((exp, i) => (
              <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                <div className="flex flex-col md:flex-row gap-4 md:gap-10 relative pb-14">
                  {/* Date pill */}
                  <div className="md:w-[110px] shrink-0 pt-1">
                    <span className={`font-mono text-[13px] font-medium ${isLight ? "text-black/60" : "text-white/60"} tracking-wider block`}>
                      {exp.periodStart}
                    </span>
                    <span className={`font-mono text-[13px] font-medium ${isLight ? "text-black/40" : "text-white/40"} tracking-wider block mt-0.5`}>
                      {exp.periodEnd}
                    </span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 md:pl-8">
                    {/* Dot on timeline */}
                    {!exp.isFreelancer && (
                      <div className={`hidden md:block absolute left-[108px] top-[8px] w-[5px] h-[5px] rounded-full ${dotColor}`} />
                    )}

                    {/* Segment of vertical line connecting to the next item */}
                    {i < experiences.length - 1 && !experiences[i + 1].isFreelancer && (
                      <div className={`hidden md:block absolute left-[110px] top-[18px] bottom-[-10px] w-px ${isLight ? "bg-black/5" : "bg-white/5"}`} />
                    )}
                    
                    {/* Header Row: Logo + Company Name */}
                    <div 
                      className="flex items-center gap-3 mb-1.5 cursor-pointer select-none group"
                      onClick={() => toggleExperience(i)}
                    >
                      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-mono text-[11px] font-bold overflow-hidden transition-transform group-hover:scale-105 ${isLight ? "bg-black/5 text-black/40 border border-black/10" : "bg-white/5 text-white/40 border border-white/10"}`}>
                        {exp.logo ? (
                          <Image src={exp.logo} alt={exp.company} width={28} height={28} className="object-cover w-full h-full" />
                        ) : (
                          <span>{exp.company.charAt(0)}</span>
                        )}
                      </div>
                      <h3 className={`text-xl font-medium ${textColor} leading-snug tracking-tight group-hover:opacity-80 transition-opacity flex items-center gap-2`}>
                        {exp.company}
                        <span className={`text-[10px] ${mutedTextColor} transition-transform duration-300 ${expandedExperiences[i] ? "rotate-180" : ""}`}>▼</span>
                      </h3>
                    </div>

                    <p className={`text-base font-bold ${isLight ? "text-black/80" : "text-white/80"}`}>{exp.role}</p>

                    <AnimatePresence initial={false}>
                      {expandedExperiences[i] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2">
                            <p className={`text-base ${subTextColor} leading-relaxed`}>{exp.description}</p>

                            {/* Key Projects */}
                            {exp.keyProjects && exp.keyProjects.length > 0 && (
                              <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1">
                                <span className={`text-base font-bold ${isLight ? "text-black/80" : "text-white/80"} mr-1`}>Key Projects:</span>
                                {exp.keyProjects.map((project, pIndex) => (
                                  <span key={project.slug} className="inline-flex items-center">
                                    <Link 
                                      href={`/work/${project.slug}`}
                                      className={`text-base ${isLight ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"} underline underline-offset-4 transition-colors`}
                                    >
                                      {project.name}
                                    </Link>
                                    {pIndex < exp.keyProjects.length - 1 && (
                                      <span className={`mx-1.5 ${isLight ? "text-black/30" : "text-white/30"}`}>,</span>
                                    )}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
              <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${mutedTextColor}`}>02</span>
              <h2 className={`text-[28px] font-light tracking-tight ${textColor} uppercase border-b ${borderColor} pb-3 flex-1`}>
                My Toolkit
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {toolkits.map((tk, i) => (
              <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                <div className={`border ${isLight ? "border-black/5" : "border-white/5"} p-8 flex flex-col gap-6`}>
                  <p className={`font-mono text-[10px] uppercase tracking-[0.2em] ${mutedTextColor} border-l ${borderColor} pl-4`}>{tk.module}</p>
                  <ul className="flex flex-col gap-3">
                    {tk.tools.map((tool) => {
                      const isHovered = hoveredTool === tool.name;
                      return (
                        <li 
                          key={tool.name} 
                          className="relative flex flex-col gap-1 cursor-pointer group select-none"
                          onMouseEnter={() => setHoveredTool(tool.name)}
                          onMouseLeave={() => setHoveredTool(null)}
                        >
                          <div className={`text-[17px] font-light ${isLight ? "text-black/60 group-hover:text-black" : "text-white/60 group-hover:text-white"} transition-colors flex items-center gap-3`}>
                            <span className={`w-1.5 h-px ${isLight ? "bg-black/20 group-hover:bg-black" : "bg-white/20 group-hover:bg-white"} transition-colors shrink-0`} />
                            {tool.name}
                            {isHovered && (
                              <span className={`ml-auto font-mono text-[11px] ${isLight ? "text-black/40" : "text-white/40"}`}>
                                {tool.proficiency}%
                              </span>
                            )}
                          </div>
                          
                          {/* Animated Proficiency Bar */}
                          <AnimatePresence>
                            {isHovered && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="w-full overflow-hidden"
                              >
                                <div className={`h-1 w-full rounded-full ${isLight ? "bg-black/5" : "bg-white/5"} overflow-hidden mt-1`}>
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${tool.proficiency}%` }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className={`h-full rounded-full ${isLight ? "bg-black/80" : "bg-white/80"}`}
                                  />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </li>
                      );
                    })}
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
              <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${mutedTextColor}`}>03</span>
              <h2 className={`text-[28px] font-light tracking-tight ${textColor} uppercase border-b ${borderColor} pb-3 flex-1`}>
                Foundations
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-12">
            {education.map((edu, i) => (
              <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                <div className="flex flex-col md:flex-row gap-4 md:gap-10">
                  <div className="md:w-[110px] shrink-0 pt-1">
                    <span className={`font-mono text-[13px] font-medium ${isLight ? "text-black/60" : "text-white/60"} tracking-wider leading-tight block`}>{edu.period}</span>
                  </div>
                  <div className="flex-1 md:pl-8">
                    {/* Header Row: Logo + School Name */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center font-mono text-[11px] font-bold overflow-hidden ${isLight ? "bg-black/5 text-black/40 border border-black/10" : "bg-white/5 text-white/40 border border-white/10"}`}>
                        {edu.logo ? (
                          <Image src={edu.logo} alt={edu.school} width={28} height={28} className="object-cover w-full h-full" />
                        ) : (
                          <span>{edu.school.charAt(0)}</span>
                        )}
                      </div>
                      <h3 className={`text-xl font-medium ${textColor} tracking-tight`}>{edu.school}</h3>
                    </div>

                    <p className={`font-mono text-[12px] ${subTextColor} uppercase tracking-[0.08em] mb-1`}>{edu.degree}</p>
                    <p className={`font-mono text-[10px] uppercase tracking-[0.15em] ${isLight ? "text-black/25" : "text-white/25"}`}>{edu.note}</p>
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
