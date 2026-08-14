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
  "수원": "수원", "수원시": "수원", "장안구": "수원", "권선구": "수원", "팔달구": "수원", "영통구": "수원", "광교": "수원", "영통": "수원", "영통동": "수원", "매탄동": "수원",
  "인계동": "수원", "권선동": "수원", "세류동": "수원", "지동": "수원", "우만동": "수원", "망포동": "수원", "정자동": "수원", "조원동": "수원", "율전동": "수원", "화서동": "수원",
  "광교동": "수원", "파장동": "수원", "송죽동": "수원", "원천동": "수원", "매교동": "수원", "곡반정동": "수원", "호매실동": "수원", "금곡동": "수원", "서둔동": "수원", "구운동": "수원",
  "천천동": "수원", "이의동": "수원", "하동": "수원", "화성": "화성", "화성시": "화성", "동탄": "동탄", "병점": "화성", "봉담": "화성", "향남": "화성", "남양": "화성",
  "송산": "화성", "진안동": "화성", "반월동": "화성", "기배동": "화성", "화산동": "화성", "동탄동": "동탄", "새솔동": "화성", "병점동": "화성", "봉담읍": "화성", "향남읍": "화성",
  "남양읍": "화성", "우정읍": "화성", "매송면": "화성", "비봉면": "화성", "마도면": "화성", "송산면": "화성", "서신면": "화성", "팔탄면": "화성", "장안면": "화성", "양감면": "화성",
  "정남면": "화성", "안녕동": "화성", "반송동": "동탄", "석우동": "동탄", "능동": "화성", "기산동": "화성", "오산": "오산", "오산시": "오산", "세교": "오산", "원동": "오산",
  "궐동": "오산", "오산동": "오산", "부산동": "오산", "수청동": "오산", "금암동": "오산", "양산동": "오산", "내삼미동": "오산", "외삼미동": "오산", "누읍동": "오산", "가수동": "오산",
  "갈곶동": "오산", "고현동": "오산", "청호동": "오산", "지곶동": "오산", "서랑동": "오산", "가장동": "오산", "벌음동": "오산", "탑동": "오산", "세교동": "오산", "용인": "용인",
  "용인시": "용인", "처인구": "용인", "기흥구": "용인", "수지구": "용인", "동백": "용인", "죽전": "용인", "신갈동": "용인", "구갈동": "용인", "상갈동": "용인", "하갈동": "용인",
  "기흥동": "용인", "서농동": "용인", "구성동": "용인", "마북동": "용인", "동백동": "용인", "상하동": "용인", "보정동": "용인", "풍덕천동": "용인", "신봉동": "용인", "죽전동": "용인",
  "동천동": "용인", "상현동": "용인", "성복동": "용인", "역삼동": "서울", "역북동": "용인", "삼가동": "용인", "유림동": "용인", "동부동": "용인", "중앙동": "용인", "포곡읍": "용인",
  "모현읍": "용인", "남사읍": "용인", "이동읍": "용인", "원삼면": "용인", "백암면": "용인", "양지면": "용인", "언남동": "용인", "청덕동": "용인", "영덕동": "용인", "서천동": "용인",
  "이천": "이천", "이천시": "이천", "창전동": "이천", "증포동": "이천", "부발": "이천", "마장": "이천", "부발읍": "이천", "마장면": "이천", "관고동": "이천", "중리동": "이천",
  "송정동": "이천", "안흥동": "이천", "갈산동": "이천", "사음동": "이천", "장호원읍": "이천", "신둔면": "이천", "백사면": "이천", "호법면": "이천", "대월면": "이천", "모가면": "이천",
  "설성면": "이천", "율면": "이천", "고담동": "이천", "대포동": "이천", "단월동": "이천", "장록동": "이천", "평택": "평택", "평택시": "평택", "고덕": "평택", "송탄": "평택",
  "안중": "평택", "팽성": "평택", "비전동": "평택", "고덕동": "평택", "통복동": "평택", "군문동": "평택", "합정동": "평택", "동삭동": "평택", "지제동": "평택", "소사동": "평택",
  "용이동": "평택", "죽백동": "평택", "서정동": "평택", "지산동": "평택", "독곡동": "평택", "송북동": "평택", "신장동": "평택", "팽성읍": "평택", "안중읍": "평택", "포승읍": "평택",
  "청북읍": "평택", "진위면": "평택", "서탄면": "평택", "오성면": "평택", "현덕면": "평택", "안성": "안성", "안성시": "안성", "공도": "안성", "대덕": "안성", "금광": "안성",
  "보개": "안성", "안성동": "안성", "공도읍": "안성", "보개면": "안성", "금광면": "안성", "서운면": "안성", "미양면": "안성", "대덕면": "안성", "양성면": "안성", "원곡면": "안성",
  "일죽면": "안성", "죽산면": "안성", "삼죽면": "안성", "아양동": "안성", "석정동": "안성", "당왕동": "안성", "옥산동": "안성", "연지동": "안성", "대천동": "안성", "신소현동": "안성",
  "사곡동": "안성", "금석동": "안성", "인천": "인천", "인천광역시": "인천", "제물포구": "인천", "영종구": "인천", "미추홀구": "인천", "연수구": "인천", "남동구": "인천", "부평구": "인천",
  "계양구": "인천", "서해구": "인천", "검단구": "인천", "강화군": "강화군", "옹진군": "옹진군", "안산": "안산", "안산시": "안산", "상록구": "안산", "단원구": "안산", "시흥": "시흥",
  "시흥시": "시흥", "부천": "부천", "부천시": "부천", "원미구": "부천", "소사구": "부천", "오정구": "부천", "광명": "광명", "광명시": "광명", "군포": "군포", "군포시": "군포",
  "안양": "안양", "안양시": "안양", "만안구": "안양", "동안구": "안양", "과천": "과천", "과천시": "과천", "의왕": "의왕", "의왕시": "의왕", "송도동": "인천", "청라동": "인천",
  "검단동": "인천", "부평동": "인천", "구월동": "인천", "논현동": "인천", "간석동": "인천", "주안동": "인천", "용현동": "인천", "계양동": "인천", "계산동": "인천", "작전동": "인천",
  "영종동": "인천", "운서동": "인천", "만수동": "인천", "삼산동": "인천", "효성동": "인천", "동춘동": "인천", "옥련동": "인천", "연수동": "인천", "청학동": "인천", "도화동": "인천",
  "숭의동": "인천", "학익동": "인천", "고잔동": "안산", "선부동": "안산", "월피동": "안산", "본오동": "안산", "사동": "안산", "이동": "안산", "초지동": "안산", "정왕동": "시흥",
  "배곧동": "시흥", "은행동": "시흥", "대야동": "시흥", "신천동": "시흥", "장곡동": "시흥", "능곡동": "시흥", "중동": "부천", "상동": "부천", "심곡동": "부천", "역곡동": "부천",
  "소사본동": "부천", "철산동": "광명", "하안동": "광명", "소하동": "광명", "광명동": "광명", "산본동": "군포", "금정동": "군포", "당동": "군포", "부곡동": "군포", "평촌동": "안양",
  "호계동": "안양", "비산동": "안양", "관양동": "안양", "안양동": "안양", "박달동": "안양", "석수동": "안양", "별양동": "과천", "갈현동": "과천", "문원동": "과천", "내손동": "의왕",
  "오전동": "의왕", "고천동": "의왕", "청계동": "의왕", "신흥동": "인천", "답동": "인천", "신포동": "인천", "북성동": "인천", "송월동": "인천", "연안동": "인천", "도원동": "인천",
  "율목동": "인천", "동인천동": "인천", "용유동": "인천", "운남동": "인천", "운북동": "인천", "중산동": "인천", "만석동": "인천", "화수동": "인천", "송현동": "인천", "화평동": "인천",
  "창영동": "인천", "송림동": "인천", "선학동": "인천", "장수동": "인천", "서창동": "인천", "도림동": "인천", "남촌동": "인천", "산곡동": "인천", "청천동": "인천", "부개동": "인천",
  "일신동": "인천", "십정동": "인천", "서운동": "인천", "검암동": "인천", "경서동": "인천", "연희동": "인천", "신현동": "광주", "원창동": "인천", "가정동": "인천", "석남동": "인천",
  "가좌동": "인천", "마전동": "인천", "당하동": "인천", "원당동": "인천", "오류동": "인천", "왕길동": "인천", "불로동": "인천", "강화읍": "인천", "선원면": "인천", "불은면": "인천",
  "길상면": "인천", "화도면": "인천", "양도면": "인천", "내가면": "인천", "하점면": "인천", "양사면": "인천", "송해면": "인천", "교동면": "인천", "삼산면": "인천", "서도면": "인천",
  "북도면": "인천", "연평면": "인천", "백령면": "인천", "대청면": "인천", "덕적면": "인천", "자월면": "인천", "영흥면": "인천", "일동": "안산", "성포동": "안산", "안산동": "안산",
  "와동": "안산", "원곡동": "안산", "백운동": "안산", "신길동": "안산", "대부동": "안산", "매화동": "시흥", "목감동": "시흥", "군자동": "시흥", "월곶동": "시흥", "과림동": "시흥",
  "연성동": "시흥", "거북섬동": "시흥", "원미동": "부천", "춘의동": "부천", "도당동": "부천", "약대동": "부천", "범박동": "부천", "옥길동": "부천", "괴안동": "부천", "송내동": "부천",
  "성곡동": "부천", "원종동": "부천", "고강동": "부천", "오정동": "부천", "일직동": "광명", "학온동": "광명", "군포동": "군포", "수리동": "군포", "궁내동": "군포", "광정동": "군포",
  "재궁동": "군포", "오금동": "군포", "송부동": "군포", "부흥동": "안양", "달안동": "안양", "인덕원동": "안양", "부림동": "안양", "귀인동": "안양", "범계동": "안양", "신촌동": "안양",
  "과천동": "과천", "양평": "양평", "양평군": "양평", "양평읍": "양평", "강상면": "양평", "강하면": "양평", "양서면": "양평", "옥천면": "양평", "서종면": "양평", "단월면": "양평",
  "청운면": "양평", "양동면": "양평", "지평면": "양평", "용문면": "양평", "개군면": "양평", "종로": "서울", "종로구": "서울", "중구": "서울", "서울 중구": "서울", "용산": "서울",
  "용산구": "서울", "성동": "서울", "성동구": "서울", "광진": "서울", "광진구": "서울", "동대문": "서울", "동대문구": "서울", "중랑": "서울", "중랑구": "서울", "성북": "서울",
  "성북구": "서울", "강북": "서울", "강북구": "서울", "도봉": "서울", "도봉구": "서울", "노원": "서울", "노원구": "서울", "은평": "서울", "은평구": "서울", "서대문": "서울",
  "서대문구": "서울", "마포": "서울", "마포구": "서울", "양천": "서울", "양천구": "서울", "강서": "서울", "강서구": "서울", "구로": "서울", "구로구": "서울", "금천": "서울",
  "금천구": "서울", "영등포": "서울", "영등포구": "서울", "동작": "서울", "동작구": "서울", "관악": "서울", "관악구": "서울", "서초": "서울", "서초구": "서울", "강남": "서울",
  "강남구": "서울", "송파": "서울", "송파구": "서울", "강동": "서울", "강동구": "서울", "화곡동": "서울", "화양동": "서울", "황학동": "서울", "회기동": "서울", "회현동": "서울",
  "효창동": "서울", "후암동": "서울", "휘경동": "서울", "흑석동": "서울", "광주": "광주", "광주시": "광주", "경기광주": "광주", "초월읍": "광주", "곤지암읍": "광주", "도척면": "광주",
  "퇴촌면": "광주", "남종면": "광주", "남한산성면": "광주", "오포동": "광주", "능평동": "광주", "경안동": "광주", "쌍령동": "광주", "탄벌동": "광주", "광남동": "광주", "여주": "여주",
  "여주시": "여주", "가남읍": "여주", "점동면": "여주", "세종대왕면": "여주", "흥천면": "여주", "금사면": "여주", "산북면": "여주", "대신면": "여주", "북내면": "여주", "강천면": "여주",
  "여흥동": "여주", "오학동": "여주", "하남": "하남", "하남시": "하남", "미사동": "하남", "덕풍동": "하남", "초이동": "하남", "감북동": "하남", "감일동": "하남", "춘궁동": "하남",
  "천현동": "하남", "위례동": "하남", "성남": "성남", "성남시": "성남", "수정구": "성남", "중원구": "성남", "분당구": "성남", "고등동": "성남", "금토동": "성남", "단대동": "성남",
  "둔전동": "성남", "복정동": "성남", "사송동": "성남", "산성동": "성남", "상적동": "성남", "수진동": "성남", "시흥동": "성남", "양지동": "성남", "오야동": "성남", "창곡동": "성남",
  "태평동": "성남", "금광동": "성남", "도촌동": "성남", "상대원동": "성남", "성남동": "성남", "여수동": "성남", "하대원동": "성남", "구미동": "성남", "대장동": "성남", "동원동": "성남",
  "백현동": "성남", "분당동": "성남", "삼평동": "성남", "서현동": "성남", "석운동": "성남", "수내동": "성남", "야탑동": "성남", "운중동": "성남", "율동": "성남", "이매동": "성남",
  "판교동": "성남", "하산운동": "성남"
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
  const gyeonggiCityRegions = ['수원', '성남', '하남', '용인', '화성', '동탄', '평택', '오산', '안성', '이천', '안산', '시흥', '부천', '광명', '군포', '안양', '과천', '의왕'];
  
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
    'SEOUL': `${displayRegion} 지역은 상가, 오피스텔, 다세대, 빌딩이 함께 분포해 창틀 주변 실리콘 노후와 외벽 균열을 함께 확인하는 것이 중요합니다.`,
    'INCHEON': `${displayRegion} 지역은 해풍과 습기 영향으로 외벽 마감재나 창틀 실리콘의 노후가 빠르게 나타날 수 있어 빗물 유입 가능 구간을 함께 확인하는 것이 좋습니다.`,
    'GYEONGGI_CITY': `${displayRegion} 지역은 아파트, 상가, 공장형 건물이 함께 분포해 외벽과 옥상, 창틀 주변 상태를 함께 확인하는 것이 중요합니다.`,
    'GYEONGGI_OUTER': `${displayRegion} 지역은 단독주택, 전원주택, 저층 상가형 건물이 함께 분포해 옥상 방수층과 외벽 마감 상태를 같이 확인하는 것이 중요합니다.`
  };

  return contexts[areaType];
}

