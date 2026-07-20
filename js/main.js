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

// 사업자 프로필 데이터 분리 정의
const businessProfiles = {
  default: {
    companyName: "올케어",
    ownerName: "김동명",
    businessNumber: "224-77-00461",
    phone: "050-7871-3550",
    phoneHref: "tel:05078713550",
    kakaoUrl: "http://pf.kakao.com/_LRmxfX"
  },
  gyeonggiZero: {
    companyName: "경기제로도장방수",
    ownerName: "최우영",
    businessNumber: "724-71-00799",
    phone: "010-7776-3029",
    phoneHref: "tel:01077763029",
    kakaoUrl: "http://pf.kakao.com/_xkhUfX"
  }
};

const REGION_MAP = {
  "수원": "수원", "수원시": "수원", "장안구": "수원", "권선구": "수원", "팔달구": "수원", "영통구": "수원", "광교": "수원", "영통": "수원", "영통동": "수원", "매탄동": "수원", "인계동": "수원", "권선동": "수원", "세류동": "수원", "지동": "수원", "우만동": "수원", "망포동": "수원", "정자동": "수원", "조원동": "수원", "율전동": "수원", "화서동": "수원", "광교동": "수원", "파장동": "수원", "송죽동": "수원", "원천동": "수원", "매교동": "수원", "곡반정동": "수원", "호매실동": "수원", "금곡동": "수원", "서둔동": "수원", "구운동": "수원", "천천동": "수원", "이의동": "수원", "하동": "수원", "화성": "화성", "화성시": "화성", "동탄": "동탄", "병점": "화성", "봉담": "화성", "향남": "화성", "남양": "화성", "송산": "화성", "진안동": "화성", "반월동": "화성", "기배동": "화성", "화산동": "화성", "동탄동": "동탄", "새솔동": "화성", "병점동": "화성", "봉담읍": "화성", "향남읍": "화성", "남양읍": "화성", "우정읍": "화성", "매송면": "화성", "비봉면": "화성", "마도면": "화성", "송산면": "화성", "서신면": "화성", "팔탄면": "화성", "장안면": "화성", "양감면": "화성", "정남면": "화성", "안녕동": "화성", "반송동": "동탄", "석우동": "동탄", "능동": "화성", "기산동": "화성", "오산": "오산", "오산시": "오산", "세교": "오산", "원동": "오산", "궐동": "오산", "오산동": "오산", "부산동": "오산", "수청동": "오산", "금암동": "오산", "양산동": "오산", "내삼미동": "오산", "외삼미동": "오산", "누읍동": "오산", "가수동": "오산", "갈곶동": "오산", "고현동": "오산", "청호동": "오산", "지곶동": "오산", "서랑동": "오산", "가장동": "오산", "벌음동": "오산", "탑동": "오산", "세교동": "오산", "용인": "용인", "용인시": "용인", "처인구": "용인", "기흥구": "용인", "수지구": "용인", "동백": "용인", "죽전": "용인", "신갈동": "용인", "구갈동": "용인", "상갈동": "용인", "하갈동": "용인", "기흥동": "용인", "서농동": "용인", "구성동": "용인", "마북동": "용인", "동백동": "용인", "상하동": "용인", "보정동": "용인", "풍덕천동": "용인", "신봉동": "용인", "죽전동": "용인", "동천동": "용인", "상현동": "용인", "성복동": "용인", "역삼동": "용인", "역북동": "용인", "삼가동": "용인", "유림동": "용인", "동부동": "용인", "중앙동": "용인", "포곡읍": "용인", "모현읍": "용인", "남사읍": "용인", "이동읍": "용인", "원삼면": "용인", "백암면": "용인", "양지면": "용인", "언남동": "용인", "청덕동": "용인", "영덕동": "용인", "서천동": "용인", "이천": "이천", "이천시": "이천", "창전동": "이천", "증포동": "이천", "부발": "이천", "마장": "이천", "부발읍": "이천", "마장면": "이천", "관고동": "이천", "중리동": "이천", "송정동": "이천", "안흥동": "이천", "갈산동": "이천", "사음동": "이천", "장호원읍": "이천", "신둔면": "이천", "백사면": "이천", "호법면": "이천", "대월면": "이천", "모가면": "이천", "설성면": "이천", "율면": "이천", "고담동": "이천", "대포동": "이천", "단월동": "이천", "장록동": "이천", "평택": "평택", "평택시": "평택", "고덕": "평택", "송탄": "평택", "안중": "평택", "팽성": "평택", "비전동": "평택", "고덕동": "평택", "통복동": "평택", "군문동": "평택", "합정동": "평택", "동삭동": "평택", "지제동": "평택", "소사동": "평택", "용이동": "평택", "죽백동": "평택", "서정동": "평택", "지산동": "평택", "독곡동": "평택", "송북동": "평택", "신장동": "평택", "팽성읍": "평택", "안중읍": "평택", "포승읍": "평택", "청북읍": "평택", "진위면": "평택", "서탄면": "평택", "오성면": "평택", "현덕면": "평택", "안성": "안성", "안성시": "안성", "공도": "안성", "대덕": "안성", "금광": "안성", "보개": "안성", "안성동": "안성", "공도읍": "안성", "보개면": "안성", "금광면": "안성", "서운면": "안성", "미양면": "안성", "대덕면": "안성", "양성면": "안성", "원곡면": "안성", "일죽면": "안성", "죽산면": "안성", "삼죽면": "안성", "아양동": "안성", "석정동": "안성", "당왕동": "안성", "옥산동": "안성", "연지동": "안성", "대천동": "안성", "신소현동": "안성", "사곡동": "안성", "금석동": "안성",
  "인천": "인천", "인천광역시": "인천", "제물포구": "인천", "영종구": "인천", "미추홀구": "인천", "연수구": "인천", "남동구": "인천", "부평구": "인천", "계양구": "인천", "서해구": "인천", "검단구": "인천", "강화군": "강화군", "옹진군": "옹진군", "안산": "안산", "안산시": "안산", "상록구": "안산", "단원구": "안산", "시흥": "시흥", "시흥시": "시흥", "부천": "부천", "부천시": "부천", "원미구": "부천", "소사구": "부천", "오정구": "부천", "광명": "광명", "광명시": "광명", "군포": "군포", "군포시": "군포", "안양": "안양", "안양시": "안양", "만안구": "안양", "동안구": "안양", "과천": "과천", "과천시": "과천", "의왕": "의왕", "의왕시": "의왕", "송도동": "인천", "청라동": "인천", "검단동": "인천", "부평동": "인천", "구월동": "인천", "논현동": "인천", "간석동": "인천", "주안동": "인천", "용현동": "인천", "계양동": "인천", "계산동": "인천", "작전동": "인천", "영종동": "인천", "운서동": "인천", "만수동": "인천", "sam-san": "인천", "효성동": "인천", "동춘동": "인천", "옥련동": "인천", "연수동": "인천", "청학동": "인천", "도화동": "인천", "숭의동": "인천", "학익동": "인천", "고잔동": "안산", "선부동": "안산", "월피동": "안산", "본오동": "안산", "사동": "안산", "이동": "안산", "초지동": "안산", "정왕동": "시흥", "배곧동": "시흥", "은행동": "시흥", "대야동": "시흥", "신천동": "시흥", "장곡동": "시흥", "능곡동": "시흥", "중동": "부천", "상동": "부천", "심곡동": "부천", "역곡동": "부천", "소사본동": "부천", "철산동": "광명", "하안동": "광명", "소하동": "광명", "광명동": "광명", "산본동": "군포", "금정동": "군포", "당동": "군포", "부곡동": "군포", "평촌동": "안양", "호계동": "안양", "비산동": "안양", "관양동": "안양", "안양동": "안양", "박달동": "안양", "석수동": "안양", "별양동": "과천", "갈현동": "과천", "문원동": "과천", "내손동": "의왕", "오전동": "의왕", "고천동": "의왕", "청계동": "의왕", "신흥동": "인천", "답동": "인천", "신포동": "인천", "북성동": "인천", "송월동": "인천", "연안동": "인천", "도원동": "인천", "율목동": "인천", "동인천동": "인천", "용유동": "인천", "운남동": "인천", "운북동": "인천", "중산동": "인천", "만석동": "인천", "화수동": "인천", "송현동": "인천", "화평동": "인천", "창영동": "인천", "송림동": "인천", "선학동": "인천", "장수동": "인천", "서창동": "인천", "도림동": "인천", "남촌동": "인천", "산곡동": "인천", "청천동": "인천", "부개동": "인천", "일신동": "인천", "십정동": "인천", "서운동": "인천", "검암동": "인천", "경서동": "인천", "연희동": "인천", "신현동": "시흥", "원창동": "인천", "가정동": "인천", "석남동": "인천", "가좌동": "인천", "마전동": "인천", "당하동": "인천", "원당동": "인천", "오류동": "인천", "왕길동": "인천", "불로동": "인천", "강화읍": "인천", "선원면": "인천", "불은면": "인천", "길상면": "인천", "화도면": "인천", "양도면": "인천", "내가면": "인천", "하점면": "인천", "양사면": "인천", "송해면": "인천", "교동면": "인천", "삼산면": "인천", "서도면": "인천", "북도면": "인천", "연평면": "인천", "백령면": "인천", "대청면": "인천", "덕적면": "인천", "자월면": "인천", "영흥면": "인천", "일동": "안산", "성포동": "안산", "안산동": "안산", "와동": "안산", "원곡동": "안산", "백운동": "안산", "신길동": "안산", "대부동": "안산", "매화동": "시흥", "목감동": "시흥", "군자동": "시흥", "월곶동": "시흥", "과림동": "시흥", "연성동": "시흥", "거북섬동": "시흥", "원미동": "부천", "춘의동": "부천", "도당동": "부천", "약대동": "부천", "범박동": "부천", "옥길동": "부천", "괴안동": "부천", "송내동": "부천", "성곡동": "부천", "원종동": "부천", "고강동": "부천", "오정동": "부천", "일직동": "광명", "학온동": "광명", "군포동": "군포", "수리동": "군포", "궁내동": "군포", "광정동": "군포", "재궁동": "군포", "오금동": "군포", "송부동": "군포", "부흥동": "안양", "달안동": "안양", "인덕원동": "안양", "부림동": "안양", "귀인동": "안양", "범계동": "안양", "신촌동": "안양", "과천동": "과천",
  "양평": "양평", "양평군": "양평", "양평읍": "양평", "강상면": "양평", "강하면": "양평", "양서면": "양평", "옥천면": "양평", "서종면": "양평", "단월면": "양평", "청운면": "양평", "양동면": "양평", "지평면": "양평", "용문면": "양평", "개군면": "양평",
  "종로": "서울", "종로구": "서울", "중구": "서울", "서울 중구": "서울", "용산": "서울", "용산구": "서울", "성동": "서울", "성동구": "서울", "광진": "서울", "광진구": "서울", "동대문": "서울", "동대문구": "서울", "중랑": "서울", "중랑구": "서울", "성북": "서울", "성북구": "서울", "강북": "서울", "강북구": "서울", "도봉": "서울", "도봉구": "서울", "노원": "서울", "노원구": "서울", "은평": "서울", "은평구": "서울", "서대문": "서울", "서대문구": "서울", "마포": "서울", "마포구": "서울", "양천": "서울", "양천구": "서울", "강서": "서울", "강서구": "서울", "구로": "서울", "구로구": "서울", "금천": "서울", "금천구": "서울", "영등포": "서울", "영등포구": "서울", "동작": "서울", "동작구": "서울", "관악": "서울", "관악구": "서울", "서초": "서울", "서초구": "서울", "강남": "서울", "강남구": "서울", "송파": "서울", "송파구": "서울", "강동": "서울", "강동구: 서울": "서울",
  "화곡동": "서울", "화양동": "서울", "황학동": "서울", "회기동": "서울", "회현동": "서울", "효창동": "서울", "후암동": "서울", "휘경동": "서울", "흑석동": "서울",
  "광주": "광주", "광주시": "광주", "경기광주": "광주", "초월읍": "광주", "곤지암읍": "광주", "도척면": "광주", "퇴촌면": "광주", "남종면": "광주", "남한산성면": "광주", "오포동": "광주", "신현동": "광주", "능평동": "광주", "경안동": "광주", "쌍령동": "광주", "탄벌동": "광주", "광남동": "광주",
  "여주": "여주", "여주시": "여주", "가남읍": "여주", "점동면": "여주", "세종대왕면": "여주", "흥천면": "여주", "금사면": "여주", "산북면": "여주", "대신면": "여주", "북내면": "여주", "강천면": "여주", "여흥동": "여주", "오학동": "여주"
};

