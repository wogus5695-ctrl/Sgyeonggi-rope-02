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

const ALLOWED_TASKS = ['창틀코킹', '창틀누수', '빗물누수', '창틀실리콘', '샷시실리콘', '외벽보수'];

function getTaskContent(task, regionTask) {
  switch (task) {
    case '창틀코킹':
      return {
        ogImage: 'og-window.jpg',
        hero: `${regionTask}, 기존 실리콘 상태와 접착면을 확인한 뒤 코킹 보수 방향을 안내합니다.`,
        reLeakBox: `창틀코킹 보수 시 기존 실리콘의 들뜸과 접착면 상태를 먼저 확인하는 것이 중요합니다.`,
        processDesc: `기존 실리콘 상태 확인 → 들뜸·경화 판단 → 덧방 또는 부분 제거 → 재코킹 → 마감 검수 순서로 진행합니다.`,
        faq1Answer: `비가 온 뒤 창틀 하부에 물기가 남고 기존 실리콘이 들뜨거나 갈라졌다면 확인이 필요할 수 있습니다. 겉면에 덧바르기보다 접착면 상태를 먼저 확인하는 것이 좋습니다.`,
      };
    case '창틀누수':
      return {
        ogImage: 'og-waterproof.jpg',
        hero: `${regionTask}, 실내에 보이는 물기와 실제 유입 지점을 외벽·샷시 접합부까지 함께 확인합니다.`,
        reLeakBox: `창틀누수는 실내 물기 위치와 실제 유입 지점이 다를 수 있어 외벽과 샷시 접합부를 함께 확인합니다.`,
        processDesc: `증상 위치 확인 → 외벽·샷시 유입 경로 점검 → 실리콘 상태 확인 → 보수 범위 판단 → 마감 검수 순서로 진행합니다.`,
        faq1Answer: `비가 온 뒤 창틀 하부나 벽지 주변에 물기가 남는다면 점검이 필요할 수 있습니다. 실내 물기 위치와 실제 유입 지점이 다를 수 있어 외벽·샷시 접합부도 함께 확인합니다.`,
      };
    case '빗물누수':
      return {
        ogImage: 'og-waterproof.jpg',
        hero: `${regionTask}, 비 올 때마다 반복되는 원인을 외벽·샷시·창틀 전체에서 확인합니다.`,
        reLeakBox: `빗물누수는 외벽 균열, 샷시 접합부, 창틀 상부 등 복합 원인이 함께 있는 경우가 많습니다.`,
        processDesc: `반복 구간 및 시점 확인 → 외벽·샷시·창틀 복합 점검 → 원인 범위 확인 → 상태별 보수 → 마감 검수 순서로 진행합니다.`,
        faq1Answer: `비가 올 때마다 반복된다면 단순 실리콘 문제가 아닐 수 있습니다. 외벽 균열, 샷시 접합부, 창틀 상부 등 복합 원인을 함께 확인하는 것이 좋습니다.`,
      };
    case '창틀실리콘':
      return {
        ogImage: 'og-window.jpg',
        hero: `${regionTask}, 기존 실리콘의 경화와 들뜸 상태를 확인한 뒤 보수 방식을 정하는 것이 좋습니다.`,
        reLeakBox: `창틀실리콘 보수 시 겉면만 확인하기보다 기존 실리콘의 경화와 들뜸 상태를 먼저 점검합니다.`,
        processDesc: `기존 실리콘 경화·들뜸 확인 → 접착면 상태 판단 → 부분 제거 또는 재시공 선택 → 재코킹 → 마감 검수 순서로 진행합니다.`,
        faq1Answer: `비가 온 뒤 창틀 주변 물기가 남는다면 기존 실리콘의 경화나 들뜸 여부를 먼저 확인하는 것이 좋습니다. 겉면에 덧바르기보다 접착 상태를 먼저 점검합니다.`,
      };
    case '샷시실리콘':
      return {
        ogImage: 'og-window.jpg',
        hero: `${regionTask}, 프레임 접합부와 외부 실리콘 틈으로 빗물이 스며들 수 있어 접합부 확인이 필요합니다.`,
        reLeakBox: `샷시실리콘은 프레임 접합부와 외부 틈으로 빗물이 스며들 수 있어 접합부 상태 확인이 필요합니다.`,
        processDesc: `샷시 접합부 상태 확인 → 프레임 틈 점검 → 외부 실리콘 상태 판단 → 접합면 재보수 → 마감 검수 순서로 진행합니다.`,
        faq1Answer: `비가 온 뒤 창틀 주변이 젖는다면 샷시 접합부와 프레임 틈 실리콘 상태를 확인하는 것이 좋습니다. 외부 실리콘 틈으로 빗물이 스며드는 경우가 있습니다.`,
      };
    case '외벽보수':
      return {
        ogImage: 'og-wall.jpg',
        hero: `${regionTask}, 외벽 균열·줄눈 틈·마감 손상 여부를 함께 확인합니다.`,
        reLeakBox: `외벽보수 시 창틀 주변만 보는 것이 아니라 균열·줄눈 틈·마감 손상 여부를 함께 확인합니다.`,
        processDesc: `외벽 균열·크랙 위치 확인 → 줄눈 틈·마감 손상 점검 → 보수 범위 판단 → 상태별 보수 → 마감 검수 순서로 진행합니다.`,
        faq1Answer: `비가 온 뒤 외벽이나 창틀 주변에 물기 흔적이 보인다면 균열·줄눈 틈·마감 손상 여부를 함께 확인하는 것이 좋습니다. 외벽에서 시작된 물길이 실내 벽지까지 이어지는 경우가 있습니다.`,
      };
    default:
      return {
        ogImage: 'og-thumbnail.png',
        hero: `${regionTask}, 겉면보다 유입 지점부터 확인합니다.`,
        reLeakBox: `${regionTask}도 보이는 흔적과 실제 유입 지점이 다를 수 있어, 원인 범위를 함께 확인합니다.`,
        processDesc: `증상 확인 → 외벽·샷시 점검 → 기존 실리콘 확인 → 상태별 보수 → 마감 검수 순서로 진행합니다.`,
        faq1Answer: `비가 온 뒤 창틀 하부나 벽지 주변에 물기가 남고, 외부 실리콘이 갈라졌다면 점검이 필요할 수 있습니다. 창틀뿐 아니라 외벽 균열과 샷시 접합부까지 함께 확인하는 것이 좋습니다.`,
      };
  }
}

