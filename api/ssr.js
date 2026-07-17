const fs = require('fs');
const path = require('path');

const REGION_MAP = {
  "수원": "수원", "수원시": "수원", "장안구": "수원", "권선구": "수원", "팔달구": "수원", "영통구": "수원", "광교": "수원", "영통": "수원", "영통동": "수원", "매탄동": "수원", "인계동": "수원", "권선동": "수원", "세류동": "수원", "지동": "수원", "우만동": "수원", "망포동": "수원", "정자동": "수원", "조원동": "수원", "율전동": "수원", "화서동": "수원", "광교동": "수원", "파장동": "수원", "송죽동": "수원", "원천동": "수원", "매교동": "수원", "곡반정동": "수원", "호매실동": "수원", "금곡동": "수원", "서둔동": "수원", "구운동": "수원", "천천동": "수원", "이의동": "수원", "하동": "수원", "화성": "화성", "화성시": "화성", "동탄": "동탄", "병점": "화성", "봉담": "화성", "향남": "화성", "남양": "화성", "송산": "화성", "진안동": "화성", "반월동": "화성", "기배동": "화성", "화산동": "화성", "동탄동": "동탄", "새솔동": "화성", "병점동": "화성", "봉담읍": "화성", "향남읍": "화성", "남양읍": "화성", "우정읍": "화성", "매송면": "화성", "비봉면": "화성", "마도면": "화성", "송산면": "화성", "서신면": "화성", "팔탄면": "화성", "장안면": "화성", "양감면": "화성", "정남면": "화성", "안녕동": "화성", "반송동": "동탄", "석우동": "동탄", "능동": "화성", "기산동": "화성", "오산": "오산", "오산시": "오산", "세교": "오산", "원동": "오산", "궐동": "오산", "오산동": "오산", "부산동": "오산", "수청동": "오산", "금암동": "오산", "양산동": "오산", "내삼미동": "오산", "외삼미동": "오산", "누읍동": "오산", "가수동": "오산", "갈곶동": "오산", "고현동": "오산", "청호동": "오산", "지곶동": "오산", "서랑동": "오산", "가장동": "오산", "벌음동": "오산", "탑동": "오산", "세교동": "오산", "용인": "용인", "용인시": "용인", "처인구": "용인", "기흥구": "용인", "수지구": "용인", "동백": "용인", "죽전": "용인", "신갈동": "용인", "구갈동": "용인", "상갈동": "용인", "하갈동": "용인", "기흥동": "용인", "서농동": "용인", "구성동": "용인", "마북동": "용인", "동백동": "용인", "상하동": "용인", "보정동": "용인", "풍덕천동": "용인", "신봉동": "용인", "죽전동": "용인", "동천동": "용인", "상현동": "용인", "성복동": "용인", "역삼동": "용인", "역북동": "용인", "삼가동": "용인", "유림동": "용인", "동부동": "용인", "중앙동": "용인", "포곡읍": "용인", "모현읍": "용인", "남사읍": "용인", "이동읍": "용인", "원삼면": "용인", "백암면": "용인", "양지면": "용인", "언남동": "용인", "청덕동": "용인", "영덕동": "용인", "서천동": "용인", "이천": "이천", "이천시": "이천", "창전동": "이천", "증포동": "이천", "부발": "이천", "마장": "이천", "부발읍": "이천", "마장면": "이천", "관고동": "이천", "중리동": "이천", "송정동": "이천", "안흥동": "이천", "갈산동": "이천", "사음동": "이천", "장호원읍": "이천", "신둔면": "이천", "백사면": "이천", "호법면": "이천", "대월면": "이천", "모가면": "이천", "설성면": "이천", "율면": "이천", "고담동": "이천", "대포동": "이천", "단월동": "이천", "장록동": "이천", "평택": "평택", "평택시": "평택", "고덕": "평택", "송탄": "평택", "안중": "평택", "팽성": "평택", "비전동": "평택", "고덕동": "평택", "통복동": "평택", "군문동": "평택", "합정동": "평택", "동삭동": "평택", "지제동": "평택", "소사동": "평택", "용이동": "평택", "죽백동": "평택", "서정동": "평택", "지산동": "평택", "독곡동": "평택", "송북동": "평택", "신장동": "평택", "팽성읍": "평택", "안중읍": "평택", "포승읍": "평택", "청북읍": "평택", "진위면": "평택", "서탄면": "평택", "오성면": "평택", "현덕면": "평택", "안성": "안성", "안성시": "안성", "공도": "안성", "대덕": "안성", "금광": "안성", "보개": "안성", "안성동": "안성", "공도읍": "안성", "보개면": "안성", "금광면": "안성", "서운면": "안성", "미양면": "안성", "대덕면": "안성", "양성면": "안성", "원곡면": "안성", "일죽면": "안성", "죽산면": "안성", "삼죽면": "안성", "아양동": "안성", "석정동": "안성", "당왕동": "안성", "옥산동": "안성", "연지동": "안성", "대천동": "안성", "신소현동": "안성", "사곡동": "안성", "금석동": "안성",
  "인천": "인천", "인천광역시": "인천", "제물포구": "인천", "영종구": "인천", "미추홀구": "인천", "연수구": "인천", "남동구": "인천", "부평구": "인천", "계양구": "인천", "서해구": "인천", "검단구": "인천", "강화군": "강화군", "옹진군": "옹진군", "안산": "안산", "안산시": "안산", "상록구": "안산", "단원구": "안산", "시흥": "시흥", "시흥시": "시흥", "부천": "부천", "부천시": "부천", "원미구": "부천", "소사구": "부천", "오정구": "부천", "광명": "광명", "광명시": "광명", "군포": "군포", "군포시": "군포", "안양": "안양", "안양시": "안양", "만안구": "안양", "동안구": "안양", "과천": "과천", "과천시": "과천", "의왕": "의왕", "의왕시": "의왕", "송도동": "인천", "청라동": "인천", "검단동": "인천", "부평동": "인천", "구월동": "인천", "논현동": "인천", "간석동": "인천", "주안동": "인천", "용현동": "인천", "계양동": "인천", "계산동": "인천", "작전동": "인천", "영종동": "인천", "운서동": "인천", "만수동": "인천", "삼산동": "인천", "효성동": "인천", "동춘동": "인천", "옥련동": "인천", "연수동": "인천", "청학동": "인천", "도화동": "인천", "숭의동": "인천", "학익동": "인천", "고잔동": "안산", "선부동": "안산", "월피동": "안산", "본오동": "안산", "사동": "안산", "이동": "안산", "초지동": "안산", "정왕동": "시흥", "배곧동": "시흥", "은행동": "시흥", "대야동": "시흥", "신천동": "시흥", "장곡동": "시흥", "능곡동": "시흥", "중동": "부천", "상동": "부천", "심곡동": "부천", "역곡동": "부천", "소사본동": "부천", "철산동": "광명", "하안동": "광명", "소하동": "광명", "광명동": "광명", "산본동": "군포", "금정동": "군포", "당동": "군포", "부곡동": "군포", "평촌동": "안양", "호계동": "안양", "비산동": "안양", "관양동": "안양", "안양동": "안양", "박달동": "안양", "석수동": "안양", "별양동": "과천", "갈현동": "과천", "문원동": "과천", "내손동": "의왕", "오전동": "의왕", "고천동": "의왕", "청계동": "의왕", "신흥동": "인천", "답동": "인천", "신포동": "인천", "북성동": "인천", "송월동": "인천", "연안동": "인천", "도원동": "인천", "율목동": "인천", "동인천동": "인천", "용유동": "인천", "운남동": "인천", "운북동": "인천", "중산동": "인천", "만석동": "인천", "화수동": "인천", "송현동": "인천", "화평동": "인천", "창영동": "인천", "송림동": "인천", "선학동": "인천", "장수동": "인천", "서창동": "인천", "도림동": "인천", "남촌동": "인천", "산곡동": "인천", "청천동": "인천", "부개동": "인천", "일신동": "인천", "십정동": "인천", "서운동": "인천", "검암동": "인천", "경서동": "인천", "연희동": "인천", "신현동": "시흥", "원창동": "인천", "가정동": "인천", "석남동": "인천", "가좌동": "인천", "마전동": "인천", "당하동": "인천", "원당동": "인천", "오류동": "인천", "왕길동": "인천", "불로동": "인천", "강화읍": "인천", "선원면": "인천", "불은면": "인천", "길상면": "인천", "화도면": "인천", "양도면": "인천", "내가면": "인천", "하점면": "인천", "양사면": "인천", "송해면": "인천", "교동면": "인천", "삼산면": "인천", "서도면": "인천", "북도면": "인천", "연평면": "인천", "백령면": "인천", "대청면": "인천", "덕적면": "인천", "자월면": "인천", "영흥면": "인천", "일동": "안산", "성포동": "안산", "안산동": "안산", "와동": "안산", "원곡동": "안산", "백운동": "안산", "신길동": "안산", "대부동": "안산", "매화동": "시흥", "목감동": "시흥", "군자동": "시흥", "월곶동": "시흥", "과림동": "시흥", "연성동": "시흥", "거북섬동": "시흥", "원미동": "부천", "춘의동": "부천", "도당동": "부천", "약대동": "부천", "범박동": "부천", "옥길동": "부천", "괴안동": "부천", "송내동": "부천", "성곡동": "부천", "원종동": "부천", "고강동": "부천", "오정동": "부천", "일직동": "광명", "학온동": "광명", "군포동": "군포", "수리동": "군포", "궁내동": "군포", "광정동": "군포", "재궁동": "군포", "오금동": "군포", "송부동": "군포", "부흥동": "안양", "달안동": "안양", "인덕원동": "안양", "부림동": "안양", "귀인동": "안양", "범계동": "안양", "신촌동": "안양", "과천동": "과천",
  "양평": "양평", "양평군": "양평", "양평읍": "양평", "강상면": "양평", "강하면": "양평", "양서면": "양평", "옥천면": "양평", "서종면": "양평", "단월면": "양평", "청운면": "양평", "양동면": "양평", "지평면": "양평", "용문면": "양평", "개군면": "양평",
  "종로": "서울", "종로구": "서울", "중구": "서울", "서울 중구": "서울", "용산": "서울", "용산구": "서울", "성동": "서울", "성동구": "서울", "광진": "서울", "광진구": "서울", "동대문": "서울", "동대문구": "서울", "중랑": "서울", "중랑구": "서울", "성북": "서울", "성북구": "서울", "강북": "서울", "강북구": "서울", "도봉": "서울", "도봉구": "서울", "노원": "서울", "노원구": "서울", "은평": "서울", "은평구": "서울", "서대문": "서울", "서대문구": "서울", "마포": "서울", "마포구": "서울", "양천": "서울", "양천구": "서울", "강서": "서울", "강서구": "서울", "구로": "서울", "구로구": "서울", "금천": "서울", "금천구": "서울", "영등포": "서울", "영등포구": "서울", "동작": "서울", "동작구": "서울", "관악": "서울", "관악구": "서울", "서초": "서울", "서초구": "서울", "강남": "서울", "강남구": "서울", "송파": "서울", "송파구": "서울", "강동": "서울", "강동구: 서울": "서울",
  "화곡동": "서울", "화양동": "서울", "황학동": "서울", "회기동": "서울", "회현동": "서울", "효창동": "서울", "후암동": "서울", "휘경동": "서울", "흑석동": "서울",
  "광주": "광주", "광주시": "광주", "경기광주": "광주", "초월읍": "광주", "곤지암읍": "광주", "도척면": "광주", "퇴촌면": "광주", "남종면": "광주", "남한산성면": "광주", "오포동": "광주", "신현동": "광주", "능평동": "광주", "경안동": "광주", "쌍령동": "광주", "탄벌동": "광주", "광남동": "광주",
  "여주": "여주", "여주시": "여주", "가남읍": "여주", "점동면": "여주", "세종대왕면": "여주", "흥천면": "여주", "금사면": "여주", "산북면": "여주", "대신면": "여주", "북내면": "여주", "강천면": "여주", "여흥동": "여주", "오학동": "여주"
};


