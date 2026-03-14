-- RLS policies for check_ins table
-- Required for daily OpeningQuestion gate feature

ALTER TABLE public.check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own check-ins" ON public.check_ins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins" ON public.check_ins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own check-ins" ON public.check_ins
  FOR UPDATE USING (auth.uid() = user_id);
