const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BASE_DIR = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  if (urlPath === '/') urlPath = '/index.html';

  const diskPath = urlPath === '/index.html' ? '/template.html' : urlPath;
  const filePath = path.join(BASE_DIR, diskPath);

  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    fs.readFile(filePath, ext === '.html' ? 'utf8' : null, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
        return;
      }

      if (urlPath === '/index.html') {
        let html = data;
        let rawK = '';
        if (req.url.includes('?')) {
          try {
            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            rawK = urlObj.searchParams.get('k') || '';
          } catch (e) {}
        }

        const allowedTasks = ['창틀코킹', '창틀누수', '빗물누수', '창틀실리콘', '샷시실리콘', '외벽보수'];
        let region = '';
        let task = '';
        let isDynamic = false;

        if (rawK) {
          const decoded = decodeURIComponent(rawK).trim();
          const parts = decoded.split('-');
          if (parts.length >= 2) {
            const r = parts[0].trim();
            const t = parts.slice(1).join('-').trim();
            if (r && allowedTasks.includes(t)) {
              region = r;
              task = t;
              isDynamic = true;
            }
          } else if (parts.length === 1) {
            const t = parts[0].trim();
            if (allowedTasks.includes(t)) {
              region = '서울·경기';
              task = t;
              isDynamic = true;
            }
          }
        }

        if (isDynamic) {
          const regionTask = `${region} ${task}`;
          const canonical = `/?k=${encodeURIComponent(rawK)}`;

          // 1. <title>
          const titleText = `${regionTask} | 창틀·샷시·외벽 누수 진단 레인가드`;
          html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleText}</title>`);

          // 2. <meta name="description">
          const descText = `${regionTask}, 비 온 뒤 창틀 주변 물기·실리콘 갈라짐·외벽 균열이 보인다면 유입 경로와 현장 상태를 함께 확인해 보수 방향을 안내합니다.`;
          html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${descText}"`);

          // 3. OG title & description
          html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${titleText}"`);
          html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${descText}"`);

          // 4. canonical & og:url → 동적 URL
          html = html.replace(/CANONICAL_PLACEHOLDER/g, canonical);

          // 5. H1
          const h1Content = `<span class="h1-region">${region}</span> <span class="h1-task">${task}</span> <span class="h1-suffix">전문 진단</span>`;
          html = html.replace(/(<h1[^>]*data-keyword="region-task-h1"[^>]*>)[\s\S]*?(<\/h1>)/, `$1${h1Content}$2`);

          // 6. Portfolio title
          html = html.replace(/(<h2[^>]*data-keyword="region-task-portfolio"[^>]*>)[\s\S]*?(<\/h2>)/, `$1${regionTask} 시공 사례$2`);

          // 7. FAQ 1 & 3
          html = html.replace(/(<span[^>]*data-keyword="region-task-faq1"[^>]*>)[\s\S]*?(<\/span>)/, `$1${regionTask}, 비 올 때만 새는데 바로 점검이 필요한가요?$2`);
          html = html.replace(/(<span[^>]*data-keyword="region-task-faq3"[^>]*>)[\s\S]*?(<\/span>)/, `$1${regionTask} 재시공, 코킹했는데 다시 새는 이유는 뭔가요?$2`);

          // 8. Contact title (PC)
          html = html.replace(/(<h2[^>]*data-keyword="region-task-contact-pc"[^>]*>)[\s\S]*?(<\/h2>)/, `$1${regionTask} 상담, 원인부터 확인하세요$2`);

        } else {
          // 기본 메인페이지: canonical = "/"
          html = html.replace(/CANONICAL_PLACEHOLDER/g, '/');
        }

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(html);
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`서버가 시작되었습니다!`);
  console.log(`크롬에서 아래 주소로 접속하세요:`);
  console.log(`>>> http://localhost:${PORT} <<<`);
  console.log(`종료하려면 Ctrl+C 를 누르세요.`);
});
