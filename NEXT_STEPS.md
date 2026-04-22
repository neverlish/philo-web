# 다음 작업 후보

## ✅ 1. 성찰 데이터 활용 — 프로필 실천률 통계 (완료 2026-04-16)
- 프로필에 "이번 주 실천 N/7" 카드 추가 (`app/profile/page.tsx`)
- 월간 리포트에 "다짐 X개 중 성찰 완료 Y개" 비율 표시
- `prescription_reflections` + `ai_prescriptions.user_intention` 쿼리 활용

## ✅ 2. 저장 목록 강화 — 다짐/성찰 배지 (완료 2026-04-16)
`/saved` 페이지 처방 카드에 상태 배지 표시.
- 다짐 있음 → 작은 체크 아이콘
- 성찰 완료 → 강조 배지
- 필터: "실천 완료", "다짐 있음", "미완료"

## ✅ 3. 탐색 탭 채우기 (완료 2026-04-16)
- 철학자 지도: 전체 철학자 시대/지역/키워드 필터, 만남 진행도 (`components/journey/philosopher-map-tab.tsx`)
- 나의 여정: 다짐·회고 타임라인, 테마 인사이트, 성장률 (`components/journey/journey-page.tsx`)
- 함께: 공개 처방 피드 탭 추가 (`components/collective/collective-feed.tsx`)

## ✅ 4. 온보딩 플로우 (완료 2026-04-16)
- 3슬라이드 인트로: 앱 소개 → 사용법 3단계 → 퀴즈 연결 CTA (`components/onboarding/onboarding-slides.tsx`)
- `localStorage("philo_onboarding_v1")` 플래그로 첫 방문 1회만 표시
- PostHog 이벤트: `onboarding_started` / `onboarding_completed` / `onboarding_dismissed`

---

## 🐛 버그 / 기술 부채

### KST 날짜 버그 — `toISOString().split('T')[0]` 금지 패턴 (5곳)
CLAUDE.md 규칙 위반: UTC 기준이라 KST 자정~오전9시 사이에 전날 날짜로 처리됨.
`lib/date.ts`의 `getTodayKST()` 로 교체 필요.

| 파일 | 라인 | 용도 |
|------|------|------|
| `app/api/prescription/generate/route.ts` | 37 | 오늘 체크인 중복 방지 쿼리 |
| `app/api/push/send-reminder/route.ts` | 30 | 오늘 체크인 여부 확인 |
| `app/api/quotes/route.ts` | 29 | 오늘의 인용구 조회 |
| `lib/supabase-server.ts` | 39 | 오늘 처방 조회 |
| `app/profile/page.tsx` | 105 | KST 변환 후 split (의도적이나 패턴 통일 필요) |

---

## 5. 개선 후보

### A. 공유 페이지 SEO / OG 최적화
- `/share/[id]` 동적 OG 이미지: 현재 정적 이미지, 처방 내용 반영한 동적 OG로 교체
- sitemap에 공개 처방 URL 포함 (현재 `robots: noindex`)

### B. 알림 개인화
- 아침 알림: 현재 고정 문구 → 마지막 처방 테마 기반 문구
- 저녁 성찰 알림: 다짐 내용을 알림 body에 포함

### C. 오류 모니터링
- Sentry 또는 Vercel Error Tracking 연동 (현재 `console.error`만 존재)

---

*최종 업데이트: 2026-04-17*