// 지역명 기준으로 해당 권역의 사업자 프로필을 매칭하여 반환
function resolveBusinessProfileByRegion(regionName) {
  if (!regionName) return businessProfiles.default;
  const cleaned = regionName.trim();
  const representativeRegion = REGION_MAP[cleaned] || cleaned;

  // 경기제로도장방수(gyeonggiZero) 예외 프로필 적용 10개 권역 (화성 산하의 동탄 포함)
  const exceptionRegions = ['광주', '양평', '여주', '이천', '용인', '안성', '오산', '화성', '동탄', '평택'];
  if (exceptionRegions.includes(representativeRegion)) {
    return businessProfiles.gyeonggiZero;
  }
  return businessProfiles.default;
}

// 전화번호 중앙 관리 변수 (이곳의 값만 변경하면 사이트 전체 전화번호가 업데이트됩니다)
const COMPANY_PHONE = '050-7871-3550';

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

    // 5. 사업자 프로필 해결 및 글로벌 정보 분기 적용
    const profile = resolveBusinessProfileByRegion(region);

    // 전화번호 텍스트 및 링크 전체 교체 (Header, Hero, 상담 박스, Footer, Floating CTA)
    document.querySelectorAll('.company-phone').forEach(el => {
      el.textContent = profile.phone;
    });
    document.querySelectorAll('.company-phone-link').forEach(el => {
      el.href = profile.phoneHref;
    });

    // 카카오톡 문의 링크 전체 교체 (Header, Hero, 상담 박스, Floating CTA, PC Dock)
    document.querySelectorAll('.btn-kakao, .floating-kakao, .dock-btn-kakao').forEach(el => {
      el.href = profile.kakaoUrl;
    });

    // Footer 사업자 정보 동적 유지
    const nameEl = document.querySelector('.footer-company-name');
    const ownerEl = document.querySelector('.footer-company-owner');
    const numberEl = document.querySelector('.footer-company-number');
    if (nameEl) nameEl.textContent = `상호명: ${profile.companyName}`;
    if (ownerEl) ownerEl.textContent = `사업자명: ${profile.ownerName}`;
    if (numberEl) numberEl.textContent = `사업자등록번호: ${profile.businessNumber}`;
  } else {
    // 기본 메인페이지 상태 메타 정보
    document.title = `서울·경기 빗물누수·창틀코킹 전문 진단 | 올케어`;
    updateMetaTag('description', `서울·경기 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다. 올케어 전문 진단팀.`);
    updateMetaTag('keywords', `창틀누수, 창틀코킹, 샷시 실리콘, 외벽 크랙, 외벽보수, 서울 창틀코킹, 경기 창틀코킹, 올케어`);
    updateMetaProperty('og:title', `서울·경기 빗물누수·창틀코킹 전문 진단 | 올케어`);
    updateMetaProperty('og:description', `서울·경기 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다. 올케어 전문 진단팀.`);

    // 5. Footer 사업자 정보 메인주소용 수정
    const nameEl = document.querySelector('.footer-company-name');
    const ownerEl = document.querySelector('.footer-company-owner');
    const numberEl = document.querySelector('.footer-company-number');
    if (nameEl) nameEl.textContent = '상호명: 올케어 서비스';
    if (ownerEl) ownerEl.textContent = '사업자명: 김재현';
    if (numberEl) numberEl.textContent = '사업자등록번호: 405-15-02677';
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
