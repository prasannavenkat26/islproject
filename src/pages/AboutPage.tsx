import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Hand, Brain, Type, Volume2, ArrowRight, Code, Cpu, Eye, Mic, ShieldCheck, Zap } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { PageTransition } from '@/components/PageTransition';

const PIPELINE = [
  { icon: Camera, title: 'Camera', description: 'Live webcam feed is captured using getUserMedia API. The video is mirrored for natural interaction.', color: 'from-violet-600 to-indigo-600' },
  { icon: Hand, title: 'Hand Landmarks', description: 'MediaPipe Hands detects 21 key points per hand (up to 2 hands) in real-time, tracking 3D positions.', color: 'from-cyan-500 to-blue-600' },
  { icon: Brain, title: 'AI Model', description: 'A TensorFlow.js model classifies normalized landmark data into sign language gestures with confidence scores.', color: 'from-teal-500 to-emerald-600' },
  { icon: Type, title: 'Text Output', description: 'Recognized signs are converted to text and assembled into sentences with stability and cooldown logic.', color: 'from-amber-500 to-orange-600' },
  { icon: Volume2, title: 'Voice Output', description: 'The Web Speech API converts the text into natural-sounding speech in multiple languages.', color: 'from-pink-500 to-rose-600' },
];

const TECH_STACK = [
  { name: 'React + TypeScript', icon: Code, description: 'UI framework with type safety' },
  { name: 'Vite', icon: Zap, description: 'Fast build tool and dev server' },
  { name: 'Tailwind CSS', icon: Cpu, description: 'Utility-first styling' },
  { name: 'MediaPipe Hands', icon: Hand, description: 'Hand landmark detection' },
  { name: 'TensorFlow.js', icon: Brain, description: 'In-browser ML inference' },
  { name: 'Web Speech API', icon: Volume2, description: 'Text-to-speech synthesis' },
  { name: 'Speech Recognition API', icon: Mic, description: 'Speech-to-text recognition' },
  { name: 'Framer Motion', icon: Eye, description: 'Smooth UI animations' },
];

export function AboutPage() {
  return (
    <PageTransition>
      <div className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-primary mb-4">About ISL Vision</h1>
            <p className="text-secondary text-lg max-w-2xl mx-auto">
              A real-time Indian Sign Language recognition and two-way translation system that runs entirely in the browser.
            </p>
          </div>

          {/* How it works */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary mb-2">How It Works</h2>
            <p className="text-secondary text-sm mb-6">From camera to voice in 5 steps</p>
            <div className="space-y-4">
              {PIPELINE.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <GlassCard className="p-6 flex items-start gap-5">
                      <div className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-muted">{String(idx + 1).padStart(2, '0')}</span>
                          <h3 className="font-heading text-lg font-semibold text-primary">{step.title}</h3>
                        </div>
                        <p className="text-secondary text-sm leading-relaxed">{step.description}</p>
                      </div>
                      {idx < PIPELINE.length - 1 && (
                        <ArrowRight className="w-5 h-5 text-muted flex-shrink-0 mt-5 hidden sm:block" />
                      )}
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Tech stack */}
          <section className="mb-12">
            <h2 className="font-heading text-2xl font-bold text-primary mb-2">Technology Stack</h2>
            <p className="text-secondary text-sm mb-6">Built with modern web technologies — no backend required</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TECH_STACK.map((tech, idx) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <GlassCard className="p-5 card-hover h-full">
                      <Icon className="w-7 h-7 text-violet-400 mb-3" />
                      <h3 className="font-heading text-sm font-semibold text-primary mb-1">{tech.name}</h3>
                      <p className="text-xs text-secondary">{tech.description}</p>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12">
            <GlassCard strong className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-2">Privacy First</h3>
                  <p className="text-secondary text-sm leading-relaxed">
                    ISL Vision runs entirely in your browser. Camera feed, hand detection, AI model inference, and speech synthesis all happen locally on your device. No video, audio, or personal data is ever uploaded to any server. Your privacy is built into the architecture.
                  </p>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* CTA */}
          <section>
            <GlassCard strong className="p-8 text-center">
              <h2 className="font-heading text-xl font-bold text-primary mb-3">Ready to try it?</h2>
              <p className="text-secondary text-sm mb-6 max-w-md mx-auto">
                Start translating signs to text and voice, or explore the ISL dictionary.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/translator" className="accent-button flex items-center gap-2 px-6 py-3 text-sm font-semibold">
                  <Camera className="w-4 h-4" />
                  Open Translator
                </Link>
                <Link to="/dictionary" className="glass-button flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary">
                  Browse Dictionary
                </Link>
              </div>
            </GlassCard>
          </section>
        </div>
      </div>
    </PageTransition>
  );
}
