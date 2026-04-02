# CLAUDE.md — InsureTech Resident 개발 가이드

## 프로젝트 개요

아파트 입주민이 보험 피해를 신고하고 AI 기반 보험금 적산 결과를 받는 모바일 웹 앱.
피해 유형을 TYPE A / B / C로 자동 분류하고, TYPE C의 경우 보험금 예상액을 산출한다.

---

## 기술 스택

| 역할 | 기술 |
|------|------|
| UI 프레임워크 | React 19 |
| 언어 | TypeScript 5 (strict) |
| 번들러 | Vite 8 |
| 라우팅 | React Router DOM v7 (HashRouter) |
| 서버 상태 | TanStack React Query v5 |
| 클라이언트 상태 | Zustand v5 |
| HTTP 클라이언트 | fetch 래퍼 (`apiFetch`) |
| 스타일링 | Tailwind CSS v4 (@tailwindcss/vite) |
| 아이콘 | Lucide React |
| 조건부 클래스 | clsx |
| API 모킹 | MSW (Mock Service Worker) v2 |
| 패키지 매니저 | pnpm |
| 배포 | GitHub Pages (gh-pages) |

---

## 폴더 구조

FSD(Feature-Sliced Design) 패턴을 pages 레이어에 적용한다.
페이지 내 기능은 `pages/{페이지}/{기능}/{컴포넌트}/` 디렉터리로 구성하고,
각 컴포넌트 디렉터리 안에 `index.tsx`, `types.ts`, `utils.ts` 등을 함께 둔다.

```
src/
├── App.tsx              # 라우팅 설정, auth 가드, BottomTabBar 가시성 제어
├── main.tsx             # 진입점 (QueryClient, Router, MSW 초기화)
├── index.css            # Tailwind CSS 진입점
│
├── pages/               # 페이지 레이어 — FSD 구조 적용
│   ├── login/
│   │   └── index.tsx
│   ├── signup/
│   │   └── index.tsx
│   ├── home/
│   │   ├── index.tsx                        # HomePage 진입점
│   │   ├── constants.ts                     # ACTIVE_STATUSES 등 페이지 상수
│   │   └── overview/                        # 홈 개요 기능
│   │       ├── StatusBox/
│   │       │   └── index.tsx
│   │       └── QuickMenuItem/
│   │           └── index.tsx
│   ├── claim/
│   │   ├── index.tsx                        # ClaimPage 진입점 (마법사 오케스트레이터)
│   │   ├── types.ts                         # ClaimType, ClaimTypeOption, EstimationData 등
│   │   ├── constants.ts                     # CLAIM_TYPES, DEFECT_TYPES, LEAK_*, FIRE_* 등
│   │   ├── utils.ts                         # mergeClaimWizardHistoryState 등 순수 함수
│   │   ├── step1-damage-type/
│   │   │   └── DamageTypeSelector/
│   │   │       └── index.tsx
│   │   ├── step2-details/
│   │   │   └── DetailForm/
│   │   │       └── index.tsx
│   │   └── step3-result/
│   │       ├── AIAnalysisView/
│   │       │   └── index.tsx
│   │       └── ResultView/
│   │           └── index.tsx
│   ├── history/
│   │   ├── index.tsx                        # HistoryPage 진입점
│   │   ├── types.ts                         # Tab 등 페이지 타입
│   │   ├── utils.ts                         # filterClaims, formatAmount, getStatusLabel 등
│   │   ├── constants.ts                     # CATEGORY_META, STATUS_STEP, STEPS
│   │   └── claim-list/
│   │       ├── ClaimCard/
│   │       │   └── index.tsx
│   │       ├── TypeBadge/
│   │       │   └── index.tsx
│   │       ├── ActionBtn/
│   │       │   └── index.tsx
│   │       └── DetailRow/
│   │           └── index.tsx
│   └── more/
│       ├── index.tsx                        # MorePage 진입점
│       ├── profile/
│       │   └── index.tsx
│       ├── documents/
│       │   └── index.tsx
│       └── insurance-info/
│           └── index.tsx
│
├── components/          # 공유 UI — 2개 이상 페이지에서 재사용되는 컴포넌트
│   ├── layout/
│   │   └── BottomTabBar.tsx  # 하단 탭 네비게이션
│   └── common/               # 원자 UI 컴포넌트
│       ├── StepIndicator.tsx
│       ├── StatusSteps.tsx
│       ├── PhotoCapture.tsx
│       ├── PhotoCaptureGroup.tsx
│       ├── AIAnalysis.tsx
│       ├── ResultCard.tsx
│       └── ...
│
├── hooks/               # 전역 공유 훅 (2개 이상 페이지에서 사용)
│   ├── useMe.ts
│   ├── useClaims.ts
│   ├── useCreateClaim.ts
│   └── useNotifications.ts
├── stores/
│   └── authStore.ts     # Zustand auth 스토어
├── lib/
│   ├── types.ts         # 전역 도메인 타입 + 상수
│   ├── queryClient.ts
│   ├── queryKeys.ts
│   └── api/
│       ├── client.ts    # apiFetch 래퍼 + ApiError + token refresh
│       ├── types.ts
│       ├── auth.ts
│       ├── claims.ts
│       └── notifications.ts
└── mocks/               # MSW 목 설정
    ├── browser.ts
    ├── handlers/
    └── data/
```

