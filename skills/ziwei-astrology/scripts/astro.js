const { astro } = require('iztro');
const fs = require('fs');
const path = require('path');

const MUTAGEN_NAMES = ['禄', '权', '科', '忌'];

const PALACE_INDEX_NAMES = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄',
  '迁移', '仆役', '官禄', '田宅', '福德', '父母'
];

function usage() {
  console.log('用法: node scripts/astro.js "YYYY-M-D" hourIndex gender [outputDir] [--json] [--year YYYY]');
  console.log('');
  console.log('参数:');
  console.log('  YYYY-M-D   阳历日期，如 "2000-1-15"');
  console.log('  hourIndex  时辰索引: 0=早子时, 1=丑时, ..., 11=亥时, 12=晚子时');
  console.log('  gender     性别: "男" 或 "女"');
  console.log('  outputDir  可选，保存 chart-data.json 到该目录');
  console.log('  --json     直接输出完整 iztro 对象的 JSON');
  console.log('  --year YYYY 可选，输出指定年份的流年数据（用于事件验证）');
  process.exit(1);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let jsonMode = false;
  let year = null;
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') {
      jsonMode = true;
    } else if (args[i] === '--year' && i + 1 < args.length) {
      year = parseInt(args[i + 1], 10);
      i++;
    } else {
      positional.push(args[i]);
    }
  }

  if (positional.length < 3) usage();

  return {
    solarDate: positional[0],
    hourIndex: parseInt(positional[1], 10),
    gender: positional[2],
    outputDir: positional[3] || null,
    jsonMode: jsonMode,
    year: year
  };
}

function extractStarArray(stars) {
  if (!stars) return [];
  return stars.map(function(s) {
    const obj = { name: s.name, type: s.type };
    if (s.brightness) obj.brightness = s.brightness;
    if (s.mutagen) obj.mutagen = s.mutagen;
    return obj;
  });
}

function getBirthYearMutagens(palaces) {
  const result = [];
  for (let i = 0; i < palaces.length; i++) {
    const palace = palaces[i];
    const allStars = [...palace.majorStars, ...palace.minorStars];
    for (let j = 0; j < allStars.length; j++) {
      const star = allStars[j];
      if (star.mutagen) {
        result.push({
          mutagen: star.mutagen,
          star: star.name,
          palace: palace.name,
          palaceIndex: palace.index
        });
      }
    }
  }
  return result;
}

function getPalaceFlyingMutagens(astrolabe) {
  const palaces = astrolabe.palaces;
  const clones = palaces.map(p => {
    const c = Object.create(Object.getPrototypeOf(p));
    Object.assign(c, p);
    c.setAstrolabe(astrolabe);
    return c;
  });

  const result = [];
  for (let i = 0; i < clones.length; i++) {
    const palace = clones[i];
    const targets = palace.mutagedPlaces();
    for (let j = 0; j < MUTAGEN_NAMES.length; j++) {
      const targetPalace = targets[j];
      result.push({
        sourcePalace: palace.name,
        sourcePalaceIndex: palace.index,
        heavenlyStem: palace.heavenlyStem,
        mutagen: MUTAGEN_NAMES[j],
        targetPalace: targetPalace ? targetPalace.name : '',
        targetPalaceIndex: targetPalace ? targetPalace.index : -1
      });
    }
  }
  return result;
}

function getDecadalList(palaces) {
  const result = [];
  for (let i = 0; i < palaces.length; i++) {
    const palace = palaces[i];
    const d = palace.decadal;
    if (d && d.range) {
      result.push({
        palace: palace.name,
        palaceIndex: palace.index,
        range: d.range,
        heavenlyStem: d.heavenlyStem,
        earthlyBranch: d.earthlyBranch
      });
    }
  }
  return result;
}

function getStartingAge(fiveElementsClass) {
  const map = {
    '水二局': 2,
    '木三局': 3,
    '金四局': 4,
    '土五局': 5,
    '火六局': 6
  };
  return map[fiveElementsClass] || null;
}