function getNearbyRegions(region, representativeRegion) {
  const subRegionMap = {
    '역삼동': ['논현동', '삼성동', '대치동', '개포동'],
    '잠실동': ['신천동', '삼전동', '방이동', '석촌동'],
    '분당': ['판교', '야탑동', '서현동', '수내동', '정자동'],
    '동탄': ['반송동', '석우동', '청계동', '영천동'],
    '곤지암읍': ['초월읍', '도척면', '실촌읍', '쌍령동'],
    '가남읍': ['점동면', '흥천면', '여주', '오학동'],
    '양평읍': ['강상면', '강하면', '옥천면', '용문면']
  };

  if (subRegionMap[region]) {
    return subRegionMap[region];
  }

  const repMap = {
    '서울': ['서초구', '송파구', '강남구', '마포구', '용산구'],
    '인천': ['부평구', '남동구', '연수구', '미추홀구', '서구'],
    '수원': ['영통구', '장안구', '권선구', '팔달구', '인계동'],
    '용인': ['수지구', '기흥구', '처인구', '죽전동', '동백동'],
    '화성': ['동탄동', '병점동', '봉담읍', '향남읍', '남양읍'],
    '오산': ['수청동', '궐동', '원동', '세교동', '갈곶동'],
    '평택': ['비전동', '고덕동', '동삭동', '용이동', '서정동'],
    '안성': ['공도읍', '대덕면', '아양동', '석정동', '옥산동'],
    '이천': ['창전동', '증포동', '부발읍', '마장면', '송정동'],
    '안산': ['고잔동', '선부동', '월피동', '본오동', '초지동'],
    '시흥': ['정왕동', '배곧동', '은행동', '대야동', '신천동'],
    '부천': ['중동', '상동', '심곡동', '역곡동', '소사본동'],
    '광명': ['철산동', '하안동', '소하동', '광명동', '일직동'],
    '군포': ['산본동', '금정동', '당동', '부곡동', '송부동'],
    '안양': ['평촌동', '호계동', '비산동', '관양동', '안양동'],
    '과천': ['별양동', '갈현동', '문원동', '과천동', '부림동'],
    '의왕': ['내손동', '오전동', '고천동', '청계동', '포일동'],
    '양평': ['양평읍', '용문면', '개군면', '강상면', '서종면'],
    '광주': ['경안동', '송정동', '쌍령동', '초월읍', '곤지암읍'],
    '여주': ['여흥동', '오학동', '가남읍', '점동면', '흥천면']
  };

  return repMap[representativeRegion] || ['수원', '용인', '화성', '안산', '평택'];
}