function getRepresentativeRegion(region) {
  if (!region) return '기본';
  const cleaned = region.trim();
  return REGION_MAP[cleaned] || '기본';
}

function getRegionContextText(representativeRegion) {
  const contexts = {
    '수원': '수원 지역은 장안구, 권선구, 팔달구, 영통구 등 각 생활권별로 구축 아파트부터 상가, 오피스텔이 혼재되어 있습니다. 이로 인해 창틀 주변 실리콘의 자연 노화 상태와 외벽 마감재 접합부의 틈새 균열을 함께 세밀하게 점검하는 것이 반복되는 누수를 막는 첫걸음입니다.',
    '화성': '화성 지역은 동탄, 병점, 봉담, 향남 등 급격히 확장된 생활권을 따라 대단지 아파트와 상가 주택이 밀집해 있습니다. 고층 주거지와 신축식 외벽 마감의 특성을 파악하여, 창틀과 샷시 및 외벽 골조 접합부에서 발생할 수 있는 미세한 누수 유입 가능성을 다각도로 검수합니다.',
    '동탄': '동탄 지역은 고층 아파트와 신축 주거단지가 밀집해 있어 강한 바람과 외부 환경 변화에 노출되는 빈도가 높습니다. 이로 인해 샷시 외부 실링의 미세한 들뜸이나 창틀 하부 젖음, 외벽 줄눈부 틈새 등으로 빗물이 역류하여 들어오는 유입 경로를 추적하는 정밀 진단이 효과적입니다.',
    '오산': '오산 지역은 세교신도시를 비롯해 원동, 궐동 등 주거 밀집 구역의 아파트와 빌라가 다수 분포합니다. 비 오는 날 유독 집중되는 창틀 주변의 습기나 물기 흔적은 외부 실리콘의 경화 및 노후와 밀접하므로, 외벽과의 긴밀한 접합 부위를 꼼꼼하게 측정하여 맞춤 솔루션을 제안합니다.',
    '용인': '용인 지역은 수지구, 기흥구, 처인구 등 넓은 생활권에 걸쳐 다양한 연식의 아파트 단지와 타운하우스가 형성되어 있습니다. 샷시 실리콘의 고질적인 박리와 외벽 수축으로 인한 미세 크랙이 복합적으로 얽히는 경우가 많아 창틀 유입 구간과 외벽 방수 상태를 원스톱으로 체크합니다.',
    '이천': '이천 지역은 단독주택, 상가 건물, 그리고 중소규모 공장 등 건축물의 구조적 다양성이 큽니다. 연식이 오래된 외벽 마감층의 노후화와 지붕·상부 방수층의 누수 균열이 창틀 주변으로 흘러내려 올 수 있으므로, 건물 전체의 종합적인 습기 경로를 추적하는 진단이 필요합니다.',
    '평택': '평택 지역은 고덕국제신도시부터 송탄, 안중 등 신구 생활권이 교차하며 상가, 공장, 다세대 다가구 주택이 폭넓게 조성되어 있습니다. 특히 외벽 균열부나 창틀 주변 실링의 찢어짐으로 인해 내부 마감재까지 빗물이 스며드는 현상이 잦으므로 균열 위치에 맞춰 부분 방수 계획을 세웁니다.',
    '안성': '안성 지역은 저층 주택 and 단독 빌라, 일반 상가 건물 등 거주형 건물의 비중이 높은 특징이 있습니다. 세월에 따른 외벽 균열 및 창틀 실리콘의 풍화 현상이 주요 원인으로 작용하므로, 과도한 전체 공사 대신 누수 부위를 정확히 찾아 짚어내는 부분 방수 점검을 우선 안내합니다.',
    '인천': '인천 지역은 송도, 청라 등 신도시의 고층 아파트부터 구도심의 빌라, 다세대 주택이 공존하여 누수 양상이 다양합니다. 해안가와 인접해 강풍을 동반한 들이치는 빗물에 취약할 수 있으므로, 창틀 코킹 마감재의 내구성과 샷시 실링 상태를 세밀하게 진단하고 최적의 솔루션을 제공합니다.',
    '강화군': '강화군 지역은 도서·산간 지역 및 외곽지의 특성상 기상 상황과 거리에 따른 일정 조율이 수시로 발생합니다. 무조건적인 즉시 출동보다 사전에 현장 사진 및 누수 부위 정보를 확인한 뒤 상담 일정을 면밀하게 조율하여 안내해 드립니다.',
    '옹진군': '옹진군 지역은 도서 지역 특성상 여객선 운항 일정 및 해상 기후의 영향을 받습니다. 사전에 전화 및 사진을 통해 빗물 유입 상태를 상세히 파악한 후, 방문 상담 가능 일정을 안전하게 조율하여 안내합니다.',
    '안산': '안산 지역은 반월국가산업단지 배후 주거지를 포함해 대규모 아파트 단지와 상가 주택이 밀집해 있습니다. 노후된 외부 실리콘이 늘어나거나 박리되어 발생하는 창틀 틈새의 미세 누수와 외벽 크랙을 면밀하게 탐지하여 보수 방향을 잡습니다.',
    '시흥': '시흥 지역은 배곧, 목감, 장현 등 대단지 아파트가 조성되어 있는 반면 구도심의 빌라들도 밀집되어 있습니다. 서해안 인접 지역 특유의 강한 비바람을 견딜 수 있도록 샷시와 콘크리트 경계면의 외벽 방수 및 코킹 밀착도를 집중 점검합니다.',
    '부천': '부천 지역은 중동, 상동 등 대단지 아파트 연식 노후화에 따른 샷시 실리콘 경화와 외벽 실크랙이 주요 누수 원인으로 작용합니다. 창틀 누수의 실제 경로를 꼼꼼하게 추적하여 세대별 맞춤 방수 안내를 해 드립니다.',
    '광명': '광명 지역은 철산, 하안 등 구축 아파트 단지와 신규 재개발 단지가 조화를 이룹니다. 샷시 외부의 노후화된 코킹 상태와 창틀 주변 옹벽의 균열 분포를 종합적으로 검사하여 합리적인 부분 보수를 설계합니다.',
    '군포': '군포 지역은 산본신도시를 중심으로 주거 밀집도가 높습니다. 오랜 세월 자외선에 노출되어 삭아버린 창틀 실리콘의 틈새 벌어짐을 확인하고, 빗물이 벽면 내부로 유입되는 모세관 현상을 방지하는 밀착 실링을 점검합니다.',
    '안양': '안양 지역은 동안구의 대단지 아파트와 만안구의 주택·빌라 밀집 구역 등 다양한 연식의 건물이 분포합니다. 고탄성 창호 전용 실란트 재시공 범위와 건물 외벽 균열 보수 필요성을 입체적으로 진단합니다.',
    '과천': '과천 지역은 관악산·청계산 자락의 기후 변화에 미감하며, 재건축 단지와 기존 아파트의 비율이 뚜렷합니다. 창문 틀 상부 콘크리트 조인트 틈새와 기존 코킹 부재의 수축 상태를 세심하게 검사하여 조치법을 안내합니다.',
    '의왕': '의왕 지역은 백운호수 및 삼동, 내손동 주변 신구 건축물이 혼재된 특성이 있습니다. 샷시 흔들림과 진동을 받아내야 하는 창호 전용 실리콘의 탈착 여부와 외벽 줄눈부 틈새 균열을 꼼꼼하게 측정하여 맞춤 진단을 제안합니다.',
    '양평': '양평 지역은 양평읍을 비롯해 용문면, 서종면 등 수려한 자연환경을 낀 전원주택단지와 저층 빌라, 주거형 건물들이 널리 분포해 있습니다. 주변 산세와 강풍으로 들이치는 빗물이 샷시 틈새와 외벽 균열로 스며들 수 있어 창틀 코킹 경화 상태와 균열 진입로를 철저하게 분석합니다.',
    '서울': '서울 지역은 고층 아파트 단지부터 빌라, 연립주택, 다세대 주택 등 다양한 주거 형태가 조밀하게 형성되어 있습니다. 건물 연식에 따른 창틀 실리콘의 경화 상태와 외벽 노후화 균열 상태를 꼼꼼하게 점검하여 다각적인 물길 유입 원인을 진단합니다.',
    '광주': '광주 지역은 경안동, 송정동, 오포동 등 급성장하는 주거 단지와 빌라 밀집 지역이 조화를 이루고 있습니다. 고개와 천을 낀 지형 특성상 바람과 들이치는 비의 강도가 높으므로, 외부 실리콘 상태와 창호 주변 골조 틈새를 정밀 진단하여 최적의 누수 방안을 제안합니다.',
    '여주': '여주 지역은 여흥동, 오학동, 가남읍 등 아파트 단지와 전원형 주택, 단층 상가가 고루 분포하고 있습니다. 강바람과 외부 노출 빈도가 높은 지역적 기후 특성을 파악하여, 샷시 실리콘의 갈라짐 현상과 외벽 균열 상태를 꼼꼼하게 검수하여 안내합니다.',
    '기본': '올케어는 수도권 각 지역의 생활권별 건물 특징과 구조적 노후화 정도를 고려하여 누수 원인을 정밀하게 진단합니다. 창틀 주변 실리콘의 갈라짐이나 외벽 균열 등 실제 빗물이 통과하는 통로를 정밀하게 파악하여 불필요한 공사를 방지합니다.'
  };
  return contexts[representativeRegion] || contexts['기본'];
}

