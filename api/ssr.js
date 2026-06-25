const fs = require('fs');
const path = require('path');

// 허용된 작업명 목록
const ALLOWED_TASKS = ['창틀코킹', '창틀누수', '빗물누수', '창틀실리콘', '샷시실리콘', '외벽보수'];

// 기본 메인페이지 메타 정보
const DEFAULT_META = {
  title: '서울·경기 빗물누수·창틀코킹 전문 진단 | 올케어',
  description: '서울·경기 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다. 올케어 전문 진단팀.',
  canonical: '/',
};

/**
 * 작업명별 문맥 특화 문장 반환
 * @param {string} task - 허용된 작업명
 * @param {string} regionTask - "지역명 작업명"
 * @returns {{ ogImage: string, hero: string, reLeakBox: string, processDesc: string, faq1Answer: string }}
 */
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

/**
 * ?k=지역명-작업명 파라미터를 파싱하여 region, task 반환
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
  const title = `${regionTask} | 창틀·샷시·외벽 누수 진단 올케어`;
  const description = `${regionTask}, 비 온 뒤 창틀 주변 물기·실리콘 갈라짐·외벽 균열이 보인다면 유입 경로와 현장 상태를 함께 확인해 보수 방향을 안내합니다.`;
  const canonical = `/?k=${encodeURIComponent(rawK)}`;
  return { title, description, canonical, regionTask, region, task };
}

/**
 * 작업명별 포트폴리오 이미지 alt 텍스트 세트 반환
 */
