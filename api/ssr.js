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
    const task = parts.slice(1).join('-').trim();
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
      const meta = buildDynamicMeta(parsed.region, parsed.task, rawK);
      const { region, task, regionTask } = meta;

      // ── 1. <title> ───────────────────────────────────────────────
      html = html.replace(
        /<title>[\s\S]*?<\/title>/,
        `<title>${meta.title}</title>`
      );

      // ── 2. <meta name="description"> ─────────────────────────────
      html = html.replace(
        /<meta name="description" content="[^"]*"/,
        `<meta name="description" content="${meta.description}"`
      );

      // ── 3. OG title & description ─────────────────────────────────
      html = html.replace(
        /<meta property="og:title" content="[^"]*"/,
        `<meta property="og:title" content="${meta.title}"`
      );
      html = html.replace(
        /<meta property="og:description" content="[^"]*"/,
        `<meta property="og:description" content="${meta.description}"`
      );

      // ── 4. canonical & og:url ─────────────────────────────────────
      html = html.replace(/CANONICAL_PLACEHOLDER/g, meta.canonical);

      // ── 5. H1 ─────────────────────────────────────────────────────
      const h1Content = `<span class="h1-region">${region}</span> <span class="h1-task">${task}</span> <span class="h1-suffix">전문 진단</span>`;
      html = html.replace(
        /(<h1[^>]*data-keyword="region-task-h1"[^>]*>)[\s\S]*?(<\/h1>)/,
        `$1${h1Content}$2`
      );

      // ── 6. Hero 강조문 (PC) ───────────────────────────────────────
      // "{지역명+작업명}, 겉면보다 유입 지점부터 확인합니다."
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-hero-highlight"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${regionTask}, 겉면보다 유입 지점부터 확인합니다.$2`
      );

      // ── 7. 위험신호 섹션 하단 경고 (PC) ──────────────────────────
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-symptom-warning"[^>]*>)[\s\S]*?(<\/p>)/,
        `$12가지 이상 해당된다면 창틀·샷시·외벽 주변 상태를 함께 확인하는 것이 좋습니다.$2`
      );
      // 이 섹션은 기본 문구를 그대로 유지 (지역명 삽입 없이 자연스러움 우선)
      // 아래 위험신호 박스 텍스트는 디자인상 짧게 유지

      // ── 8. LEAK CAUSE MAP 강조 박스 ──────────────────────────────
      // "{지역명+작업명}도 보이는 흔적과 실제 유입 지점이 다를 수 있습니다."
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-releak-box"[^>]*>)[\s\S]*?(<\/p>)/,
        `$1${regionTask}도 보이는 흔적과 실제 유입 지점이 다를 수 있어, 원인 범위를 함께 확인합니다.$2`
      );

      // ── 9. Portfolio section title ─────────────────────────────────
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-portfolio"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${regionTask} 시공 사례$2`
      );

      // ── 10. FAQ 1 질문 ────────────────────────────────────────────
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-faq1"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${regionTask}, 언제 점검이 필요할까요?$2`
      );

      // ── 11. FAQ 1 답변 ────────────────────────────────────────────
      html = html.replace(
        /(<div[^>]*data-keyword="region-task-faq1-answer"[^>]*>)[\s\S]*?(<\/div>)/,
        `$1\n                비가 온 뒤 창틀 하부나 벽지 주변에 물기가 남고, 외부 실리콘이 갈라졌다면 점검이 필요할 수 있습니다. 창틀뿐 아니라 외벽 균열과 샷시 접합부까지 함께 확인하는 것이 좋습니다.\n              $2`
      );

      // ── 12. FAQ 3 질문 ────────────────────────────────────────────
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-faq3"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${regionTask} 재시공, 코킹했는데 다시 새는 이유는 뭔가요?$2`
      );

      // ── 13. Contact CTA 제목 (PC) ─────────────────────────────────
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-contact-pc"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${regionTask} 상담, 원인부터 확인하세요$2`
      );

    } else {
      // ── 기본 메인페이지 ───────────────────────────────────────────
      html = html.replace(/CANONICAL_PLACEHOLDER/g, DEFAULT_META.canonical);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });
};
