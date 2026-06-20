const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const htmlPath = path.join(process.cwd(), 'template.html');

  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    const k = req.query.k;
    const allowedTasks = ['창틀코킹', '창틀누수', '빗물누수', '창틀실리콘', '샷시실리콘', '외벽보수'];
    let region = '서울·경기';
    let task = '빗물누수·창틀코킹';
    let isDynamic = false;

    if (k) {
      const decoded = decodeURIComponent(k).trim();
      const parts = decoded.split('-');
      if (parts.length >= 2) {
        const r = parts[0].trim();
        const t = parts[1].trim();
        if (allowedTasks.includes(t)) {
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

      // 1. Replace Title Tag
      const titleText = `${regionTask} | 창틀·샷시·외벽 빗물누수 전문 레인가드`;
      html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${titleText}</title>`);

      // 2. Replace Meta Description
      const descText = `${regionTask}, 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다. 레인가드 전문 진단팀.`;
      html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${descText}"`);

      // 3. Replace og:title & og:description
      html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${titleText}"`);
      html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${descText}"`);

      // 4. Replace H1 element
      const h1Content = `<span class="h1-region">${region}</span> <span class="h1-task">${task}</span> <span class="h1-suffix">전문 진단</span>`;
      html = html.replace(/(<h1[^>]*data-keyword="region-task-h1"[^>]*>)[\s\S]*?(<\/h1>)/, `$1${h1Content}$2`);

      // 5. Replace Portfolio Title
      const portfolioContent = `${regionTask} 시공 사례`;
      html = html.replace(/(<h2[^>]*data-keyword="region-task-portfolio"[^>]*>)[\s\S]*?(<\/h2>)/, `$1${portfolioContent}$2`);

      // 6. Replace FAQ 1 & 3
      const faq1Content = `${regionTask}, 비 올 때만 새는데 바로 점검이 필요한가요?`;
      html = html.replace(/(<span[^>]*data-keyword="region-task-faq1"[^>]*>)[\s\S]*?(<\/span>)/, `$1${faq1Content}$2`);

      const faq3Content = `${regionTask} 재시공, 코킹했는데 다시 새는 이유는 뭔가요?`;
      html = html.replace(/(<span[^>]*data-keyword="region-task-faq3"[^>]*>)[\s\S]*?(<\/span>)/, `$1${faq3Content}$2`);

      // 7. Replace Contact PC
      const contactContent = `${regionTask} 상담, 원인부터 확인하세요`;
      html = html.replace(/(<h2[^>]*data-keyword="region-task-contact-pc"[^>]*>)[\s\S]*?(<\/h2>)/, `$1${contactContent}$2`);
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  });
};