function getPortfolioAlts(task, regionTask) {
  const baseMap = {
    '외벽보수': [
      { before: '외벽 균열 보수 전 사진', after: '외벽 균열 보수 후 사진' },         // card1
      { before: '창틀 실리콘 재시공 전 사진', after: '창틀 실리콘 재시공 후 사진' }, // card2
      { before: '외벽 크랙 보수 전 사진', after: '외벽 크랙 보수 후 사진' },         // card3
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
  // 지역명 접두어 추가 (첫 번째 카드에만)
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

/**
 * data-portfolio-tags 속성을 기준으로 포트폴리오 카드 HTML 순서 재배치
 */
function reorderPortfolioHTML(html, task) {
  const gridMatch = html.match(/(<div class="portfolio-grid" id="portfolio-grid">)([\s\S]*?)(<\/div>\s*<\/div>\s*<\/section>)/m);
  if (!gridMatch) return html;

  const gridInner = gridMatch[2];
  
  // <!-- Card 1, <!-- Card 2 등을 기준으로 문자열 분리
  const cardParts = gridInner.split(/(?=<!-- Card \d)/);
  const cards = [];
  
  for (const part of cardParts) {
    if (!part.trim().startsWith('<!-- Card')) {
      // 카드가 아닌 영역 (주석 앞부분의 공백 등)
      continue;
    }
    const tagsMatch = part.match(/data-portfolio-tags="([^"]+)"/);
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim()) : [];
    const relevant = tags.includes(task);
    cards.push({ html: part, relevant });
  }

  if (cards.length !== 3) return html; // 파싱 실패 시 원본 반환

  const sorted = [
    ...cards.filter(c => c.relevant),
    ...cards.filter(c => !c.relevant),
  ];
  const newInner = '\n        ' + sorted.map(c => c.html.trim()).join('\n\n        ') + '\n      ';
  return html.replace(gridInner, newInner);
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
      const content = getTaskContent(task, regionTask);

      // ── 1. <title> ───────────────────────────────────────────────
      html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${meta.title}</title>`);

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

      // ── 4. OG Image ──────────────────────────────────────────────
      const ogImageUrl = `https://www.rainguard.co.kr/images/${content.ogImage}?v=2`;
      html = html.replace(
        /<meta property="og:image" data-keyword="region-task-og-image" content="[^"]*">/,
        `<meta property="og:image" data-keyword="region-task-og-image" content="${ogImageUrl}">`
      );

      // ── 5. canonical & og:url ─────────────────────────────────────
      html = html.replace(/CANONICAL_PLACEHOLDER/g, meta.canonical);

      // ── 6. H1 ─────────────────────────────────────────────────────
      const h1Content = `<span class="h1-region">${region}</span> <span class="h1-task">${task}</span> <span class="h1-suffix">전문 진단</span>`;
      html = html.replace(
        /(<h1[^>]*data-keyword="region-task-h1"[^>]*>)[\s\S]*?(<\/h1>)/,
        `$1${h1Content}$2`
      );

      // ── 6. Hero 강조문 (PC) — 작업명별 문맥 ─────────────────────
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-hero-highlight"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${content.hero}$2`
      );

      // ── 7. 위험신호 하단 경고 (PC) ───────────────────────────────
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-symptom-warning"[^>]*>)[\s\S]*?(<\/p>)/,
        `$12가지 이상 해당된다면 창틀·샷시·외벽 주변 상태를 함께 확인하는 것이 좋습니다.$2`
      );

      // ── 8. LEAK CAUSE MAP 강조 박스 — 작업명별 문맥 ─────────────
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-releak-box"[^>]*>)[\s\S]*?(<\/p>)/,
        `$1${content.reLeakBox}$2`
      );

      // ── 9. PROCESS 섹션 설명 — 작업명별 공정 흐름 ───────────────
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-process-desc"[^>]*>)[\s\S]*?(<\/p>)/,
        `$1${content.processDesc}$2`
      );

      // ── 10. Portfolio section title ────────────────────────────────
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-portfolio"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${regionTask} 시공 사례$2`
      );

      // ── 10a. Portfolio 카드 순서 재배치 ────────────────────────────
      html = reorderPortfolioHTML(html, task);

      // ── 10b. Portfolio 이미지 alt 교체 ────────────────────────────
      const alts = getPortfolioAlts(task, regionTask);
      html = html.replace(/alt="BEFORE_ALT_1"/g, `alt="${alts.before1}"`);
      html = html.replace(/alt="AFTER_ALT_1"/g, `alt="${alts.after1}"`);
      html = html.replace(/alt="BEFORE_ALT_2"/g, `alt="${alts.before2}"`);
      html = html.replace(/alt="AFTER_ALT_2"/g, `alt="${alts.after2}"`);
      html = html.replace(/alt="BEFORE_ALT_3"/g, `alt="${alts.before3}"`);
      html = html.replace(/alt="AFTER_ALT_3"/g, `alt="${alts.after3}"`);

      // ── 11. FAQ 1 질문 ────────────────────────────────────────────
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-faq1"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${regionTask}, 언제 점검이 필요할까요?$2`
      );

      // ── 12. FAQ 1 답변 — 작업명별 문맥 ──────────────────────────
      html = html.replace(
        /(<div[^>]*data-keyword="region-task-faq1-answer"[^>]*>)[\s\S]*?(<\/div>)/,
        `$1\n                ${content.faq1Answer}\n              $2`
      );

      // ── 13. FAQ 3 질문 ────────────────────────────────────────────
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-faq3"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${regionTask} 재시공, 코킹했는데 다시 새는 이유는 뭔가요?$2`
      );

      // ── 14. Contact CTA 제목 (PC) ─────────────────────────────────
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-contact-pc"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${regionTask} 상담, 원인부터 확인하세요$2`
      );

    } else {
      // ── 기본 메인페이지 ───────────────────────────────────────────
      html = html.replace(/CANONICAL_PLACEHOLDER/g, DEFAULT_META.canonical);
      
      const defaultAlts = getPortfolioAlts('기본', '');
      html = html.replace(/alt="BEFORE_ALT_1"/g, `alt="${defaultAlts.before1}"`);
      html = html.replace(/alt="AFTER_ALT_1"/g, `alt="${defaultAlts.after1}"`);
      html = html.replace(/alt="BEFORE_ALT_2"/g, `alt="${defaultAlts.before2}"`);
      html = html.replace(/alt="AFTER_ALT_2"/g, `alt="${defaultAlts.after2}"`);
      html = html.replace(/alt="BEFORE_ALT_3"/g, `alt="${defaultAlts.before3}"`);
      html = html.replace(/alt="AFTER_ALT_3"/g, `alt="${defaultAlts.after3}"`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });
};
