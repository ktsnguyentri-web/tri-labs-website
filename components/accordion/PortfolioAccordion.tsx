"use client";

import React, { useState } from "react";
import { AccordionItem } from "./AccordionItem";
import { HorizontalCarousel } from "@/components/carousel/HorizontalCarousel";
import { ProjectCard } from "@/components/carousel/ProjectCard";
import { LabCard } from "@/components/carousel/LabCard";
import { WritingAccordionContent } from "./WritingAccordionContent";
import { AboutAccordionContent } from "./AboutAccordionContent";
import type { 
  Project, 
  ResearchArticle, 
  ToolkitModule, 
  PersonalProfile 
} from "@/types/cms";

interface PortfolioAccordionProps {
  projects: Project[];
  labArticles: ResearchArticle[];
  writingArticles: ResearchArticle[];
  toolkits: ToolkitModule[];
  profile: PersonalProfile;
}

export function PortfolioAccordion({
  projects,
  labArticles,
  writingArticles,
  toolkits,
  profile,
}: PortfolioAccordionProps) {
  // Default open first section (01. Works)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    works: true,
    labs: false,
    writing: false,
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

      {/* ── 01. Works ────────────────────────────────────────────── */}
      <AccordionItem
        id="works"
        number="01"
        title="Works"
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

      {/* ── 02. Labs ─────────────────────────────────────────────── */}
      <AccordionItem
        id="labs"
        number="02"
        title="Labs"
        badge={`${labArticles.length} Tools`}
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

      {/* ── 03. Writing ──────────────────────────────────────────── */}
      <AccordionItem
        id="writing"
        number="03"
        title="Writing"
        badge={`${writingArticles.length} Essays`}
        isOpen={!!openSections.writing}
        onToggle={() => toggleSection("writing")}
      >
        <WritingAccordionContent articles={writingArticles} />
      </AccordionItem>

      {/* ── 04. About ────────────────────────────────────────────── */}
      <AccordionItem
        id="about"
        number="04"
        title="About"
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
