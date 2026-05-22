const fs = require('fs');
const path = require('path');

const evalsPath = path.resolve(__dirname, '..', 'evals', 'evals.json');
const reportPath = process.argv[2];
const targetEvalId = process.argv[3] ? parseInt(process.argv[3], 10) : null;

if (!reportPath) {
  console.error('用法: node run-evals.js <report.md> [eval-id]');
  process.exit(1);
}

const resolvedReportPath = path.resolve(reportPath);
if (!fs.existsSync(resolvedReportPath)) {
  console.error('报告文件不存在: ' + resolvedReportPath);
  process.exit(1);
}

const evalsData = JSON.parse(fs.readFileSync(evalsPath, 'utf-8'));
const reportContent = fs.readFileSync(resolvedReportPath, 'utf-8');
const reportLines = reportContent.split('\n');

const flatteringPatterns = [
  /非常棒/g, /太厉害了/g, /令人惊叹/g, /非常优秀/g, /恭喜您/g,
  /您真[是的有]/g, /令人羡慕/g, /太好了/g, /非常幸运/g, /绝佳/g
];

function checkFlattering(text) {
  const matches = [];
  for (const p of flatteringPatterns) {
    const m = text.match(p);
    if (m) matches.push(m[0]);
  }
  return matches;
}

function countSourceAnnotations(text) {
  const patterns = [
    /来源[：:]/g,
    /出处[：:]/g,
    /引用/g,
    /《[^》]+》/g,
    /断语[：:]/g,
    /典籍/g,
    /参考/g
  ];
  let count = 0;
  for (const p of patterns) {
    const m = text.match(p);
    if (m) count += m.length;
  }
  return count;
}

const chapterKeywords = [
  '基本信息', '十二宫', '生年四化', '宫位详析', '格局分析',
  '大限运势', '流年运势', '健康总览', '综合人生建议', '命盘总表'
];

const twelvePalaces = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
];

