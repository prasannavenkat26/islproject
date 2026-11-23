import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeMode = 'dark' | 'light';
export type Language = 'en' | 'hi' | 'ta';

export interface VoiceSettings {
  autoSpeak: boolean;
  voiceURI: string;
  rate: number;
  pitch: number;
  language: Language;
}

export interface Settings {
  theme: ThemeMode;
  voice: VoiceSettings;
}

const DEFAULT_SETTINGS: Settings = {
  theme: 'dark',
  voice: {
    autoSpeak: false,
    voiceURI: '',
    rate: 1,
    pitch: 1,
    language: 'en',
  },
};

const STORAGE_KEY = 'isl-vision-settings';

interface SettingsContextValue {
  settings: Settings;
  theme: ThemeMode;
  toggleTheme: () => void;
  updateVoice: (partial: Partial<VoiceSettings>) => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_SETTINGS, ...parsed, voice: { ...DEFAULT_SETTINGS.voice, ...parsed.voice } };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (settings.theme === 'light') {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.add('light-mode');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.remove('light-mode');
    }
  }, [settings.theme]);

  const toggleTheme = () => {
    setSettings((prev) => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }));
  };

  const updateVoice = (partial: Partial<VoiceSettings>) => {
    setSettings((prev) => ({ ...prev, voice: { ...prev.voice, ...partial } }));
  };

  return (
    <SettingsContext.Provider value={{ settings, theme: settings.theme, toggleTheme, updateVoice }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  hi: 'Hindi',
  ta: 'Tamil',
};

export const SPEECH_LANG_CODES: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
};
