import type { ClaimCategory, ClaimStatus } from '@/lib/api/types';

export const CATEGORY_META: Record<
  ClaimCategory,
  { label: string; icon: string; color: string }
> = {
  leak: { label: '누수·침수', icon: '●', color: '#0061AF' },
  facility: { label: '균열·파손', icon: '■', color: '#00854A' },
  injury: { label: '다침·부상', icon: '◆', color: '#C9252C' },
  fire: { label: '화재 피해', icon: '▲', color: '#C9252C' },
};

export const STATUS_STEP: Record<ClaimStatus, number> = {
  submitted: 1,
  classifying: 1,
  field_check_pending: 2,
  field_checking: 2,
  estimating: 3,
  estimated: 3,
  approval_pending: 3,
  approved: 4,
  paid: 4,
  denied: 2,
  appealed: 2,
};

export const STEPS = ['접수', '검토', '산정', '완료'];
