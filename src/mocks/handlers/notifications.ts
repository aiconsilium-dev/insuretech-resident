import { http, HttpResponse } from 'msw';
import { MOCK_NOTIFICATIONS } from '../data/notifications';
import type { ApiNotification } from '@/lib/api/types';

let notificationsStore: ApiNotification[] = [...MOCK_NOTIFICATIONS];

export const notificationsHandlers = [
  // 알림 목록 조회
  http.get('/api/notifications', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const size = parseInt(url.searchParams.get('size') ?? '20', 10);

    const total = notificationsStore.length;
    const start = (page - 1) * size;
    const items = notificationsStore.slice(start, start + size);

    return HttpResponse.json({
      items,
      total,
      page,
      size,
      total_pages: Math.ceil(total / size),
    });
  }),

  // 단일 알림 읽음 처리
  http.patch('/api/notifications/:id/read', ({ params }) => {
    notificationsStore = notificationsStore.map((n) =>
      n.id === params.id ? { ...n, is_read: true } : n
    );
    return HttpResponse.json({ message: '읽음 처리되었습니다.' });
  }),

  // 전체 알림 읽음 처리
  http.patch('/api/notifications/read-all', () => {
    notificationsStore = notificationsStore.map((n) => ({ ...n, is_read: true }));
    return HttpResponse.json({ message: '전체 읽음 처리되었습니다.' });
  }),
];
