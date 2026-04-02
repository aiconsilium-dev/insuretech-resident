import { http, HttpResponse } from 'msw';
import { MOCK_USER } from '../data/users';

const MOCK_ACCESS_TOKEN = 'mock-access-token-resident';

export const authHandlers = [
  // OTP 발송 — 항상 성공
  http.post('/api/auth/otp', () => {
    return HttpResponse.json({ message: 'OTP가 발송되었습니다.' });
  }),

  // OTP 검증 + 로그인 — otp_code 123456 수락, 999로 시작하는 번호는 미가입 처리
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { phone?: string; otp_code?: string };

    if (body.otp_code !== '123456') {
      return HttpResponse.json(
        { error: { code: 'INVALID_OTP', message: '인증번호가 올바르지 않습니다.' } },
        { status: 400 }
      );
    }

    // 테스트용: 999로 시작하는 번호는 미가입 사용자로 처리
    if (body.phone?.startsWith('999')) {
      return HttpResponse.json(
        { error: { code: 'USER_NOT_FOUND', message: '가입되지 않은 사용자입니다.' } },
        { status: 404 }
      );
    }

    return HttpResponse.json(
      {
        access_token: MOCK_ACCESS_TOKEN,
        user: MOCK_USER,
      },
      {
        headers: {
          // MSW는 실제 Set-Cookie를 지원하지 않음 → client.ts에서 직접 쿠키 설정
          'X-Mock-Set-Cookie': `access_token=${MOCK_ACCESS_TOKEN}; path=/; SameSite=Strict`,
        },
      }
    );
  }),

  // 회원가입
  http.post('/api/auth/register', async () => {
    return HttpResponse.json(
      {
        access_token: MOCK_ACCESS_TOKEN,
        user: MOCK_USER,
      },
      { status: 201 }
    );
  }),

  // 내 정보 조회
  http.get('/api/auth/me', () => {
    const hasToken = document.cookie.includes('access_token');
    if (!hasToken) {
      return HttpResponse.json(
        { error: { code: 'UNAUTHORIZED', message: '인증이 필요합니다.' } },
        { status: 401 }
      );
    }
    return HttpResponse.json(MOCK_USER);
  }),

  // 토큰 갱신
  http.post('/api/auth/refresh', () => {
    return HttpResponse.json({
      access_token: MOCK_ACCESS_TOKEN,
      user: MOCK_USER,
    });
  }),

  // 로그아웃
  http.post('/api/auth/logout', () => {
    return HttpResponse.json({ message: '로그아웃 되었습니다.' });
  }),
];
