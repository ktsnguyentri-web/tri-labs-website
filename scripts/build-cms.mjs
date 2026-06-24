import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentDir = path.join(__dirname, '../content');
const projectsDir = path.join(contentDir, 'projects');
const logsDir = path.join(contentDir, 'logs');
const researchDir = path.join(contentDir, 'research');
const toolsDir = path.join(contentDir, 'tools');

async function build() {
  const projectFiles = fs.existsSync(projectsDir)
    ? fs.readdirSync(projectsDir).filter(f => f.endsWith('.md'))
    : [];
  const projects = projectFiles.map(fileName => {
    const fullPath = path.join(projectsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    return matterResult.data;
  }).sort((a, b) => a.order - b.order);

  const logFiles = fs.existsSync(logsDir)
    ? fs.readdirSync(logsDir).filter(f => f.endsWith('.md'))
    : [];
  let logData = null;
  if (logFiles.length > 0) {
    const fileName = logFiles[0];
    const fullPath = path.join(logsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    
    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml = processedContent.toString();
    
    logData = {
      ...matterResult.data,
      contentHtml
    };
  }

  const researchFiles = fs.existsSync(researchDir)
    ? fs.readdirSync(researchDir).filter(f => f.endsWith('.md'))
    : [];
  const parsedResearch = await Promise.all(researchFiles.map(async (fileName) => {
    const fullPath = path.join(researchDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Extract first image from markdown body
    const imgRegex = /!\[.*?\]\((.*?)\)/;
    const match = matterResult.content.match(imgRegex);
    const firstImage = match ? match[1] : null;
    const img = firstImage || matterResult.data.img || '';

    return { ...matterResult.data, img, contentHtml, category: matterResult.data.category || 'Research' };
  }));

  const toolFiles = fs.existsSync(toolsDir)
    ? fs.readdirSync(toolsDir).filter(f => f.endsWith('.md'))
    : [];
  const parsedTools = await Promise.all(toolFiles.map(async (fileName) => {
    const fullPath = path.join(toolsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const processedContent = await remark().use(html).process(matterResult.content);
    const contentHtml = processedContent.toString();

    // Extract first image from markdown body
    const imgRegex = /!\[.*?\]\((.*?)\)/;
    const match = matterResult.content.match(imgRegex);
    const firstImage = match ? match[1] : null;
    const img = firstImage || matterResult.data.img || '';

    return { ...matterResult.data, img, contentHtml, category: matterResult.data.category || 'Tool' };
  }));

  const research = [...parsedResearch, ...parsedTools]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const outputPath = path.join(__dirname, '../lib/cms-data.json');
  fs.writeFileSync(outputPath, JSON.stringify({ projects, logData, research }, null, 2));
  console.log('CMS data built to lib/cms-data.json');
}

build().catch(console.error);