function getPortfolioAlts(task, regionTask) {
  const baseMap = {
    '외벽보수': [
      { before: '외벽 균열 보수 전 사진', after: '외벽 균열 보수 후 사진' },
      { before: '창틀 실리콘 재시공 전 사진', after: '창틀 실리콘 재시공 후 사진' },
      { before: '외벽 크랙 보수 전 사진', after: '외벽 크랙 보수 후 사진' },
    ],
    '빗물누수': [
      { before: '외벽 누수 보수 전 사진', after: '외벽 누수 보수 후 사진' },
      { before: '창틀 주변 누수 보수 전 사진', after: '창틀 주변 누수 보수 후 사진' },
      { before: '외벽 크랙 보수 전 사진', after: '외벽 크랙 보수 후 사진' },
    ],
    '창틀코킹': [
      { before: '창틀 주변 코킹 보수 전 사진', after: '창틀 주변 코킹 보수 후 사진' },
      { before: '창틀 실리콘 재시공 전 사진', after: '창틀 실리콘 재시공 후 사진' },
      { before: '외벽 균열 보수 전 사진', after: '외벽 균열 보수 후 사진' },
    ],
    '창틀누수': [
      { before: '창틀 하부 누수 보수 전 사진', after: '창틀 하부 누수 보수 후 사진' },
      { before: '샷시 접합부 보수 전 사진', after: '샷시 접합부 보수 후 사진' },
      { before: '외벽 누수 보수 전 사진', after: '외벽 누수 보수 후 사진' },
    ],
    '창틀실리콘': [
      { before: '창틀 실리콘 재시공 전 사진', after: '창틀 실리콘 재시공 후 사진' },
      { before: '창틀 코킹 보수 전 사진', after: '창틀 코킹 보수 후 사진' },
      { before: '외벽 균열 보수 전 사진', after: '외벽 균열 보수 후 사진' },
    ],
    '샷시실리콘': [
      { before: '샷시 접합부 보수 전 사진', after: '샷시 접합부 보수 후 사진' },
      { before: '창틀 실리콘 재시공 전 사진', after: '창틀 실리콘 재시공 후 사진' },
      { before: '외벽 균열 보수 전 사진', after: '외벽 균열 보수 후 사진' },
    ],
  };
  const alts = baseMap[task] || [
    { before: '외벽 균열 보수 시공 전 사진', after: '외벽 균열 보수 시공 후 사진' },
    { before: '창틀 실리콘 재시공 전 사진', after: '창틀 실리콘 재시공 후 사진' },
    { before: '샷시 접합부 보수 시공 전 사진', after: '샷시 접합부 보수 시공 후 사진' },
  ];
  const prefix = regionTask ? `${regionTask} 상담 사례 ` : '';
  return {
    before1: prefix + alts[0].before,
    after1:  prefix + alts[0].after,
    before2: alts[1].before,
    after2:  alts[1].after,
    before3: alts[2].before,
    after3:  alts[2].after,
  };
}

