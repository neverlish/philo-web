create table user_saved_prescriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  prescription_id uuid references ai_prescriptions not null,
  saved_at timestamptz default now(),
  unique (user_id, prescription_id)
);

alter table user_saved_prescriptions enable row level security;

create policy "users can read own saved prescriptions"
  on user_saved_prescriptions for select
  using (auth.uid() = user_id);

create policy "users can insert own saved prescriptions"
  on user_saved_prescriptions for insert
  with check (auth.uid() = user_id);

create policy "users can delete own saved prescriptions"
  on user_saved_prescriptions for delete
  using (auth.uid() = user_id);
