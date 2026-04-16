# philo-web — Claude 작업 지침

## 커밋 & 푸시
- 작업이 완료되면 **작업 단위별로 커밋** 후 push까지 진행한다 (별도 요청 없어도).
- 커밋 메시지는 한국어로, `feat:` / `fix:` / `improve:` / `analytics:` 프리픽스 사용.

## 새 기능 구현 시 기본 체크리스트
1. **PostHog 이벤트**: 새 기능·페이지·버튼에는 항상 `posthog?.capture(...)` 이벤트를 포함한다.
   - 페이지 진입: `*_viewed`
   - CTA 클릭: `*_clicked`
   - 주요 액션 완료: `*_completed` / `*_submitted`
2. **홈/뒤로가기 내비게이션**: 새 페이지에는 항상 헤더에 뒤로가기(`ArrowLeft`) 또는 홈 버튼을 포함한다.
3. **비로그인 전환 흐름**: 비로그인 사용자가 접근하는 기능은 회원가입 유도 포인트를 자연스럽게 포함한다.

## 모바일 / iOS 기본 설정
- `min-h-screen` 대신 **`min-h-dvh`** 사용 (iOS Safari 주소창 이슈 방지).
- 폰트 입력 관련 요소에 `text-size-adjust: none` 고려 (iOS 자동 줌 방지).

## 날짜 처리
- `new Date().toISOString().split("T")[0]` **사용 금지** — UTC 기준이라 KST 자정~오전9시 오작동.
- 대신 `lib/date.ts`의 **`getTodayKST()`** / **`getRecentDaysKST(n)`** 사용 (서버·클라이언트 모두 안전).

## 코드 컨벤션
- Server Component에서 Supabase 직접 fetch → Client Component에 prop으로 전달.
- dynamic params: `params: Promise<{ id: string }>` + `const { id } = await params`.
- Optimistic update: state 먼저 변경 → API 실패 시 rollback.
- 레이아웃 컨테이너: `max-w-md mx-auto`.