function getOriginalPalace(palaces) {
  for (let i = 0; i < palaces.length; i++) {
    if (palaces[i].isOriginalPalace) {
      return { name: palaces[i].name, index: palaces[i].index };
    }
  }
  return { name: '', index: -1 };
}

function getSoulPalaceInfo(palaces, earthlyBranchOfSoulPalace) {
  for (let i = 0; i < palaces.length; i++) {
    if (palaces[i].earthlyBranch === earthlyBranchOfSoulPalace) {
      return {
        index: palaces[i].index,
        name: palaces[i].name,
        earthlyBranch: earthlyBranchOfSoulPalace,
        majorStars: extractStarArray(palaces[i].majorStars),
        minorStars: extractStarArray(palaces[i].minorStars),
        heavenlyStem: palaces[i].heavenlyStem,
        isBodyPalace: palaces[i].isBodyPalace
      };
    }
  }
  return null;
}

function getBodyPalaceInfo(palaces, earthlyBranchOfBodyPalace) {
  for (let i = 0; i < palaces.length; i++) {
    if (palaces[i].earthlyBranch === earthlyBranchOfBodyPalace) {
      return {
        index: palaces[i].index,
        name: palaces[i].name,
        earthlyBranch: earthlyBranchOfBodyPalace,
        majorStars: extractStarArray(palaces[i].majorStars),
        minorStars: extractStarArray(palaces[i].minorStars),
        heavenlyStem: palaces[i].heavenlyStem
      };
    }
  }
  return null;
}

function getCurrentDecadal(decadalList, currentAge) {
  if (!currentAge && currentAge !== 0) return null;
  for (let i = 0; i < decadalList.length; i++) {
    const d = decadalList[i];
    const rangeMatch = d.range.match(/(\d+)\s*[-~]\s*(\d+)/);
    if (!rangeMatch) continue;
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    if (currentAge >= start && currentAge <= end) {
      return {
        palace: d.palace,
        palaceIndex: d.palaceIndex,
        range: d.range,
        heavenlyStem: d.heavenlyStem,
        earthlyBranch: d.earthlyBranch,
        startAge: start,
        endAge: end
      };
    }
  }
  return null;
}

function getYearlyData(astrolabe, year) {
  try {
    const targetDate = `${year}-06-01`;
    const horoscope = astrolabe.horoscope(targetDate);
    if (!horoscope || !horoscope.yearly) return null;

    const yearly = horoscope.yearly;

    const yearlyPalaceNames = yearly.palaceNames || [];
    const yearlyStarsRaw = yearly.stars || [];

    const starsByPalace = [];
    for (let i = 0; i < yearlyPalaceNames.length; i++) {
      const rawStars = (yearlyStarsRaw[i] || []).map(s => ({
        name: s.name,
        type: s.type
      }));
      starsByPalace.push({
        palaceIndex: i,
        palaceName: yearlyPalaceNames[i],
        originPalaceName: PALACE_INDEX_NAMES[i] || '',
        stars: rawStars
      });
    }

    const yearlyMutagens = [];
    for (let i = 0; i < yearlyPalaceNames.length; i++) {
      const rawStars = yearlyStarsRaw[i] || [];
      for (const star of rawStars) {
        if (star.mutagen) {
          yearlyMutagens.push({
            mutagen: star.mutagen,
            star: star.name,
            yearlyPalaceName: yearlyPalaceNames[i],
            yearlyPalaceIndex: i,
            originPalaceName: PALACE_INDEX_NAMES[i] || ''
          });
        }
      }
    }

    const decadal = horoscope.decadal || {};
    const decadalPalaceNames = decadal.palaceNames || [];
    const decadalStarsRaw = decadal.stars || [];

    const decadalMutagens = [];
    for (let i = 0; i < decadalPalaceNames.length; i++) {
      const rawStars = (decadalStarsRaw[i] || []);
      for (const star of rawStars) {
        if (star.mutagen) {
          decadalMutagens.push({
            mutagen: star.mutagen,
            star: star.name,
            decadalPalaceName: decadalPalaceNames[i],
            decadalPalaceIndex: i,
            originPalaceName: PALACE_INDEX_NAMES[i] || ''
          });
        }
      }
    }

    return {
      year: year,
      yearlyPalaces: starsByPalace,
      yearlyMutagens: yearlyMutagens,
      decadalMutagens: decadalMutagens,
      yearlyHeavenlyStem: yearly.heavenlyStem || '',
      decadalHeavenlyStem: decadal.heavenlyStem || ''
    };
  } catch (e) {
    return { year: year, error: e.message };
  }
}

