#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { getStyles } = require('./lib/styles');
const { getInteractionScript } = require('./lib/interaction');
const { markdownToHtml, extractTitle, escapeHtml } = require('./lib/parser');
const { extractChartData } = require('./lib/chart');
const { generateToc } = require('./lib/toc');

function waitForFile(filePath, maxWaitMs) {
  var start = Date.now();
  var lastSize = 0;
  var stableCount = 0;
  while (Date.now() - start < maxWaitMs) {
    try {
      var stat = fs.statSync(filePath);
      if (stat.size > 0) {
        if (stat.size === lastSize) {
          stableCount++;
          if (stableCount >= 3) return true;
        } else {
          stableCount = 0;
          lastSize = stat.size;
        }
      }
    } catch(e) {}
    var waited = Date.now() - start;
    if (waited < 500) {
      require('child_process').spawnSync('sleep', ['0.1']);
    } else {
      break;
    }
  }
  return lastSize > 0 && stableCount >= 2;
}

function validateMdContent(mdContent, mdFilePath) {
  var issues = [];
  var h2Count = (mdContent.match(/^## /gm) || []).length;
  if (h2Count < 8) {
    issues.push('MD has only ' + h2Count + ' H2 sections, expected 10+ - file may be truncated');
  }
  if (!mdContent.includes('自检清单') && mdContent.includes('## 十一、附录')) {
    issues.push('MD has 十一、附录 but missing 自检清单 - file may be truncated');
  }
  var lastLine = mdContent.trim().split('\n').pop() || '';
  if (lastLine.trim() === '' || lastLine.trim().startsWith('|')) {
    issues.push('MD ends abruptly (last line: "' + lastLine.trim().substring(0, 50) + '") - file may be truncated');
  }
  if (!mdContent.includes('生成日期')) {
    issues.push('MD missing footer (生成日期) - file may be truncated');
  }
  return issues;
}

function validateHtmlOutput(htmlContent, mdContent) {
  var issues = [];
  var mdH2Count = (mdContent.match(/^## /gm) || []).length;
  var htmlH2Count = (htmlContent.match(/<h2/g) || []).length;
  if (htmlH2Count < mdH2Count) {
    issues.push('HTML has ' + htmlH2Count + ' H2 sections but MD has ' + mdH2Count + ' - HTML is truncated');
  }
  if (!htmlContent.includes('</body>') || !htmlContent.includes('</html>')) {
    issues.push('HTML missing closing tags - file is truncated');
  }
  if (mdContent.includes('自检清单') && !htmlContent.includes('自检清单')) {
    issues.push('HTML missing 自检清单 - HTML is truncated');
  }
  var mdH3Count = (mdContent.match(/^### /gm) || []).length;
  var htmlH3Count = (htmlContent.match(/<h3/g) || []).length;
  if (htmlH3Count < mdH3Count - 3) {
    issues.push('HTML has ' + htmlH3Count + ' H3 sections but MD has ' + mdH3Count + ' - significant content loss');
  }
  return issues;
}

function convertMdToHtml(mdFilePath, outputFilePath) {
  if (!waitForFile(mdFilePath, 3000)) {
    console.error('⚠️ MD file not stable after 3s, proceeding anyway...');
  }

  var mdContent = fs.readFileSync(mdFilePath, 'utf-8');

  var mdIssues = validateMdContent(mdContent, mdFilePath);
  if (mdIssues.length > 0) {
    console.error('⚠️ MD content validation warnings:');
    mdIssues.forEach(function(issue) { console.error('   - ' + issue); });
    console.error('   The MD file may be incomplete. Proceeding with conversion...');
  }

  const fileName = path.basename(mdFilePath, '.md');
  const mdDir = path.dirname(mdFilePath);
  var externalChartData = null;
  var chartJsonPath = path.join(mdDir, 'chart-data.json');
  if (fs.existsSync(chartJsonPath)) {
    try {
      externalChartData = JSON.parse(fs.readFileSync(chartJsonPath, 'utf-8'));
    } catch(e) {}
  }
  if (!externalChartData) {
    var mainReportFiles = fs.readdirSync(mdDir).filter(function(f) {
      return f.startsWith('命盘详析') && f.endsWith('.md');
    });
    if (mainReportFiles.length > 0) {
      try {
        var mainMd = fs.readFileSync(path.join(mdDir, mainReportFiles[0]), 'utf-8');
        externalChartData = extractChartData(mainMd);
      } catch(e) {}
    }
  }

  var maxRetries = 3;
  var htmlContent;
  for (var attempt = 1; attempt <= maxRetries; attempt++) {
    htmlContent = generateHtml(mdContent, fileName, externalChartData);
    var htmlIssues = validateHtmlOutput(htmlContent, mdContent);
    if (htmlIssues.length === 0) {
      break;
    }
    console.error('⚠️ HTML validation attempt ' + attempt + '/' + maxRetries + ' found issues:');
    htmlIssues.forEach(function(issue) { console.error('   - ' + issue); });
    if (attempt < maxRetries) {
      console.error('   Retrying conversion...');
    }
  }

  fs.writeFileSync(outputFilePath, htmlContent, 'utf-8');

  var finalHtml = fs.readFileSync(outputFilePath, 'utf-8');
  var finalIssues = validateHtmlOutput(finalHtml, mdContent);
  if (finalIssues.length > 0) {
    console.error('❌ Final HTML validation FAILED:');
    finalIssues.forEach(function(issue) { console.error('   - ' + issue); });
    process.exit(1);
  }

  console.log('Generated: ' + outputFilePath);
  console.log('  MD: ' + mdContent.split('\n').length + ' lines, ' + mdContent.length + ' chars');
  console.log('  HTML: ' + finalHtml.length + ' chars, ' + (finalHtml.match(/<h2/g) || []).length + ' H2 sections');
}

function normalizeChartData(data) {
  if (!data || !data.palaces || data.palaces.length === 0) return data;
  if (data.palaces[0].position !== undefined) return data;
  if (data.palaces[0].index === undefined) return data;

  var palacePositions = {
    '命宫': 5, '兄弟': 6, '兄弟宫': 6, '夫妻': 7, '夫妻宫': 7,
    '子女': 8, '子女宫': 8, '财帛': 9, '财帛宫': 9,
    '疾厄': 10, '疾厄宫': 10, '迁移': 11, '迁移宫': 11,
    '仆役': 0, '仆役宫': 0, '交友': 0, '交友宫': 0,
    '官禄': 1, '官禄宫': 1, '事业': 1, '事业宫': 1,
    '田宅': 2, '田宅宫': 2, '福德': 3, '福德宫': 3,
    '父母': 4, '父母宫': 4
  };

  var result = { palaces: [], info: {} };

  if (data.basicInfo) {
    var bi = data.basicInfo;
    result.info.name = bi.gender || '';
    result.info.ganzhi = bi.chineseDate || '';
    result.info.wuxingju = bi.fiveElementsClass || '';
    result.info.gender = bi.gender || '';
    result.info.minggong = bi.soulPalace ? bi.soulPalace + '宫' : '';
    result.info.mingzhu = bi.soul || '';
    result.info.shenzhu = bi.body || '';
  }

  var mutagenMap = {};
  if (data.birthMutagens) {
    data.birthMutagens.forEach(function(m) {
      mutagenMap[m.palaceIndex + '_' + m.star] = '化' + m.mutagen;
    });
  }

  data.palaces.forEach(function(p) {
    var position = palacePositions[p.name];
    if (position === undefined) return;

    var ganzhi = (p.heavenlyStem || '') + (p.earthlyBranch || '');

    var mainStars = [];
    if (p.majorStars) {
      p.majorStars.forEach(function(s) {
        var sihua = '';
        if (s.mutagen) {
          sihua = '化' + s.mutagen;
        } else {
          var key = p.index + '_' + s.name;
          if (mutagenMap[key]) sihua = mutagenMap[key];
        }
        mainStars.push({ name: s.name, brightness: s.brightness || '', sihua: sihua });
      });
    }

    var auxStars = [];
    var miscStars = [];
    if (p.minorStars) {
      p.minorStars.forEach(function(s) {
        var sihua = '';
        if (s.mutagen) sihua = '【' + s.mutagen + '】';
        auxStars.push(s.name + sihua);
      });
    }
    if (p.adjectiveStars) {
      p.adjectiveStars.forEach(function(s) {
        miscStars.push(s.name);
      });
    }

    var dalimit = '';
    if (p.decadal && p.decadal.range) {
      dalimit = p.decadal.range[0] + '-' + p.decadal.range[1] + '岁';
    }

    var note = '';
    if (p.isOriginalPalace) note = '★来因宫';

    result.palaces.push({
      name: p.name,
      ganzhi: ganzhi,
      position: position,
      mainStars: mainStars,
      auxStars: auxStars,
      miscStars: miscStars,
      changsheng: p.changsheng12 || '',
      dalimit: dalimit,
      note: note,
      isBodyPalace: p.isBodyPalace || false,
      isLaiyinPalace: p.isOriginalPalace || false
    });
  });

  return result;
}

function enhanceHtml(html) {
  html = html.replace(
    /\[来源:\s*([^\]]+)\]/g,
    function(match, ref) {
      return '<span class="source-ref" title="' + escapeHtml(ref) + '" data-source="' + escapeHtml(ref) + '"></span>';
    }
  );

  html = html.replace(
    /(<div class="interpretation-block pro[^"]*">[\s\S]*?<!-- \/interp-block -->)\s*(<div class="interpretation-block lay[^"]*">[\s\S]*?<!-- \/interp-block -->)/g,
    function(match, pro, lay) {
      return '<div class="interpretation-pair"><div class="interpretation-connector"></div>' + pro + lay + '</div>';
    }
  );

  html = html.replace(
    /<blockquote class="blockquote nishi-quote">([\s\S]*?)<\/blockquote>/g,
    function(match, content) {
      return '<blockquote class="blockquote nishi-quote system-content system-not-iztro">' + content + '</blockquote>';
    }
  );

  html = html.replace(
    /(<blockquote class="blockquote">)([\s\S]*?)(倪师|倪海厦|天纪)([\s\S]*?)(<\/blockquote>)/g,
    function(match, open, pre, keyword, post, close) {
      return '<blockquote class="blockquote nishi-quote system-content system-not-iztro">' + pre + keyword + post + close;
    }
  );

  html = html.replace(
    /(<p>[\s\S]*?>)([^<]*?)(宫干飞化|自化)([^<]*?)(<\/p>)/g,
    function(match, open, pre, keyword, post, close) {
      return open + pre + '<span class="system-not-nishi-ref">' + keyword + '</span>' + post + close;
    }
  );

  html = html.replace(
    /(<p>[\s\S]*?>)([^<]*?)(大限四化)([^<]*?)(<\/p>)/g,
    function(match, open, pre, keyword, post, close) {
      return open + pre + '<span class="system-nishi-note">' + keyword + '</span>' + post + close;
    }
  );

  html = html.replace(
    /【格局[：:]?\s*([^\】]+?)】([\s\S]*?)(?=【|$)/g,
    function(match, title, content) {
      var level = 'neutral';
      var t = title.trim();
      if (t.indexOf('极佳') >= 0 || t.indexOf('上上') >= 0 || t.indexOf('大吉') >= 0) level = 'excellent';
      else if (t.indexOf('吉') >= 0 || t.indexOf('良') >= 0 || t.indexOf('优') >= 0) level = 'good';
      else if (t.indexOf('凶') >= 0 || t.indexOf('险') >= 0 || t.indexOf('忌') >= 0 || t.indexOf('煞') >= 0) level = 'caution';
      return '<div class="pattern-card ' + level + '"><div class="pattern-card-title">' + escapeHtml(t) + '</div>' + content.trim() + '</div>';
    }
  );

  var inlineChartHtml = '<div class="inline-chart-container" id="inlineChartContainer">'
    + '<div class="inline-chart-header">'
    + '<span class="inline-chart-title">'
    + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>'
    + '命盘排盘图</span>'
    + '<button class="inline-chart-expand" onclick="toggleChart()">放大查看</button>'
    + '</div>'
    + '<div class="inline-chart-body">'
    + '<div class="chart-dalimit-bar" id="inlineChartDalimitBar"></div>'
    + '<div class="chart-grid-wrapper">'
    + '<div class="chart-grid chart-grid-inline" id="inlineChartGrid"></div>'
    + '<svg class="chart-svg-overlay" id="inlineChartSvgOverlay"></svg>'
    + '</div>'
    + '</div>'
    + '</div>';

  html = html.replace(
    /(<div class="section-wrapper" data-section-id="[^"]*十二宫[^"]*">)/,
    inlineChartHtml + '$1'
  );

  if (html.indexOf('inlineChartContainer') < 0) {
    html = html.replace(
      /(<h2[^>]*>[^<]*十二宫排盘总表[^<]*<\/h2>)/,
      inlineChartHtml + '$1'
    );
  }

  return html;
}

function generateHtml(mdContent, fileName, externalChartData) {
  var bodyHtml = markdownToHtml(mdContent);
  bodyHtml = enhanceHtml(bodyHtml);
  const toc = generateToc(mdContent);
  var chartData = extractChartData(mdContent);
  if ((!chartData || !chartData.palaces || chartData.palaces.length === 0) && externalChartData) {
    chartData = normalizeChartData(externalChartData);
  }

  return `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light" data-system="combined">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(extractTitle(mdContent))}</title>
<style>
${getStyles()}
</style>
</head>
<body>

<div class="progress-bar" id="progressBar"><div class="progress-fill" id="progressFill"></div></div>

<button class="mobile-menu-btn toolbar-btn" onclick="toggleSidebar()" aria-label="Menu">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
</button>

<div class="toolbar">
  <div class="mode-btn-group">
    <button class="mode-btn" data-mode="iztro" onclick="switchSystem('iztro')">iztro</button>
    <button class="mode-btn" data-mode="nishi" onclick="switchSystem('nishi')">倪师</button>
    <button class="mode-btn" data-mode="combined" onclick="switchSystem('combined')">综合</button>
  </div>
  <button class="toolbar-btn" onclick="toggleChart()" aria-label="排盘图" title="排盘图">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  </button>
  <button class="toolbar-btn" onclick="toggleTheme()" id="themeBtn" aria-label="Toggle theme">
    <svg id="themeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
  </button>
  <button class="toolbar-btn" onclick="toggleHelp()" aria-label="帮助" title="快捷指令帮助">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  </button>
</div>

<nav class="sidebar" id="sidebar">
  <div class="sidebar-header">
    <div class="sidebar-title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
      紫微斗数命盘
    </div>
  </div>
  <div class="sidebar-system-indicator">
    <span class="sidebar-system-dot"></span>
    <span class="sidebar-system-name" id="sidebarSystemName">综合模式</span>
  </div>
  <ul class="toc-list" id="tocList">
${toc}
  </ul>
</nav>

<div class="sidebar-overlay" id="sidebarOverlay" onclick="closeSidebar()"></div>

<main class="main-content" id="mainContent">
${bodyHtml}
</main>

<button class="mobile-toc-fab" onclick="toggleMobileToc()" aria-label="目录" title="目录">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h10"/></svg>
</button>

<button class="chart-fab" onclick="toggleChart()" aria-label="排盘图" title="排盘图">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
</button>

<button class="back-to-top" id="backToTop" onclick="document.documentElement.scrollTo({top:0,behavior:'smooth'})" aria-label="Back to top">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
</button>

<div class="chart-overlay" id="chartOverlay" onclick="closeChart()"></div>

<div class="chart-panel" id="chartPanel">
  <div class="chart-panel-header" id="chartPanelHeader">
    <div class="chart-panel-title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
      命盘排盘图
      <span class="chart-panel-system-badge" id="chartSystemBadge">综合</span>
    </div>
    <div class="chart-panel-actions">
      <div class="chart-zoom-controls">
        <button class="chart-zoom-btn" onclick="chartZoomOut()" title="缩小">−</button>
        <span class="chart-zoom-level" id="chartZoomLevel">100%</span>
        <button class="chart-zoom-btn" onclick="chartZoomIn()" title="放大">+</button>
        <button class="chart-zoom-btn" onclick="chartZoomReset()" title="重置" style="font-size:11px;">↺</button>
      </div>
      <button class="chart-panel-btn" onclick="minimizeChart()" title="最小化">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>
      </button>
      <button class="chart-panel-btn" onclick="closeChart()" title="关闭">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
  </div>
  <div class="chart-panel-body" id="chartPanelBody">
    <div class="chart-dalimit-bar" id="chartDalimitBar"></div>
    <div class="chart-grid-wrapper" id="chartGridWrapper">
      <div class="chart-grid" id="chartGrid"></div>
      <svg class="chart-svg-overlay" id="chartSvgOverlay"></svg>
    </div>
    <div class="chart-legend">
      <span class="chart-legend-item"><span class="chart-legend-dot lu"></span>化禄</span>
      <span class="chart-legend-item"><span class="chart-legend-dot quan"></span>化权</span>
      <span class="chart-legend-item"><span class="chart-legend-dot ke"></span>化科</span>
      <span class="chart-legend-item"><span class="chart-legend-dot ji"></span>化忌</span>
    </div>
    <div class="chart-hint">点击宫位查看三方四正连线</div>
  </div>
  <div class="chart-panel-resize" id="chartResize"></div>
</div>

<div class="chart-tooltip" id="chartTooltip"></div>

<div class="mobile-toc-overlay" id="mobileTocOverlay" onclick="closeMobileToc()"></div>
<div class="mobile-toc-drawer" id="mobileTocDrawer">
  <div class="mobile-toc-drawer-header">
    <span class="mobile-toc-drawer-title">目录</span>
    <button class="mobile-toc-drawer-close" onclick="closeMobileToc()" aria-label="关闭">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  </div>
  <div class="mobile-toc-drawer-body" id="mobileTocBody"></div>
</div>

<div class="help-overlay" id="helpOverlay" onclick="closeHelp()"></div>

<div class="help-panel" id="helpPanel">
  <div class="help-panel-header">
    <div class="help-panel-title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      快捷指令帮助
    </div>
    <button class="help-panel-close" onclick="closeHelp()" title="关闭">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  </div>
  <div class="help-panel-body">
    <div class="help-section-title">键盘快捷键</div>
    <ul class="help-shortcut-list">
      <li class="help-shortcut-item"><span class="help-shortcut-desc">切换明/暗主题</span><span class="help-shortcut-key"><span class="help-kbd">T</span></span></li>
      <li class="help-shortcut-item"><span class="help-shortcut-desc">切换到 iztro 模式</span><span class="help-shortcut-key"><span class="help-kbd">1</span></span></li>
      <li class="help-shortcut-item"><span class="help-shortcut-desc">切换到倪师模式</span><span class="help-shortcut-key"><span class="help-kbd">2</span></span></li>
      <li class="help-shortcut-item"><span class="help-shortcut-desc">切换到综合模式</span><span class="help-shortcut-key"><span class="help-kbd">3</span></span></li>
      <li class="help-shortcut-item"><span class="help-shortcut-desc">显示/隐藏帮助面板</span><span class="help-shortcut-key"><span class="help-kbd">?</span></span></li>
      <li class="help-shortcut-item"><span class="help-shortcut-desc">关闭所有弹窗</span><span class="help-shortcut-key"><span class="help-kbd">Esc</span></span></li>
    </ul>
    <div class="help-section-title">专项解读</div>
    <ul class="help-command-list">
      <li class="help-command-item"><span class="help-command-code">\\money</span><span class="help-command-desc">财运分析</span></li>
      <li class="help-command-item"><span class="help-command-code">\\health</span><span class="help-command-desc">健康分析</span></li>
      <li class="help-command-item"><span class="help-command-code">\\love</span><span class="help-command-desc">感情分析</span></li>
      <li class="help-command-item"><span class="help-command-code">\\match</span><span class="help-command-desc">合盘分析（需提供另一半信息）</span></li>
      <li class="help-command-item"><span class="help-command-code">\\career</span><span class="help-command-desc">事业分析</span></li>
      <li class="help-command-item"><span class="help-command-code">\\year</span><span class="help-command-desc">流年运势</span></li>
    </ul>
    <div class="help-section-title">时运选择</div>
    <ul class="help-command-list">
      <li class="help-command-item"><span class="help-command-code">\\dash</span><span class="help-command-desc">大限选择（列出所有大限，选择后详解）</span></li>
      <li class="help-command-item"><span class="help-command-code">\\flow</span><span class="help-command-desc">流年选择（列出流年，选择后详解）</span></li>
      <li class="help-command-item"><span class="help-command-code">\\month</span><span class="help-command-desc">流月选择（列出12月，选择后详解）</span></li>
    </ul>
    <div class="help-section-title">辅助工具</div>
    <ul class="help-command-list">
      <li class="help-command-item"><span class="help-command-code">\\question</span><span class="help-command-desc">AI向用户提问</span></li>
      <li class="help-command-item"><span class="help-command-code">\\switch</span><span class="help-command-desc">切换解读体系</span></li>
      <li class="help-command-item"><span class="help-command-code">\\help</span><span class="help-command-desc">显示指令帮助</span></li>
    </ul>
  </div>
</div>

<script>
${getInteractionScript(chartData)}
</script>
</body>
</html>`;
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
