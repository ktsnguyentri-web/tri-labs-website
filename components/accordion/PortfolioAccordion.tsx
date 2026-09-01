"use client";

import React, { useState } from "react";
import { AccordionItem } from "./AccordionItem";
import { HorizontalCarousel } from "@/components/carousel/HorizontalCarousel";
import { ProjectCard } from "@/components/carousel/ProjectCard";
import { LabCard } from "@/components/carousel/LabCard";
import { CareerAccordionContent } from "./CareerAccordionContent";
import { AboutAccordionContent } from "./AboutAccordionContent";
import type { 
  Project, 
  ResearchArticle, 
  CareerExperience, 
  EducationEntry, 
  ToolkitModule, 
  PersonalProfile 
} from "@/types/cms";

interface PortfolioAccordionProps {
  projects: Project[];
  labArticles: ResearchArticle[];
  careerExperiences: CareerExperience[];
  education: EducationEntry[];
  toolkits: ToolkitModule[];
  profile: PersonalProfile;
}

export function PortfolioAccordion({
  projects,
  labArticles,
  careerExperiences,
  education,
  toolkits,
  profile,
}: PortfolioAccordionProps) {
  // Default open first section (Architectural Works)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    works: true,
    labs: false,
    career: false,
    about: false,
  });

  const toggleSection = (sectionKey: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <div className="w-full flex flex-col">
      {/* Top Divider line (Constrained to inner grid) */}
      <div className="max-w-3xl mx-auto px-5 sm:px-6 md:px-8 w-full">
        <div className="border-t border-neutral-200 dark:border-neutral-800 w-full" />
      </div>

      {/* ── 01. Architectural Works ──────────────────────────────── */}
      <AccordionItem
        id="works"
        number="01"
        title="Architectural Works"
        badge={`${projects.length} Projects`}
        isOpen={!!openSections.works}
        onToggle={() => toggleSection("works")}
      >
        <HorizontalCarousel totalItems={projects.length}>
          {projects.map((project, idx) => (
            <ProjectCard
              key={project.slug || project.title}
              project={project}
              index={idx}
            />
          ))}
        </HorizontalCarousel>
      </AccordionItem>

      {/* ── 02. Tri-Labs / Experiments ───────────────────────────── */}
      <AccordionItem
        id="labs"
        number="02"
        title="Tri-Labs / Experiments"
        badge={`${labArticles.length} Entries`}
        isOpen={!!openSections.labs}
        onToggle={() => toggleSection("labs")}
      >
        <HorizontalCarousel totalItems={labArticles.length}>
          {labArticles.map((article, idx) => (
            <LabCard
              key={article.slug}
              article={article}
              index={idx}
            />
          ))}
        </HorizontalCarousel>
      </AccordionItem>

      {/* ── 03. Career & Experience ──────────────────────────────── */}
      <AccordionItem
        id="career"
        number="03"
        title="Career & Experience"
        badge="2019 — Present"
        isOpen={!!openSections.career}
        onToggle={() => toggleSection("career")}
      >
        <CareerAccordionContent
          experiences={careerExperiences}
          education={education}
        />
      </AccordionItem>

      {/* ── 04. Philosophy & About ───────────────────────────────── */}
      <AccordionItem
        id="about"
        number="04"
        title="Philosophy & About"
        badge="Profile"
        isOpen={!!openSections.about}
        onToggle={() => toggleSection("about")}
        hideBottomDivider={true}
      >
        <AboutAccordionContent
          profile={profile}
          toolkits={toolkits}
        />
      </AccordionItem>
    </div>
  );
}
