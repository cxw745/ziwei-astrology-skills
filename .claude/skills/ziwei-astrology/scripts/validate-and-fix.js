#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

var args = process.argv.slice(2);
var jsonOutput = false;
var filteredArgs = [];

for (var i = 0; i < args.length; i++) {
  if (args[i] === '--json') {
    jsonOutput = true;
  } else {
    filteredArgs.push(args[i]);
  }
}

if (filteredArgs.length < 2) {
  console.log('用法：node validate-and-fix.js <chart-data.json> <report.md> [--json]');
  console.log('');
  console.log('参数：');
  console.log('  chart-data.json  排盘数据文件');
  console.log('  report.md        生成的报告文件');
  console.log('  --json           输出结构化JSON（默认输出彩色终端）');
  process.exit(1);
}

var chartPath = path.resolve(filteredArgs[0]);
var reportPath = path.resolve(filteredArgs[1]);

if (!fs.existsSync(chartPath)) {
  console.log('错误：文件不存在 ' + chartPath);
  process.exit(1);
}
if (!fs.existsSync(reportPath)) {
  console.log('错误：文件不存在 ' + reportPath);
  process.exit(1);
}

var chart = JSON.parse(fs.readFileSync(chartPath, 'utf-8'));
var report = fs.readFileSync(reportPath, 'utf-8');
var reportLines = report.split('\n');

var scriptsDir = path.resolve(__dirname);

