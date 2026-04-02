import { apiFetch } from './client';
import type { ApiNotification, PaginatedResponse, MessageResponse } from './types';

export const getNotifications = (
  page = 1,
  size = 20
): Promise<PaginatedResponse<ApiNotification>> =>
  apiFetch(`/api/notifications?page=${page}&size=${size}`);

export const markAsRead = (id: string): Promise<MessageResponse> =>
  apiFetch(`/api/notifications/${id}/read`, { method: 'PATCH' });

export const markAllAsRead = (): Promise<MessageResponse> =>
  apiFetch('/api/notifications/read-all', { method: 'PATCH' });
