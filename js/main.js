document.addEventListener('DOMContentLoaded', () => {
  // 0. 대표 전화번호 정의 (교체 가능하게 중앙 관리)
  initCompanyPhone();

  // 1. URL 쿼리 파라미터 파싱 및 동적 키워드 바인딩
  initDynamicKeywords();

  // 2. Before/After 드래그 슬라이더 초기화
  initBeforeAfterSliders();

  // 3. 모바일 내비게이션 토글
  initMobileMenu();

  // 4. 아코디언 FAQ 토글
  initFaqAccordion();

  // 5. 누수 자가 진단 인터랙션
  initLeakCheck();

  // 6. 스크롤 위치에 따른 헤더 디자인 변경
  initHeaderScroll();
});

// 전화번호 중앙 관리 변수 (이곳의 값만 변경하면 사이트 전체 전화번호가 업데이트됩니다)
const COMPANY_PHONE = '010-4667-5568';

/**
 * 사이트 내의 모든 대표 전화번호 텍스트 및 링크를 중앙 변수 기반으로 업데이트합니다.
 */
function initCompanyPhone() {
  // 텍스트 교체 (.company-phone 클래스를 가진 모든 요소)
  document.querySelectorAll('.company-phone').forEach(el => {
    el.textContent = COMPANY_PHONE;
  });

  // 전화 링크 교체 (.company-phone-link 클래스를 가진 모든 요소)
  document.querySelectorAll('.company-phone-link').forEach(el => {
    el.href = `tel:${COMPANY_PHONE}`;
  });
}

/**
 * URL 파라미터 '?k='에서 키워드를 파싱하여 DOM 요소들에 동적으로 매핑합니다.
 * 형식: ?k=지역명-작업명 -> 지역명: 수원, 작업명: 창틀코킹
 */
