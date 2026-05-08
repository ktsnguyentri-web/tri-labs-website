/**
 * CMS Adapter Layer
 * 
 * This module reads raw data from the compiled JSON (written by build-cms.mjs)
 * and maps it to the canonical typed interfaces in @/types/cms.
 *
 * The raw JSON uses `img` as the image field (from markdown frontmatter).
 * The canonical types use `coverImage`. The mapping happens here so nothing
 * else in the app needs to know about the raw JSON shape.
 */

import rawData from './cms-data.json';
import type { Project, ResearchArticle } from '@/types/cms';

// ---------------------------------------------------------------------------
// Re-export canonical types for convenience
// ---------------------------------------------------------------------------
export type { Project, ResearchArticle, WorkItem, ModalProject } from '@/types/cms';

// ---------------------------------------------------------------------------
// Deprecated aliases — kept during incremental migration
// ---------------------------------------------------------------------------
/** @deprecated Use Project from @/types/cms */
export type ProjectData = Project;

/** @deprecated Use ResearchArticle from @/types/cms */
export type ResearchData = ResearchArticle;

// ---------------------------------------------------------------------------
// Raw JSON shapes (internal — never exposed to the rest of the app)
// ---------------------------------------------------------------------------

interface RawProject {
  title: string;
  location: string;
  span: string;
  img: string;
  order: number;
  completionYear?: string;
  description?: string;
  architect?: string;
  status?: string;
  scope?: string;
  gallery?: string[];
}

interface RawResearch {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  img: string;
  category: string;
  featured?: boolean;
  contentHtml: string;
}

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

function toProject(raw: RawProject): Project {
  return {
    slug: raw.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, ''),
    title: raw.title,
    coverImage: raw.img,
    location: raw.location,
    completionYear: raw.completionYear,
    span: raw.span,
    order: raw.order,
    description: raw.description,
    architect: raw.architect,
    status: raw.status,
    scope: raw.scope,
    gallery: raw.gallery,
  };
}

function toResearchArticle(raw: RawResearch): ResearchArticle {
  return {
    slug: raw.slug,
    title: raw.title,
    date: raw.date,
    excerpt: raw.excerpt,
    coverImage: raw.img,
    category: raw.category as ResearchArticle['category'],
    featured: raw.featured,
    contentHtml: raw.contentHtml,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getProjects(): Promise<Project[]> {
  return (rawData.projects as RawProject[]).map(toProject);
}

export async function getToolArticles(): Promise<ResearchArticle[]> {
  const all = (rawData.research as RawResearch[]).map(toResearchArticle);
  return all.filter((item) => item.category === 'Tool').slice(0, 3);
}

export async function getResearchArticles(): Promise<ResearchArticle[]> {
  const all = (rawData.research as RawResearch[]).map(toResearchArticle);
  return all.filter((item) => item.category === 'Research').slice(0, 3);
}

export async function getAllResearchInsights(): Promise<ResearchArticle[]> {
  return (rawData.research as RawResearch[]).map(toResearchArticle);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = (rawData.projects as RawProject[]).map(toProject);
  return all.find((item) => item.slug === slug) ?? null;
}

export async function getResearchBySlug(
  slug: string,
): Promise<ResearchArticle | null> {
  const all = (rawData.research as RawResearch[]).map(toResearchArticle);
  return all.find((item) => item.slug === slug) ?? null;
}

