#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function convertMdToHtml(mdFilePath, outputFilePath) {
  const mdContent = fs.readFileSync(mdFilePath, 'utf-8');
  const fileName = path.basename(mdFilePath, '.md');

  const htmlContent = generateHtml(mdContent, fileName);

  fs.writeFileSync(outputFilePath, htmlContent, 'utf-8');
  console.log(`Generated: ${outputFilePath}`);
}

function generateHtml(mdContent, fileName) {
  const bodyHtml = markdownToHtml(mdContent);
  const toc = generateToc(mdContent);

  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(extractTitle(mdContent))}</title>
<style>
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --bg-card: #ffffff;
  --bg-sidebar: #f1f3f5;
  --bg-hover: #e9ecef;
  --bg-code: #f1f3f5;
  --bg-table-header: #f8f9fa;
  --bg-table-stripe: #f8f9fa;
  --bg-blockquote: #f0f7ff;
  --bg-tag: #e3f2fd;
  --text-primary: #212529;
  --text-secondary: #495057;
  --text-muted: #868e96;
  --text-link: #1971c2;
  --border-color: #dee2e6;
  --border-light: #e9ecef;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  --accent: #1971c2;
  --accent-light: #d0ebff;
  --danger: #e03131;
  --danger-light: #ffe3e3;
  --success: #2f9e44;
  --success-light: #d3f9d8;
  --warning: #e8590c;
  --warning-light: #fff4e6;
  --info: #1098ad;
  --info-light: #c5f6fa;
  --radius: 8px;
  --radius-lg: 12px;
  --transition: 0.3s ease;
}

[data-theme="dark"] {
  --bg-primary: #1a1b1e;
  --bg-secondary: #25262b;
  --bg-card: #2c2e33;
  --bg-sidebar: #25262b;
  --bg-hover: #373a40;
  --bg-code: #373a40;
  --bg-table-header: #373a40;
  --bg-table-stripe: #25262b;
  --bg-blockquote: #1b3a5c;
  --bg-tag: #1b3a5c;
  --text-primary: #e9ecef;
  --text-secondary: #adb5bd;
  --text-muted: #868e96;
  --text-link: #74c0fc;
  --border-color: #373a40;
  --border-light: #373a40;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
  --accent: #74c0fc;
  --accent-light: #1b3a5c;
  --danger: #ff8787;
  --danger-light: #3b1111;
  --success: #69db7c;
  --success-light: #1b3b1b;
  --warning: #ffa94d;
  --warning-light: #3b2a11;
  --info: #66d9e8;
  --info-light: #113b3b;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif;
  background: var(--bg-secondary);
  color: var(--text-primary);
  line-height: 1.8;
  transition: background var(--transition), color var(--transition);
}

.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
  transition: transform var(--transition), background var(--transition);
  padding: 20px 0;
}

.sidebar-header {
  padding: 0 20px 16px;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 12px;
}

.sidebar-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--accent);
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-title svg { width: 20px; height: 20px; }

.toc-list { list-style: none; padding: 0 8px; }

.toc-item {
  margin-bottom: 2px;
}

.toc-link {
  display: block;
  padding: 6px 16px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  border-radius: 6px;
  transition: all var(--transition);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toc-link:hover {
  background: var(--bg-hover);
  color: var(--accent);
}

.toc-link.active {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
}

.toc-h3 { padding-left: 32px; font-size: 12px; }

.main-content {
  flex: 1;
  margin-left: 280px;
  padding: 32px 48px;
  max-width: 960px;
}

.toolbar {
  position: fixed;
  top: 16px;
  right: 24px;
  z-index: 200;
  display: flex;
  gap: 8px;
}

.toolbar-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--border-color);
  background: var(--bg-card);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  box-shadow: var(--shadow-sm);
}

.toolbar-btn:hover {
  background: var(--bg-hover);
  color: var(--accent);
  box-shadow: var(--shadow-md);
}

.toolbar-btn svg { width: 18px; height: 18px; }

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 200;
}

h1 {
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 8px;
  color: var(--text-primary);
  letter-spacing: -0.5px;
}

h1 + blockquote {
  margin-bottom: 24px;
}

h2 {
  font-size: 22px;
  font-weight: 700;
  margin-top: 48px;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--accent);
  color: var(--text-primary);
  scroll-margin-top: 24px;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 32px;
  margin-bottom: 12px;
  color: var(--text-primary);
  scroll-margin-top: 24px;
}

h4 {
  font-size: 15px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 8px;
  color: var(--text-secondary);
}

p { margin-bottom: 12px; }

blockquote {
  background: var(--bg-blockquote);
  border-left: 4px solid var(--accent);
  padding: 12px 20px;
  margin: 16px 0;
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--text-secondary);
  font-style: italic;
}

