import type { ClaimsFilter } from './api/types';

export const queryKeys = {
  me: ['me'] as const,
  claims: (filters?: ClaimsFilter) => ['claims', filters ?? {}] as const,
  claimDetail: (id: string) => ['claims', id] as const,
  notifications: (page?: number) => ['notifications', page ?? 1] as const,
} as const;
