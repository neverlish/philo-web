-- ai_prescriptions에 다짐 컬럼 추가
ALTER TABLE ai_prescriptions ADD COLUMN IF NOT EXISTS user_intention TEXT;

-- 회고 테이블 생성
CREATE TABLE IF NOT EXISTS prescription_reflections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES ai_prescriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reflection_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE prescription_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can manage own reflections"
  ON prescription_reflections
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
