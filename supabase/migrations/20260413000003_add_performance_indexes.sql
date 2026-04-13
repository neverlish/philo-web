-- Performance indexes for ai_prescriptions
-- user_id 단독 인덱스가 없어 profile/saved 페이지 전체 쿼리가 full scan 발생
--
-- 커버리지:
--   profile: SELECT count(*) WHERE user_id = ?
--   profile: SELECT ... WHERE user_id = ? AND created_at >= ? ORDER BY created_at ASC
--   saved:   SELECT ... WHERE user_id = ? ORDER BY created_at DESC
--   detail:  SELECT * WHERE id = ? AND user_id = ?  (id PK lookup + user_id filter)

CREATE INDEX IF NOT EXISTS idx_ai_prescriptions_user_id_created_at
  ON ai_prescriptions(user_id, created_at DESC);

-- user_saved_prescriptions: UNIQUE(user_id, prescription_id)이 있어 user_id 조회는 커버됨
-- 단, saved_at 기준 정렬 쿼리에 추가 인덱스
CREATE INDEX IF NOT EXISTS idx_user_saved_prescriptions_user_saved_at
  ON user_saved_prescriptions(user_id, saved_at DESC);
