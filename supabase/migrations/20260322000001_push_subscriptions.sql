create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, endpoint)
);

alter table push_subscriptions enable row level security;

create policy "users can manage own subscriptions"
  on push_subscriptions for all
  using (auth.uid() = user_id);

create policy "service role can read all subscriptions"
  on push_subscriptions for select
  using (true);
