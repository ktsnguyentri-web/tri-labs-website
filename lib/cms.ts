import data from './cms-data.json';

export interface ProjectData {
  title: string;
  location: string;
  span: string;
  img: string;
  order: number;
}

export interface LogData {
  title: string;
  date: string;
  img: string;
  contentHtml: string;
}

export interface ResearchData {
  title: string;
  date: string;
  excerpt: string;
  img: string;
  featured?: boolean;
  slug: string;
  category: string;
  contentHtml: string;
}

export async function getProjects(): Promise<ProjectData[]> {
  return data.projects as ProjectData[];
}

export async function getFeaturedLog(): Promise<LogData | null> {
  return data.logData as LogData | null;
}

export async function getResearchInsights(): Promise<ResearchData[]> {
  const allResearch = (data.research || []) as ResearchData[];
  
  // Filter for featured articles, or just return the 3 most recent
  let featured = allResearch.filter(item => item.featured);
  
  if (featured.length === 0) {
    featured = allResearch;
  }
  
  return featured.slice(0, 3);
}

export async function getAllResearchInsights(): Promise<ResearchData[]> {
  return (data.research || []) as ResearchData[];
}