---

## 개발 규칙

### 1. TypeScript

- `strict: true`를 유지한다.
- 공유 도메인 타입은 `src/lib/types.ts`에 정의한다. 단일 파일에서만 쓰이는 타입은 해당 파일 상단에 선언해도 무방하다.
- `any` 사용을 피한다. 불가피한 경우 `unknown` + 타입 가드를 사용한다.
- 경로 별칭 `@/*` → `src/*`를 항상 사용한다.
  ```typescript
  // Bad
  import { useAuthStore } from '../../../stores/authStore';
  // Good
  import { useAuthStore } from '@/stores/authStore';
  ```

### 2. API 호출

- 모든 HTTP 호출은 `src/lib/api/client.ts`의 `apiFetch` 함수를 사용한다. 직접 `fetch`를 호출하지 않는다.
- API 함수는 도메인별 파일(`lib/api/auth.ts`, `lib/api/claims.ts` 등)에 모은다.
- **에러 핸들링은 두 계층으로 분리한다.**
  - **API 레이어** (`src/lib/api/*.ts`): 에러를 catch하지 않고 그대로 throw한다.
  - **훅/핸들러** (`hooks/`, 컴포넌트 내 핸들러): `try/catch`로 `ApiError`를 받아 사용자에게 피드백한다.
- 파일 업로드가 필요하면 `FormData`를 body로 전달한다. `apiFetch`가 `FormData` 감지 시 `Content-Type`을 자동으로 제외한다.

### 3. 상태 관리

| 데이터 종류 | 관리 방법 |
|-----------|---------|
| API 응답 데이터 (목록, 상세) | React Query (`useQuery`) |
| 뮤테이션 (청구 생성 등) | React Query (`useMutation`) |
| 사용자 인증 정보 | Zustand (`stores/authStore.ts`) |
| 폼 입력값, 단계 상태, 모달 열림 상태 | `useState` (로컬) |

- 쿼리 키는 `src/lib/queryKeys.ts`의 팩토리 함수를 사용한다.
  ```typescript
  queryKey: queryKeys.claims({ status: 'pending' })
  ```
- `queryClient.invalidateQueries` 사용 시 구체적인 `queryKey`를 지정한다.

### 4. 피해 유형 / TYPE 분류

`src/lib/types.ts`에 정의된 상수를 사용한다. 하드코딩하지 않는다.

```typescript
// 피해 유형 → TYPE 매핑
TYPE_MAP: { injury: 'A', other: 'B', leak/fire/facility/property: 'C' }

// 피해 유형 → 한국어 레이블
DAMAGE_LABELS: Record<DamageType, string>

// TYPE C 보험금 예상액
AMOUNT_MAP: Record<DamageType, number>
```

- **TYPE A** (신체부상): 보험금 산정 없이 담당자 연결 안내
- **TYPE B** (기타): 면책 심사 필요 안내
- **TYPE C** (누수/화재/시설/가재): AI 보험금 적산 결과 표시

### 5. 컴포넌트 작성

- 함수형 컴포넌트 + `React.FC<Props>` 타입을 사용한다.
- 조건부 클래스는 `clsx`를 사용한다.
- 아이콘은 `lucide-react`에서 named import로 가져온다.

**파일 배치 기준:**

| 상황 | 위치 |
|------|------|
| 특정 페이지에서만 쓰이는 기능 컴포넌트 | `pages/{페이지}/{기능}/{컴포넌트}/index.tsx` |
| 해당 컴포넌트에서만 쓰이는 타입 | 같은 디렉터리의 `types.ts` |
| 해당 컴포넌트에서만 쓰이는 유틸 함수 | 같은 디렉터리의 `utils.ts` |
| 페이지 전체가 공유하는 상수/타입/유틸 | `pages/{페이지}/constants.ts` / `types.ts` / `utils.ts` |
| 2개 이상 페이지에서 재사용되는 UI | `components/common/` |
| 2개 이상 페이지에서 재사용되는 훅 | `hooks/` |
| 전역 도메인 타입 | `lib/types.ts` |

**신규 기능 추가 예시:**

```
pages/claim/step2-details/NewFeature/
├── index.tsx       # 컴포넌트
├── types.ts        # 이 컴포넌트 전용 타입
└── utils.ts        # 이 컴포넌트 전용 유틸 함수
```

### 6. 스타일링

