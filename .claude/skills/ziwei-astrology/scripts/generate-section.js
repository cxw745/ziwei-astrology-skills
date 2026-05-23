#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VALID_TYPES = [
  'basic-info', 'palace-table', 'sihua', 'palace-detail',
  'pattern', 'minggong', 'dashan', 'liunian', 'advice', 'appendix'
];

const PALACE_NAMES = ['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','仆役','官禄','田宅','福德','父母'];

var args = process.argv.slice(2);
var chartDataPath = args[0] || '';
var sectionType = args[1] || '';
var sectionParam = args[2] || '';

if (!chartDataPath || !sectionType) {
  console.log('用法：node generate-section.js <chart-data.json> <section-type> [section-param]');
  console.log('');
  console.log('section-type 取值：');
  VALID_TYPES.forEach(function(t) { console.log('  ' + t); });
  console.log('');
  console.log('section-param:');
  console.log('  palace-detail 类型需指定宫名（如：命宫）');
  process.exit(1);
}

if (VALID_TYPES.indexOf(sectionType) === -1) {
  console.log('错误：不支持的 section-type "' + sectionType + '"');
  console.log('支持：' + VALID_TYPES.join(', '));
  process.exit(1);
}

var resolvedChartPath = path.resolve(chartDataPath);
if (!fs.existsSync(resolvedChartPath)) {
  console.log('错误：文件不存在 ' + resolvedChartPath);
  process.exit(1);
}

var chart = JSON.parse(fs.readFileSync(resolvedChartPath, 'utf-8'));

var templatePath = path.resolve(__dirname, '..', 'references', 'report-template.md');
var template = '';
if (fs.existsSync(templatePath)) {
  template = fs.readFileSync(templatePath, 'utf-8');
}

function extractTemplateSection(template, sectionType) {
  var sectionMarkers = {
    'basic-info': '## 一、基本信息',
    'palace-table': '## 二、十二宫排盘总表',
    'sihua': '## 三、生年四化表',
    'pattern': '## 四、格局识别',
    'minggong': '## 五、命宫总论',
    'palace-detail': '## 六、十二宫分论',
    'dashan': '## 八、大限运势',
    'liunian': '## 九、流年要点',
    'advice': '## 十、综合建议',
    'appendix': '## 十一、附录'
  };

  var marker = sectionMarkers[sectionType];
  if (!marker) return '';

  var startIdx = template.indexOf(marker);
  if (startIdx === -1) return '';

  var nextSectionIdx = template.length;
  var h2Regex = /^## /gm;
  h2Regex.lastIndex = startIdx + marker.length;
  var match = h2Regex.exec(template);
  if (match) {
    nextSectionIdx = match.index;
  }

  return template.substring(startIdx, nextSectionIdx).trim();
}

function findPalace(chart, name) {
  if (!chart.palaces) return null;
  for (var i = 0; i < chart.palaces.length; i++) {
    if (chart.palaces[i].name === name) return chart.palaces[i];
  }
  return null;
}

function getBodyPalace(chart) {
  if (!chart.palaces) return null;
  for (var i = 0; i < chart.palaces.length; i++) {
    if (chart.palaces[i].isBodyPalace) return chart.palaces[i];
  }
  return null;
}

function getOriginalPalace(chart) {
  if (!chart.palaces) return null;
  for (var i = 0; i < chart.palaces.length; i++) {
    if (chart.palaces[i].isOriginalPalace) return chart.palaces[i];
  }
  return null;
}

function getSihuaForPalace(chart, palaceName) {
  if (!chart.palaceFlyingMutagens) return [];
  return chart.palaceFlyingMutagens.filter(function(m) {
    return m.sourcePalace === palaceName;
  });
}

function getSanfangPalaces(chart, palaceName) {
  var palace = findPalace(chart, palaceName);
  if (!palace) return [];

  var idx = palace.index;
  var sanhe = [idx, (idx + 4) % 12, (idx + 8) % 12];
  var duichong = (idx + 6) % 12;

  var result = [];
  chart.palaces.forEach(function(p) {
    if (sanhe.indexOf(p.index) !== -1 || p.index === duichong) {
      result.push(p);
    }
  });
  return result;
}

