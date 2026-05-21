// parser.js — Markdown到HTML的转换逻辑，包含标题、表格、列表、引用、代码块、四化标签、亮度标签、来源标注等

var { generateChartHtml } = require('./chart');

function slugify(text) {
  return text
    .replace(/^[#\s]+/, '')
    .replace(/[（()）\[\]·、：:，,。.！!？?\s]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .replace(/"/g, '');
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function extractTitle(md) {
  var m = md.match(/^#\s+(.+)/);
  return m ? m[1].trim() : '紫微斗数命盘详析';
}

function markdownToHtml(md) {
  var placeholders = [];
  var placeholderIdx = 0;

  function addPlaceholder(htmlContent) {
    var token = 'SYSTOK' + (placeholderIdx++) + 'XEND';
    placeholders.push({ token: token, html: htmlContent });
    return token;
  }

  md = md.replace(/:::iztro\n([\s\S]*?)\n:::/g, function(m, content) {
    return addPlaceholder('<div class="system-content system-iztro">' + markdownToHtmlInner(content) + '</div>');
  });
  md = md.replace(/:::nishi\n([\s\S]*?)\n:::/g, function(m, content) {
    return addPlaceholder('<div class="system-content system-nishi">' + markdownToHtmlInner(content) + '</div>');
  });
  md = md.replace(/:::combined\n([\s\S]*?)\n:::/g, function(m, content) {
    return addPlaceholder('<div class="system-content system-combined">' + markdownToHtmlInner(content) + '</div>');
  });
  md = md.replace(/:::not-iztro\n([\s\S]*?)\n:::/g, function(m, content) {
    return addPlaceholder('<div class="system-content system-not-iztro">' + markdownToHtmlInner(content) + '</div>');
  });
  md = md.replace(/:::not-nishi\n([\s\S]*?)\n:::/g, function(m, content) {
    return addPlaceholder('<div class="system-content system-not-nishi">' + markdownToHtmlInner(content) + '</div>');
  });

  var html = markdownToHtmlInner(md);

  placeholders.forEach(function(p) {
    html = html.replace('<p>' + p.token + '</p>', p.html);
    html = html.replace(p.token, p.html);
  });

  return html;
}

function markdownToHtmlInner(md) {
  var lines = md.split('\n');
  var html = '';
  var inTable = false;
  var tableRows = [];
  var tableHeaders = [];
  var inCodeBlock = false;
  var codeContent = '';
  var inList = false;
  var listType = '';
  var skipNext = false;
  var inSection = false;
  var inInterpretation = false;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var nextLine = i < lines.length - 1 ? lines[i + 1] : '';

    if (skipNext) { skipNext = false; continue; }

    if (line.startsWith('\`\`\`')) {
      if (inCodeBlock) {
        html += '<pre><code>' + escapeHtml(codeContent.trim()) + '</code></pre>';
        codeContent = '';
        inCodeBlock = false;
      } else {
        if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
        if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) { codeContent += line + '\n'; continue; }

    if (line.match(/^\|.*\|/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (!inTable) { inTable = true; tableHeaders = []; tableRows = []; }
      var cells = parseTableRow(line);
      if (nextLine.match(/^\|[\s\-:|]+\|/) && tableHeaders.length === 0 && tableRows.length === 0) {
        tableHeaders = cells;
        skipNext = true;
      } else if (!line.match(/^\|[\s\-:|]+\|/)) {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      html += buildTable(tableHeaders, tableRows);
      inTable = false;
      tableHeaders = [];
      tableRows = [];
    }

    if (line.match(/^#{1,4}\s/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      if (inInterpretation) { html += '</div><!-- /interp-block -->'; inInterpretation = false; }
      var match = line.match(/^(#{1,4})\s+(.+)/);
      if (match) {
        var level = match[1].length;
        var text = match[2].trim();
        var id = slugify(text);
        var content = inlineFormat(text);

        if (level === 2) {
          if (inSection) {
            html += '</div></div>';
          }
          html += '<div class="section-wrapper" data-section-id="' + id + '">';
          html += '<h2 id="' + id + '"><span>' + content + '</span>';
          html += '<button class="section-toggle" onclick="toggleSection(\'' + id + '\')" aria-label="折叠/展开">';
          html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
          html += '</button></h2>';
          html += '<div class="section-content" id="section-' + id + '">';
          inSection = true;
        } else if (level === 3) {
          html += '<h3 id="' + id + '">' + content + '</h3>';
        } else if (level === 4) {
          html += '<h4>' + content + '</h4>';
        } else {
          html += '<h1 id="' + id + '">' + content + '</h1>';
        }
      }
      continue;
    }

    if (line.match(/^>\s?/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      var text = line.replace(/^>\s?/, '').trim();
      var bqClass = 'blockquote';
      if (text.indexOf('倪师') >= 0 || text.indexOf('天纪') >= 0) {
        bqClass = 'blockquote nishi-quote';
      }
      html += '<' + bqClass + '>' + inlineFormat(text) + '</blockquote>';
      continue;
    }

    if (line.match(/^---+/)) {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      html += '<hr>';
      continue;
    }

    if (line.match(/^[-*]\s+/)) {
      if (inList && listType !== 'ul') { html += '</ol>'; inList = false; }
      if (!inList) { html += '<ul>'; inList = true; listType = 'ul'; }
      var text = line.replace(/^[-*]\s+/, '').trim();
      html += '<li>' + inlineFormat(text) + '</li>';
      continue;
    }

    if (line.match(/^\d+\.\s+/)) {
      if (inList && listType !== 'ol') { html += '</ul>'; inList = false; }
      if (!inList) { html += '<ol>'; inList = true; listType = 'ol'; }
      var text = line.replace(/^\d+\.\s+/, '').trim();
      html += '<li>' + inlineFormat(text) + '</li>';
      continue;
    }

    if (inList && line.trim() === '') {
      html += listType === 'ul' ? '</ul>' : '</ol>';
      inList = false;
    }

    if (line.trim() === '') {
      if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }
      if (inTable) { html += buildTable(tableHeaders, tableRows); inTable = false; tableHeaders = []; tableRows = []; }
      continue;
    }

    if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; inList = false; }

    if (line.match(/^【专业解读】/)) {
      if (inInterpretation) { html += '</div><!-- /interp-block -->'; }
      html += '<div class="interpretation-block pro system-content system-not-nishi"><div class="interpretation-label">专业解读</div>';
      inInterpretation = true;
      var rest = line.replace(/^【专业解读】\s*/, '').trim();
      if (rest) { html += '<p>' + inlineFormat(rest) + '</p>'; }
      continue;
    }

    if (line.match(/^【通俗解析】/)) {
      if (inInterpretation) { html += '</div><!-- /interp-block -->'; }
      html += '<div class="interpretation-block lay system-content system-iztro"><div class="interpretation-label">通俗解析</div>';
      inInterpretation = true;
      var rest = line.replace(/^【通俗解析】\s*/, '').trim();
      if (rest) { html += '<p>' + inlineFormat(rest) + '</p>'; }
      continue;
    }

    html += '<p>' + inlineFormat(line.trim()) + '</p>';
  }

  if (inTable) { html += buildTable(tableHeaders, tableRows); }
  if (inList) { html += listType === 'ul' ? '</ul>' : '</ol>'; }
  if (inCodeBlock) { html += '<pre><code>' + escapeHtml(codeContent.trim()) + '</code></pre>'; }
  if (inInterpretation) { html += '</div><!-- /interp-block -->'; }
  if (inSection) { html += '</div></div>'; }

  html = enhanceHtml(html);
  return html;
}

function parseTableRow(line) {
  return line.split('|').slice(1, -1).map(function(c) { return c.trim(); });
}

function buildTable(headers, rows) {
  var html = '<div class="table-wrapper"><table><thead><tr>';
  headers.forEach(function(h) { html += '<th>' + inlineFormat(h) + '</th>'; });
  html += '</tr></thead><tbody>';
  rows.forEach(function(row) {
    html += '<tr>';
    row.forEach(function(cell) {
      html += '<td>' + inlineFormat(cell) + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';
  return html;
}

function inlineFormat(text) {
  text = escapeHtml(text);
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
  text = text.replace(/\`(.+?)\`/g, '<code>$1</code>');

  text = text.replace(/（庙）/g, '<span class="star-badge bright">庙</span>');
  text = text.replace(/（旺）/g, '<span class="star-badge bright">旺</span>');
  text = text.replace(/（平）/g, '<span class="star-badge normal">平</span>');
  text = text.replace(/（利）/g, '<span class="star-badge normal">利</span>');
  text = text.replace(/（得）/g, '<span class="star-badge normal">得</span>');
  text = text.replace(/（陷）/g, '<span class="star-badge dim">陷</span>');
  text = text.replace(/（不）/g, '<span class="star-badge dim">不</span>');

  text = text.replace(/\[禄\]/g, '<span class="star-badge hua-lu">禄</span>');
  text = text.replace(/\[权\]/g, '<span class="star-badge hua-quan">权</span>');
  text = text.replace(/\[科\]/g, '<span class="star-badge hua-ke">科</span>');
  text = text.replace(/\[忌\]/g, '<span class="star-badge hua-ji">忌</span>');

  text = text.replace(/化禄/g, '<span class="tag tag-success">化禄</span>');
  text = text.replace(/化权/g, '<span class="tag tag-warning">化权</span>');
  text = text.replace(/化科/g, '<span class="tag tag-info">化科</span>');
  text = text.replace(/化忌/g, '<span class="tag tag-danger">化忌</span>');

  text = text.replace(/\[iztro\]/g, '<span class="tag tag-system-iztro">iztro</span>');
  text = text.replace(/\[倪师\]/g, '<span class="tag tag-system-nishi">倪师</span>');
  text = text.replace(/\[综合\]/g, '<span class="tag tag-system-combined">综合</span>');

  return text;
}

function enhanceHtml(html) {
  html = html.replace(
    /\[来源:\s*([^\]]+)\]/g,
    function(match, ref) {
      return '<span class="source-ref" title="' + escapeHtml(ref) + '" data-source="' + escapeHtml(ref) + '"></span>';
    }
  );

  html = html.replace(
    /(<div class="interpretation-block pro[^"]*">[\s\S]*?<!-- \/interp-block -->)\s*(<div class="interpretation-block lay[^"]*">[\s\S]*?<!-- \/interp-block -->)/g,
    function(match, pro, lay) {
      return '<div class="interpretation-pair"><div class="interpretation-connector"></div>' + pro + lay + '</div>';
    }
  );

  html = html.replace(
    /<blockquote class="blockquote nishi-quote">([\s\S]*?)<\/blockquote>/g,
    function(match, content) {
      return '<blockquote class="blockquote nishi-quote system-content system-not-iztro">' + content + '</blockquote>';
    }
  );

  html = html.replace(
    /(<blockquote class="blockquote">)([\s\S]*?)(倪师|倪海厦|天纪)([\s\S]*?)(<\/blockquote>)/g,
    function(match, open, pre, keyword, post, close) {
      return '<blockquote class="blockquote nishi-quote system-content system-not-iztro">' + pre + keyword + post + close;
    }
  );

  html = html.replace(
    /(<p>[\s\S]*?)(宫干飞化|自化)([\s\S]*?<\/p>)/g,
    function(match, pre, keyword, post) {
      return pre + '<span class="system-not-nishi-ref">' + keyword + '</span>' + post;
    }
  );

  html = html.replace(
    /(<p>[\s\S]*?)(大限四化)([\s\S]*?<\/p>)/g,
    function(match, pre, keyword, post) {
      return pre + '<span class="system-nishi-note">' + keyword + '</span>' + post;
    }
  );

  html = html.replace(
    /【格局[：:]?\s*([^\】]+?)】([\s\S]*?)(?=【|$)/g,
    function(match, title, content) {
      var level = 'neutral';
      var t = title.trim();
      if (t.indexOf('极佳') >= 0 || t.indexOf('上上') >= 0 || t.indexOf('大吉') >= 0) level = 'excellent';
      else if (t.indexOf('吉') >= 0 || t.indexOf('良') >= 0 || t.indexOf('优') >= 0) level = 'good';
      else if (t.indexOf('凶') >= 0 || t.indexOf('险') >= 0 || t.indexOf('忌') >= 0 || t.indexOf('煞') >= 0) level = 'caution';
      return '<div class="pattern-card ' + level + '"><div class="pattern-card-title">' + escapeHtml(t) + '</div>' + content.trim() + '</div>';
    }
  );

  var inlineChartHtml = generateChartHtml(null);

  html = html.replace(
    /(<div class="section-wrapper" data-section-id="[^"]*十二宫[^"]*">)/,
    inlineChartHtml + '$1'
  );

  if (html.indexOf('inlineChartContainer') < 0) {
    html = html.replace(
      /(<h2[^>]*>[^<]*十二宫排盘总表[^<]*<\/h2>)/,
      inlineChartHtml + '$1'
    );
  }

  return html;
}

module.exports = { markdownToHtml, extractTitle, escapeHtml, slugify };
