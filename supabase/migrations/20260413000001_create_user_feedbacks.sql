create table if not exists user_feedbacks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table user_feedbacks enable row level security;

-- 누구나 삽입 가능 (비로그인 포함)
create policy "anyone can insert feedback"
  on user_feedbacks for insert
  with check (true);

-- 본인 피드백만 조회 가능
create policy "users can view own feedback"
  on user_feedbacks for select
  using (auth.uid() = user_id);
