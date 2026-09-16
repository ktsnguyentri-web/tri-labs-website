"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/types/cms";
import { ProjectStageViewport } from "@/components/project/ProjectStageViewport";
import { ProjectModal } from "@/components/modals/ProjectModal";

interface ProjectDetailLayoutProps {
  project: Project;
}

export function ProjectDetailLayout({ project }: ProjectDetailLayoutProps) {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const allImages = [
    project.heroImage,
    ...(project.architectureGallery || []),
    ...(project.interiorGallery || []),
    ...(project.drawingGallery || []),
  ]
    .filter(Boolean)
    .filter((url, idx, self) => self.indexOf(url) === idx);

  const remainingImages = allImages.filter((imgUrl) => imgUrl !== project.heroImage);

  const openGalleryAt = (index: number = 0) => {
    setActiveGalleryIndex(index);
    setIsGalleryModalOpen(true);
  };

  const hasSizeInfo =
    project.size &&
    (project.size.siteArea ||
      project.size.grossArea ||
      project.size.buildingHeight ||
      project.size.stories);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8 pb-20 sm:pb-28">
      {/* ── Two-Column Architectural Layout: Sticky Details + Natural Media Stream ── */}
      <div className="w-full flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-20">
        
        {/* ── Left Column: Sticky on Desktop, Natural Flow on Mobile ── */}
        <aside className="w-full lg:w-[340px] xl:w-[380px] flex-shrink-0 lg:sticky lg:top-24 self-start space-y-8 select-text">
          <div className="space-y-6 sm:space-y-8">
            {/* Back link */}
            <div>
              <Link
                href="/works"
                className="inline-flex items-center gap-2 font-mono text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors group"
              >
                <span className="transition-transform group-hover:-translate-x-1">←</span>
                <span>Index / Works</span>
              </Link>
            </div>

            {/* Project Title */}
            <div>
              <h1 className="font-sans font-medium text-3xl sm:text-4xl lg:text-5xl tracking-tight text-neutral-900 dark:text-neutral-100 leading-[1.12]">
                {project.title}
              </h1>
            </div>

            {/* Narrative Copy */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6">
              <p className="font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                {project.description ||
                  "Exploring the intersection of architectural scale and digital fidelity. This project represents a comprehensive investigation into material, light, and geometry to establish a new paradigm in spatial experience."}
              </p>
            </div>

            {/* Section Heading: INFORMATION */}
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-3.5">
              <h2 className="font-mono text-xs text-neutral-400 dark:text-neutral-500 tracking-wider mb-2 uppercase">
                INFORMATION
              </h2>

              {project.category && (
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    Typology:
                  </span>
                  <span className="font-sans text-sm text-neutral-900 dark:text-neutral-200 text-right">
                    {project.category}
                  </span>
                </div>
              )}

              {project.location && (
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    Location:
                  </span>
                  <span className="font-sans text-sm text-neutral-900 dark:text-neutral-200 text-right">
                    {project.location}
                  </span>
                </div>
              )}

              {project.status && (
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    Status:
                  </span>
                  <span className="font-sans text-sm text-neutral-900 dark:text-neutral-200 text-right">
                    {project.status}
                  </span>
                </div>
              )}

              {project.completionYear && (
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    Year:
                  </span>
                  <span className="font-mono text-xs text-neutral-500 text-right">
                    {project.completionYear}
                  </span>
                </div>
              )}

              {(project.architect || project.office) && (
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    Office:
                  </span>
                  <span className="font-sans text-sm text-neutral-900 dark:text-neutral-200 text-right">
                    {project.architect || project.office}
                  </span>
                </div>
              )}

              {project.role && (
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    Role:
                  </span>
                  <span className="font-sans text-sm text-neutral-900 dark:text-neutral-200 text-right">
                    {project.role}
                  </span>
                </div>
              )}

              {project.scope && (
                <div className="flex justify-between items-baseline gap-4">
                  <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                    Scope:
                  </span>
                  <span className="font-sans text-sm text-neutral-900 dark:text-neutral-200 text-right">
                    {project.scope}
                  </span>
                </div>
              )}
            </div>

            {/* Section Heading: SIZE */}
            {hasSizeInfo && (
              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-3.5">
                <h2 className="font-mono text-xs text-neutral-400 dark:text-neutral-500 tracking-wider mb-2 uppercase">
                  SIZE
                </h2>

                {project.size?.siteArea && (
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                      Site Area:
                    </span>
                    <span className="font-mono text-xs text-neutral-500 text-right">
                      {project.size.siteArea}
                    </span>
                  </div>
                )}

                {project.size?.grossArea && (
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                      Gross Area:
                    </span>
                    <span className="font-mono text-xs text-neutral-500 text-right">
                      {project.size.grossArea}
                    </span>
                  </div>
                )}

                {project.size?.buildingHeight && (
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                      Height:
                    </span>
                    <span className="font-mono text-xs text-neutral-500 text-right">
                      {project.size.buildingHeight}
                    </span>
                  </div>
                )}

                {project.size?.stories && (
                  <div className="flex justify-between items-baseline gap-4">
                    <span className="font-sans text-xs text-neutral-500 dark:text-neutral-400 font-normal">
                      Stories:
                    </span>
                    <span className="font-mono text-xs text-neutral-500 text-right">
                      {project.size.stories}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── View Fullscreen Gallery Button ── */}
          <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => openGalleryAt(0)}
              className="w-full py-3.5 px-6 rounded-full border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-200 bg-neutral-100/70 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-900 font-mono text-xs text-neutral-900 dark:text-neutral-100 transition-all duration-200 flex items-center justify-between group cursor-pointer select-none active:scale-[0.98] shadow-sm hover:shadow"
              aria-label="Open Project Gallery"
            >
              <span className="font-medium tracking-wide">VIEW GALLERY</span>
              <span className="text-[11px] text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform group-hover:translate-x-0.5">
                [{String(allImages.length).padStart(2, "0")}] ↗
              </span>
            </button>
          </div>
        </aside>

        {/* ── Right Column: Media Stream (Flows naturally with window scroll) ── */}
        <div className="flex-1 w-full min-w-0 space-y-8 sm:space-y-12 select-none">
          {/* 1. 3D / 2D Stage Viewport */}
          <div className="w-full overflow-hidden">
            <ProjectStageViewport
              project={project}
              onOpenGallery={() => openGalleryAt(0)}
            />
          </div>

          {/* 2. Gallery Images — Clickable to open high-res lightbox */}
          {remainingImages.map((imgUrl, idx) => {
            const globalIndex = allImages.indexOf(imgUrl);
            return (
              <div
                key={idx}
                onClick={() => openGalleryAt(globalIndex >= 0 ? globalIndex : idx + 1)}
                className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-none cursor-pointer group"
              >
                <Image
                  src={imgUrl}
                  alt={`${project.title} - View ${idx + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, (max-width: 1440px) 65vw, 900px"
                  className="object-cover rounded-none group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center pointer-events-none">
                  <span className="font-mono text-[10px] text-white bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all tracking-wider shadow-md">
                    EXPAND GALLERY ↗
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Modal Gallery with full-bleed image display */}
      {isGalleryModalOpen && (
        <ProjectModal
          project={project}
          initialGalleryOpen={true}
          initialIndex={activeGalleryIndex}
          onClose={() => setIsGalleryModalOpen(false)}
        />
      )}
    </div>
  );
}
