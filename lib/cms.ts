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
import type { Project, ResearchArticle, CareerExperience, EducationEntry, ToolkitModule, PersonalProfile } from '@/types/cms';

// ---------------------------------------------------------------------------
// Re-export canonical types for convenience
// ---------------------------------------------------------------------------
export type { 
  Project, 
  ResearchArticle, 
  WorkItem, 
  ModalProject,
  CareerExperience,
  EducationEntry,
  ToolkitModule,
  PersonalProfile 
} from '@/types/cms';

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
  office?: string;
  role?: string;
  author?: string;
  siteArea?: string;
  buildingHeight?: string;
  stories?: string;
  grossArea?: string;
  gallery?: string[];
  architectureGallery?: string[];
  interiorGallery?: string[];
  drawingGallery?: string[];
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
  const architectureGallery = raw.architectureGallery || raw.gallery || [];
  const interiorGallery = raw.interiorGallery || [];
  const drawingGallery = raw.drawingGallery || [];
  
  return {
    slug: raw.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, ''),
    title: raw.title,
    heroImage: raw.img || '',
    location: raw.location || '',
    completionYear: raw.completionYear,
    span: raw.span,
    order: raw.order,
    description: raw.description,
    architect: raw.architect,
    status: raw.status || '',
    scope: raw.scope || '',
    office: raw.office || raw.architect || '',
    role: raw.role,
    author: raw.author,
    
    size: {
      siteArea: raw.siteArea,
      buildingHeight: raw.buildingHeight,
      stories: raw.stories,
      grossArea: raw.grossArea,
    },
    
    architectureGallery,
    interiorGallery,
    drawingGallery,
    
    hasTechnicalDrawings: drawingGallery.length > 0,
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
  return (rawData.projects as RawProject[]).map(toProject).sort((a, b) => a.order - b.order);
}

export async function getToolArticles(): Promise<ResearchArticle[]> {
  const all = (rawData.research as RawResearch[]).map(toResearchArticle);
  return all.filter((item) => item.category === 'Tool');
}

export async function getResearchArticles(): Promise<ResearchArticle[]> {
  const all = (rawData.research as RawResearch[]).map(toResearchArticle);
  return all.filter((item) => item.category === 'Research');
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

export async function getCareerExperiences(): Promise<CareerExperience[]> {
  return [
    {
      periodStart: "JAN 2024",
      periodEnd: "PRES.",
      role: "Interior Architect",
      company: "THIEN PHUOC COMPANY",
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
      description: "Assisted in construction drawings for Singapore townhouses and supported concept design on some large-scale projects.",
      keyProjects: [
        { name: "Absolute Towers", slug: "absolute-towers" },
        { name: "Ordos Museum", slug: "ordos-museum" }
      ],
      isFreelancer: true
    }
  ];
}

export async function getEducation(): Promise<EducationEntry[]> {
  return [
    {
      period: "2011 — 2013",
      degree: "M.Arch II",
      school: "Graduate School of Design, Harvard University",
      note: "Thesis: Adaptive High-Rise Envelopes"
    },
    {
      period: "2006 — 2011",
      degree: "Bachelor of Architecture",
      school: "Southern California Institute of Architecture (SCI-Arc)",
      note: "Honours Graduate"
    }
  ];
}

export async function getToolkits(): Promise<ToolkitModule[]> {
  return [
    {
      module: "Architectural & Spatial Design",
      tools: [
        { name: "Rhino / Grasshopper", proficiency: 95 },
        { name: "Revit / BIM", proficiency: 90 },
        { name: "AutoCAD", proficiency: 95 },
        { name: "SketchUp", proficiency: 90 },
        { name: "Adobe Creative Suite", proficiency: 95 },
        { name: "Maya", proficiency: 85 }
      ]
    },
    {
      module: "Computational & Engineering Code",
      tools: [
        { name: "React / Next.js", proficiency: 90 },
        { name: "Three.js / WebGL", proficiency: 85 },
        { name: "TypeScript / JavaScript", proficiency: 90 },
        { name: "Python / Data", proficiency: 80 },
        { name: "Unreal Engine 5", proficiency: 85 },
        { name: "Dynamo / Parametric", proficiency: 88 }
      ]
    }
  ];
}

import profileJson from '@/content/profile.json';

export async function getProfile(): Promise<PersonalProfile> {
  return profileJson as PersonalProfile;
}


