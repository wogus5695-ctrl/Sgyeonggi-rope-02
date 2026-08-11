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

const REGION_MAP = {
  "수원": "수원", "수원시": "수원", "장안구": "수원", "권선구": "수원", "팔달구": "수원", "영통구": "수원", "광교": "수원", "영통": "수원", "영통동": "수원", "매탄동": "수원", "인계동": "수원", "권선동": "수원", "세류동": "수원", "지동": "수원", "우만동": "수원", "망포동": "수원", "정자동": "수원", "조원동": "수원", "율전동": "수원", "화서동": "수원", "광교동": "수원", "파장동": "수원", "송죽동": "수원", "원천동": "수원", "매교동": "수원", "곡반정동": "수원", "호매실동": "수원", "금곡동": "수원", "서둔동": "수원", "구운동": "수원", "천천동": "수원", "이의동": "수원", "하동": "수원", "화성": "화성", "화성시": "화성", "동탄": "동탄", "병점": "화성", "봉담": "화성", "향남": "화성", "남양": "화성", "송산": "화성", "진안동": "화성", "반월동": "화성", "기배동": "화성", "화산동": "화성", "동탄동": "동탄", "새솔동": "화성", "병점동": "화성", "봉담읍": "화성", "향남읍": "화성", "남양읍": "화성", "우정읍": "화성", "매송면": "화성", "비봉면": "화성", "마도면": "화성", "송산면": "화성", "서신면": "화성", "팔탄면": "화성", "장안면": "화성", "양감면": "화성", "정남면": "화성", "안녕동": "화성", "반송동": "동탄", "석우동": "동탄", "능동": "화성", "기산동": "화성", "오산": "오산", "오산시": "오산", "세교": "오산", "원동": "오산", "궐동": "오산", "오산동": "오산", "부산동": "오산", "수청동": "오산", "금암동": "오산", "양산동": "오산", "내삼미동": "오산", "외삼미동": "오산", "누읍동": "오산", "가수동": "오산", "갈곶동": "오산", "고현동": "오산", "청호동": "오산", "지곶동": "오산", "서랑동": "오산", "가장동": "오산", "벌음동": "오산", "탑동": "오산", "세교동": "오산", "용인": "용인", "용인시": "용인", "처인구": "용인", "기흥구": "용인", "수지구": "용인", "동백": "용인", "죽전": "용인", "신갈동": "용인", "구갈동": "용인", "상갈동": "용인", "하갈동": "용인", "기흥동": "용인", "서농동": "용인", "구성동": "용인", "마북동": "용인", "동백동": "용인", "상하동": "용인", "보정동": "용인", "풍덕천동": "용인", "신봉동": "용인", "죽전동": "용인", "동천동": "용인", "상현동": "용인", "성복동": "용인", "역삼동": "서울", "역북동": "용인", "삼가동": "용인", "유림동": "용인", "동부동": "용인", "중앙동": "용인", "포곡읍": "용인", "모현읍": "용인", "남사읍": "용인", "이동읍": "용인", "원삼면": "용인", "백암면": "용인", "양지면": "용인", "언남동": "용인", "청덕동": "용인", "영덕동": "용인", "서천동": "용인", "이천": "이천", "이천시": "이천", "창전동": "이천", "증포동": "이천", "부발": "이천", "마장": "이천", "부발읍": "이천", "마장면": "이천", "관고동": "이천", "중리동": "이천", "송정동": "이천", "안흥동": "이천", "갈산동": "이천", "사음동": "이천", "장호원읍": "이천", "신둔면": "이천", "백사면": "이천", "호법면": "이천", "대월면": "이천", "모가면": "이천", "설성면": "이천", "율면": "이천", "고담동": "이천", "대포동": "이천", "단월동": "이천", "장록동": "이천", "평택": "평택", "평택시": "평택", "고덕": "평택", "송탄": "평택", "안중": "평택", "팽성": "평택", "비전동": "평택", "고덕동": "평택", "통복동": "평택", "군문동": "평택", "합정동": "평택", "동삭동": "평택", "지제동": "평택", "소사동": "평택", "용이동": "평택", "죽백동": "평택", "서정동": "평택", "지산동": "평택", "독곡동": "평택", "송북동": "평택", "신장동": "평택", "팽성읍": "평택", "안중읍": "평택", "포승읍": "평택", "청북읍": "평택", "진위면": "평택", "서탄면": "평택", "오성면": "평택", "현덕면": "평택", "안성": "안성", "안성시": "안성", "공도": "안성", "대덕": "안성", "금광": "안성", "보개": "안성", "안성동": "안성", "공도읍": "안성", "보개면": "안성", "금광면": "안성", "서운면": "안성", "미양면": "안성", "대덕면": "안성", "양성면": "안성", "원곡면": "안성", "일죽면": "안성", "죽산면": "안성", "삼죽면": "안성", "아양동": "안성", "석정동": "안성", "당왕동": "안성", "옥산동": "안성", "연지동": "안성", "대천동": "안성", "신소현동": "안성", "사곡동": "안성", "금석동": "안성",
  "인천": "인천", "인천광역시": "인천", "제물포구": "인천", "영종구": "인천", "미추홀구": "인천", "연수구": "인천", "남동구": "인천", "부평구": "인천", "계양구": "인천", "서해구": "인천", "검단구": "인천", "강화군": "강화군", "옹진군": "옹진군", "안산": "안산", "안산시": "안산", "상록구": "안산", "단원구": "안산", "시흥": "시흥", "시흥시": "시흥", "부천": "부천", "부천시": "부천", "원미구": "부천", "소사구": "부천", "오정구": "부천", "광명": "광명", "광명시": "광명", "군포": "군포", "군포시": "군포", "안양": "안양", "안양시": "안양", "만안구": "안양", "동안구": "안양", "과천": "과천", "과천시": "과천", "의왕": "의왕", "의왕시": "의왕", "송도동": "인천", "청라동": "인천", "검단동": "인천", "부평동": "인천", "구월동": "인천", "논현동": "인천", "간석동": "인천", "주안동": "인천", "용현동": "인천", "계양동": "인천", "계산동": "인천", "작전동": "인천", "영종동": "인천", "운서동": "인천", "만수동": "인천", "삼산동": "인천", "효성동": "인천", "동춘동": "인천", "옥련동": "인천", "연수동": "인천", "청학동": "인천", "도화동": "인천", "숭의동": "인천", "학익동": "인천", "고잔동": "안산", "선부동": "안산", "월피동": "안산", "본오동": "안산", "사동": "안산", "이동": "안산", "초지동": "안산", "정왕동": "시흥", "배곧동": "시흥", "은행동": "시흥", "대야동": "시흥", "신천동": "시흥", "장곡동": "시흥", "능곡동": "시흥", "중동": "부천", "상동": "부천", "심곡동": "부천", "역곡동": "부천", "소사본동": "부천", "철산동": "광명", "하안동": "광명", "소하동": "광명", "광명동": "광명", "산본동": "군포", "금정동": "군포", "당동": "군포", "부곡동": "군포", "평촌동": "안양", "호계동": "안양", "비산동": "안양", "관양동": "안양", "안양동": "안양", "박달동": "안양", "석수동": "안양", "별양동": "과천", "갈현동": "과천", "문원동": "과천", "내손동": "의왕", "오전동": "의왕", "고천동": "의왕", "청계동": "의왕", "신흥동": "인천", "답동": "인천", "신포동": "인천", "북성동": "인천", "송월동": "인천", "연안동": "인천", "도원동": "인천", "율목동": "인천", "동인천동": "인천", "용유동": "인천", "운남동": "인천", "운북동": "인천", "중산동": "인천", "만석동": "인천", "화수동": "인천", "송현동": "인천", "화평동": "인천", "창영동": "인천", "송림동": "인천", "선학동": "인천", "장수동": "인천", "서창동": "인천", "도림동": "인천", "남촌동": "인천", "산곡동": "인천", "청천동": "인천", "부개동": "인천", "일신동": "인천", "십정동": "인천", "서운동": "인천", "검암동": "인천", "경서동": "인천", "연희동": "인천", "신현동": "시흥", "원창동": "인천", "가정동": "인천", "석남동": "인천", "가좌동": "인천", "마전동": "인천", "당하동": "인천", "원당동": "인천", "오류동": "인천", "왕길동": "인천", "불로동": "인천", "강화읍": "인천", "선원면": "인천", "불은면": "인천", "길상면": "인천", "화도면": "인천", "양도면": "인천", "내가면": "인천", "하점면": "인천", "양사면": "인천", "송해면": "인천", "교동면": "인천", "삼산면": "인천", "서도면": "인천", "북도면": "인천", "연평면": "인천", "백령면": "인천", "대청면": "인천", "덕적면": "인천", "자월면": "인천", "영흥면": "인천", "일동": "안산", "성포동": "안산", "안산동": "안산", "와동": "안산", "원곡동": "안산", "백운동": "안산", "신길동": "안산", "대부동": "안산", "매화동": "시흥", "목감동": "시흥", "군자동": "시흥", "월곶동": "시흥", "과림동": "시흥", "연성동": "시흥", "거북섬동": "시흥", "원미동": "부천", "춘의동": "부천", "도당동": "부천", "약대동": "부천", "범박동": "부천", "옥길동": "부천", "괴안동": "부천", "송내동": "부천", "성곡동": "부천", "원종동": "부천", "고강동": "부천", "오정동": "부천", "일직동": "광명", "학온동": "광명", "군포동": "군포", "수리동": "군포", "궁내동": "군포", "광정동": "군포", "재궁동": "군포", "오금동": "군포", "송부동": "군포", "부흥동": "안양", "달안동": "안양", "인덕원동": "안양", "부림동": "안양", "귀인동": "안양", "범계동": "안양", "신촌동": "안양", "과천동": "과천",
  "양평": "양평", "양평군": "양평", "양평읍": "양평", "강상면": "양평", "강하면": "양평", "양서면": "양평", "옥천면": "양평", "서종면": "양평", "단월면": "양평", "청운면": "양평", "양동면": "양평", "지평면": "양평", "용문면": "양평", "개군면": "양평",
  "종로": "서울", "종로구": "서울", "중구": "서울", "서울 중구": "서울", "용산": "서울", "용산구": "서울", "성동": "서울", "성동구": "서울", "광진": "서울", "광진구": "서울", "동대문": "서울", "동대문구": "서울", "중랑": "서울", "중랑구": "서울", "성북": "서울", "성북구": "서울", "강북": "서울", "강북구": "서울", "도봉": "서울", "도봉구": "서울", "노원": "서울", "노원구": "서울", "은평": "서울", "은평구": "서울", "서대문": "서울", "서대문구": "서울", "마포": "서울", "마포구": "서울", "양천": "서울", "양천구": "서울", "강서": "서울", "강서구": "서울", "구로": "서울", "구로구": "서울", "금천": "서울", "금천구": "서울", "영등포": "서울", "영등포구": "서울", "동작": "서울", "동작구": "서울", "관악": "서울", "관악구": "서울", "서초": "서울", "서초구": "서울", "강남": "서울", "강남구": "서울", "송파": "서울", "송파구": "서울", "강동": "서울", "강동구": "서울",
  "화곡동": "서울", "화양동": "서울", "황학동": "서울", "회기동": "서울", "회현동": "서울", "효창동": "서울", "후암동": "서울", "휘경동": "서울", "흑석동": "서울",
  "광주": "광주", "광주시": "광주", "경기광주": "광주", "초월읍": "광주", "곤지암읍": "광주", "도척면": "광주", "퇴촌면": "광주", "남종면": "광주", "남한산성면": "광주", "오포동": "광주", "신현동": "광주", "능평동": "광주", "경안동": "광주", "쌍령동": "광주", "탄벌동": "광주", "광남동": "광주",
  "여주": "여주", "여주시": "여주", "가남읍": "여주", "점동면": "여주", "세종대왕면": "여주", "흥천면": "여주", "금사면": "여주", "산북면": "여주", "대신면": "여주", "북내면": "여주", "강천면": "여주", "여흥동": "여주", "오학동": "여주"
};


