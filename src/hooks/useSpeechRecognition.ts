import { useState, useRef, useCallback, useEffect } from 'react';
import { SPEECH_LANG_CODES, type Language } from '@/context/SettingsContext';

interface UseSpeechRecognitionReturn {
  transcript: string;
  isListening: boolean;
  error: string | null;
  supported: boolean;
  start: () => void;
  stop: () => void;
  clear: () => void;
}

export function useSpeechRecognition(lang: Language = 'en'): UseSpeechRecognitionReturn {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<unknown>(null);
  const langRef = useRef(lang);
  langRef.current = lang;

  const SpeechRecognitionClass = typeof window !== 'undefined'
    ? (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition
      || (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
    : null;

  const supported = !!SpeechRecognitionClass;

  const start = useCallback(() => {
    if (!SpeechRecognitionClass) {
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }
    setError(null);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Recognition = SpeechRecognitionClass as any;
      const recognition = new Recognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = SPEECH_LANG_CODES[langRef.current];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            final += result[0].transcript + ' ';
          } else {
            interim += result[0].transcript;
          }
        }
        if (final) {
          setTranscript((prev) => prev + final);
        }
      };
      recognition.onerror = (event: { error: string }) => {
        if (event.error === 'no-speech') return;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setError('Microphone permission denied. Please allow microphone access and try again.');
        } else {
          setError('Speech recognition error: ' + event.error);
        }
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };
      recognition.start();
      recognitionRef.current = recognition;
      setIsListening(true);
    } catch (err) {
      setError('Failed to start speech recognition: ' + (err as Error).message);
    }
  }, [SpeechRecognitionClass]);

  const stop = useCallback(() => {
    const recognition = recognitionRef.current as { stop?: () => void } | null;
    if (recognition && recognition.stop) {
      recognition.stop();
    }
    setIsListening(false);
  }, []);

  const clear = useCallback(() => {
    setTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current as { stop?: () => void } | null;
      if (recognition && recognition.stop) {
        recognition.stop();
      }
    };
  }, []);

  return { transcript, isListening, error, supported, start, stop, clear };
}
