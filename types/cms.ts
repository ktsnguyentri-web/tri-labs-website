/**
 * Canonical TypeScript interfaces for the Tri Labs portfolio.
 * All data flowing through the application must conform to these types.
 * The lib/cms.ts adapter layer maps raw CMS/JSON fields to these shapes.
 */

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

/** A portfolio project entry (Architecture, Interior, Design, etc.) */
export interface Project {
  /** URL-safe slug for the detail page route */
  slug: string;
  title: string;
  /** Primary cover image URL */
  coverImage: string;
  /** Human-readable location string, e.g. "SHENZHEN, CHINA" */
  location: string;
  /** Year of completion, e.g. "2023". Optional until CMS provides it. */
  completionYear?: string;
  category?: 'Architecture' | 'Interior' | 'Design';
  /** Tailwind CSS grid-span utility classes for bento-box layout */
  span: string;
  /** Sort order (lower = first) */
  order: number;
  /** Extended description for the detail page */
  description?: string;
  /** Additional image URLs for a gallery carousel */
  gallery?: string[];
}

// ---------------------------------------------------------------------------
// Research & Tools
// ---------------------------------------------------------------------------

/** A research article or internal tool entry */
export interface ResearchArticle {
  slug: string;
  title: string;
  /** Human-readable date string, e.g. "May 1, 2026" */
  date: string;
  excerpt: string;
  coverImage: string;
  category: 'Research' | 'Tool';
  featured?: boolean;
  /** Compiled HTML from the markdown source */
  contentHtml: string;
}

// ---------------------------------------------------------------------------
// Work Gallery
// ---------------------------------------------------------------------------

/**
 * A work item used by the Work gallery and its filter system.
 * Supersedes the previous inline `WorkItem` type in WorkGallery.tsx.
 */
export interface WorkItem {
  id: string | number;
  /** Optional slug for the /work/[slug] detail page */
  slug?: string;
  title: string;
  category: 'Architecture' | 'Interior' | 'Design';
  /** Year of completion, e.g. "2023" */
  completionYear: string;
  coverImage: string;
  /** Tailwind CSS grid-span utility classes */
  span: string;
}

// ---------------------------------------------------------------------------
// Modals
// ---------------------------------------------------------------------------

/** Minimal project data passed to the ProjectModal overlay */
export interface ModalProject {
  title: string;
  coverImage: string;
  location?: string;
  category?: string;
  completionYear?: string;
  description?: string;
}

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------

/** A single slide in the Hero section carousel */
export interface HeroSlide {
  id: number;
  title: string;
  /** Formatted tag string, e.g. "ARCHITECTURE | [TAG]" */
  tag: string;
  image: string;
}

// ---------------------------------------------------------------------------
// Deprecated aliases — kept for incremental migration, remove after CMS integration
// ---------------------------------------------------------------------------

/** @deprecated Use Project instead */
export type ProjectData = Project;

/** @deprecated Use ResearchArticle instead */
export type ResearchData = ResearchArticle;
