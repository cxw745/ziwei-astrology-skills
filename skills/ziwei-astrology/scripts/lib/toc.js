function slugify(text) {
  return text
    .replace(/^[#\s]+/, '')
    .replace(/[（()）\[\]·、：:，,。.！!？?\s★]+/g, '-')
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
  var inH1Group = false;
  var inH2Group = false;
  var inH3Group = false;
  var idCounters = {};

  function uniqueId(text) {
    var base = slugify(text);
    if (!idCounters[base]) {
      idCounters[base] = 1;
      return base;
    }
    idCounters[base]++;
    return base + '-' + idCounters[base];
  }

  function closeH3Group() {
    if (inH3Group) {
      items.push('</ul></li>');
      inH3Group = false;
    }
  }

  function closeH2Group() {
    closeH3Group();
    if (inH2Group) {
      items.push('</ul></li>');
      inH2Group = false;
    }
  }

  function closeH1Group() {
    closeH2Group();
    if (inH1Group) {
      items.push('</ul></li>');
      inH1Group = false;
    }
  }

  function tocToggle() {
    return '<button class="toc-toggle" onclick="toggleTocGroup(this)" aria-label="展开/收起">'
      + '<svg width="12" height="12" viewBox="0 0 12 12"><path d="M3 2l4 4-4 4" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>'
      + '</button>';
  }

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    var h1 = line.match(/^#\s+(.+)/);
    if (h1) {
      closeH1Group();
      var text = h1[1].trim();
      var id = uniqueId(text);
      if (text.indexOf('第') >= 0 && text.indexOf('大限') >= 0) {
        items.push('<li class="toc-item toc-h1-group"><a class="toc-link toc-h1" href="#' + id + '">' + escapeHtml(text) + '</a><ul class="toc-sub-list">');
        inH1Group = true;
      } else {
        items.push('<li class="toc-item"><a class="toc-link toc-h1" href="#' + id + '">' + escapeHtml(text) + '</a></li>');
      }
      continue;
    }

    var h2 = line.match(/^##\s+(.+)/);
    if (h2) {
      closeH2Group();
      if (inH1Group) {
        items.push('</ul></li>');
        inH1Group = false;
      }
      var text = h2[1].trim();
      var id = uniqueId(text);
      items.push('<li class="toc-item toc-group toc-group-h2">');
      items.push('<div class="toc-group-header">');
      items.push('<a class="toc-link toc-h2" href="#' + id + '">' + escapeHtml(text) + '</a>');
      items.push(tocToggle());
      items.push('</div>');
      items.push('<ul class="toc-children">');
      inH2Group = true;
      continue;
    }

    var h3 = line.match(/^###\s+(.+)/);
    if (h3) {
      closeH3Group();
      var text = h3[1].trim();
      var id = uniqueId(text);
      items.push('<li class="toc-item toc-group toc-group-h3">');
      items.push('<div class="toc-group-header">');
      items.push('<a class="toc-link toc-h3" href="#' + id + '">' + escapeHtml(text) + '</a>');
      items.push(tocToggle());
      items.push('</div>');
      items.push('<ul class="toc-children">');
      inH3Group = true;
      continue;
    }

    var h4 = line.match(/^####\s+(.+)/);
    if (h4) {
      var text = h4[1].trim();
      var id = uniqueId(text);
      items.push('<li class="toc-item"><a class="toc-link toc-h4" href="#' + id + '">' + escapeHtml(text) + '</a></li>');
      continue;
    }

    var h5 = line.match(/^#####\s+(.+)/);
    if (h5) {
      var text = h5[1].trim();
      var id = uniqueId(text);
      items.push('<li class="toc-item"><a class="toc-link toc-h5" href="#' + id + '">' + escapeHtml(text) + '</a></li>');
      continue;
    }

    var h6 = line.match(/^######\s+(.+)/);
    if (h6) {
      var text = h6[1].trim();
      var id = uniqueId(text);
      items.push('<li class="toc-item"><a class="toc-link toc-h6" href="#' + id + '">' + escapeHtml(text) + '</a></li>');
    }
  }

  closeH1Group();

  return items.join('\n');
}

module.exports = { generateToc };
