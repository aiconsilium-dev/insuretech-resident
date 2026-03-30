# InsureTech Resident (입주민 앱)

아파트 단지 입주민을 위한 보험 사고접수 및 AI 분석 모바일 웹 앱.

## 🚀 Live Demo

[https://aiconsilium-dev.github.io/insuretech-resident/](https://aiconsilium-dev.github.io/insuretech-resident/)

URL 파라미터로 사용자 정보 전달:
```
?name=홍길동&apt=헬리오시티&dong=101&ho=1502
```

## 📋 기능

- **홈**: 사고접수 CTA, 접수 현황 카드, 빠른 메뉴, 현장조사 알림
- **사고접수**: 3-step 프로세스 (피해유형 → 사진/상세 → AI 분석/결과)
- **내 접수**: 접수 건 목록, 진행상황 트래커, 상세 정보 확장
- **더보기**: 보험안내 (CGL/화재/가재), 서류관리, 프로필

## 🛠 Tech Stack

| 기술 | 버전 |
|------|------|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | 4 (v4 @tailwindcss/vite) |
| TypeScript | 5 (strict) |
| pnpm | 10+ |

## 📁 프로젝트 구조

```
src/
├── App.tsx
├── main.tsx
├── index.css
├── lib/types.ts
├── contexts/AppContext.tsx
├── components/
│   ├── layout/BottomTabBar.tsx
│   └── common/
│       ├── StepIndicator.tsx
│       ├── PhotoCapture.tsx
│       ├── AIAnalysis.tsx
│       ├── ResultCard.tsx
│       └── StatusPill.tsx
└── pages/
    ├── HomePage.tsx
    ├── ClaimPage.tsx
    ├── HistoryPage.tsx
    └── MorePage.tsx
```

## 🏃 로컬 실행

```bash
pnpm install
pnpm dev     # http://localhost:3001
```

## 📦 빌드 & 배포

```bash
pnpm build   # dist/ 생성
# gh-pages 브랜치로 push
```
