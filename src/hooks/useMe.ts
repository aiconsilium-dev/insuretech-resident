import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getMe } from '@/lib/api/auth';
import { getCookieToken } from '@/lib/api/client';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);
  const hasToken = !!getCookieToken('access_token');

  const query = useQuery({
    queryKey: queryKeys.me,
    queryFn: getMe,
    enabled: hasToken, // 토큰 없으면 요청 안 함
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}