function initDynamicKeywords() {
  const urlParams = new URLSearchParams(window.location.search);
  const k = urlParams.get('k');

  let region = '서울·경기';
  let task = '빗물누수·창틀코킹';
  let isDynamic = false;

  // 파라미터 분리 처리
  if (k) {
    const decodedK = decodeURIComponent(k);
    const parts = decodedK.split('-');

    if (parts.length >= 2) {
      region = parts[0].trim();
      task = parts[1].trim();
      isDynamic = true;
    } else if (parts.length === 1) {
      region = '서울·경기';
      task = parts[0].trim();
      isDynamic = true;
    }
  }

  const regionTask = `${region} ${task}`;

  // SEO용 브라우저 타이틀 및 메타 정보 동적 업데이트
  if (isDynamic) {
    // 1. title: {지역명+작업명} | 창틀·샷시·외벽 빗물누수 전문 올케어
    document.title = `${regionTask} | 창틀·샷시·외벽 빗물누수 전문 올케어`;

    // 2. meta description: {지역명+작업명}, 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다.
    updateMetaTag('description', `${regionTask}, 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다.`);
    
    // 3. meta keywords (유사 키워드로 분산 배치)
    updateMetaTag('keywords', `${region} 창틀 누수, ${region} 창틀 실리콘, ${region} 샷시 실리콘, ${region} 빗물누수, ${region} 외벽 보수, ${region} 외벽 크랙, 창틀 하부 누수, 샷시 접합부, 외벽 균열, 기존 실리콘 들뜸, 빗물 유입, 재누수, 외벽 마감 보수`);

    // 4. Open Graph 태그 업데이트
    updateMetaProperty('og:title', `${regionTask} | 창틀·샷시·외벽 빗물누수 전문 올케어`);
    updateMetaProperty('og:description', `${regionTask}, 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다.`);
  } else {
    // 기본 메인페이지 상태 메타 정보
    document.title = `서울·경기 빗물누수·창틀코킹 전문 진단 | 올케어`;
    updateMetaTag('description', `서울·경기 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다. 올케어 전문 진단팀.`);
    updateMetaTag('keywords', `창틀누수, 창틀코킹, 샷시 실리콘, 외벽 크랙, 외벽보수, 서울 창틀코킹, 경기 창틀코킹, 올케어`);
    updateMetaProperty('og:title', `서울·경기 빗물누수·창틀코킹 전문 진단 | 올케어`);
    updateMetaProperty('og:description', `서울·경기 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다. 올케어 전문 진단팀.`);
  }

  // 11개 섹션별 동적 바인딩 대응
  // 1. Hero H1: 단일 태그 동적 매핑
  document.querySelectorAll('[data-keyword="region-task-h1"]').forEach(el => {
    el.innerHTML = isDynamic 
      ? `<span class="h1-region">${region}</span> <span class="h1-task">${task}</span> <span class="h1-suffix">전문 진단</span>`
      : `<span class="h1-region">서울·경기</span> <span class="h1-task">빗물누수·창틀코킹</span> <span class="h1-suffix">전문 진단</span>`;
  });

  // 2. Hero 본문 및 설명: PC/MO 분기 동적 매핑 (Desc)
  document.querySelectorAll('[data-keyword="region-task-desc"]').forEach(el => {
    el.innerHTML = `
      <span class="hero-highlight">
        <span class="pc-only-text">비 올 때만 보이는 창틀 주변 흔적, 겉면보다 유입 지점부터 확인합니다.</span>
        <span class="mo-only-text">외벽·샷시 틈으로 스며드는 빗물, 창틀 주변 흔적까지 함께 확인합니다.</span>
      </span>
      <span class="hero-desc-text pc-only-text">외벽 균열, 샷시 접합부, 기존 실리콘 상태를 함께 확인해 현장에 맞는 보수 방향을 안내합니다.</span>
    `;
  });

  // 3. 중간 핵심 섹션 H2: {지역명+작업명}, 언제 점검이 필요할까요?
  document.querySelectorAll('[data-keyword="region-task-q"]').forEach(el => {
    el.innerHTML = isDynamic 
      ? `<span class="brand-blue-text">${regionTask}</span>, 언제 점검이 필요할까요?`
      : `<span class="brand-blue-text">빗물누수·창틀코킹</span>, 언제 점검이 필요할까요?`;
  });

  // 4. 시공 사례 H2: {지역명+작업명} 시공 사례
  document.querySelectorAll('[data-keyword="region-task-portfolio"]').forEach(el => {
    el.innerHTML = isDynamic ? `${regionTask} 시공 사례` : `올케어 대표 시공 사례`;
  });

  // 5. FAQ 질문 1: {지역명+작업명}, 비 올 때만 새는데 바로 점검이 필요한가요?
  document.querySelectorAll('[data-keyword="region-task-faq1"]').forEach(el => {
    el.innerHTML = isDynamic ? `${regionTask}, 비 올 때만 새는데 바로 점검이 필요한가요?` : `비 올 때만 새는데 바로 점검이 필요한가요?`;
  });

  // 6. FAQ 질문 3: {지역명+작업명} 재시공, 코킹했는데 다시 새는 이유는 뭔가요?
  document.querySelectorAll('[data-keyword="region-task-faq3"]').forEach(el => {
    el.innerHTML = isDynamic ? `${regionTask} 재시공, 코킹했는데 다시 새는 이유는 뭔가요?` : `기존에 코킹했는데 다시 새는 이유는 뭔가요?`;
  });

  // 8. 최종 CTA 제목: {지역명+작업명} 상담, 원인부터 확인하세요
  document.querySelectorAll('[data-keyword="region-task-contact-pc"]').forEach(el => {
    el.innerHTML = isDynamic
      ? `${regionTask} 상담, 원인부터 확인하세요`
      : `비 온 뒤 또 젖는다면,<br><span class="mo-hide">이번엔 </span>원인부터 확인하세요`;
  });

  // 9. 최종 CTA consult 텍스트
  document.querySelectorAll('[data-keyword="region-task-consult"]').forEach(el => {
    el.innerHTML = isDynamic ? `${regionTask} 상담` : `무료 전화 상담`;
  });

  // 개별 키워드 노출용
  document.querySelectorAll('[data-keyword="region"]').forEach(el => {
    el.textContent = region;
  });

  document.querySelectorAll('[data-keyword="task"]').forEach(el => {
    el.textContent = task;
  });

  document.querySelectorAll('[data-keyword="region-task"]').forEach(el => {
    el.textContent = regionTask;
  });
}

function updateMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = name;
    document.head.appendChild(meta);
  }
  meta.content = content;
}

