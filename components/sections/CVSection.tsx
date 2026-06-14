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

  const toggleExperience = (index: number) => {
    setExpandedExperiences((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const textColor = isLight ? "text-black" : "text-white";
  const subTextColor = isLight ? "text-black/60" : "text-white/60";
  const mutedTextColor = isLight ? "text-black/40" : "text-white/40";

  const experiences = [
    {
      periodStart: "JAN 2024",
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
      periodStart: "MAR 2022",
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
      periodStart: "FEB 2021",
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
      periodStart: "AUG 2019",
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
      periodStart: "APR 2021",
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
    <section className={`${isLight ? "bg-white" : "bg-[#0A0A0A]"} scroll-mt-[60px] font-sans`} id="cv-section">
      <div className="max-w-[900px] mx-auto px-6 pt-24 pb-32">
        {/* ── HEADER ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="md:col-span-4"
          >
             <div className={`relative w-full aspect-[4/5] overflow-hidden ${isLight ? "bg-black/5" : "bg-white/5"}`}>
               <Image 
                 src="/portrait.jpeg" 
                 alt="Tri Nguyen Minh Portrait" 
                 fill 
                 className={`object-cover ${isLight ? "grayscale" : "grayscale-0"}`} 
                 sizes="(max-width: 768px) 100vw, 300px" 
                 priority 
               />
             </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="md:col-span-8 flex flex-col justify-center gap-6 md:pt-4"
          >
             <h1 className={`text-4xl md:text-5xl font-light tracking-tight ${textColor} leading-tight lowercase`}>
               about.
             </h1>
             <p className={`text-[15px] md:text-[16px] ${isLight ? "text-black/80" : "text-white/80"} font-light leading-[1.65]`}>
               I'm an architectural designer and creative coder based in Ho Chi Minh City, Vietnam.
             </p>
             <p className={`text-[14px] md:text-[15px] ${subTextColor} font-light leading-[1.65]`}>
               Since 2013, I've enjoyed turning complex spatial problems into simple, beautiful and intuitive architectural solutions. When I'm not pushing pixels or drafting forms, you'll find me exploring the intersection of BIM and creative technology.
             </p>
             <div className="pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className={`text-[10px] h-9 px-6 rounded-none ${isLight ? "border-black/20 text-black hover:bg-black hover:text-white" : "border-white/20 text-white hover:bg-white hover:text-black"} transition-all uppercase tracking-widest font-mono`}
                >
                  Download Full CV
                </Button>
             </div>
          </motion.div>
        </div>

        {/* ── MY JOURNEY ────────────────────────────────────────── */}
        <div className="mb-24">
           <Reveal>
             <div className={`border-b ${isLight ? "border-black/10" : "border-white/10"} pb-4 mb-12 flex items-baseline justify-between`}>
                <h2 className={`text-lg md:text-xl font-light tracking-tight ${textColor} uppercase`}>
                  My Journey
                </h2>
                <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${mutedTextColor}`}>01</span>
             </div>
           </Reveal>

           <div className="flex flex-col gap-12">
             {experiences.map((exp, i) => (
               <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 group">
                    <div className="md:col-span-3 pt-1">
                       <span className={`font-mono text-[11px] ${mutedTextColor} tracking-widest block`}>
                          {exp.periodStart} — {exp.periodEnd}
                       </span>
                    </div>
                    
                    <div className="md:col-span-9">
                       <div 
                          className="cursor-pointer select-none group-hover:opacity-90 transition-opacity"
                          onClick={() => toggleExperience(i)}
                       >
                          <h3 className={`text-base md:text-[16px] font-medium ${textColor} tracking-tight flex items-center justify-between`}>
                             {exp.company}
                             <span className={`font-mono text-[14px] ${mutedTextColor} font-light transition-transform duration-300`}>
                                {expandedExperiences[i] ? "—" : "+"}
                             </span>
                          </h3>
                          <p className={`text-[12px] md:text-[13px] ${subTextColor} mt-1 uppercase tracking-widest font-mono`}>
                             {exp.role} {exp.isFreelancer && <span className="ml-2 px-1.5 py-0.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[9px]">FREELANCE</span>}
                          </p>
                       </div>

                       <AnimatePresence initial={false}>
                          {expandedExperiences[i] && (
                             <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                             >
                                <div className={`pt-5 mt-5 border-t ${isLight ? "border-black/5" : "border-white/5"}`}>
                                   <p className={`text-[14px] md:text-[15px] ${isLight ? "text-black/75" : "text-white/75"} font-light leading-[1.65]`}>
                                      {exp.description}
                                   </p>
                                   
                                   {exp.keyProjects && exp.keyProjects.length > 0 && (
                                      <div className="mt-5 flex flex-col gap-2.5">
                                         <span className={`font-mono text-[9px] uppercase tracking-widest ${mutedTextColor}`}>Key Projects</span>
                                         <ul className="flex flex-col gap-2">
                                            {exp.keyProjects.map(project => (
                                               <li key={project.slug} className="flex items-center gap-3">
                                                  <span className={`w-1 h-[1px] ${isLight ? "bg-black/20" : "bg-white/20"}`}></span>
                                                  <Link 
                                                     href={`/work/${project.slug}`}
                                                     className={`text-[13px] md:text-[14px] ${isLight ? "text-black/80 hover:text-black" : "text-white/80 hover:text-white"} font-light transition-colors`}
                                                  >
                                                     {project.name}
                                                  </Link>
                                               </li>
                                            ))}
                                         </ul>
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

        {/* ── MY TOOLKIT ────────────────────────────────────────── */}
        <div className="mb-24">
           <Reveal>
             <div className={`border-b ${isLight ? "border-black/10" : "border-white/10"} pb-4 mb-12 flex items-baseline justify-between`}>
                <h2 className={`text-lg md:text-xl font-light tracking-tight ${textColor} uppercase`}>
                  My Toolkit
                </h2>
                <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${mutedTextColor}`}>02</span>
             </div>
           </Reveal>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
              {toolkits.map((tk, i) => (
                 <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                   <h3 className={`font-mono text-[10px] uppercase tracking-[0.2em] ${mutedTextColor} mb-6`}>
                      {tk.module}
                   </h3>
                   <ul className={`flex flex-col gap-3 border-t ${isLight ? "border-black/5" : "border-white/5"} pt-5`}>
                      {tk.tools.map(tool => (
                         <li key={tool.name} className="flex items-center justify-between group">
                            <span className={`text-[14px] md:text-[15px] font-light ${isLight ? "text-black/75 group-hover:text-black" : "text-white/75 group-hover:text-white"} transition-colors`}>
                               {tool.name}
                            </span>
                            <span className={`font-mono text-[10px] ${isLight ? "text-black/30" : "text-white/30"}`}>
                               {tool.proficiency}%
                            </span>
                         </li>
                      ))}
                   </ul>
                 </Reveal>
              ))}
           </div>
        </div>

        {/* ── FOUNDATIONS ────────────────────────────────────────── */}
        <div className="mb-12">
           <Reveal>
             <div className={`border-b ${isLight ? "border-black/10" : "border-white/10"} pb-4 mb-12 flex items-baseline justify-between`}>
                <h2 className={`text-lg md:text-xl font-light tracking-tight ${textColor} uppercase`}>
                  Foundations
                </h2>
                <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${mutedTextColor}`}>03</span>
             </div>
           </Reveal>

           <div className="flex flex-col gap-12">
             {education.map((edu, i) => (
               <Reveal key={i} delay={STAGGER_DELAY * (i + 1)}>
                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                    <div className="md:col-span-3 pt-1">
                       <span className={`font-mono text-[11px] ${mutedTextColor} tracking-widest block`}>
                          {edu.period}
                       </span>
                    </div>
                    
                    <div className="md:col-span-9">
                       <h3 className={`text-base md:text-[16px] font-medium ${textColor} tracking-tight mb-1`}>
                          {edu.school}
                       </h3>
                       <p className={`text-[12px] md:text-[13px] ${subTextColor} uppercase tracking-widest font-mono mb-3`}>
                          {edu.degree}
                       </p>
                       <p className={`text-[13px] md:text-[14px] font-light ${isLight ? "text-black/60" : "text-white/60"}`}>
                          {edu.note}
                       </p>
                    </div>
                 </div>
               </Reveal>
             ))}
           </div>
        </div>

      </div>
    </section>
  );
}
