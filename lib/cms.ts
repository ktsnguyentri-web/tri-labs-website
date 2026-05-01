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

export async function getProjects(): Promise<ProjectData[]> {
  return data.projects as ProjectData[];
}

export async function getFeaturedLog(): Promise<LogData | null> {
  return data.logData as LogData | null;
}
