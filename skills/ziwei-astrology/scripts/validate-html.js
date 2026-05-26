#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateHtmlCompleteness(mdPath, htmlPath) {
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(mdPath)) {
    console.error('❌ MD file not found: ' + mdPath);
    return { pass: false, errors: ['MD file not found'], warnings: [] };
  }
  if (!fs.existsSync(htmlPath)) {
    console.error('❌ HTML file not found: ' + htmlPath);
    return { pass: false, errors: ['HTML file not found'], warnings: [] };
  }

  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');

  const mdLines = mdContent.split('\n');
  const mdLineCount = mdLines.length;

  console.log('📄 MD: ' + mdLineCount + ' lines, ' + mdContent.length + ' chars');
  console.log('🌐 HTML: ' + htmlContent.length + ' chars');

  const requiredSections = [
    { keyword: '一、基本信息', label: '一、基本信息' },
    { keyword: '二、十二宫', label: '二、十二宫排盘总表' },
    { keyword: '三、生年四化', label: '三、生年四化表' },
    { keyword: '四、格局识别', label: '四、格局识别' },
    { keyword: '五、命宫总论', label: '五、命宫总论' },
    { keyword: '六、十二宫分论', label: '六、十二宫分论' },
    { keyword: '七、四化飞化详析', label: '七、四化飞化详析' },
    { keyword: '八、大限运势', label: '八、大限运势' },
    { keyword: '九、流年', label: '九、流年运势' },
    { keyword: '十、综合建议', label: '十、综合建议' },
    { keyword: '十一、附录', label: '十一、附录' },
  ];

  const requiredPalaces = [
    '6.1', '6.2', '6.3', '6.4', '6.5', '6.6',
    '6.7', '6.8', '6.9', '6.10', '6.11', '6.12'
  ];

  requiredSections.forEach(sec => {
    const inMd = mdContent.includes(sec.keyword);
    const inHtml = htmlContent.includes(sec.keyword);
    if (inMd && !inHtml) {
      errors.push('Section in MD but missing from HTML: ' + sec.label);
      console.error('❌ Section in MD but missing from HTML: ' + sec.label);
    } else if (inMd && inHtml) {
      console.log('✅ Section present in both: ' + sec.label);
    } else if (!inMd) {
      warnings.push('MD missing section: ' + sec.label);
    }
  });

  requiredPalaces.forEach(palace => {
    const mdHas = mdContent.includes('### ' + palace);
    const htmlHas = htmlContent.includes(palace);
    if (mdHas && !htmlHas) {
      errors.push('Palace ' + palace + ' in MD but missing from HTML');
      console.error('❌ Palace ' + palace + ' in MD but missing from HTML');
    } else if (mdHas && htmlHas) {
      console.log('✅ Palace present in both: ' + palace);
    }
  });

  const mdH2Count = (mdContent.match(/^## /gm) || []).length;
  const htmlH2Count = (htmlContent.match(/<h2/g) || []).length;
  console.log('📊 MD H2 sections: ' + mdH2Count + ', HTML H2 sections: ' + htmlH2Count);
  if (htmlH2Count < mdH2Count) {
    errors.push('HTML has fewer H2 sections than MD (' + htmlH2Count + ' vs ' + mdH2Count + ') - likely truncated');
  }

  const mdH3Count = (mdContent.match(/^### /gm) || []).length;
  const htmlH3Count = (htmlContent.match(/<h3/g) || []).length;
  console.log('📊 MD H3 sections: ' + mdH3Count + ', HTML H3 sections: ' + htmlH3Count);
  if (htmlH3Count < mdH3Count - 2) {
    errors.push('HTML has significantly fewer H3 sections than MD (' + htmlH3Count + ' vs ' + mdH3Count + ') - likely truncated');
  }

  if (!htmlContent.includes('</body>') || !htmlContent.includes('</html>')) {
    errors.push('HTML missing closing </body> or </html> tags - file may be truncated');
  }

  const mdTableCount = (mdContent.match(/^\|.*\|/gm) || []).length;
  const htmlTableCount = (htmlContent.match(/<table/g) || []).length;
  console.log('📊 MD table rows: ' + mdTableCount + ', HTML tables: ' + htmlTableCount);

  if (mdContent.includes('自检清单') && !htmlContent.includes('自检清单')) {
    errors.push('HTML missing 自检清单 section - file is likely truncated');
  }

  const mdLastLine = mdLines[mdLines.length - 1] || '';
  const htmlLastContent = htmlContent.substring(htmlContent.lastIndexOf('</main>'));
  const mdHasFooter = mdContent.includes('排盘数据来源') || mdContent.includes('生成日期');
  const htmlHasFooter = htmlContent.includes('排盘数据来源') || htmlContent.includes('生成日期');
  if (mdHasFooter && !htmlHasFooter) {
    errors.push('HTML missing footer content (排盘数据来源/生成日期) - file is likely truncated');
  }

  const pass = errors.length === 0;

  console.log('');
  if (pass) {
    console.log('✅ HTML completeness validation PASSED');
  } else {
    console.log('❌ HTML completeness validation FAILED');
    console.log('   Errors (' + errors.length + '):');
    errors.forEach(e => console.log('   - ' + e));
  }
  if (warnings.length > 0) {
    console.log('   Warnings (' + warnings.length + '):');
    warnings.forEach(w => console.log('   ⚠️ ' + w));
  }

  return { pass, errors, warnings };
}

function validateAllOutputs(outputDir) {
  const dir = path.resolve(outputDir);
  if (!fs.existsSync(dir)) {
    console.error('Output directory not found: ' + dir);
    return;
  }

  const subdirs = fs.readdirSync(dir).filter(f => {
    return fs.statSync(path.join(dir, f)).isDirectory();
  });

  console.log('🔍 Validating all outputs in: ' + dir);
  console.log('📁 Found ' + subdirs.length + ' subdirectories\n');

  let allPass = true;
  subdirs.forEach(sub => {
    const subPath = path.join(dir, sub);
    const mdFile = path.join(subPath, '命盘详析.md');
    const htmlFile = path.join(subPath, '命盘详析.html');

    if (fs.existsSync(mdFile)) {
      console.log('\n' + '═'.repeat(60));
      console.log('📋 Validating: ' + sub);
      console.log('═'.repeat(60));
      const result = validateHtmlCompleteness(mdFile, htmlFile);
      if (!result.pass) allPass = false;
    }
  });

  console.log('\n' + '═'.repeat(60));
  if (allPass) {
    console.log('✅ All validations PASSED');
  } else {
    console.log('❌ Some validations FAILED - see errors above');
  }

  return allPass;
}

const args = process.argv.slice(2);
if (args.length === 0) {
  const defaultDir = process.env.ZIWEI_OUTPUT_DIR || path.join(__dirname, '..', '..', '..', 'ziwei-output');
  validateAllOutputs(defaultDir);
} else if (args.length === 1) {
  if (fs.statSync(args[0]).isDirectory()) {
    validateAllOutputs(args[0]);
  } else {
    const mdPath = args[0];
    const htmlPath = mdPath.replace(/\.md$/, '.html');
    validateHtmlCompleteness(mdPath, htmlPath);
  }
} else {
  validateHtmlCompleteness(args[0], args[1]);
}
