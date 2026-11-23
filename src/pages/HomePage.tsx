import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hand, Volume2, MessageSquare, Mic, ArrowRight, Zap, Eye, Sparkles, ShieldCheck } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { PageTransition } from '@/components/PageTransition';

const FEATURES = [
  {
    icon: Eye,
    title: 'Live Detection',
    description: 'Real-time hand landmark detection using MediaPipe. See 21 points per hand with neon-glowing overlay lines.',
    color: 'from-violet-600 to-indigo-600',
  },
  {
    icon: MessageSquare,
    title: 'Text Output',
    description: 'Recognized signs appear as text instantly. Build full sentences sign by sign with smooth animations.',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Volume2,
    title: 'Voice Output',
    description: 'Hear the recognized signs spoken aloud with customizable voice, speed, and pitch in multiple languages.',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    icon: Mic,
    title: 'Speak to Text',
    description: 'Reverse mode lets hearing users speak and converts their words to text for two-way communication.',
    color: 'from-pink-500 to-rose-600',
  },
];

const STEPS = [
  { icon: '📷', label: 'Camera', desc: 'Live webcam feed' },
  { icon: '✋', label: 'Landmarks', desc: 'Hand tracking' },
  { icon: '🧠', label: 'Model', desc: 'AI prediction' },
  { icon: '📝', label: 'Text', desc: 'Sign to text' },
  { icon: '🔊', label: 'Voice', desc: 'Text to speech' },
];

export function HomePage() {
  return (
    <PageTransition>
      <div className="pt-28 pb-12 px-4">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-secondary mb-6">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                AI-Powered Sign Language Recognition
              </div>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-primary mb-6">
                Bridge the gap with{' '}
                <span className="text-gradient">Indian Sign Language</span>
              </h1>
              <p className="text-lg text-secondary mb-8 leading-relaxed max-w-xl">
                ISL Vision detects hand gestures in real-time and translates them into text and voice.
                Two-way communication made simple — signs become words, and spoken words become text.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link to="/translator" className="accent-button flex items-center gap-2 px-6 py-3.5 text-base font-semibold">
                  <Hand className="w-5 h-5" />
                  Start Translating
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/learn" className="glass-button flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-primary">
                  Learn Signs
                </Link>
              </div>
              <div className="flex items-center gap-2 mt-6 text-sm text-muted">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                All processing happens in your browser. No video is uploaded.
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard strong className="p-8 flex flex-col items-center gap-6">
                <div className="relative">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-500/30 flex items-center justify-center"
                  >
                    <Hand className="w-20 h-20 text-white" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.2, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 rounded-full border-2 border-violet-400/40"
                  />
                </div>
                {/* Pipeline preview */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {STEPS.map((step, idx) => (
                    <div key={step.label} className="flex items-center gap-2">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-12 h-12 rounded-xl glass flex items-center justify-center text-xl">
                          {step.icon}
                        </div>
                        <span className="text-[10px] text-secondary font-medium">{step.label}</span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted" />
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="max-w-7xl mx-auto mt-20">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-primary mb-3">Powerful Features</h2>
            <p className="text-secondary max-w-2xl mx-auto">Everything you need for seamless sign language communication</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <GlassCard className="p-6 h-full card-hover">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                    <p className="text-sm text-secondary leading-relaxed">{feature.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto mt-20">
          <GlassCard strong className="p-8 sm:p-12 text-center">
            <Zap className="w-12 h-12 text-amber-400 mx-auto mb-4" />
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-4">
              Ready to start translating?
            </h2>
            <p className="text-secondary mb-6 max-w-xl mx-auto">
              Open the translator, allow camera access, and start signing. It's that simple.
            </p>
            <Link to="/translator" className="accent-button inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold">
              <Hand className="w-5 h-5" />
              Launch Translator
              <ArrowRight className="w-4 h-4" />
            </Link>
          </GlassCard>
        </section>
      </div>
    </PageTransition>
  );
}
