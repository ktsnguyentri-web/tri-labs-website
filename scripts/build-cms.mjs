import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.join(__dirname, '..');
const contentDir = path.join(rootDir, 'content');
const userProjectsDir = path.join(rootDir, 'projects');
const legacyProjectsDir = path.join(contentDir, 'projects');
const publicProjectsDir = path.join(rootDir, 'public/images/projects');
const userWritingDir = path.join(rootDir, 'writing');
const legacyResearchDir = path.join(contentDir, 'research');
const publicWritingDir = path.join(rootDir, 'public/images/writing');
const userToolsDir = path.join(rootDir, 'tools');
const legacyToolsDir = path.join(contentDir, 'tools');
const publicToolsDir = path.join(rootDir, 'public/images/tools');
const logsDir = path.join(contentDir, 'logs');

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parsePlainText(text) {
  const data = {};
  const lines = text.split(/\r?\n/);
  let isDescription = false;
  let isDescriptionVi = false;
  const descriptionLines = [];
  const descriptionViLines = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (isDescription) descriptionLines.push('');
      if (isDescriptionVi) descriptionViLines.push('');
      continue;
    }

    // Ignore header labels without colons (e.g. "PROJECT INFORMATION", "THÔNG TIN DỰ ÁN")
    const isHeaderLabel = /^(project information|thông tin dự án|thong tin du an|thông tin|thong tin|project details|project overview)$/i.test(trimmed);
    if (isHeaderLabel && !isDescription && !isDescriptionVi) {
      continue;
    }

    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const rawKey = match[1].trim().toLowerCase();
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1).trim();
      }

      if (rawKey.includes('description_vi') || rawKey.includes('mo ta tieng viet') || rawKey.includes('mô tả tiếng việt')) {
        isDescriptionVi = true;
        isDescription = false;
        if (val) descriptionViLines.push(val);
      } else if (rawKey.includes('mô tả') || rawKey.includes('mo ta') || rawKey === 'description') {
        isDescription = true;
        isDescriptionVi = false;
        if (val) descriptionLines.push(val);
      } else if (
        rawKey.includes('tên') ||
        rawKey.includes('ten') ||
        rawKey.includes('title') ||
        rawKey.includes('name') ||
        rawKey === 'project'
      ) {
        data.title = val;
      } else if (rawKey.includes('địa điểm') || rawKey.includes('dia diem') || rawKey === 'location') {
        data.location = val;
      } else if (rawKey.includes('năm') || rawKey.includes('nam') || rawKey === 'year' || rawKey === 'completionyear') {
        data.completionYear = val;
      } else if (rawKey.includes('vai trò') || rawKey.includes('vai tro') || rawKey === 'role') {
        data.role = val;
      } else if (
        rawKey.includes('kiến trúc') ||
        rawKey.includes('kien truc') ||
        rawKey.includes('văn phòng') ||
        rawKey.includes('van phong') ||
        rawKey.includes('architect') ||
        rawKey.includes('office')
      ) {
        data.architect = val;
        data.office = val;
      } else if (rawKey.includes('thể loại') || rawKey.includes('the loai') || rawKey === 'category') {
        data.category = val;
      } else if (rawKey.includes('loại hình') || rawKey.includes('loai hinh') || rawKey === 'typology') {
        data.typology = val;
      } else if (rawKey.includes('tình trạng') || rawKey.includes('tinh trang') || rawKey === 'status') {
        data.status = val;
      } else if (rawKey.includes('phạm vi') || rawKey.includes('pham vi') || rawKey.includes('scope')) {
        data.scope = val;
      } else if (
        rawKey.includes('quy mô') ||
        rawKey.includes('quy mo') ||
        rawKey.includes('diện tích') ||
        rawKey.includes('dien tich') ||
        rawKey.includes('gross') ||
        rawKey.includes('area') ||
        rawKey.includes('gfa') ||
        rawKey === 'grossarea'
      ) {
        data.grossArea = val;
      } else if (rawKey.includes('thứ tự') || rawKey.includes('thu tu') || rawKey === 'order') {
        data.order = parseInt(val, 10) || 0;
      } else {
        data[rawKey] = val;
      }
    } else {
      if (isDescriptionVi) {
        descriptionViLines.push(trimmed);
      } else if (isDescription) {
        descriptionLines.push(trimmed);
      } else if (!data.title) {
        data.title = trimmed.replace(/^["']|["']$/g, '');
      } else {
        descriptionLines.push(trimmed);
      }
    }
  }

  if (descriptionLines.length > 0) {
    data.description = descriptionLines.join('\n').trim();
  }
  if (descriptionViLines.length > 0) {
    data.descriptionVi = descriptionViLines.join('\n').trim();
  }

  return data;
}