function runScript(scriptName) {
  var scriptPath = path.join(scriptsDir, scriptName);
  if (!fs.existsSync(scriptPath)) {
    return { error: '脚本不存在: ' + scriptPath };
  }
  try {
    var output = execSync('node "' + scriptPath + '" "' + chartPath + '" "' + reportPath + '"', {
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { output: output };
  } catch (e) {
    return { output: e.stdout || '', error: e.message, exitCode: e.status };
  }
}

function runLintScript() {
  var scriptPath = path.join(scriptsDir, 'lint-md.js');
  if (!fs.existsSync(scriptPath)) {
    return { error: '脚本不存在: ' + scriptPath };
  }
  try {
    var output = execSync('node "' + scriptPath + '" "' + reportPath + '"', {
      encoding: 'utf-8',
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return { output: output };
  } catch (e) {
    return { output: e.stdout || '', error: e.message, exitCode: e.status };
  }
}

var astroResult = runScript('verify-astro.js');
var reportResult = runScript('validate-report.js');
var lintResult = runLintScript();

var astroDetails = parseAstroResults(astroResult.output || '');
var reportDetails = parseReportResults(reportResult.output || '');
var lintDetails = parseLintResults(lintResult.output || '');

function parseAstroResults(output) {
  var results = [];
  var lines = output.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    var match = line.match(/^([✅❌])\s+(\w)\.\s+(.+)/);
    if (match) {
      results.push({
        id: match[2],
        name: match[3],
        pass: match[1] === '✅'
      });
    }
  }
  return results;
}

function parseReportResults(output) {
  var results = [];
  var lines = output.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    var match = line.match(/^([✅❌])\s+#(\d+)\s+(.+)/);
    if (match) {
      results.push({
        id: parseInt(match[2], 10),
        name: match[3],
        pass: match[1] === '✅'
      });
    }
  }
  return results;
}

function parseLintResults(output) {
  var results = [];
  var lines = output.split('\n');
  var currentCheck = null;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    var match = line.match(/^([✅❌])\s+(.+)/);
    if (match) {
      if (currentCheck) {
        results.push(currentCheck);
      }
      currentCheck = {
        name: match[2],
        pass: match[1] === '✅',
        details: []
      };
    } else if (currentCheck && !currentCheck.pass && line.length > 0) {
      currentCheck.details.push(line);
    }
  }
  if (currentCheck) {
    results.push(currentCheck);
  }
  return results;
}

var astroPassCount = astroDetails.filter(function(r) { return r.pass; }).length;
var reportPassCount = reportDetails.filter(function(r) { return r.pass; }).length;
var lintPassCount = lintDetails.filter(function(r) { return r.pass; }).length;

var astroFailCount = astroDetails.length - astroPassCount;
var reportFailCount = reportDetails.length - reportPassCount;
var lintFailCount = lintDetails.length - lintPassCount;

var totalChecks = astroDetails.length + reportDetails.length + lintDetails.length;
var totalPass = astroPassCount + reportPassCount + lintPassCount;
var totalFail = astroFailCount + reportFailCount + lintFailCount;

var fixSuggestions = [];

var ASTRO_FIX_MAP = {
  'a': { checkName: '星曜位置校验', severity: 'high', fixDirection: '检查十二宫排盘总表中主星位置是否与排盘数据一致', searchPattern: '^\\| \\s*{宫名}' },
  'b': { checkName: '四化校验', severity: 'high', fixDirection: '检查生年四化表中化禄/化权/化科/化忌的星曜和宫位是否与排盘数据一致', searchPattern: '^\\| 化[禄权科忌]' },
  'c': { checkName: '空宫校验', severity: 'high', fixDirection: '对空宫添加借对宫标注，如"借{对宫地支}宫{主星}"', searchPattern: '空宫|空（' },
  'd': { checkName: '身宫校验', severity: 'medium', fixDirection: '在身宫所在宫位的备注列添加★身宫标注', searchPattern: '★身宫' },
  'e': { checkName: '来因宫校验', severity: 'medium', fixDirection: '在来因宫所在宫位的备注列添加★来因宫标注', searchPattern: '★来因宫' },
  'f': { checkName: '五行局校验', severity: 'high', fixDirection: '修正基本信息表格中五行局的值，使其与排盘数据一致', searchPattern: '\\| 五行局 \\|' },
  'g': { checkName: '命宫位置校验', severity: 'high', fixDirection: '修正基本信息表格中命宫的地支位置', searchPattern: '\\| 命宫 \\|' }
};

var REPORT_FIX_MAP = {
  1: { checkName: '十二宫主星位置', severity: 'high', fixDirection: '补全十二宫分论章节，确保12个宫位均有对应章节' },
  2: { checkName: '生年四化', severity: 'high', fixDirection: '补全生年四化表，确保4条四化（化禄/化权/化科/化忌）全部列出' },
  3: { checkName: '宫干飞四化总表', severity: 'high', fixDirection: '补全宫干飞四化总表，确保12宫各有一行' },
  4: { checkName: '空宫借对宫标注', severity: 'medium', fixDirection: '对空宫添加借对宫说明，标注"借{对宫}宫{主星}"' },
  5: { checkName: '身宫叠加标注', severity: 'medium', fixDirection: '添加★身宫标注，确保身宫信息在总表和文本中均有体现' },
  6: { checkName: '来因宫标注', severity: 'medium', fixDirection: '添加★来因宫标注，确保来因宫信息在总表和文本中均有体现' },
  7: { checkName: '格局判断三层结构', severity: 'medium', fixDirection: '为每个格局添加必须条件/加分条件/破格条件三层结构表格' },
  8: { checkName: '来源标注', severity: 'low', fixDirection: '添加[来源: xxx]标注，确保事实性内容有来源引用' },
  9: { checkName: '无讨好倾向', severity: 'medium', fixDirection: '删除讨好性描述，化忌等凶象应如实描述' },
  10: { checkName: '十二宫子节完整性', severity: 'high', fixDirection: '补全各宫的主星特质与亮度子节' },
  11: { checkName: '五行局推算步骤', severity: 'medium', fixDirection: '补充五行局推算步骤至8步' },
  12: { checkName: '命宫总论独立章节', severity: 'high', fixDirection: '添加 ## 五、命宫总论 独立章节' },
  13: { checkName: '大限运势', severity: 'medium', fixDirection: '补全大限运势章节，每个大限含表格+分析' },
  14: { checkName: '流年要点', severity: 'medium', fixDirection: '补全流年要点章节，至少3年含四化分析' },
  15: { checkName: '综合建议子章节', severity: 'medium', fixDirection: '补全综合建议子章节，至少5个' },
  16: { checkName: '附录存在', severity: 'high', fixDirection: '添加 ## 十一、附录 章节' },
  17: { checkName: '每宫子节完整性', severity: 'high', fixDirection: '确保每宫包含主星特质与亮度子节和总评' },
  18: { checkName: '飞四化48条完整性', severity: 'high', fixDirection: '补全宫干飞四化总表，确保12行×4化=48条' },
  19: { checkName: '来源标注密度', severity: 'low', fixDirection: '增加来源标注密度至≥30处' },
  20: { checkName: '倪师断语引用', severity: 'medium', fixDirection: '增加倪师断语引用至≥5处' },
  21: { checkName: '报告总行数', severity: 'low', fixDirection: '扩展报告内容至≥500行' },
  22: { checkName: '无讨好倾向扩展检查', severity: 'medium', fixDirection: '删除"不必担心""一定能够""越来越好"等讨好性表述' },
  23: { checkName: '附录术语解释', severity: 'medium', fixDirection: '在附录中添加术语解释子节' },
  24: { checkName: '附录亮度对照', severity: 'medium', fixDirection: '在附录中添加星曜亮度对照表' }
};

var LINT_FIX_MAP = {
  '标题层级连续性': { severity: 'medium', fixDirection: '修正标题层级，确保不跳级（如H2直接到H4）' },
  '表格格式': { severity: 'high', fixDirection: '修正表格格式，确保每行以|开头和结尾，且包含分隔行' },
  '章节完整性（一、到十一、）': { severity: 'high', fixDirection: '补全缺失的章节标题' },
  '空行规范（标题前后空行）': { severity: 'low', fixDirection: '在标题前后添加空行' },
  '列表格式（有序列表使用"数字."）': { severity: 'low', fixDirection: '将有序列表格式改为"数字."格式' },
  '引用块格式（使用 > 开头）': { severity: 'low', fixDirection: '将引用块格式改为 > 开头' },
  '无HTML标签残留': { severity: 'medium', fixDirection: '删除HTML标签，改用Markdown格式' },
  '四化标记格式（[禄]/[权]/[科]/[忌]）': { severity: 'high', fixDirection: '修正四化标记格式为[禄]/[权]/[科]/[忌]' },
  '来源标注格式（[来源: xxx]）': { severity: 'medium', fixDirection: '修正来源标注格式为[来源: xxx]' },
  '无多余空行（连续3行以上）': { severity: 'low', fixDirection: '删除连续3行以上的多余空行' }
};

function findLineNumber(pattern, lines) {
  var regex = new RegExp(pattern);
  for (var i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      return i + 1;
    }
  }
  return 0;
}

function findLineRange(keyword, lines) {
  var startLine = 0;
  var endLine = 0;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf(keyword) !== -1) {
      if (startLine === 0) startLine = i + 1;
      endLine = i + 1;
    }
  }
  return { start: startLine, end: endLine };
}