- 레이아웃·간격·색상은 **Tailwind CSS** 유틸리티 클래스를 사용한다.
- 설정 파일 없이 `@tailwindcss/vite` 플러그인으로 동작한다.
- 모바일 최적화: 최대 너비 `max-w-[430px]` 기준으로 디자인한다.
- 인라인 `style` 속성은 Tailwind로 표현이 어려울 때만 사용한다.

### 7. 라우팅

- **HashRouter** 사용 (GitHub Pages 배포 환경에서 새로고침 대응).
- 모든 인증 필요 라우트는 auth 가드로 보호한다 (`App.tsx` 참고).
- 탭 네비게이션은 `BottomTabBar`로 관리한다. 탭 목록: `home | claim | myclaims | more`.

### 8. 인증

- `access_token`은 쿠키에 저장한다 (MSW 환경에서는 `document.cookie`로 직접 설정).
- `refresh_token`은 HTTP-Only 쿠키로 관리하며, 모든 요청에 `credentials: 'include'`가 자동 포함된다.
- 토큰 갱신 로직은 `lib/api/client.ts`의 `tryRefresh()`에서만 처리한다.
- 세션 만료 시 `auth:logout` 커스텀 이벤트를 dispatch한다. 컴포넌트에서 이 이벤트를 리스닝해 authStore를 초기화한다.
- Zustand `authStore`의 `setUser` / `clearAuth`로만 인증 상태를 변경한다.

### 9. MSW 목 API

- `VITE_USE_MOCK=true`일 때 MSW 서비스 워커가 활성화된다.
- 핸들러는 `src/mocks/handlers/`에 도메인별로 분리한다.
- 목 데이터는 `src/mocks/data/`에 관리한다.
- 신규 엔드포인트 추가 시 핸들러와 목 데이터를 함께 작성한다.

### 10. Git 운영

- `.env.local`, 토큰, 개인 키 등 민감 정보는 절대 커밋하지 않는다.
- `.gitignore`에 경로를 추가할 때, 이미 추적 중인지 먼저 확인한다.
  ```bash
  git ls-files <path>   # 출력이 있으면 이미 추적 중
  git rm -r --cached <path>  # 추적 해제 후 커밋
  ```

### 11. 코드 품질

- 커밋 전 `pnpm lint`를 실행한다.
- `console.log`는 디버깅 완료 후 제거한다.
- 사용하지 않는 import는 제거한다.

---

## 안정성

- 성능보다 유지보수가 용이한 코드 구조를 우선한다.
- 변경사항에 보수적으로 접근한다. 신규 기능을 성능 있게 작성하는 것보다 기존 기능을 해치지 않는 것이 훨씬 중요하다.

---

## 개발 명령어

```bash
pnpm dev       # 개발 서버 시작 (host 모드)
pnpm build     # 타입 체크 후 프로덕션 빌드
pnpm lint      # ESLint 실행
pnpm preview   # 빌드 결과 미리보기
```

---

## 환경 변수

```bash
VITE_API_BASE_URL=https://api.example.com  # 백엔드 API 주소
VITE_USE_MOCK=true                          # MSW 목 API 활성화 여부
```

`.env.local` 파일을 생성해 로컬 환경 설정을 관리한다. `.env.local`은 Git에 커밋하지 않는다.

---

## 구현 전 체크리스트

상태·데이터 패칭 관련 코드를 수정할 때 먼저 다음을 확인한다.

1. **영향 범위 파악**: 수정하는 query/state를 소비하는 컴포넌트·훅을 나열한다.
2. **React Strict Mode**: `useEffect` 내 사이드 이펙트가 이중 실행되어도 안전한가? cleanup 함수를 작성한다.
3. **refetch 범위**: `invalidateQueries`가 의도한 쿼리만 무효화하는가?
4. **TYPE 분류 일관성**: 피해 유형 추가·변경 시 `TYPE_MAP`, `AMOUNT_MAP`, `DAMAGE_LABELS` 세 곳을 모두 갱신한다.
5. **타입 정확성**: 라이브러리 옵션 객체의 타입이 정확히 맞는가?

---

## 주요 주의사항

- **HashRouter**: GitHub Pages 배포 특성상 BrowserRouter 대신 HashRouter를 사용한다. 절대 경로 링크(`/`) 대신 해시 경로(`/#/`)를 사용한다.
- **Tailwind CSS v4**: 설정 파일(`tailwind.config.js`) 없이 `@tailwindcss/vite` 플러그인으로 동작한다.
- **React 19**: `use` 훅 등 React 19 전용 API 사용 가능. React 18과의 차이점에 주의한다.
- **MSW 서비스 워커**: `public/mockServiceWorker.js`는 자동 생성 파일이므로 수동 편집하지 않는다.
- **ClaimPage (`pages/claim/`)**: 3단계 폼 + AI 분석 + 결과 표시를 오케스트레이션하는 복잡한 마법사. 수정 시 관련 단계 디렉터리(`step1-*`, `step2-*`, `step3-*`)만 신중히 편집한다.
