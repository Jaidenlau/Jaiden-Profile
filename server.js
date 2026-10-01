// Zero-dependency static server. Railway injects PORT; nothing else to configure.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = path.join(__dirname, 'public');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const BASE_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// LinkedIn's preview crawler needs absolute og:image / og:url values. Rather
// than hard-coding a domain, HTML files carry %ORIGIN% and it is filled in per
// request. Set SITE_URL once you have a custom domain to pin it.
function originOf(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const proto = (req.headers['x-forwarded-proto'] || 'http').split(',')[0].trim();
  return `${proto}://${req.headers.host || `localhost:${PORT}`}`;
}

function resolve(urlPath) {
  let target = path.normalize(path.join(ROOT, urlPath));
  if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null;
  if (urlPath.endsWith('/')) target = path.join(target, 'index.html');
  // Pretty URLs: /about -> /about.html
  if (!path.extname(target) && fs.existsSync(target + '.html')) target += '.html';
  return target;
}

function sendHtml(req, res, status, file) {
  fs.readFile(file, 'utf8', (err, html) => {
    if (err) {
      res.writeHead(500, { ...BASE_HEADERS, 'Content-Type': 'text/plain' });
      return res.end('Server error');
    }
    res.writeHead(status, { ...BASE_HEADERS, 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-cache' });
    res.end(html.replaceAll('%ORIGIN%', originOf(req)));
  });
}

// Range support matters for video: Safari will not play an <video> whose
// server ignores Range requests.
function sendFile(req, res, file, stat) {
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const headers = {
    ...BASE_HEADERS,
    'Content-Type': type,
    'Cache-Control': 'public, max-age=3600',
    'Accept-Ranges': 'bytes',
  };
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range && (range[1] || range[2])) {
    let start = range[1] ? Number(range[1]) : stat.size - Number(range[2]);
    let end = range[1] && range[2] ? Number(range[2]) : stat.size - 1;
    start = Math.max(0, start);
    end = Math.min(end, stat.size - 1);
    if (start > end) {
      res.writeHead(416, { ...headers, 'Content-Range': `bytes */${stat.size}` });
      return res.end();
    }
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Content-Length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { ...headers, 'Content-Length': stat.size });
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { ...BASE_HEADERS, Allow: 'GET, HEAD' });
    return res.end();
  }

  let urlPath;
  try {
    urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  } catch {
    urlPath = '/__bad__';
  }

  const file = resolve(urlPath);
  if (!file) {
    res.writeHead(403, { ...BASE_HEADERS, 'Content-Type': 'text/plain' });
    return res.end('Forbidden');
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) return sendHtml(req, res, 404, path.join(ROOT, '404.html'));
    if (file.endsWith('.html')) return sendHtml(req, res, 200, file);
    sendFile(req, res, file, stat);
  });
});

server.listen(PORT, () => console.log(`Jaiden profile listening on :${PORT}`));
