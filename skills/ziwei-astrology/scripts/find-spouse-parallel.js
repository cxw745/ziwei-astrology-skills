/**
 * 配偶生辰筛选 - 并行版
 * 用法: node find-spouse-dates-parallel.js <startYear> <endYear> <outputFile>
 */
const { astro } = require('iztro');
const fs = require('fs');

const TARGET_SOUL = ['七杀', '紫微', '廉贞', '武曲', '破军', '贪狼'];
const TARGET_FUDE = ['天梁', '天同', '太阴', '太阳'];
const TARGET_COUPLE = ['天府', '天相', '天同'];
const timeNames = ['早子时','丑时','寅时','卯时','辰时','巳时','午时','未时','申时','酉时','戌时','亥时','晚子时'];

const YEAR_START = parseInt(process.argv[2]);
const YEAR_END = parseInt(process.argv[3]);
const OUT_FILE = process.argv[4];

function getMajorStarNames(palace) {
  if (!palace || !palace.majorStars) return [];
  return palace.majorStars.map(s => s.name);
}
function findPalace(result, name) {
  return result.palaces.find(p => p.name === name);
}

const results = [];
const t0 = Date.now();
let totalCalcs = 0;

for (let year = YEAR_START; year <= YEAR_END; year++) {
  for (let month = 1; month <= 12; month++) {
    const maxDay = [31,28,31,30,31,30,31,31,30,31,30,31][month-1];
    const isLeap = (year%4===0 && year%100!==0) || (year%400===0);
    const actualMax = month===2 && isLeap ? 29 : maxDay;

    for (let day = 1; day <= actualMax; day++) {
      for (let ti = 0; ti <= 12; ti++) {
        try {
          const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
          const r = astro.bySolar(dateStr, ti, '女', true, 'zh-CN');
          const soul = findPalace(r, '命宫');
          const fude = findPalace(r, '福德');
          const couple = findPalace(r, '夫妻');
          const soulStars = getMajorStarNames(soul);
          const fudeStars = getMajorStarNames(fude);
          const coupleStars = getMajorStarNames(couple);

          if (!soulStars.some(s => TARGET_SOUL.includes(s))) { totalCalcs++; continue; }

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
            date: dateStr, time: timeNames[ti], score,
            reasons: reasons.join(','),
            soul: soulStars.join('+') || '空宫',
            fude: fudeStars.join('+') || '空宫',
            couple: coupleStars.join('+') || '空宫',
          });
        } catch(e) {}
        totalCalcs++;
      }
    }
  }
  process.stderr.write(`[${YEAR_START}-${YEAR_END}] ${year}年完成: 匹配${results.length}, 计算${totalCalcs}, 耗时${((Date.now()-t0)/1000).toFixed(1)}s\n`);
}

fs.writeFileSync(OUT_FILE, JSON.stringify(results));
process.stderr.write(`\nDone! ${YEAR_START}-${YEAR_END}: 匹配${results.length}, 总耗时${((Date.now()-t0)/1000).toFixed(1)}s\n`);
console.log(`Done. ${YEAR_START}-${YEAR_END}: ${results.length} matches`);
