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
  const chartData = extractChartData(mdContent);

  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(extractTitle(mdContent))}</title>
<style>
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f7f7f5;
  --bg-sidebar: #f7f7f5;
  --bg-card: #ffffff;
  --bg-hover: rgba(55,53,47,0.08);
  --bg-hover-strong: rgba(55,53,47,0.12);
  --bg-code: #f7f7f5;
  --bg-table-header: #f7f7f5;
  --bg-table-stripe: rgba(55,53,47,0.024);
  --bg-blockquote: rgba(35,131,226,0.04);
  --bg-overlay: rgba(15,15,15,0.6);
  --text-primary: #37352f;
  --text-secondary: #787774;
  --text-muted: #b4b4b0;
  --text-link: #2383e2;
  --text-link-hover: #1b6ec2;
  --border-color: #e9e9e7;
  --border-light: #ededec;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 14px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.12);
  --shadow-xl: 0 12px 40px rgba(0,0,0,0.16);
  --accent: #2383e2;
  --accent-light: rgba(35,131,226,0.08);
  --accent-medium: rgba(35,131,226,0.14);
  --danger: #eb5757;
  --danger-light: rgba(235,87,87,0.08);
  --success: #4dab5c;
  --success-light: rgba(77,171,92,0.08);
  --warning: #e8912d;
  --warning-light: rgba(232,145,45,0.08);
  --info: #3b82f6;
  --info-light: rgba(59,130,246,0.08);
  --radius: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;
  --transition: 0.2s cubic-bezier(0.4,0,0.2,1);
  --sidebar-width: 260px;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Menlo, monospace;
  --chart-lu: #4dab5c;
  --chart-quan: #e8912d;
  --chart-ke: #3b82f6;
  --chart-ji: #eb5757;
  --chart-miao-bg: rgba(77,171,92,0.1);
  --chart-ping-bg: rgba(232,145,45,0.1);
  --chart-xian-bg: rgba(235,87,87,0.1);
}

[data-theme="dark"] {
  --bg-primary: #191919;
  --bg-secondary: #202020;
  --bg-sidebar: #202020;
  --bg-card: #252525;
  --bg-hover: rgba(255,255,255,0.055);
  --bg-hover-strong: rgba(255,255,255,0.09);
  --bg-code: #2a2a2a;
  --bg-table-header: #2a2a2a;
  --bg-table-stripe: rgba(255,255,255,0.02);
  --bg-blockquote: rgba(82,156,202,0.06);
  --bg-overlay: rgba(0,0,0,0.7);
  --text-primary: #e8e8e4;
  --text-secondary: #9b9b97;
  --text-muted: #6b6b67;
  --text-link: #529cca;
  --text-link-hover: #6db3d8;
  --border-color: #2f2f2f;
  --border-light: #333333;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.2);
  --shadow-md: 0 4px 14px rgba(0,0,0,0.3);
  --shadow-lg: 0 8px 30px rgba(0,0,0,0.4);
  --shadow-xl: 0 12px 40px rgba(0,0,0,0.5);
  --accent: #529cca;
  --accent-light: rgba(82,156,202,0.1);
  --accent-medium: rgba(82,156,202,0.18);
  --danger: #f87171;
  --danger-light: rgba(248,113,113,0.1);
  --success: #6ee77a;
  --success-light: rgba(110,231,122,0.1);
  --warning: #fbbf24;
  --warning-light: rgba(251,191,36,0.1);
  --info: #60a5fa;
  --info-light: rgba(96,165,250,0.1);
  --chart-lu: #6ee77a;
  --chart-quan: #fbbf24;
  --chart-ke: #60a5fa;
  --chart-ji: #f87171;
  --chart-miao-bg: rgba(110,231,122,0.12);
  --chart-ping-bg: rgba(251,191,36,0.12);
  --chart-xian-bg: rgba(248,113,113,0.12);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.75;
  font-size: 15px;
  transition: background var(--transition), color var(--transition);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background: var(--accent-medium);
  color: var(--text-primary);
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
  z-index: 100;
  transition: transform var(--transition), background var(--transition);
  padding: 16px 0;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
}

.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 4px; }

.sidebar-header {
  padding: 8px 16px 14px;
  margin-bottom: 4px;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: -0.01em;
}

.sidebar-title svg { width: 18px; height: 18px; color: var(--accent); flex-shrink: 0; }

.toc-list { list-style: none; padding: 0 6px; }

.toc-item { margin-bottom: 1px; }

.toc-link {
  display: block;
  padding: 5px 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px;
  border-radius: var(--radius);
  transition: all var(--transition);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}

