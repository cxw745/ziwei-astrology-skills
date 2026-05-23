#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const VALID_TYPES = [
  'basic-info', 'palace-table', 'sihua', 'palace-detail',
  'pattern', 'minggong', 'dashan', 'liunian', 'advice', 'appendix'
];

const PALACE_NAMES = ['命宫','兄弟','夫妻','子女','财帛','疾厄','迁移','仆役','官禄','田宅','福德','父母'];

var args = process.argv.slice(2);
var sectionType = args[0] || '';
var sectionInput = args[1] || '';
var palaceName = '';

for (var i = 2; i < args.length; i++) {
  if (args[i] === '--palace' && i + 1 < args.length) {
    palaceName = args[i + 1];
    i++;
  }
}

if (!sectionType || !sectionInput) {
  console.log('用法：node section-validator.js <section-type> <section-content-or-file> [--palace 宫名]');
  console.log('');
  console.log('section-type 取值：');
  VALID_TYPES.forEach(function(t) { console.log('  ' + t); });
  console.log('');
  console.log('palace-detail 类型需额外 --palace 参数指定宫名');
  process.exit(1);
}

if (VALID_TYPES.indexOf(sectionType) === -1) {
  console.log('错误：不支持的 section-type "' + sectionType + '"');
  console.log('支持：' + VALID_TYPES.join(', '));
  process.exit(1);
}

if (sectionType === 'palace-detail' && !palaceName) {
  console.log('错误：palace-detail 类型需 --palace 参数指定宫名');
  console.log('可选宫名：' + PALACE_NAMES.join('、'));
  process.exit(1);
}

var content = '';
if (sectionInput === '-') {
  content = fs.readFileSync('/dev/stdin', 'utf-8');
} else {
  var inputPath = path.resolve(sectionInput);
  if (fs.existsSync(inputPath)) {
    content = fs.readFileSync(inputPath, 'utf-8');
  } else {
    content = sectionInput;
  }
}

var checks = [];

function addCheck(id, name, pass, detail) {
  checks.push({ id: id, name: name, pass: !!pass, detail: detail || '' });
}

function validateBasicInfo(content) {
  var rows = content.split('\n').filter(function(l) {
    return l.match(/^\|.*\|/) && !l.match(/^\|[\s\-:|]+\|/);
  });

  var infoFields = ['阳历','农历','干支','性别','时辰','生肖','星座','命宫','身宫','命主星','身主星','五行局','起运年龄','来因宫','当前大限','当前流年'];
  var foundFields = [];
  infoFields.forEach(function(field) {
    if (content.indexOf(field) !== -1) {
      foundFields.push(field);
    }
  });
  addCheck('bi-1', '基本信息表格字段（' + foundFields.length + '/16）', foundFields.length >= 14,
    foundFields.length >= 14 ? '字段齐全' : '缺少：' + infoFields.filter(function(f) { return foundFields.indexOf(f) === -1; }).join('、'));

  var wuxingSteps = (content.match(/^\d+\.\s+\*\*/gm) || []).length;
  addCheck('bi-2', '五行局推算步骤（' + wuxingSteps + '步，需≥5）', wuxingSteps >= 5,
    wuxingSteps >= 5 ? '步骤完整' : '仅有' + wuxingSteps + '步，需补充至8步');

  var hasWuxingSection = /五行局推算|五行局/.test(content);
  addCheck('bi-3', '五行局推算章节', hasWuxingSection, hasWuxingSection ? '存在' : '缺少五行局推算章节');

  var hasNayin = /纳音/.test(content);
  addCheck('bi-4', '纳音五行标注', hasNayin, hasNayin ? '存在' : '缺少纳音五行标注');

  var hasDaxianDirection = /顺行|逆行/.test(content);
  addCheck('bi-5', '大限方向标注', hasDaxianDirection, hasDaxianDirection ? '存在' : '缺少大限方向（顺行/逆行）标注');
}