function reorderPortfolioHTML(html, task) {
  const gridMatch = html.match(/(<div class="portfolio-grid" id="portfolio-grid">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/m);
  if (!gridMatch) return html;

  const gridInner = gridMatch[2];
  const cardParts = gridInner.split(/(?=<!-- Card \d)/);
  const cards = [];
  
  for (const part of cardParts) {
    if (!part.trim().startsWith('<!-- Card')) continue;
    const tagsMatch = part.match(/data-portfolio-tags="([^"]+)"/);
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [];
    const relevant = tags.includes(task);
    cards.push({ html: part, relevant });
  }

  if (cards.length !== 3) return html;

  const sorted = [
    ...cards.filter(c => c.relevant),
    ...cards.filter(c => !c.relevant),
  ];
  const newInner = '\n        ' + sorted.map(c => c.html.trim()).join('\n\n        ') + '\n      ';
  return html.replace(gridInner, newInner);
}

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
        let kValue = '';
        if (req.url.includes('?')) {
          try {
            const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
            kValue = urlObj.searchParams.get('k') || '';
          } catch (e) {}
        }

        let region = '';
        let task = '';
        let isDynamic = false;

        if (kValue) {
          const decoded = decodeURIComponent(kValue).trim();
          const parts = decoded.split('-');
          if (parts.length >= 2) {
            const r = parts[0].trim();
            const t = parts.slice(1).join('-').trim();
            if (r && ALLOWED_TASKS.includes(t)) {
              region = r;
              task = t;
              isDynamic = true;
            }
          } else if (parts.length === 1) {
            const t = parts[0].trim();
            if (ALLOWED_TASKS.includes(t)) {
              region = '서울·경기';
              task = t;
              isDynamic = true;
            }
          }
        }

        if (isDynamic) {
          const regionTask = `${region} ${task}`;
          const content = getTaskContent(task, regionTask);

          // 1. <title>
          const titleText = `${regionTask} | 창틀·샷시·외벽 누수 진단 올케어`;
          html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleText}</title>`);

          // 2. <meta name="description">
          const descText = `${regionTask}, 비 온 뒤 창틀 주변 물기·실리콘 갈라짐·외벽 균열이 보인다면 유입 경로와 현장 상태를 함께 확인해 보수 방향을 안내합니다.`;
          html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${descText}"`);

          // ── 7. Canonical & OG URL & OG Image ─────────────────────────
          html = html.replace(
            /<link rel="canonical" href="[^"]*">/,
            `<link rel="canonical" href="https://www.rainguard.co.kr/?k=${encodeURIComponent(kValue)}">`
          );
          html = html.replace(
            /<meta property="og:url" content="[^"]*">/,
            `<meta property="og:url" content="https://www.rainguard.co.kr/?k=${encodeURIComponent(kValue)}">`
          );
          
          const ogImageUrl = `https://www.rainguard.co.kr/images/${content.ogImage}?v=2`;
          html = html.replace(
            /<meta property="og:image" data-keyword="region-task-og-image" content="[^"]*">/,
            `<meta property="og:image" data-keyword="region-task-og-image" content="${ogImageUrl}">`
          );

          // 3. OG title & description
          html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${titleText}"`);
          html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${descText}"`);

          // 5. H1
          const h1Content = `<span class="h1-region">${region}</span> <span class="h1-task">${task}</span> <span class="h1-suffix">전문 진단</span>`;
          html = html.replace(/(<h1[^>]*data-keyword="region-task-h1"[^>]*>)[\s\S]*?(<\/h1>)/, `$1${h1Content}$2`);

          // 6. Hero 강조문 (PC) — 작업명별
          html = html.replace(
            /(<span[^>]*data-keyword="region-task-hero-highlight"[^>]*>)[\s\S]*?(<\/span>)/,
            `$1${content.hero}$2`
          );

          // 7. 위험신호 하단 경고 (PC)
          html = html.replace(
            /(<p[^>]*data-keyword="region-task-symptom-warning"[^>]*>)[\s\S]*?(<\/p>)/,
            `$12가지 이상 해당된다면 창틀·샷시·외벽 주변 상태를 함께 확인하는 것이 좋습니다.$2`
          );

          // 8. LEAK CAUSE MAP 강조 박스 — 작업명별
          html = html.replace(
            /(<p[^>]*data-keyword="region-task-releak-box"[^>]*>)[\s\S]*?(<\/p>)/,
            `$1${content.reLeakBox}$2`
          );

          // 9. PROCESS 섹션 설명 — 작업명별
          html = html.replace(
            /(<p[^>]*data-keyword="region-task-process-desc"[^>]*>)[\s\S]*?(<\/p>)/,
            `$1${content.processDesc}$2`
          );

          // 10. Portfolio title
          html = html.replace(/(<h2[^>]*data-keyword="region-task-portfolio"[^>]*>)[\s\S]*?(<\/h2>)/, `$1${regionTask} 시공 사례$2`);

          // 10a. Portfolio 카드 순서 재배치
          html = reorderPortfolioHTML(html, task);

          // 10b. Portfolio 이미지 alt 교체
          const alts = getPortfolioAlts(task, regionTask);
          html = html.replace(/alt="BEFORE_ALT_1"/g, `alt="${alts.before1}"`);
          html = html.replace(/alt="AFTER_ALT_1"/g, `alt="${alts.after1}"`);
          html = html.replace(/alt="BEFORE_ALT_2"/g, `alt="${alts.before2}"`);
          html = html.replace(/alt="AFTER_ALT_2"/g, `alt="${alts.after2}"`);
          html = html.replace(/alt="BEFORE_ALT_3"/g, `alt="${alts.before3}"`);
          html = html.replace(/alt="AFTER_ALT_3"/g, `alt="${alts.after3}"`);

          // 11. FAQ 1 질문
          html = html.replace(
            /(<span[^>]*data-keyword="region-task-faq1"[^>]*>)[\s\S]*?(<\/span>)/,
            `$1${regionTask}, 언제 점검이 필요할까요?$2`
          );

          // 12. FAQ 1 답변 — 작업명별
          html = html.replace(
            /(<div[^>]*data-keyword="region-task-faq1-answer"[^>]*>)[\s\S]*?(<\/div>)/,
            `$1\n                ${content.faq1Answer}\n              $2`
          );

          // 13. FAQ 3 질문
          html = html.replace(/(<span[^>]*data-keyword="region-task-faq3"[^>]*>)[\s\S]*?(<\/span>)/, `$1${regionTask} 재시공, 코킹했는데 다시 새는 이유는 뭔가요?$2`);

          // 14. Contact CTA 제목 (PC)
          html = html.replace(/(<h2[^>]*data-keyword="region-task-contact-pc"[^>]*>)[\s\S]*?(<\/h2>)/, `$1${regionTask} 상담, 원인부터 확인하세요$2`);

        } else {
          html = html.replace(/CANONICAL_PLACEHOLDER/g, 'https://www.rainguard.co.kr/');
          
          const defaultAlts = getPortfolioAlts('기본', '');
          html = html.replace(/alt="BEFORE_ALT_1"/g, `alt="${defaultAlts.before1}"`);
          html = html.replace(/alt="AFTER_ALT_1"/g, `alt="${defaultAlts.after1}"`);
          html = html.replace(/alt="BEFORE_ALT_2"/g, `alt="${defaultAlts.before2}"`);
          html = html.replace(/alt="AFTER_ALT_2"/g, `alt="${defaultAlts.after2}"`);
          html = html.replace(/alt="BEFORE_ALT_3"/g, `alt="${defaultAlts.before3}"`);
          html = html.replace(/alt="AFTER_ALT_3"/g, `alt="${defaultAlts.after3}"`);
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
