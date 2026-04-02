import type { AuthResponse } from './types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

// ── 쿠키 유틸 ─────────────────────────────────────────────────────────────────

export function getCookieToken(name: string): string | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// ── ApiError ──────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── refresh 재시도 방지용 플래그 ─────────────────────────────────────────────

let _isRefreshing = false;

async function tryRefresh(): Promise<boolean> {
  if (_isRefreshing) return false;
  _isRefreshing = true;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) return false;
    // 서버가 새 access_token 쿠키를 Set-Cookie 로 갱신
    const data: AuthResponse = await res.json();
    // MSW 환경에서는 Set-Cookie가 동작하지 않으므로 직접 쿠키 설정
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      document.cookie = `access_token=${data.access_token}; path=/; SameSite=Strict`;
    }
    return true;
  } catch {
    return false;
  } finally {
    _isRefreshing = false;
  }
}

// ── 메인 fetch 래퍼 ───────────────────────────────────────────────────────────

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  _retry = true
): Promise<T> {
  const token = getCookieToken('access_token');

  const headers: HeadersInit = {
    ...(!(options.body instanceof FormData) && {
      'Content-Type': 'application/json',
    }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include', // refresh_token(HTTP-Only) 쿠키 자동 전송
    ...options,
    headers,
  });

  if (res.status === 401 && _retry) {
    const ok = await tryRefresh();
    if (ok) return apiFetch<T>(path, options, false);
    // refresh도 실패 → authStore 초기화 (순환 의존 방지를 위해 이벤트로 처리)
    window.dispatchEvent(new CustomEvent('auth:logout'));
    throw new ApiError(401, 'UNAUTHORIZED', '세션이 만료되었습니다.');
  }

  if (!res.ok) {
    let code = 'UNKNOWN_ERROR';
    let message = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      code = body?.error?.code ?? code;
      message = body?.error?.message ?? message;
    } catch {
      // JSON 파싱 실패 시 기본값 사용
    }
    throw new ApiError(res.status, code, message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
