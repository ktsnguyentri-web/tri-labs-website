import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDir = path.join(process.cwd(), 'content');

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
  const projectsDir = path.join(contentDir, 'projects');
  const fileNames = fs.readdirSync(projectsDir);
  
  const allProjectsData = fileNames.map(fileName => {
    const fullPath = path.join(projectsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    
    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);
    
    return matterResult.data as ProjectData;
  });
  
  // Sort projects by order
  return allProjectsData.sort((a, b) => a.order - b.order);
}

export async function getFeaturedLog(): Promise<LogData | null> {
  const logsDir = path.join(contentDir, 'logs');
  const fileNames = fs.readdirSync(logsDir);
  
  if (fileNames.length === 0) return null;
  
  // Just get the first one for now, or you could sort by date
  const fileName = fileNames[0];
  const fullPath = path.join(logsDir, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  const matterResult = matter(fileContents);
  
  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();
  
  return {
    ...matterResult.data,
    contentHtml,
  } as LogData;
}