async function loadUserProjects() {
  const projects = [];

  // 1. Scan root projects/ folder
  if (fs.existsSync(userProjectsDir)) {
    const entries = fs.readdirSync(userProjectsDir);

    for (const entry of entries) {
      if (entry.startsWith('_') || entry.startsWith('.')) continue;

      const folderPath = path.join(userProjectsDir, entry);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const files = fs.readdirSync(folderPath);
      const textFile = files.find(f => f.endsWith('.txt') || f.endsWith('.md'));
      const imageFiles = files
        .filter(f => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
        .sort((a, b) => {
          if (/^(cover|bia|front|hero|main)/i.test(a)) return -1;
          if (/^(cover|bia|front|hero|main)/i.test(b)) return 1;
          return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
        });

      let projectData = {};
      if (textFile) {
        const fileContent = fs.readFileSync(path.join(folderPath, textFile), 'utf8');
        if (fileContent.trim().startsWith('---')) {
          const parsed = matter(fileContent);
          projectData = { ...parsed.data, description: parsed.content.trim() };
        } else {
          projectData = parsePlainText(fileContent);
        }
      }

      const rawTitle = projectData.title || entry;
      const cleanTitle = rawTitle.replace(/^["']|["']$/g, '').trim();
      const slug = projectData.slug || slugify(cleanTitle || entry);
      const title = cleanTitle;

      // Copy images to public/images/projects/[slug]
      const targetDir = path.join(publicProjectsDir, slug);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const webImagePaths = [];
      const drawingImages = [];
      const interiorImages = [];
      let coverImagePath = '';

      for (const img of imageFiles) {
        const cleanFileName = img.replace(/\s+/g, '-');
        const srcPath = path.join(folderPath, img);
        const destPath = path.join(targetDir, cleanFileName);
        fs.copyFileSync(srcPath, destPath);

        const webPath = `/images/projects/${slug}/${cleanFileName}`;
        webImagePaths.push(webPath);

        if (!coverImagePath && /^(cover|bia|front|hero|main)/i.test(cleanFileName)) {
          coverImagePath = webPath;
        }

        if (/(draw|plan|section|elevation|ban-ve|mat-bang|mat-cat|mat-dung)/i.test(cleanFileName)) {
          drawingImages.push(webPath);
        } else if (/(interior|noi-that|noi that)/i.test(cleanFileName)) {
          interiorImages.push(webPath);
        }
      }

      if (!coverImagePath && webImagePaths.length > 0) {
        coverImagePath = webImagePaths[0];
      }

      projects.push({
        title,
        slug,
        location: projectData.location || '',
        architect: projectData.architect || projectData.office || '',
        office: projectData.office || projectData.architect || '',
        status: projectData.status || '',
        scope: projectData.scope || '',
        role: projectData.role || '',
        category: projectData.category || 'Architecture',
        typology: projectData.typology || 'Residential',
        completionYear: projectData.completionYear ? String(projectData.completionYear) : '',
        grossArea: projectData.grossArea || '',
        span: projectData.span || 'md:col-span-1 md:row-span-1',
        description: projectData.description || '',
        descriptionVi: projectData.descriptionVi || '',
        order: typeof projectData.order === 'number' ? projectData.order : projects.length,
        img: coverImagePath || projectData.img || '',
        gallery: webImagePaths,
        architectureGallery: webImagePaths.filter(p => !drawingImages.includes(p) && !interiorImages.includes(p)),
        drawingGallery: drawingImages,
        interiorGallery: interiorImages,
      });
    }
  }

  // 2. Scan legacy content/projects/ if any user markdown files exist
  if (fs.existsSync(legacyProjectsDir)) {
    const legacyFiles = fs.readdirSync(legacyProjectsDir).filter(f => f.endsWith('.md'));
    for (const fileName of legacyFiles) {
      const fullPath = path.join(legacyProjectsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);
      projects.push(matterResult.data);
    }
  }

  return projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

async function build() {
  const projects = await loadUserProjects();

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

  const parsedWriting = await loadArticlesFromDir({
    userDir: userWritingDir,
    legacyDir: legacyResearchDir,
    publicDir: publicWritingDir,
    defaultCategory: 'Research',
    urlPrefix: '/images/writing',
  });

  const parsedTools = await loadArticlesFromDir({
    userDir: userToolsDir,
    legacyDir: legacyToolsDir,
    publicDir: publicToolsDir,
    defaultCategory: 'Tool',
    urlPrefix: '/images/tools',
  });

  const research = [...parsedWriting, ...parsedTools].sort((a, b) => {
    const timeA = a.date ? new Date(a.date).getTime() : 0;
    const timeB = b.date ? new Date(b.date).getTime() : 0;
    return timeB - timeA;
  });

  const outputPath = path.join(__dirname, '../lib/cms-data.json');
  fs.writeFileSync(outputPath, JSON.stringify({ projects, logData, research }, null, 2));
  console.log(`CMS data built to lib/cms-data.json: ${projects.length} projects, ${research.length} articles`);
}

async function loadArticlesFromDir({ userDir, legacyDir, publicDir, defaultCategory, urlPrefix }) {
  const articles = [];
  const processedSlugs = new Set();

  async function processEntry(dirPath, entryName) {
    if (entryName.startsWith('_') || entryName.startsWith('.')) return null;

    const fullPath = path.join(dirPath, entryName);
    const stat = fs.statSync(fullPath);

    let fileContent = '';
    let slug = '';
    let localImages = [];
    let entryFolder = null;

    if (stat.isDirectory()) {
      entryFolder = fullPath;
      const files = fs.readdirSync(fullPath);
      const textFile = files.find(f => f.endsWith('.md') || f.endsWith('.txt'));
      if (!textFile) return null;

      fileContent = fs.readFileSync(path.join(fullPath, textFile), 'utf8');
      slug = entryName;
      localImages = files.filter(f => /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f));
    } else if (entryName.endsWith('.md') || entryName.endsWith('.txt')) {
      fileContent = fs.readFileSync(fullPath, 'utf8');
      slug = entryName.replace(/\.(md|txt)$/, '');
    } else {
      return null;
    }

    const matterResult = matter(fileContent);
    const data = matterResult.data || {};
    let content = matterResult.content || '';

    if (data.slug) {
      slug = data.slug;
    } else if (!slug) {
      slug = slugify(data.title || entryName);
    }

    if (processedSlugs.has(slug)) return null;
    processedSlugs.add(slug);

    // If there is a subfolder with local images, copy them to publicDir/[slug]
    let coverImagePath = '';
    if (entryFolder && localImages.length > 0) {
      const targetDir = path.join(publicDir, slug);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      for (const img of localImages) {
        const cleanFileName = img.replace(/\s+/g, '-');
        const srcPath = path.join(entryFolder, img);
        const destPath = path.join(targetDir, cleanFileName);
        fs.copyFileSync(srcPath, destPath);

        const webPath = `${urlPrefix}/${slug}/${cleanFileName}`;
        if (!coverImagePath && /^(cover|bia|front|hero|main)/i.test(cleanFileName)) {
          coverImagePath = webPath;
        }

        // Remap any relative markdown image references
        const escapedImg = img.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        content = content.replace(new RegExp(`(!\\[.*?\\]\\()(\\./)?${escapedImg}(\\))`, 'g'), `$1${webPath}$3`);
      }

      if (!coverImagePath && localImages.length > 0) {
        coverImagePath = `${urlPrefix}/${slug}/${localImages[0].replace(/\s+/g, '-')}`;
      }
    }

    // Resolve cover image
    let img = data.img || '';
    if (coverImagePath && (!img || (!img.startsWith('/') && !img.startsWith('http')))) {
      img = coverImagePath;
    } else if (img && !img.startsWith('/') && !img.startsWith('http') && entryFolder) {
      img = `${urlPrefix}/${slug}/${img.replace(/\s+/g, '-')}`;
    }

    const processedContent = await remark().use(html).process(content);
    const contentHtml = processedContent.toString();

    // If still no cover image, try extracting first image from markdown body
    if (!img) {
      const imgRegex = /!\[.*?\]\((.*?)\)/;
      const match = content.match(imgRegex);
      if (match) img = match[1];
    }

    return {
      title: data.title || entryName,
      slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      img: img || '',
      featured: data.featured ?? true,
      category: data.category || defaultCategory,
      contentHtml,
    };
  }

  // 1. Scan user root directory if exists
  if (fs.existsSync(userDir)) {
    const entries = fs.readdirSync(userDir);
    for (const entry of entries) {
      const item = await processEntry(userDir, entry);
      if (item) articles.push(item);
    }
  }

  // 2. Scan legacy directory if exists and slug hasn't been added
  if (fs.existsSync(legacyDir)) {
    const entries = fs.readdirSync(legacyDir);
    for (const entry of entries) {
      const item = await processEntry(legacyDir, entry);
      if (item) articles.push(item);
    }
  }

  return articles;
}

build().catch(console.error);
