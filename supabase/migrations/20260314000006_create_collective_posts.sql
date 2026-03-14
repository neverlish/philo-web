-- collective_posts: 함께 나누기 게시글
create table collective_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  content text not null,
  philosopher_name text,
  prescription_id uuid,
  author_name text not null default '익명의 철학자',
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

-- collective_post_likes: 좋아요
create table collective_post_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  post_id uuid references collective_posts on delete cascade not null,
  created_at timestamptz not null default now(),
  unique(user_id, post_id)
);

alter table collective_posts enable row level security;
alter table collective_post_likes enable row level security;

-- collective_posts RLS
create policy "Anyone can read posts"
  on collective_posts for select using (true);

create policy "Authenticated users can create posts"
  on collective_posts for insert with check (auth.uid() = user_id);

create policy "Users can delete own posts"
  on collective_posts for delete using (auth.uid() = user_id);

-- collective_post_likes RLS
create policy "Anyone can read likes"
  on collective_post_likes for select using (true);

create policy "Authenticated users can like"
  on collective_post_likes for insert with check (auth.uid() = user_id);

create policy "Users can unlike"
  on collective_post_likes for delete using (auth.uid() = user_id);

-- likes_count 자동 업데이트 트리거
create or replace function update_likes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update collective_posts set likes_count = likes_count + 1 where id = NEW.post_id;
  elsif TG_OP = 'DELETE' then
    update collective_posts set likes_count = likes_count - 1 where id = OLD.post_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger likes_count_trigger
  after insert or delete on collective_post_likes
  for each row execute function update_likes_count();
