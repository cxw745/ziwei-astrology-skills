#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function lintMd(mdFilePath) {
  const content = fs.readFileSync(mdFilePath, 'utf-8');
  const lines = content.split('\n');
  const errors = [];
  let totalChecks = 0;
  let passCount = 0;

  function addCheck(name, passed, details) {
    totalChecks++;
    if (passed) {
      passCount++;
    }
    errors.push({ name, passed, details: details || [] });
  }

  var headingLevels = [];
  for (var i = 0; i < lines.length; i++) {
    var m = lines[i].match(/^(#{1,6})\s/);
    if (m) {
      headingLevels.push({ level: m[1].length, line: i + 1, text: lines[i] });
    }
  }

  var headingSkipErrors = [];
  var prevLevel = 0;
  for (var i = 0; i < headingLevels.length; i++) {
    var h = headingLevels[i];
    if (prevLevel > 0 && h.level > prevLevel + 1) {
      headingSkipErrors.push({
        line: h.line,
        msg: '标题层级跳级：从H' + prevLevel + '直接到H' + h.level + '（' + h.text.trim() + '）'
      });
    }
    prevLevel = h.level;
  }
  addCheck('标题层级连续性', headingSkipErrors.length === 0, headingSkipErrors);

  var tableErrors = [];
  var inTable = false;
  var tableStartLine = 0;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^\|.*\|/)) {
      if (!inTable) {
        inTable = true;
        tableStartLine = i + 1;
      }
      if (!line.match(/^\|/) || !line.match(/\|$/)) {
        tableErrors.push({
          line: i + 1,
          msg: '表格行未以 | 开头或结尾：' + line.trim().substring(0, 40)
        });
      }
    } else {
      if (inTable) {
        var separatorFound = false;
        for (var j = tableStartLine - 1; j < i; j++) {
          if (lines[j].match(/^\|[\s\-:|]+\|/)) {
            separatorFound = true;
            break;
          }
        }
        if (!separatorFound) {
          tableErrors.push({
            line: tableStartLine,
            msg: '表格缺少分隔行（---）'
          });
        }
        inTable = false;
      }
    }
  }
  if (inTable) {
    var separatorFound = false;
    for (var j = tableStartLine - 1; j < lines.length; j++) {
      if (lines[j].match(/^\|[\s\-:|]+\|/)) {
        separatorFound = true;
        break;
      }
    }
    if (!separatorFound) {
      tableErrors.push({
        line: tableStartLine,
        msg: '表格缺少分隔行（---）'
      });
    }
  }
  addCheck('表格格式', tableErrors.length === 0, tableErrors);

  var requiredChapters = [
    '一、', '二、', '三、', '四、', '五、',
    '六、', '七、', '八、', '九、', '十、', '十一、'
  ];
  var missingChapters = [];
  for (var i = 0; i < requiredChapters.length; i++) {
    var ch = requiredChapters[i];
    var found = false;
    for (var j = 0; j < lines.length; j++) {
      if (lines[j].match(/^##\s/) && lines[j].indexOf(ch) >= 0) {
        found = true;
        break;
      }
    }
    if (!found) {
      missingChapters.push(ch);
    }
  }
  addCheck('章节完整性（一、到十一、）', missingChapters.length === 0,
    missingChapters.map(function(ch) { return { line: 0, msg: '缺少章节：' + ch }; }));

  var blankLineErrors = [];
  for (var i = 0; i < headingLevels.length; i++) {
    var h = headingLevels[i];
    var lineIdx = h.line - 1;
    if (lineIdx > 0 && lines[lineIdx - 1].trim() !== '') {
      blankLineErrors.push({
        line: h.line,
        msg: '标题前缺少空行：' + h.text.trim()
      });
    }
    if (lineIdx < lines.length - 1 && lines[lineIdx + 1].trim() !== '') {
      blankLineErrors.push({
        line: h.line,
        msg: '标题后缺少空行：' + h.text.trim()
      });
    }
  }
  addCheck('空行规范（标题前后空行）', blankLineErrors.length === 0, blankLineErrors);

  var listErrors = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var olMatch = line.match(/^(\s*)(\d+)[)、]\s+/);
    if (olMatch && !line.match(/^\s*\d+\.\s+/)) {
      listErrors.push({
        line: i + 1,
        msg: '有序列表格式错误，应使用"数字."格式：' + line.trim().substring(0, 40)
      });
    }
  }
  addCheck('列表格式（有序列表使用"数字."）', listErrors.length === 0, listErrors);

  var quoteErrors = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^\s*＞/) || line.match(/^\s*&gt;/)) {
      quoteErrors.push({
        line: i + 1,
        msg: '引用格式错误，应使用 > 开头：' + line.trim().substring(0, 40)
      });
    }
  }
  addCheck('引用块格式（使用 > 开头）', quoteErrors.length === 0, quoteErrors);

  var htmlErrors = [];
  var htmlTagRe = /<(div|span|table|tr|td|th|thead|tbody|font|center|br|hr|p|img|a|ul|ol|li|h[1-6])\b[^>]*>/i;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^\s*```/)) continue;
    var match = line.match(htmlTagRe);
    if (match) {
      htmlErrors.push({
        line: i + 1,
        msg: '发现HTML标签残留 <' + match[1] + '>：' + line.trim().substring(0, 40)
      });
    }
  }
  addCheck('无HTML标签残留', htmlErrors.length === 0, htmlErrors);

  var sihuaErrors = [];
  var inStarTable = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^\s*```/)) continue;
    if (line.match(/^##\s/) && line.indexOf('十二宫排盘') >= 0) {
      inStarTable = true;
    } else if (line.match(/^##\s/) || line.match(/^---/)) {
      inStarTable = false;
    }
    if (inStarTable && line.match(/^\|/) && !line.match(/^\|[\s\-:|]+\|/) && line.match(/\(庙|旺|得|利|平|不|陷\)/)) {
      var starColMatch = line.match(/\|([^|]*\(庙|旺|得|利|平|不|陷\)[^|]*)\|/);
      if (starColMatch) {
        var starCell = starColMatch[1];
        if (starCell.match(/化[禄权科忌]/)) {
          sihuaErrors.push({
            line: i + 1,
            msg: '排盘总表中星曜四化标记应使用[禄]/[权]/[科]/[忌]：' + line.trim().substring(0, 50)
          });
        }
      }
    }
  }
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (line.match(/^\s*```/)) continue;
    var malformedBracket = line.match(/\[化[禄权科忌]\]/g);
    if (malformedBracket) {
      for (var k = 0; k < malformedBracket.length; k++) {
        sihuaErrors.push({
          line: i + 1,
          msg: '四化标记格式错误，应为[禄]/[权]/[科]/[忌]，实际为' + malformedBracket[k]
        });
      }
    }
  }
  addCheck('四化标记格式（[禄]/[权]/[科]/[忌]）', sihuaErrors.length === 0, sihuaErrors);

  var sourceErrors = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var badSource = line.match(/\[来源[：:]/);
    if (badSource && !line.match(/\[来源:\s*[^\]]+\]/)) {
      sourceErrors.push({
        line: i + 1,
        msg: '来源标注格式错误，应使用 [来源: xxx]：' + line.trim().substring(0, 50)
      });
    }
  }
  addCheck('来源标注格式（[来源: xxx]）', sourceErrors.length === 0, sourceErrors);

  var emptyLineErrors = [];
  var consecutiveEmpty = 0;
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '') {
      consecutiveEmpty++;
      if (consecutiveEmpty >= 3) {
        emptyLineErrors.push({
          line: i + 1,
          msg: '连续' + consecutiveEmpty + '行以上空行'
        });
      }
    } else {
      consecutiveEmpty = 0;
    }
  }
  addCheck('无多余空行（连续3行以上）', emptyLineErrors.length === 0, emptyLineErrors);

  console.log('\n📋 Markdown 格式规范检查：' + path.basename(mdFilePath));
  console.log('═'.repeat(60));

  for (var i = 0; i < errors.length; i++) {
    var e = errors[i];
    var icon = e.passed ? '✅' : '❌';
    console.log(icon + ' ' + e.name);
    if (!e.passed && e.details.length > 0) {
      for (var j = 0; j < e.details.length; j++) {
        var d = e.details[j];
        if (d.line > 0) {
          console.log('   行' + d.line + '：' + d.msg);
        } else {
          console.log('   ' + d.msg);
        }
      }
    }
  }

  console.log('═'.repeat(60));
  var rate = totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : 0;
  console.log('通过率：' + passCount + '/' + totalChecks + '（' + rate + '%）');

  if (passCount < totalChecks) {
    console.log('\n⚠️ 存在格式问题，建议修正后再进行 md2html 转换。');
    process.exit(1);
  } else {
    console.log('\n✅ 所有格式检查通过！');
  }
}

var args = process.argv.slice(2);
if (args.length < 1) {
  console.log('用法：node lint-md.js <report.md>');
  process.exit(1);
}

var mdFile = path.resolve(args[0]);
if (!fs.existsSync(mdFile)) {
  console.log('文件不存在：' + mdFile);
  process.exit(1);
}

lintMd(mdFile);
