import Image from "next/image";
import { Mail, ExternalLink, MapPin, Download } from "lucide-react";

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
    <section className="bg-white py-12 w-full mx-auto relative scroll-mt-[60px]" id="cv-section">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-24">
        
        {/* Left Column — Sticky Sidebar (1/3) */}
        <aside className="md:col-span-1">
          <div className="md:sticky md:top-[80px] flex flex-col gap-10">
            {/* Portrait Image (Rule #3) */}
            <Reveal delay={0.2}>
              <div className="w-full aspect-[4/5] overflow-hidden bg-[#EEEEEE] relative">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80"
                  alt="Tri Nguyen Minh Portrait"
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </Reveal>

            {/* Contact Info (label-caps) */}
            <Reveal delay={0.3}>
              <div className="flex flex-col gap-4">
                <div className="label-caps text-[#4C4546]">
                  <a href="mailto:hello@trilab.design" className="hover:text-black transition-colors">hello@trilab.design</a>
                </div>
                <div className="label-caps text-[#4C4546]">
                  <a href="#" className="hover:text-black transition-colors">linkedin.com/in/tri-nguyen</a>
                </div>
                <div className="label-caps text-[#4C4546]">
                  <span>Ho Chi Minh City, Vietnam</span>
                </div>
              </div>

              <div className="pt-2">
                <Button size="sm" variant="outline" className="text-[10px] h-8 px-4">
                  DOWNLOAD FULL PDF
                </Button>
              </div>
            </Reveal>
          </div>
        </aside>

        {/* Right Column — Scrollable CV (2/3) */}
        <div className="md:col-span-2 flex flex-col gap-20">
          
          {/* Experience Section */}
          <div>
            <Reveal>
              <h2 className="text-[48px] font-light tracking-tight text-black mb-10 uppercase">
                Experience
              </h2>
            </Reveal>
            <div className="flex flex-col gap-12">
              {experiences.map((exp, i) => (
                <Reveal key={i} delay={0.2 + (i * 0.1)}>
                  <div className="flex flex-col gap-3">
                    <div className="data-mono text-[#4C4546]/40 text-[10px]">{exp.period}</div>
                    <div>
                      <h3 className="text-xl font-medium text-black mb-1">{exp.role}</h3>
                      <p className="text-[#4C4546] font-medium mb-3">{exp.company}</p>
                      <p className="text-base text-[#4C4546] leading-relaxed max-w-2xl opacity-80">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div>
            <Reveal>
              <h2 className="text-[48px] font-light tracking-tight text-black mb-10 uppercase">
                Education
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              {education.map((edu, i) => (
                <Reveal key={i} delay={0.2 + (i * 0.1)}>
                  <div className="flex flex-col gap-3">
                    <div className="data-mono text-[#4C4546]/40 text-[10px]">{edu.period}</div>
                    <div>
                      <h3 className="text-xl font-medium text-black mb-1">{edu.degree}</h3>
                      <p className="text-base text-[#4C4546] opacity-80">{edu.school}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <Reveal>
              <h2 className="text-[48px] font-light tracking-tight text-black mb-10 uppercase">
                Skills
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
              {skills.map((skill, i) => (
                <Reveal key={i} delay={0.2 + (i * 0.1)}>
                  <div className="flex flex-col gap-4">
                    <div className="label-caps text-[#4C4546]/40">{skill.category}</div>
                    <ul className="flex flex-col gap-1">
                      {skill.items.map((item, j) => (
                        <li key={j} className="text-base text-[#4C4546] opacity-80">{item}</li>
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

