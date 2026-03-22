CREATE POLICY "users can update own prescriptions"
  ON ai_prescriptions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
