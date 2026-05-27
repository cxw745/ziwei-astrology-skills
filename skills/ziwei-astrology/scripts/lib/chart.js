// chart.js — 排盘图数据提取和SVG渲染逻辑，从Markdown表格提取宫位数据并生成排盘图HTML

function extractChartData(md) {
  var result = { palaces: [], info: {} };

  var infoPatterns = [
    { key: 'name', re: /\*\*命主\*\*[：:]\s*([^\s|]+)/ },
    { key: 'ganzhi', re: /\|\s*干支\s*\|\s*([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥]年[^\|]+)/ },
    { key: 'wuxingju', re: /\|\s*五行局\s*\|\s*(\S+局)/ },
    { key: 'gender', re: /\|\s*性别\s*\|\s*([^\|]+)/ },
    { key: 'minggong', re: /\|\s*命宫\s*\|\s*(\S+宫)/ },
    { key: 'mingzhu', re: /\|\s*命主\s*\|\s*([^\|]+)/ },
    { key: 'shenzhu', re: /\|\s*身主\s*\|\s*([^\|]+)/ }
  ];

  infoPatterns.forEach(function(p) {
    var m = md.match(p.re);
    if (m) result.info[p.key] = m[1].trim();
  });

  var tableSection = md.match(/##\s+[^#\n]*十二宫排盘总表[\s\S]*?(?=\n---\n|\n##\s|$)/);
  if (!tableSection) return result;

  var lines = tableSection[0].split('\n');
  var inTable = false;
  var headers = [];
  var rows = [];

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^\|.*\|/)) {
      var cells = line.split('|').slice(1, -1).map(function(c) { return c.trim(); });
      if (cells.every(function(c) { return /^[\s\-:]+$/.test(c); })) {
        continue;
      }
      if (!inTable) {
        headers = cells;
        inTable = true;
      } else {
        rows.push(cells);
      }
    } else if (inTable) {
      break;
    }
  }

  if (headers.length === 0 || rows.length === 0) return result;

  var palaceCol = headers.findIndex(function(h) { return h.indexOf('宫位') >= 0; });
  var ganzhiCol = headers.findIndex(function(h) { return h.indexOf('天干地支') >= 0 || (h === '干支'); });
  var tianganCol = headers.findIndex(function(h) { return h === '天干'; });
  var dizhiCol = headers.findIndex(function(h) { return h === '地支'; });
  var mainStarCol = headers.findIndex(function(h) { return h.indexOf('主星') >= 0; });
  var auxCol = headers.findIndex(function(h) { return h.indexOf('辅星') >= 0; });
  var miscCol = headers.findIndex(function(h) { return h.indexOf('杂耀') >= 0 || h.indexOf('杂曜') >= 0; });
  var changshengCol = headers.findIndex(function(h) { return h.indexOf('长生') >= 0; });
  var dalimitCol = headers.findIndex(function(h) { return h.indexOf('大限') >= 0; });
  var noteCol = headers.findIndex(function(h) { return h.indexOf('备注') >= 0; });
  var bodyCol = headers.findIndex(function(h) { return h === '身宫'; });
  var laiyinCol = headers.findIndex(function(h) { return h === '来因'; });
  var sihuaCol = headers.findIndex(function(h) { return h.indexOf('生年四化') >= 0 || h.indexOf('四化') >= 0; });

  var palacePositions = {
    '命宫': 5, '兄弟': 6, '兄弟宫': 6, '夫妻': 7, '夫妻宫': 7,
    '子女': 8, '子女宫': 8, '财帛': 9, '财帛宫': 9,
    '疾厄': 10, '疾厄宫': 10, '迁移': 11, '迁移宫': 11,
    '仆役': 0, '仆役宫': 0, '交友': 0, '交友宫': 0,
    '官禄': 1, '官禄宫': 1, '事业': 1, '事业宫': 1,
    '田宅': 2, '田宅宫': 2, '福德': 3, '福德宫': 3,
    '父母': 4, '父母宫': 4
  };

  rows.forEach(function(row) {
    if (row.length < 2) return;

    var palaceName = palaceCol >= 0 ? row[palaceCol] : '';
    var cleanName = palaceName.replace(/[★☆].*$/, '').trim();

    var position = palacePositions[cleanName];
    if (position === undefined) {
      for (var key in palacePositions) {
        if (cleanName.indexOf(key) >= 0) {
          position = palacePositions[key];
          break;
        }
      }
    }
    if (position === undefined) return;

    var ganzhi = '';
    if (ganzhiCol >= 0) {
      ganzhi = row[ganzhiCol] || '';
    } else if (tianganCol >= 0 && dizhiCol >= 0) {
      ganzhi = (row[tianganCol] || '') + (row[dizhiCol] || '');
    }

    var mainStarStr = mainStarCol >= 0 ? row[mainStarCol] : '';
    var auxStr = auxCol >= 0 ? row[auxCol] : '';
    var miscStr = miscCol >= 0 ? row[miscCol] : '';
    var changsheng = changshengCol >= 0 ? row[changshengCol] : '';
    var dalimit = dalimitCol >= 0 ? row[dalimitCol] : '';
    var note = noteCol >= 0 ? row[noteCol] : '';
    var sihuaStr = sihuaCol >= 0 ? row[sihuaCol] : '';

    var mainStars = parseMainStars(mainStarStr);
    var auxStars = auxStr === '—' || auxStr === '-' || auxStr === '' ? [] : auxStr.split(/[·、,，\s]+/).filter(function(s) { return s && s !== '—' && s !== '-'; });
    var miscStars = miscStr === '—' || miscStr === '-' || miscStr === '' ? [] : miscStr.split(/[·、,，\s]+/).filter(function(s) { return s && s !== '—' && s !== '-'; });

    var isBodyPalace = false;
    if (bodyCol >= 0 && (row[bodyCol] || '').indexOf('身宫') >= 0) {
      isBodyPalace = true;
    } else if (palaceName.indexOf('身宫') >= 0) {
      isBodyPalace = true;
    } else if (note.indexOf('身宫') >= 0) {
      isBodyPalace = true;
    }

    var isLaiyinPalace = false;
    if (laiyinCol >= 0 && (row[laiyinCol] || '').indexOf('来因') >= 0) {
      isLaiyinPalace = true;
    } else if (palaceName.indexOf('来因') >= 0) {
      isLaiyinPalace = true;
    } else if (note.indexOf('来因') >= 0) {
      isLaiyinPalace = true;
    }

    result.palaces.push({
      name: cleanName,
      ganzhi: ganzhi,
      position: position,
      mainStars: mainStars,
      auxStars: auxStars,
      miscStars: miscStars,
      changsheng: changsheng,
      dalimit: dalimit,
      note: note === '—' ? '' : note,
      isBodyPalace: isBodyPalace,
      isLaiyinPalace: isLaiyinPalace
    });
  });

  return result;
}

function parseMainStars(str) {
  if (!str || str === '—' || str === '-') return [];

  var stars = [];
  var parts = str.split(/[·、+]/);

  parts.forEach(function(part) {
    part = part.trim();
    if (!part) return;

    if (part.indexOf('空') >= 0 && part.indexOf('借') >= 0) {
      stars.push({ name: '空宫借星', brightness: '', sihua: '' });
      return;
    }

    var name = '';
    var brightness = '';
    var sihua = '';

    var nameMatch = part.match(/^([^\(（\[\【]+)/);
    if (nameMatch) name = nameMatch[1].trim();

    var brightMatch = part.match(/[\(（](庙|旺|平|利|得|陷|不)[\)）]/);
    if (brightMatch) brightness = brightMatch[1];

    var sihuaMatch = part.match(/[\[【](禄|权|科|忌)[\]】]/);
    if (sihuaMatch) sihua = '化' + sihuaMatch[1];

    if (name) {
      stars.push({ name: name, brightness: brightness, sihua: sihua });
    }
  });

  return stars;
}

module.exports = { extractChartData };