function validatePalaceTable(content) {
  var palaceRows = content.split('\n').filter(function(l) {
    var cols = l.split('|').map(function(c) { return c.trim(); });
    return cols.length >= 8 && PALACE_NAMES.indexOf(cols[1]) !== -1;
  });
  addCheck('pt-1', '十二宫行数（' + palaceRows.length + '行，需≥12）', palaceRows.length >= 12,
    palaceRows.length >= 12 ? '宫位齐全' : '仅有' + palaceRows.length + '个宫位');

  var hasBodyMark = /★身宫|身宫/.test(content);
  addCheck('pt-2', '身宫标注', hasBodyMark, hasBodyMark ? '存在' : '缺少★身宫标注');

  var hasOriginalMark = /★来因宫|来因宫/.test(content);
  addCheck('pt-3', '来因宫标注', hasOriginalMark, hasOriginalMark ? '存在' : '缺少★来因宫标注');

  var emptyNotes = (content.match(/借.*宫|借对宫|空宫/g) || []).length;
  var noEmpty = /无空宫|十二宫均有主星/.test(content);
  addCheck('pt-4', '空宫借对宫标注', !content.includes('空宫') || emptyNotes > 0 || noEmpty,
    emptyNotes > 0 || noEmpty ? '标注完整' : '存在空宫但未标注借对宫');

  var hasEmptySection = /空宫说明/.test(content);
  addCheck('pt-5', '空宫说明子节', hasEmptySection || noEmpty,
    hasEmptySection || noEmpty ? '存在' : '缺少空宫说明子节');

  var tableHeaders = content.match(/^\|.*宫位.*\|/m);
  addCheck('pt-6', '8列表格格式', !!tableHeaders, tableHeaders ? '格式正确' : '缺少8列表格（宫位|天干地支|主星|辅星|杂耀|长生十二神|大限|备注）');
}

function validateSihua(content) {
  var sihuaRows = (content.match(/^\| 化[禄权科忌] \|/gm) || []).length;
  addCheck('sh-1', '生年四化4条（找到' + sihuaRows + '条）', sihuaRows >= 4,
    sihuaRows >= 4 ? '四化齐全' : '仅有' + sihuaRows + '条，需4条');

  var feihuaRows = (content.match(/^\| (命宫|兄弟|夫妻|子女|财帛|疾厄|迁移|仆役|交友|官禄|田宅|福德|父母) \|/gm) || []).length;
  addCheck('sh-2', '宫干飞四化行数（' + feihuaRows + '行，需≥12）', feihuaRows >= 12,
    feihuaRows >= 12 ? '行数齐全' : '仅有' + feihuaRows + '行，需12行');

  var feihuaComplete = true;
  var feihuaLines = content.split('\n').filter(function(line) {
    return /^\| (命宫|兄弟|夫妻|子女|财帛|疾厄|迁移|仆役|交友|官禄|田宅|福德|父母) \|/.test(line);
  });
  for (var i = 0; i < feihuaLines.length; i++) {
    var arrowCount = (feihuaLines[i].match(/→/g) || []).length;
    var huaCount = (feihuaLines[i].match(/化[禄权科忌]|飞[禄权科忌]/g) || []).length;
    if (huaCount < 4 && arrowCount < 4) {
      feihuaComplete = false;
      break;
    }
  }
  addCheck('sh-3', '飞四化48条完整性（' + feihuaRows + '行×4化）', feihuaRows >= 12 && feihuaComplete,
    feihuaComplete ? '48条完整' : '存在行不足4化');

  var hasNishiQuote = /倪师断语|倪海厦/.test(content);
  addCheck('sh-4', '倪师断语引用', hasNishiQuote, hasNishiQuote ? '存在' : '缺少倪师断语引用');

  var hasSelfNote = /自化/.test(content);
  addCheck('sh-5', '自化标注', hasSelfNote, hasSelfNote ? '存在' : '缺少自化（※）标注说明');

  var hasLaiyinNote = /来因宫.*飞化|☆/.test(content);
  addCheck('sh-6', '来因宫飞化标注', hasLaiyinNote, hasLaiyinNote ? '存在' : '缺少来因宫飞化（☆）标注');
}

