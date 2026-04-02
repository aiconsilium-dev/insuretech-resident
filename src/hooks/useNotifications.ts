import { useQuery, useMutation } from '@tanstack/react-query';
import { getNotifications, markAsRead, markAllAsRead } from '@/lib/api/notifications';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';

export function useNotifications(page = 1) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.notifications(page),
    queryFn: () => getNotifications(page),
    enabled: isAuthenticated,
  });
}

export function useMarkAsRead() {
  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
    },
  });
}

export function useMarkAllAsRead() {
  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() });
    },
  });
}
