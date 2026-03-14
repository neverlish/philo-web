-- Fix upsert 409 error: UPDATE policy was missing WITH CHECK clause
-- Supabase upsert (INSERT ... ON CONFLICT DO UPDATE) requires WITH CHECK on UPDATE policy

DROP POLICY IF EXISTS "Users can update own check-ins" ON public.check_ins;

CREATE POLICY "Users can update own check-ins" ON public.check_ins
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