astroDetails.forEach(function(r) {
  if (!r.pass) {
    var fixInfo = ASTRO_FIX_MAP[r.id] || {};
    var lineRange = { start: 0, end: 0 };
    if (r.id === 'a' || r.id === 'c' || r.id === 'd' || r.id === 'e') {
      lineRange = findLineRange('十二宫排盘', reportLines);
    } else if (r.id === 'b') {
      lineRange = findLineRange('生年四化', reportLines);
    } else if (r.id === 'f' || r.id === 'g') {
      lineRange = findLineRange('基本信息', reportLines);
    }

    fixSuggestions.push({
      source: 'astro',
      checkId: r.id,
      checkName: fixInfo.checkName || r.name,
      currentValue: extractCurrentValue(r.name),
      expectedValue: extractExpectedValue(r.name, chart),
      fixDirection: fixInfo.fixDirection || '请检查排盘数据与报告的一致性',
      lineRange: lineRange,
      severity: fixInfo.severity || 'medium'
    });
  }
});

reportDetails.forEach(function(r) {
  if (!r.pass) {
    var fixInfo = REPORT_FIX_MAP[r.id] || {};
    var lineRange = { start: 0, end: 0 };

    if (r.id >= 1 && r.id <= 6) {
      lineRange = findLineRange('十二宫', reportLines);
    } else if (r.id >= 7 && r.id <= 8) {
      lineRange = findLineRange('格局', reportLines);
    } else if (r.id === 9 || r.id === 22) {
      lineRange = { start: 1, end: reportLines.length };
    } else if (r.id === 10 || r.id === 17) {
      lineRange = findLineRange('十二宫分论', reportLines);
    } else if (r.id === 11) {
      lineRange = findLineRange('五行局', reportLines);
    } else if (r.id === 12) {
      lineRange = findLineRange('命宫总论', reportLines);
    } else if (r.id === 13) {
      lineRange = findLineRange('大限', reportLines);
    } else if (r.id === 14) {
      lineRange = findLineRange('流年', reportLines);
    } else if (r.id === 15) {
      lineRange = findLineRange('综合建议', reportLines);
    } else if (r.id >= 16 && r.id <= 24) {
      lineRange = findLineRange('附录', reportLines);
    }

    fixSuggestions.push({
      source: 'report',
      checkId: r.id,
      checkName: fixInfo.checkName || r.name,
      currentValue: extractReportCurrentValue(r.name),
      expectedValue: fixInfo.fixDirection || '',
      fixDirection: fixInfo.fixDirection || '请检查报告结构完整性',
      lineRange: lineRange,
      severity: fixInfo.severity || 'medium'
    });
  }
});

