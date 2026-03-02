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