.toc-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.toc-link.active {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
}

.toc-h3 { padding-left: 28px; font-size: 12.5px; }

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: 99;
  opacity: 0;
  transition: opacity var(--transition);
}

.sidebar-overlay.visible {
  opacity: 1;
}

.main-content {
  margin-left: var(--sidebar-width);
  padding: 40px 48px 80px;
  max-width: 820px;
  min-height: 100vh;
  transition: margin-left var(--transition);
}

.toolbar {
  position: fixed;
  top: 14px;
  right: 20px;
  z-index: 200;
  display: flex;
  gap: 6px;
}

.toolbar-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
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
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
  border-color: var(--border-light);
}

.toolbar-btn svg { width: 16px; height: 16px; }

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 200;
}

h1 {
  font-size: 32px;
  font-weight: 800;
  margin-bottom: 6px;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.3;
}

h1 + blockquote { margin-bottom: 28px; }

h2 {
  font-size: 22px;
  font-weight: 700;
  margin-top: 52px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  scroll-margin-top: 24px;
  letter-spacing: -0.02em;
  line-height: 1.35;
}

h3 {
  font-size: 17px;
  font-weight: 650;
  margin-top: 32px;
  margin-bottom: 10px;
  color: var(--text-primary);
  scroll-margin-top: 24px;
  line-height: 1.4;
}

h4 {
  font-size: 14.5px;
  font-weight: 650;
  margin-top: 20px;
  margin-bottom: 6px;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

p { margin-bottom: 10px; }

blockquote {
  background: var(--bg-blockquote);
  border-left: 3px solid var(--accent);
  padding: 10px 18px;
  margin: 14px 0;
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--text-secondary);
  font-size: 14px;
}

blockquote strong { color: var(--text-primary); font-style: normal; }

hr {
  border: none;
  height: 1px;
  background: var(--border-color);
  margin: 36px 0;
}

.table-wrapper {
  overflow-x: auto;
  margin: 14px 0;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

thead { background: var(--bg-table-header); }

th {
  padding: 9px 14px;
  text-align: left;
  font-weight: 600;
  font-size: 12.5px;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-color);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

td {
  padding: 8px 14px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 13.5px;
}

tbody tr:last-child td { border-bottom: none; }
tbody tr:nth-child(even) { background: var(--bg-table-stripe); }
tbody tr:hover { background: var(--bg-hover); }

code {
  background: var(--bg-code);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.88em;
  font-family: var(--font-mono);
  color: var(--text-primary);
}

pre {
  background: var(--bg-code);
  padding: 16px 20px;
  border-radius: var(--radius-lg);
  overflow-x: auto;
  margin: 14px 0;
  font-size: 13px;
  line-height: 1.6;
  border: 1px solid var(--border-color);
}

pre code { background: none; padding: 0; border: none; }

ul, ol { padding-left: 22px; margin-bottom: 10px; }
li { margin-bottom: 3px; }

strong { font-weight: 650; color: var(--text-primary); }
em { color: var(--text-secondary); }

a { color: var(--text-link); text-decoration: none; transition: color var(--transition); }
a:hover { color: var(--text-link-hover); text-decoration: underline; }

.tag {
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.6;
  white-space: nowrap;
}

.tag-danger { background: var(--danger-light); color: var(--danger); }
.tag-success { background: var(--success-light); color: var(--success); }
.tag-warning { background: var(--warning-light); color: var(--warning); }
.tag-info { background: var(--info-light); color: var(--info); }

.star-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 7px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.6;
  white-space: nowrap;
}

.star-badge.bright { background: var(--success-light); color: var(--success); }
.star-badge.normal { background: var(--warning-light); color: var(--warning); }
.star-badge.dim { background: var(--danger-light); color: var(--danger); }

.star-badge.hua-lu { background: var(--success-light); color: var(--success); }
.star-badge.hua-quan { background: var(--warning-light); color: var(--warning); }
.star-badge.hua-ke { background: var(--info-light); color: var(--info); }
.star-badge.hua-ji { background: var(--danger-light); color: var(--danger); }

.interpretation-block {
  margin: 14px 0;
  padding: 14px 18px;
  border-radius: var(--radius);
}

.interpretation-block.pro {
  background: var(--bg-secondary);
  border-left: 3px solid var(--accent);
}

.interpretation-block.lay {
  background: var(--bg-blockquote);
  border-left: 3px solid var(--success);
}

.interpretation-label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 6px;
}

.interpretation-block.pro .interpretation-label { color: var(--accent); }
.interpretation-block.lay .interpretation-label { color: var(--success); }

