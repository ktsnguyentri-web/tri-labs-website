const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'content', 'projects');
const logsDir = path.join(__dirname, 'content', 'logs');

fs.mkdirSync(projectsDir, { recursive: true });
fs.mkdirSync(logsDir, { recursive: true });

const works = [
  { span: "md:col-span-2 md:row-span-2", title: "Shenzhen Bay Culture Park", location: "SHENZHEN, CHINA", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" },
  { span: "md:col-span-1 md:row-span-1", title: "Harbin Opera House", location: "HARBIN, CHINA", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" },
  { span: "md:col-span-1 md:row-span-2", title: "Absolute Towers", location: "MISSISSAUGA, CANADA", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" },
  { span: "md:col-span-1 md:row-span-1", title: "Ordos Museum", location: "ORDOS, CHINA", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80" },
  { span: "md:col-span-2 md:row-span-1", title: "Huzhou Sheraton", location: "HUZHOU, CHINA", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" },
  { span: "md:col-span-1 md:row-span-2", title: "Chaoyang Park Plaza", location: "BEIJING, CHINA", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" },
  { span: "md:col-span-1 md:row-span-1", title: "Huangshan Mountain Village", location: "HUANGSHAN, CHINA", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80" },
  { span: "md:col-span-2 md:row-span-1", title: "Clover House", location: "OKAZAKI, JAPAN", img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80" },
  { span: "md:col-span-1 md:row-span-1", title: "Nanjing Zendai Himalayas", location: "NANJING, CHINA", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80" },
];

works.forEach((work, idx) => {
  const filename = `${String(idx + 1).padStart(2, '0')}-${work.title.toLowerCase().replace(/\s+/g, '-')}.md`;
  const content = `---
title: "${work.title}"
location: "${work.location}"
span: "${work.span}"
img: "${work.img}"
order: ${idx + 1}
---
`;
  fs.writeFileSync(path.join(projectsDir, filename), content);
});

const featuredLog = {
  date: "2023-10-15",
  title: "Parametric Optimization in High-Density Urban Cores",
  desc: "Exploring computational methodologies to maximize daylight and natural ventilation in ultra-dense urban environments without compromising structural integrity. By bridging the tactile qualities of raw concrete with the precision of data-driven modeling, we establish a new paradigm for the Brutalist digital twin.",
  img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80"
};

const logContent = `---
title: "${featuredLog.title}"
date: "${featuredLog.date}"
img: "${featuredLog.img}"
---
${featuredLog.desc}
`;
fs.writeFileSync(path.join(logsDir, 'parametric-optimization.md'), logContent);

console.log('CMS data generated successfully.');