// 허용된 작업명 목록
const ALLOWED_TASKS = ['창틀코킹', '창틀누수', '빗물누수', '창틀실리콘', '샷시실리콘', '외벽보수'];

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
      return {
        ogImage: 'og-window.jpg',
        hero: `창틀 실리콘의 미세한 균열이나 들뜸 현상이 보인다면 비 오기 전 예방 보수가 필요합니다. 기존 노후 코킹 상태를 정밀 진단합니다.`,
        releakDesc: `실리콘이 경화되어 틈새가 벌어지거나 먼지 오염으로 접착력이 약해진 면은 덧방 시공만으로는 하자가 재발할 수 있어 정석 시공이 권장됩니다.`,
        reLeakBox: `기존 코킹을 깔끔히 제거하지 않고 덧바르면 노후면이 함께 탈락하여 누수가 반복될 수 있습니다.`,
        processDesc: `기존 실리콘 상태 점검 및 제거 → 접착면 이물질 청소 → 프라이머 도포 → 방수 실리콘 재코킹 순으로 꼼꼼히 마감합니다.`,
        faq1Q: `${r} 창틀코킹은 기존 실리콘을 반드시 제거하고 시공해야 하나요?`,
        faq1Answer: `${r} 창틀코킹 시 올케어는 노후되어 들뜨거나 갈라진 실리콘을 완전히 제거한 후 시공하는 것을 원칙으로 합니다. 덧방을 하게 되면 접착력이 약해져 금방 다시 들뜨기 때문입니다.`,
        faq3Q: `비 오기 전에 ${r} 창틀코킹을 미리 점검하고 예방하는 게 장기적으로 유리한가요?`,
        faq3Answer: `네, 그렇습니다. 실리콘이 경화되어 틈새가 벌어지기 전에 올케어를 통해 정기적으로 ${r} 창틀코킹 상태를 확인하고 미리 예방 보수해주시면 빗물 유입으로 인한 벽지 손상과 내부 곰팡이 피해를 완벽히 막을 수 있습니다.`,
        contactTitle: `${regionTask} 상담, 비 오기 전에 예방하세요`,
        contactDesc: `들뜸이나 갈라짐 증상을 알려주시면 기존 실리콘 제거 범위와 보수 예산에 맞는 합리적인 코킹 방안을 친절히 안내합니다.`
      };
    case '창틀누수':
      return {
        ogImage: 'og-waterproof.jpg',
        hero: `창틀 하부에 고이는 물기나 주변 벽지 젖음은 실내외 유입 균열을 다각도로 조사해야 해결이 가능합니다.`,
        releakDesc: `실내에서 물이 비치는 곳과 실제로 빗물이 처음 스며들어온 외부 유입 경로는 서로 다를 수 있어 종합적인 점검이 요구됩니다.`,
        reLeakBox: `창틀 하부의 젖은 면만 막기보다 샷시 프레임 안쪽이나 외벽과의 접합 틈새를 함께 살펴보는 것이 누수의 근원 해결책입니다.`,
        processDesc: `실내 벽지 젖음과 하부 물고임 증상 파악 → 외부 접합부 및 프레임 틈 점검 → 외부 실링 및 샷시 보수 → 내부 마감 순서로 진행합니다.`,
        faq1Q: `${r} 창틀누수 해결은 오직 창틀 주변 실리콘만 막으면 끝나나요?`,
        faq1Answer: `${r} 창틀누수는 창틀 자체의 결함뿐 아니라 상부 외벽의 미세 크랙이나 골조 접합부 균열을 타고 내려올 수도 있습니다. 올케어는 다각도 점검을 통해 정확한 물길 유입로를 차단합니다.`,
        faq3Q: `방 내부 벽지가 누렇게 젖는데 이것도 ${r} 창틀누수 영향일 수 있나요?`,
        faq3Answer: `네, 충분히 가능성이 있습니다. 외부 창호 실링이나 샷시 프레임 틈새로 유입된 미세한 물길이 옹벽을 적시면서 실내 도배지 변색과 곰팡이로 이어지므로, 올케어의 정밀 진단을 권장합니다.`,
        contactTitle: `${regionTask} 원인 진단, 물길부터 찾아냅니다`,
        contactDesc: `창틀 주변의 젖은 지점과 누수 증상 사진을 공유해주시면 빗물이 흘러 들어오는 실제 유입 경로 분석 결과를 친절히 설명해 드립니다.`
      };
    case '빗물누수':
      return {
        ogImage: 'og-waterproof.jpg',
        hero: `유독 비가 내리는 날에만 벽지가 젖고 반복되는 누수는 외벽 균열과 마감재 손상을 동시 점검하는 것이 중요합니다.`,
        releakDesc: `상부 방수층에 생긴 문제나 외부 크랙을 타고 빗물이 이동하는 경로를 면밀히 추적하여 종합적인 물길을 막아야 반복되지 않습니다.`,
        reLeakBox: `단순히 창틀 실링만 덧칠하는 것이 아니라 빗물이 흐르는 유입 크랙과 줄눈 틈까지 복합적인 결함을 넓게 짚어내는 정밀한 조사 단계가 필수적입니다.`,
        processDesc: `비 오는 날의 반복적인 누수 증상 및 시간대 파악 → 상부 방수 및 외벽 균열 조사 → 유입 균열 보수 및 방수 마감 검수 순서로 진행합니다.`,
        faq1Q: `비가 그친 뒤에도 ${r} 빗물누수 흔적이나 유입 경로를 추적할 수 있나요?`,
        faq1Answer: `네, 비가 갠 후에도 벽면 내부에 스며든 잔여 습기 상태와 콘크리트 미세 균열의 백화 현상 등을 분석하여 올케어 전문 장비와 기술력으로 정확한 ${r} 빗물누수 흔적을 진단할 수 있습니다.`,
        faq3Q: `건물 외벽에 육안상 큰 균열이 없어도 ${r} 빗물누수가 생길 수 있나요?`,
        faq3Answer: `네, 그렇습니다. 미세한 실크랙이나 벽돌 줄눈 틈새, 눈에 잘 띄지 않는 창틀 상부의 실리콘 들뜸 부위로도 바람과 함께 들이치는 빗물이 유입되어 누수 피해가 생기므로 올케어와 같은 전문 진단이 필요합니다.`,
        contactTitle: `반복되는 ${regionTask} 해결, 종합 물길 진단`,
        contactDesc: `비 온 뒤 내부 습기 및 누수 범위에 대해 알려주시면, 건물 상부 방수층이나 외부 크랙 등 빗물이 들어올 수 있는 여러 가능성을 짚어 상세히 조언해 드립니다.`
      };
    case '창틀실리콘':
      return {
        ogImage: 'og-window.jpg',
        hero: `창틀 외부 실리콘이 갈라지거나 햇빛에 수축하여 틈이 생겼다면, 접착면의 청결과 건조를 확인하고 정밀 재시공해야 안전합니다.`,
        releakDesc: `오래되어 부식되고 들뜬 기존 코킹재는 신축성과 밀착력을 완전히 잃었기 때문에 겉면에 덧바르기보다 완전히 긁어내 마감하는 것이 효과적입니다.`,
        reLeakBox: `습기가 남아있거나 들뜬 실리콘을 완전 탈거하지 않고 새 코킹을 하면 접착 불량으로 인해 금방 다시 떨어지는 단점이 있습니다.`,
        processDesc: `노후 실리콘 갈라짐·수축 파악 → 기존 부식재 탈거 작업 → 먼지 오염물 청소 및 완전 건조 → 고성능 방수 실리콘 밀착 도포 순서로 마감합니다.`,
        faq1Q: `${r} 창틀실리콘 보수 시 들뜬 부분만 메우는 덧방 시공도 가능한가요?`,
        faq1Answer: `임시조치는 될 수 있으나 권장하지 않습니다. 오래된 ${r} 창틀실리콘은 내부에 습기와 오염 물질을 머금고 있어 덧바르게 되면 속에서 다시 박리됩니다. 올케어는 확실한 접착을 위해 밀착 면 정리를 꼼꼼히 거칩니다.`,
        faq3Q: `외부 ${r} 창틀실리콘 겉면이 갈라지기 시작했다면 바로 시공을 예약해야 하나요?`,
        faq3Answer: `네, 실리콘이 갈라져 틈새가 벌어지기 시작하면 틈새를 타고 유입된 습기가 내부 벽체를 빠르게 훼손시킵니다. 올케어를 통해 빗물 침투를 초기 차단하여 2차 누수 피해를 방지하시기 바랍니다.`,
        contactTitle: `부식된 ${regionTask} 제거 후 맞춤형 재시공`,
        contactDesc: `외부 실리콘이 삭아서 날아가거나 뜯어진 범위를 사진과 함께 상담 주시면, 제거 범위와 확실하게 접착을 살리는 실링 방안을 조언해 드립니다.`
      };
    case '샷시실리콘':
      return {
        ogImage: 'og-window.jpg',
        hero: `고층 아파트나 외풍이 심한 건물의 샷시 프레임 and 콘크리트 옹벽 사이의 벌어진 틈은 샷시 전용 실링재의 정밀 마감으로 해결해야 합니다.`,
        releakDesc: `고층부 창호는 바람으로 인한 진동과 외부 수축 팽창에 지속적으로 노출되므로, 내구성이 약한 일반 실리콘 덧방으로는 샷시 흔들림을 지탱할 수 없습니다.`,
        reLeakBox: `샷시 프레임의 흔들림을 유연하게 받아내고 진동을 견딜 수 있는 접착성 높은 창호 전용 실리콘을 두껍게 포밍하여 도포해 주어야 유격이 생기지 않습니다.`,
        processDesc: `샷시 프레임 유격 및 흔들림 체크 → 외부 실링 손상 부위 박리 → 접합 틈 청소 → 고탄성 샷시 전용 실란트 충진 및 광폭 마감 순서로 진행합니다.`,
        faq1Q: `${r} 샷시실리콘 상태 점검 시 실내 쪽보다 외부 접착면 확인이 더 중요한가요?`,
        faq1Answer: `네, 그렇습니다. 실내 샷시실리콘은 변색 방지용 데코 성격이 강하지만, 직접 빗물과 바람을 맞이하는 것은 외부 실링입니다. 올케어는 외줄 로프 장비 등을 투입해 외부 밀착면을 확실히 진단합니다.`,
        faq3Q: `${r} 샷시실리콘의 외벽 경계부가 살짝 뜯어지기 시작했는데도 누수로 번질 수 있나요?`,
        faq3Answer: `그렇습니다. 작은 들뜸이 바람의 압력과 겨울철 수축 팽창을 겪으며 급속도로 번지고, 그 사이로 스며든 빗물이 고스란히 샷시 프레임 안쪽 누수로 확산됩니다. 발견 시 올케어의 보수가 좋습니다.`,
        contactTitle: `${regionTask} 광폭 실링 보수 안내`,
        contactDesc: `샷시 프레임 주변의 틈새 크기와 고층 여부를 말씀해주시면 외부 충격과 기후 변화에 잘 견디는 탄성 창호 실링 공법을 안내해 드립니다.`
      };
    case '외벽보수':
      return {
        ogImage: 'og-wall.jpg',
        hero: `콘크리트 외벽의 미세한 크랙이나 벽돌 마감면 사이 줄눈 틈으로 물이 차오른다면, 정밀 크랙 보수와 외벽 방수 실링 처리가 시급합니다.`,
        releakDesc: `건물 노후화로 발생한 외벽 도막 손상이나 균열은 빗물을 스펀지처럼 흡수하여 실내 누수를 유발하므로 전체 보수와 부분 코킹 여부를 정확히 진단해야 합니다.`,
        reLeakBox: `단순 창틀 주변만 막을 경우 외벽 높은 곳의 균열부에서 침투한 빗물이 내부 옹벽 틈새를 타고 우회하여 들어오기 때문에 균열 탐지와 마감이 중요합니다.`,
        processDesc: `외벽 크랙 분포 및 깊이 검수 → 탈락된 도막 and 부식된 줄눈 제거 → 균열 보수재 주입 및 메움 → 외벽 기능성 발수·방수제 도포 순서로 시공합니다.`,
        faq1Q: `${r} 외벽보수는 벽 전체가 아닌 세대 주변 부분 보수만으로 충분히 해결되나요?`,
        faq1Answer: `네, 대부분 특정 세대의 누수 균열은 창틀 상부 3~5미터 반경 내의 크랙이나 노후화된 마감재가 주요 원인입니다. 올케어는 누수 의심 경로를 정밀 타격하여 경제적인 세대별 부분 ${r} 외벽보수를 설계합니다.`,
        faq3Q: `${r} 외벽보수 진행 시 아주 미세한 수준의 헤어크랙도 방수 보수를 해야 하나요?`,
        faq3Answer: `겉보기에 미세한 외벽 크랙이라도 비바람이 치면 빗물이 모세관 현상으로 깊숙이 흡수되어 내부 부식을 빠르게 촉진시킵니다. 올케어를 통해 빗물이 들어갈 수 있는 아주 작은 크랙까지 방수 코팅 메움을 해두는 것이 좋습니다.`,
        contactTitle: `${regionTask} 크랙 보수 및 외벽 방수 상담`,
        contactDesc: `건물 외벽 재질(벽돌, 콘크리트 등)과 노후화 정도를 알려주시면 하자의 재발을 완벽하게 차단할 수 있는 가장 적합한 외벽 방수 메커니즘을 상세히 조언해 드립니다.`
      };
    default:
      return {
        ogImage: 'og-thumbnail.png',
        hero: `겉면보다 유입 지점부터 확인합니다.`,
        releakDesc: `눈에 보이는 한 곳만 확인하는 것이 아니라, 빗물이 유입되는 실제 원인을 함께 살펴보는 것이 중요합니다.`,
        reLeakBox: `보이는 흔적과 실제 유입 지점이 다를 수 있어, 원인 범위를 함께 확인합니다.`,
        processDesc: `증상 확인 → 외벽·샷시 점검 → 기존 실리콘 확인 → 상태별 보수 → 마감 검수 순서로 진행합니다.`,
        faq1Q: `비 온 뒤 언제 점검이 필요할까요?`,
        faq1Answer: `비가 온 뒤 창틀 하부나 벽지 주변에 물기가 남고, 외부 실리콘이 갈라졌다면 점검이 필요할 수 있습니다. 창틀뿐 아니라 외벽 균열과 샷시 접합부까지 올케어와 함께 확인하는 것이 좋습니다.`,
        faq3Q: `기존에 코킹했는데 다시 새는 이유는 뭔가요?`,
        faq3Answer: `기존 실리콘 위에 덧방만 했거나, 물이 들어오는 지점을 확인하지 못한 경우 같은 증상이 반복될 수 있습니다. 올케어는 종합 분석으로 해결책을 찾습니다.`,
        contactTitle: `빗물누수 원인 상담, 원인부터 확인하세요`,
        contactDesc: `젖은 위치만 보지 않고, 창틀·샷시·외벽 주변 유입 경로를 함께 확인합니다.`
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
      title = `${region} 창틀코킹 전문 진단 | 올케어`;
      h1Suffix = '전문 진단';
      description = `${region} 창틀코킹은 기존 노후 실리콘의 들뜸과 접착면 상태를 먼저 파악하는 것이 중요합니다. 올케어가 창틀 외부 상태를 꼼꼼히 점검하고 현장에 알맞은 코킹 보수 방향을 안내합니다.`;
      break;
    case '창틀누수':
      title = `${region} 창틀누수 원인 점검 | 올케어`;
      h1Suffix = '원인 점검';
      description = `비 올 때마다 반복되는 ${region} 창틀누수는 눈에 보이는 흔적보다 물이 스며드는 실제 유입로를 찾는 것이 시급합니다. 올케어가 샷시 접합부와 외벽 균열 상태를 정밀 점검합니다.`;
      break;
    case '빗물누수':
      title = `${region} 빗물누수 진단 상담 | 올케어`;
      h1Suffix = '유입 경로 진단';
      description = `${region} 빗물누수로 벽지가 젖거나 실리콘 틈새가 벌어졌다면 종합 진단이 필요합니다. 올케어가 창틀 상부, 외부 마감면, 외벽 균열까지 복합적인 유입 원인을 진단합니다.`;
      break;
    case '창틀실리콘':
      title = `${region} 창틀실리콘 보수 상담 | 올케어`;
      h1Suffix = '보수 상담';
      description = `${region} 창틀실리콘 노화로 인한 틈새는 빗물 유입의 주원인이 될 수 있습니다. 올케어가 겉면에 덧바르지 않고 밀착력과 내구성을 높이는 올바른 실리콘 보수 상담을 제공합니다.`;
      break;
    case '샷시실리콘':
      title = `${region} 샷시실리콘 재시공 상담 | 올케어`;
      h1Suffix = '재시공 상담';
      description = `샷시 프레임 접합부의 미세한 틈으로 물기가 번진다면 ${region} 샷시실리콘 정밀 점검이 좋습니다. 올케어가 시공 상태를 진단하고 밀착성과 방수 성능을 복구하는 재시공 상담을 안내합니다.`;
      break;
    case '외벽보수':
      title = `${region} 외벽보수 방수 점검 | 올케어`;
      h1Suffix = '방수 점검';
      description = `외벽 마감재 균열이나 적벽돌 줄눈 노후는 실내 누수로 이어집니다. ${region} 외벽보수 진단을 통해 크랙 및 누수 위험 구간을 종합 검수하고 필요한 방수 처리 방안을 제안합니다.`;
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
  'exterior-repair': '외벽보수'
};