blockquote strong { color: var(--text-primary); font-style: normal; }

hr {
  border: none;
  height: 1px;
  background: var(--border-color);
  margin: 32px 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 13.5px;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

thead { background: var(--bg-table-header); }

th {
  padding: 10px 14px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
}

td {
  padding: 9px 14px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
}

tbody tr:nth-child(even) { background: var(--bg-table-stripe); }
tbody tr:hover { background: var(--bg-hover); }

code {
  background: var(--bg-code);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.9em;
  font-family: "JetBrains Mono", "Fira Code", "Cascadia Code", monospace;
}

pre {
  background: var(--bg-code);
  padding: 16px 20px;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 16px 0;
  font-size: 13px;
  line-height: 1.6;
}

pre code { background: none; padding: 0; }

ul, ol { padding-left: 24px; margin-bottom: 12px; }
li { margin-bottom: 4px; }

strong { font-weight: 600; color: var(--text-primary); }

em { color: var(--text-secondary); }

a { color: var(--text-link); text-decoration: none; }
a:hover { text-decoration: underline; }

.tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.tag-danger { background: var(--danger-light); color: var(--danger); }
.tag-success { background: var(--success-light); color: var(--success); }
.tag-warning { background: var(--warning-light); color: var(--warning); }
.tag-info { background: var(--info-light); color: var(--info); }

.section-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  margin: 20px 0;
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition), background var(--transition);
}

.section-card:hover { box-shadow: var(--shadow-md); }

.section-card h3,
.section-card h4 { margin-top: 0; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.info-item {
  background: var(--bg-secondary);
  border-radius: var(--radius);
  padding: 12px 16px;
  border: 1px solid var(--border-light);
}

.info-label {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 4px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.sihua-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 16px 0;
}

.sihua-card {
  border-radius: var(--radius);
  padding: 16px;
  text-align: center;
  border: 1px solid var(--border-light);
}

.sihua-card.lu { background: var(--success-light); }
.sihua-card.quan { background: var(--warning-light); }
.sihua-card.ke { background: var(--info-light); }
.sihua-card.ji { background: var(--danger-light); }

.sihua-label { font-size: 12px; font-weight: 600; margin-bottom: 4px; }
.sihua-star { font-size: 18px; font-weight: 700; }
.sihua-palace { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

.sihua-card.lu .sihua-label { color: var(--success); }
.sihua-card.quan .sihua-label { color: var(--warning); }
.sihua-card.ke .sihua-label { color: var(--info); }
.sihua-card.ji .sihua-label { color: var(--danger); }
.sihua-card.lu .sihua-star { color: var(--success); }
.sihua-card.quan .sihua-star { color: var(--warning); }
.sihua-card.ke .sihua-star { color: var(--info); }
.sihua-card.ji .sihua-star { color: var(--danger); }

.palace-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 24px 28px;
  margin: 24px 0;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition);
}

.palace-card:hover { box-shadow: var(--shadow-md); }

.palace-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.palace-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
}

.palace-stars {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.star-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.star-badge.bright { background: var(--success-light); color: var(--success); border-color: var(--success); }
.star-badge.normal { background: var(--warning-light); color: var(--warning); border-color: var(--warning); }
.star-badge.dim { background: var(--danger-light); color: var(--danger); border-color: var(--danger); }

.star-badge.hua-lu { background: var(--success-light); color: var(--success); border-color: var(--success); }
.star-badge.hua-quan { background: var(--warning-light); color: var(--warning); border-color: var(--warning); }
.star-badge.hua-ke { background: var(--info-light); color: var(--info); border-color: var(--info); }
.star-badge.hua-ji { background: var(--danger-light); color: var(--danger); border-color: var(--danger); }

.interpretation-block {
  margin: 16px 0;
  padding: 16px 20px;
  border-radius: var(--radius);
}

.interpretation-block.pro {
  background: var(--bg-secondary);
  border-left: 4px solid var(--accent);
}

.interpretation-block.lay {
  background: var(--bg-blockquote);
  border-left: 4px solid var(--success);
}

.interpretation-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.interpretation-block.pro .interpretation-label { color: var(--accent); }
.interpretation-block.lay .interpretation-label { color: var(--success); }

.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition);
  z-index: 150;
}

.back-to-top:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.back-to-top.visible { display: flex; }
.back-to-top svg { width: 20px; height: 20px; }

