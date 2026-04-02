import { useQuery } from '@tanstack/react-query';
import { getClaims, getClaimById } from '@/lib/api/claims';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';
import type { ClaimsFilter } from '@/lib/api/types';

export function useClaims(filters?: ClaimsFilter) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.claims(filters),
    queryFn: () => getClaims(filters),
    enabled: isAuthenticated,
  });
}

export function useClaimDetail(id: string) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.claimDetail(id),
    queryFn: () => getClaimById(id),
    enabled: isAuthenticated && !!id,
  });
}