function runEval(evalCase, text) {
  const results = [];
  const id = evalCase.id;

  if (reportLines.length < 300) {
    results.push({ pass: false, detail: '报告行数不足300行（当前' + reportLines.length + '行）' });
  } else {
    results.push({ pass: true, detail: '报告行数≥300' });
  }

  const sourceCount = countSourceAnnotations(text);
  if (sourceCount < 10) {
    results.push({ pass: false, detail: '来源标注不足10处（当前' + sourceCount + '处）' });
  } else {
    results.push({ pass: true, detail: '来源标注≥10处' });
  }

  const flattering = checkFlattering(text);
  if (flattering.length > 0) {
    results.push({ pass: false, detail: '存在讨好倾向词汇: ' + flattering.join(', ') });
  } else {
    results.push({ pass: true, detail: '无讨好倾向' });
  }

  if (id === 1 || id === 6) {
    const foundChapters = chapterKeywords.filter(k => text.includes(k));
    if (foundChapters.length < 8) {
      results.push({ pass: false, detail: '章节不完整，缺少: ' + chapterKeywords.filter(k => !text.includes(k)).join('、') });
    } else {
      results.push({ pass: true, detail: '章节完整（' + foundChapters.length + '/10）' });
    }

    const foundPalaces = twelvePalaces.filter(p => text.includes(p));
    if (foundPalaces.length < 10) {
      results.push({ pass: false, detail: '十二宫不完整，缺少: ' + twelvePalaces.filter(p => !text.includes(p)).join('、') });
    } else {
      results.push({ pass: true, detail: '十二宫完整（' + foundPalaces.length + '/12）' });
    }

    const sihua = ['化禄', '化权', '化科', '化忌'];
    const foundSihua = sihua.filter(s => text.includes(s));
    if (foundSihua.length < 4) {
      results.push({ pass: false, detail: '生年四化不完整，缺少: ' + sihua.filter(s => !text.includes(s)).join('、') });
    } else {
      results.push({ pass: true, detail: '生年四化完整' });
    }

    if (!text.includes('格局')) {
      results.push({ pass: false, detail: '缺少格局分析' });
    } else {
      results.push({ pass: true, detail: '包含格局分析' });
    }

    if (!text.includes('天机化忌')) {
      results.push({ pass: false, detail: '缺少天机化忌重点提示' });
    } else {
      results.push({ pass: true, detail: '包含天机化忌重点提示' });
    }
  }

  if (id === 2) {
    const bothInfo = text.includes('1998') && text.includes('2000');
    if (!bothInfo) {
      results.push({ pass: false, detail: '缺少双方基本信息' });
    } else {
      results.push({ pass: true, detail: '包含双方基本信息' });
    }

    const fiveSteps = ['命宫', '夫妻宫', '福德宫', '太阳', '太阴'];
    const foundSteps = fiveSteps.filter(s => text.includes(s));
    if (foundSteps.length < 4) {
      results.push({ pass: false, detail: '合盘五步法不完整，缺少: ' + fiveSteps.filter(s => !text.includes(s)).join('、') });
    } else {
      results.push({ pass: true, detail: '合盘五步法完整' });
    }

    if (!text.includes('四化') && !text.includes('飞化')) {
      results.push({ pass: false, detail: '缺少四化飞化互参' });
    } else {
      results.push({ pass: true, detail: '包含四化飞化互参' });
    }

    const ratingPattern = /[★☆]{5}|[1-5]星|匹配度.*[1-5]/;
    if (!ratingPattern.test(text)) {
      results.push({ pass: false, detail: '缺少匹配度评级' });
    } else {
      results.push({ pass: true, detail: '包含匹配度评级' });
    }
  }

  if (id === 3) {
    const liunianSihua = ['天同化禄', '天机化权', '文昌化科', '廉贞化忌'];
    const foundLs = liunianSihua.filter(s => text.includes(s));
    if (foundLs.length < 3) {
      results.push({ pass: false, detail: '流年四化不完整，缺少: ' + liunianSihua.filter(s => !text.includes(s)).join('、') });
    } else {
      results.push({ pass: true, detail: '流年四化完整（' + foundLs.length + '/4）' });
    }

    if (!text.includes('流年') || !text.includes('交互')) {
      if (!text.includes('流年宫位') && !text.includes('宫位交互')) {
        results.push({ pass: false, detail: '缺少宫位交互分析' });
      } else {
        results.push({ pass: true, detail: '包含宫位交互分析' });
      }
    } else {
      results.push({ pass: true, detail: '包含宫位交互分析' });
    }

    if (!text.includes('事业')) {
      results.push({ pass: false, detail: '缺少事业主题解读' });
    } else {
      results.push({ pass: true, detail: '包含事业主题解读' });
    }
  }

  if (id === 4) {
    const promptHints = ['补充', '提供', '填写', '告知', '输入', '出生', '时辰', '性别'];
    const foundHints = promptHints.filter(h => text.includes(h));
    if (foundHints.length < 3) {
      results.push({ pass: false, detail: '未提示用户补充信息' });
    } else {
      results.push({ pass: true, detail: '包含提示补充信息的文字' });
    }
  }

  if (id === 5) {
    const hasMonth = /[1-9]月|十[0-2]?月|1[0-2]月/.test(text);
    if (!hasMonth) {
      results.push({ pass: false, detail: '缺少推荐月份' });
    } else {
      results.push({ pass: true, detail: '包含推荐月份' });
    }

    if (!text.includes('理由') && !text.includes('因为') && !text.includes('原因')) {
      results.push({ pass: false, detail: '缺少选择理由' });
    } else {
      results.push({ pass: true, detail: '包含选择理由' });
    }

    if (!text.includes('化忌')) {
      results.push({ pass: false, detail: '缺少化忌避让分析' });
    } else {
      results.push({ pass: true, detail: '包含化忌避让分析' });
    }
  }

  if (id === 6) {
    const reuseKeywords = ['已排', '上文', '之前', '前面', '如前述', '命盘'];
    const foundReuse = reuseKeywords.filter(k => text.includes(k));
    if (foundReuse.length < 1) {
      results.push({ pass: false, detail: '未复用命盘数据' });
    } else {
      results.push({ pass: true, detail: '复用命盘数据' });
    }

    if (!text.includes('官禄宫') && !text.includes('财帛宫')) {
      results.push({ pass: false, detail: '缺少官禄宫/财帛宫分析' });
    } else {
      results.push({ pass: true, detail: '包含官禄宫/财帛宫分析' });
    }
  }

  return results;
}

const evals = targetEvalId
  ? evalsData.evals.filter(e => e.id === targetEvalId)
  : evalsData.evals;

if (evals.length === 0) {
  console.error('未找到评测用例' + (targetEvalId ? ' (eval-id: ' + targetEvalId + ')' : ''));
  process.exit(1);
}

console.log('========================================');
console.log('紫微斗数 Skill 自动化评测');
console.log('报告: ' + resolvedReportPath);
console.log('========================================\n');

let totalChecks = 0;
let totalPass = 0;
let totalFail = 0;

for (const evalCase of evals) {
  console.log('--- Eval #' + evalCase.id + ' ---');
  console.log('Prompt: ' + evalCase.prompt);
  console.log();

  const results = runEval(evalCase, reportContent);
  let evalPass = 0;
  let evalFail = 0;

  for (const r of results) {
    totalChecks++;
    if (r.pass) {
      totalPass++;
      evalPass++;
      console.log('  ✅ ' + r.detail);
    } else {
      totalFail++;
      evalFail++;
      console.log('  ❌ ' + r.detail);
    }
  }

  const evalStatus = evalFail === 0 ? '✅ PASS' : '❌ FAIL';
  console.log();
  console.log('  结果: ' + evalStatus + ' (' + evalPass + '/' + (evalPass + evalFail) + ')');
  console.log();
}

console.log('========================================');
console.log('汇总');
console.log('========================================');
console.log('总检查项: ' + totalChecks);
console.log('通过: ' + totalPass);
console.log('失败: ' + totalFail);
console.log('通过率: ' + (totalChecks > 0 ? ((totalPass / totalChecks) * 100).toFixed(1) : 0) + '%');
console.log();
