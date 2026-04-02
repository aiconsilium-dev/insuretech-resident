import type { ApiClaim, ClaimStatus } from '@/lib/api/types';
import type { Tab } from './types';

export function filterClaims(claims: ApiClaim[], tab: Tab): ApiClaim[] {
  if (tab === 'all') return claims;
  const doneStatuses: ClaimStatus[] = ['approved', 'paid', 'denied'];
  if (tab === 'done')
    return claims.filter((c) => doneStatuses.includes(c.status));
  return claims.filter((c) => !doneStatuses.includes(c.status));
}

export function getStatusLabel(status: ClaimStatus): string {
  const map: Record<ClaimStatus, string> = {
    submitted: '접수완료',
    classifying: '분류중',
    field_check_pending: '현장조사 대기',
    field_checking: '현장조사중',
    estimating: '산정중',
    estimated: '산정완료',
    approval_pending: '승인대기',
    approved: '승인완료',
    paid: '지급완료',
    denied: '면책통보',
    appealed: '이의신청',
  };
  return map[status] ?? status;
}

export function formatAmount(amount?: number): string | null {
  if (!amount) return null;
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function formatDate(iso: string): string {
  return iso.slice(0, 10).replace(/-/g, '.');
}
