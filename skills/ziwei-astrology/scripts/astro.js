var { astro } = require('iztro');
var fs = require('fs');
var path = require('path');

var MUTAGEN_NAMES = ['禄', '权', '科', '忌'];

function usage() {
  console.log('用法: node scripts/astro.js "YYYY-M-D" hourIndex gender [outputDir] [--json]');
  console.log('');
  console.log('参数:');
  console.log('  YYYY-M-D   阳历日期，如 "2000-1-15"');
  console.log('  hourIndex  时辰索引: 0=早子时, 1=丑时, ..., 11=亥时, 12=晚子时');
  console.log('  gender     性别: "男" 或 "女"');
  console.log('  outputDir  可选，保存 chart-data.json 到该目录');
  console.log('  --json     直接输出完整 iztro 对象的 JSON');
  process.exit(1);
}

function parseArgs(argv) {
  var args = argv.slice(2);
  var jsonMode = false;
  var filtered = [];

  for (var i = 0; i < args.length; i++) {
    if (args[i] === '--json') {
      jsonMode = true;
    } else {
      filtered.push(args[i]);
    }
  }

  if (filtered.length < 3) usage();

  return {
    solarDate: filtered[0],
    hourIndex: parseInt(filtered[1], 10),
    gender: filtered[2],
    outputDir: filtered[3] || null,
    jsonMode: jsonMode
  };
}

function extractStarArray(stars) {
  return stars.map(function(s) {
    var obj = { name: s.name, type: s.type };
    if (s.brightness) obj.brightness = s.brightness;
    if (s.mutagen) obj.mutagen = s.mutagen;
    return obj;
  });
}

function getBirthYearMutagens(palaces) {
  var result = [];
  for (var i = 0; i < palaces.length; i++) {
    var palace = palaces[i];
    var allStars = [].concat(palace.majorStars, palace.minorStars);
    for (var j = 0; j < allStars.length; j++) {
      var star = allStars[j];
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
  var palaces = astrolabe.palaces;
  for (var k = 0; k < palaces.length; k++) {
    palaces[k].setAstrolabe(astrolabe);
  }
  var result = [];
  for (var i = 0; i < palaces.length; i++) {
    var palace = palaces[i];
    var targets = palace.mutagedPlaces();
    for (var j = 0; j < MUTAGEN_NAMES.length; j++) {
      var targetPalace = targets[j];
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
  var result = [];
  for (var i = 0; i < palaces.length; i++) {
    var palace = palaces[i];
    var d = palace.decadal;
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
  var map = {
    '水二局': 2,
    '木三局': 3,
    '金四局': 4,
    '土五局': 5,
    '火六局': 6
  };
  return map[fiveElementsClass] || null;
}

function getOriginalPalace(palaces) {
  for (var i = 0; i < palaces.length; i++) {
    if (palaces[i].isOriginalPalace) {
      return palaces[i].name;
    }
  }
  return '';
}

function buildStructuredOutput(astrolabe) {
  var palaces = astrolabe.palaces;

  var basicInfo = {
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

  var palaceData = palaces.map(function(p) {
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

  return {
    basicInfo: basicInfo,
    palaces: palaceData,
    birthMutagens: getBirthYearMutagens(palaces),
    palaceFlyingMutagens: getPalaceFlyingMutagens(astrolabe),
    decadalList: getDecadalList(palaces)
  };
}

function main() {
  var opts = parseArgs(process.argv);

  if (isNaN(opts.hourIndex) || opts.hourIndex < 0 || opts.hourIndex > 12) {
    console.error('错误: hourIndex 必须为 0~12 的整数');
    process.exit(1);
  }

  if (opts.gender !== '男' && opts.gender !== '女') {
    console.error('错误: gender 必须为 "男" 或 "女"');
    process.exit(1);
  }

  var astrolabe;
  try {
    astrolabe = astro.bySolar(opts.solarDate, opts.hourIndex, opts.gender, true, 'zh-CN');
  } catch (e) {
    console.error('排盘失败: ' + e.message);
    process.exit(1);
  }

  if (opts.jsonMode) {
    var raw = JSON.parse(JSON.stringify(astrolabe));
    console.log(JSON.stringify(raw, null, 2));
    return;
  }

  var output = buildStructuredOutput(astrolabe);
  var json = JSON.stringify(output, null, 2);
  console.log(json);

  if (opts.outputDir) {
    var dir = path.resolve(opts.outputDir);
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
