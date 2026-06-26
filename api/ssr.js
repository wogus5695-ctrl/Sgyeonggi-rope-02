const fs = require('fs');
const path = require('path');

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
  switch (task) {
    case '창틀코킹':
      return {
        ogImage: 'og-window.jpg',
        hero: `창틀 실리콘의 미세한 균열이나 들뜸 현상이 보인다면 비 오기 전 예방 보수가 필요합니다. 기존 노후 코킹 상태를 정밀 진단합니다.`,
        releakDesc: `실리콘이 경화되어 틈새가 벌어지거나 먼지 오염으로 접착력이 약해진 면은 덧방 시공만으로는 하자가 재발할 수 있어 정석 시공이 권장됩니다.`,
        reLeakBox: `기존 코킹을 깔끔히 제거하지 않고 덧바르면 노후면이 함께 탈락하여 누수가 반복될 수 있습니다.`,
        processDesc: `기존 실리콘 상태 점검 및 제거 → 접착면 이물질 청소 → 프라이머 도포 → 방수 실리콘 재코킹 순으로 꼼꼼히 마감합니다.`,
        faq1Q: `비 오기 전 예방 목적으로 코킹을 진행해도 되나요?`,
        faq1Answer: `네, 빗물이 유입되어 내부 벽지나 프레임 주변에 피해가 발생하기 전에 미리 경화되거나 들뜬 실리콘을 찾아 재코킹 보수를 진행하는 것이 장기적으로 가장 예방 효과가 큽니다.`,
        faq3Q: `코킹 보수 시 기존 실리콘 제거가 필수적인가요?`,
        faq3Answer: `기존 실리콘 상태에 따라 다릅니다. 하지만 완전히 박리되어 들떴거나 내부 접착면이 오염된 상태라면 완전히 긁어내고 새 실리콘으로 시공해야 밀착도와 긴 수명을 보장할 수 있습니다.`,
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
        faq1Q: `빗물이 창틀 하부에만 고이는데도 외부 전체를 봐야 하나요?`,
        faq1Answer: `네, 빗물이 창틀 상부나 샷시 외부 접합부의 미세 균열을 타고 내려와 하부 프레임 안쪽에 고이는 경우가 많으므로 외부 접착면 전체를 넓게 보아야 원인을 잡을 수 있습니다.`,
        faq3Q: `벽지가 젖는 현상도 샷시 접합부 틈새 때문일 수 있나요?`,
        faq3Answer: `네, 외벽과 창틀 접합부에 생긴 틈새로 빗물이 지속 유입되면 내부 콘크리트를 적시고 가장 취약한 벽지 안쪽 얼룩과 누수 현상으로 나타나게 됩니다.`,
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
        faq1Q: `유독 비가 들이치는 날에만 물이 스며나오는 이유는 무엇인가요?`,
        faq1Answer: `바람의 방향이나 강수량에 따라 평소에는 드러나지 않던 외벽의 균열이나 줄눈 틈새, 상부 방수층의 균열이 벌어져 특정 빗물 유입 경로가 활성화되기 때문입니다.`,
        faq3Q: `반복되는 물길을 추적하여 막으려면 어떤 조치를 취해야 하나요?`,
        faq3Answer: `누수가 반복되는 외부 창틀 주변은 물론 상부 세대의 마감과 외벽에 노출된 미세 크랙까지 꼼꼼히 탐색하여 의심 경로를 꼼꼼하게 메워주는 정밀 방수 처리가 필요합니다.`,
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
        faq1Q: `수축되거나 들뜬 외부 실리콘을 그냥 놔두면 어떻게 되나요?`,
        faq1Answer: `실리콘이 수축해 콘크리트 벽체와 틈새가 벌어지면 미세한 틈새가 물길이 되어 빗물을 내부로 빨아들이고, 결국 내부 마감재 손상이나 곰팡이 발생을 촉진하게 됩니다.`,
        faq3Q: `실리콘 코킹 시 접착면 건조가 왜 중요한가요?`,
        faq3Answer: `콘크리트 내부에 습기가 남아 있는 상태에서 실리콘을 도포하면 내부에 갇힌 수분이 증발하며 실리콘을 밀어내어 기포가 생기거나 초기 접착력이 급격히 저하되기 때문입니다.`,
        contactTitle: `부식된 ${regionTask} 제거 후 맞춤형 재시공`,
        contactDesc: `외부 실리콘이 삭아서 날아가거나 뜯어진 범위를 사진과 함께 상담 주시면, 제거 범위와 확실하게 접착을 살리는 실링 방안을 조언해 드립니다.`
      };
    case '샷시실리콘':
      return {
        ogImage: 'og-window.jpg',
        hero: `고층 아파트나 외풍이 심한 건물의 샷시 프레임과 콘크리트 옹벽 사이의 벌어진 틈은 샷시 전용 실링재의 정밀 마감으로 해결해야 합니다.`,
        releakDesc: `고층부 창호는 바람으로 인한 진동과 외부 수축 팽창에 지속적으로 노출되므로, 내구성이 약한 일반 실리콘 덧방으로는 샷시 흔들림을 지탱할 수 없습니다.`,
        reLeakBox: `샷시 프레임의 흔들림을 유연하게 받아내고 진동을 견딜 수 있는 접착성 높은 창호 전용 실리콘을 두껍게 포밍하여 도포해 주어야 유격이 생기지 않습니다.`,
        processDesc: `샷시 프레임 유격 및 흔들림 체크 → 외부 실링 손상 부위 박리 → 접합 틈 청소 → 고탄성 샷시 전용 실란트 충진 및 광폭 마감 순서로 진행합니다.`,
        faq1Q: `샷시 실리콘 덧방(덧바르기) 시공은 수명이 짧은 편인가요?`,
        faq1Answer: `네, 기존 노후 실리콘 위에 단순히 실리콘을 덧칠하게 되면 접합력이 현저히 약해 바람이나 진동에 의해 덧방층이 쉽게 떨어져 나가며 누수가 재발하기 쉽습니다.`,
        faq3Q: `고층 세대의 샷시 주변 유격도 빗물 유입의 원인이 되나요?`,
        faq3Answer: `그렇습니다. 고층은 바람과 빗물이 강하게 몰아치기 때문에 프레임과 콘크리트 사이의 미세한 균열이나 외부 실링 손상 틈으로 빗물이 더욱 강하게 밀려 들어오게 됩니다.`,
        contactTitle: `${regionTask} 광폭 실링 보수 안내`,
        contactDesc: `샷시 프레임 주변의 틈새 크기와 고층 여부를 말씀해주시면 외부 충격과 기후 변화에 잘 견디는 탄성 창호 실링 공법을 안내해 드립니다.`
      };
    case '외벽보수':
      return {
        ogImage: 'og-wall.jpg',
        hero: `콘크리트 외벽의 미세한 크랙이나 벽돌 마감면 사이 줄눈 틈으로 물이 차오른다면, 정밀 크랙 보수와 외벽 방수 실링 처리가 시급합니다.`,
        releakDesc: `건물 노후화로 발생한 외벽 도막 손상이나 균열은 빗물을 스펀지처럼 흡수하여 실내 누수를 유발하므로 전체 보수와 부분 코킹 여부를 정확히 진단해야 합니다.`,
        reLeakBox: `단순 창틀 주변만 막을 경우 외벽 높은 곳의 균열부에서 침투한 빗물이 내부 옹벽 틈새를 타고 우회하여 들어오기 때문에 균열 탐지와 마감이 중요합니다.`,
        processDesc: `외벽 크랙 분포 및 깊이 검수 → 탈락된 도막과 부식된 줄눈 제거 → 균열 보수재 주입 및 메움 → 외벽 기능성 발수·방수제 도포 순서로 시공합니다.`,
        faq1Q: `외벽 보수 시 옥상이나 벽 전체를 다 보수해야 하나요?`,
        faq1Answer: `건물 상태에 따라 다릅니다. 누수 범위가 특정 세대에 국한되어 있고 미세 크랙이 한정적이라면, 비용 대비 효과가 뛰어난 창틀 상부 및 외벽 크랙 부분 방수 처리를 집중적으로 시행할 수 있습니다.`,
        faq3Q: `줄눈이 손상되면 왜 내부 누수까지 이어지나요?`,
        faq3Answer: `벽돌 사이의 줄눈 마감재가 세월이 흘러 부식되고 틈이 생기면 빗물이 줄눈 깊숙이 침투하여 옹벽 콘크리트에 흡수되고, 결국 실내 벽지와 창틀 하부 누수라는 직접적인 손상으로 귀결됩니다.`,
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
        faq1Answer: `비가 온 뒤 창틀 하부나 벽지 주변에 물기가 남고, 외부 실리콘이 갈라졌다면 점검이 필요할 수 있습니다. 창틀뿐 아니라 외벽 균열과 샷시 접합부까지 함께 확인하는 것이 좋습니다.`,
        faq3Q: `기존에 코킹했는데 다시 새는 이유는 뭔가요?`,
        faq3Answer: `기존 실리콘 위에 덧방만 했거나, 물이 들어오는 지점을 확인하지 못한 경우 같은 증상이 반복될 수 있습니다.`,
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
