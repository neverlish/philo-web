-- Initial schema for Philo (Today's Philosophy)
-- Created: 2026-03-02

-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nickname TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  interests TEXT[], -- 관심 키워드 ['자유', '사랑']
  current_concerns TEXT[], -- 선택한 고민
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Philosophers table
CREATE TABLE public.philosophers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  era TEXT NOT NULL CHECK (era IN ('고대', '중세', '근대', '현대')),
  region TEXT NOT NULL CHECK (region IN ('서양', '동양')),
  years TEXT, -- "1844-1900"
  core_idea TEXT NOT NULL, -- 핵심 사상 (한 문장)
  description TEXT, -- 왜 중요한지
  application TEXT, -- 실생활 적용
  keywords TEXT[], -- ['자유', '니힐리즘']
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  philosopher_id UUID NOT NULL REFERENCES public.philosophers(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  meaning TEXT NOT NULL, -- 쉬운 설명
  application TEXT NOT NULL, -- 실생활 적용
  scheduled_date DATE, -- 오늘의 명언으로 배정된 날짜
  concerns TEXT[], -- 관련 고민 ['인생이 의미없음']
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Concerns table
CREATE TABLE public.concerns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL UNIQUE, -- "인생이 의미없게 느껴질 때"
  category TEXT NOT NULL CHECK (category IN ('존재', '관계', '자유', '죽음', '성공')),
  philosopher_ids TEXT[], -- 관련 철학자 ID
  published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved quotes table
CREATE TABLE public.saved_quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  quote_id UUID NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quote_id)
);

-- Saved philosophers table
CREATE TABLE public.saved_philosophers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  philosopher_id UUID NOT NULL REFERENCES public.philosophers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, philosopher_id)
);

-- Chat conversations table (대화형 상담)
CREATE TABLE public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  initial_concern TEXT, -- 초기 고민
  messages JSONB NOT NULL DEFAULT '[]', -- [{role: 'user', content: '...'}, ...]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Check-ins table (출석 체크 - Phase 2)
CREATE TABLE public.check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
  checked_in_at TIMESTAMPTZ DEFAULT NOW(),
  streak_count INTEGER DEFAULT 1,
  UNIQUE(user_id, check_in_date)
);

-- Admin users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_users_onboarded ON public.users(onboarded) WHERE onboarded = TRUE;
CREATE INDEX idx_philosophers_published ON public.philosophers(published) WHERE published = TRUE;
CREATE INDEX idx_philosophers_era ON public.philosophers(era);
CREATE INDEX idx_philosophers_region ON public.philosophers(region);
CREATE INDEX idx_quotes_published ON public.quotes(published) WHERE published = TRUE;
CREATE INDEX idx_quotes_scheduled_date ON public.quotes(scheduled_date) WHERE scheduled_date IS NOT NULL;
CREATE INDEX idx_quotes_philosopher_id ON public.quotes(philosopher_id);
CREATE INDEX idx_concerns_published ON public.concerns(published) WHERE published = TRUE;
CREATE INDEX idx_concerns_category ON public.concerns(category);
CREATE INDEX idx_saved_quotes_user_id ON public.saved_quotes(user_id);
CREATE INDEX idx_saved_philosophers_user_id ON public.saved_philosophers(user_id);
CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_check_ins_user_id ON public.check_ins(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_philosophers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for saved_quotes
CREATE POLICY "Users can view own saved quotes" ON public.saved_quotes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add saved quotes" ON public.saved_quotes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved quotes" ON public.saved_quotes
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for saved_philosophers
CREATE POLICY "Users can view own saved philosophers" ON public.saved_philosophers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add saved philosophers" ON public.saved_philosophers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved philosophers" ON public.saved_philosophers
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view own conversations" ON public.chat_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own conversations" ON public.chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.chat_conversations
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant access to service role for admin operations
GRANT ALL ON public.philosophers TO service_role;
GRANT ALL ON public.quotes TO service_role;
GRANT ALL ON public.concerns TO service_role;
GRANT ALL ON public.admin_users TO service_role;
GRANT ALL ON public.check_ins TO service_role;

-- Grant access to authenticated users for user tables
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.saved_quotes TO authenticated;
GRANT ALL ON public.saved_philosophers TO authenticated;
GRANT ALL ON public.chat_conversations TO authenticated;
GRANT SELECT ON public.philosophers TO authenticated;
GRANT SELECT ON public.quotes TO authenticated;
GRANT SELECT ON public.concerns TO authenticated;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_philosophers_updated_at BEFORE UPDATE ON public.philosophers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON public.quotes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_conversations_updated_at BEFORE UPDATE ON public.chat_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
