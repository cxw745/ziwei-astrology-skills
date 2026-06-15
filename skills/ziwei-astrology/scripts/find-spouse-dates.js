/**
 * 配偶生辰筛选 - 预筛选优化版
 * 策略: 先用少量计算找出命宫主星可能匹配的(月,时)组合
 *       再对这些组合遍历所有(年,日)精确评分
 * 预筛选: 对每个(月,时)检查10个年干×3个日=30种组合，任一匹配即纳入
 */
const { astro } = require('iztro');
const fs = require('fs');

const TARGET_SOUL = ['七杀', '紫微', '廉贞', '武曲', '破军', '贪狼'];
const TARGET_FUDE = ['天梁', '天同', '太阴', '太阳'];
const TARGET_COUPLE = ['天府', '天相', '天同'];

const timeNames = ['早子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时','晚子时'];

function getMajorStarNames(palace) {
  if (!palace || !palace.majorStars) return [];
  return palace.majorStars.map(s => s.name);
}

function findPalace(result, name) {
  return result.palaces.find(p => p.name === name);
}

const results = [];
const YEAR_START = 1987;
const YEAR_END = 2022;
const t0 = Date.now();

// === Phase 1: 预筛选(月,时)组合 ===
process.stderr.write('Phase 1: 预筛选(月,时)组合...\n');
const validMT = [];
const sampleYears = [1987,1990,1993,1996,1999,2002,2005,2008,2011,2014]; // 覆盖10个年干
const sampleDays = [1, 10, 20]; // 3个采样日

for (let month = 1; month <= 12; month++) {
  for (let ti = 0; ti <= 12; ti++) {
    let found = false;
    for (const sy of sampleYears) {
      for (const sd of sampleDays) {
        try {
          const r = astro.bySolar(`${sy}-${String(month).padStart(2,'0')}-${String(sd).padStart(2,'0')}`, ti, '女', true, 'zh-CN');
          const soul = findPalace(r, '命宫');
          const stars = getMajorStarNames(soul);
          if (stars.some(s => TARGET_SOUL.includes(s))) {
            found = true;
            break;
          }
        } catch(e) {}
      }
      if (found) break;
    }
    if (found) validMT.push({ month, ti, tname: timeNames[ti] });
  }
}
process.stderr.write(`Phase 1 完成: ${validMT.length}个有效(月,时)组合, 耗时${((Date.now()-t0)/1000).toFixed(1)}s\n`);

// === Phase 2: 对有效(月,时)遍历所有(年,日) ===
process.stderr.write('Phase 2: 遍历所有(年,日)...\n');
let totalCalcs = 0;

let mtIdx = 0;
for (const { month, ti, tname } of validMT) {
  mtIdx++;
  for (let year = YEAR_START; year <= YEAR_END; year++) {
    const maxDay = [31,28,31,30,31,30,31,31,30,31,30,31][month-1];
    const isLeap = (year%4===0 && year%100!==0) || (year%400===0);
    const actualMax = month===2 && isLeap ? 29 : maxDay;

    for (let day = 1; day <= actualMax; day++) {
      try {
        const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        const r = astro.bySolar(dateStr, ti, '女', true, 'zh-CN');
        const soul = findPalace(r, '命宫');
        const fude = findPalace(r, '福德');
        const couple = findPalace(r, '夫妻');
        const soulStars = getMajorStarNames(soul);
        const fudeStars = getMajorStarNames(fude);
        const coupleStars = getMajorStarNames(couple);

        const soulMatch = soulStars.some(s => TARGET_SOUL.includes(s));
        if (!soulMatch) continue;

        let score = 40;
        let reasons = [`命宫${soulStars.join('+')}`];

        for (const s of fudeStars) {
          if (TARGET_FUDE.includes(s)) { score += 25; reasons.push(`福德${s}`); }
        }
        for (const s of coupleStars) {
          if (TARGET_COUPLE.includes(s)) { score += 25; reasons.push(`夫妻${s}`); }
        }
        if (coupleStars.includes('天府')) { score += 10; reasons.push('夫妻天府呼应'); }

        const huas = soul?.majorStars?.filter(s => s.mutagen) || [];
        if (huas.some(h => h.mutagen === '化权')) { score += 5; reasons.push('命宫化权'); }

        results.push({
          date: dateStr,
          time: tname, score, reasons: reasons.join(','),
          soul: soulStars.join('+') || '空宫',
          fude: fudeStars.join('+') || '空宫',
          couple: coupleStars.join('+') || '空宫',
        });
      } catch(e) {}
      totalCalcs++;
    }
  }
  // 每处理完一个(月,时)输出进度
  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  process.stderr.write(`  [${mtIdx}/${validMT.length}] 月${month}${tname}, 总计算${totalCalcs}, 匹配${results.length}个, 耗时${elapsed}s\n`);
}

// 更准确的进度输出
process.stderr.write(`Phase 2 完成: 总计算${totalCalcs}次, 匹配${results.length}个, 耗时${((Date.now()-t0)/1000).toFixed(1)}s\n`);

results.sort((a, b) => b.score - a.score);
const top = results.slice(0, 500);

let output = '';
output += `# 配偶生辰筛选结果\n`;
output += `筛选范围: ${YEAR_START}-${YEAR_END}年 | 性别: 女\n`;
output += `匹配条件: 命宫${TARGET_SOUL.join('/')} + 福德${TARGET_FUDE.join('/')} + 夫妻${TARGET_COUPLE.join('/')}\n`;
output += `总匹配生辰: ${results.length}个 | 展示前500个(按得分降序)\n`;
output += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
output += `## 评分规则\n`;
output += `- 命宫主星匹配(七杀/紫微/廉贞/武曲/破军/贪狼): 40分（必须）\n`;
output += `- 福德宫主星匹配(天梁/天同/太阴/太阳): 每个+25分\n`;
output += `- 夫妻宫主星匹配(天府/天相/天同): 每个+25分\n`;
output += `- 夫妻宫天府呼应: +10分\n`;
output += `- 命宫化权: +5分\n`;
output += `- 满分: 105分\n\n`;
output += `| 排名 | 得分 | 出生日期 | 时辰 | 命宫 | 福德宫 | 夫妻宫 | 匹配原因 |\n`;
output += `|------|------|---------|------|------|--------|--------|---------|\n`;
top.forEach((r, i) => {
  output += `| ${i+1} | ${r.score} | ${r.date} | ${r.time} | ${r.soul} | ${r.fude} | ${r.couple} | ${r.reasons} |\n`;
});

const outPath = '/Users/cxw745/Desktop/紫微斗数/ziwei-astrology-skills/ziwei-output/2026-05-22_2002年08月25日丑时男/配偶生辰筛选.md';
fs.writeFileSync(outPath, output);
const totalTime = ((Date.now() - t0) / 1000).toFixed(1);
process.stderr.write(`\nDone! 总匹配: ${results.length}, 展示前${top.length}, 总耗时${totalTime}s\n`);
console.log(`Done. Matched: ${results.length}, Saved top ${top.length}`);