@media (max-width: 900px) {
  .sidebar { transform: translateX(-100%); }
  .sidebar.open { transform: translateX(0); }
  .main-content { margin-left: 0; padding: 24px 16px; padding-top: 64px; }
  .mobile-menu-btn { display: flex; }
  .sihua-grid { grid-template-columns: repeat(2, 1fr); }
  .info-grid { grid-template-columns: repeat(2, 1fr); }
}

@media print {
  .sidebar, .toolbar, .back-to-top, .mobile-menu-btn { display: none !important; }
  .main-content { margin-left: 0; padding: 0; }
  body { background: white; color: black; }
  .section-card, .palace-card { box-shadow: none; border: 1px solid #ddd; }
}
</style>
</head>
<body>

<button class="mobile-menu-btn toolbar-btn" onclick="toggleSidebar()" aria-label="Menu">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
</button>

<div class="toolbar">
  <button class="toolbar-btn" onclick="toggleTheme()" id="themeBtn" aria-label="Toggle theme">
    <svg id="themeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </button>
</div>

<div class="layout">
  <nav class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
        紫微斗数命盘
      </div>
    </div>
    <ul class="toc-list" id="tocList">
${toc}
    </ul>
  </nav>

  <main class="main-content" id="mainContent">
${bodyHtml}
  </main>
</div>

<button class="back-to-top" id="backToTop" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
</button>

<script>
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  html.setAttribute('data-theme', next);
  localStorage.setItem('ziwei-theme', next);
  updateThemeIcon(next);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('themeIcon');
  if (theme === 'dark') {
    icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
  } else {
    icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

const saved = localStorage.getItem('ziwei-theme');
if (saved) {
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
}

const headings = document.querySelectorAll('h2, h3');
const tocLinks = document.querySelectorAll('.toc-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tocLinks.forEach(l => l.classList.remove('active'));
      const id = entry.target.id;
      const link = document.querySelector('.toc-link[href="#' + id + '"]');
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 });

headings.forEach(h => observer.observe(h));

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

document.querySelectorAll('.toc-link').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 900) {
      document.getElementById('sidebar').classList.remove('open');
    }
  });
});
</script>
</body>
</html>`;
}

function extractTitle(md) {
  const m = md.match(/^#\s+(.+)/);
  return m ? m[1].trim() : '紫微斗数命盘详析';
}

function generateToc(md) {
  const lines = md.split('\n');
  const items = [];
  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      const text = h2[1].trim();
      const id = slugify(text);
      items.push(`<li class="toc-item"><a class="toc-link" href="#${id}">${escapeHtml(text)}</a></li>`);
      continue;
    }
    const h3 = line.match(/^###\s+(\d+\.?\s*.+)/);
    if (h3) {
      const text = h3[1].trim();
      const id = slugify(text);
      items.push(`<li class="toc-item"><a class="toc-link toc-h3" href="#${id}">${escapeHtml(text)}</a></li>`);
    }
  }
  return items.join('\n');
}

function slugify(text) {
  return text
    .replace(/^[#\s]+/, '')
    .replace(/[（()）\[\]·、：:，,。.！!？?\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/"/g, '');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function markdownToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inTable = false;
  let tableRows = [];
  let tableHeaders = [];
  let inCodeBlock = false;
  let codeContent = '';
  let inList = false;
  let listType = '';
  let skipNext = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

    if (skipNext) { skipNext = false; continue; }

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        html += `<pre><code>${escapeHtml(codeContent.trim())}</code></pre>`;
        codeContent = '';
        inCodeBlock = false;
      } else {
        if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
        if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) { codeContent += line + '\n'; continue; }

    if (line.match(/^\|.*\|/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (!inTable) { inTable = true; tableHeaders = []; tableRows = []; }
      const cells = parseTableRow(line);
      if (nextLine.match(/^\|[\s\-:|]+\|/) && tableHeaders.length === 0 && tableRows.length === 0) {
        tableHeaders = cells;
        skipNext = true;
      } else if (!line.match(/^\|[\s\-:|]+\|/)) {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      html += buildTable(tableHeaders, tableRows);
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    if (line.match(/^#{1,4}\s/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      const match = line.match(/^(#{1,4})\s+(.+)/);
      if (match) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = slugify(text);
        const content = inlineFormat(text);

        if (level === 2) {
          html += `</div><h2 id="${id}">${content}</h2>`;
        } else if (level === 3) {
          html += `</div><h3 id="${id}">${content}</h3>`;
        } else if (level === 4) {
          html += `<h4>${content}</h4>`;
        } else {
          html += `<h1 id="${id}">${content}</h1>`;
        }
      }
      continue;
    }

    if (line.match(/^>\s?/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      const text = line.replace(/^>\s?/, '').trim();
      html += `<blockquote>${inlineFormat(text)}</blockquote>`;
      continue;
    }

    if (line.match(/^---+/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      html += '<hr>';
      continue;
    }

    if (line.match(/^[-*]\s+/)) {
      if (inList && listType !== 'ul') { html += '</ol>'; inList = false; }
      if (!inList) { html += '<ul>'; inList = true; listType = 'ul'; }
      const text = line.replace(/^[-*]\s+/, '').trim();
      html += `<li>${inlineFormat(text)}</li>`;
      continue;
    }

    if (line.match(/^\d+\.\s+/)) {
      if (inList && listType !== 'ol') { html += '</ul>'; inList = false; }
      if (!inList) { html += '<ol>'; inList = true; listType = 'ol'; }
      const text = line.replace(/^\d+\.\s+/, '').trim();
      html += `<li>${inlineFormat(text)}</li>`;
      continue;
    }

    if (inList && line.trim() === '') {
      html += listType === 'ul' ? '</ul>' : '</ol>';
      inList = false;
    }

    if (line.trim() === '') {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      continue;
    }

    if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }

    html += `<p>${inlineFormat(line.trim())}</p>`;
  }

  if (inTable) { html += buildTable(tableHeaders, tableRows); }
  if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; }
  if (inCodeBlock) { html += `<pre><code>${escapeHtml(codeContent.trim())}</code></pre>`; }

  html = enhanceHtml(html);
  return html;
}

function parseTableRow(line) {
  return line.split('|').slice(1, -1).map(c => c.trim());
}

function buildTable(headers, rows) {
  let html = '<div style="overflow-x:auto"><table><thead><tr>';
  headers.forEach(h => { html += `<th>${inlineFormat(h)}</th>`; });
  html += '</tr></thead><tbody>';
  rows.forEach(row => {
    html += '<tr>';
    row.forEach((cell, ci) => {
      const content = inlineFormat(cell);
      html += `<td>${content}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function inlineFormat(text) {
  text = escapeHtml(text);
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/`(.+?)`/g, '<code>$1</code>');

  text = text.replace(/（庙）/g, '<span class="star-badge bright">庙</span>');
  text = text.replace(/（旺）/g, '<span class="star-badge bright">旺</span>');
  text = text.replace(/（平）/g, '<span class="star-badge normal">平</span>');
  text = text.replace(/（利）/g, '<span class="star-badge normal">利</span>');
  text = text.replace(/（得）/g, '<span class="star-badge normal">得</span>');
  text = text.replace(/（陷）/g, '<span class="star-badge dim">陷</span>');
  text = text.replace(/（不）/g, '<span class="star-badge dim">不</span>');

  text = text.replace(/\[禄\]/g, '<span class="star-badge hua-lu">禄</span>');
  text = text.replace(/\[权\]/g, '<span class="star-badge hua-quan">权</span>');
  text = text.replace(/\[科\]/g, '<span class="star-badge hua-ke">科</span>');
  text = text.replace(/\[忌\]/g, '<span class="star-badge hua-ji">忌</span>');

  text = text.replace(/化禄/g, '<span class="tag tag-success">化禄</span>');
  text = text.replace(/化权/g, '<span class="tag tag-warning">化权</span>');
  text = text.replace(/化科/g, '<span class="tag tag-info">化科</span>');
  text = text.replace(/化忌/g, '<span class="tag tag-danger">化忌</span>');

  return text;
}

