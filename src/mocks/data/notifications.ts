import type { ApiNotification } from '@/lib/api/types';

export const MOCK_NOTIFICATIONS: ApiNotification[] = [
  {
    id: 'noti-001',
    user_id: 'usr-001',
    type: 'claim_status',
    title: '접수 건 산정 완료',
    body: 'CLM-0328 건의 손해산정이 완료되었습니다. 보험금 624,000원 지급 예정입니다.',
    claim_id: 'clm-001',
    is_read: false,
    created_at: '2026-03-29T14:00:00Z',
  },
  {
    id: 'noti-002',
    user_id: 'usr-001',
    type: 'field_check',
    title: '현장조사 일정 안내',
    body: 'CLM-0301 건 현장조사가 04월 03일(금) 오전 10시로 예정되었습니다.',
    claim_id: 'clm-004',
    is_read: false,
    created_at: '2026-04-01T09:00:00Z',
  },
  {
    id: 'noti-003',
    user_id: 'usr-001',
    type: 'system',
    title: '서비스 점검 안내',
    body: '4월 5일(토) 02:00~04:00 서버 점검이 예정되어 있습니다.',
    is_read: true,
    created_at: '2026-04-01T08:00:00Z',
  },
  {
    id: 'noti-004',
    user_id: 'usr-001',
    type: 'approval',
    title: '보험금 지급 완료',
    body: 'CLM-0220 건의 보험금 1,820,000원이 등록 계좌로 지급 완료되었습니다.',
    claim_id: 'clm-005',
    is_read: true,
    created_at: '2026-02-22T16:00:00Z',
  },
];
