import { useCallback, useEffect, useState, useRef } from 'react';
import { useSettings, SPEECH_LANG_CODES, type Language } from '@/context/SettingsContext';

interface UseSpeechReturn {
  speaking: boolean;
  speak: (text: string, lang?: Language) => void;
  stop: () => void;
  voices: SpeechSynthesisVoice[];
  supported: boolean;
}

export function useSpeech(): UseSpeechReturn {
  const { settings, updateVoice } = useSettings();
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { autoSpeak, voiceURI, rate, pitch, language } = settings.voice;
  const settingsRef = useRef({ autoSpeak, voiceURI, rate, pitch, language });
  settingsRef.current = { autoSpeak, voiceURI, rate, pitch, language };

  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  useEffect(() => {
    if (!supported) return;
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
    };
    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, [supported]);

  const speak = useCallback((text: string, langOverride?: Language) => {
    if (!supported || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = langOverride || settingsRef.current.language;
    utterance.lang = SPEECH_LANG_CODES[lang];
    utterance.rate = settingsRef.current.rate;
    utterance.pitch = settingsRef.current.pitch;

    const v = window.speechSynthesis.getVoices();
    const selectedVoice = v.find((voice) => voice.voiceURI === settingsRef.current.voiceURI);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      const langVoice = v.find((voice) => voice.lang.startsWith(SPEECH_LANG_CODES[lang].split('-')[0]));
      if (langVoice) utterance.voice = langVoice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  // Load voices on mount for settings use
  useEffect(() => {
    if (!supported) return;
    // Some browsers need this
    window.speechSynthesis.getVoices();
  }, [supported]);

  // Save current voice URI if not set
  useEffect(() => {
    if (!supported || voiceURI || voices.length === 0) return;
    const defaultVoice = voices.find((v) => v.lang.startsWith('en')) || voices[0];
    if (defaultVoice) {
      updateVoice({ voiceURI: defaultVoice.voiceURI });
    }
  }, [voices, voiceURI, supported, updateVoice]);

  return { speaking, speak, stop, voices, supported };
}
