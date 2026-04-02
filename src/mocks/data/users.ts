import type { ApiUser } from '@/lib/api/types';

export const MOCK_USER: ApiUser = {
  id: 'usr-001',
  role: 'resident',
  name: '홍길동',
  phone: '01012345678',
  email: 'hong@example.com',
  apartment_id: 'apt-001',
  apartment_name: '래미안 아파트',
  unit_dong: '101',
  unit_ho: '1204',
  created_at: '2026-01-01T00:00:00Z',
};
