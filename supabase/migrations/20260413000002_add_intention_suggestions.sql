ALTER TABLE ai_prescriptions
  ADD COLUMN IF NOT EXISTS intention_suggestions text[] DEFAULT '{}';
