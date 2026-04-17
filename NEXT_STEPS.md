# 다음 작업 후보

## ✅ 1. 성찰 데이터 활용 — 프로필 실천률 통계 (완료 2026-04-16)
- 프로필에 "이번 주 실천 N/7" 카드 추가 (`app/profile/page.tsx`)
- 월간 리포트에 "다짐 X개 중 성찰 완료 Y개" 비율 표시
- `prescription_reflections` + `ai_prescriptions.user_intention` 쿼리 활용

## 2. 저장 목록 강화 — 다짐/성찰 배지
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

*최종 업데이트: 2026-04-16 (2, 3번 완료)*
