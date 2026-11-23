import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2, Trash2, Eraser, Copy, Sparkles, Hand, Gauge, Activity,
  Info, Settings2, ChevronDown, CheckCircle2,
} from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { CameraView } from '@/components/CameraView';
import { PageTransition } from '@/components/PageTransition';
import { useHandDetection, normalizeLandmarks, classifyDemoGesture, type HandResult } from '@/hooks/useHandDetection';
import { useSignModel } from '@/hooks/useSignModel';
import { useSpeech } from '@/hooks/useSpeech';
import { useSettings, LANGUAGE_LABELS, type Language } from '@/context/SettingsContext';
import { useToast } from '@/context/ToastContext';
import { useHistory } from '@/hooks/useHistory';

const STABILITY_FRAMES = 10;
const CONFIDENCE_THRESHOLD = 0.8;
const COOLDOWN_MS = 1500;

export function TranslatorPage() {
  const { isDemoMode, modelLoaded, labels } = useSignModel();
  const { speaking, speak, stop, voices, supported: speechSupported } = useSpeech();
  const { settings, updateVoice } = useSettings();
  const { showToast } = useToast();
  const { addEntry } = useHistory();

  const [detectedSign, setDetectedSign] = useState<string | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [sentence, setSentence] = useState<string[]>([]);
  const [signCount, setSignCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);

  const stabilityRef = useRef<{ label: string; count: number }>({ label: '', count: 0 });
  const cooldownRef = useRef<number>(0);
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });
  const handsDetectedRef = useRef(false);

  const handleHandsDetected = useCallback((hands: HandResult[]) => {
    handsDetectedRef.current = hands.length > 0;
    // FPS tracking
    fpsRef.current.frames++;
    const now = performance.now();
    if (now - fpsRef.current.lastTime >= 1000) {
      setFps(fpsRef.current.frames);
      fpsRef.current.frames = 0;
      fpsRef.current.lastTime = now;
    }

    if (hands.length === 0) {
      setDetectedSign(null);
      setConfidence(0);
      stabilityRef.current = { label: '', count: 0 };
      return;
    }

    let prediction: string | null = null;
    let conf = 0;

    if (isDemoMode) {
      prediction = classifyDemoGesture(hands);
      conf = prediction ? 0.85 : 0;
    } else {
      // Model mode - would use TensorFlow.js model
      // For now, use demo classification as fallback
      prediction = classifyDemoGesture(hands);
      conf = prediction ? 0.85 : 0;
    }

    setDetectedSign(prediction);
    setConfidence(conf);

    if (prediction && conf > CONFIDENCE_THRESHOLD) {
      if (stabilityRef.current.label === prediction) {
        stabilityRef.current.count++;
      } else {
        stabilityRef.current = { label: prediction, count: 1 };
      }

      if (stabilityRef.current.count >= STABILITY_FRAMES && now - cooldownRef.current > COOLDOWN_MS) {
        cooldownRef.current = now;
        stabilityRef.current = { label: '', count: 0 };
        setSentence((prev) => [...prev, prediction]);
        setSignCount((prev) => prev + 1);

        if (settings.voice.autoSpeak && speechSupported) {
          speak(prediction);
        }
      }
    }
  }, [isDemoMode, speak, settings.voice.autoSpeak, speechSupported]);

  const handleSpeakSentence = () => {
    const text = sentence.join(' ');
    if (!text.trim()) {
      showToast('Nothing to speak yet', 'info');
      return;
    }
    if (speechSupported) {
      speak(text);
      addEntry(text, 'sign');
    } else {
      showToast('Text-to-speech is not supported in your browser', 'error');
    }
  };

  const handleClear = () => {
    setSentence([]);
  };

  const handleBackspace = () => {
    setSentence((prev) => prev.slice(0, -1));
  };

  const handleCopy = async () => {
    const text = sentence.join(' ');
    if (!text.trim()) {
      showToast('Nothing to copy yet', 'info');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Failed to copy text', 'error');
    }
  };

  const removeChip = (idx: number) => {
    setSentence((prev) => prev.filter((_, i) => i !== idx));
  };

  const filteredVoices = voices.filter((v) => {
    const langCode = { en: 'en', hi: 'hi', ta: 'ta' }[settings.voice.language];
    return v.lang.toLowerCase().startsWith(langCode);
  });

  return (
    <PageTransition>
      <div className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary">Sign Language Translator</h1>
              <p className="text-secondary text-sm mt-1">Sign to the camera and see your words appear</p>
            </div>
            {isDemoMode && (
              <div className="relative group">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-amber-300">Demo Mode</span>
                  <Info className="w-3.5 h-3.5 text-amber-400 cursor-help" />
                </div>
                <div className="absolute top-full right-0 mt-2 w-72 glass-strong p-4 text-xs text-secondary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <p className="font-medium text-primary mb-1">Demo Mode Active</p>
                  <p>No trained model was found at <code className="text-cyan-300">/public/model/</code>. Using rule-based gesture recognition instead. Place a TensorFlow.js model (model.json + weights) and labels.json there to enable full recognition.</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left: Camera */}
            <div>
              <CameraView onHandsDetected={handleHandsDetected} />
            </div>

            {/* Right: Results */}
            <div className="flex flex-col gap-5">
              {/* Card A: Detected Sign */}
              <GlassCard glow={!!detectedSign} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-sm font-semibold text-secondary uppercase tracking-wide">Detected Sign</h3>
                  {detectedSign && (
                    <span className="flex items-center gap-1 text-xs text-teal-300">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Locked
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center min-h-[80px] mb-4">
                  <AnimatePresence mode="wait">
                    {detectedSign ? (
                      <motion.div
                        key={detectedSign}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="text-center"
                      >
                        <span className="font-heading text-5xl sm:text-6xl font-bold text-gradient">
                          {detectedSign}
                        </span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                      >
                        <Hand className="w-10 h-10 text-muted mx-auto mb-2" />
                        <p className="text-muted text-sm">Show a sign to the camera…</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {/* Confidence bar */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-secondary">Confidence</span>
                    <span className="text-xs font-medium text-primary">{(confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      animate={{ width: `${confidence * 100}%` }}
                      transition={{ duration: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Card B: Sentence */}
              <GlassCard className="p-6">
                <h3 className="font-heading text-sm font-semibold text-secondary uppercase tracking-wide mb-4">Sentence</h3>
                <textarea
                  value={sentence.join(' ')}
                  onChange={(e) => {
                    const words = e.target.value.trim().split(/\s+/).filter(Boolean);
                    setSentence(words);
                  }}
                  placeholder="Your sentence will build here as you sign…"
                  className="glass-input w-full px-4 py-3 text-lg text-primary resize-none"
                  rows={3}
                  aria-label="Sentence output"
                />
                {/* Recent sign chips */}
                {sentence.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {sentence.map((word, idx) => (
                      <motion.div
                        key={`${word}-${idx}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-button px-3 py-1.5 text-xs font-medium text-primary cursor-pointer flex items-center gap-1.5"
                        onClick={() => removeChip(idx)}
                        title="Click to remove"
                      >
                        {word}
                        <span className="text-muted hover:text-pink-400">×</span>
                      </motion.div>
                    ))}
                  </div>
                )}
                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <button
                    onClick={handleSpeakSentence}
                    className="accent-button flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold"
                    disabled={!speechSupported}
                  >
                    {speaking ? (
                      <span className="sound-wave">
                        <span /><span /><span /><span /><span />
                      </span>
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    Speak
                  </button>
                  <button
                    onClick={handleCopy}
                    className="glass-button flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-primary"
                    aria-label="Copy sentence"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={handleBackspace}
                    className="glass-button flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-primary"
                    aria-label="Remove last word"
                  >
                    <Eraser className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClear}
                    className="glass-button flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-primary"
                    aria-label="Clear sentence"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </button>
                </div>
              </GlassCard>

              {/* Card C: Voice Settings */}
              <GlassCard className="p-6">
                <button
                  onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                  className="flex items-center justify-between w-full"
                  aria-expanded={showVoiceSettings}
                >
                  <h3 className="font-heading text-sm font-semibold text-secondary uppercase tracking-wide flex items-center gap-2">
                    <Settings2 className="w-4 h-4" />
                    Voice Settings
                  </h3>
                  <ChevronDown className={`w-4 h-4 text-secondary transition-transform ${showVoiceSettings ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showVoiceSettings && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-4">
                        {/* Auto-speak toggle */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-primary">Auto-speak each sign</span>
                          <button
                            onClick={() => updateVoice({ autoSpeak: !settings.voice.autoSpeak })}
                            className={`toggle-switch ${settings.voice.autoSpeak ? 'active' : ''}`}
                            role="switch"
                            aria-checked={settings.voice.autoSpeak}
                            aria-label="Toggle auto-speak"
                          />
                        </div>

                        {/* Language selector */}
                        <div>
                          <label className="text-xs text-secondary mb-1.5 block">Language</label>
                          <div className="flex gap-2">
                            {(Object.entries(LANGUAGE_LABELS) as [Language, string][]).map(([code, label]) => (
                              <button
                                key={code}
                                onClick={() => updateVoice({ language: code })}
                                className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                                  settings.voice.language === code
                                    ? 'accent-button'
                                    : 'glass-button text-secondary'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Voice selector */}
                        {filteredVoices.length > 0 && (
                          <div>
                            <label className="text-xs text-secondary mb-1.5 block">Voice</label>
                            <select
                              value={settings.voice.voiceURI}
                              onChange={(e) => updateVoice({ voiceURI: e.target.value })}
                              className="glass-input w-full px-3 py-2 text-sm"
                            >
                              {filteredVoices.map((v) => (
                                <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-800">
                                  {v.name} ({v.lang})
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {/* Speed slider */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs text-secondary">Speed</label>
                            <span className="text-xs font-medium text-primary">{settings.voice.rate.toFixed(1)}x</span>
                          </div>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={settings.voice.rate}
                            onChange={(e) => updateVoice({ rate: parseFloat(e.target.value) })}
                            aria-label="Speech speed"
                          />
                        </div>

                        {/* Pitch slider */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs text-secondary">Pitch</label>
                            <span className="text-xs font-medium text-primary">{settings.voice.pitch.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={settings.voice.pitch}
                            onChange={(e) => updateVoice({ pitch: parseFloat(e.target.value) })}
                            aria-label="Speech pitch"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>

              {/* Card D: Quick info */}
              <GlassCard className="p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <Hand className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-primary">{signCount}</div>
                    <div className="text-xs text-secondary">Signs Detected</div>
                  </div>
                  <div>
                    <Gauge className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-primary">{fps}</div>
                    <div className="text-xs text-secondary">FPS</div>
                  </div>
                  <div>
                    <Activity className="w-5 h-5 text-teal-400 mx-auto mb-1" />
                    <div className="text-2xl font-bold text-primary">{modelLoaded ? (isDemoMode ? 'Demo' : 'AI') : '…'}</div>
                    <div className="text-xs text-secondary">Mode</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