function updateMetaProperty(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.content = content;
}

/**
 * Before/After 이미지 슬라이더 동작 제어
 * 마우스 드래그 및 터치 스와이프 지원 (Clip-path 활용)
 */
function initBeforeAfterSliders() {
  const sliders = document.querySelectorAll('.slider-container');

  sliders.forEach(slider => {
    const beforeImgContainer = slider.querySelector('.slider-before');
    const handle = slider.querySelector('.slider-handle');
    if (!beforeImgContainer || !handle) return;

    let isResizing = false;

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const offset = clientX - rect.left;
      let percentage = (offset / rect.width) * 100;

      // 범위 제한 (0% ~ 100%)
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;

      beforeImgContainer.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
      handle.style.left = `${percentage}%`;
    };

    // 마우스 이벤트
    const startResize = (e) => {
      isResizing = true;
      setPosition(e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0));
    };

    const stopResize = () => {
      isResizing = false;
    };

    const resize = (e) => {
      if (!isResizing) return;
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      if (clientX !== null) {
        setPosition(clientX);
      }
    };

    // 이벤트 바인딩
    slider.addEventListener('mousedown', startResize);
    window.addEventListener('mouseup', stopResize);
    window.addEventListener('mousemove', resize);

    // 터치 지원 (모바일)
    slider.addEventListener('touchstart', startResize, { passive: true });
    window.addEventListener('touchend', stopResize);
    window.addEventListener('touchmove', resize, { passive: true });
  });
}

/**
 * 모바일 내비게이션 토글 기능
 */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navMenu = document.querySelector('.nav-links');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('menu-opened');
    });

    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('menu-opened');
      });
    });
  }
}

/**
 * 아코디언 방식 FAQ 토글
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // 다른 열려있는 질문 닫기
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        });

        // 현재 질문 토글
        if (!isOpen) {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
          item.classList.remove('active');
          answer.style.maxHeight = null;
        }
      });
    }
  });
}

/**
 * 누수 자가 진단 인터랙션
 * 체크 개수에 따라 경고 및 즉시문의 유도 메시지 변화
 */
function initLeakCheck() {
  const checkboxes = document.querySelectorAll('.leak-checkbox');
  const resultBox = document.getElementById('leak-result-msg');

  if (checkboxes.length === 0 || !resultBox) return;

  const updateResult = () => {
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    let message = '자가 진단을 진행해 보세요.';
    let levelClass = 'info';

    if (checkedCount === 0) {
      message = '상태 체크박스를 선택해 주세요.';
      levelClass = 'info';
    } else if (checkedCount === 1) {
      message = '⚠️ 1가지 증상 감지: 당장 심각하진 않으나 빗물이 유입되는 초기 틈새 점검이 필요합니다.';
      levelClass = 'warning-light';
    } else if (checkedCount >= 2 && checkedCount <= 3) {
      message = '🚨 2가지 이상 증상 감지: 건물 외벽 접합부 및 코킹 마감재 균열이 감지되었습니다. 정밀 진단을 고려해보세요.';
      levelClass = 'warning';
    } else if (checkedCount >= 4) {
      message = '🔥 위험 수준 증상 감지: 비가 올 때마다 내부 누수와 아래 세대 침수 피해가 지속될 수 있습니다. 정밀 보수 상담을 권장합니다.';
      levelClass = 'danger';
    }

    resultBox.className = `leak-result-alert ${levelClass}`;
    resultBox.textContent = message;
  };

  checkboxes.forEach(cb => {
    cb.addEventListener('change', updateResult);
  });
}

/**
 * 스크롤 시 헤더 디자인 변경
 */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/**
 * 모바일 시공 사례 전후 이미지 토글 기능
 */
function togglePortfolioImage(buttonEl, state) {
  const container = buttonEl.closest('.portfolio-mobile-image-area');
  if (!container) return;

  const buttons = container.querySelectorAll('.toggle-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  buttonEl.classList.add('active');

  const beforeImg = container.querySelector('.before-img');
  const afterImg = container.querySelector('.after-img');

  if (state === 'before') {
    beforeImg.classList.add('active-img');
    afterImg.classList.remove('active-img');
  } else {
    afterImg.classList.add('active-img');
    beforeImg.classList.remove('active-img');
  }
}