function getRelatedTasks(currentTask) {
  const allTasks = ['창틀코킹', '창틀누수', '빗물누수', '창틀실리콘', '샷시실리콘', '외벽보수', '옥상방수', '외벽방수', '외벽누수', '옥상누수'];
  return allTasks.filter(t => t !== currentTask).slice(0, 4);
};

// 사업자 프로필 데이터 분리 정의
const businessProfiles = {
  default: {
    companyName: "올케어",
    ownerName: "김동명",
    businessNumber: "224-77-00461",
    phone: "010-8460-1530",
    phoneHref: "tel:01084601530",
    kakaoUrl: "http://pf.kakao.com/_LRmxfX"
  },
  gyeonggiZero: {
    companyName: "경기제로도장방수",
    ownerName: "최우영",
    businessNumber: "724-71-00799",
    phone: "050-7871-3590",
    phoneHref: "tel:05078713590",
    kakaoUrl: "http://pf.kakao.com/_xkhUfX"
  }
};

// 지역명 기준으로 해당 권역의 사업자 프로필을 매칭하여 반환
function resolveBusinessProfileByRegion(regionName) {
  if (!regionName) return businessProfiles.default;
  const cleaned = regionName.trim();
  const representativeRegion = REGION_MAP[cleaned] || cleaned;

  // 경기제로도장방수(gyeonggiZero) 예외 프로필 적용 11개 권역 (화성 산하의 동탄 포함)
  const exceptionRegions = ['광주', '양평', '여주', '이천', '용인', '안성', '오산', '화성', '동탄', '평택', '수원', '하남', '성남'];
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
      const taskName = task;
      const isCalk = task === '창틀코킹';
      const isSash = task === '샷시실리콘';
      
      let symptom1 = '실리콘 갈라짐', symptom2 = '창틀 틈새', symptom3 = '코킹 들뜸', symptom4 = '빗물 유입 전 예방';
      if (task === '창틀실리콘') {
        symptom1 = '실리콘 노후'; symptom2 = '샷시 접합부 틈'; symptom3 = '외벽 접합부 갈라짐'; symptom4 = '마감 라인 손상';
      } else if (isSash) {
        symptom1 = '샷시 틈새'; symptom2 = '접합부 노후'; symptom3 = '창틀 하부 물고임'; symptom4 = '외부 실리콘 손상';
      }

      return {
        ogImage: 'og-window.jpg',
        hero: `${r} ${taskName}은 창틀 주변 실리콘이 갈라지거나 들뜬 경우 빗물 유입을 예방하기 위해 필요한 작업입니다. 기존 실리콘 상태와 외벽 접합부를 함께 확인해 보수 범위를 안내합니다.`,
        releakDesc: isSash 
          ? `샷시 프레임 접합부의 미세한 틈새나 노후 실리콘은 누수의 직접적인 원인이 됩니다. 겉면에 덧바르기보다 밀착력을 높여 재시공하는 것이 중요합니다.`
          : `창틀 주변 기존 실리콘 노후로 인한 틈새는 빗물 유입의 주원인이 될 수 있으므로, 비가 내리기 전에 예방 보수를 진행하는 것이 장기적으로 유리합니다.`,
        reLeakBox: isSash
          ? `샷시 흔들림이나 진동에도 틈이 벌어지지 않도록 접착성 높고 신축성이 우수한 실란트 시공이 필수적입니다.`
          : `기존 코킹을 깔끔히 제거하지 않고 덧바르면 노후면이 함께 탈락하여 누수가 반복될 수 있으므로 밀착 정리가 선행되어야 합니다.`,
        
        symptom1, symptom2, symptom3, symptom4,
        stepsCount: 4,
        processTitle: `${taskName} 4단계 실리콘 보수 과정`,
        processDesc: `기존 실리콘 상태 점검 및 제거 → 접착면 이물질 청소 → 프라이머 도포 → 방수 실리콘 코킹 시공 → 최종 마감 틈새 확인`,
        step1Title: '기존 실리콘 들뜸 확인', step1Desc: '실리콘 테두리의 들뜸, 벌어짐, 노화 상태를 확인합니다.',
        step2Title: '노후 실리콘 제거', step2Desc: '밀착력이 떨어지고 삭아버린 기존 코킹재를 깨끗이 걷어냅니다.',
        step3Title: '접합부 정리 후 코킹 시공', step3Desc: '접착면 청소 및 프라이머 도포 후 방수 실란트를 충진합니다.',
        step4Title: '마감 라인과 틈새 확인', step4Desc: '헤라 마감 라인 상태와 미세한 결함 여부를 철저히 검수합니다.',
        
        faq1Q: `${r} ${taskName}은 어떤 경우에 필요한가요?`,
        faq1Answer: `창틀 주변 실리콘이 노후되어 미세한 갈라짐이나 벌어짐이 생기고 비 올 때 빗물이 실내로 들어오는 기미가 보일 때 시공이 꼭 필요합니다.`,
        faq2Q: `${r} ${taskName} 비용은 어떻게 산정되나요?`,
        faq2Answer: `샷시 창틀의 크기, 시공할 창문의 개수, 기존 노후 코킹의 박리 난이도, 로프 고공 장비 진입 조건에 따라 적정한 단가와 비용이 결정됩니다.`,
        faq3Q: `${r} ${taskName} 시 기존 실리콘을 반드시 제거하고 시공하나요?`,
        faq3Answer: `올케어는 노후되어 들뜨거나 갈라진 실리콘을 완전히 제거한 후 시공하는 것을 원칙으로 합니다. 기존 실리콘 위에 덧방만 하면 얼마 못 가 다시 들뜨기 때문입니다.`,
        faq4Q: `${taskName}과 창틀누수 해결은 어떻게 다른가요?`,
        faq4Answer: `${taskName}은 창틀 주변 실리콘 노후를 정비하는 1차 예방 보수이며, 창틀누수 해결은 외벽 옹벽 균열 등 외부 유입 경로까지 함께 추적하여 막는 원인 차단 조치입니다.`,
        faq5Q: `상담 전 어떤 사진을 보내면 확인이 빠른가요?`,
        faq5Answer: `누수가 발생하는 실내 창틀 주변의 젖은 벽지 사진과 건물 전체 외부에서 바라본 해당 창호 전경 사진을 보내주시면 가장 정확한 상태 진단에 큰 도움이 됩니다.`,
        
        contactTitle: `${regionTask} 상담, 비 오기 전에 예방하세요`,
        contactDesc: '들뜸이나 갈라짐 증상을 알려주시면 기존 실리콘 제거 범위와 보수 예산에 맞는 합리적인 코킹 방안을 친절히 안내합니다.'
      };
    }

    case '창틀누수':
    case '빗물누수': {
      const taskName = task;
      const isRain = task === '빗물누수';
      
      const symptom1 = isRain ? '내부 물자국' : '창가 물샘';
      const symptom2 = isRain ? '외벽 유입' : '벽지 얼룩';
      const symptom3 = isRain ? '창틀 주변 틈' : '창틀 하부 고임';
      const symptom4 = isRain ? '비 온 뒤 얼룩' : '비 올 때 반복 누수';

      return {
        ogImage: 'og-waterproof.jpg',
        hero: `${r} ${taskName}는 창틀 하부 물고임, 벽지 얼룩, 샷시 주변 틈으로 인해 반복되는 경우가 많습니다. 내부 흔적만 보지 않고 외부 유입 경로까지 함께 확인해야 합니다.`,
        releakDesc: `실내에서 물이 비치는 곳과 실제로 빗물이 처음 스며들어온 외부 유입 경로는 서로 다를 수 있어 종합적인 물길 추적이 필수적입니다.`,
        reLeakBox: `창틀 하부의 젖은 면만 막기보다 샷시 프레임 안쪽이나 외벽과의 접합 틈새를 함께 살펴보는 것이 누수의 근원 해결책입니다.`,
        
        symptom1, symptom2, symptom3, symptom4,
        stepsCount: 5,
        processTitle: `${taskName} 5단계 물길 탐지 시공`,
        processDesc: `실내 벽지 젖음 위치 파악 → 외부 샷시 접합부 점검 → 외벽 상부 크랙 검수 → 외부 실리콘 보수 및 균열 충진 → 누수 마감 최종 검수`,
        step1Title: '실내 젖음 및 흔적 진단', step1Desc: '벽지 변색과 물고임 위치를 꼼꼼히 파악합니다.',
        step2Title: '외부 프레임 접합부 점검', step2Desc: '샷시 결합 틈새와 코너 부위 벌어짐을 점검합니다.',
        step3Title: '외벽 상부 균열 상세 검수', step3Desc: '창틀 위쪽 콘크리트 외벽의 미세 크랙을 검수합니다.',
        step4Title: '실리콘 보수 및 균열 충진', step4Desc: '물길이 유입되는 크랙과 실리콘 틈새를 방수재로 메웁니다.',
        step5Title: '누수 차단 상태 최종 확인', step5Desc: '시공 마감 부위와 추가 유입 경로 여부를 종합 검수합니다.',
        
        faq1Q: `${r} ${taskName}는 어떤 경우에 필요한가요?`,
        faq1Answer: `비만 오면 창문 주변 벽지가 젖어들거나 창틀 하부에 물이 고이고 아래층으로 번지며 실내 곰팡이 피해가 시작될 때 즉각적인 진단과 조치가 필요합니다.`,
        faq2Q: `${r} ${taskName} 비용은 어떻게 결정되나요?`,
        faq2Answer: `빗물의 외부 유입 통로 개수, 외벽 균열 보강 범위, 샷시 실리콘 시공 규모, 그리고 사다리차나 로프 등 고공 진입 환경을 확인하여 산정합니다.`,
        faq3Q: `${r} ${taskName}는 비 오는 날에도 가능한가요?`,
        faq3Answer: `아닙니다. 외부 방수 시공 및 실리콘 코킹 안착을 위해서는 벽면 콘크리트 피막과 접착면이 건조해야 하므로 날이 갠 뒤 건조 상태에서 시행하는 것이 정석입니다.`,
        faq4Q: `${taskName}와 창틀코킹은 어떻게 다른가요?`,
        faq4Answer: `창틀코킹은 샷시 프레임 주변의 틈을 때우는 예방 실링 작업이고, ${taskName} 해결은 옹벽 크랙 등 빗물이 실내로 들어오는 물길 자체를 찾아 복원하는 공사입니다.`,
        faq5Q: `상담 전 어떤 사진을 보내면 확인이 빠른가요?`,
        faq5Answer: `물이 비치거나 젖어서 색이 변한 방 안쪽 벽면 사진과 외부 창틀 결합부 사진을 보내주시면 물길 추정 및 진단 계획 수립에 매우 유용합니다.`,
        
        contactTitle: `반복되는 ${regionTask} 해결, 종합 물길 진단`,
        contactDesc: '비 온 뒤 내부 습기 및 누수 범위에 대해 알려주시면, 건물 상부 방수층이나 외부 크랙 등 빗물이 들어올 수 있는 여러 가능성을 짚어 상세히 조언해 드립니다.'
      };
    }

    case '외벽보수':
    case '외벽방수': {
      const taskName = task;
      const isRepair = task === '외벽보수';
      
      const symptom1 = isRepair ? '외벽 균열' : '외벽 크랙';
      const symptom2 = isRepair ? '마감재 들뜸' : '방수·발수 필요';
      const symptom3 = isRepair ? '줄눈 노후' : '로프 접근 구간';
      const symptom4 = isRepair ? '창틀 주변 틈' : '빗물 유입 가능부';

      return {
        ogImage: 'og-wall.jpg',
        hero: isRepair
          ? `${r} 외벽보수는 외벽 균열, 마감재 들뜸, 줄눈 노후, 창틀 주변 틈으로 인해 빗물 유입 가능성이 생길 때 필요한 작업입니다. 외부 접근이 어려운 구간은 로프 작업 가능 여부와 안전 조건을 함께 확인합니다.`
          : `${r} 외벽방수는 건물 외벽 균열과 창틀 주변 경계면을 보강해 누수를 예방하는 중요한 조치입니다. 바탕면 정리와 균열 충진, 발수·방수 시공을 종합적으로 진행합니다.`,
        releakDesc: `외벽 마감재인 적벽돌, 콘크리트, 판넬 틈새 등은 자외선과 온도 변화에 따라 크랙이 벌어지고 빗물이 안쪽으로 스며들어 건물 내구성에 손상을 줍니다.`,
        reLeakBox: `로프 고공 작업을 통해 접근해야 하는 외벽면은 흔들림 없는 고정 장치와 안전 조건을 사전 확인하고 방수 실링재 및 기능성 발수 코팅을 도포해야 효과가 큽니다.`,
        
        symptom1, symptom2, symptom3, symptom4,
        stepsCount: 4,
        processTitle: isRepair ? '외벽보수 4단계 점검 및 보수 과정' : '외벽방수 4단계 방수층 보수 과정',
        processDesc: `외벽 손상 상태 진단 → 로프 안전 거치 확보 → 크랙 정리 및 부식 부위 탈거 → 방수 실란트 충진 및 발수제 도포`,
        step1Title: '외벽 균열·마감재 손상 확인', step1Desc: '외벽 콘크리트 및 마감재 크랙 분포 상태를 파악합니다.',
        step2Title: '창틀 주변 틈과 줄눈 상태 점검', step2Desc: '창틀 샷시 테두리 실리콘 및 줄눈 노후 상태를 확인합니다.',
        step3Title: '크랙 보수 및 마감재 보강', step3Desc: '부풀고 부식된 마감면을 정리하고 균열 보수재를 주입합니다.',
        step4Title: '빗물 유입 가능 구간 재확인', step4Desc: '로프 작업 시공면에 빗물이 유입될 구간이 없는지 최종 검수합니다.',
        
        faq1Q: `${r} ${taskName}는 어떤 경우에 필요한가요?`,
        faq1Answer: `건물 외벽 콘크리트의 미세한 크랙이 관찰되거나 적벽돌 메지(줄눈)가 낡아 부스러지고 빗물이 벽면을 타고 실내로 스며들어 벽지를 적실 때 시공해야 합니다.`,
        faq2Q: `${r} ${taskName} 비용은 어떻게 결정되나요?`,
        faq2Answer: `보수 또는 방수 피막을 도포할 전체 면적 크기, 외벽 틈새 충진재 주입량, 건물 높이 및 형태에 따른 고공 로프 장비 접근 난이도 등을 종합 산정합니다.`,
        faq3Q: `${r} ${taskName}는 비 오는 날에도 가능한가요?`,
        faq3Answer: `아닙니다. 시멘트 균열 보수재 및 투명 발수제가 빗물에 씻겨가지 않고 콘크리트에 깊이 침투해 안착되려면 외벽면이 바짝 마른 맑은 날 시공해야 효과적입니다.`,
        faq4Q: `${taskName}와 외벽누수 해결은 어떻게 다른가요?`,
        faq4Answer: `${taskName}는 건물 노후화를 방지하고 방수 성능을 유지하기 위해 표면을 강화하는 선제 공사이며, 외벽누수 해결은 이미 내부로 새는 빗물의 시작점을 타격하는 조치입니다.`,
        faq5Q: `상담 전 어떤 사진을 보내면 확인이 빠른가요?`,
        faq5Answer: `건물 외부 전경 사진(진입 여건 확인용)과 크랙이나 박리가 발생한 외벽 손상부 확대 사진을 촬영해 보내주시면 기술 진단에 신속히 임하겠습니다.`,
        
        contactTitle: `${regionTask} 고공 로프 방수 설계`,
        contactDesc: '건물 층수와 외벽 마감재(드라이비트, 타일, 조적 등)를 말씀해 주시면 로프 접근성 검토 결과 및 적정 두께의 맞춤 발수 공법을 친절히 안내합니다.'
      };
    }

    case '외벽누수': {
      return {
        ogImage: 'og-wall.jpg',
        hero: `${r} 외벽누수는 외벽 크랙, 샷시 주변 틈, 창틀 실리콘 노후로 인해 발생할 수 있습니다. 내부 물자국과 실제 외부 유입 위치가 다를 수 있어 현장 점검을 통해 원인을 분리해야 합니다.`,
        releakDesc: `비 오는 날 벽면 도배지가 넓게 변색되거나 누렇게 번지는 현상은 샷시 테두리뿐만 아니라 그보다 상부에 위치한 외벽 미세 실크랙에서 시작될 확률이 높습니다.`,
        reLeakBox: `건물 틈새의 습기와 유입 경로를 단순 안쪽 보수로 대처하면 빗물이 옹벽을 돌고 돌아 다른 틈으로 새어나오므로, 외부 로프 안착 진단으로 크랙 시작점을 메워야 해결됩니다.`,
        
        symptom1: '내부 물자국', symptom2: '외벽 크랙', symptom3: '샷시 주변 틈', symptom4: '상층부 유입',
        stepsCount: 5,
        processTitle: '외벽누수 5단계 물길 탐지 시공',
        processDesc: '실내 누수 벽면 습기 및 백화 조사 → 외벽 옹벽 균열 및 창틀 경계면 검사 → 로프 접근 균열 보수제 충진 → 침투성 코팅 마감 → 유입로 차단 확인',
        step1Title: '실내 젖음 및 백화 현상 조사', step1Desc: '누수 벽지의 수분량 and 백화 흔적을 꼼꼼히 확인합니다.',
        step2Title: '외벽 옹벽 및 창틀 경계 검사', step2Desc: '외벽면 콘크리트 접합부와 창틀 외경계를 로프를 타고 점검합니다.',
        step3Title: '균열 보수재 정밀 주입', step3Desc: '물이 스며드는 외부 크랙에 고수축성 메움재를 단단히 충진합니다.',
        step4Title: '침투 방수 코팅 및 발수 도포', step4Desc: '외벽 전반에 빗물이 스며들지 않도록 방수 피막을 도포합니다.',
        step5Title: '빗물 유입 경로 차단 확인', step5Desc: '최종 유입로가 완전히 밀폐되었는지 다각도로 확인합니다.',
        
        faq1Q: `${r} 외벽누수는 어떤 경우에 필요한가요?`,
        faq1Answer: `비 오는 날 세대 벽면 도배지가 넓게 변색되거나 누렇게 번지는 등 샷시뿐만 아니라 상부 옹벽 균열 틈으로 지속적인 빗물이 타고 스며들 때 조치가 급선무입니다.`,
        faq2Q: `${r} 외벽누수 비용은 어떻게 결정되나요?`,
        faq2Answer: `누수 시작점 위치의 탐지 난이도, 주입해야 할 균열 메움재 수량, 그리고 외벽 접근을 위한 로프 거치대 확보 등 작업 여건에 맞춰 결정됩니다.`,
        faq3Q: `${r} 외벽누수는 비 오는 날에도 가능한가요?`,
        faq3Answer: `아닙니다. 외부 크랙을 보강하고 침투 방수 코팅 피막이 안정적으로 경화되려면 골조 내부 습기가 마르고 외벽 표면이 건조한 맑은 날씨에 진행해야 합니다.`,
        faq4Q: `외벽누수 해결과 외벽방수는 어떻게 다른가요?`,
        faq4Answer: `외벽방수는 건물 전반의 방수 피막 성능을 높여주는 예방 공사이며, 외벽누수 해결은 이미 발생한 빗물 유입 경로를 추적해 해당 균열 지점의 물길을 잡는 부분 표적 시공입니다.`,
        faq5Q: `상담 전 어떤 사진을 보내면 확인이 빠른가요?`,
        faq5Answer: `누수 흔적이 있는 실내 벽면 사진과 건물의 전체적인 전경 뷰 사진을 함께 보내주시면 현장 장비 접근 여건 진단 및 물길 분석에 크게 도움됩니다.`,
        
        contactTitle: `${regionTask} 원인 탐색 정밀 진단`,
        contactDesc: '건물 외부 사진과 빗물 유입 흔적을 알려주시면, 내부로 번지는 습기 발생지와 옹벽 크랙 분석을 거쳐 합리적인 보수 솔루션을 안내합니다.'
      };
    }

    case '옥상방수':
    case '옥상누수': {
      const taskName = task;
      const isProof = task === '옥상방수';
      
      const symptom1 = isProof ? '방수층 들뜸' : '천장 물샘';
      const symptom2 = isProof ? '바닥 균열' : '방수층 파손';
      const symptom3 = isProof ? '배수구 주변 틈' : '배수 불량';
      const symptom4 = isProof ? '파라펫 손상' : '비 온 뒤 누수 흔적';

      return {
        ogImage: 'og-waterproof.jpg',
        hero: isProof
          ? `${r} 옥상방수는 기존 방수층의 들뜸, 균열, 배수 불량 상태를 먼저 확인해야 합니다. 단순 덧칠보다 바탕면 정리와 균열 보수 후 방수층을 형성하는 과정이 중요합니다.`
          : `${r} 옥상누수는 천장 누수의 정확한 지점과 옥상 바닥 방수층 결함, 우레탄 들뜸을 종합 분석해 해결합니다. 빗물이 유입되는 정확한 원인 구간을 점검합니다.`,
        releakDesc: `옥상 바닥은 자외선과 사계절 온도차에 그대로 노출되어 하지 정리 없는 방수 덧칠은 내부 가스가 차올라 방수막을 부풀어 오르게 만들고 수명을 단축시킵니다.`,
        reLeakBox: `바닥의 물고임 수평 불량이나 배수구 주변 틈새, 파라펫 조인트 균열 등 고질적인 누수 포인트들을 세밀하게 보수하고 바탕을 다진 뒤 도막을 형성해야 합니다.`,
        
        symptom1, symptom2, symptom3, symptom4,
        stepsCount: 4,
        processTitle: isProof ? '옥상방수 4단계 방수층 보수 과정' : '옥상누수 4단계 방수층 보수 과정',
        processDesc: `옥상 방수층 균열 및 들뜸 조사 → 배수구와 파라펫 주변 틈새 점검 → 바탕면 샌딩 및 균열 메움 보수 → 방수층 형성 후 마감 상태 확인`,
        step1Title: '기존 방수층 들뜸·균열 확인', step1Desc: '옥상 우레탄 층의 부풀음과 바닥 크랙 분포를 점검합니다.',
        step2Title: '배수구와 파라펫 주변 점검', step2Desc: '배수 조인트와 난간(파라펫) 모서리 틈을 세밀하게 진단합니다.',
        step3Title: '바탕면 정리 및 균열 보수', step3Desc: '부식 부위를 갈아내고 바탕면 정리 후 균열을 보수합니다.',
        step4Title: '방수층 형성 후 마감 상태 확인', step4Desc: '방수재 도포 공정 완료 후 방수막 안착 상태를 철저히 검수합니다.',
        
        faq1Q: `${r} ${taskName}는 어떤 상태에서 필요한가요?`,
        faq1Answer: `기존 우레탄 방수막이 들떠서 찢어지거나 옥상 바닥 콘크리트에 큰 균열이 생기고 비 올 때 최상층 천장에 누수 자국이나 물방울이 맺히기 시작할 때 긴급 조치가 필요합니다.`,
        faq2Q: `${r} ${taskName} 비용은 어떻게 결정되나요?`,
        faq2Answer: `바닥 면적 평수, 기존 방수층 철거(하상 샌딩) 분량, 바닥 균열의 상태 및 레벨링 보수 범위, 우레탄 방수재 도포 두께 기준에 따라 단가가 책정됩니다.`,
        faq3Q: `${r} ${taskName}는 기존 방수층 위에 바로 시공해도 되나요?`,
        faq3Answer: `바탕면의 잔여 수분 탓에 내부가 들떠 수명이 급격히 줄어들므로 부식되거나 부풀어 오른 들뜬 부위는 반드시 걷어내고 표면 샌딩 작업을 완료한 후에 후속 공정을 이어가야 오래갑니다.`,
        faq4Q: `${taskName}와 옥상누수는 어떻게 다른가요?`,
        faq4Answer: `옥상방수는 옥상 바닥 전반에 고탄성 방수 피막을 입혀 물 유입을 선제 차단하는 면적 단위 공사이며, 옥상누수 해결은 천장 젖음의 국소적 원인과 물길을 해결하는 표적 작업입니다.`,
        faq5Q: `상담 전 어떤 사진을 보내면 확인이 빠른가요?`,
        faq5Answer: `현재 옥상 바닥의 방수 상태(부풀어 오른 부위 등) 전경 사진과 실내 천장의 누수 흔적 벽지 사진을 보내주시면 시공 계획 수립에 매우 큰 도움이 됩니다.`,
        
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
        
        symptom1: '증상 확인', symptom2: '외벽·샷시 점검', symptom3: '기존 실리콘 확인', symptom4: '상태별 보수',
        stepsCount: 5,
        processTitle: '원인 확인부터 마감까지, 5단계 공정',
        processDesc: '증상 확인 → 외벽·샷시 점검 → 기존 실리콘 확인 → 상태별 보수 → 마감 검수 순서로 진행합니다.',
        step1Title: '증상 확인', step1Desc: '젖은 위치와 반복 시점을 확인합니다.',
        step2Title: '외벽·샷시 점검', step2Desc: '균열, 접합부, 창틀 상부를 함께 봅니다.',
        step3Title: '기존 실리콘 확인', step3Desc: '들뜸, 경화, 균열 상태를 확인합니다.',
        step4Title: '상태별 보수·코킹', step4Desc: '덧방, 부분 제거, 외벽보수를 구분합니다.',
        step5Title: '마감 검수·안내', step5Desc: '마감 상태와 관리 방법을 안내합니다.',
        
        faq1Q: '천장에서 물이 새면 무조건 옥상 문제인가요?',
        faq1Answer: '꼭 그렇지는 않습니다. 옥상 방수층이나 배수구 노후화 외에도 상부 옥상 난간(파라펫) 균열이나 외벽 틈으로 빗물이 타고 흐르는 경우도 있으므로 종합 원인을 점검해봐야 합니다.',
        faq2Q: '옥상누수는 비가 그친 뒤에도 확인 가능한가요?',
        faq2Answer: '가능합니다. 물자국 흔적, 방수층 균열, 배수구 주변 얼룩, 그리고 내부 천장 변색 상태를 비교해보면 빗물이 스며든 정확한 경로와 원인 부위를 충분히 유추할 수 있습니다.',
        faq3Q: '옥상 방수를 덧칠하는 시공도 오래 유지가 되나요?',
        faq3Answer: '기존 방수층의 부착 상태에 따라 결정됩니다. 들뜬 곳을 걷어내지 않은 채 그대로 덧바르면 바탕면의 잔여 수분 탓에 내부가 들떠 수명이 급격히 줄어들므로 정밀 샌딩 정리가 필수입니다.',
        faq4Q: '배수구 주변 물고임 현상이 있는데 옥상 방수 수명에 영향을 주나요?',
        faq4Answer: '네, 배수구 주변에 물이 상시 고여 있으면 우레탄 방수막이 수분에 장기 노출되어 빨리 부풀어 오르고 썩게 됩니다. 방수 시공 전 바닥 구배(수평)를 꼭 맞춰주어야 합니다.',
        faq5Q: '옥상 방수 공사는 시공 후 얼마 기간 주기로 보수를 해주어야 하나요?',
        faq5Answer: '보통 우레탄 방수층은 자외선 영향으로 노화되므로 약 3~5년 주기로 상도(코팅층) 재도장 관리를 해주시면 방수층 중도 두께를 보존하며 반영구적으로 깨끗하게 사용하실 수 있습니다.',
        
        contactTitle: `${regionTask} 맞춤형 견적 설계`,
        contactDesc: '세부적인 증상 사진이나 젖는 빈도를 알려주시면 상황에 맞는 합리적인 예방 방안을 세밀히 안내합니다.'
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
      h1Suffix = '전문 진단';
      description = `${region} 창틀코킹은 창틀 주변 실리콘이 갈라지거나 들뜬 경우 빗물 유입을 예방하기 위해 필요한 작업입니다.`;
      break;
    case '창틀누수':
      title = `${region} 창틀누수, 창가 물샘 원인 진단 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 창틀누수는 창가 물샘의 정확한 원인을 찾아 차단하는 것이 중요합니다. 실내 벽지 젖음과 외부 실리콘 균열, 샷시 유격을 다각도로 진단합니다.`;
      break;
    case '빗물누수':
      title = `${region} 빗물누수, 외벽·창틀 유입 경로 점검 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 빗물누수는 유독 비 오는 날 발생하는 천장 및 벽지 젖음의 실제 유입 경로를 추적해야 해결됩니다. 외벽 균열과 창틀 코킹 노후 상태를 면밀히 점검합니다.`;
      break;
    case '창틀실리콘':
      title = `${region} 창틀실리콘, 노후 실리콘 보수 점검 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 창틀실리콘은 노후되어 경화된 실리콘 틈새로 빗물이 스며들지 않도록 꼼꼼한 보수와 점검이 필요합니다. 접착면 이물질 청소와 밀착 시공을 기본으로 합니다.`;
      break;
    case '샷시실리콘':
      title = `${region} 샷시실리콘, 샷시 접합부 틈새 보수 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 샷시실리콘은 샷시 프레임과 콘크리트 외벽 접합부의 미세한 틈새를 찾아 보수하는 작업입니다. 기존 노후 실리콘 박리 상태를 파악하여 밀착 성능을 높입니다.`;
      break;
    case '외벽보수':
      title = `${region} 외벽보수, 외벽 균열·마감 손상 점검 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 외벽보수는 외벽 균열, 마감재 들뜸, 줄눈 노후, 창틀 주변 틈으로 인한 빗물 유입 가능성을 함께 확인해야 합니다.`;
      break;
    case '옥상방수':
      title = `${region} 옥상방수, 방수층 노후·균열 점검 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 옥상방수는 기존 방수층의 들뜸, 균열, 배수 불량 상태를 먼저 확인해야 합니다. 바탕면 정리와 균열 보수 후 방수층을 형성하는 과정이 중요합니다.`;
      break;
    case '옥상누수':
      title = `${region} 옥상누수, 비 올 때 천장 누수 원인 확인 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 옥상누수는 천장 누수의 정확한 지점과 옥상 바닥 방수층 결함, 우레탄 들뜸을 종합 분석해 해결합니다. 빗물이 유입되는 정확한 원인 구간을 점검합니다.`;
      break;
    case '외벽방수':
      title = `${region} 외벽방수, 외벽 균열·창틀 주변 방수 점검 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 외벽방수는 건물 외벽 균열과 창틀 주변 경계면을 보강해 누수를 예방하는 중요한 조치입니다. 바탕면 정리와 균열 충진, 발수·방수 시공을 종합적으로 진행합니다.`;
      break;
    case '외벽누수':
      title = `${region} 외벽누수, 외벽 크랙·창틀 유입 경로 진단 | 올케어`;
      h1Suffix = '전문 진단';
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
  const rt = regionTask || '올케어';
  return {
    before1: `${rt} 작업 전 상태 점검 및 확인`,
    after1: `${rt} 작업 현장 시공 마감 완료`,
    before2: `${rt} 점검 이미지 및 누수 분석`,
    after2: `${rt} 보수 사례 실리콘 코킹 마감`,
    before3: `${rt} 노후 균열 및 들뜸 조사`,
    after3: `${rt} 빗물 누수 차단 최종 마감`
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
      let ogImageFile = 'og-thumbnail.jpg';
      if (['창틀코킹', '창틀실리콘', '샷시실리콘'].includes(task)) {
        ogImageFile = 'og-window.jpg';
      } else if (['창틀누수', '빗물누수'].includes(task)) {
        ogImageFile = 'og-waterproof.jpg';
      } else if (['외벽보수', '외벽방수', '외벽누수'].includes(task)) {
        ogImageFile = 'og-wall.jpg';
      } else if (['옥상방수', '옥상누수'].includes(task)) {
        ogImageFile = 'og-waterproof.jpg';
      }
      const ogImageUrl = `https://www.rainguard.co.kr/images/${ogImageFile}`;
      html = html.replace(
        /<meta property="og:image" data-keyword="region-task-og-image" content="[^"]*">/,
        `<meta property="og:image" data-keyword="region-task-og-image" content="${ogImageUrl}">`
      );
      html = html.replace(
        /<link rel="image_src" href="[^"]*">/,
        `<link rel="image_src" href="${ogImageUrl}">`
      );

      // ── 4b. 구조화 데이터(JSON-LD) 생성 및 치환 ────────────────────────────
      const schemaProfile = resolveBusinessProfileByRegion(region);
      const schemaTelephone = schemaProfile.companyName === '경기제로도장방수' ? '010-7776-3029' : '010-8460-1530';

      const schemaJsonLDs = [
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "올케어 홈",
              "item": "https://www.rainguard.co.kr/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": task,
              "item": `https://www.rainguard.co.kr/?k=${encodeURIComponent(rawK)}`
            }
          ]
        },
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": `${region} ${task}`,
          "areaServed": region,
          "provider": {
            "@type": "LocalBusiness",
            "name": schemaProfile.companyName,
            "telephone": schemaTelephone
          }
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": content.faq1Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": content.faq1Answer
              }
            },
            {
              "@type": "Question",
              "name": content.faq2Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": content.faq2Answer
              }
            },
            {
              "@type": "Question",
              "name": content.faq3Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": content.faq3Answer
              }
            },
            {
              "@type": "Question",
              "name": content.faq4Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": content.faq4Answer
              }
            },
            {
              "@type": "Question",
              "name": content.faq5Q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": content.faq5Answer
              }
            }
          ]
        }
      ];

      const schemaScripts = schemaJsonLDs.map(schema => {
        return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
      }).join('\n');

      html = html.replace('<!-- SCHEMA_PLACEHOLDER -->', schemaScripts);

      // ── 5. canonical & og:url ─────────────────────────────────────
      html = html.replace(/CANONICAL_PLACEHOLDER/g, meta.canonical);

      // ── 5a. 증상 카드 4개 치환 ──────────────────────────────
      html = html.replace(
        /(<h3[^>]*data-keyword="symptom-1"[^>]*>)[\s\S]*?(<\/h3>)/,
        `$1${content.symptom1}$2`
      );
      html = html.replace(
        /(<h3[^>]*data-keyword="symptom-2"[^>]*>)[\s\S]*?(<\/h3>)/,
        `$1${content.symptom2}$2`
      );
      html = html.replace(
        /(<h3[^>]*data-keyword="symptom-3"[^>]*>)[\s\S]*?(<\/h3>)/,
        `$1${content.symptom3}$2`
      );
      html = html.replace(
        /(<h3[^>]*data-keyword="symptom-4"[^>]*>)[\s\S]*?(<\/h3>)/,
        `$1${content.symptom4}$2`
      );

      // ── 5b. 공정 4단계 vs 5단계 스위치 ─────────────────────────
      const is4Step = content.stepsCount === 4;
      html = html.replace(
        /style="\/\*step5-style\*\/"/g,
        is4Step ? 'style="display: none;"' : 'style=""'
      );

      // ── 5c. PROCESS 단계 타이틀 & 설명 치환 ─────────────────────
      for (let i = 1; i <= 5; i++) {
        html = html.replace(
          new RegExp(`(<h3[^>]*data-keyword="process-step${i}-title"[^>]*>)[\\s\\S]*?(<\\/h3>)`),
          `$1${content['step' + i + 'Title'] || ''}$2`
        );
        html = html.replace(
          new RegExp(`(<p[^>]*data-keyword="process-step${i}-desc"[^>]*>)[\\s\\S]*?(<\\/p>)`),
          `$1${content['step' + i + 'Desc'] || ''}$2`
        );
      }

      // ── 5d. PROCESS H2 제목 치환 ─────────────────────────────────
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-process-title"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${content.processTitle}$2`
      );

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

      // ── 8c. SEO Quick Links 및 FAQ 타이틀 치환 ────────────────────────
      html = html.replace(
        /(<nav[^>]*data-keyword="seo-quick-links"[^>]*>)/,
        `<nav class="seo-quick-links" data-keyword="seo-quick-links" aria-label="${region} ${task} 핵심 메뉴">`
      );
      html = html.replace(
        /(<a[^>]*data-keyword="seo-link-process"[^>]*>)[\s\S]*?(<\/a>)/,
        `$1${content.processTitle}$2`
      );
      html = html.replace(
        /(<a[^>]*data-keyword="seo-link-faq"[^>]*>)[\s\S]*?(<\/a>)/,
        `$1${task} 관련 궁금증 해결$2`
      );
      html = html.replace(
        /(<a[^>]*data-keyword="seo-link-quote"[^>]*>)[\s\S]*?(<\/a>)/,
        `$1${region} ${task} 실시간 견적$2`
      );
      html = html.replace(
        /(<h2[^>]*data-keyword="region-task-faq-title"[^>]*>)[\s\S]*?(<\/h2>)/,
        `$1${task} 관련 궁금증 해결$2`
      );

      // ── 8d. 하단 관련 작업 및 주변 지역 내부 링크 치환 ──────────────────
      const relatedTasks = getRelatedTasks(task);
      const relatedHtml = relatedTasks.map(t => {
        return `<a href="?k=${encodeURIComponent(region + '-' + t)}">${region} ${t}</a>`;
      }).join('\n            ');

      const nearbyRegions = getNearbyRegions(region, representativeRegion);
      const nearbyHtml = nearbyRegions.map(r => {
        return `<a href="?k=${encodeURIComponent(r + '-' + task)}">${r} ${task}</a>`;
      }).join('\n            ');

      html = html.replace(
        /(<div[^>]*data-keyword="region-task-related-links"[^>]*>)[\s\S]*?(<\/div>)/,
        `$1\n            ${relatedHtml}\n          $2`
      );
      html = html.replace(
        /(<div[^>]*data-keyword="region-task-nearby-links"[^>]*>)[\s\S]*?(<\/div>)/,
        `$1\n            ${nearbyHtml}\n          $2`
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
