const fs = require('fs');
const path = require('path');

// 허용된 작업명 목록
const ALLOWED_TASKS = ['창틀코킹', '창틀누수', '빗물누수', '창틀실리콘', '샷시실리콘', '외벽보수'];

// 기본 메인페이지 메타 정보
const DEFAULT_META = {
  title: '서울·경기 빗물누수·창틀코킹 전문 진단 | 레인가드',
  description: '서울·경기 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다. 레인가드 전문 진단팀.',
  canonical: '/',
};

/**
 * ?k=지역명-작업명 파라미터를 파싱하여 region, task 반환
 * 유효하지 않으면 null 반환
 */
function parseKeyword(k) {
  if (!k) return null;
  const decoded = decodeURIComponent(k).trim();
  const parts = decoded.split('-');

  if (parts.length >= 2) {
    const region = parts[0].trim();
    const task = parts.slice(1).join('-').trim(); // 혹시 하이픈이 여럿인 경우 대비
    if (region && ALLOWED_TASKS.includes(task)) {
      return { region, task };
    }
  } else if (parts.length === 1) {
    const task = parts[0].trim();
    if (ALLOWED_TASKS.includes(task)) {
      return { region: '서울·경기', task };
    }
  }
  return null;
}

/**
 * 동적 페이지의 고유 메타 정보 생성
 */
function buildDynamicMeta(region, task, rawK) {
  const regionTask = `${region} ${task}`;
  const title = `${regionTask} | 창틀·샷시·외벽 누수 진단 레인가드`;
  const description = `${regionTask}, 비 온 뒤 창틀 주변 물기·실리콘 갈라짐·외벽 균열이 보인다면 유입 경로와 현장 상태를 함께 확인해 보수 방향을 안내합니다.`;
  // canonical은 원본 k 파라미터 기반 (인코딩된 형태 유지)
  const canonical = `/?k=${encodeURIComponent(rawK)}`;

  return { title, description, canonical, regionTask, region, task };
}

module.exports = (req, res) => {
  const htmlPath = path.join(process.cwd(), 'template.html');

  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    const rawK = req.query.k || '';
    const parsed = parseKeyword(rawK);

    if (parsed) {
      // ── 동적 페이지: 고유 SEO 메타 주입 ──────────────────────────
      const meta = buildDynamicMeta(parsed.region, parsed.task, rawK);

      // 1. <title>
      html = html.replace(
        /<title>[\s\S]*?<\/title>/,
        `<title>${meta.title}</title>`
      );

      // 2. <meta name="description">
      html = html.replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${meta.description}"`
      );

      // 3. OG title & description
      html = html.replace(
        /<meta property="og:title" content="[^"]*"/,
        `<meta property="og:title" content="${meta.title}"`
      );
      html = html.replace(
        /<meta property="og:description" content="[^"]*"/,
        `<meta property="og:description" content="${meta.description}"`
      );

      // 4. canonical & og:url  →  동적 URL로 교체
      html = html.replace(/CANONICAL_PLACEHOLDER/g, meta.canonical);

      // 5. H1
      const h1Content = `<span class="h1-region">${meta.region}</span> <span class="h1-task">${meta.task}</span> <span class="h1-suffix">전문 진단</span>`;
      html = html.replace(
        /(<h1[^>]*data-keyword="region-task-h1"[^>]*>)[\s\S]*?(<\/h1>)/,
        `$1${h1Content}$2`
      );

      // 6. Portfolio section title
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-portfolio"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${meta.regionTask} 시공 사례$2`
      );

      // 7. FAQ 1 & 3
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-faq1"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${meta.regionTask}, 비 올 때만 새는데 바로 점검이 필요한가요?$2`
      );
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-faq3"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${meta.regionTask} 재시공, 코킹했는데 다시 새는 이유는 뭔가요?$2`
      );

      // 8. Contact section title (PC)
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-contact-pc"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${meta.regionTask} 상담, 원인부터 확인하세요$2`
      );

    } else {
      // ── 기본 메인페이지: canonical = "/" 주입 ─────────────────────
      html = html.replace(/CANONICAL_PLACEHOLDER/g, DEFAULT_META.canonical);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });
};
