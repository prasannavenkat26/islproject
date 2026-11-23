import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Trash2, Copy, Volume2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { PageTransition } from '@/components/PageTransition';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useSpeech } from '@/hooks/useSpeech';
import { useToast } from '@/context/ToastContext';
import { useHistory } from '@/hooks/useHistory';
import { LANGUAGE_LABELS, type Language } from '@/context/SettingsContext';

export function SpeakToTextPage() {
  const [lang, setLang] = useState<Language>('en');
  const { transcript, isListening, error, supported, start, stop, clear } = useSpeechRecognition(lang);
  const { speak, speaking, supported: speechSupported } = useSpeech();
  const { showToast } = useToast();
  const { addEntry } = useHistory();

  const handleToggleMic = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  const handleCopy = async () => {
    if (!transcript.trim()) {
      showToast('Nothing to copy yet', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(transcript);
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleSpeak = () => {
    if (!transcript.trim()) {
      showToast('Nothing to speak yet', 'info');
      return;
    }
    if (speechSupported) {
      speak(transcript, lang);
      addEntry(transcript, 'speech');
    }
  };

  const handleClear = () => {
    clear();
  };

  return (
    <PageTransition>
      <div className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-2">Speak to Text</h1>
            <p className="text-secondary text-sm">Speak naturally and see your words appear as text</p>
          </div>

          {/* Language selector */}
          <div className="flex justify-center gap-2 mb-8">
            {(Object.entries(LANGUAGE_LABELS) as [Language, string][]).map(([code, label]) => (
              <button
                key={code}
                onClick={() => { if (isListening) stop(); setLang(code); }}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  lang === code ? 'accent-button' : 'glass-button text-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Not supported fallback */}
          {!supported && (
            <GlassCard className="p-8 mb-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-pink-400" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-2">Browser Not Supported</h3>
                  <p className="text-secondary text-sm max-w-md">
                    Speech recognition is not available in this browser. Please use Google Chrome, Microsoft Edge, or Apple Safari for the best experience.
                  </p>
                </div>
              </div>
            </GlassCard>
          )}

          {supported && (
            <>
              {/* Mic button */}
              <div className="flex flex-col items-center gap-6 mb-8">
                <div className="relative">
                  {isListening && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 rounded-full border-2 border-pink-400"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
                        className="absolute inset-0 rounded-full border-2 border-violet-400"
                      />
                    </>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleToggleMic}
                    className={`relative w-28 h-28 rounded-full flex items-center justify-center shadow-2xl transition-all ${
                      isListening
                        ? 'bg-gradient-to-br from-pink-500 to-rose-600 glow-violet'
                        : 'accent-button'
                    }`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                  >
                    {isListening ? (
                      <MicOff className="w-10 h-10 text-white" />
                    ) : (
                      <Mic className="w-10 h-10 text-white" />
                    )}
                  </motion.button>
                </div>
                <p className={`text-sm font-medium ${isListening ? 'text-pink-300' : 'text-secondary'}`}>
                  {isListening ? 'Listening… Tap to stop' : 'Tap to start speaking'}
                </p>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4"
                  >
                    <div className="glass p-4 flex items-center gap-3 border-pink-500/30">
                      <AlertTriangle className="w-5 h-5 text-pink-400 flex-shrink-0" />
                      <p className="text-sm text-primary">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Transcript */}
              <GlassCard strong className="p-6 sm:p-8 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-sm font-semibold text-secondary uppercase tracking-wide">Live Transcript</h3>
                  {isListening && (
                    <span className="flex items-center gap-1.5 text-xs text-pink-300">
                      <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse" />
                      Recording
                    </span>
                  )}
                </div>
                <div className="min-h-[200px] sm:min-h-[280px] flex items-start">
                  {transcript ? (
                    <p className="text-xl sm:text-2xl text-primary leading-relaxed font-medium">
                      {transcript}
                      {isListening && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-0.5 h-6 sm:h-7 bg-violet-400 ml-1 align-middle"
                        />
                      )}
                    </p>
                  ) : (
                    <p className="text-muted text-lg">
                      {isListening ? 'Start speaking…' : 'Your spoken words will appear here.'}
                    </p>
                  )}
                </div>
              </GlassCard>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleSpeak}
                  className="accent-button flex items-center gap-2 px-5 py-3 text-sm font-semibold"
                  disabled={!transcript || !speechSupported}
                >
                  {speaking ? (
                    <span className="sound-wave"><span /><span /><span /><span /><span /></span>
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  Read Aloud
                </button>
                <button
                  onClick={handleCopy}
                  className="glass-button flex items-center gap-2 px-5 py-3 text-sm font-medium text-primary"
                  disabled={!transcript}
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
                <button
                  onClick={handleClear}
                  className="glass-button flex items-center gap-2 px-5 py-3 text-sm font-medium text-primary"
                  disabled={!transcript}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </>
          )}

          {/* Privacy note */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-muted">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
            Audio is processed locally by your browser. Nothing is uploaded.
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
