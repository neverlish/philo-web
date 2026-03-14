create table ai_prescriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  conversation_id uuid,
  concern text not null,
  philosopher_name text not null,
  philosopher_school text not null,
  philosopher_era text not null,
  quote_text text not null,
  quote_meaning text not null,
  quote_application text not null,
  title text not null,
  subtitle text not null,
  created_at timestamptz default now()
);

alter table ai_prescriptions enable row level security;

create policy "users can read own prescriptions"
  on ai_prescriptions for select
  using (auth.uid() = user_id);

create policy "users can insert own prescriptions"
  on ai_prescriptions for insert
  with check (auth.uid() = user_id);