function getTaskSlug(task) {
  const map = {
    '창틀코킹': 'window-caulking',
    '창틀누수': 'window-leak',
    '빗물누수': 'rain-leak',
    '창틀실리콘': 'window-silicone',
    '샷시실리콘': 'sash-silicone',
    '외벽보수': 'exterior-repair'
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

module.exports = (req, res) => {
  if (req.query.seoul_region && req.query.seoul_task) {
    let slug = req.query.seoul_region;
    if (slug.includes('-gu-') && slug.endsWith('-dong')) {
      const parts = slug.split('-');
      if (parts.length >= 2) {
        slug = parts.slice(parts.length - 2).join('-');
      }
    }
    const regionKorean = SLUG_TO_KOREAN[slug];
    const taskKorean = TASK_SLUG_MAP[req.query.seoul_task];
    if (regionKorean && taskKorean) {
      const redirectUrl = `/?k=${encodeURIComponent(regionKorean + '-' + taskKorean)}`;
      res.writeHead(301, { 'Location': redirectUrl });
      res.end();
      return;
    }
  }

  const htmlPath = path.join(process.cwd(), 'template.html');

  fs.readFile(htmlPath, 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Internal Server Error');
      return;
    }

    let rawK = req.query.k || '';
    const parsed = parseKeyword(rawK);

    if (parsed) {
      const meta = buildDynamicMeta(parsed.region, parsed.task, rawK);
      const { region, task, regionTask } = meta;
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
      const ogImageUrl = `https://www.rainguard.co.kr/images/${content.ogImage}?v=2`;
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
      const regionContextText = getRegionContextText(representativeRegion);
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