function enhanceHtml(html) {
  html = html.replace(
    /<h2[^>]*>([^<]*一、基本信息[^<]*)<\/h2>/,
    (match, title) => {
      return match;
    }
  );

  html = html.replace(
    /<h2[^>]*>([^<]*三、生年四化[^<]*)<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/,
    (match, title, content) => {
      return `${match}${content}`;
    }
  );

  html = html.replace(
    /【专业解读】([\s\S]*?)(?=【通俗解析】|<\/div>|<h[234]|$)/g,
    (match, content) => {
      return `<div class="interpretation-block pro"><div class="interpretation-label">专业解读</div>${content.trim()}</div>`;
    }
  );

  html = html.replace(
    /【通俗解析】([\s\S]*?)(?=<\/div>|<h[234]|$)/g,
    (match, content) => {
      return `<div class="interpretation-block lay"><div class="interpretation-label">通俗解析</div>${content.trim()}</div>`;
    }
  );

  return html;
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node md2html.js <input.md> [output.html]');
  console.log('  If output is not specified, output to same directory with .html extension');
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
const outputPath = args[1] ? path.resolve(args[1]) : inputPath.replace(/\.md$/, '.html');

if (!fs.existsSync(inputPath)) {
  console.error(`Error: File not found: ${inputPath}`);
  process.exit(1);
}

convertMdToHtml(inputPath, outputPath);