function validatePalaceDetail(content, palaceName) {
  var hasMainStarSection = /#### 主星特质与亮度|### 主星特质与亮度/.test(content);
  addCheck('pd-1', '主星特质子节', hasMainStarSection,
    hasMainStarSection ? '存在' : '缺少 #### 主星特质与亮度 子节');

  var hasAuxSection = /#### 辅星影响|### 辅星影响/.test(content);
  addCheck('pd-2', '辅星分析子节', hasAuxSection,
    hasAuxSection ? '存在' : '缺少 #### 辅星影响 子节');

  var hasMiscSection = /#### 杂耀影响|### 杂耀影响/.test(content);
  addCheck('pd-3', '杂耀影响子节', hasMiscSection,
    hasMiscSection ? '存在' : '缺少 #### 杂耀影响 子节');

  var hasSihuaSection = /#### 四化影响|### 四化影响/.test(content);
  addCheck('pd-4', '四化影响子节', hasSihuaSection,
    hasSihuaSection ? '存在' : '缺少 #### 四化影响 子节');

  var hasSanfangSection = /#### 三方四正综合|### 三方四正综合/.test(content);
  addCheck('pd-5', '三方四正综合子节', hasSanfangSection,
    hasSanfangSection ? '存在' : '缺少 #### 三方四正综合 子节');

  var hasChangshengSection = /#### 长生十二神暗示|### 长生十二神/.test(content);
  addCheck('pd-6', '长生十二神子节', hasChangshengSection,
    hasChangshengSection ? '存在' : '缺少 #### 长生十二神暗示 子节');

  var hasZongping = /总评|专业解读|通俗解析/.test(content);
  addCheck('pd-7', '总评子节', hasZongping,
    hasZongping ? '存在' : '缺少总评（专业解读+通俗解析）子节');

  var hasNishiQuote = /倪师断语|倪师/.test(content);
  addCheck('pd-8', '倪师断语引用', hasNishiQuote,
    hasNishiQuote ? '存在' : '缺少倪师断语引用');

  var hasSourceRef = /\[来源:/.test(content);
  addCheck('pd-9', '来源标注', hasSourceRef,
    hasSourceRef ? '存在' : '缺少 [来源: xxx] 标注');

  var hasSihuaTable = /飞化.*星曜.*落入|飞禄.*飞权.*飞科.*飞忌/.test(content);
  addCheck('pd-10', '四化飞化表格', hasSihuaTable,
    hasSihuaTable ? '存在' : '缺少四化飞化表格');
}

function validatePattern(content) {
  var mustConditions = (content.match(/必须条件/g) || []).length;
  var bonusConditions = (content.match(/加分条件/g) || []).length;
  var breakConditions = (content.match(/破格条件/g) || []).length;
  addCheck('pa-1', '格局判断三层结构（必须' + mustConditions + '/加分' + bonusConditions + '/破格' + breakConditions + '）',
    mustConditions > 0 && bonusConditions > 0 && breakConditions > 0,
    mustConditions > 0 && bonusConditions > 0 && breakConditions > 0 ? '三层结构完整' : '缺少必须/加分/破格条件');

  var sourceRefs = (content.match(/\[来源:/g) || []).length;
  addCheck('pa-2', '来源标注（' + sourceRefs + '处，需≥3）', sourceRefs >= 3,
    sourceRefs >= 3 ? '标注充足' : '仅有' + sourceRefs + '处，需≥3处');

  var hasProInterp = /专业解读/.test(content);
  addCheck('pa-3', '专业解读', hasProInterp, hasProInterp ? '存在' : '缺少专业解读');

  var hasLayInterp = /通俗解析/.test(content);
  addCheck('pa-4', '通俗解析', hasLayInterp, hasLayInterp ? '存在' : '缺少通俗解析');

  var hasClassics = /古籍|出处|紫微斗数全书|三命通会/.test(content);
  addCheck('pa-5', '古籍出处引用', hasClassics, hasClassics ? '存在' : '缺少古籍出处引用');

  var hasGradeLevel = /格局等级|成立|不成立/.test(content);
  addCheck('pa-6', '格局等级判定', hasGradeLevel, hasGradeLevel ? '存在' : '缺少格局等级判定');
}

function validateMinggong(content) {
  var subSections = ['主星特质与亮度', '辅星影响', '杂耀影响', '命宫三方四正综合', '长生十二神暗示', '命宫总评'];
  var found = [];
  var missing = [];
  subSections.forEach(function(sub) {
    if (content.indexOf(sub) !== -1) {
      found.push(sub);
    } else {
      missing.push(sub);
    }
  });
  addCheck('mg-1', '命宫总论6个子节（' + found.length + '/6）', found.length >= 6,
    found.length >= 6 ? '子节完整' : '缺少：' + missing.join('、'));

  var hasNishiQuote = /倪师断语|倪师/.test(content);
  addCheck('mg-2', '倪师断语引用', hasNishiQuote, hasNishiQuote ? '存在' : '缺少倪师断语');

  var hasSourceRef = (content.match(/\[来源:/g) || []).length;
  addCheck('mg-3', '来源标注（' + hasSourceRef + '处，需≥5）', hasSourceRef >= 5,
    hasSourceRef >= 5 ? '标注充足' : '仅有' + hasSourceRef + '处');

  var hasProLay = /专业解读/.test(content) && /通俗解析/.test(content);
  addCheck('mg-4', '专业解读+通俗解析', hasProLay, hasProLay ? '双层输出完整' : '缺少专业解读或通俗解析');
}

function validateDashan(content) {
  var dashanSections = (content.match(/^###.*大限|^### 8\.\d+ 第/gm) || []).length;
  addCheck('da-1', '大限章节数（' + dashanSections + '个，需≥3）', dashanSections >= 3,
    dashanSections >= 3 ? '大限数量充足' : '仅有' + dashanSections + '个大限');

  var hasNishiRule = /倪师体系规则|大限四化不使用/.test(content);
  addCheck('da-2', '倪师大限规则声明', hasNishiRule, hasNishiRule ? '存在' : '缺少倪师大限规则声明');

  var hasTable = content.indexOf('| 大限命宫') !== -1 || content.indexOf('| 项目') !== -1;
  addCheck('da-3', '大限表格', hasTable, hasTable ? '存在' : '缺少大限信息表格');

  var hasAnalysis = /运势分析/.test(content);
  addCheck('da-4', '运势分析段落', hasAnalysis, hasAnalysis ? '存在' : '缺少运势分析段落');

  var hasCurrentMark = /★当前大限|当前大限/.test(content);
  addCheck('da-5', '当前大限标注', hasCurrentMark, hasCurrentMark ? '存在' : '缺少★当前大限标注');
}

function validateLiunian(content) {
  var liunianSections = (content.match(/^###.*\d{4}|^### 9\.\d+ \d{4}年/gm) || []).length;
  addCheck('ln-1', '流年章节数（' + liunianSections + '年，需≥3）', liunianSections >= 3,
    liunianSections >= 3 ? '流年数量充足' : '仅有' + liunianSections + '年');

  var hasSihua = /化禄.*化权.*化科.*化忌|流年四化/.test(content);
  addCheck('ln-2', '流年四化分析', hasSihua, hasSihua ? '存在' : '缺少流年四化分析');

  var hasCurrentMark = /★当前流年|当前流年/.test(content);
  addCheck('ln-3', '当前流年标注', hasCurrentMark, hasCurrentMark ? '存在' : '缺少★当前流年标注');

  var hasTable = content.indexOf('| 流年命宫') !== -1 || content.indexOf('| 项目') !== -1;
  addCheck('ln-4', '流年信息表格', hasTable, hasTable ? '存在' : '缺少流年信息表格');

  var hasDashanRef = /大限/.test(content);
  addCheck('ln-5', '大限背景关联', hasDashanRef, hasDashanRef ? '存在' : '缺少大限背景关联分析');
}

function validateAdvice(content) {
  var adviceSections = (content.match(/^### 10\.\d+ /gm) || []).length;
  addCheck('ad-1', '综合建议子章节数（' + adviceSections + '个，需≥5）', adviceSections >= 5,
    adviceSections >= 5 ? '子章节充足' : '仅有' + adviceSections + '个');

  var requiredAdvice = ['事业', '财运', '感情', '健康'];
  var foundAdvice = [];
  requiredAdvice.forEach(function(keyword) {
    if (content.indexOf(keyword) !== -1) {
      foundAdvice.push(keyword);
    }
  });
  addCheck('ad-2', '核心建议覆盖（' + foundAdvice.length + '/' + requiredAdvice.length + '）',
    foundAdvice.length >= requiredAdvice.length,
    foundAdvice.length >= requiredAdvice.length ? '覆盖完整' : '缺少：' + requiredAdvice.filter(function(k) { return foundAdvice.indexOf(k) === -1; }).join('、'));

  var hasProLay = /专业解读/.test(content) && /通俗解析/.test(content);
  addCheck('ad-3', '专业解读+通俗解析', hasProLay, hasProLay ? '双层输出完整' : '缺少专业解读或通俗解析');

  var hasSourceRef = (content.match(/\[来源:/g) || []).length;
  addCheck('ad-4', '来源标注（' + hasSourceRef + '处）', hasSourceRef >= 3,
    hasSourceRef >= 3 ? '标注充足' : '仅有' + hasSourceRef + '处');

  var hasNishiQuote = /倪师|倪海厦/.test(content);
  addCheck('ad-5', '倪师断语引用', hasNishiQuote, hasNishiQuote ? '存在' : '缺少倪师断语引用');
}

function validateAppendix(content) {
  addCheck('ap-1', '附录章节存在', content.indexOf('附录') !== -1,
    content.indexOf('附录') !== -1 ? '存在' : '缺少附录章节');

  var hasTermGlossary = /术语|名词|解释|释义|词汇/.test(content);
  addCheck('ap-2', '术语解释', hasTermGlossary, hasTermGlossary ? '存在' : '缺少术语解释子节');

  var hasBrightnessTable = /亮度|庙旺|得地|利|平|不|陷/.test(content) && content.indexOf('|') !== -1;
  addCheck('ap-3', '亮度对照表', hasBrightnessTable, hasBrightnessTable ? '存在' : '缺少亮度对照表');

  var hasReferences = /参考文献|参考书目/.test(content);
  addCheck('ap-4', '参考文献', hasReferences, hasReferences ? '存在' : '缺少参考文献');

  var hasDeclTable = content.indexOf('| iztro') !== -1 || /iztro七级/.test(content);
  addCheck('ap-5', 'iztro/倪师亮度对照', hasDeclTable, hasDeclTable ? '存在' : '缺少iztro七级与倪师三级对照表');
}

var validators = {
  'basic-info': validateBasicInfo,
  'palace-table': validatePalaceTable,
  'sihua': validateSihua,
  'palace-detail': function(c) { validatePalaceDetail(c, palaceName); },
  'pattern': validatePattern,
  'minggong': validateMinggong,
  'dashan': validateDashan,
  'liunian': validateLiunian,
  'advice': validateAdvice,
  'appendix': validateAppendix
};

validators[sectionType](content);

var passCount = 0;
var failCount = 0;
var fixSuggestions = [];

checks.forEach(function(c) {
  if (c.pass) {
    passCount++;
  } else {
    failCount++;
    fixSuggestions.push({
      checkId: c.id,
      suggestion: generateFixSuggestion(sectionType, c)
    });
  }
});

function generateFixSuggestion(type, check) {
  var suggestions = {
    'bi-1': '补全基本信息表格，确保16个字段齐全（阳历、农历、干支、性别、时辰、生肖、星座、命宫、身宫、命主星、身主星、五行局、起运年龄、来因宫、当前大限、当前流年）',
    'bi-2': '补充五行局推算步骤至8步：定命宫地支→定命宫天干→命宫干支→查纳音五行→定五行局→定局数→起运年龄→大限方向',
    'bi-3': '添加 ### 五行局推算过程 子节',
    'bi-4': '在五行局推算中添加纳音五行标注，如"纳音属水"',
    'bi-5': '添加大限方向标注（阳男阴女顺行/阴男阳女逆行）',
    'pt-1': '补全十二宫排盘总表，确保12个宫位均有对应行',
    'pt-2': '在身宫所在宫位的备注列添加 ★身宫 标注',
    'pt-3': '在来因宫所在宫位的备注列添加 ★来因宫 标注',
    'pt-4': '对空宫添加借对宫说明，如"借{对宫地支}宫{主星}"',
    'pt-5': '添加 ### 空宫说明 子节，对每个空宫单独说明',
    'pt-6': '使用8列表格格式：宫位|天干地支|主星（iztro亮度·四化）|辅星|杂耀|长生十二神|大限|备注',
    'sh-1': '补全生年四化4条（化禄、化权、化科、化忌）',
    'sh-2': '补全宫干飞四化总表至12行（12宫各一行）',
    'sh-3': '确保每行飞四化包含4化（飞禄、飞权、飞科、飞忌），共48条',
    'sh-4': '添加倪师断语引用，尤其是化忌的警示',
    'sh-5': '添加自化（※）标注说明',
    'sh-6': '添加来因宫飞化（☆）标注说明',
    'pd-1': '添加 #### 主星特质与亮度 子节，分析该宫主星的五行属性、亮度、核心含义',
    'pd-2': '添加 #### 辅星影响 子节，分析该宫辅星的影响',
    'pd-3': '添加 #### 杂耀影响 子节，分析该宫杂耀的具体含义',
    'pd-4': '添加 #### 四化影响 子节，分析宫干飞化',
    'pd-5': '添加 #### 三方四正综合 子节，列出三方四正宫位和星曜',
    'pd-6': '添加 #### 长生十二神暗示 子节',
    'pd-7': '添加总评子节，包含专业解读和通俗解析',
    'pd-8': '添加倪师断语引用',
    'pd-9': '添加 [来源: xxx] 来源标注',
    'pd-10': '添加四化飞化表格（飞禄/飞权/飞科/飞忌）',
    'pa-1': '确保每个格局使用三层结构表格：必须条件/加分条件/破格条件',
    'pa-2': '添加来源标注 [来源: xxx]，至少3处',
    'pa-3': '添加 **专业解读** 段落',
    'pa-4': '添加 **通俗解析** 段落',
    'pa-5': '添加古籍出处引用，如 [来源: ziwei-doushu/lib/classics/gusuifu.ts]',
    'pa-6': '添加格局等级判定（成立/不成立及原因）',
    'mg-1': '补全命宫总论6个子节：主星特质与亮度、辅星影响、杂耀影响、命宫三方四正综合、长生十二神暗示、命宫总评',
    'mg-2': '添加倪师断语引用',
    'mg-3': '添加来源标注 [来源: xxx]，至少5处',
    'mg-4': '添加专业解读和通俗解析双层输出',
    'da-1': '补全大限运势章节，至少包含3个大限',
    'da-2': '在章节开头添加倪师大限规则声明：大限四化不使用，四化星永远固定不动',
    'da-3': '为每个大限添加信息表格（大限命宫、主星、大限特征）',
    'da-4': '为每个大限添加运势分析段落',
    'da-5': '在当前大限标题添加 ★当前大限 标注',
    'ln-1': '补全流年要点章节，至少包含3年',
    'ln-2': '为每个流年添加四化分析（化禄/化权/化科/化忌）',
    'ln-3': '在当前流年标题添加 ★当前流年 标注',
    'ln-4': '为每个流年添加信息表格（流年命宫、流年四化）',
    'ln-5': '添加大限背景关联分析',
    'ad-1': '补全综合建议子章节，至少5个（事业/财运/感情/健康/精神/规划/忠告）',
    'ad-2': '确保核心建议覆盖事业、财运、感情、健康',
    'ad-3': '添加专业解读和通俗解析双层输出',
    'ad-4': '添加来源标注 [来源: xxx]',
    'ad-5': '添加倪师断语引用',
    'ap-1': '添加 ## 十一、附录 章节',
    'ap-2': '添加术语解释子节，包含紫微斗数核心术语',
    'ap-3': '添加星曜亮度对照表（iztro七级 vs 倪师三级）',
    'ap-4': '添加参考文献列表',
    'ap-5': '添加iztro七级与倪师三级亮度对照表'
  };
  return suggestions[check.id] || '请检查并修正：' + check.name;
}

var sectionLabel = sectionType;
if (sectionType === 'palace-detail' && palaceName) {
  sectionLabel = 'palace-detail:' + palaceName;
}

var result = {
  section: sectionLabel,
  checks: checks,
  passCount: passCount,
  failCount: failCount,
  passRate: checks.length > 0 ? Math.round(passCount / checks.length * 1000) / 1000 : 0,
  fixSuggestions: fixSuggestions
};

console.log(JSON.stringify(result, null, 2));

if (failCount > 0) {
  process.exit(1);
}
