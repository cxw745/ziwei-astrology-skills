// toc.js — 目录生成逻辑，从Markdown内容提取h2/h3标题生成侧边栏目录

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

function generateToc(md) {
  var lines = md.split('\n');
  var items = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      var text = h2[1].trim();
      var id = slugify(text);
      items.push('<li class="toc-item"><a class="toc-link" href="#' + id + '">' + escapeHtml(text) + '</a></li>');
      continue;
    }
    var h3 = line.match(/^###\s+(\d+\.?\s*.+)/);
    if (h3) {
      var text = h3[1].trim();
      var id = slugify(text);
      items.push('<li class="toc-item"><a class="toc-link toc-h3" href="#' + id + '">' + escapeHtml(text) + '</a></li>');
    }
  }
  return items.join('\n');
}

module.exports = { generateToc };