.back-to-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--bg-card);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-md);
  transition: all var(--transition);
  z-index: 150;
}

.back-to-top:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  color: var(--accent);
  border-color: var(--accent);
}

.back-to-top.visible { display: flex; }
.back-to-top svg { width: 18px; height: 18px; }

.chart-fab {
  position: fixed;
  bottom: 28px;
  right: 80px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--accent);
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-lg);
  transition: all var(--transition);
  z-index: 150;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.chart-fab:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: var(--shadow-xl);
}

.chart-fab svg { width: 20px; height: 20px; }

.chart-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 680px;
  max-width: 96vw;
  max-height: 92vh;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  z-index: 500;
  display: none;
  flex-direction: column;
  overflow: hidden;
  transition: opacity 0.15s ease;
}

.chart-panel.open {
  display: flex;
  animation: chartPanelIn 0.2s ease;
}

@keyframes chartPanelIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.chart-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-color);
  cursor: move;
  user-select: none;
  flex-shrink: 0;
}

.chart-panel-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.chart-panel-title svg { width: 16px; height: 16px; color: var(--accent); }

.chart-panel-actions {
  display: flex;
  gap: 4px;
}

.chart-panel-btn {
  width: 28px;
  height: 28px;
  border-radius: var(--radius);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}

.chart-panel-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.chart-panel-btn svg { width: 14px; height: 14px; }

.chart-panel-body {
  flex: 1;
  overflow: auto;
  padding: 16px;
  position: relative;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 3px;
  aspect-ratio: 4 / 3;
  min-height: 420px;
}

.chart-cell {
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 6px 8px;
  font-size: 11.5px;
  line-height: 1.45;
  position: relative;
  overflow: hidden;
  transition: all var(--transition);
  background: var(--bg-primary);
  cursor: default;
}

.chart-cell:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), var(--shadow-sm);
  z-index: 2;
}

.chart-cell.center-cell {
  background: var(--bg-secondary);
  border-color: var(--border-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  gap: 2px;
}

.chart-cell.center-cell .center-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
}

.chart-cell.center-cell .center-sub {
  font-size: 11px;
  color: var(--text-muted);
}

.chart-palace-name {
  font-weight: 700;
  font-size: 11px;
  color: var(--accent);
  margin-bottom: 2px;
}

.chart-ganzhi {
  font-size: 10px;
  color: var(--text-muted);
  margin-bottom: 3px;
  font-family: var(--font-mono);
}

.chart-main-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-bottom: 2px;
}

.chart-star {
  display: inline-flex;
  align-items: center;
  padding: 0 4px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.6;
  white-space: nowrap;
}

.chart-star.miao, .chart-star.wang { background: var(--chart-miao-bg); color: var(--chart-lu); }
.chart-star.ping, .chart-star.li, .chart-star.de { background: var(--chart-ping-bg); color: var(--chart-quan); }
.chart-star.xian, .chart-star.bu { background: var(--chart-xian-bg); color: var(--chart-ji); }

.chart-sihua {
  font-size: 9.5px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 2px;
  margin-left: 1px;
}

.chart-sihua.lu { background: var(--success-light); color: var(--chart-lu); }
.chart-sihua.quan { background: var(--warning-light); color: var(--chart-quan); }
.chart-sihua.ke { background: var(--info-light); color: var(--chart-ke); }
.chart-sihua.ji { background: var(--danger-light); color: var(--chart-ji); }

.chart-aux-stars {
  font-size: 10px;
  color: var(--text-muted);
  margin-top: 1px;
}

.chart-dalimit {
  font-size: 9.5px;
  color: var(--text-muted);
  position: absolute;
  bottom: 3px;
  right: 5px;
}

.chart-body-mark {
  font-size: 9px;
  color: var(--warning);
  font-weight: 600;
  position: absolute;
  top: 3px;
  right: 5px;
}

.chart-cell .chart-tooltip {
  display: none;
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 12px 14px;
  box-shadow: var(--shadow-lg);
  z-index: 600;
  min-width: 220px;
  max-width: 300px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
}

.chart-cell:hover .chart-tooltip {
  display: block;
}

.chart-tooltip-title {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 13px;
  margin-bottom: 6px;
}

.chart-tooltip-section {
  margin-bottom: 4px;
}

.chart-tooltip-label {
  font-size: 10px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.chart-panel-resize {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 16px;
  height: 16px;
  cursor: nwse-resize;
  z-index: 10;
}

.chart-panel-resize::after {
  content: '';
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-right: 2px solid var(--text-muted);
  border-bottom: 2px solid var(--text-muted);
}

.chart-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: 499;
}