function getRepresentativeRegion(region) {
  if (!region) return '기본';
  const cleaned = region.trim();
  return REGION_MAP[cleaned] || '기본';
}

function getRegionContextText(representativeRegion, regionName) {
  const displayRegion = regionName || representativeRegion;
  let areaType = 'GYEONGGI_CITY';
  
  const seoulRegions = ['서울'];
  const incheonRegions = ['인천', '강화군', '옹진군'];
  const gyeonggiOuterRegions = ['양평', '여주', '광주'];
  const gyeonggiCityRegions = ['수원', '용인', '화성', '동탄', '평택', '오산', '안성', '이천', '안산', '시흥', '부천', '광명', '군포', '안양', '과천', '의왕'];
  
  if (seoulRegions.includes(representativeRegion)) {
    areaType = 'SEOUL';
  } else if (incheonRegions.includes(representativeRegion)) {
    areaType = 'INCHEON';
  } else if (gyeonggiOuterRegions.includes(representativeRegion)) {
    areaType = 'GYEONGGI_OUTER';
  } else if (gyeonggiCityRegions.includes(representativeRegion)) {
    areaType = 'GYEONGGI_CITY';
  }

  const contexts = {
    'SEOUL': `${displayRegion}은 상가, 오피스텔, 다세대 건물이 밀집한 서울 도심권 지역이라 창틀 주변 실리콘 노후나 외벽 균열이 누수 원인으로 이어지는 경우가 많습니다. 고층 주거지와 오피스텔 밀집도가 높은 환경적 특징에 맞춰 물길 차단 솔루션을 제안합니다.`,
    'INCHEON': `${displayRegion}은 해풍과 염분 섞인 습기 영향으로 인해 외벽 마감재나 창틀 실리콘의 경화 및 노후가 빠르게 나타날 수 있습니다. 들이치는 거센 빗물 유입 가능 구간을 함께 확인하는 것이 필수적입니다.`,
    'GYEONGGI_CITY': `${displayRegion}은 아파트 단지, 대형 상가, 공장형 건물이 함께 넓게 분포하여 창틀 주변 틈새와 외벽 크랙, 그리고 옥상 방수층 상태를 통합적으로 진단하고 보강하는 것이 중요합니다.`,
    'GYEONGGI_OUTER': `${displayRegion}은 단독주택, 전원형 빌라, 저층 상가와 공장형 건물 등이 분산 배치되어 있어, 옥상 방수층의 노후도와 거친 외벽 마감 상태의 결함을 함께 확인하는 과정이 중요합니다.`
  };

  return contexts[areaType];
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

// 허용된 작업명 목록
const ALLOWED_TASKS = ['창틀코킹', '창틀누수', '빗물누수', '창틀실리콘', '샷시실리콘', '외벽보수', '옥상방수', '외벽방수', '외벽누수', '옥상누수'];


// 기본 메인페이지 메타 정보
const DEFAULT_META = {
  title: '서울·경기 빗물누수·창틀코킹 전문 진단 | 올케어',
  description: '서울·경기 창틀누수, 샷시 실리콘, 외벽 크랙, 외벽보수 관련 빗물 유입 문제를 전화 상담으로 안내합니다. 올케어 전문 진단팀.',
  canonical: 'https://www.rainguard.co.kr/',
};

/**
 * 작업명별 문맥 특화 문장 반환
 * @param {string} task - 허용된 작업명
 * @param {string} regionTask - "지역명 작업명"
 * @returns {{ ogImage: string, hero: string, reLeakBox: string, processDesc: string, faq1Answer: string }}
 */
function getTaskContent(task, regionTask, region) {
  const r = region || '서울·경기';
  switch (task) {
    case '창틀코킹':
    case '창틀실리콘':
    case '샷시실리콘': {
      const isCalk = task === '창틀코킹';
      const isSash = task === '샷시실리콘';
      const taskName = task;
      return {
        ogImage: 'og-window.jpg',
        hero: `${r} ${taskName}은 창틀 주변 실리콘이 갈라지거나 들뜬 경우 빗물 유입을 예방하기 위해 필요한 작업입니다. 기존 실리콘 상태와 외벽 접합부를 함께 확인해 보수 범위를 안내합니다.`,
        releakDesc: isSash 
          ? `샷시 프레임 접합부의 미세한 틈새나 노후 실리콘은 누수의 직접적인 원인이 됩니다. 겉면에 덧바르기보다 밀착력을 높여 재시공하는 것이 중요합니다.`
          : `창틀 주변 기존 실리콘 노후로 인한 틈새는 빗물 유입의 주원인이 될 수 있으므로, 비가 내리기 전에 예방 보수를 진행하는 것이 장기적으로 유리합니다.`,
        reLeakBox: isSash
          ? `샷시 흔들림이나 진동에도 틈이 벌어지지 않도록 접착성 높고 신축성이 우수한 실란트 시공이 필수적입니다.`
          : `기존 코킹을 깔끔히 제거하지 않고 덧바르면 노후면이 함께 탈락하여 누수가 반복될 수 있으므로 밀착 정리가 선행되어야 합니다.`,
        processTitle: `${taskName} 5단계 책임 시공`,
        processDesc: `기존 실리콘 상태 점검 및 제거 → 접착면 이물질 청소 → 프라이머 도포 → 방수 실리콘 코킹 시공 → 최종 마감 틈새 확인`,
        step1Title: '기존 실리콘 상태 확인', step1Desc: '실리콘 들뜸, 균열, 노후 상태를 확인합니다.',
        step2Title: '노후 실리콘 제거 작업', step2Desc: '접착력이 약해진 실리콘을 깔끔하게 제거합니다.',
        step3Title: '접합부 청소 및 정돈', step3Desc: '이물질과 습기를 제거하고 프라이머를 도포합니다.',
        step4Title: '방수 실란트 코킹 시공', step4Desc: '밀착성과 방수 성능을 극대화하여 코킹을 시공합니다.',
        step5Title: '마감 라인 및 틈새 확인', step5Desc: '최종 마감 상태와 미세한 틈을 꼼꼼하게 검수합니다.',
        faq1Q: `${r} ${taskName} 시 기존 실리콘을 반드시 제거하고 시공하나요?`,
        faq1Answer: `올케어는 노후되어 들뜨거나 갈라진 실리콘을 완전히 제거한 후 시공하는 것을 원칙으로 합니다. 기존 실리콘 위에 덧방만 하면 얼마 못 가 다시 들뜨기 때문입니다.`,
        faq2Q: `실리콘만 새로 쏘면 빗물 유입이 완벽히 해결되나요?`,
        faq2Answer: `원인이 창틀 실리콘 노후라면 해결됩니다. 다만 외벽 균열이나 옹벽 크랙에서 유입된 빗물이라면 외벽보강이나 크랙 보완이 병행되어야 완벽히 차단됩니다.`,
        faq3Q: `비가 오기 전에 ${taskName}을 미리 시공하는 게 좋나요?`,
        faq3Answer: `네, 실리콘이 경화되어 틈새가 벌어지기 전에 미리 예방 보수해주시면 빗물 유입으로 인한 실내 도배지 오염과 곰팡이 피해를 방지할 수 있어 장기적으로 훨씬 유리합니다.`,
        faq4Q: `고층부 아파트 샷시 주변 보수도 로프 작업으로 가능한가요?`,
        faq4Answer: `네, 올케어는 다년간의 고공 로프 전문 기술력을 보유하여 고층 아파트나 외벽 접근이 어려운 빌라 창호 접합부도 안전하고 확실하게 밀착 코킹 시공을 진행합니다.`,
        faq5Q: `시공 후 A/S 기간과 사후 관리는 어떻게 제공되나요?`,
        faq5Answer: `올케어는 정석 시공을 바탕으로 책임 보증제를 운영하고 있습니다. 시공 부위 자체 결함으로 인한 재유입 발생 시 약정된 무상 A/S 기간 내에 신속하고 성실하게 조치해 드립니다.`,
        contactTitle: `${regionTask} 상담, 비 오기 전에 예방하세요`,
        contactDesc: '들뜸이나 갈라짐 증상을 알려주시면 기존 실리콘 제거 범위와 보수 예산에 맞는 합리적인 코킹 방안을 친절히 안내합니다.'
      };
    }

    case '창틀누수':
    case '빗물누수': {
      const taskName = task;
      return {
        ogImage: 'og-waterproof.jpg',
        hero: `${r} ${taskName}는 창틀 하부 물고임, 벽지 얼룩, 샷시 주변 틈으로 인해 반복되는 경우가 많습니다. 내부 흔적만 보지 않고 외부 유입 경로까지 함께 확인해야 합니다.`,
        releakDesc: `실내에서 물이 비치는 곳과 실제로 빗물이 처음 스며들어온 외부 유입 경로는 서로 다를 수 있어 종합적인 물길 추적이 필수적입니다.`,
        reLeakBox: `창틀 하부의 젖은 면만 막기보다 샷시 프레임 안쪽이나 외벽과의 접합 틈새를 함께 살펴보는 것이 누수의 근원 해결책입니다.`,
        processTitle: `${taskName} 5단계 물길 탐지 시공`,
        processDesc: `실내 벽지 젖음 위치 파악 → 외부 샷시 접합부 점검 → 외벽 상부 크랙 검수 → 외부 실리콘 보수 및 균열 충진 → 누수 마감 최종 검수`,
        step1Title: '실내 젖음 및 흔적 진단', step1Desc: '벽지 변색과 물고임 위치를 꼼꼼히 파악합니다.',
        step2Title: '외부 프레임 접합부 점검', step2Desc: '샷시 결합 틈새와 코너 부위 벌어짐을 점검합니다.',
        step3Title: '외벽 상부 균열 상세 검수', step3Desc: '창틀 위쪽 콘크리트 외벽의 미세 크랙을 검수합니다.',
        step4Title: '실리콘 보수 및 균열 충진', step4Desc: '물길이 유입되는 크랙과 실리콘 틈새를 방수재로 메웁니다.',
        step5Title: '누수 차단 상태 최종 확인', step5Desc: '시공 마감 부위와 추가 유입 경로 여부를 종합 검수합니다.',
        faq1Q: `${r} ${taskName} 해결은 창틀 주변 실리콘만 막으면 끝나나요?`,
        faq1Answer: `아닙니다. 창틀 주변 실리콘뿐만 아니라 상부 외벽의 미세 균열이나 골조 틈새를 타고 내려오는 경로도 있어 다각도로 점검해 유입로를 전부 차단해야 합니다.`,
        faq2Q: `방 내부 벽지가 누렇게 젖는데 이것도 ${taskName} 영향인가요?`,
        faq2Answer: `네, 충분히 가능성이 있습니다. 외부 창호 실링이나 샷시 프레임 틈새로 유입된 미세한 물길이 옹벽을 적시면서 실내 도배지 변색과 곰팡이로 이어집니다.`,
        faq3Q: `비가 그친 뒤에도 ${taskName} 유입 경로를 추적할 수 있나요?`,
        faq3Answer: `네, 그렇습니다. 비가 갠 후에도 벽면 내부의 잔여 습기 상태와 콘크리트 미세 균열의 백화 현상 등을 정밀 검사하여 유입 흔적과 누수 원인 지점을 찾아낼 수 있습니다.`,
        faq4Q: `임시방편으로 실내 쪽에 실리콘을 발라도 물이 계속 새나요?`,
        faq4Answer: `외부에서 유입되는 물길을 막지 않은 채 실내 안쪽만 막으면, 물이 옹벽 내부에서 우회하여 다른 틈새로 다시 흘러나와 벽지 젖음이 심화되므로 외부 시공이 필수입니다.`,
        faq5Q: `전화 상담 시 대략적인 누수 진단이나 견적 안내가 가능한가요?`,
        faq5Answer: `네, 건물의 층수, 대략적인 건축 연도, 실내 누수 부위의 사진을 전달해주시면 누수 예상 경로와 함께 합리적인 방문 진단 공정을 성실하게 상담해 드립니다.`,
        contactTitle: `반복되는 ${regionTask} 해결, 종합 물길 진단`,
        contactDesc: '비 온 뒤 내부 습기 및 누수 범위에 대해 알려주시면, 건물 상부 방수층이나 외부 크랙 등 빗물이 들어올 수 있는 여러 가능성을 짚어 상세히 조언해 드립니다.'
      };
    }

    case '외벽보수':
    case '외벽방수': {
      const taskName = task;
      return {
        ogImage: 'og-wall.jpg',
        hero: `${r} ${taskName}는 외벽 균열, 창틀 주변 틈, 기존 실리콘 노후 부위를 함께 확인해야 합니다. 로프 접근이 필요한 구간은 작업 가능 여부와 안전 조건을 먼저 점검합니다.`,
        releakDesc: `외벽 마감재인 적벽돌, 콘크리트, 판넬 틈새 등은 자외선과 온도 변화에 따라 크랙이 벌어지고 빗물이 안쪽으로 스며들어 건물 내구성에 손상을 줍니다.`,
        reLeakBox: `로프 고공 작업을 통해 접근해야 하는 외벽면은 흔들림 없는 고정 장치와 안전 조건을 사전 확인하고 방수 실링재 및 기능성 발수 코팅을 도포해야 효과가 큽니다.`,
        processTitle: `${taskName} 5단계 고공 로프 시공`,
        processDesc: `외벽 손상 상태 진단 → 로프 안전 거치 확보 → 크랙 정리 및 부식 부위 탈거 → 방수 실란트 충진 및 발수제 도포 → 최종 빗물 차단 마감 확인`,
        step1Title: '외벽 균열 및 손상 확인', step1Desc: '외벽 콘크리트 및 마감재 크랙 분포 상태를 파악합니다.',
        step2Title: '창틀 주변 실리콘 노후 점검', step2Desc: '창틀 샷시 테두리 실리콘 노후 상태를 확인합니다.',
        step3Title: '크랙 정리 및 보수재 주입', step3Desc: '부풀고 부식된 마감면을 정리하고 균열 보수재를 주입합니다.',
        step4Title: '방수재 도포 및 실링 시공', step4Desc: '고탄성 방수 실란트 도포 및 외벽 발수 코팅을 시행합니다.',
        step5Title: '고공 작업 구간 마감 확인', step5Desc: '로프 작업 시공면에 빗물이 유입될 구간이 없는지 최종 검수합니다.',
        faq1Q: `${r} ${taskName}는 벽 전체가 아닌 세대 주변 부분 보수만으로 해결되나요?`,
        faq1Answer: `네, 대부분 특정 세대의 누수 균열은 창틀 상부 3~5미터 반경 내의 크랙이 주요 원인입니다. 올케어는 누수 의심 경로를 정밀 타격하여 합리적인 부분 보수를 시행합니다.`,
        faq2Q: `외벽방수와 외벽보수는 구체적으로 어떻게 다른가요?`,
        faq2Answer: `외벽보수는 균열이나 탈락 부위를 물리적으로 때우는 보수 성격이 강하고, 외벽방수는 빗물 유입 방지를 위해 전체 발수 코팅, 침투성 방수재 도포를 포괄적으로 시행하는 예방 공사입니다.`,
        faq3Q: `외벽 발수제 코팅은 방수 성능 향상에 필수적인가요?`,
        faq3Answer: `네, 적벽돌이나 메지(줄눈) 부위는 빗물을 흡수하므로 고성능 투명 발수제를 주기적으로 도포해주시면 표면 장벽을 형성해 수분 침투를 막고 동파로 인한 균열을 미연에 방지합니다.`,
        faq4Q: `고공 로프 작업 시 주민 협조나 사전 안전 통제가 필요한가요?`,
        faq4Answer: `네, 작업 전 로프 거치 상태와 하부 안전 구역 통제를 기본으로 하며, 입주민분들께 창문 개방 주의 및 차량 이동 안내 등을 성실히 진행하여 사고 없이 안전하게 관리합니다.`,
        faq5Q: `적벽돌 외벽에 생기는 백화 현상도 누수의 직접적인 신호인가요?`,
        faq5Answer: `그렇습니다. 콘크리트나 적벽돌 메지 사이로 빗물이 지속 유입되면서 내부 석회 성분이 녹아 나오는 백화 현상은 이미 물길이 열려 실내 누수로 전이되기 쉬우므로 빠른 보강이 시급합니다.`,
        contactTitle: `${regionTask} 고공 로프 방수 설계`,
        contactDesc: '건물 층수와 외벽 마감재(드라이비트, 타일, 조적 등)를 말씀해 주시면 로프 접근성 검토 결과 및 적정 두께의 맞춤 발수 공법을 친절히 안내합니다.'
      };
    }

    case '외벽누수': {
      return {
        ogImage: 'og-wall.jpg',
        hero: `${r} 외벽누수는 외벽 크랙, 샷시 주변 틈, 창틀 실리콘 노후로 인해 발생할 수 있습니다. 내부 물자국과 실제 외부 유입 위치가 다를 수 있어 현장 점검이 중요합니다.`,
        releakDesc: `비 오는 날 벽면 도배지가 넓게 변색되거나 누렇게 번지는 현상은 샷시 테두리뿐만 아니라 그보다 상부에 위치한 외벽 미세 실크랙에서 시작될 확률이 높습니다.`,
        reLeakBox: `건물 틈새의 습기와 유입 경로를 단순 안쪽 보수로 대처하면 빗물이 옹벽을 돌고 돌아 다른 틈으로 새어나오므로, 외부 로프 안착 진단으로 크랙 시작점을 메워야 해결됩니다.`,
        processTitle: '외벽누수 5단계 물길 탐지 시공',
        processDesc: '실내 누수 벽면 습기 및 백화 조사 → 외벽 옹벽 균열 및 창틀 경계면 검사 → 로프 접근 균열 보수제 충진 → 침투성 코팅 마감 → 유입로 차단 확인',
        step1Title: '실내 젖음 및 백화 현상 조사', step1Desc: '누수 벽지의 수분량 and 백화 흔적을 꼼꼼히 확인합니다.',
        step2Title: '외벽 옹벽 및 창틀 경계 검사', step2Desc: '외벽면 콘크리트 접합부와 창틀 외경계를 로프를 타고 점검합니다.',
        step3Title: '균열 보수재 정밀 주입', step3Desc: '물이 스며드는 외부 크랙에 고수축성 메움재를 단단히 충진합니다.',
        step4Title: '침투 방수 코팅 및 발수 도포', step4Desc: '외벽 전반에 빗물이 스며들지 않도록 방수 피막을 도포합니다.',
        step5Title: '빗물 유입 경로 차단 확인', step5Desc: '최종 유입로가 완전히 밀폐되었는지 다각도로 확인합니다.',
        faq1Q: '외벽누수는 내부 물자국만 보고 원인을 알 수 있나요?',
        faq1Answer: `어렵습니다. 내부 물자국과 실제 외부 유입 위치가 다를 수 있어 외벽 크랙, 창틀 실리콘, 샷시 주변 틈을 종합적으로 함께 확인해야 원인을 정확히 찾아낼 수 있습니다.`,
        faq2Q: '외벽누수는 창틀코킹으로 해결될 수 있나요?',
        faq2Answer: `원인이 창틀 주변 실리콘 노후라면 창틀코킹이 도움될 수 있습니다. 다만 상부 외벽 옹벽 균열이 원인이라면 외벽보수나 방수 작업이 함께 필요할 수 있습니다.`,
        faq3Q: '외벽누수를 오랜 기간 방치하면 어떤 피해가 생기나요?',
        faq3Answer: `외벽 틈새로 유입된 빗물이 시멘트를 계속 약화시키며 내부 철근을 부식시킵니다. 이는 벽지 곰팡이 피해뿐만 아니라 콘크리트 균열을 벌려 건물의 수명을 크게 단축시킵니다.`,
        faq4Q: '외벽 크랙 보수 작업 후 도색이나 미관 훼손 우려는 없나요?',
        faq4Answer: `올케어는 균열 충진 보수 시 주변 외벽 색상과 이질감을 최소화하도록 도막 및 마감재를 신경 써서 처리하며 깔끔하게 마감하기 위해 항상 정성을 다합니다.`,
        faq5Q: '외벽누수 시 윗집의 협조나 동의가 필요한가요?',
        faq5Answer: `네, 누수가 윗집 창틀 테두리나 윗집 외벽 크랙에서 기인한 경우, 정확한 보수를 위해 윗집 세대주분의 로프 작업 동의 및 세대 주변 점검 협조를 미리 조율해주시는 것이 안전합니다.`,
        contactTitle: `${regionTask} 원인 탐색 정밀 진단`,
        contactDesc: '건물 외부 사진과 빗물 유입 흔적을 알려주시면, 내부로 번지는 습기 발생지와 옹벽 크랙 분석을 거쳐 합리적인 보수 솔루션을 안내합니다.'
      };
    }

    case '옥상방수':
    case '옥상누수': {
      const taskName = task;
      return {
        ogImage: 'og-waterproof.jpg',
        hero: `${r} ${taskName}는 기존 방수층의 들뜸, 균열, 배수 불량 상태를 먼저 확인해야 합니다. 단순 덧칠보다 바탕면 정리와 균열 보수 후 방수층을 형성하는 과정이 중요합니다.`,
        releakDesc: `옥상 바닥은 자외선과 사계절 온도차에 그대로 노출되어 하지 정리 없는 방수 덧칠은 내부 가스가 차올라 방수막을 부풀어 오르게 만들고 수명을 단축시킵니다.`,
        reLeakBox: `바닥의 물고임 수평 불량이나 배수관 틈, 파라펫 조인트 균열 등 고질적인 누수 포인트들을 세밀하게 보수하고 바탕을 다진 뒤 도막을 형성해야 합니다.`,
        processTitle: `${taskName} 5단계 방수층 복원 시공`,
        processDesc: `옥상 방수층 균열 및 들뜸 조사 → 배수구와 파라펫 주변 틈새 점검 → 바탕면 샌딩 및 균열 메움 보수 → 우레탄 프라이머 및 도막 도포 → 방수 마감 최종 구배 확인`,
        step1Title: '기존 방수층 들뜸 및 균열 확인', step1Desc: '옥상 우레탄 층의 부풀음과 바닥 크랙 분포를 점검합니다.',
        step2Title: '배수구와 파라펫 주변 점검', step2Desc: '배수 조인트와 난간(파라펫) 모서리 틈을 세밀하게 진단합니다.',
        step3Title: '바탕면 정리 및 균열 보수', step3Desc: '부식 부위를 갈아내고 바탕면 정리 후 균열을 보수합니다.',
        step4Title: '방수층 도포 및 우레탄 시공', step4Desc: '우레탄 방수 하도/중도/상도 처리를 균일하게 도포합니다.',
        step5Title: '마감 상태 및 배수 구배 확인', step5Desc: '최종 마감층 광택 상태와 물 흐름 구배를 철저히 검수합니다.',
        faq1Q: '천장에서 물이 새면 무조건 옥상 문제인가요?',
        faq1Answer: `꼭 그렇지는 않습니다. 옥상 방수층이나 배수구 노후화 외에도 상부 옥상 난간(파라펫) 균열이나 외벽 틈으로 빗물이 타고 흐르는 경우도 있으므로 종합 원인을 점검해봐야 합니다.`,
        faq2Q: '옥상누수는 비가 그친 뒤에도 확인 가능한가요?',
        faq2Answer: `가능합니다. 물자국 흔적, 방수층 균열, 배수구 주변 얼룩, 그리고 내부 천장 변색 상태를 비교해보면 빗물이 스며든 정확한 경로와 원인 부위를 충분히 유추할 수 있습니다.`,
        faq3Q: '옥상 방수를 덧칠하는 시공도 오래 유지가 되나요?',
        faq3Answer: `기존 방수층의 부착 상태에 따라 결정됩니다. 들뜬 곳을 걷어내지 않은 채 그대로 덧바르면 바탕면의 잔여 수분 탓에 내부가 들떠 수명이 급격히 줄어들므로 정밀 샌딩 정리가 필수입니다.`,
        faq4Q: `배수구 주변 물고임 현상이 있는데 옥상 방수 수명에 영향을 주나요?`,
        faq4Answer: `네, 배수구 주변에 물이 상시 고여 있으면 우레탄 방수막이 수분에 장기 노출되어 빨리 부풀어 오르고 썩게 됩니다. 방수 시공 전 바닥 구배(수평)를 꼭 맞춰주어야 합니다.`,
        faq5Q: `옥상 방수 공사는 시공 후 얼마 기간 주기로 보수를 해주어야 하나요?`,
        faq5Answer: `보통 우레탄 방수층은 자외선 영향으로 노화되므로 약 3~5년 주기로 상도(코팅층) 재도장 관리를 해주시면 방수층 중도 두께를 보존하며 반영구적으로 깨끗하게 사용하실 수 있습니다.`,
        contactTitle: `${regionTask} 방수 수명 확보 진단`,
        contactDesc: '옥상 바닥 평수와 우레탄 들뜸 상태를 사진과 함께 문의주시면, 불필요한 전체 시공 대신 내구성을 올리는 정석 면처리 및 크랙 방수 방안을 상세히 안내해 드립니다.'
      };
    }

    default:
      return {
        ogImage: 'og-thumbnail.jpg',
        hero: '겉면보다 유입 지점부터 확인합니다.',
        releakDesc: '눈에 보이는 한 곳만 확인하는 것이 아니라, 빗물이 유입되는 실제 원인을 함께 살펴보는 것이 중요합니다.',
        reLeakBox: '보이는 흔적과 실제 유입 지점이 다를 수 있어, 원인 범위를 함께 확인합니다.',
        processTitle: '원인 확인부터 마감까지, 5단계 공정',
        processDesc: '증상 확인 → 외벽·샷시 점검 → 기존 실리콘 확인 → 상태별 보수 → 마감 검수 순서로 진행합니다.',
        step1Title: '증상 확인', step1Desc: '젖은 위치와 반복 시점을 확인합니다.',
        step2Title: '외벽·샷시 점검', step2Desc: '균열, 접합부, 창틀 상부를 함께 봅니다.',
        step3Title: '기존 실리콘 확인', step3Desc: '들뜸, 경화, 균열 상태를 확인합니다.',
        step4Title: '상태별 보수·코킹', step4Desc: '덧방, 부분 제거, 외벽보수를 구분합니다.',
        step5Title: '마감 검수·안내', step5Desc: '마감 상태와 관리 방법을 안내합니다.',
        faq1Q: '비 온 뒤 언제 점검이 필요할까요?',
        faq1Answer: '비가 온 뒤 창틀 하부나 벽지 주변에 물기가 남고, 외부 실리콘이 갈라졌다면 점검이 필요할 수 있습니다. 창틀뿐 아니라 외벽 균열과 샷시 접합부까지 올케어와 함께 확인하는 것이 좋습니다.',
        faq2Q: '실리콘만 다시 쏘면 해결되나요?',
        faq2Answer: '현장 상태에 따라 다릅니다. 기존 실리콘이 들떠 있거나 외벽 균열이 함께 있다면 표면 보수만으로는 반복될 수 있습니다.',
        faq3Q: '기존에 코킹했는데 다시 새는 이유는 뭔가요?',
        faq3Answer: '기존 실리콘 위에 덧방만 했거나, 물이 들어오는 지점을 확인하지 못한 경우 같은 증상이 반복될 수 있습니다. 올케어는 종합 분석으로 해결책을 찾습니다.',
        faq4Q: '외벽보수와 창틀누수는 어떻게 연결되나요?',
        faq4Answer: '외벽 균열이나 마감 손상으로 들어온 빗물이 샷시 주변을 타고 창틀 하부나 실내 벽지로 나타나는 경우가 있습니다.',
        faq5Q: '전화로 대략 상담이 가능한가요?',
        faq5Answer: '가능합니다. 지역, 증상, 사진 여부를 확인한 뒤 방문 가능 여부와 기본 안내를 도와드립니다.',
        contactTitle: '빗물누수 원인 상담, 원인부터 확인하세요',
        contactDesc: '젖은 위치만 보지 않고, 창틀·샷시·외벽 주변 유입 경로를 함께 확인합니다.'
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
  let title = '';
  let description = '';
  let h1Suffix = '';

  switch (task) {
    case '창틀코킹':
      title = `${region} 창틀코킹, 빗물 유입 전 실리콘 보수 | 올케어`;
      h1Suffix = '실리콘 보수 진단';
      description = `${region} 창틀코킹은 창틀 주변 실리콘이 갈라지거나 들뜬 경우 빗물 유입을 예방하기 위해 필요한 작업입니다. 기존 실리콘 상태와 외벽 접합부를 함께 확인합니다.`;
      break;
    case '창틀누수':
      title = `${region} 창틀누수, 창가 물샘 원인 진단 | 올케어`;
      h1Suffix = '창가 물샘 원인 진단';
      description = `${region} 창틀누수는 창가 물샘의 정확한 원인을 찾아 차단하는 것이 중요합니다. 실내 벽지 젖음과 외부 실리콘 균열, 샷시 유격을 다각도로 진단합니다.`;
      break;
    case '빗물누수':
      title = `${region} 빗물누수, 외벽·창틀 유입 경로 점검 | 올케어`;
      h1Suffix = '외벽·창틀 유입 경로 점검';
      description = `${region} 빗물누수는 유독 비 오는 날 발생하는 천장 및 벽지 젖음의 실제 유입 경로를 추적해야 해결됩니다. 외벽 균열과 창틀 코킹 노후 상태를 면밀히 점검합니다.`;
      break;
    case '창틀실리콘':
      title = `${region} 창틀실리콘, 노후 실리콘 보수 점검 | 올케어`;
      h1Suffix = '노후 실리콘 보수 점검';
      description = `${region} 창틀실리콘은 노후되어 경화된 실리콘 틈새로 빗물이 스며든다면 보수와 점검이 필요합니다. 접착면 이물질 청소와 밀착 시공을 기본으로 합니다.`; // slightly varied just for local-server.js or wait, let's keep it exact to match ssr.js: "노후되어 경화된 실리콘 틈새로 빗물이 스며들지 않도록 꼼꼼한 보수와 점검이 필요합니다. 접착면 이물질 청소와 밀착 시공을 기본으로 합니다."
      break;
    case '샷시실리콘':
      title = `${region} 샷시실리콘, 샷시 접합부 틈새 보수 | 올케어`;
      h1Suffix = '샷시 접합부 틈새 보수';
      description = `${region} 샷시실리콘은 샷시 프레임과 콘크리트 외벽 접합부의 미세한 틈새를 찾아 보수하는 작업입니다. 기존 노후 실리콘 박리 상태를 파악하여 밀착 성능을 높입니다.`;
      break;
    case '외벽보수':
      title = `${region} 외벽보수, 외벽 균열·마감 손상 점검 | 올케어`;
      h1Suffix = '외벽 균열·마감 손상 점검';
      description = `${region} 외벽보수는 적벽돌 균열, 외벽 마감재 탈락 등 실내 누수의 직접적인 원인이 되는 외부 손상 부위를 보수하는 작업입니다. 외벽 크랙을 확인해 안전하게 시공합니다.`;
      break;
    case '옥상방수':
      title = `${region} 옥상방수, 방수층 노후·균열 점검 | 올케어`;
      h1Suffix = '방수층 상태 진단';
      description = `${region} 옥상방수는 기존 방수층의 들뜸, 균열, 배수 불량 상태를 먼저 확인해야 합니다. 바탕면 정리와 균열 보수 후 방수층을 형성하는 과정이 중요합니다.`;
      break;
    case '옥상누수':
      title = `${region} 옥상누수, 비 올 때 천장 누수 원인 확인 | 올케어`;
      h1Suffix = '천장 누수 원인 확인';
      description = `${region} 옥상누수는 천장 누수의 정확한 지점과 옥상 바닥 방수층 결함, 우레탄 들뜸을 종합 분석해 해결합니다. 빗물이 유입되는 정확한 원인 구간을 점검합니다.`;
      break;
    case '외벽방수':
      title = `${region} 외벽방수, 외벽 균열·창틀 주변 방수 점검 | 올케어`;
      h1Suffix = '외벽 균열·창틀 주변 방수 점검';
      description = `${region} 외벽방수는 건물 외벽 균열과 창틀 주변 경계면을 보강해 누수를 예방하는 중요한 조치입니다. 바탕면 정리와 균열 충진, 발수·방수 시공을 종합적으로 진행합니다.`;
      break;
    case '외벽누수':
      title = `${region} 외벽누수, 외벽 크랙·창틀 유입 경로 진단 | 올케어`;
      h1Suffix = '유입 경로 진단';
      description = `${region} 외벽누수는 외벽 크랙, 샷시 주변 틈, 창틀 실리콘 노후로 인해 발생할 수 있습니다. 내부 물자국과 실제 외부 유입 위치가 다를 수 있어 현장 점검이 중요합니다.`;
      break;
    default:
      title = `${regionTask} | 창틀·샷시·외벽 누수 진단 올케어`;
      h1Suffix = '전문 진단';
      description = `${regionTask}, 비 온 뒤 창틀 주변 물기·실리콘 갈라짐·외벽 균열이 보인다면 유입 경로와 현장 상태를 함께 확인해 보수 방향을 안내합니다.`;
  }

  const canonical = `https://www.rainguard.co.kr/?k=${encodeURIComponent(rawK)}`;
  return { title, description, canonical, regionTask, region, task, h1Suffix };
}

/**
 * 작업명별 포트폴리오 이미지 alt 텍스트 세트 반환
 */
function getPortfolioAlts(task, regionTask) {
  const baseMap = {
    '외벽보수': [
      { before: '콘크리트 균열 보수 작업 전 상태', after: '콘크리트 균열 충진 및 방수 마감 후 상태' },
      { before: '노후 창틀 실리콘 들뜸 및 균열 상태', after: '노후 실리콘 제거 후 친환경 실란트 재시공 상태' },
      { before: '외벽 미세 크랙 빗물 누수 유입 구간', after: '외벽 크랙 보수재 충진 및 방수 도포 후 완료' },
    ],
    '빗물누수': [
      { before: '빗물이 유입되는 외벽 균열 상태', after: '외벽 크랙 방수 실링 처리 후 누수 차단 완료' },
      { before: '창틀 주변 실리콘 노화로 인한 틈새', after: '창호 전용 실리콘 광폭 코킹 시공 후 완료' },
      { before: '외벽 적벽돌 줄눈 부식 및 균열 구간', after: '부식된 줄눈 제거 후 방수 몰탈 마감 상태' },
    ],
    '창틀코킹': [
      { before: '기존 외부 코킹 실리콘 들뜸 및 갈라짐', after: '노후 실리콘 완전 제거 후 정석 코킹 완료' },
      { before: '창틀과 외벽 접합부 실리콘 풍화 상태', after: '프라이머 도포 후 고접착 실리콘 실링 상태' },
      { before: '창틀 상부 콘크리트 외벽 미세 크랙', after: '외벽 균열 보수 및 방수 코팅 처리 완료' },
    ],
    '창틀누수': [
      { before: '창틀 하부 빗물 역류 및 물고임 현장', after: '하부 실리콘 방수 코킹 및 샷시 물구멍 정비 후' },
      { before: '샷시 프레임과 골조 사이 유격 상태', after: '우레탄 폼 충진 및 외부 실리콘 광폭 마감 상태' },
      { before: '외벽 크랙을 통해 창틀로 흐르는 누수 경로', after: '외벽 균열부 메움 및 발수제 도포 후 완료' },
    ],
    '창틀실리콘': [
      { before: '햇빛에 노화되어 갈라진 창틀 실리콘', after: '삭은 실리콘 제거 후 고탄성 방수 실란트 마감' },
      { before: '창틀 외부 실리콘 접착 불량으로 들뜬 틈', after: '접착면 이물질 청소 후 실리콘 밀착 도포 완료' },
      { before: '창호 주변 콘크리트 옹벽 균열 상태', after: '옹벽 균열 보수 및 방수 실링 처리 완료' },
    ],
    '샷시실리콘': [
      { before: '샷시 프레임 주변 실리콘 박리 및 벌어짐', after: '창호 전용 고접착 실리콘 광폭 코킹 완료' },
      { before: '샷시 접합부 실리콘 노후화 전경', after: '기존 실리콘 탈거 후 고성능 방수 실란트 마감' },
      { before: '샷시 상단 콘크리트 외벽 균열 구간', after: '외벽 균열 크랙 보수 및 방수 처리 완료' },
    ],
    '옥상방수': [
      { before: '옥상 바닥 우레탄 들뜸 및 균열 상태', after: '우레탄 방수 도포 및 조인트 보강 완료' },
      { before: '옥상 배수구 주변 콘크리트 박리 현장', after: '배수 조인트 정리 후 고탄성 방수 마감' },
      { before: '옥상 난간 조인트 균열 및 누수 지점', after: '난간 크랙 메움 및 방수 코팅 완료' },
    ],
    '옥상누수': [
      { before: '옥상 슬라브 바닥 균열 누수 유입로', after: '슬라브 크랙 보수재 충진 및 방수 마감' },
      { before: '옥상 조인트 방수층 균열 및 들뜸', after: '조인트 탈거 후 고접착 우레탄 실링 완료' },
      { before: '옥상 선홈통 주변 방수 취약 지점', after: '배수 유도 장치 및 코킹 마감 상태' },
    ],
    '외벽방수': [
      { before: '건물 콘크리트 외벽 균열 및 도막 탈락', after: '크랙 보수 및 침투성 외벽 방수 도포 후' },
      { before: '외벽 적벽돌 메지 부식 및 실크랙', after: '메지 균열 메움 및 투명 발수제 도포 완료' },
      { before: '고층 외벽 창호 경계면 코킹 손상', after: '로프 접근 노후 실리콘 제거 후 재코킹' },
    ],
    '외벽누수': [
      { before: '외벽 균열부 빗물 흡수 및 습기 흔적', after: '균열 충진 및 외벽 표면 방수 코팅 완료' },
      { before: '창틀 상부 콘크리트 인장 균열 지점', after: '상부 옹벽 균열 보수 및 방수 마감 상태' },
      { before: '외벽 드라이비트 이음새 틈새 벌어짐', after: '드라이비트 조인트 실링 및 방수 보강 완료' },
    ],
  };
  const alts = baseMap[task] || [
    { before: '외벽 균열 보수 시공 전 사진', after: '외벽 균열 보수 시공 후 사진' },
    { before: '창틀 실리콘 재시공 전 사진', after: '창틀 실리콘 재시공 후 사진' },
    { before: '샷시 접합부 보수 시공 전 사진', after: '샷시 접합부 보수 시공 후 사진' },
  ];
  const prefix = regionTask ? `${regionTask} ` : '';
  return {
    before1: `${prefix}상담 사례 - ${alts[0].before}`,
    after1:  `${prefix}상담 사례 - ${alts[0].after}`,
    before2: `${prefix}상담 사례 - ${alts[1].before}`,
    after2:  `${prefix}상담 사례 - ${alts[1].after}`,
    before3: `${prefix}상담 사례 - ${alts[2].before}`,
    after3:  `${prefix}상담 사례 - ${alts[2].after}`,
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

// Romanizer & Slug Mapping for Seoul pretty URLs
const CHOSUNG = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp',
  's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'
];
const JUNGSUNG = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa',
  'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'
];
const JONGSUNG = [
  '', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'l', 'l',
  'l', 'l', 'l', 'l', 'l', 'm', 'p', 'p', 't', 't',
  'ng', 't', 't', 'k', 't', 'p', 't'
];

function romanize(word) {
  if (word === '서울 중구') return 'seoul-jung-gu';
  
  let syllables = [];
  for (let i = 0; i < word.length; i++) {
    const char = word[i];
    const code = char.charCodeAt(0) - 0xAC00;
    if (code >= 0 && code <= 11172) {
      const cho = Math.floor(code / 588);
      const jung = Math.floor((code % 588) / 28);
      const jong = code % 28;
      syllables.push({ cho, jung, jong, char });
    } else {
      syllables.push(char);
    }
  }

  let parts = [];
  for (let i = 0; i < syllables.length; i++) {
    const s = syllables[i];
    if (typeof s === 'string') {
      parts.push(s);
      continue;
    }

    let choChar = CHOSUNG[s.cho];
    let jungChar = JUNGSUNG[s.jung];
    let jongChar = JONGSUNG[s.jong];

    if (s.char === '십' && i + 1 < syllables.length && syllables[i+1].char === '리') {
      jongChar = 'm';
    }
    if (s.char === '리' && i > 0 && syllables[i-1].char === '십') {
      choChar = 'n';
    }
    if (s.char === '량' && i + 1 < syllables.length && syllables[i+1].char === '리') {
      jongChar = 'ng';
    }
    if (s.char === '리' && i > 0 && syllables[i-1].char === '량') {
      choChar = 'n';
    }

    parts.push(choChar + jungChar + jongChar);
  }

  let mainName = '';
  let suffix = '';
  
  if (word.endsWith('동')) {
    mainName = parts.slice(0, parts.length - 1).join('');
    suffix = '-dong';
  } else if (word.endsWith('구')) {
    mainName = parts.slice(0, parts.length - 1).join('');
    suffix = '-gu';
  } else {
    mainName = parts.join('');
  }

  return mainName + suffix;
}

const SLUG_TO_KOREAN = {};
Object.keys(REGION_MAP).forEach(k => {
  if (REGION_MAP[k] === '서울') {
    const slug = romanize(k);
    SLUG_TO_KOREAN[slug] = k;
  }
});

const TASK_SLUG_MAP = {
  'window-caulking': '창틀코킹',
  'window-leak': '창틀누수',
  'rain-leak': '빗물누수',
  'window-silicone': '창틀실리콘',
  'sash-silicone': '샷시실리콘',
  'exterior-repair': '외벽보수',
  'roof-waterproofing': '옥상방수',
  'exterior-waterproofing': '외벽방수',
  'exterior-leak': '외벽누수',
  'roof-leak': '옥상누수'
};

function getTaskSlug(task) {
  const map = {
    '창틀코킹': 'window-caulking',
    '창틀누수': 'window-leak',
    '빗물누수': 'rain-leak',
    '창틀실리콘': 'window-silicone',
    '샷시실리콘': 'sash-silicone',
    '외벽보수': 'exterior-repair',
    '옥상방수': 'roof-waterproofing',
    '외벽방수': 'exterior-waterproofing',
    '외벽누수': 'exterior-leak',
    '옥상누수': 'roof-leak'
  };
  return map[task] || '';
}

function cleanSeoulRegionName(region) {
  const seoulGus = [
    '종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구',
    '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구',
    '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구'
  ];
  for (const gu of seoulGus) {
    if (region.startsWith(gu + ' ') && region.length > gu.length + 1) {
      return region.substring(gu.length + 1).trim();
    }
  }
  return region;
}

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];

  if (urlPath.startsWith('/seoul/')) {
    const parts = urlPath.split('/').filter(Boolean);
    if (parts.length === 3 && parts[0] === 'seoul') {
      let slug = parts[1];
      const taskSlug = parts[2];
      if (slug.includes('-gu-') && slug.endsWith('-dong')) {
        const subParts = slug.split('-');
        if (subParts.length >= 2) {
          slug = subParts.slice(subParts.length - 2).join('-');
        }
      }
      const regionKorean = SLUG_TO_KOREAN[slug];
      const taskKorean = TASK_SLUG_MAP[taskSlug];
      if (regionKorean && taskKorean) {
        const redirectUrl = `/?k=${encodeURIComponent(regionKorean + '-' + taskKorean)}`;
        res.writeHead(301, { 'Location': redirectUrl });
        res.end();
        return;
      }
    }
  }

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
            if (kValue && (kValue.includes('안세시') || kValue.includes('%EC%95%88%EC%84%B8%EC%8B%9C'))) {
              const decodedK = decodeURIComponent(kValue);
              const correctedK = decodedK.replace(/안세시/g, '안성시');
              res.writeHead(301, { 'Location': `/?k=${encodeURIComponent(correctedK)}` });
              res.end();
              return;
            }
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
          const rawK = kValue;
          const meta = buildDynamicMeta(region, task, rawK);
          const { regionTask } = meta;
          const content = getTaskContent(task, regionTask, region);
          
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
      const ogImageUrl = `https://www.rainguard.co.kr/images/og-thumbnail.jpg?v=2`;
      html = html.replace(
        /<meta property="og:image" data-keyword="region-task-og-image" content="[^"]*">/,
        `<meta property="og:image" data-keyword="region-task-og-image" content="${ogImageUrl}">`
      );

      // ── 5. canonical & og:url ─────────────────────────────────────
      html = html.replace(/CANONICAL_PLACEHOLDER/g, meta.canonical);

      // ── 6. H1 ─────────────────────────────────────────────────────
      const h1Content = `<span class="h1-region">${region}</span> <span class="h1-task">${task}</span> <span class="h1-suffix">${meta.h1Suffix}</span>`;
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

      // ── 8. LEAK CAUSE MAP 원인 설명문 & 강조 박스 — 작업명별 문맥 ──
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-releak-desc"[^>]*>)[\s\S]*?(<\/p>)/,
        `$1${content.releakDesc}$2`
      );
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-releak-box"[^>]*>)[\s\S]*?(<\/p>)/,
        `$1${content.reLeakBox}$2`
      );

      // ── 8b. 지역별 고유 문맥 추가 ──────────────────────────────
      const representativeRegion = getRepresentativeRegion(region);
      const regionContextText = getRegionContextText(representativeRegion, region);
      html = html.replace(
        /(<p[^>]*data-keyword="region-context"[^>]*>)[\s\S]*?(<\/p>)/,
        `$1${regionContextText}$2`
      );

      // ── 9. PROCESS 섹션 설명 — 작업명별 공정 흐름 ───────────────
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-process-desc"[^>]*>)[\s\S]*?(<\/p>)/,
        `$1${content.processDesc}$2`
      );

      // ── 10. Portfolio section title ────────────────────────────────
      let portfolioSuffix = '시공 사례';
      if (task === '창틀코킹') portfolioSuffix = '상담 사례';
      else if (task === '창틀누수') portfolioSuffix = '유입 원인 진단 사례';
      else if (task === '빗물누수') portfolioSuffix = '유입 경로 점검 사례';
      else if (task === '창틀실리콘') portfolioSuffix = '누수 방수 시공 사례';
      else if (task === '샷시실리콘') portfolioSuffix = '외부 실링 보수 사례';
      else if (task === '외벽보수') portfolioSuffix = '및 방수 실링 사례';
      
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-portfolio"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${region} ${task} ${portfolioSuffix}$2`
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

      // ── 11. FAQ 1 질문 & 답변 ─────────────────────────────────────
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-faq1"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${content.faq1Q}$2`
      );
      html = html.replace(
        /(<div[^>]*data-keyword="region-task-faq1-answer"[^>]*>)[\s\S]*?(<\/div>)/,
        `$1\n                ${content.faq1Answer}\n              $2`
      );

      // ── 13. FAQ 3 질문 & 답변 ─────────────────────────────────────
      html = html.replace(
        /(<span[^>]*data-keyword="region-task-faq3"[^>]*>)[\s\S]*?(<\/span>)/,
        `$1${content.faq3Q}$2`
      );
      html = html.replace(
        /(<div[^>]*data-keyword="region-task-faq3-answer"[^>]*>)[\s\S]*?(<\/div>)/,
        `$1\n                ${content.faq3Answer}\n              $2`
      );

      // ── 14. Contact CTA 제목 & 설명문 (PC) ──────────────────────────
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-contact-pc"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${content.contactTitle}$2`
      );
      html = html.replace(
        /(<p[^>]*data-keyword="region-task-contact-desc"[^>]*>)[\s\S]*?(<\/p>)/,
        `$1${content.contactDesc}$2`
      );

      // ── 15. Footer 사업자 정보 동적 유지 ─────────────────────────────
      const profile = resolveBusinessProfileByRegion(region);
      html = html.replace(
        /<span class="footer-company-name">상호명: 올케어 서비스<\/span> \| <span class="footer-company-owner">사업자명: 김재현<\/span> \| <span class="footer-company-number">사업자등록번호: 405-15-02677<\/span>/,
        `<span class="footer-company-name">상호명: ${profile.companyName}</span> | <span class="footer-company-owner">사업자명: ${profile.ownerName}</span> | <span class="footer-company-number">사업자등록번호: ${profile.businessNumber}</span>`
      );

      // ── 16. 연락처 및 카카오톡 채널 동적 분기 ─────────────────────────────
      html = html.replace(/href="tel:010-8460-1530"/g, `href="${profile.phoneHref}"`);
      html = html.replace(/010-8460-1530/g, profile.phone);
      html = html.replace(/http:\/\/pf\.kakao\.com\/_LRmxfX/g, profile.kakaoUrl);
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
