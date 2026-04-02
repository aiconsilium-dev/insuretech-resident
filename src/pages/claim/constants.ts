import type { ClaimType, ClaimTypeOption, EstimationData } from './types';

export const CLAIM_TYPES: ClaimTypeOption[] = [
  {
    type: 'facility',
    title: '균열·파손',
    desc: '유리창 파손, 벽면 균열, 타일 깨짐 등',
    symbol: '■',
    color: '#00854A',
    completionMsg: '현장조사가 배정됩니다',
  },
  {
    type: 'leak',
    title: '누수·침수',
    desc: '천장·벽에서 물이 새는 경우',
    symbol: '●',
    color: '#0061AF',
    completionMsg: '현장 누수원인 조사가 진행됩니다',
  },
  {
    type: 'injury',
    title: '다침·부상',
    desc: '미끄러짐, 넘어짐, 물건 낙하 등',
    symbol: '◆',
    color: '#C9252C',
    completionMsg: '대인 보상 심사가 진행됩니다 (자기부담금 없음)',
  },
  {
    type: 'fire',
    title: '화재·폭발',
    desc: '불이 나거나 폭발이 발생한 경우',
    symbol: '▲',
    color: '#F47920',
    completionMsg: '화재증명원 확인 후 처리됩니다',
  },
];

export const DEFECT_TYPES = [
  {
    id: 'structure',
    label: '벽·천장 균열',
    desc: '벽면·천장 금, 콘크리트 깨짐',
  },
  {
    id: 'finish',
    label: '타일·유리 파손',
    desc: '타일 깨짐, 유리창 파손, 도배 들뜸',
  },
  { id: 'mep', label: '배관·설비 고장', desc: '수도, 난방, 전기, 환기 문제' },
  { id: 'civil', label: '방수 불량', desc: '외벽 방수, 창틀 방수 문제' },
];

export const LEAK_LOCATIONS = ['내 세대', '아래층 세대'];
export const LEAK_CAUSES = [
  '상층 세대 배관',
  '공용 급배수',
  '방수층 불량',
  '원인 불명',
];
export const LEAK_DAMAGES = ['천장', '벽면', '바닥(장판)', '가전·가구', '기타'];

export const INJURY_TYPES = [
  '미끄러짐',
  '낙하물',
  '놀이터',
  '주차장',
  '엘리베이터',
  '기타',
];
export const INJURY_PLACES = ['주차장', '복도·계단', '놀이터', '주출입구', '기타'];
export const TREATMENT_STATUS = ['통원', '입원', '수술'];

export const FIRE_TYPES = ['전기 화재', '가스 폭발', '방화', '기타'];
export const FIRE_DAMAGE_SCOPE = ['대물만', '대인만', '대물+대인'];

export const FACILITY_ESTIMATION: Record<string, EstimationData> = {
  structure: {
    items: [
      {
        name: '균열 보수(V커팅+충전)',
        qty: '5m',
        unitPrice: 18000,
        total: 90000,
      },
      { name: '도배 재시공', qty: '15㎡', unitPrice: 12000, total: 180000 },
      { name: '부자재', qty: '1식', unitPrice: 50000, total: 50000 },
    ],
    damageTotal: 320000,
    deductible: 100000,
    insurance: 220000,
  },
  finish: {
    items: [
      {
        name: '타일 철거·재시공',
        qty: '12㎡',
        unitPrice: 35000,
        total: 420000,
      },
      { name: '방수 보수', qty: '8㎡', unitPrice: 28000, total: 224000 },
      { name: '부자재·폐기물', qty: '1식', unitPrice: 80000, total: 80000 },
    ],
    damageTotal: 724000,
    deductible: 100000,
    insurance: 624000,
  },
  mep: {
    items: [
      { name: '배관 교체', qty: '3m', unitPrice: 45000, total: 135000 },
      { name: '마감 복구', qty: '1식', unitPrice: 120000, total: 120000 },
      { name: '설비 부품', qty: '1식', unitPrice: 85000, total: 85000 },
    ],
    damageTotal: 340000,
    deductible: 100000,
    insurance: 240000,
  },
  civil: {
    items: [
      { name: '방수층 재시공', qty: '20㎡', unitPrice: 32000, total: 640000 },
      { name: '마감 복구', qty: '1식', unitPrice: 150000, total: 150000 },
      { name: '부자재', qty: '1식', unitPrice: 60000, total: 60000 },
    ],
    damageTotal: 850000,
    deductible: 100000,
    insurance: 750000,
  },
};

export const LEAK_DAMAGE_COSTS: Record<
  string,
  {
    items: { name: string; qty: string; unitPrice: number; total: number }[];
    subtotal: number;
  }
> = {
  천장: {
    items: [
      { name: '도배', qty: '12㎡', unitPrice: 12000, total: 144000 },
      { name: '석고보드 교체', qty: '4㎡', unitPrice: 25000, total: 100000 },
    ],
    subtotal: 244000,
  },
  벽면: {
    items: [{ name: '도배', qty: '20㎡', unitPrice: 12000, total: 240000 }],
    subtotal: 240000,
  },
  '바닥(장판)': {
    items: [
      { name: '장판 교체', qty: '15㎡', unitPrice: 18000, total: 270000 },
    ],
    subtotal: 270000,
  },
  '가전·가구': {
    items: [
      {
        name: '중고가 감가 산정',
        qty: '1식',
        unitPrice: 300000,
        total: 300000,
      },
    ],
    subtotal: 300000,
  },
  기타: {
    items: [
      { name: '기타 피해', qty: '1식', unitPrice: 100000, total: 100000 },
    ],
    subtotal: 100000,
  },
};

export const NEXT_STEPS: Record<ClaimType, string[]> = {
  facility: ['현장조사 배정 (1~3일)', '손해사정 확정', '보험금 지급'],
  leak: [
    '누수원인 조사 (3~5일)',
    '책임소재 판단',
    '수리비 확정',
    '보험금 지급',
  ],
  injury: ['서류 검토 (3~5일)', '손해사정사 심사', '대인 보상금 확정'],
  fire: ['화재증명원 확인 (5~7일)', '현장 감정', '보험금 확정'],
};
