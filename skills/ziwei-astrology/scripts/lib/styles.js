function getStyles() {
return `
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f7f7f5;
  --bg-sidebar: #f7f7f5;
  --bg-card: #ffffff;
  --bg-hover: rgba(55,53,47,0.08);
  --bg-hover-strong: rgba(55,53,47,0.12);
  --bg-code: #f7f7f5;
  --bg-table-header: #f0f0ee;
  --bg-table-stripe: rgba(55,53,47,0.024);
  --bg-blockquote: rgba(35,131,226,0.04);
  --bg-overlay: rgba(15,15,15,0.6);
  --text-primary: #37352f;
  --text-secondary: #787774;
  --text-muted: #b4b4b0;
  --text-link: #2383e2;
  --text-link-hover: #1b6ec2;
  --border-color: #e3e3e0;
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
  --sidebar-width: 280px;
  --content-max-width: 860px;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "Cascadia Code", "SF Mono", Menlo, monospace;
  --chart-lu: #4dab5c;
  --chart-quan: #e8912d;
  --chart-ke: #3b82f6;
  --chart-ji: #eb5757;
  --chart-miao-bg: rgba(77,171,92,0.1);
  --chart-ping-bg: rgba(232,145,45,0.1);
  --chart-xian-bg: rgba(235,87,87,0.1);
  --chart-ming-bg: rgba(255,193,7,0.08);
  --chart-body-border: rgba(255,152,0,0.5);
  --chart-laiyin-border: rgba(59,130,246,0.5);
  --chart-empty-border: #c0c0bc;
  --progress-bg: #ededec;
  --progress-fill: linear-gradient(90deg, #3b82f6, #8b5cf6);
  --gold: #d4a017;
  --gold-light: rgba(212,160,23,0.1);
  --gold-medium: rgba(212,160,23,0.2);
  --purple: #7c3aed;
  --purple-light: rgba(124,58,237,0.08);
  --purple-medium: rgba(124,58,237,0.14);
  --system-iztro: #2563eb;
  --system-nishi: #d4a017;
  --system-combined: #7c3aed;
  --ni-miao-color: #d4a017;
  --ni-ping-color: #787774;
  --ni-xian-color: #b91c1c;
  --ni-miao-bg: rgba(212,160,23,0.12);
  --ni-ping-bg: rgba(120,119,116,0.08);
  --ni-xian-bg: rgba(185,28,28,0.1);
  --chart-sanfang-line: rgba(37,99,235,0.55);
  --chart-selected-bg: rgba(37,99,235,0.08);
  --chart-selected-border: rgba(37,99,235,0.6);
  --chart-dalimit-border: rgba(124,58,237,0.6);
  --chart-dalimit-bg: rgba(124,58,237,0.06);
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
  --bg-blockquote: rgba(82,156,202,0.08);
  --bg-overlay: rgba(0,0,0,0.7);
  --text-primary: #ecece8;
  --text-secondary: #b0b0ac;
  --text-muted: #8a8a86;
  --text-link: #529cca;
  --text-link-hover: #6db3d8;
  --border-color: #383838;
  --border-light: #3a3a3a;
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
  --chart-ming-bg: rgba(255,193,7,0.06);
  --chart-body-border: rgba(255,152,0,0.4);
  --chart-laiyin-border: rgba(96,165,250,0.4);
  --chart-empty-border: #555;
  --progress-bg: #333;
  --gold: #fbbf24;
  --gold-light: rgba(251,191,36,0.1);
  --gold-medium: rgba(251,191,36,0.2);
  --purple: #a78bfa;
  --purple-light: rgba(167,139,250,0.1);
  --purple-medium: rgba(167,139,250,0.18);
  --system-iztro: #60a5fa;
  --system-nishi: #fbbf24;
  --system-combined: #a78bfa;
  --ni-miao-color: #fbbf24;
  --ni-ping-color: #9b9b97;
  --ni-xian-color: #f87171;
  --ni-miao-bg: rgba(251,191,36,0.12);
  --ni-ping-bg: rgba(155,155,151,0.1);
  --ni-xian-bg: rgba(248,113,113,0.12);
  --chart-sanfang-line: rgba(96,165,250,0.55);
  --chart-selected-bg: rgba(96,165,250,0.1);
  --chart-selected-border: rgba(96,165,250,0.6);
  --chart-dalimit-border: rgba(167,139,250,0.5);
  --chart-dalimit-bg: rgba(167,139,250,0.08);
}

[data-theme="dark"] table { border-color: var(--border-color); }
[data-theme="dark"] .table-wrapper { border-color: var(--border-color); }
[data-theme="dark"] td { border-bottom-color: #3a3a3a; color: #b8b8b4; }
[data-theme="dark"] th { color: #b8b8b4; border-bottom-color: #444; }
[data-theme="dark"] blockquote { color: #b0b0ac; border-left-color: var(--accent); background: rgba(82,156,202,0.08); }
[data-theme="dark"] blockquote strong { color: #ecece8; }
[data-theme="dark"] pre { border-color: #3a3a3a; background: #222; }
[data-theme="dark"] code { background: #2e2e2e; color: #d8d8d4; }
[data-theme="dark"] pre code { background: none; color: #d8d8d4; }
[data-theme="dark"] hr { background: #3a3a3a; }

* { margin: 0; padding: 0; box-sizing: border-box; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 16px;
  transition: background var(--transition), color var(--transition);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::selection {
  background: var(--accent-medium);
  color: var(--text-primary);
}

.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  z-index: 9999;
  background: var(--progress-bg);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  background-size: 200% 100%;
  animation: progressShimmer 3s ease infinite;
  width: 0%;
  transition: width 0.1s linear;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px rgba(139,92,246,0.4);
}

@keyframes progressShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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

.sidebar-system-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--text-secondary);
}

.sidebar-system-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

[data-system="iztro"] .sidebar-system-dot { background: var(--system-iztro); }
[data-system="nishi"] .sidebar-system-dot { background: var(--system-nishi); }
[data-system="combined"] .sidebar-system-dot { background: var(--system-combined); }

.sidebar-system-name {
  font-weight: 600;
}

[data-system="iztro"] .sidebar-system-name { color: var(--system-iztro); }
[data-system="nishi"] .sidebar-system-name { color: var(--system-nishi); }
[data-system="combined"] .sidebar-system-name { color: var(--system-combined); }

.toc-list { list-style: none; padding: 0 6px; }

.toc-item { margin-bottom: 1px; }

.toc-link {
  display: block;
  padding: 5px 12px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13.5px;
  border-radius: var(--radius);
  transition: all var(--transition);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  position: relative;
}

.toc-link:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.toc-link:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent);
}

.toc-link.active {
  background: var(--accent-light);
  color: var(--accent);
  font-weight: 600;
  box-shadow: inset 3px 0 0 var(--accent);
}

.toc-h3 { padding-left: 28px; font-size: 13px; }
.toc-h4 { padding-left: 36px; font-size: 12px; color: var(--text-tertiary); }
.toc-h5 { padding-left: 44px; font-size: 11.5px; color: var(--text-tertiary); }
.toc-h6 { padding-left: 52px; font-size: 11px; color: var(--text-tertiary); }

.toc-h1 { font-weight: 600; font-size: 13.5px; color: var(--text-primary); }

.toc-h1-group > .toc-h1 { border-bottom: 1px solid var(--border); padding-bottom: 6px; margin-bottom: 2px; }

.toc-sub-list { list-style: none; padding: 0; margin: 0; }

.toc-sub-list .toc-link { padding-left: 20px; font-size: 12.5px; }

.toc-sub-list .toc-h3 { padding-left: 32px; font-size: 12px; }

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
  max-width: var(--content-max-width);
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
  align-items: center;
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

.mode-btn-group {
  display: flex;
  gap: 0;
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.mode-btn {
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all var(--transition);
  background: var(--bg-card);
  color: var(--text-secondary);
  white-space: nowrap;
  border-right: 1px solid var(--border-color);
}

.mode-btn:last-child { border-right: none; }

.mode-btn:hover { background: var(--bg-hover); }

.mode-btn[data-mode="iztro"].active {
  background: var(--system-iztro);
  color: #fff;
}
.mode-btn[data-mode="nishi"].active {
  background: var(--system-nishi);
  color: #fff;
}
.mode-btn[data-mode="combined"].active {
  background: var(--system-combined);
  color: #fff;
}

.mobile-menu-btn {
  display: none;
  position: fixed;
  top: 14px;
  left: 14px;
  z-index: 200;
}

.mobile-toc-fab { display: none; }

h1 {
  font-size: 36px;
  font-weight: 800;
  margin-bottom: 6px;
  color: var(--text-primary);
  letter-spacing: -0.03em;
  line-height: 1.3;
  position: relative;
}

h1::after {
  content: '';
  display: block;
  width: 120px;
  height: 3px;
  margin-top: 10px;
  background: linear-gradient(90deg, var(--gold), transparent);
  border-radius: 2px;
}

h1 + blockquote { margin-bottom: 28px; }

h2 {
  font-size: 24px;
  font-weight: 700;
  margin-top: 52px;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-primary);
  scroll-margin-top: 24px;
  letter-spacing: -0.02em;
  line-height: 1.35;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 12px;
  border-left: 3px solid var(--gold);
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
}

h5 {
  font-size: 13px;
  font-weight: 600;
  margin-top: 16px;
  margin-bottom: 4px;
  color: var(--text-tertiary);
}

h6 {
  font-size: 12px;
  font-weight: 600;
  margin-top: 12px;
  margin-bottom: 4px;
  color: var(--text-tertiary);
}

p { margin-bottom: 14px; }

blockquote {
  background: var(--bg-blockquote);
  border-left: 3px solid var(--accent);
  padding: 10px 18px;
  margin: 14px 0;
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--text-secondary);
  font-size: 14px;
}

blockquote.nishi-quote {
  background: var(--gold-light);
  border-left-color: var(--gold);
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
  font-size: 14px;
}

thead { background: var(--bg-table-header); position: relative; }

thead::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--purple));
}

th {
  padding: 10px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 13px;
  color: var(--text-secondary);
  border-bottom: 2px solid var(--border-color);
  white-space: nowrap;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

td {
  padding: 9px 16px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-secondary);
  font-size: 14px;
}

tbody tr:last-child td { border-bottom: none; }
tbody tr:nth-child(even) { background: var(--bg-table-stripe); }
tbody tr:hover {
  background: var(--bg-hover);
  transform: translateY(-1px);
  transition: transform 0.15s ease;
}

table caption {
  caption-side: top;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 8px 16px 4px;
}

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

ul, ol { padding-left: 22px; margin-bottom: 14px; }
li { margin-bottom: 5px; }

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

.tag-system-iztro { background: rgba(37,99,235,0.1); color: var(--system-iztro); }
.tag-system-nishi { background: var(--gold-light); color: var(--system-nishi); }
.tag-system-combined { background: var(--purple-light); color: var(--system-combined); }

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

.star-badge.hua-lu {
  background: var(--success-light);
  color: var(--chart-lu);
  box-shadow: 0 0 6px rgba(77,171,92,0.3);
}
.star-badge.hua-quan {
  background: var(--info-light);
  color: var(--chart-quan);
  box-shadow: 0 0 6px rgba(59,130,246,0.3);
}
.star-badge.hua-ke {
  background: var(--warning-light);
  color: var(--chart-ke);
  box-shadow: 0 0 6px rgba(232,145,45,0.3);
}
.star-badge.hua-ji {
  background: var(--danger-light);
  color: var(--chart-ji);
  box-shadow: 0 0 6px rgba(235,87,87,0.3);
}

.interpretation-block {
  margin: 16px 0;
  padding: 18px 22px;
  border-radius: var(--radius-lg);
  position: relative;
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
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.interpretation-block.pro .interpretation-label { color: var(--accent); }
.interpretation-block.lay .interpretation-label { color: var(--success); }

.interpretation-block.pro .interpretation-label::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  background: var(--accent);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'/%3E%3Cpath d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'/%3E%3C/svg%3E") center/contain no-repeat;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M4 19.5A2.5 2.5 0 0 1 6.5 17H20'/%3E%3Cpath d='M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z'/%3E%3C/svg%3E") center/contain no-repeat;
  flex-shrink: 0;
}

.interpretation-block.lay .interpretation-label::before {
  content: '';
  display: inline-block;
  width: 16px;
  height: 16px;
  background: var(--success);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M9 18h6'/%3E%3Cpath d='M10 22h4'/%3E%3Cpath d='M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'/%3E%3C/svg%3E") center/contain no-repeat;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M9 18h6'/%3E%3Cpath d='M10 22h4'/%3E%3Cpath d='M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z'/%3E%3C/svg%3E") center/contain no-repeat;
  flex-shrink: 0;
}

.interpretation-pair {
  position: relative;
  margin: 16px 0;
}

.interpretation-pair .interpretation-block.pro {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  margin-bottom: 0;
}

.interpretation-pair .interpretation-block.lay {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  margin-top: 0;
  border-top: 1px dashed var(--border-color);
}

.interpretation-connector {
  position: absolute;
  left: 14px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--accent), var(--success));
  opacity: 0.3;
}

.pattern-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 14px 18px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;
  transition: all var(--transition);
}

.pattern-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
}

.pattern-card.excellent::before { background: var(--success); }
.pattern-card.good::before { background: var(--info); }
.pattern-card.neutral::before { background: var(--warning); }
.pattern-card.caution::before { background: var(--danger); }

.pattern-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.pattern-card-title {
  font-weight: 700;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.pattern-card.excellent .pattern-card-title { color: var(--success); }
.pattern-card.good .pattern-card-title { color: var(--info); }
.pattern-card.neutral .pattern-card-title { color: var(--warning); }
.pattern-card.caution .pattern-card-title { color: var(--danger); }

.section-wrapper {
  position: relative;
}

.section-toggle {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  flex-shrink: 0;
}

.section-toggle:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.section-toggle svg {
  width: 16px;
  height: 16px;
  transition: transform 0.25s ease;
}

.section-wrapper.collapsed .section-toggle svg {
  transform: rotate(-90deg);
}

.section-content {
  overflow: hidden;
}

.section-wrapper.collapsed .section-content {
  display: none;
}

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
  width: 780px;
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

.chart-panel-system-badge {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 4px;
}

[data-system="iztro"] .chart-panel-system-badge { background: rgba(37,99,235,0.12); color: var(--system-iztro); }
[data-system="nishi"] .chart-panel-system-badge { background: var(--gold-light); color: var(--system-nishi); }
[data-system="combined"] .chart-panel-system-badge { background: var(--purple-light); color: var(--system-combined); }

.chart-panel-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.chart-zoom-controls {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-right: 8px;
  padding-right: 8px;
  border-right: 1px solid var(--border-color);
}

.chart-zoom-btn {
  width: 26px;
  height: 26px;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.chart-zoom-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--border-light);
}

.chart-zoom-level {
  font-size: 11px;
  color: var(--text-muted);
  min-width: 36px;
  text-align: center;
  font-variant-numeric: tabular-nums;
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

.chart-grid-wrapper {
  position: relative;
  width: 100%;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 2px;
  width: 100%;
  aspect-ratio: 1 / 1;
  min-height: 480px;
  transform-origin: top center;
  transition: transform 0.15s ease;
}

.chart-svg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.chart-cell {
  border: 1.5px solid var(--border-color);
  border-radius: 3px;
  padding: 6px 8px;
  font-size: 11.5px;
  line-height: 1.45;
  position: relative;
  overflow: hidden;
  transition: all var(--transition);
  background: var(--bg-primary);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.chart-cell:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent), var(--shadow-sm);
  z-index: 2;
}

.chart-cell.selected {
  border-color: var(--chart-selected-border);
  border-width: 2px;
  background: var(--chart-selected-bg);
  box-shadow: 0 0 0 1px var(--chart-selected-border);
  z-index: 3;
}

.chart-cell.sanfang-related {
  background: var(--chart-selected-bg);
  border-color: rgba(37,99,235,0.35);
}

.chart-cell.dalimit-active {
  border-left: 3px solid var(--chart-dalimit-border);
  background: var(--chart-dalimit-bg);
}

.chart-cell.palace-ming {
  background: var(--chart-ming-bg);
}

.chart-cell.palace-body {
  border-color: var(--chart-body-border);
  border-width: 2px;
}

.chart-cell.palace-laiyin {
  border-color: var(--chart-laiyin-border);
  border-width: 2px;
}

.chart-cell.palace-empty {
  border-style: dashed;
  border-color: var(--chart-empty-border);
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
  cursor: default;
}

.chart-cell.center-cell .center-taiji {
  font-size: 32px;
  opacity: 0.15;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.chart-cell.center-cell .center-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  position: relative;
  z-index: 1;
}

.chart-cell.center-cell .center-sub {
  font-size: 11px;
  color: var(--text-muted);
  position: relative;
  z-index: 1;
}

.chart-cell.center-cell .center-dalimit-box {
  margin-top: 4px;
  padding: 2px 8px;
  border: 1px solid var(--chart-dalimit-border);
  border-radius: 4px;
  font-size: 10px;
  color: var(--purple);
  background: var(--chart-dalimit-bg);
  position: relative;
  z-index: 1;
}

.chart-cell-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3px;
  gap: 4px;
}

.chart-palace-name {
  font-weight: 700;
  font-size: 11px;
  color: var(--accent);
  white-space: nowrap;
}

.chart-palace-marks {
  display: flex;
  gap: 2px;
  align-items: center;
}

.chart-ming-mark {
  font-size: 9px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 2px;
  background: rgba(212,160,23,0.15);
  color: var(--gold);
  line-height: 1.5;
}

.chart-shen-mark {
  font-size: 9px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 2px;
  background: var(--info-light);
  color: var(--info);
  line-height: 1.5;
}

.chart-ganzhi {
  font-size: 10px;
  color: var(--text-muted);
  font-family: var(--font-mono);
  white-space: nowrap;
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

[data-system="nishi"] .chart-star.miao,
[data-system="nishi"] .chart-star.wang,
[data-system="nishi"] .chart-star.ni-miao { background: var(--ni-miao-bg); color: var(--ni-miao-color); }
[data-system="nishi"] .chart-star.ping,
[data-system="nishi"] .chart-star.li,
[data-system="nishi"] .chart-star.de,
[data-system="nishi"] .chart-star.ni-ping { background: var(--ni-ping-bg); color: var(--ni-ping-color); }
[data-system="nishi"] .chart-star.xian,
[data-system="nishi"] .chart-star.bu,
[data-system="nishi"] .chart-star.ni-xian { background: var(--ni-xian-bg); color: var(--ni-xian-color); }

[data-system="combined"] .chart-star.miao,
[data-system="combined"] .chart-star.wang,
[data-system="combined"] .chart-star.ni-miao { background: var(--chart-miao-bg); color: var(--chart-lu); }
[data-system="combined"] .chart-star.ping,
[data-system="combined"] .chart-star.li,
[data-system="combined"] .chart-star.de,
[data-system="combined"] .chart-star.ni-ping { background: var(--chart-ping-bg); color: var(--chart-quan); }
[data-system="combined"] .chart-star.xian,
[data-system="combined"] .chart-star.bu,
[data-system="combined"] .chart-star.ni-xian { background: var(--chart-xian-bg); color: var(--chart-ji); }

.chart-brightness-label {
  font-size: 9px;
  font-weight: 400;
  opacity: 0.8;
}

[data-system="iztro"] .ni-brightness { display: none; }
[data-system="iztro"] .combined-brightness { display: none; }
[data-system="nishi"] .iztro-brightness { display: none; }
[data-system="nishi"] .combined-brightness { display: none; }
[data-system="combined"] .iztro-brightness { display: none; }
[data-system="combined"] .ni-brightness { display: none; }

.chart-sihua {
  font-size: 9.5px;
  font-weight: 700;
  padding: 0 3px;
  border-radius: 2px;
  margin-left: 1px;
}

.chart-sihua.lu { background: var(--success-light); color: var(--chart-lu); }
.chart-sihua.quan { background: var(--info-light); color: var(--chart-quan); }
.chart-sihua.ke { background: var(--warning-light); color: var(--chart-ke); }
.chart-sihua.ji { background: var(--danger-light); color: var(--chart-ji); }

.chart-aux-stars {
  font-size: 10px;
  color: var(--info);
  margin-top: 1px;
}

.chart-sha-stars {
  font-size: 10px;
  color: var(--danger);
  margin-top: 1px;
}

.chart-dalimit {
  font-size: 9.5px;
  color: var(--text-muted);
  position: absolute;
  bottom: 3px;
  left: 5px;
}

.chart-dalimit.current-dalimit {
  color: var(--purple);
  font-weight: 700;
  background: var(--chart-dalimit-bg);
  padding: 0 4px;
  border-radius: 2px;
}

.chart-empty-text {
  font-size: 10px;
  color: var(--text-muted);
  font-style: italic;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 10px 0 4px;
  font-size: 11px;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.chart-legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.chart-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.chart-legend-dot.lu { background: var(--chart-lu); }
.chart-legend-dot.quan { background: var(--chart-quan); }
.chart-legend-dot.ke { background: var(--chart-ke); }
.chart-legend-dot.ji { background: var(--chart-ji); }

.chart-aux-star-item { margin-right: 2px; }
.chart-aux-star-item.has-sihua { font-weight: 600; }
.chart-sha-star-item { margin-right: 2px; }
.chart-misc-stars {
  font-size: 9px;
  color: var(--text-muted);
  margin-top: 1px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chart-changsheng {
  font-size: 8.5px;
  color: var(--text-muted);
  opacity: 0.7;
  margin-top: auto;
  text-align: right;
}
.chart-dalimit-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 8px;
  margin-bottom: 8px;
  background: var(--bg-secondary);
  border-radius: var(--radius);
  overflow-x: auto;
  flex-wrap: nowrap;
}
.dalimit-bar-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--purple);
  white-space: nowrap;
  margin-right: 4px;
}
.dalimit-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid var(--border-color);
  background: var(--bg-primary);
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
  font-family: inherit;
  font-size: 10px;
  line-height: 1.3;
  flex-shrink: 0;
}
.dalimit-bar-item:hover {
  border-color: var(--purple);
  background: var(--chart-dalimit-bg);
}
.dalimit-bar-item.current {
  border-color: var(--chart-dalimit-border);
  background: var(--chart-dalimit-bg);
}
.dalimit-bar-item.active {
  border-color: var(--chart-dalimit-border);
  background: var(--chart-dalimit-bg);
  box-shadow: 0 0 0 1px var(--chart-dalimit-border);
}
.dalimit-item-name {
  font-weight: 600;
  color: var(--text-primary);
}
.dalimit-item-range {
  font-size: 9px;
  color: var(--text-muted);
}
.chart-cell.dalimit-selected {
  border-color: var(--chart-dalimit-border) !important;
  border-width: 2.5px !important;
  background: var(--chart-dalimit-bg) !important;
  box-shadow: 0 0 0 1px var(--chart-dalimit-border), 0 0 8px rgba(124,58,237,0.15);
}

.chart-hint {
  text-align: center;
  font-size: 11px;
  color: var(--text-muted);
  padding: 2px 0 0;
}

.chart-tooltip {
  display: none;
  position: fixed;
  z-index: 1000;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  padding: 12px 14px;
  box-shadow: var(--shadow-lg);
  min-width: 240px;
  max-width: 320px;
  font-size: 12px;
  line-height: 1.6;
  color: var(--text-secondary);
  pointer-events: none;
}

.chart-tooltip-title {
  font-weight: 700;
  color: var(--text-primary);
  font-size: 13px;
  margin-bottom: 6px;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--border-light);
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

.chart-tooltip-sanfang {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px dashed var(--border-light);
  font-size: 11px;
  color: var(--text-muted);
}

.help-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 520px;
  max-width: 94vw;
  max-height: 85vh;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  z-index: 600;
  display: none;
  flex-direction: column;
  overflow: hidden;
}

.help-panel.open {
  display: flex;
  animation: chartPanelIn 0.2s ease;
}

.help-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.help-panel-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.help-panel-title svg { width: 18px; height: 18px; color: var(--accent); }

.help-panel-close {
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

.help-panel-close:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.help-panel-close svg { width: 14px; height: 14px; }

.help-panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.help-section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
  margin-top: 16px;
}

.help-section-title:first-child { margin-top: 0; }

.help-shortcut-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: var(--radius);
  margin-bottom: 2px;
  transition: background var(--transition);
}

.help-shortcut-item:hover {
  background: var(--bg-hover);
}

.help-shortcut-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

.help-shortcut-key {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-primary);
}

.help-kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 24px;
  padding: 0 7px;
  border-radius: 5px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  box-shadow: 0 1px 0 var(--border-color);
  font-size: 11px;
  font-family: var(--font-mono);
  color: var(--text-primary);
  line-height: 1;
}

.help-command-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.help-command-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: var(--radius);
  margin-bottom: 2px;
  transition: background var(--transition);
}

.help-command-item:hover {
  background: var(--bg-hover);
}

.help-command-code {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  min-width: 80px;
}

.help-command-desc {
  font-size: 13px;
  color: var(--text-secondary);
}

.help-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: var(--bg-overlay);
  z-index: 599;
}

.help-overlay.open { display: block; }

.tooltip-sihua-badges {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.tooltip-sihua-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.6;
}

.tooltip-sihua-badge.lu { background: var(--success-light); color: var(--chart-lu); }
.tooltip-sihua-badge.quan { background: var(--warning-light); color: var(--chart-quan); }
.tooltip-sihua-badge.ke { background: var(--info-light); color: var(--chart-ke); }
.tooltip-sihua-badge.ji { background: var(--danger-light); color: var(--chart-ji); }

.inline-chart-container {
  margin: 24px 0;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  max-width: 100%;
}

.inline-chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.inline-chart-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 6px;
}

.inline-chart-title svg {
  width: 16px;
  height: 16px;
  color: var(--accent);
}

.inline-chart-expand {
  font-size: 12px;
  color: var(--accent);
  background: none;
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  padding: 4px 12px;
  cursor: pointer;
  transition: all var(--transition);
  font-weight: 600;
}

.inline-chart-expand:hover {
  background: var(--accent-light);
}

.inline-chart-body {
  padding: 12px;
  position: relative;
}

.chart-grid-inline {
  min-height: 360px;
  max-width: 600px;
  margin: 0 auto;
}

.chart-grid-inline .chart-cell {
  padding: 4px 6px;
  font-size: 10px;
}

.chart-grid-inline .chart-star {
  font-size: 9.5px;
}

.chart-grid-inline .chart-palace-name {
  font-size: 10px;
}

.chart-grid-inline .chart-ganzhi {
  font-size: 9px;
}

.chart-grid-inline .chart-cell.center-cell .center-title {
  font-size: 13px;
}

.chart-grid-inline .chart-cell.center-cell .center-sub {
  font-size: 10px;
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

.system-content { margin: 12px 0; transition: opacity 0.3s ease, max-height 0.3s ease; overflow: hidden; }

[data-system="iztro"] .system-nishi { display: none; }
[data-system="iztro"] .system-combined { display: none; }
[data-system="iztro"] .system-not-iztro { display: none; }

[data-system="nishi"] .system-iztro { display: none; }
[data-system="nishi"] .system-combined { display: none; }
[data-system="nishi"] .system-not-nishi { display: none; }

[data-system="combined"] .system-iztro { display: none; }
[data-system="combined"] .system-nishi { display: none; }

[data-system="nishi"] .system-nishi-note::after {
  content: '（倪师体系不使用）';
  font-size: 11px;
  color: var(--chart-ji);
  margin-left: 4px;
}

[data-system="nishi"] .system-not-nishi-ref::after {
  content: '（供参考，倪师体系不主张）';
  font-size: 11px;
  color: var(--chart-ke);
  margin-left: 4px;
}

.system-content-fade-out {
  opacity: 0;
  max-height: 0;
  transition: opacity 0.25s ease, max-height 0.25s ease;
}

.source-ref {
  display: none;
}

.system-content-fade-in {
  opacity: 1;
  max-height: 9999px;
  transition: opacity 0.3s ease 0.05s, max-height 0.3s ease 0.05s;
}

@media print {
  .system-content { display: block !important; }
  .system-nishi-note::after,
  .system-not-nishi-ref::after { display: none !important; }
}

@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.open {
    transform: translateX(0);
  }
  .toolbar {
    top: 0;
    right: 0;
    left: 0;
    padding: 6px 10px 6px 52px;
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
    justify-content: flex-end;
    gap: 4px;
    transition: background var(--transition), border-color var(--transition);
  }
  .mode-btn-group {
    position: static;
    margin-right: auto;
  }
  .mobile-menu-btn {
    display: flex;
    top: 6px;
    left: 10px;
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    box-shadow: var(--shadow-sm);
  }
  .mobile-toc-fab {
    display: flex;
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    border: none;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    box-shadow: var(--shadow-lg);
    z-index: 150;
    transition: all var(--transition);
  }
  .mobile-toc-fab:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: var(--shadow-xl);
  }
  .mobile-toc-fab svg { width: 20px; height: 20px; }
  .mobile-toc-drawer {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 60vh;
    background: var(--bg-card);
    border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    box-shadow: var(--shadow-xl);
    z-index: 600;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .mobile-toc-drawer.open {
    display: flex;
    transform: translateY(0);
  }
  .mobile-toc-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;
  }
  .mobile-toc-drawer-title {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
  }
  .mobile-toc-drawer-close {
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
  .mobile-toc-drawer-close:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  .mobile-toc-drawer-close svg { width: 14px; height: 14px; }
  .mobile-toc-drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
    -webkit-overflow-scrolling: touch;
  }
  .mobile-toc-drawer-body .toc-list {
    list-style: none;
    padding: 0 12px;
  }
  .mobile-toc-drawer-body .toc-item { margin-bottom: 1px; }
  .mobile-toc-drawer-body .toc-link {
    display: block;
    padding: 10px 14px;
    color: var(--text-secondary);
    text-decoration: none;
    font-size: 14px;
    border-radius: var(--radius);
    transition: all var(--transition);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mobile-toc-drawer-body .toc-link:hover,
  .mobile-toc-drawer-body .toc-link:active {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  .mobile-toc-drawer-body .toc-link.active {
    background: var(--accent-light);
    color: var(--accent);
    font-weight: 600;
  }
  .mobile-toc-drawer-body .toc-h3 {
    padding-left: 28px;
    font-size: 13px;
  }
  .mobile-toc-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: var(--bg-overlay);
    z-index: 599;
    opacity: 0;
    transition: opacity var(--transition);
  }
  .mobile-toc-overlay.visible {
    opacity: 1;
  }
  .main-content {
    margin-left: 0;
    padding: 24px 16px 60px;
    padding-top: 60px;
  }
  .chart-panel {
    width: 98vw;
    max-height: 85vh;
  }
  .chart-grid {
    min-height: 340px;
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
  .chart-zoom-controls {
    display: none;
  }
}

@media (max-width: 480px) {
  .toolbar {
    padding: 5px 6px 5px 46px;
    gap: 3px;
  }
  .toolbar-btn {
    width: 30px;
    height: 30px;
  }
  .toolbar-btn svg {
    width: 14px;
    height: 14px;
  }
  .mode-btn {
    padding: 3px 6px;
    font-size: 10px;
  }
  .mobile-menu-btn {
    top: 5px;
    left: 6px;
    width: 30px;
    height: 30px;
  }
  .mobile-menu-btn svg {
    width: 14px;
    height: 14px;
  }
  .main-content {
    padding-top: 54px;
  }
  h2 { scroll-margin-top: 54px; }
  h3 { scroll-margin-top: 54px; }
}

.toc-group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}

.toc-group-header .toc-link {
  flex: 1;
  min-width: 0;
}

.toc-toggle {
  width: 20px;
  height: 20px;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  flex-shrink: 0;
  padding: 0;
}

.toc-toggle:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.toc-toggle svg {
  transition: transform 0.2s ease;
}

.toc-group.collapsed .toc-toggle svg {
  transform: rotate(-90deg);
}

.toc-children {
  list-style: none;
  padding: 0;
  margin: 0;
  overflow: hidden;
  max-height: 2000px;
  transition: max-height 0.3s ease, opacity 0.2s ease;
  opacity: 1;
}

.toc-group.collapsed .toc-children {
  max-height: 0;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.15s ease;
}

.toc-group-h3 {
  padding-left: 12px;
}

.toc-group-h3 > .toc-group-header .toc-link {
  font-size: 13px;
}

.toc-group-h3 > .toc-children .toc-link {
  padding-left: 36px;
  font-size: 12px;
}

.toc-group-h3 > .toc-children .toc-h5 {
  padding-left: 44px;
  font-size: 11.5px;
}

.toc-group-h3 > .toc-children .toc-h6 {
  padding-left: 52px;
  font-size: 11px;
}

@media print {
  .sidebar, .toolbar, .back-to-top, .chart-fab, .chart-panel, .chart-overlay,
  .mobile-menu-btn, .progress-bar, .section-toggle, .inline-chart-expand,
  .mode-btn-group, .toc-toggle { display: none !important; }
  .toc-group.collapsed .toc-children { max-height: none !important; opacity: 1 !important; }
  .main-content { margin-left: 0; padding: 0; max-width: 100%; }
  body { background: white; color: black; }
  .table-wrapper { border: 1px solid #ddd; }
  .tag, .star-badge { border: 1px solid currentColor; background: transparent; }
  .section-wrapper.collapsed .section-content { display: block !important; }
  .chart-cell { border: 1px solid #ccc !important; }
  .chart-cell.palace-ming { background: #fff8e1 !important; }
}
`;
}

module.exports = { getStyles };
