"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { ModalProject, Project } from "@/types/cms";
import { ProjectStageViewport } from "@/components/project/ProjectStageViewport";

interface ProjectModalProps {
  project: ModalProject | Project;
  onClose?: () => void;
  initialGalleryOpen?: boolean;
  initialIndex?: number;
}

export function ProjectModal({
  project,
  onClose,
  initialGalleryOpen = false,
  initialIndex = 0,
}: ProjectModalProps) {
  const router = useRouter();
  const [isGalleryOpen, setIsGalleryOpen] = useState(initialGalleryOpen);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(initialIndex);

  const [objectFit, setObjectFit] = useState<"cover" | "contain">("cover");

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else {
      if (typeof window !== "undefined" && window.history.length > 1) {
        router.back();
      } else {
        router.push("/works");
      }
    }
  }, [onClose, router]);

  // Aggregate all unique project images
  const allImages = [
    project.heroImage,
    ...(project.architectureGallery || []),
    ...(project.interiorGallery || []),
    ...(project.drawingGallery || []),
  ]
    .filter(Boolean)
    .filter((url, idx, self) => self.indexOf(url) === idx);

  const remainingImages = allImages.filter((imgUrl) => imgUrl !== project.heroImage);

  const openGallery = (index: number = 0) => {
    setActiveGalleryIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const prevGalleryImage = useCallback(() => {
    setActiveGalleryIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  }, [allImages.length]);

  const nextGalleryImage = useCallback(() => {
    setActiveGalleryIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  }, [allImages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGalleryOpen) {
        if (e.key === "Escape") {
          e.stopPropagation();
          closeGallery();
        } else if (e.key === "ArrowLeft") {
          prevGalleryImage();
        } else if (e.key === "ArrowRight") {
          nextGalleryImage();
        }
      } else {
        if (e.key === "Escape") {
          handleClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGalleryOpen, handleClose, prevGalleryImage, nextGalleryImage]);

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, []);

  const hasSizeInfo =
    project.size &&
    (project.size.siteArea ||
      project.size.grossArea ||
      project.size.buildingHeight ||
      project.size.stories);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm cursor-pointer"
        onClick={handleClose}
      />

      {/* Modal Window — Small rounded corners, thin 4-edge borders, borderless header */}
      <motion.div
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-6xl h-[92vh] max-h-[960px] bg-[#FAFAFA] dark:bg-[#0A0A0A] text-neutral-900 dark:text-neutral-100 rounded-xl sm:rounded-2xl border border-neutral-300/90 dark:border-neutral-700/80 shadow-2xl overflow-hidden flex flex-col relative z-10 select-none"
      >
        {/* Floating Top Right Controls (No full dividing top bar) */}
        <div className="absolute top-4 right-5 sm:right-6 z-40 flex items-center gap-3">
          {isGalleryOpen && (
            <button
              type="button"
              onClick={() => setObjectFit((prev) => (prev === "cover" ? "contain" : "cover"))}
              className="font-mono text-[11px] text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors select-none tracking-wider cursor-pointer bg-[#FAFAFA]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-neutral-200/50 dark:border-neutral-800/60"
              title={objectFit === "cover" ? "Chuyển sang vừa khung" : "Chuyển sang tràn viền"}
            >
              [{objectFit === "cover" ? "TRÀN VIỀN" : "VỪA KHUNG"}]
            </button>
          )}

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer select-none bg-[#FAFAFA]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-neutral-200/50 dark:border-neutral-800/60"
          >
            <span>Close</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Top Left Controls when Gallery is Open */}
        {isGalleryOpen && (
          <div className="absolute top-4 left-5 sm:left-6 z-40 flex items-center gap-3 bg-[#FAFAFA]/80 dark:bg-[#0A0A0A]/80 backdrop-blur-sm px-2.5 py-1 rounded-md border border-neutral-200/50 dark:border-neutral-800/60">
            <button
              type="button"
              onClick={() => setIsGalleryOpen(false)}
              className="inline-flex items-center gap-1.5 font-mono text-xs text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer select-none group"
              aria-label="Back to Project Overview"
            >
              <span className="transition-transform group-hover:-translate-x-0.5">←</span>
              <span className="font-medium">Overview</span>
            </button>

            <span className="text-neutral-300 dark:text-neutral-700 font-mono text-xs">/</span>

            <div className="inline-flex items-center gap-2 font-mono text-xs text-neutral-600 dark:text-neutral-300">
              <span className="font-medium">Gallery</span>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                [{String(activeGalleryIndex + 1).padStart(2, "0")} / {String(allImages.length).padStart(2, "0")}]
              </span>
            </div>
          </div>
        )}

        {/* Modal Window Content Stage: Switches between Overview & Gallery */}
        <div className="relative flex-1 w-full h-full overflow-hidden">
          {isGalleryOpen ? (
            /* ── FULL-BLEED GALLERY VIEW ── */
            <div className="relative w-full h-full flex flex-col justify-between bg-neutral-950 select-none overflow-hidden">
              {/* Full-Bleed Image Area */}
              <div className="relative flex-1 w-full h-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeGalleryIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={allImages[activeGalleryIndex]}
                      alt={`${project.title} - Image ${activeGalleryIndex + 1}`}
                      fill
                      priority
                      quality={95}
                      sizes="(max-width: 1200px) 100vw, 1152px"
                      className={objectFit === "cover" ? "object-cover" : "object-contain"}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Left / Right Navigation Chevrons */}
                {allImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={prevGalleryImage}
                      aria-label="Previous image"
                      className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                    </button>

                    <button
                      type="button"
                      onClick={nextGalleryImage}
                      aria-label="Next image"
                      className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/75 backdrop-blur-md border border-white/10 hover:border-white/30 transition-all cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                    </button>
                  </>
                )}
              </div>

              {/* Floating Bottom Metadata Bar */}
              <div className="absolute bottom-0 inset-x-0 h-10 px-5 sm:px-6 flex items-center justify-between border-t border-white/10 bg-black/60 backdrop-blur-md text-neutral-300 font-mono text-[11px] z-20">
                <span className="uppercase tracking-wider truncate max-w-[40%] text-neutral-300">
                  {project.title} — {project.location}
                </span>
                <span className="hidden sm:inline-block text-[10px] text-neutral-400 tracking-wider">
                  ← / → TO NAVIGATE • ESC FOR OVERVIEW
                </span>
                <span className="uppercase tracking-wider text-right truncate max-w-[30%] text-neutral-300">
                  {project.category || "Architecture"}
                </span>
              </div>
            </div>
          ) : (
            /* ── OVERVIEW / REVIEW VIEW (Fixed Left Column, Scrollable Right Stage) ── */
            <div className="w-full h-full p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-10 lg:gap-14 overflow-hidden">
              {/* ── Left Column: Fixed height, independent scroll, stays fixed when scrolling right stage ── */}
              <aside className="w-full lg:w-[320px] xl:w-[340px] flex-shrink-0 h-full flex flex-col justify-between overflow-y-auto no-scrollbar space-y-6 select-text pr-1">
                <div className="space-y-6">
                  {/* Project Title */}
                  <div>
                    <h1 className="font-sans font-medium text-2xl sm:text-3xl lg:text-4xl tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
                      {project.title}
                    </h1>
                  </div>

                  {/* Narrative Copy */}
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5">
                    <p className="font-sans text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                      {project.description ||
                        "Exploring the intersection of architectural scale and digital fidelity. This project represents a comprehensive investigation into material, light, and geometry to establish a new paradigm in spatial experience."}
                    </p>
                  </div>

                  {/* Section Heading: INFORMATION */}
                  <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 space-y-3">
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
                    <div className="border-t border-neutral-200 dark:border-neutral-800 pt-5 space-y-3">
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

                {/* ── Integrated Gallery Button at the bottom of the left column ── */}
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 mt-auto flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openGallery(0)}
                    className="w-full py-3 px-4 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-900 dark:hover:border-neutral-200 bg-neutral-100/50 dark:bg-neutral-900/50 hover:bg-neutral-100 dark:hover:bg-neutral-900 font-mono text-xs text-neutral-900 dark:text-neutral-100 transition-all flex items-center justify-between group cursor-pointer select-none"
                    aria-label="Open Project Gallery"
                  >
                    <span className="font-medium tracking-wide">VIEW GALLERY</span>
                    <span className="text-[11px] text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform group-hover:translate-x-0.5">
                      [{String(allImages.length).padStart(2, "0")}] ↗
                    </span>
                  </button>
                </div>
              </aside>

              {/* ── Right Column: Media Stage (The ONLY scrolling container in overview mode) ── */}
              <div className="flex-1 w-full h-full overflow-y-auto space-y-8 pr-2 select-none">
                {/* 1. Prepared Three.js 3D Viewport Slot with Toggle Pill */}
                <ProjectStageViewport
                  project={project as Project}
                  onOpenGallery={() => openGallery(0)}
                />

                {/* 2. Gallery Images — Clickable to open high-res lightbox */}
                {remainingImages.map((imgUrl, idx) => {
                  const globalIndex = allImages.indexOf(imgUrl);
                  return (
                    <div
                      key={idx}
                      onClick={() => openGallery(globalIndex >= 0 ? globalIndex : idx + 1)}
                      className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-none cursor-pointer group"
                    >
                      <Image
                        src={imgUrl}
                        alt={`${project.title} - View ${idx + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 800px"
                        className="object-cover rounded-none group-hover:scale-[1.01] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center pointer-events-none">
                        <span className="font-mono text-[10px] text-white bg-black/75 px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity tracking-wider">
                          EXPAND GALLERY ↗
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
