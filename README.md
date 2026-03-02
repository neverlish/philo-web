# 오늘의철학 Web App

철학적 지혜를 일상에 적용하는 모바일 웹 애플리케이션

## 프로젝트 개요

오늘의철학은 고대와 현대의 철학적 지혜를 현대인의 삶에 적용할 수 있도록 돕는 웹 애플리케이션입니다. 사용자는 매일 다양한 철학자들의 생각을 통해 삶의 문제에 대한 새로운 관점을 얻을 수 있습니다.

## 주요 기능

### 1. 지혜의 다리 (홈)
- 오늘의 철학적 영감 제공
- 철학자 카드를 통한 지혜 탐험
- 카테고리 필터링 (스토아 철학, 동양 사상, 현대 철학)

### 2. 함께 나누기 (컬렉티브)
- 사용자들의 철학적 사유 공유
- 좋아요 및 댓글 기능
- 파티클 애니메이션을 통한 시각적 효과
- 인기/최신 필터링

### 3. 저장된 처방
- 마음에 드는 철학적 처방 저장
- 카테고리별 필터링
- 빠른 검색 및 접근

### 4. 저널 (준비 중)
- 개인적 철학적 성장 기록
- 2026년 2분기 출시 예정

### 5. 프로필
- 사용자 활동 통계
- 앱 설정 및 개인정보 관리

## 기술 스택

### 프레임워크 & 라이브러리
- **Next.js 15** - React 프레임워크 (App Router)
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션

### 개발 도구
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅
- **Turbopack** - 빠른 빌드

## 설치 및 실행

### 필수 조건
- Node.js 18.17 이상
- npm, yarn, 또는 pnpm

### 설치

```bash
# 프로젝트 클론
git clone <repository-url>
cd philo-web

# 의존성 설치
npm install
# 또는
yarn install
# 또는
pnpm install
```

### 개발 서버 실행

```bash
npm run dev
# 또는
yarn dev
# 또는
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

### 프로덕션 빌드

```bash
# 빌드
npm run build
# 또는
yarn build
# 또는
pnpm build

# 프로덕션 서버 시작
npm run start
# 또는
yarn start
# 또는
pnpm start
```

## 프로젝트 구조

```
philo-web/
├── app/                      # Next.js App Router 페이지
│   ├── collective/           # 함께 나누기 페이지
│   ├── journal/              # 저널 페이지
│   ├── saved/                # 저장된 처방 페이지
│   ├── profile/              # 프로필 페이지
│   ├── prescription/         # 처방 상세 페이지
│   ├── opening/              # 오프닝 화면
│   ├── layout.tsx            # 루트 레이아웃
│   ├── page.tsx              # 홈 페이지
│   └── globals.css           # 전역 스타일
├── components/               # React 컴포넌트
│   ├── animations/           # 애니메이션 컴포넌트
│   ├── collective/           # 컬렉티브 관련 컴포넌트
│   ├── home/                 # 홈 관련 컴포넌트
│   ├── navigation/           # 네비게이션 컴포넌트
│   ├── opening/              # 오프닝 화면 컴포넌트
│   ├── prescription/         # 처방 관련 컴포넌트
│   ├── saved/                # 저장 관련 컴포넌트
│   └── ui/                   # 공통 UI 컴포넌트
├── lib/                      # 유틸리티 라이브러리
│   ├── data.ts               # 목업 데이터
│   ├── types.ts              # TypeScript 타입 정의
│   └── utils.ts              # 유틸리티 함수
├── public/                   # 정적 에셋
├── tailwind.config.ts        # Tailwind CSS 설정
├── next.config.ts            # Next.js 설정
└── tsconfig.json             # TypeScript 설정
```

## 디자인 원칙

### 색상 팔레트
- **Primary**: `#ec5b13` (주황색) - 강조와 활동성
- **Background**: `#F9F7F2` (미색) - 따뜻함과 차분함
- **Foreground**: `#2C2420` (짙은 갈색) - 가독성
- **Muted**: `#6B5F56` (중간 갈색) - 부가 정보
- **Card**: `#ffffff` (흰색) - 카드 배경
- **Border**: `#e7e5e4` (연한 회색) - 경계

### 타이포그래피
- **Sans-serif**: UI 요소와 버튼
- **Serif**: 제목과 철학적 텍스트 (고전적 느낌)

### 애니메이션
- Framer Motion을 사용한 부드러운 전환
- 페이지 로드 시 페이드인 효과
- 인터랙션에 대한 피드백 제공

## 브라우저 지원

- Chrome (최신 2개 버전)
- Safari (최신 2개 버전)
- Firefox (최신 2개 버전)
- Edge (최신 2개 버전)

## 모바일 최적화

- 반응형 디자인 (모바일 우선)
- 하단 네비게이션 바
- 터치 친화적 UI
- 빠른 로딩 속도

## 향후 계획

- [ ] 저널 기능 구현
- [ ] 사용자 인증 시스템
- [ ] 푸시 알림
- [ ] 백엔드 API 연동
- [ ] 소셜 공유 기능 강화
- [ ] 다크 모드 지원
- [ ] PWA (Progressive Web App) 변환

## 라이선스

Copyright © 2024 오늘의철학

## 기여

이 프로젝트에 기여하고 싶으시다면 Pull Request를 제출해주세요.

## 문의

프로젝트 관련 문의사항은 이슈를 통해 남겨주세요.
