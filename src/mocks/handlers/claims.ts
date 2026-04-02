import { http, HttpResponse } from 'msw';
import { MOCK_CLAIMS } from '../data/claims';
import type { ApiClaim, ApiEstimation } from '@/lib/api/types';

let claimsStore: ApiClaim[] = [...MOCK_CLAIMS];

export const claimsHandlers = [
  // 접수 목록 조회 (페이지네이션)
  http.get('/api/claims', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const size = parseInt(url.searchParams.get('size') ?? '20', 10);

    let filtered = claimsStore;
    if (status) filtered = filtered.filter((c) => c.status === status);
    if (category) filtered = filtered.filter((c) => c.category === category);

    const total = filtered.length;
    const start = (page - 1) * size;
    const items = filtered.slice(start, start + size);

    return HttpResponse.json({
      items,
      total,
      page,
      size,
      total_pages: Math.ceil(total / size),
    });
  }),

  // 접수 상세 조회
  http.get('/api/claims/:id', ({ params }) => {
    const claim = claimsStore.find((c) => c.id === params.id);
    if (!claim) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: '접수 건을 찾을 수 없습니다.' } },
        { status: 404 }
      );
    }
    return HttpResponse.json(claim);
  }),

  // 접수 생성
  http.post('/api/claims', async ({ request }) => {
    const body = await request.json() as Partial<ApiClaim>;
    const newClaim: ApiClaim = {
      id: `clm-${Date.now()}`,
      claim_number: `CLM-${String(Date.now()).slice(-6)}`,
      apartment_id: 'apt-001',
      reporter_id: 'usr-001',
      source: 'resident',
      category: body.category ?? 'facility',
      status: 'submitted',
      location_type: body.location_type ?? 'private',
      location_detail: body.location_detail,
      description: body.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    claimsStore = [newClaim, ...claimsStore];
    return HttpResponse.json(newClaim, { status: 201 });
  }),

  // 사진 업로드
  http.post('/api/claims/:id/photos', () => {
    return HttpResponse.json({ message: '사진이 업로드되었습니다.' });
  }),

  // AI 적산 실행
  http.post('/api/claims/:id/estimate', ({ params }) => {
    const claim = claimsStore.find((c) => c.id === params.id);
    if (!claim) {
      return HttpResponse.json(
        { error: { code: 'NOT_FOUND', message: '접수 건을 찾을 수 없습니다.' } },
        { status: 404 }
      );
    }

    const estimation: ApiEstimation = {
      estimation_id: `est-${Date.now()}`,
      claim_id: claim.id,
      version: 1,
      items: [
        { work_type: '도배', unit: '㎡', quantity: 25, unit_price: 15000, amount: 375000 },
        { work_type: '장판', unit: '㎡', quantity: 20, unit_price: 18000, amount: 360000 },
        { work_type: '목공', unit: '식', quantity: 1, unit_price: 200000, amount: 200000 },
      ],
      total_damage: 935000,
      deductible: 187000,
      insurance_amount: 748000,
      is_ai_generated: true,
      created_at: new Date().toISOString(),
    };

    // 상태 업데이트
    claimsStore = claimsStore.map((c) =>
      c.id === claim.id
        ? {
            ...c,
            status: 'estimated',
            damage_amount_ai: estimation.total_damage,
            deductible: estimation.deductible,
            insurance_amount_ai: estimation.insurance_amount,
            updated_at: new Date().toISOString(),
          }
        : c
    );

    return HttpResponse.json(estimation);
  }),

  // 현장 방문 요청
  http.post('/api/claims/:id/visit', () => {
    return HttpResponse.json({ message: '방문 요청이 접수되었습니다.' });
  }),

  // 이의 신청
  http.post('/api/claims/:id/appeal', () => {
    return HttpResponse.json({ message: '이의신청이 접수되었습니다.' });
  }),
];
