const fs = require('fs');
const path = require('path');

const evalsPath = path.resolve(__dirname, '..', '..', 'evals', 'evals.json');
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

const criteria = evalsData.pass_criteria || {};
const gates = evalsData.quality_gates || {};

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
    /\[来源[：:]/g,
    /来源[：:]\s*iztro/g,
    /来源[：:]\s*ziwei-doushu/g
  ];
  let count = 0;
  for (const p of patterns) {
    const m = text.match(p);
    if (m) count += m.length;
  }
  return count;
}

function countFlyingSihua(text) {
  const flyMatches = text.match(/飞[禄权科忌]/g);
  return flyMatches ? flyMatches.length : 0;
}

function checkSelfInspection(text) {
  return text.includes('自检清单') || text.includes('检查项');
}

function checkNihaiQuotes(text) {
  return text.includes('倪师断语') || text.includes('倪海厦');
}

function checkClassicsSource(text) {
  return text.includes('骨髓赋') || text.includes('全书') || text.includes('全集');
}

function checkGepuPattern(text) {
  const hasMust = /必须条件/.test(text);
  const hasBonus = /加分条件/.test(text);
  const hasBreak = /破格条件/.test(text);
  return hasMust && hasBonus && hasBreak;
}

const chapterKeywords = [
  '基本信息', '十二宫', '生年四化', '格局', '命宫总论',
  '大限运势', '流年', '综合建议', '附录', '四化飞化'
];

const twelvePalaces = [
  '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
  '迁移宫', '仆役宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
];

function runQualityGates(text) {
  const gateResults = [];
  const minLines = criteria.report_min_lines || 800;
  const minSources = criteria.source_annotations_min || 15;

  gateResults.push({
    gate: 'gate1_structure',
    name: (gates.gate1_structure || {}).description || '报告结构完整性',
    checks: [
      { pass: reportLines.length >= minLines, detail: '行数≥' + minLines + '（当前' + reportLines.length + '行）' },
      { pass: chapterKeywords.filter(k => text.includes(k)).length >= 8, detail: '章节关键词≥8（当前' + chapterKeywords.filter(k => text.includes(k)).length + '/10）' },
      { pass: twelvePalaces.filter(p => text.includes(p)).length >= (criteria.twelve_palaces_required || 12), detail: '十二宫≥12（当前' + twelvePalaces.filter(p => text.includes(p)).length + '/12）' },
      { pass: checkSelfInspection(text), detail: '自检清单' + (checkSelfInspection(text) ? '已填写' : '缺失') }
    ]
  });

  gateResults.push({
    gate: 'gate2_accuracy',
    name: (gates.gate2_accuracy || {}).description || '排盘数据准确性',
    checks: [
      { pass: ['化禄', '化权', '化科', '化忌'].every(s => text.includes(s)), detail: '生年四化4条' + (['化禄', '化权', '化科', '化忌'].every(s => text.includes(s)) ? '完整' : '不完整') },
      { pass: countFlyingSihua(text) >= 30, detail: '宫干飞四化条目≥30（当前' + countFlyingSihua(text) + '条）' },
      { pass: !text.includes('空宫') || text.includes('借对宫'), detail: '空宫借对宫' + (!text.includes('空宫') || text.includes('借对宫') ? '正确' : '缺失') },
      { pass: text.includes('身宫') && text.includes('来因宫'), detail: '身宫来因宫' + (text.includes('身宫') && text.includes('来因宫') ? '已标注' : '缺失') }
    ]
  });

  gateResults.push({
    gate: 'gate3_sourcing',
    name: (gates.gate3_sourcing || {}).description || '来源标注完整性',
    checks: [
      { pass: countSourceAnnotations(text) >= minSources, detail: '来源标注≥' + minSources + '（当前' + countSourceAnnotations(text) + '处）' },
      { pass: checkNihaiQuotes(text), detail: '倪师断语' + (checkNihaiQuotes(text) ? '有引用' : '缺失') },
      { pass: checkClassicsSource(text), detail: '古籍出处' + (checkClassicsSource(text) ? '有标注' : '缺失') }
    ]
  });

  gateResults.push({
    gate: 'gate4_objectivity',
    name: (gates.gate4_objectivity || {}).description || '客观性检查',
    checks: [
      { pass: checkFlattering(text).length === 0, detail: '讨好倾向词汇' + (checkFlattering(text).length === 0 ? '无' : ': ' + checkFlattering(text).join(', ')) },
      { pass: text.includes('化忌'), detail: '化忌' + (text.includes('化忌') ? '有描述' : '缺失') },
      { pass: checkGepuPattern(text), detail: '格局三层结构' + (checkGepuPattern(text) ? '完整' : '缺失') }
    ]
  });

  return gateResults;
}

function runEval(evalCase, text) {
  const results = [];
  const id = evalCase.id;
  const minLines = criteria.report_min_lines || 800;
  const minSources = criteria.source_annotations_min || 15;

  if (reportLines.length < minLines) {
    results.push({ pass: false, detail: '报告行数不足' + minLines + '行（当前' + reportLines.length + '行）' });
  } else {
    results.push({ pass: true, detail: '报告行数≥' + minLines });
  }

  const sourceCount = countSourceAnnotations(text);
  if (sourceCount < minSources) {
    results.push({ pass: false, detail: '来源标注不足' + minSources + '处（当前' + sourceCount + '处）' });
  } else {
    results.push({ pass: true, detail: '来源标注≥' + minSources + '处' });
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

console.log('========================================');
console.log('质量门禁检查');
console.log('========================================\n');

const gateResults = runQualityGates(reportContent);
let allGatesPass = true;

for (const gate of gateResults) {
  let gatePass = 0;
  let gateFail = 0;
  console.log('【' + gate.name + '】');
  for (const c of gate.checks) {
    if (c.pass) {
      gatePass++;
      console.log('  ✅ ' + c.detail);
    } else {
      gateFail++;
      allGatesPass = false;
      console.log('  ❌ ' + c.detail);
    }
  }
  console.log('  → ' + (gateFail === 0 ? '✅ 通过' : '❌ 未通过') + ' (' + gatePass + '/' + (gatePass + gateFail) + ')');
  console.log();
}

console.log('质量门禁总结果: ' + (allGatesPass ? '✅ 全部通过' : '❌ 存在未通过项'));
console.log();

console.log('========================================');
console.log('评测用例检查');
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

  const evalScore = evalPass / (evalPass + evalFail);
  const minScore = evalCase.min_pass_score || 0.8;
  const evalStatus = evalFail === 0 ? '✅ PASS' : (evalScore >= minScore ? '⚠️ PARTIAL' : '❌ FAIL');
  console.log();
  console.log('  结果: ' + evalStatus + ' (' + evalPass + '/' + (evalPass + evalFail) + ', 得分' + (evalScore * 100).toFixed(0) + '%, 门槛' + (minScore * 100).toFixed(0) + '%)');
  console.log();
}

console.log('========================================');
console.log('汇总');
console.log('========================================');
console.log('质量门禁: ' + (allGatesPass ? '✅ 通过' : '❌ 未通过'));
console.log('评测用例总检查项: ' + totalChecks);
console.log('通过: ' + totalPass);
console.log('失败: ' + totalFail);
console.log('通过率: ' + (totalChecks > 0 ? ((totalPass / totalChecks) * 100).toFixed(1) : 0) + '%');
console.log();

if (!allGatesPass || totalFail > 0) {
  console.log('⚠️ 评测未全部通过，请修正后重新运行。');
  process.exit(1);
} else {
  console.log('✅ 全部评测通过！');
  process.exit(0);
}
