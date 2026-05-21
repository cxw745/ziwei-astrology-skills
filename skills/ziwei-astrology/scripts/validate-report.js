#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateReport(mdFilePath) {
  const content = fs.readFileSync(mdFilePath, 'utf-8');
  const results = [];

  function check(id, name, condition) {
    results.push({ id, name, pass: condition });
  }

  const palaceSections = (content.match(/^### 6\.\d+ /gm) || []).length;
  check(1, '十二宫主星位置（找到' + palaceSections + '个宫位章节）', palaceSections >= 12);

  const sihuaRows = (content.match(/^\| 化[禄权科忌] \|/gm) || []).length;
  check(2, '生年四化（找到' + sihuaRows + '条）', sihuaRows >= 4);

  const feihuaRows = (content.match(/^\| (命宫|兄弟|夫妻|子女|财帛|疾厄|迁移|仆役|交友|官禄|田宅|福德|父母) \|/gm) || []).length;
  check(3, '宫干飞四化总表（找到' + feihuaRows + '行）', feihuaRows >= 12);

  const emptyPalaceNotes = (content.match(/借.*宫.*主星/g) || []).length;
  check(4, '空宫借对宫标注（找到' + emptyPalaceNotes + '处）', content.includes('空宫') ? emptyPalaceNotes > 0 : true);

  check(5, '身宫叠加标注', content.includes('身宫') && content.includes('★身宫'));

  check(6, '来因宫标注', content.includes('来因宫') && content.includes('★来因宫'));

  const mustConditions = (content.match(/必须条件/g) || []).length;
  const bonusConditions = (content.match(/加分条件/g) || []).length;
  const breakConditions = (content.match(/破格条件/g) || []).length;
  check(7, '格局判断三层结构（必须' + mustConditions + '/加分' + bonusConditions + '/破格' + breakConditions + '）', mustConditions > 0 && bonusConditions > 0 && breakConditions > 0);

  const sourceRefs = (content.match(/\[来源:/g) || []).length;
  check(8, '来源标注（找到' + sourceRefs + '处）', sourceRefs >= 10);

  const huajiDesc = content.includes('化忌') && !content.includes('化忌不必担心');
  check(9, '无讨好倾向（化忌如实描述）', huajiDesc);

  const majorStarSections = (content.match(/#### 主星特质与亮度/g) || []).length;
  check(10, '十二宫子节完整性（主星特质章节' + majorStarSections + '个）', majorStarSections >= 8);

  const wuxingSteps = (content.match(/^\d+\. \*\*定/gm) || []).length;
  check(11, '五行局推算步骤（找到' + wuxingSteps + '步）', wuxingSteps >= 5);

  check(12, '命宫总论独立章节', content.includes('## 五、命宫总论'));

  const dashanSections = (content.match(/^### 8\.\d+ 第/gm) || []).length;
  check(13, '大限运势（找到' + dashanSections + '个大限）', dashanSections >= 3);

  const liunianSections = (content.match(/^### 9\.\d+ \d{4}年/gm) || []).length;
  check(14, '流年要点（找到' + liunianSections + '年）', liunianSections >= 3);

  const adviceSections = (content.match(/^### 10\.\d+ /gm) || []).length;
  check(15, '综合建议子章节（找到' + adviceSections + '个）', adviceSections >= 5);

  check(16, '附录存在', content.includes('## 十一、附录'));

  console.log('\n📋 报告结构验证结果：' + path.basename(mdFilePath));
  console.log('═'.repeat(60));

  let passCount = 0;
  for (const r of results) {
    const icon = r.pass ? '✅' : '❌';
    console.log(icon + ' #' + r.id + ' ' + r.name);
    if (r.pass) passCount++;
  }

  console.log('═'.repeat(60));
  console.log('通过：' + passCount + '/' + results.length);

  if (passCount < results.length) {
    console.log('\n⚠️ 未通过项需要修正后再输出报告。');
    process.exit(1);
  } else {
    console.log('\n✅ 所有检查项通过！');
  }
}

const args = process.argv.slice(2);
if (args.length < 1) {
  console.log('用法：node validate-report.js <report.md>');
  process.exit(1);
}

const mdFile = path.resolve(args[0]);
if (!fs.existsSync(mdFile)) {
  console.log('文件不存在：' + mdFile);
  process.exit(1);
}

validateReport(mdFile);
