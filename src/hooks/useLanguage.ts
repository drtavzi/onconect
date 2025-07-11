import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, getTranslation } from '@/lib/translations';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

export const useLanguage = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: 'uz',
      setLanguage: (language: Language) => set({ language }),
      t: (key: string) => getTranslation(key, get().language),
    }),
    {
      name: 'onconect-language',
    }
  )
);