lintDetails.forEach(function(r, idx) {
  if (!r.pass) {
    var fixInfo = LINT_FIX_MAP[r.name] || {};
    var detailStr = r.details.join('; ');

    fixSuggestions.push({
      source: 'lint',
      checkId: idx + 1,
      checkName: r.name,
      currentValue: detailStr || '不通过',
      expectedValue: '通过',
      fixDirection: fixInfo.fixDirection || '请修正格式问题',
      lineRange: { start: 0, end: 0 },
      severity: fixInfo.severity || 'low'
    });
  }
});

function extractCurrentValue(name) {
  var match = name.match(/（排盘:(\S+)\s+报告:(\S+)）/);
  if (match) {
    return '报告值: ' + match[2];
  }
  return '';
}

function extractExpectedValue(name, chart) {
  var match = name.match(/（排盘:(\S+)\s+报告:(\S+)）/);
  if (match) {
    return '排盘值: ' + match[1];
  }
  return '';
}

function extractReportCurrentValue(name) {
  var match = name.match(/（找到(\d+)/);
  if (match) {
    return match[1];
  }
  var match2 = name.match(/（(\d+)行/);
  if (match2) {
    return match2[1] + '行';
  }
  return '';
}

var summary = {
  totalChecks: totalChecks,
  passCount: totalPass,
  failCount: totalFail,
  passRate: totalChecks > 0 ? Math.round(totalPass / totalChecks * 1000) / 1000 : 0
};

var results = {
  astro: {
    passCount: astroPassCount,
    failCount: astroFailCount,
    details: astroDetails
  },
  report: {
    passCount: reportPassCount,
    failCount: reportFailCount,
    details: reportDetails
  },
  lint: {
    passCount: lintPassCount,
    failCount: lintFailCount,
    details: lintDetails
  }
};

if (jsonOutput) {
  var output = {
    summary: summary,
    results: results,
    fixSuggestions: fixSuggestions
  };
  console.log(JSON.stringify(output, null, 2));
} else {
  printColorOutput(summary, results, fixSuggestions);
}

