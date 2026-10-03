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
  PersonalProfile,
  CareerExperience,
  EducationEntry,
} from "@/types/cms";

import { motion } from "framer-motion";
import { usePreloader } from "@/lib/preloader-context";

interface PortfolioAccordionProps {
  projects: Project[];
  labArticles: ResearchArticle[];
  writingArticles: ResearchArticle[];
  toolkits: ToolkitModule[];
  profile: PersonalProfile;
  experiences?: CareerExperience[];
  education?: EducationEntry[];
}

export function PortfolioAccordion({
  projects,
  labArticles,
  writingArticles,
  toolkits,
  profile,
  experiences,
  education,
}: PortfolioAccordionProps) {
  const { isDocked, hasLoadedBefore } = usePreloader();

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
      {/* ── 01. Works ────────────────────────────────────────────── */}
      <motion.div
        initial={hasLoadedBefore ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: isDocked ? 1 : 0, y: isDocked ? 0 : 10 }}
        transition={{
          duration: 0.5,
          delay: hasLoadedBefore ? 0 : 0.32,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <AccordionItem
          id="works"
          number="01"
          title="Works"
          href="/works"
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
      </motion.div>

      {/* ── 02. Labs ─────────────────────────────────────────────── */}
      <motion.div
        initial={hasLoadedBefore ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: isDocked ? 1 : 0, y: isDocked ? 0 : 10 }}
        transition={{
          duration: 0.5,
          delay: hasLoadedBefore ? 0 : 0.38,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <AccordionItem
          id="labs"
          number="02"
          title="Labs"
          href="/labs"
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
      </motion.div>

      {/* ── 03. Writing ──────────────────────────────────────────── */}
      <motion.div
        initial={hasLoadedBefore ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: isDocked ? 1 : 0, y: isDocked ? 0 : 10 }}
        transition={{
          duration: 0.5,
          delay: hasLoadedBefore ? 0 : 0.44,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <AccordionItem
          id="writing"
          number="03"
          title="Writing"
          href="/writing"
          isOpen={!!openSections.writing}
          onToggle={() => toggleSection("writing")}
        >
          <WritingAccordionContent articles={writingArticles} />
        </AccordionItem>
      </motion.div>

      {/* ── 04. About ────────────────────────────────────────────── */}
      <motion.div
        initial={hasLoadedBefore ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: isDocked ? 1 : 0, y: isDocked ? 0 : 10 }}
        transition={{
          duration: 0.5,
          delay: hasLoadedBefore ? 0 : 0.50,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <AccordionItem
          id="about"
          number="04"
          title="About"
          isOpen={!!openSections.about}
          onToggle={() => toggleSection("about")}
          hideBottomDivider={true}
        >
          <AboutAccordionContent
            profile={profile}
            toolkits={toolkits}
            experiences={experiences}
            education={education}
          />
        </AccordionItem>
      </motion.div>
    </div>
  );
}
