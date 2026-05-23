#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('用法：node verify-astro.js <chart-data.json> <report.md>');
  process.exit(1);
}

const chartPath = path.resolve(args[0]);
const reportPath = path.resolve(args[1]);

if (!fs.existsSync(chartPath)) {
  console.log('文件不存在：' + chartPath);
  process.exit(1);
}
if (!fs.existsSync(reportPath)) {
  console.log('文件不存在：' + reportPath);
  process.exit(1);
}

const chart = JSON.parse(fs.readFileSync(chartPath, 'utf-8'));
const report = fs.readFileSync(reportPath, 'utf-8');
const results = [];

function check(id, name, condition) {
  results.push({ id: id, name: name, pass: condition });
}

const PALACE_NAMES = ['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','仆役','官禄','田宅','福德','父母'];
const DIZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

var reportPalaces = {};
var reportSihua = [];
var basicInfo = {};

var lines = report.split('\n');
var inBasicInfoSection = false;
var basicInfoTableDone = false;
for (var i = 0; i < lines.length; i++) {
  var line = lines[i];

  if (line.indexOf('## 一、基本信息') !== -1) {
    inBasicInfoSection = true;
    continue;
  }
  if (inBasicInfoSection && line.indexOf('## ') !== -1 && line.indexOf('## 一') === -1) {
    inBasicInfoSection = false;
  }

  var cols = line.split('|').map(function(c) { return c.trim(); });

  if (cols.length >= 10) {
    var pName = cols[1];
    if (PALACE_NAMES.indexOf(pName) !== -1 || pName === '交友') {
      if (!/^-/.test(cols[2])) {
        reportPalaces[pName] = {
          rawStarText: cols[3] || '',
          note: cols[8] || '',
          isEmpty: /空[（(]|空宫/.test(cols[3] || ''),
          hasBodyMark: /身宫/.test(cols[8] || ''),
          hasOriginalMark: /来因宫/.test(cols[8] || '')
        };
      }
    }
  }

  if (cols.length >= 6 && /^化[禄权科忌]$/.test(cols[1])) {
    reportSihua.push({
      type: cols[1],
      star: cols[2],
      branch: cols[3],
      palaceName: cols[4]
    });
  }

  if (inBasicInfoSection && !basicInfoTableDone && cols.length >= 3 && cols[1] && cols[2] && cols[1] !== '项目' && cols[1] !== '层次' && cols[1] !== '级别' && !/^-/.test(cols[1])) {
    if (!basicInfo[cols[1]]) {
      basicInfo[cols[1]] = cols[2];
    }
  }
  if (inBasicInfoSection && line.indexOf('### 五行局') !== -1) {
    basicInfoTableDone = true;
  }
}

function findReportPalace(name) {
  return reportPalaces[name] || reportPalaces[name.replace('交友', '仆役')] || null;
}

function extractDizhi(text) {
  for (var k = 0; k < DIZHI.length; k++) {
    if (text.indexOf(DIZHI[k]) !== -1) return DIZHI[k];
  }
  return '';
}

var starPass = true;
var starDetail = [];
chart.palaces.forEach(function(palace) {
  var chartStarNames = palace.majorStars.map(function(s) { return s.name; });
  var rp = findReportPalace(palace.name);
  if (!rp) {
    starPass = false;
    starDetail.push(palace.name + ': 报告总表中未找到');
    return;
  }
  chartStarNames.forEach(function(sn) {
    if (rp.rawStarText.indexOf(sn) === -1) {
      starPass = false;
      starDetail.push(palace.name + ': 缺少主星' + sn);
    }
  });
});
check('a', '星曜位置校验' + (starPass ? '' : '（' + starDetail.join('；') + '）'), starPass);

var chartSihua = [];
chart.palaces.forEach(function(palace) {
  var allStars = (palace.majorStars || []).concat(palace.minorStars || []);
  allStars.forEach(function(star) {
    if (star.mutagen) {
      chartSihua.push({
        type: '化' + star.mutagen,
        star: star.name,
        branch: palace.earthlyBranch,
        palaceName: palace.name
      });
    }
  });
});

var sihuaPass = true;
var sihuaDetail = [];
chartSihua.forEach(function(cs) {
  var found = null;
  for (var j = 0; j < reportSihua.length; j++) {
    if (reportSihua[j].type === cs.type && reportSihua[j].star === cs.star) {
      found = reportSihua[j];
      break;
    }
  }
  if (!found) {
    sihuaPass = false;
    sihuaDetail.push(cs.type + ':' + cs.star + ' 报告中未找到');
  } else if (found.branch.replace('宫', '') !== cs.branch) {
    sihuaPass = false;
    sihuaDetail.push(cs.type + ':' + cs.star + ' 宫位不符(报告:' + found.branch + ' 排盘:' + cs.branch + ')');
  }
});
if (chartSihua.length < 4) {
  sihuaPass = false;
  sihuaDetail.push('生年四化不足4条(找到' + chartSihua.length + '条)');
}
check('b', '四化校验' + (sihuaPass ? '' : '（' + sihuaDetail.join('；') + '）'), sihuaPass);

var emptyPass = true;
var emptyDetail = [];
chart.palaces.forEach(function(palace) {
  var hasNoMajor = !palace.majorStars || palace.majorStars.length === 0;
  if (hasNoMajor) {
    var rp = findReportPalace(palace.name);
    if (!rp) {
      emptyPass = false;
      emptyDetail.push(palace.name + ': 报告中未找到');
    } else if (!rp.isEmpty && rp.note.indexOf('借') === -1 && rp.rawStarText.indexOf('空宫') === -1) {
      emptyPass = false;
      emptyDetail.push(palace.name + ': 应标注空宫或借对宫');
    }
  }
});
check('c', '空宫校验' + (emptyPass ? '' : '（' + emptyDetail.join('；') + '）'), emptyPass);

var bodyPass = true;
var bodyDetail = [];
var bodyPalaces = chart.palaces.filter(function(p) { return p.isBodyPalace; });
if (bodyPalaces.length === 0) {
  bodyPass = false;
  bodyDetail.push('排盘数据中未找到身宫标记');
} else {
  bodyPalaces.forEach(function(bp) {
    var rp = findReportPalace(bp.name);
    var inTable = rp && rp.hasBodyMark;
    var inText = report.indexOf('★身宫') !== -1;
    if (!inTable && !inText) {
      bodyPass = false;
      bodyDetail.push(bp.name + ': 应标注★身宫');
    }
  });
}
check('d', '身宫校验' + (bodyPass ? '' : '（' + bodyDetail.join('；') + '）'), bodyPass);

var originalPass = true;
var originalDetail = [];
var originalPalaces = chart.palaces.filter(function(p) { return p.isOriginalPalace; });
if (originalPalaces.length === 0) {
  originalPass = false;
  originalDetail.push('排盘数据中未找到来因宫标记');
} else {
  originalPalaces.forEach(function(op) {
    var rp = findReportPalace(op.name);
    var inTable = rp && rp.hasOriginalMark;
    var inText = report.indexOf('来因宫') !== -1;
    if (!inTable && !inText) {
      originalPass = false;
      originalDetail.push(op.name + ': 应标注来因宫');
    }
  });
}
check('e', '来因宫校验' + (originalPass ? '' : '（' + originalDetail.join('；') + '）'), originalPass);

var chartWuxing = chart.basicInfo ? chart.basicInfo.fiveElementsClass : chart.fiveElementsClass;
var reportWuxing = basicInfo['五行局'] || '';
var wuxingPass = chartWuxing === reportWuxing;
check('f', '五行局校验（排盘:' + chartWuxing + ' 报告:' + (reportWuxing || '未找到') + ')', wuxingPass);

var chartSoulBranch = chart.basicInfo ? chart.basicInfo.soulPalace : chart.earthlyBranchOfSoulPalace;
var reportSoulRaw = basicInfo['命宫'] || '';
var reportSoulBranch = extractDizhi(reportSoulRaw);
var soulPass = chartSoulBranch === reportSoulBranch;
check('g', '命宫位置校验（排盘:' + chartSoulBranch + ' 报告:' + (reportSoulBranch || '未找到') + ')', soulPass);

console.log('\n🔍 排盘准确性校验结果');
console.log('═'.repeat(60));

var passCount = 0;
results.forEach(function(r) {
  var icon = r.pass ? '✅' : '❌';
  console.log(icon + ' ' + r.id + '. ' + r.name);
  if (r.pass) passCount++;
});

console.log('═'.repeat(60));
console.log('通过：' + passCount + '/' + results.length);
console.log('通过率：' + Math.round(passCount / results.length * 100) + '%');

if (passCount < results.length) {
  console.log('\n⚠️ 存在校验不通过项，请检查报告数据。');
  process.exit(1);
} else {
  console.log('\n✅ 所有校验项通过！');
}