function getDataSlice(chart, sectionType, sectionParam) {
  var bi = chart.basicInfo || {};
  var palaces = chart.palaces || [];
  var birthMutagens = chart.birthMutagens || [];
  var flyingMutagens = chart.palaceFlyingMutagens || [];
  var decadalList = chart.decadalList || [];

  switch (sectionType) {
    case 'basic-info':
      return {
        basicInfo: bi,
        bodyPalace: getBodyPalace(chart),
        originalPalace: getOriginalPalace(chart)
      };

    case 'palace-table':
      return {
        basicInfo: bi,
        palaces: palaces.map(function(p) {
          return {
            name: p.name,
            heavenlyStem: p.heavenlyStem,
            earthlyBranch: p.earthlyBranch,
            majorStars: p.majorStars,
            minorStars: p.minorStars,
            adjectiveStars: p.adjectiveStars,
            changsheng12: p.changsheng12,
            decadal: p.decadal,
            isBodyPalace: p.isBodyPalace,
            isOriginalPalace: p.isOriginalPalace
          };
        }),
        birthMutagens: birthMutagens
      };

    case 'sihua':
      return {
        basicInfo: bi,
        birthMutagens: birthMutagens,
        palaceFlyingMutagens: flyingMutagens,
        palaces: palaces.map(function(p) {
          return {
            name: p.name,
            heavenlyStem: p.heavenlyStem,
            earthlyBranch: p.earthlyBranch,
            isOriginalPalace: p.isOriginalPalace
          };
        })
      };

    case 'palace-detail':
      var targetName = sectionParam || '命宫';
      var palace = findPalace(chart, targetName);
      var bodyP = getBodyPalace(chart);
      var originalP = getOriginalPalace(chart);
      var isBody = bodyP && bodyP.name === targetName;
      var isOriginal = originalP && originalP.name === targetName;
      var isSihuaTarget = birthMutagens.some(function(m) { return m.palace === targetName; });
      var palaceFlying = getSihuaForPalace(chart, targetName);

      return {
        palace: palace,
        isBodyPalace: isBody,
        isOriginalPalace: isOriginal,
        isSihuaTarget: isSihuaTarget,
        palaceFlyingMutagens: palaceFlying,
        allPalaces: palaces.map(function(p) {
          return {
            name: p.name,
            heavenlyStem: p.heavenlyStem,
            earthlyBranch: p.earthlyBranch,
            majorStars: p.majorStars,
            minorStars: p.minorStars,
            index: p.index
          };
        }),
        birthMutagens: birthMutagens
      };

    case 'pattern':
      return {
        basicInfo: bi,
        palaces: palaces,
        birthMutagens: birthMutagens,
        palaceFlyingMutagens: flyingMutagens
      };

    case 'minggong':
      var minggong = findPalace(chart, '命宫');
      var mgBodyP = getBodyPalace(chart);
      var mgOriginalP = getOriginalPalace(chart);
      var mgFlying = getSihuaForPalace(chart, '命宫');

      return {
        minggong: minggong,
        bodyPalace: mgBodyP,
        originalPalace: mgOriginalP,
        palaceFlyingMutagens: mgFlying,
        allPalaces: palaces.map(function(p) {
          return {
            name: p.name,
            heavenlyStem: p.heavenlyStem,
            earthlyBranch: p.earthlyBranch,
            majorStars: p.majorStars,
            minorStars: p.minorStars,
            index: p.index
          };
        }),
        birthMutagens: birthMutagens
      };

    case 'dashan':
      return {
        basicInfo: bi,
        decadalList: decadalList,
        palaces: palaces,
        birthMutagens: birthMutagens,
        bodyPalace: getBodyPalace(chart)
      };

    case 'liunian':
      return {
        basicInfo: bi,
        decadalList: decadalList,
        palaces: palaces,
        birthMutagens: birthMutagens
      };

    case 'advice':
      return {
        basicInfo: bi,
        palaces: palaces,
        birthMutagens: birthMutagens,
        palaceFlyingMutagens: flyingMutagens,
        decadalList: decadalList
      };

    case 'appendix':
      return {
        basicInfo: bi,
        palaces: palaces
      };

    default:
      return {};
  }
}

var dataSlice = getDataSlice(chart, sectionType, sectionParam);
var templateFragment = extractTemplateSection(template, sectionType);

var validateCommand = 'node scripts/section-validator.js ' + sectionType;
if (sectionType === 'palace-detail') {
  var pName = sectionParam || '命宫';
  validateCommand += ' - --palace ' + pName;
} else {
  validateCommand += ' -';
}

var result = {
  sectionType: sectionType,
  sectionParam: sectionParam || undefined,
  dataSlice: dataSlice,
  templateFragment: templateFragment,
  validateCommand: validateCommand
};

console.log(JSON.stringify(result, null, 2));
