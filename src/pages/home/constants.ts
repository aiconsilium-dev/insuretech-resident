import type { ClaimStatus } from '@/lib/api/types';

export const ACTIVE_STATUSES: ClaimStatus[] = [
  'submitted',
  'classifying',
  'field_check_pending',
  'field_checking',
  'estimating',
  'estimated',
  'approval_pending',
];