function printColorOutput(summary, results, fixSuggestions) {
  var RED = '\x1b[31m';
  var GREEN = '\x1b[32m';
  var YELLOW = '\x1b[33m';
  var CYAN = '\x1b[36m';
  var BOLD = '\x1b[1m';
  var RESET = '\x1b[0m';

  console.log('\n' + BOLD + '🔍 紫微斗数报告综合验证' + RESET);
  console.log('═'.repeat(60));

  console.log('\n' + BOLD + '📊 排盘准确性校验（verify-astro.js）' + RESET);
  console.log('─'.repeat(50));
  results.astro.details.forEach(function(r) {
    var icon = r.pass ? GREEN + '✅' : RED + '❌';
    console.log(icon + ' ' + r.id + '. ' + r.name + RESET);
  });
  console.log('─'.repeat(50));
  console.log('通过：' + results.astro.passCount + '/' + (results.astro.passCount + results.astro.failCount));

  console.log('\n' + BOLD + '📋 报告结构验证（validate-report.js）' + RESET);
  console.log('─'.repeat(50));
  results.report.details.forEach(function(r) {
    var icon = r.pass ? GREEN + '✅' : RED + '❌';
    console.log(icon + ' #' + r.id + ' ' + r.name + RESET);
  });
  console.log('─'.repeat(50));
  console.log('通过：' + results.report.passCount + '/' + (results.report.passCount + results.report.failCount));

  console.log('\n' + BOLD + '📝 Markdown格式检查（lint-md.js）' + RESET);
  console.log('─'.repeat(50));
  results.lint.details.forEach(function(r) {
    var icon = r.pass ? GREEN + '✅' : RED + '❌';
    console.log(icon + ' ' + r.name + RESET);
    if (!r.pass && r.details && r.details.length > 0) {
      r.details.forEach(function(d) {
        console.log('   ' + YELLOW + d + RESET);
      });
    }
  });
  console.log('─'.repeat(50));
  console.log('通过：' + results.lint.passCount + '/' + (results.lint.passCount + results.lint.failCount));

  console.log('\n' + '═'.repeat(60));
  var rate = summary.totalChecks > 0 ? Math.round(summary.passCount / summary.totalChecks * 100) : 0;
  var rateColor = rate >= 90 ? GREEN : rate >= 70 ? YELLOW : RED;
  console.log(BOLD + '总通过率：' + rateColor + summary.passCount + '/' + summary.totalChecks + '（' + rate + '%）' + RESET);

  if (fixSuggestions.length > 0) {
    console.log('\n' + BOLD + '🔧 修正建议' + RESET);
    console.log('═'.repeat(60));

    var highItems = fixSuggestions.filter(function(s) { return s.severity === 'high'; });
    var mediumItems = fixSuggestions.filter(function(s) { return s.severity === 'medium'; });
    var lowItems = fixSuggestions.filter(function(s) { return s.severity === 'low'; });

    if (highItems.length > 0) {
      console.log('\n' + RED + BOLD + '❗ 高优先级（' + highItems.length + '项）' + RESET);
      highItems.forEach(function(s, idx) {
        console.log(RED + (idx + 1) + '. [' + s.source + '] ' + s.checkName + RESET);
        console.log('   修正方向：' + s.fixDirection);
        if (s.lineRange && s.lineRange.start > 0) {
          console.log('   位置：第' + s.lineRange.start + '-' + s.lineRange.end + '行');
        }
      });
    }

    if (mediumItems.length > 0) {
      console.log('\n' + YELLOW + BOLD + '⚠️ 中优先级（' + mediumItems.length + '项）' + RESET);
      mediumItems.forEach(function(s, idx) {
        console.log(YELLOW + (idx + 1) + '. [' + s.source + '] ' + s.checkName + RESET);
        console.log('   修正方向：' + s.fixDirection);
        if (s.lineRange && s.lineRange.start > 0) {
          console.log('   位置：第' + s.lineRange.start + '-' + s.lineRange.end + '行');
        }
      });
    }

    if (lowItems.length > 0) {
      console.log('\n' + CYAN + BOLD + '💡 低优先级（' + lowItems.length + '项）' + RESET);
      lowItems.forEach(function(s, idx) {
        console.log(CYAN + (idx + 1) + '. [' + s.source + '] ' + s.checkName + RESET);
        console.log('   修正方向：' + s.fixDirection);
      });
    }
  }

  console.log('\n' + '═'.repeat(60));
  if (summary.failCount === 0) {
    console.log(GREEN + BOLD + '✅ 所有验证项通过！' + RESET);
  } else {
    console.log(RED + BOLD + '⚠️ 存在' + summary.failCount + '项未通过，请按优先级修正。' + RESET);
  }
}

if (totalFail > 0) {
  process.exit(1);
}
