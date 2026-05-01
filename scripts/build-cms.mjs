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

async function build() {
  const projectFiles = fs.existsSync(projectsDir) ? fs.readdirSync(projectsDir) : [];
  const projects = projectFiles.map(fileName => {
    const fullPath = path.join(projectsDir, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    return matterResult.data;
  }).sort((a, b) => a.order - b.order);

  const logFiles = fs.existsSync(logsDir) ? fs.readdirSync(logsDir) : [];
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

  const outputPath = path.join(__dirname, '../lib/cms-data.json');
  fs.writeFileSync(outputPath, JSON.stringify({ projects, logData }, null, 2));
  console.log('CMS data built to lib/cms-data.json');
}

build().catch(console.error);
