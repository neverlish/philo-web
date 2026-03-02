// types/index.ts
export interface Philosopher {
  id: string;
  name: string;
  nameEn: string;
  era: string;
  school: string;
  description: string;
  imageUrl?: string;
}

export interface Quote {
  id: string;
  philosopherId: string;
  text: string;
  meaning: string;
  application: string;
  category: string;
  date?: string;
}

export interface Prescription {
  id: string;
  quote: Quote;
  philosopher: Philosopher;
  title: string;
  subtitle: string;
}

export interface SavedPrescription {
  id: string;
  prescriptionId: string;
  savedAt: string;
  prescription: Prescription;
}

export interface SharedThought {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  likes: number;
}

// Supabase Database Types
export interface DbPhilosopher {
  id: string;
  name: string;
  name_en: string;
  era: '고대' | '중세' | '근대' | '현대';
  region: '서양' | '동양';
  years?: string;
  core_idea: string;
  description?: string;
  application?: string;
  keywords: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DbQuote {
  id: string;
  philosopher_id: string;
  text: string;
  meaning: string;
  application: string;
  category?: string;
  book?: string;
  date_scheduled?: string;
  concerns: string[];
  created_at: string;
  updated_at: string;
  philosopher?: DbPhilosopher;
}

export interface DbConcern {
  id: string;
  text: string;
  category: string;
  display_order: number;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbUser {
  id: string;
  email?: string;
  nickname?: string;
  onboarded: boolean;
  interests?: string[];
  current_concerns?: string[];
  created_at: string;
  updated_at: string;
}

export interface DbUserSavedQuote {
  id: string;
  user_id: string;
  quote_id: string;
  created_at: string;
  quote?: DbQuote;
}

export interface DbUserSavedPhilosopher {
  id: string;
  user_id: string;
  philosopher_id: string;
  created_at: string;
  philosopher?: DbPhilosopher;
}

export interface DbUserReadQuote {
  id: string;
  user_id: string;
  quote_id: string;
  read_at: string;
  quote?: DbQuote;
}
