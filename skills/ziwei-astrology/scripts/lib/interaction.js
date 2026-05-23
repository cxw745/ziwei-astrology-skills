function getInteractionScript(chartData) {
return `
(function() {
  var chartData = ${JSON.stringify(chartData)};

  var systemLabels = {
    iztro: 'iztro标准',
    nishi: '倪师天纪',
    combined: '综合模式'
  };

  var systemBadgeLabels = {
    iztro: 'iztro',
    nishi: '倪师',
    combined: '综合'
  };

  function niBrightness(iztroLevel) {
    if (!iztroLevel) return iztroLevel;
    if (['庙','旺'].indexOf(iztroLevel) >= 0) return '庙旺';
    if (['得','利','平'].indexOf(iztroLevel) >= 0) return '平';
    if (['不','陷'].indexOf(iztroLevel) >= 0) return '陷';
    return iztroLevel;
  }

  function getNiBrightnessClass(iztroLevel) {
    var ni = niBrightness(iztroLevel);
    if (ni === '庙旺') return 'ni-miao';
    if (ni === '平') return 'ni-ping';
    if (ni === '陷') return 'ni-xian';
    return '';
  }

  function formatBrightnessLabel(iztroLevel) {
    var system = document.documentElement.getAttribute('data-system') || 'combined';
    if (!iztroLevel) return '';
    if (system === 'iztro') return iztroLevel;
    if (system === 'nishi') return niBrightness(iztroLevel);
    return iztroLevel + '(' + niBrightness(iztroLevel) + ')';
  }

  /* ===== 体系切换 ===== */
  function switchSystem(mode) {
    var allSystemContent = document.querySelectorAll('.system-content');
    allSystemContent.forEach(function(el) {
      el.classList.add('system-content-fade-out');
    });

    setTimeout(function() {
      document.documentElement.setAttribute('data-system', mode);
      localStorage.setItem('ziwei-system', mode);
      updateSystemUI(mode);

      allSystemContent.forEach(function(el) {
        el.classList.remove('system-content-fade-out');
        el.classList.add('system-content-fade-in');
      });

      setTimeout(function() {
        allSystemContent.forEach(function(el) {
          el.classList.remove('system-content-fade-in');
        });
      }, 350);
    }, 250);
  }

  function updateSystemUI(mode) {
    document.querySelectorAll('.mode-btn').forEach(function(btn) {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });
    var nameEl = document.getElementById('sidebarSystemName');
    if (nameEl) nameEl.textContent = systemLabels[mode] || mode;
    var badgeEl = document.getElementById('chartSystemBadge');
    if (badgeEl) badgeEl.textContent = systemBadgeLabels[mode] || mode;
  }

  window.switchSystem = switchSystem;

  var savedSystem = localStorage.getItem('ziwei-system');
  if (savedSystem && ['iztro','nishi','combined'].indexOf(savedSystem) >= 0) {
    document.documentElement.setAttribute('data-system', savedSystem);
    updateSystemUI(savedSystem);
  } else {
    updateSystemUI('combined');
  }

  /* ===== 主题切换 ===== */
  function toggleTheme() {
    var html = document.documentElement;
    var current = html.getAttribute('data-theme');
    var next = current === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', next);
    localStorage.setItem('ziwei-theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    var icon = document.getElementById('themeIcon');
    if (theme === 'dark') {
      icon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
    } else {
      icon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    }
  }

  /* ===== 侧边栏 ===== */
  function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      overlay.style.display = 'block';
      requestAnimationFrame(function() { overlay.classList.add('visible'); });
    } else {
      closeSidebar();
    }
  }

  function closeSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebarOverlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
    setTimeout(function() { overlay.style.display = 'none'; }, 200);
  }

  window.toggleTheme = toggleTheme;
  window.toggleSidebar = toggleSidebar;
  window.closeSidebar = closeSidebar;

  /* ===== 移动端目录抽屉 ===== */
  function toggleMobileToc() {
    var drawer = document.getElementById('mobileTocDrawer');
    var overlay = document.getElementById('mobileTocOverlay');
    if (drawer.classList.contains('open')) {
      closeMobileToc();
    } else {
      var tocList = document.getElementById('tocList');
      var tocBody = document.getElementById('mobileTocBody');
      if (tocList && tocBody) {
        tocBody.innerHTML = tocList.innerHTML;
      }
      overlay.style.display = 'block';
      requestAnimationFrame(function() {
        overlay.classList.add('visible');
        drawer.classList.add('open');
      });
      tocBody.querySelectorAll('.toc-link').forEach(function(link) {
        link.addEventListener('click', function() {
          closeMobileToc();
        });
      });
    }
  }

  function closeMobileToc() {
    var drawer = document.getElementById('mobileTocDrawer');
    var overlay = document.getElementById('mobileTocOverlay');
    drawer.classList.remove('open');
    overlay.classList.remove('visible');
    setTimeout(function() { overlay.style.display = 'none'; }, 300);
  }

  window.toggleMobileToc = toggleMobileToc;
  window.closeMobileToc = closeMobileToc;

  var saved = localStorage.getItem('ziwei-theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
    updateThemeIcon(saved);
  }

  /* ===== 目录高亮 ===== */
  var headings = document.querySelectorAll('h2, h3');
  var tocLinks = document.querySelectorAll('.toc-link');

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        tocLinks.forEach(function(l) { l.classList.remove('active'); });
        var id = entry.target.id;
        var link = document.querySelector('.toc-link[href="#' + id + '"]');
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 });

  headings.forEach(function(h) { observer.observe(h); });

  /* ===== 滚动处理 ===== */
  var backToTop = document.getElementById('backToTop');
  var progressFill = document.getElementById('progressFill');

  window.addEventListener('scroll', function() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressFill.style.width = progress + '%';
    backToTop.classList.toggle('visible', scrollTop > 400);
  });

  document.querySelectorAll('.toc-link').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 900) {
        closeSidebar();
      }
    });
  });

  /* ===== 章节折叠 ===== */
  function toggleSection(id) {
    var wrapper = document.querySelector('.section-wrapper[data-section-id="' + id + '"]');
    if (!wrapper) return;
    wrapper.classList.toggle('collapsed');
    var collapsed = getCollapsedSections();
    if (wrapper.classList.contains('collapsed')) {
      if (collapsed.indexOf(id) < 0) collapsed.push(id);
    } else {
      collapsed = collapsed.filter(function(s) { return s !== id; });
    }
    localStorage.setItem('ziwei-collapsed-sections', JSON.stringify(collapsed));
  }

  function getCollapsedSections() {
    try { return JSON.parse(localStorage.getItem('ziwei-collapsed-sections') || '[]'); }
    catch(e) { return []; }
  }

  function restoreSectionStates() {
    var collapsed = getCollapsedSections();
    collapsed.forEach(function(id) {
      var wrapper = document.querySelector('.section-wrapper[data-section-id="' + id + '"]');
      if (wrapper) wrapper.classList.add('collapsed');
    });
  }

  window.toggleSection = toggleSection;
  restoreSectionStates();

  /* ===== 排盘图：宫位映射与三方四正 ===== */
  var palaceNames = {
    0: '仆役', 1: '官禄', 2: '田宅', 3: '福德',
    4: '父母', 5: '命宫', 6: '兄弟', 7: '夫妻',
    8: '子女', 9: '财帛', 10: '疾厄', 11: '迁移'
  };

  var palaceDizhi = {
    0: '申', 1: '未', 2: '午', 3: '巳',
    4: '辰', 5: '卯', 6: '寅', 7: '丑',
    8: '子', 9: '亥', 10: '戌', 11: '酉'
  };

  var sanfangMap = {
    0: { sanfang: [8, 4], sizheng: 6 },
    1: { sanfang: [5, 9], sizheng: 7 },
    2: { sanfang: [6, 10], sizheng: 8 },
    3: { sanfang: [7, 11], sizheng: 9 },
    4: { sanfang: [8, 0], sizheng: 10 },
    5: { sanfang: [1, 9], sizheng: 11 },
    6: { sanfang: [2, 10], sizheng: 0 },
    7: { sanfang: [3, 11], sizheng: 1 },
    8: { sanfang: [4, 0], sizheng: 2 },
    9: { sanfang: [5, 1], sizheng: 3 },
    10: { sanfang: [6, 2], sizheng: 4 },
    11: { sanfang: [7, 3], sizheng: 5 }
  };

  var gridLayout = [
    { pos: 3, row: 1, col: 1 },
    { pos: 2, row: 1, col: 2 },
    { pos: 1, row: 1, col: 3 },
    { pos: 0, row: 1, col: 4 },
    { pos: 4, row: 2, col: 1 },
    { pos: 11, row: 2, col: 4 },
    { pos: 5, row: 3, col: 1 },
    { pos: 10, row: 3, col: 4 },
    { pos: 6, row: 4, col: 1 },
    { pos: 7, row: 4, col: 2 },
    { pos: 8, row: 4, col: 3 },
    { pos: 9, row: 4, col: 4 }
  ];

  /* ===== 排盘图面板 ===== */
  function toggleChart() {
    var panel = document.getElementById('chartPanel');
    var overlay = document.getElementById('chartOverlay');
    if (panel.classList.contains('open')) {
      closeChart();
    } else {
      panel.classList.add('open');
      overlay.classList.add('open');
      renderChart();
    }
  }

  function closeChart() {
    var panel = document.getElementById('chartPanel');
    var overlay = document.getElementById('chartOverlay');
    panel.classList.remove('open');
    overlay.classList.remove('open');
    hideTooltip();
    clearSanfangLines();
  }

  function minimizeChart() {
    closeChart();
  }

  window.toggleChart = toggleChart;
  window.closeChart = closeChart;
  window.minimizeChart = minimizeChart;

  /* ===== 亮度与四化样式 ===== */
  function getBrightnessClass(brightness) {
    if (!brightness) return '';
    var b = brightness.replace(/[()（）]/g, '');
    if (b === '庙' || b === '旺') return 'miao';
    if (b === '平' || b === '利' || b === '得') return 'ping';
    if (b === '陷' || b === '不') return 'xian';
    return '';
  }

  function getSihuaClass(hua) {
    if (!hua) return '';
    if (hua.indexOf('禄') >= 0) return 'lu';
    if (hua.indexOf('权') >= 0) return 'quan';
    if (hua.indexOf('科') >= 0) return 'ke';
    if (hua.indexOf('忌') >= 0) return 'ji';
    return '';
  }

  function getSihuaTagClass(hua) {
    if (!hua) return '';
    if (hua.indexOf('禄') >= 0) return 'tag-success';
    if (hua.indexOf('权') >= 0) return 'tag-warning';
    if (hua.indexOf('科') >= 0) return 'tag-info';
    if (hua.indexOf('忌') >= 0) return 'tag-danger';
    return '';
  }

  function isJiStar(name) {
    var jiStars = ['左辅','右弼','文昌','文曲','天魁','天钺','禄存','天马'];
    return jiStars.indexOf(name) >= 0;
  }

  function isShaStar(name) {
    var shaStars = ['擎羊','陀罗','火星','铃星','地空','地劫','化忌'];
    return shaStars.indexOf(name) >= 0;
  }

  function extractAuxSihua(starStr) {
    var m = starStr.match(/[\[【](禄|权|科|忌)[\]】]/);
    return m ? m[1] : '';
  }

  /* ===== 渲染排盘图 ===== */
  var tooltipData = {};
  var selectedPosition = -1;

  function renderChartTo(container, isInline) {
    if (!chartData || !chartData.palaces || chartData.palaces.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1;text-align:center;color:var(--text-muted);padding:40px;">未找到排盘数据</div>';
      return;
    }

    var palaceMap = {};
    chartData.palaces.forEach(function(p) { palaceMap[p.position] = p; });

    var html = '';

    gridLayout.forEach(function(item) {
      var palace = palaceMap[item.pos];
      var cellClass = 'chart-cell';
      var cellStyle = 'grid-row:' + item.row + ';grid-column:' + item.col + ';';

      if (palace) {
        if (item.pos === 5) cellClass += ' palace-ming';
        if (palace.isBodyPalace) cellClass += ' palace-body';
        if (palace.isLaiyinPalace) cellClass += ' palace-laiyin';
        if (!palace.mainStars || palace.mainStars.length === 0) cellClass += ' palace-empty';
        if (palace.dalimit && isCurrentDalimit(palace.dalimit)) cellClass += ' dalimit-active';
      } else {
        cellClass += ' palace-empty';
      }

      html += '<div class="' + cellClass + '" style="' + cellStyle + '" data-position="' + item.pos + '">';

      if (palace) {
        html += '<div class="chart-cell-header">';
        html += '<span class="chart-palace-name">' + esc(palace.name) + '</span>';
        html += '<div class="chart-palace-marks">';
        if (item.pos === 5) html += '<span class="chart-ming-mark">命</span>';
        if (palace.isBodyPalace) html += '<span class="chart-shen-mark">身</span>';
        html += '</div>';
        html += '</div>';

        html += '<div class="chart-ganzhi">' + esc(palace.ganzhi || '') + '</div>';

        if (palace.dalimit) {
          var dlClass = 'chart-dalimit' + (isCurrentDalimit(palace.dalimit) ? ' current-dalimit' : '');
          html += '<div class="' + dlClass + '">' + esc(palace.dalimit) + '</div>';
        }

        if (palace.mainStars && palace.mainStars.length > 0) {
          html += '<div class="chart-main-stars">';
          palace.mainStars.forEach(function(s) {
            var bc = getBrightnessClass(s.brightness);
            var niBc = getNiBrightnessClass(s.brightness);
            html += '<span class="chart-star ' + bc + ' ' + niBc + '">' + esc(s.name);
            if (s.brightness) {
              html += '<span class="chart-brightness-label">';
              html += '<span class="iztro-brightness">' + esc(s.brightness) + '</span>';
              html += '<span class="ni-brightness">' + esc(niBrightness(s.brightness)) + '</span>';
              html += '<span class="combined-brightness">' + esc(s.brightness) + '(' + esc(niBrightness(s.brightness)) + ')</span>';
              html += '</span>';
            }
            if (s.sihua) {
              var sc = getSihuaClass(s.sihua);
              html += '<span class="chart-sihua ' + sc + '">' + esc(s.sihua) + '</span>';
            }
            html += '</span>';
          });
          html += '</div>';
        } else {
          html += '<div class="chart-main-stars"><span class="chart-empty-text">空宫</span></div>';
        }

        var jiStars = [];
        var shaStars = [];
        var otherAux = [];
        if (palace.auxStars && palace.auxStars.length > 0) {
          palace.auxStars.forEach(function(s) {
            var cleanS = s.replace(/[\[【](禄|权|科|忌)[\]】]/g, '');
            if (isJiStar(cleanS)) jiStars.push(s);
            else if (isShaStar(cleanS)) shaStars.push(s);
            else otherAux.push(s);
          });
        }
        if (jiStars.length > 0) {
          html += '<div class="chart-aux-stars">';
          jiStars.forEach(function(s) {
            var sihua = extractAuxSihua(s);
            html += '<span class="chart-aux-star-item' + (sihua ? ' has-sihua' : '') + '">' + esc(s.replace(/[\[【]禄[\]】]|[\[【]权[\]】]|[\[【]科[\]】]|[\[【]忌[\]】]/g, ''));
            if (sihua) {
              var sc = getSihuaClass('化' + sihua);
              html += '<span class="chart-sihua ' + sc + '">化' + sihua + '</span>';
            }
            html += '</span>';
          });
          html += '</div>';
        }
        if (shaStars.length > 0) {
          html += '<div class="chart-sha-stars">';
          shaStars.forEach(function(s) {
            html += '<span class="chart-sha-star-item">' + esc(s) + '</span>';
          });
          html += '</div>';
        }
        if (palace.miscStars && palace.miscStars.length > 0) {
          html += '<div class="chart-misc-stars">' + esc(palace.miscStars.join('·')) + '</div>';
        }
        if (palace.changsheng) {
          html += '<div class="chart-changsheng">' + esc(palace.changsheng) + '</div>';
        }

        var tt = '';
        tt += '<div class="chart-tooltip-title">' + esc(palace.name) + ' · ' + esc(palace.ganzhi || '') + ' (' + (palaceDizhi[item.pos] || '') + '宫)</div>';
        if (palace.mainStars && palace.mainStars.length > 0) {
          tt += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">主星</div>';
          palace.mainStars.forEach(function(s) {
            tt += esc(s.name);
            if (s.brightness) tt += '(' + esc(s.brightness) + ')';
            if (s.sihua) tt += ' <span class="tag ' + getSihuaTagClass(s.sihua) + '">' + esc(s.sihua) + '</span>';
            tt += ' ';
          });
          tt += '</div>';
          var sihuaStars = palace.mainStars.filter(function(s) { return s.sihua; });
          if (sihuaStars.length > 0) {
            tt += '<div class="tooltip-sihua-badges">';
            sihuaStars.forEach(function(s) {
              var sc = getSihuaClass(s.sihua);
              tt += '<span class="tooltip-sihua-badge ' + sc + '">' + esc(s.name) + ' ' + esc(s.sihua) + '</span>';
            });
            tt += '</div>';
          }
        }
        if (palace.auxStars && palace.auxStars.length > 0) {
          tt += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">辅星</div>' + esc(palace.auxStars.join('、')) + '</div>';
        }
        if (palace.miscStars && palace.miscStars.length > 0) {
          tt += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">杂耀</div>' + esc(palace.miscStars.join('、')) + '</div>';
        }
        if (palace.changsheng) {
          tt += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">长生十二神</div>' + esc(palace.changsheng) + '</div>';
        }
        if (palace.dalimit) {
          tt += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">大限</div>' + esc(palace.dalimit) + '</div>';
        }
        if (palace.note) {
          tt += '<div class="chart-tooltip-section"><div class="chart-tooltip-label">备注</div>' + esc(palace.note) + '</div>';
        }
        var sf = sanfangMap[item.pos];
        if (sf) {
          var sfNames = sf.sanfang.map(function(p) { return palaceNames[p] || ''; });
          var szName = palaceNames[sf.sizheng] || '';
          tt += '<div class="chart-tooltip-sanfang">三方：' + sfNames.join('、') + ' ｜ 四正(对宫)：' + szName + '</div>';
        }
        tooltipData[item.pos] = tt;
      } else {
        html += '<div class="chart-cell-header">';
        html += '<span class="chart-palace-name">' + (palaceNames[item.pos] || '-') + '</span>';
        html += '</div>';
        html += '<div class="chart-ganzhi">' + (palaceDizhi[item.pos] || '') + '</div>';
        html += '<div class="chart-main-stars"><span class="chart-empty-text">空宫</span></div>';
      }

      html += '</div>';
    });

    html += '<div class="chart-cell center-cell" style="grid-row:2/4;grid-column:2/4;">';
    html += '<div class="center-taiji">☯</div>';
    if (chartData.info) {
      html += '<div class="center-title">紫微斗数</div>';
      html += '<div class="center-sub">' + esc(chartData.info.name || '命盘') + '</div>';
      html += '<div class="center-sub">' + esc(chartData.info.ganzhi || '') + '</div>';
      html += '<div class="center-sub">' + esc(chartData.info.wuxingju || '') + '</div>';
      if (chartData.info.gender) {
        html += '<div class="center-sub">' + esc(chartData.info.gender) + '</div>';
      }
      if (chartData.info.mingzhu) {
        html += '<div class="center-sub">命主：' + esc(chartData.info.mingzhu) + '</div>';
      }
      if (chartData.info.shenzhu) {
        html += '<div class="center-sub">身主：' + esc(chartData.info.shenzhu) + '</div>';
      }
      var currentDalimit = findCurrentDalimit();
      if (currentDalimit) {
        html += '<div class="center-dalimit-box">当前大限：' + esc(currentDalimit) + '</div>';
      }
    }
    html += '</div>';

    container.innerHTML = html;
    renderDalimitBar(container);
  }

  function renderDalimitBar(chartContainer) {
    var bar = chartContainer.closest('.chart-panel-body')
      ? document.getElementById('chartDalimitBar')
      : document.getElementById('inlineChartDalimitBar');
    if (!bar || !chartData || !chartData.palaces) return;

    var dalimits = [];
    chartData.palaces.forEach(function(p) {
      if (p.dalimit) {
        dalimits.push({ name: p.name, dalimit: p.dalimit, position: p.position });
      }
    });

    if (dalimits.length === 0) { bar.style.display = 'none'; return; }

    dalimits.sort(function(a, b) {
      var ma = a.dalimit.match(/(\d+)/);
      var mb = b.dalimit.match(/(\d+)/);
      return (ma ? parseInt(ma[1]) : 0) - (mb ? parseInt(mb[1]) : 0);
    });

    var barHtml = '<span class="dalimit-bar-label">大限</span>';
    dalimits.forEach(function(d, idx) {
      var isCurrent = isCurrentDalimit(d.dalimit);
      var cls = 'dalimit-bar-item' + (isCurrent ? ' current' : '');
      barHtml += '<button class="' + cls + '" data-dalimit-pos="' + d.position + '" data-dalimit-idx="' + idx + '">';
      barHtml += '<span class="dalimit-item-name">' + esc(d.name) + '</span>';
      barHtml += '<span class="dalimit-item-range">' + esc(d.dalimit) + '</span>';
      barHtml += '</button>';
    });
    bar.innerHTML = barHtml;

    bar.querySelectorAll('.dalimit-bar-item').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var pos = parseInt(this.getAttribute('data-dalimit-pos'));
        selectDalimit(pos, chartContainer);
      });
    });
  }

  function selectDalimit(position, chartContainer) {
    var grid = chartContainer.querySelector('.chart-grid') || document.getElementById('chartGrid');
    if (!grid) return;

    grid.querySelectorAll('.chart-cell').forEach(function(cell) {
      cell.classList.remove('dalimit-selected');
    });

    var targetCell = grid.querySelector('[data-position="' + position + '"]');
    if (targetCell) {
      targetCell.classList.add('dalimit-selected');
    }

    drawSanfangLines(position, grid.id);

    var bar = chartContainer.closest('.chart-panel-body')
      ? document.getElementById('chartDalimitBar')
      : document.getElementById('inlineChartDalimitBar');
    if (bar) {
      bar.querySelectorAll('.dalimit-bar-item').forEach(function(btn) {
        btn.classList.remove('active');
      });
      var activeBtn = bar.querySelector('[data-dalimit-pos="' + position + '"]');
      if (activeBtn) activeBtn.classList.add('active');
    }
  }

  function isCurrentDalimit(dalimitStr) {
    if (!dalimitStr) return false;
    var m = dalimitStr.match(/(\d+)[-~](\d+)/);
    if (!m) return false;
    var start = parseInt(m[1]);
    var end = parseInt(m[2]);
    var currentYear = new Date().getFullYear();
    return currentYear >= start && currentYear <= end;
  }

  function findCurrentDalimit() {
    if (!chartData || !chartData.palaces) return null;
    for (var i = 0; i < chartData.palaces.length; i++) {
      var p = chartData.palaces[i];
      if (p.dalimit && isCurrentDalimit(p.dalimit)) {
        return p.name + ' ' + p.dalimit;
      }
    }
    return null;
  }

  function renderChart() {
    var grid = document.getElementById('chartGrid');
    renderChartTo(grid, false);
    bindChartEvents(grid);
  }

  function renderInlineChart() {
    var container = document.getElementById('inlineChartGrid');
    if (!container) return;
    renderChartTo(container, true);
    bindChartEvents(container);
  }

  function rerenderCharts() {
    var grid = document.getElementById('chartGrid');
    if (grid && document.getElementById('chartPanel').classList.contains('open')) {
      renderChart();
    }
    var inlineGrid = document.getElementById('inlineChartGrid');
    if (inlineGrid) {
      renderChartTo(inlineGrid, true);
      bindChartEvents(inlineGrid);
    }
  }

  /* ===== 三方四正SVG连线 ===== */
  function drawSanfangLines(position, containerId) {
    clearSanfangLines();
    if (position < 0 || position > 11) return;

    containerId = containerId || 'chartGrid';
    var svgId = containerId === 'inlineChartGrid' ? 'inlineChartSvgOverlay' : 'chartSvgOverlay';
    var svg = document.getElementById(svgId);
    if (!svg) return;

    var sf = sanfangMap[position];
    if (!sf) return;

    var relatedPositions = [position, sf.sanfang[0], sf.sanfang[1], sf.sizheng];

    var gridEl = document.getElementById(containerId);
    if (!gridEl) return;
    var gridRect = gridEl.getBoundingClientRect();
    var wrapperRect = svg.parentElement.getBoundingClientRect();

    var centers = {};
    gridLayout.forEach(function(item) {
      var cellEl = gridEl.querySelector('[data-position="' + item.pos + '"]');
      if (!cellEl) return;
      var cellRect = cellEl.getBoundingClientRect();
      centers[item.pos] = {
        x: cellRect.left + cellRect.width / 2 - wrapperRect.left,
        y: cellRect.top + cellRect.height / 2 - wrapperRect.top
      };
    });

    svg.setAttribute('viewBox', '0 0 ' + wrapperRect.width + ' ' + wrapperRect.height);
    svg.style.width = wrapperRect.width + 'px';
    svg.style.height = wrapperRect.height + 'px';

    var svgContent = '';

    var c0 = centers[position];
    var c1 = centers[sf.sanfang[0]];
    var c2 = centers[sf.sanfang[1]];
    var cOpp = centers[sf.sizheng];

    if (c0 && cOpp) {
      svgContent += '<line x1="' + c0.x + '" y1="' + c0.y + '" x2="' + cOpp.x + '" y2="' + cOpp.y + '" stroke="' + 'var(--chart-sanfang-line)' + '" stroke-width="2" stroke-dasharray="6,5" />';
    }

    if (c0 && c1 && c2) {
      svgContent += '<polygon points="' + c0.x + ',' + c0.y + ' ' + c1.x + ',' + c1.y + ' ' + c2.x + ',' + c2.y + '" fill="none" stroke="' + 'var(--chart-sanfang-line)' + '" stroke-width="2" stroke-dasharray="6,5" />';
    }

    relatedPositions.forEach(function(pos) {
      var c = centers[pos];
      if (c) {
        svgContent += '<circle cx="' + c.x + '" cy="' + c.y + '" r="5" fill="' + 'var(--chart-sanfang-line)' + '" />';
      }
    });

    svg.innerHTML = svgContent;

    ['chartGrid', 'inlineChartGrid'].forEach(function(gId) {
      var grid = document.getElementById(gId);
      if (!grid) return;
      grid.querySelectorAll('.chart-cell').forEach(function(cell) {
        var pos = parseInt(cell.getAttribute('data-position'));
        if (isNaN(pos)) return;
        if (pos === position) {
          cell.classList.add('selected');
        } else if (relatedPositions.indexOf(pos) >= 0) {
          cell.classList.add('sanfang-related');
        }
      });
    });
  }

  function clearSanfangLines() {
    ['chartSvgOverlay', 'inlineChartSvgOverlay'].forEach(function(id) {
      var svg = document.getElementById(id);
      if (svg) svg.innerHTML = '';
    });
    ['chartGrid', 'inlineChartGrid'].forEach(function(gId) {
      var grid = document.getElementById(gId);
      if (grid) {
        grid.querySelectorAll('.chart-cell').forEach(function(cell) {
          cell.classList.remove('selected', 'sanfang-related');
        });
      }
    });
    selectedPosition = -1;
  }

  /* ===== 宫位点击事件 ===== */
  function bindChartEvents(container) {
    container.addEventListener('click', function(e) {
      var cell = e.target.closest('.chart-cell');
      if (!cell || cell.classList.contains('center-cell')) {
        if (!cell || cell.classList.contains('center-cell')) {
          clearSanfangLines();
        }
        return;
      }
      var pos = parseInt(cell.getAttribute('data-position'));
      if (isNaN(pos)) return;

      if (selectedPosition === pos) {
        clearSanfangLines();
      } else {
        selectedPosition = pos;
        drawSanfangLines(pos, container.id);
      }
    });

    container.addEventListener('mouseenter', function(e) {
      var cell = e.target.closest('.chart-cell');
      if (!cell || cell.classList.contains('center-cell')) return;
      var pos = cell.getAttribute('data-position');
      if (pos === null || !tooltipData[parseInt(pos)]) return;
      showTooltip(cell, tooltipData[parseInt(pos)]);
    }, true);

    container.addEventListener('mouseleave', function(e) {
      var cell = e.target.closest('.chart-cell');
      if (!cell) return;
      hideTooltip();
    }, true);
  }

  /* ===== Tooltip智能定位 ===== */
  var chartTooltip = document.getElementById('chartTooltip');
  var tooltipTimeout = null;

  function showTooltip(cell, content) {
    chartTooltip.innerHTML = content;
    chartTooltip.style.display = 'block';
    chartTooltip.style.left = '-9999px';
    chartTooltip.style.top = '-9999px';

    requestAnimationFrame(function() {
      var cellRect = cell.getBoundingClientRect();
      var ttW = chartTooltip.offsetWidth;
      var ttH = chartTooltip.offsetHeight;
      var spaceAbove = cellRect.top;
      var spaceBelow = window.innerHeight - cellRect.bottom;

      var top, left;
      left = cellRect.left + (cellRect.width - ttW) / 2;

      if (spaceAbove > ttH + 10 || spaceAbove >= spaceBelow) {
        top = cellRect.top - ttH - 8;
      } else {
        top = cellRect.bottom + 8;
      }

      if (left < 8) left = 8;
      if (left + ttW > window.innerWidth - 8) left = window.innerWidth - ttW - 8;
      if (top < 8) top = 8;
      if (top + ttH > window.innerHeight - 8) top = window.innerHeight - ttH - 8;

      chartTooltip.style.left = left + 'px';
      chartTooltip.style.top = top + 'px';
    });
  }

  function hideTooltip() {
    chartTooltip.style.display = 'none';
  }

  /* ===== 缩放控制 ===== */
  var chartZoom = 1;

  function setChartZoom(level) {
    chartZoom = Math.max(0.5, Math.min(2, level));
    var grid = document.getElementById('chartGrid');
    if (grid) grid.style.transform = 'scale(' + chartZoom + ')';
    var display = document.getElementById('chartZoomLevel');
    if (display) display.textContent = Math.round(chartZoom * 100) + '%';
  }

  function chartZoomIn() { setChartZoom(chartZoom + 0.1); }
  function chartZoomOut() { setChartZoom(chartZoom - 0.1); }
  function chartZoomReset() { setChartZoom(1); }

  window.chartZoomIn = chartZoomIn;
  window.chartZoomOut = chartZoomOut;
  window.chartZoomReset = chartZoomReset;

  var chartPanelBody = document.getElementById('chartPanelBody');
  chartPanelBody.addEventListener('wheel', function(e) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      var delta = e.deltaY > 0 ? -0.05 : 0.05;
      setChartZoom(chartZoom + delta);
    }
  }, { passive: false });

  /* ===== 拖拽移动 ===== */
  var isDragging = false;
  var dragOffsetX = 0;
  var dragOffsetY = 0;

  var panelHeader = document.getElementById('chartPanelHeader');
  var panel = document.getElementById('chartPanel');

  function startDrag(clientX, clientY) {
    isDragging = true;
    var rect = panel.getBoundingClientRect();
    dragOffsetX = clientX - rect.left;
    dragOffsetY = clientY - rect.top;
    panel.style.transform = 'none';
    panel.style.left = rect.left + 'px';
    panel.style.top = rect.top + 'px';
    panel.style.cursor = 'move';
  }

  function moveDrag(clientX, clientY) {
    if (!isDragging) return;
    var x = clientX - dragOffsetX;
    var y = clientY - dragOffsetY;
    x = Math.max(0, Math.min(x, window.innerWidth - panel.offsetWidth));
    y = Math.max(0, Math.min(y, window.innerHeight - panel.offsetHeight));
    panel.style.left = x + 'px';
    panel.style.top = y + 'px';
  }

  function endDrag() {
    isDragging = false;
    panel.style.cursor = '';
  }

  panelHeader.addEventListener('mousedown', function(e) {
    if (e.target.closest('.chart-panel-btn') || e.target.closest('.chart-zoom-btn')) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) moveDrag(e.clientX, e.clientY);
  });

  document.addEventListener('mouseup', endDrag);

  panelHeader.addEventListener('touchstart', function(e) {
    if (e.target.closest('.chart-panel-btn') || e.target.closest('.chart-zoom-btn')) return;
    var touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (isDragging && e.touches.length === 1) {
      moveDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  document.addEventListener('touchend', endDrag);

  /* ===== 面板大小调整 ===== */
  var isResizing = false;
  var resizeStartX = 0;
  var resizeStartY = 0;
  var resizeStartW = 0;
  var resizeStartH = 0;

  var resizeHandle = document.getElementById('chartResize');

  resizeHandle.addEventListener('mousedown', function(e) {
    isResizing = true;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    resizeStartW = panel.offsetWidth;
    resizeStartH = panel.offsetHeight;
    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isResizing) return;
    var newW = Math.max(480, resizeStartW + (e.clientX - resizeStartX));
    var newH = Math.max(360, resizeStartH + (e.clientY - resizeStartY));
    panel.style.width = newW + 'px';
    panel.style.maxHeight = newH + 'px';
  });

  document.addEventListener('mouseup', function() {
    isResizing = false;
  });

  /* ===== ESC关闭 ===== */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeChart();
      closeHelp();
    }
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      toggleTheme();
    } else if (e.key === '1') {
      e.preventDefault();
      switchSystem('iztro');
    } else if (e.key === '2') {
      e.preventDefault();
      switchSystem('nishi');
    } else if (e.key === '3') {
      e.preventDefault();
      switchSystem('combined');
    } else if (e.key === '?' || (e.shiftKey && e.key === '/')) {
      e.preventDefault();
      toggleHelp();
    }
  });

  /* ===== 帮助面板 ===== */
  function toggleHelp() {
    var panel = document.getElementById('helpPanel');
    var overlay = document.getElementById('helpOverlay');
    if (panel.classList.contains('open')) {
      closeHelp();
    } else {
      panel.classList.add('open');
      overlay.classList.add('open');
    }
  }

  function closeHelp() {
    var panel = document.getElementById('helpPanel');
    var overlay = document.getElementById('helpOverlay');
    panel.classList.remove('open');
    overlay.classList.remove('open');
  }

  window.toggleHelp = toggleHelp;
  window.closeHelp = closeHelp;

  /* ===== 工具函数 ===== */
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ===== 初始化内嵌排盘图 ===== */
  renderInlineChart();
})();
`;
}

module.exports = { getInteractionScript };