function buildStructuredOutput(astrolabe, opts) {
  const palaces = astrolabe.palaces;
  const basicInfo = {
    solarDate: astrolabe.solarDate,
    lunarDate: astrolabe.lunarDate,
    chineseDate: astrolabe.chineseDate,
    gender: astrolabe.gender,
    time: astrolabe.time,
    timeRange: astrolabe.timeRange,
    zodiac: astrolabe.zodiac,
    sign: astrolabe.sign,
    soulPalace: astrolabe.earthlyBranchOfSoulPalace,
    bodyPalace: astrolabe.earthlyBranchOfBodyPalace,
    soul: astrolabe.soul,
    body: astrolabe.body,
    fiveElementsClass: astrolabe.fiveElementsClass,
    startingAge: getStartingAge(astrolabe.fiveElementsClass),
    originalPalace: getOriginalPalace(palaces)
  };

  const palaceData = palaces.map(function(p) {
    return {
      index: p.index,
      name: p.name,
      heavenlyStem: p.heavenlyStem,
      earthlyBranch: p.earthlyBranch,
      majorStars: extractStarArray(p.majorStars),
      minorStars: extractStarArray(p.minorStars),
      adjectiveStars: extractStarArray(p.adjectiveStars),
      changsheng12: p.changsheng12,
      boshi12: p.boshi12,
      jiangqian12: p.jiangqian12,
      suiqian12: p.suiqian12,
      decadal: p.decadal,
      ages: p.ages,
      isBodyPalace: p.isBodyPalace,
      isOriginalPalace: p.isOriginalPalace
    };
  });

  const decadalList = getDecadalList(palaces);

  const result = {
    basicInfo: basicInfo,
    palaces: palaceData,
    soulPalaceInfo: getSoulPalaceInfo(palaces, astrolabe.earthlyBranchOfSoulPalace),
    bodyPalaceInfo: getBodyPalaceInfo(palaces, astrolabe.earthlyBranchOfBodyPalace),
    birthMutagens: getBirthYearMutagens(palaces),
    palaceFlyingMutagens: getPalaceFlyingMutagens(astrolabe),
    decadalList: decadalList
  };

  if (opts.year) {
    result.yearlyData = getYearlyData(astrolabe, opts.year);
  }

  return result;
}

function main() {
  const opts = parseArgs(process.argv);

  if (isNaN(opts.hourIndex) || opts.hourIndex < 0 || opts.hourIndex > 12) {
    console.error('错误: hourIndex 必须为 0~12 的整数');
    process.exit(1);
  }

  if (opts.gender !== '男' && opts.gender !== '女') {
    console.error('错误: gender 必须为 "男" 或 "女"');
    process.exit(1);
  }

  let astrolabe;
  try {
    astrolabe = astro.bySolar(opts.solarDate, opts.hourIndex, opts.gender, true, 'zh-CN');
  } catch (e) {
    console.error('排盘失败: ' + e.message);
    process.exit(1);
  }

  if (opts.jsonMode) {
    const raw = JSON.parse(JSON.stringify(astrolabe));
    console.log(JSON.stringify(raw, null, 2));
    return;
  }

  const output = buildStructuredOutput(astrolabe, { year: opts.year });
  const json = JSON.stringify(output, null, 2);
  console.log(json);

  if (opts.outputDir) {
    const dir = path.resolve(opts.outputDir);
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(path.join(dir, 'chart-data.json'), json, 'utf-8');
      console.error('已保存: ' + path.join(dir, 'chart-data.json'));
    } catch (e) {
      console.error('保存文件失败: ' + e.message);
      process.exit(1);
    }
  }
}

main();