.chart-overlay.open { display: block; }

@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .main-content {
    margin-left: 0;
    padding: 24px 16px 60px;
    padding-top: 60px;
  }
  .mobile-menu-btn { display: flex; }
  .chart-panel {
    width: 98vw;
    max-height: 85vh;
  }
  .chart-grid {
    min-height: 320px;
  }
  .chart-cell {
    padding: 4px 5px;
    font-size: 10px;
  }
  .chart-star { font-size: 9.5px; }
  .chart-fab {
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
  }
  .back-to-top {
    bottom: 20px;
    right: 68px;
    width: 36px;
    height: 36px;
  }
}

@media print {
  .sidebar, .toolbar, .back-to-top, .chart-fab, .chart-panel, .chart-overlay, .mobile-menu-btn { display: none !important; }
  .main-content { margin-left: 0; padding: 0; max-width: 100%; }
  body { background: white; color: black; }
  .table-wrapper { border: 1px solid #ddd; }
  .tag, .star-badge { border: 1px solid currentColor; background: transparent; }
}
</style>
</head>
<body>

<button class="mobile-menu-btn toolbar-btn" onclick="toggleSidebar()" aria-label="Menu">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
</button>

<div class="toolbar">
  <button class="toolbar-btn" onclick="toggleChart()" aria-label="排盘图" title="排盘图">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  </button>
  <button class="toolbar-btn" onclick="toggleTheme()" id="themeBtn" aria-label="Toggle theme">
    <svg id="themeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </button>
</div>

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

<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

<main class="main-content" id="mainContent">
${bodyHtml}
</main>

<button class="chart-fab" onclick="toggleChart()" aria-label="排盘图" title="排盘图">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
</button>

<button class="back-to-top" id="backToTop" onclick="window.scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
</button>

<div class="chart-overlay" id="chartOverlay" onclick="closeChart()"></div>

<div class="chart-panel" id="chartPanel">
  <div class="chart-panel-header" id="chartPanelHeader">
    <div class="chart-panel-title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
      命盘排盘图
    </div>
    <div class="chart-panel-actions">
      <button class="chart-panel-btn" onclick="minimizeChart()" title="最小化">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
      </button>
      <button class="chart-panel-btn" onclick="closeChart()" title="关闭">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
  <div class="chart-panel-body" id="chartPanelBody">
    <div class="chart-grid" id="chartGrid"></div>
  </div>
  <div class="chart-panel-resize" id="chartResize"></div>
</div>

<script>
(function() {
  var chartData = ${JSON.stringify(chartData)};

  function toggleTheme() {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    var next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ziwei-theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    var icon = document.getElementById('themeIcon');
    if (theme === 'dark') {
      icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    } else {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }

  function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      overlay.style.display = 'block';
      requestAnimationFrame(function() { overlay.classList.add('visible'); });
    } else {
      closeSidebar();
    }
  }

  function closeSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    setTimeout(function() { overlay.style.display = 'none'; }, 200);
  }

  window.toggleTheme = toggleTheme;
  window.toggleSidebar = toggleSidebar;
  window.closeSidebar = closeSidebar;

  var saved = localStorage.getItem('ziwei-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  var headings = document.querySelectorAll('h2, h3');
  var tocLinks = document.querySelectorAll('.toc-link');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        tocLinks.forEach(function(l) { l.classList.remove('active'); });
        var id = entry.target.id;
        var link = document.querySelector('.toc-link[href="#' + id + '"]');
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 });

  headings.forEach(function(h) { observer.observe(h); });

  var backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function() {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  });

  document.querySelectorAll('.toc-link').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    });
  });

  function toggleChart() {
    var panel = document.getElementById('chartPanel');
    var overlay = document.getElementById('chartOverlay');
    if (panel.classList.contains('open')) {
      closeChart();
    } else {
      panel.classList.add('open');
      overlay.classList.add('open');
      renderChart();
    }
  }

  function closeChart() {
    var panel = document.getElementById('chartPanel');
    var overlay = document.getElementById('chartOverlay');
    panel.classList.remove('open');
    overlay.classList.remove('open');
  }

  function minimizeChart() {
    closeChart();
  }

  window.toggleChart = toggleChart;
  window.closeChart = closeChart;
  window.minimizeChart = minimizeChart;

  function getBrightnessClass(brightness) {
    if (!brightness) return '';
    var b = brightness.replace(/[()（）]/g, '');
    if (b === '庙' || b === '旺') return 'miao';
    if (b === '平' || b === '利' || b === '得') return 'ping';
    if (b === '陷' || b === '不') return 'xian';
    return '';
  }

  function getSihuaClass(hua) {
    if (!hua) return '';
    if (hua.indexOf('禄') >= 0) return 'lu';
    if (hua.indexOf('权') >= 0) return 'quan';
    if (hua.indexOf('科') >= 0) return 'ke';
    if (hua.indexOf('忌') >= 0) return 'ji';
    return '';
  }

  function renderChart() {
    var grid = document.getElementById('chartGrid');
    if (!chartData || !chartData.palaces || chartData.palaces.length === 0) {
      grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px;">未找到排盘数据</div>';
      return;
    }

    var palaceMap = {};
    chartData.palaces.forEach(function(p) { palaceMap[p.position] = p; });

    var order = [5,6,7,8,4,-1,0,9,3,2,1,11,10];
    var html = '';

    order.forEach(function(pos, idx) {
      if (pos === -1) {
        html += '<div class="chart-cell center-cell">';
        if (chartData.info) {
          html += '<div class="center-title">' + esc(chartData.info.name || '命盘') + '</div>';
          html += '<div class="center-sub">' + esc(chartData.info.ganzhi || '') + '</div>';
          html += '<div class="center-sub">' + esc(chartData.info.wuxingju || '') + '</div>';
          if (chartData.info.gender) {
            html += '<div class="center-sub">' + esc(chartData.info.gender) + '</div>';
          }
        }
        html += '</div>';
        return;
      }

      var palace = palaceMap[pos];
      if (!palace) {
        html += '<div class="chart-cell"><div class="chart-palace-name">-</div></div>';
        return;
      }

      html += '<div class="chart-cell">';

      if (palace.isBodyPalace) {
        html += '<span class="chart-body-mark">身</span>';
      }
      if (palace.isLaiyinPalace) {
        html += '<span class="chart-body-mark" style="color:var(--accent)">来因</span>';
      }

      html += '<div class="chart-palace-name">' + esc(palace.name) + '</div>';
      html += '<div class="chart-ganzhi">' + esc(palace.ganzhi || '') + '</div>';

      if (palace.mainStars && palace.mainStars.length > 0) {
        html += '<div class="chart-main-stars">';
        palace.mainStars.forEach(function(s) {
          var bc = getBrightnessClass(s.brightness);
          html += '<span class="chart-star ' + bc + '">' + esc(s.name);
          if (s.brightness) html += '(' + esc(s.brightness) + ')';
          if (s.sihua) {
            var sc = getSihuaClass(s.sihua);
            html += '<span class="chart-sihua ' + sc + '">' + esc(s.sihua) + '</span>';
          }
          html += '</span>';
        });
        html += '</div>';
      }

      if (palace.auxStars && palace.auxStars.length > 0) {
        html += '<div class="chart-aux-stars">' + esc(palace.auxStars.join(' ')) + '</div>';
      }

      if (palace.dalimit) {
        html += '<div class="chart-dalimit">' + esc(palace.dalimit) + '</div>';
      }

      html += '<div class="chart-tooltip">';
      html += '<div class="chart-tooltip-title">' + esc(palace.name) + ' · ' + esc(palace.ganzhi || '') + '</div>';
      if (palace.mainStars && palace.mainStars.length > 0) {
        html += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">主星</div>';
        palace.mainStars.forEach(function(s) {
          html += esc(s.name);
          if (s.brightness) html += '(' + esc(s.brightness) + ')';
          if (s.sihua) html += ' <span class="tag tag-' + getSihuaClass(s.sihua) + '">' + esc(s.sihua) + '</span>';
          html += ' ';
        });
        html += '</div>';
      }
      if (palace.auxStars && palace.auxStars.length > 0) {
        html += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">辅星</div>' + esc(palace.auxStars.join('、')) + '</div>';
      }
      if (palace.miscStars && palace.miscStars.length > 0) {
        html += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">杂耀</div>' + esc(palace.miscStars.join('、')) + '</div>';
      }
      if (palace.changsheng) {
        html += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">长生十二神</div>' + esc(palace.changsheng) + '</div>';
      }
      if (palace.dalimit) {
        html += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">大限</div>' + esc(palace.dalimit) + '</div>';
      }
      if (palace.note) {
        html += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">备注</div>' + esc(palace.note) + '</div>';
      }
      html += '</div>';

      html += '</div>';
    });

    grid.innerHTML = html;
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  var isDragging = false;
  var dragOffsetX = 0;
  var dragOffsetY = 0;

  var panelHeader = document.getElementById('chartPanelHeader');
  var panel = document.getElementById('chartPanel');

  panelHeader.addEventListener('mousedown', function(e) {
    if (e.target.closest('.chart-panel-btn')) return;
    isDragging = true;
    var rect = panel.getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    panel.style.transform = 'none';
    panel.style.left = rect.left + 'px';
    panel.style.top = rect.top + 'px';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isDragging) return;
    var x = e.clientX - dragOffsetX;
    var y = e.clientY - dragOffsetY;
    x = Math.max(0, Math.min(x, window.innerWidth - panel.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - panel.offsetHeight));
    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
  });

  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  var isResizing = false;
  var resizeStartX = 0;
  var resizeStartY = 0;
  var resizeStartW = 0;
  var resizeStartH = 0;

  var resizeHandle = document.getElementById('chartResize');

  resizeHandle.addEventListener('mousedown', function(e) {
    isResizing = true;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartW = panel.offsetWidth;
    resizeStartH = panel.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isResizing) return;
    var newW = Math.max(400, resizeStartW + (e.clientX - resizeStartX));
    var newH = Math.max(300, resizeStartH + (e.clientY - resizeStartY));
    panel.style.width = newW + 'px';
    panel.style.maxHeight = newH + 'px';
  });

  document.addEventListener('mouseup', function() {
    isResizing = false;
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeChart();
    }
  });
})();
</script>
</body>
</html>`;
}

function extractTitle(md) {
  var m = md.match(/^#\s+(.+)/);
  return m ? m[1].trim() : '紫微斗数命盘详析';
}

function generateToc(md) {
  var lines = md.split('\n');
  var items = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      var text = h2[1].trim();
      var id = slugify(text);
      items.push('<li class="toc-item"><a class="toc-link" href="#' + id + '">' + escapeHtml(text) + '</a></li>');
      continue;
    }
    var h3 = line.match(/^###\s+(\d+\.?\s*.+)/);
    if (h3) {
      var text = h3[1].trim();
      var id = slugify(text);
      items.push('<li class="toc-item"><a class="toc-link toc-h3" href="#' + id + '">' + escapeHtml(text) + '</a></li>');
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

function extractChartData(md) {
  var result = { palaces: [], info: {} };

  var infoPatterns = [
    { key: 'name', re: /\*\*命主\*\*[：:]\s*([^\s|]+)/ },
    { key: 'ganzhi', re: /\|\s*干支\s*\|\s*([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]年[^\|]+)/ },
    { key: 'wuxingju', re: /\|\s*五行局\s*\|\s*(\S+局)/ },
    { key: 'gender', re: /\|\s*性别\s*\|\s*([^\|]+)/ },
    { key: 'minggong', re: /\|\s*命宫\s*\|\s*(\S+宫)/ }
  ];

  infoPatterns.forEach(function(p) {
    var m = md.match(p.re);
    if (m) result.info[p.key] = m[1].trim();
  });

  var tableSection = md.match(/##\s+[^#\n]*十二宫排盘总表[\s\S]*?(?=\n---\n|\n##\s|$)/);
  if (!tableSection) return result;

  var lines = tableSection[0].split('\n');
  var inTable = false;
  var headers = [];
  var rows = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^\|.*\|/)) {
      var cells = line.split('|').slice(1, -1).map(function(c) { return c.trim(); });
      if (cells.every(function(c) { return /^[\s\-:]+$/.test(c); })) {
        continue;
      }
      if (!inTable) {
        headers = cells;
        inTable = true;
      } else {
        rows.push(cells);
      }
    } else if (inTable) {
      break;
    }
  }

  if (headers.length === 0 || rows.length === 0) return result;

  var palaceCol = headers.findIndex(function(h) { return h.indexOf('宫位') >= 0; });
  var ganzhiCol = headers.findIndex(function(h) { return h.indexOf('天干地支') >= 0 || (h === '干支'); });
  var tianganCol = headers.findIndex(function(h) { return h === '天干'; });
  var dizhiCol = headers.findIndex(function(h) { return h === '地支'; });
  var mainStarCol = headers.findIndex(function(h) { return h.indexOf('主星') >= 0; });
  var auxCol = headers.findIndex(function(h) { return h.indexOf('辅星') >= 0; });
  var miscCol = headers.findIndex(function(h) { return h.indexOf('杂耀') >= 0 || h.indexOf('杂曜') >= 0; });
  var changshengCol = headers.findIndex(function(h) { return h.indexOf('长生') >= 0; });
  var dalimitCol = headers.findIndex(function(h) { return h.indexOf('大限') >= 0; });
  var noteCol = headers.findIndex(function(h) { return h.indexOf('备注') >= 0; });
  var bodyCol = headers.findIndex(function(h) { return h === '身宫'; });
  var laiyinCol = headers.findIndex(function(h) { return h === '来因'; });
  var sihuaCol = headers.findIndex(function(h) { return h.indexOf('生年四化') >= 0 || h.indexOf('四化') >= 0; });

  var palacePositions = {
    '命宫': 5, '兄弟': 6, '兄弟宫': 6, '夫妻': 7, '夫妻宫': 7,
    '子女': 8, '子女宫': 8, '财帛': 9, '财帛宫': 9,
    '疾厄': 10, '疾厄宫': 10, '迁移': 11, '迁移宫': 11,
    '仆役': 0, '仆役宫': 0, '交友': 0, '交友宫': 0,
    '官禄': 1, '官禄宫': 1, '事业': 1, '事业宫': 1,
    '田宅': 2, '田宅宫': 2, '福德': 3, '福德宫': 3,
    '父母': 4, '父母宫': 4
  };

  rows.forEach(function(row) {
    if (row.length < 2) return;

    var palaceName = palaceCol >= 0 ? row[palaceCol] : '';
    var cleanName = palaceName.replace(/[★☆].*$/, '').trim();

    var position = palacePositions[cleanName];
    if (position === undefined) {
      for (var key in palacePositions) {
        if (cleanName.indexOf(key) >= 0) {
          position = palacePositions[key];
          break;
        }
      }
    }
    if (position === undefined) return;

    var ganzhi = '';
    if (ganzhiCol >= 0) {
      ganzhi = row[ganzhiCol] || '';
    } else if (tianganCol >= 0 && dizhiCol >= 0) {
      ganzhi = (row[tianganCol] || '') + (row[dizhiCol] || '');
    }

    var mainStarStr = mainStarCol >= 0 ? row[mainStarCol] : '';
    var auxStr = auxCol >= 0 ? row[auxCol] : '';
    var miscStr = miscCol >= 0 ? row[miscCol] : '';
    var changsheng = changshengCol >= 0 ? row[changshengCol] : '';
    var dalimit = dalimitCol >= 0 ? row[dalimitCol] : '';
    var note = noteCol >= 0 ? row[noteCol] : '';
    var sihuaStr = sihuaCol >= 0 ? row[sihuaCol] : '';

    var mainStars = parseMainStars(mainStarStr);
    var auxStars = auxStr === '—' || auxStr === '-' || auxStr === '' ? [] : auxStr.split(/[·、,，\s]+/).filter(function(s) { return s && s !== '—' && s !== '-'; });
    var miscStars = miscStr === '—' || miscStr === '-' || miscStr === '' ? [] : miscStr.split(/[·、,，\s]+/).filter(function(s) { return s && s !== '—' && s !== '-'; });

    var isBodyPalace = false;
    if (bodyCol >= 0 && (row[bodyCol] || '').indexOf('身宫') >= 0) {
      isBodyPalace = true;
    } else if (palaceName.indexOf('身宫') >= 0) {
      isBodyPalace = true;
    } else if (note.indexOf('身宫') >= 0) {
      isBodyPalace = true;
    }

    var isLaiyinPalace = false;
    if (laiyinCol >= 0 && (row[laiyinCol] || '').indexOf('来因') >= 0) {
      isLaiyinPalace = true;
    } else if (palaceName.indexOf('来因') >= 0) {
      isLaiyinPalace = true;
    } else if (note.indexOf('来因') >= 0) {
      isLaiyinPalace = true;
    }

    result.palaces.push({
      name: cleanName,
      ganzhi: ganzhi,
      position: position,
      mainStars: mainStars,
      auxStars: auxStars,
      miscStars: miscStars,
      changsheng: changsheng,
      dalimit: dalimit,
      note: note === '—' ? '' : note,
      isBodyPalace: isBodyPalace,
      isLaiyinPalace: isLaiyinPalace
    });
  });

  return result;
}

function parseMainStars(str) {
  if (!str || str === '—' || str === '-') return [];

  var stars = [];
  var parts = str.split(/[·、+]/);

  parts.forEach(function(part) {
    part = part.trim();
    if (!part) return;

    if (part.indexOf('空') >= 0 && part.indexOf('借') >= 0) {
      stars.push({ name: '空宫借星', brightness: '', sihua: '' });
      return;
    }

    var name = '';
    var brightness = '';
    var sihua = '';

    var nameMatch = part.match(/^([^\(（\[\【]+)/);
    if (nameMatch) name = nameMatch[1].trim();

    var brightMatch = part.match(/[\(（](庙|旺|平|利|得|陷|不)[\)）]/);
    if (brightMatch) brightness = brightMatch[1];

    var sihuaMatch = part.match(/[\[【](禄|权|科|忌)[\]】]/);
    if (sihuaMatch) sihua = '化' + sihuaMatch[1];

    if (name) {
      stars.push({ name: name, brightness: brightness, sihua: sihua });
    }
  });

  return stars;
}

function markdownToHtml(md) {
  var lines = md.split('\n');
  var html = '';
  var inTable = false;
  var tableRows = [];
  var tableHeaders = [];
  var inCodeBlock = false;
  var codeContent = '';
  var inList = false;
  var listType = '';
  var skipNext = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var nextLine = i < lines.length - 1 ? lines[i + 1] : '';

    if (skipNext) { skipNext = false; continue; }

    if (line.startsWith('\`\`\`')) {
      if (inCodeBlock) {
        html += '<pre><code>' + escapeHtml(codeContent.trim()) + '</code></pre>';
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
      var cells = parseTableRow(line);
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
      var match = line.match(/^(#{1,4})\s+(.+)/);
      if (match) {
        var level = match[1].length;
        var text = match[2].trim();
        var id = slugify(text);
        var content = inlineFormat(text);

        if (level === 2) {
          html += '<h2 id="' + id + '">' + content + '</h2>';
        } else if (level === 3) {
          html += '<h3 id="' + id + '">' + content + '</h3>';
        } else if (level === 4) {
          html += '<h4>' + content + '</h4>';
        } else {
          html += '<h1 id="' + id + '">' + content + '</h1>';
        }
      }
      continue;
    }

    if (line.match(/^>\s?/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      var text = line.replace(/^>\s?/, '').trim();
      html += '<blockquote>' + inlineFormat(text) + '</blockquote>';
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
      var text = line.replace(/^[-*]\s+/, '').trim();
      html += '<li>' + inlineFormat(text) + '</li>';
      continue;
    }

    if (line.match(/^\d+\.\s+/)) {
      if (inList && listType !== 'ol') { html += '</ul>'; inList = false; }
      if (!inList) { html += '<ol>'; inList = true; listType = 'ol'; }
      var text = line.replace(/^\d+\.\s+/, '').trim();
      html += '<li>' + inlineFormat(text) + '</li>';
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

    html += '<p>' + inlineFormat(line.trim()) + '</p>';
  }

  if (inTable) { html += buildTable(tableHeaders, tableRows); }
  if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; }
  if (inCodeBlock) { html += '<pre><code>' + escapeHtml(codeContent.trim()) + '</code></pre>'; }

  html = enhanceHtml(html);
  return html;
}

function parseTableRow(line) {
  return line.split('|').slice(1, -1).map(function(c) { return c.trim(); });
}

function buildTable(headers, rows) {
  var html = '<div class="table-wrapper"><table><thead><tr>';
  headers.forEach(function(h) { html += '<th>' + inlineFormat(h) + '</th>'; });
  html += '</tr></thead><tbody>';
  rows.forEach(function(row) {
    html += '<tr>';
    row.forEach(function(cell) {
      html += '<td>' + inlineFormat(cell) + '</td>';
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
  text = text.replace(/\`(.+?)\`/g, '<code>$1</code>');

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
    /【专业解读】([\s\S]*?)(?=【通俗解析】|<h[234]|$)/g,
    function(match, content) {
      return '<div class="interpretation-block pro"><div class="interpretation-label">专业解读</div>' + content.trim() + '</div>';
    }
  );

  html = html.replace(
    /【通俗解析】([\s\S]*?)(?=<h[234]|$)/g,
    function(match, content) {
      return '<div class="interpretation-block lay"><div class="interpretation-label">通俗解析</div>' + content.trim() + '</div>';
    }
  );

  return html;
}

var args = process.argv.slice(2);
if (args.length < 1) {
  console.log('Usage: node md2html.js <input.md> [output.html]');
  console.log('  If output is not specified, output to same directory with .html extension');
  process.exit(1);
}

var inputPath = path.resolve(args[0]);
var outputPath = args[1] ? path.resolve(args[1]) : inputPath.replace(/\.md$/, '.html');

if (!fs.existsSync(inputPath)) {
  console.error('Error: File not found: ' + inputPath);
  process.exit(1);
}

convertMdToHtml(inputPath, outputPath);
