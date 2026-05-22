#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8'
};

function parseArgs(argv) {
  var args = argv.slice(2);
  var opts = {
    port: 8080,
    file: null,
    watch: false
  };

  for (var i = 0; i < args.length; i++) {
    if (args[i] === '--port' && i + 1 < args.length) {
      opts.port = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === '--file' && i + 1 < args.length) {
      opts.file = path.resolve(args[i + 1]);
      i++;
    } else if (args[i] === '--watch') {
      opts.watch = true;
    }
  }

  return opts;
}

function findLatestHtml(outputDir) {
  if (!fs.existsSync(outputDir)) {
    return null;
  }

  var entries = fs.readdirSync(outputDir);
  var htmlFiles = [];

  entries.forEach(function(entry) {
    var entryPath = path.join(outputDir, entry);
    var stat = fs.statSync(entryPath);
    if (stat.isDirectory()) {
      var files = fs.readdirSync(entryPath);
      files.forEach(function(f) {
        if (f.endsWith('.html')) {
          var fp = path.join(entryPath, f);
          var fstat = fs.statSync(fp);
          htmlFiles.push({ path: fp, mtime: fstat.mtimeMs });
        }
      });
    } else if (entry.endsWith('.html')) {
      htmlFiles.push({ path: entryPath, mtime: stat.mtimeMs });
    }
  });

  if (htmlFiles.length === 0) return null;

  htmlFiles.sort(function(a, b) { return b.mtime - a.mtime; });
  return htmlFiles[0].path;
}

function resolvePreviewFile(opts, outputDir) {
  if (!opts.file) {
    var htmlPath = findLatestHtml(outputDir);
    if (!htmlPath) {
      console.error('错误: ziwei-output/ 目录下未找到 HTML 文件');
      process.exit(1);
    }
    console.log('自动发现最新 HTML: ' + htmlPath);
    return { htmlPath: htmlPath, mdPath: null, serveDir: path.dirname(htmlPath) };
  }

  if (!fs.existsSync(opts.file)) {
    console.error('错误: 文件不存在: ' + opts.file);
    process.exit(1);
  }

  if (opts.file.endsWith('.md')) {
    var mdPath = opts.file;
    var htmlPath = mdPath.replace(/\.md$/, '.html');
    convertMdToHtml(mdPath, htmlPath);
    return { htmlPath: htmlPath, mdPath: mdPath, serveDir: path.dirname(htmlPath) };
  }

  if (opts.file.endsWith('.html')) {
    return { htmlPath: opts.file, mdPath: null, serveDir: path.dirname(opts.file) };
  }

  console.error('错误: 不支持的文件类型，请指定 .md 或 .html 文件');
  process.exit(1);
}

function convertMdToHtml(mdPath, htmlPath) {
  var md2htmlScript = path.join(__dirname, 'md2html.js');
  if (!fs.existsSync(md2htmlScript)) {
    console.error('错误: 未找到 md2html.js 脚本: ' + md2htmlScript);
    process.exit(1);
  }

  try {
    execSync('node "' + md2htmlScript + '" "' + mdPath + '" "' + htmlPath + '"', {
      stdio: 'inherit',
      encoding: 'utf-8'
    });
  } catch (e) {
    console.error('MD 转 HTML 失败: ' + e.message);
    process.exit(1);
  }
}

function isPathSafe(requestPath, serveDir) {
  var resolved = path.resolve(serveDir, requestPath);
  return resolved.startsWith(serveDir + path.sep) || resolved === serveDir;
}

function createServer(serveDir, htmlPath, opts) {
  var server = http.createServer(function(req, res) {
    var urlPath = req.url.split('?')[0];

    if (urlPath === '/') {
      var relativeHtml = path.relative(serveDir, htmlPath);
      res.writeHead(302, { Location: '/' + relativeHtml.replace(/\\/g, '/') });
      res.end();
      return;
    }

    var decodedPath = decodeURIComponent(urlPath);
    decodedPath = decodedPath.replace(/\.\./g, '');

    if (!isPathSafe(decodedPath, serveDir)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('403 Forbidden');
      return;
    }

    var filePath = path.join(serveDir, decodedPath);

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      var indexPath = path.join(filePath, 'index.html');
      if (fs.existsSync(indexPath)) {
        filePath = indexPath;
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }
    }

    var ext = path.extname(filePath).toLowerCase();
    var contentType = MIME_TYPES[ext] || 'application/octet-stream';

    try {
      var data = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(data);
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('500 Internal Server Error');
    }
  });

  return server;
}

function startWatchMode(mdPath, htmlPath, server, opts) {
  if (!mdPath) {
    mdPath = htmlPath.replace(/\.html$/, '.md');
  }

  if (!fs.existsSync(mdPath)) {
    console.error('警告: 未找到 MD 文件用于监听: ' + mdPath);
    return;
  }

  var lastMtime = fs.statSync(mdPath).mtimeMs;
  var debounceTimer = null;

  console.log('监听文件变化: ' + mdPath);

  fs.watch(mdPath, function(eventType) {
    if (eventType !== 'change') return;

    if (debounceTimer) clearTimeout(debounceTimer);

    debounceTimer = setTimeout(function() {
      try {
        var stat = fs.statSync(mdPath);
        if (stat.mtimeMs === lastMtime) return;
        lastMtime = stat.mtimeMs;
      } catch (e) {
        return;
      }

      console.log('检测到文件变化，重新生成 HTML...');
      try {
        convertMdToHtml(mdPath, htmlPath);
        console.log('HTML 已更新，浏览器将自动刷新');
      } catch (e) {
        console.error('重新生成 HTML 失败: ' + e.message);
      }
    }, 300);
  });
}

function main() {
  var opts = parseArgs(process.argv);
  var outputDir = path.join(__dirname, '..', '..', '..', 'ziwei-output');

  var resolved = resolvePreviewFile(opts, outputDir);

  var server = createServer(resolved.serveDir, resolved.htmlPath, opts);

  server.listen(opts.port, function() {
    var relativeHtml = path.relative(resolved.serveDir, resolved.htmlPath);
    var url = 'http://localhost:' + opts.port + '/' + relativeHtml.replace(/\\/g, '/');

    console.log('');
    console.log('紫微斗数报告预览服务器已启动');
    console.log('  地址: ' + url);
    console.log('  目录: ' + resolved.serveDir);

    if (opts.watch) {
      console.log('  监听: 已启用（文件变化时自动刷新）');
    }

    console.log('');
    console.log('按 Ctrl+C 停止服务器');
    console.log('');
  });

  server.on('error', function(e) {
    if (e.code === 'EADDRINUSE') {
      console.error('错误: 端口 ' + opts.port + ' 已被占用，请使用 --port 指定其他端口');
      process.exit(1);
    } else {
      console.error('服务器错误: ' + e.message);
      process.exit(1);
    }
  });

  if (opts.watch) {
    startWatchMode(resolved.mdPath, resolved.htmlPath, server, opts);
  }
}

main();
