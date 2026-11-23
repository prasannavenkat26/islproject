import { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, CheckCircle2, XCircle, Trophy, Flame, Target, RotateCcw, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { CameraView } from '@/components/CameraView';
import { PageTransition } from '@/components/PageTransition';
import { useHandDetection, classifyDemoGesture, type HandResult } from '@/hooks/useHandDetection';
import { SIGNS } from '@/data/signs';

const PRACTICE_SIGNS = SIGNS.filter((s) =>
  ['Hello', 'Yes', 'Good', 'You', 'Peace', 'Thank You', 'No', 'Help'].includes(s.name)
);

export function LearnPage() {
  const [targetSign, setTargetSign] = useState(() =>
    PRACTICE_SIGNS[Math.floor(Math.random() * PRACTICE_SIGNS.length)]
  );
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'try-again'>('idle');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const cooldownRef = useRef<number>(0);
  const feedbackTimeoutRef = useRef<number | null>(null);

  const handleHandsDetected = useCallback((hands: HandResult[]) => {
    if (hands.length === 0) {
      if (feedback === 'idle') return;
      return;
    }

    const prediction = classifyDemoGesture(hands);
    const now = performance.now();
    if (now - cooldownRef.current < 2000) return;

    // Match against the target sign
    const targetName = targetSign.name;
    const matches =
      (prediction === targetName) ||
      (targetName === 'Hello' && prediction === 'Hello') ||
      (targetName === 'Yes' && prediction === 'Yes') ||
      (targetName === 'Good' && prediction === 'Good') ||
      (targetName === 'You' && prediction === 'You') ||
      (targetName === 'Peace' && prediction === 'Peace');

    if (prediction) {
      setAttempts((prev) => prev + 1);
      cooldownRef.current = now;

      if (matches) {
        setFeedback('correct');
        setScore((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = window.setTimeout(() => {
          setFeedback('idle');
          setTargetSign(PRACTICE_SIGNS[Math.floor(Math.random() * PRACTICE_SIGNS.length)]);
        }, 2500);
      } else if (prediction !== null) {
        setFeedback('try-again');
        setStreak(0);
        if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = window.setTimeout(() => setFeedback('idle'), 1500);
      }
    }
  }, [targetSign, feedback]);

  const handleNewTarget = () => {
    setFeedback('idle');
    setTargetSign(PRACTICE_SIGNS[Math.floor(Math.random() * PRACTICE_SIGNS.length)]);
  };

  const handleReset = () => {
    setScore(0);
    setStreak(0);
    setAttempts(0);
    setFeedback('idle');
    handleNewTarget();
  };

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    };
  }, []);

  return (
    <PageTransition>
      <div className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-2">Learn & Practice</h1>
            <p className="text-secondary text-sm">Show the target sign to the camera and get instant feedback</p>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <GlassCard className="p-4 text-center">
              <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-primary">{score}</div>
              <div className="text-xs text-secondary">Score</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-primary">{streak}</div>
              <div className="text-xs text-secondary">Streak</div>
            </GlassCard>
            <GlassCard className="p-4 text-center">
              <Target className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
              <div className="text-2xl font-bold text-primary">{attempts}</div>
              <div className="text-xs text-secondary">Attempts</div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Camera */}
            <CameraView onHandsDetected={handleHandsDetected} />

            {/* Target and feedback */}
            <div className="flex flex-col gap-5">
              {/* Target sign */}
              <GlassCard strong className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-sm font-semibold text-secondary uppercase tracking-wide">Your Target</h3>
                  <button
                    onClick={handleNewTarget}
                    className="glass-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    New Sign
                  </button>
                </div>
                <div className="flex flex-col items-center py-4">
                  <motion.div
                    key={targetSign.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-7xl mb-3"
                  >
                    {targetSign.emoji}
                  </motion.div>
                  <h2 className="font-heading text-3xl font-bold text-gradient mb-2">{targetSign.name}</h2>
                  <p className="text-secondary text-sm text-center max-w-xs">{targetSign.description}</p>
                </div>
              </GlassCard>

              {/* Feedback */}
              <GlassCard className="p-6 flex-1 flex flex-col items-center justify-center min-h-[180px]">
                <AnimatePresence mode="wait">
                  {feedback === 'correct' && (
                    <motion.div
                      key="correct"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="text-center"
                    >
                      {/* Confetti dots */}
                      <div className="relative">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 1, x: 0, y: 0 }}
                            animate={{
                              opacity: 0,
                              x: (Math.random() - 0.5) * 200,
                              y: (Math.random() - 0.5) * 200,
                            }}
                            transition={{ duration: 1.5 }}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                              background: ['#7c3aed', '#06b6d4', '#ec4899', '#14b8a6', '#f59e0b'][i % 5],
                              top: '50%',
                              left: '50%',
                            }}
                          />
                        ))}
                        <CheckCircle2 className="w-16 h-16 text-teal-400 mx-auto" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-teal-400 mt-4">Correct!</h3>
                      <p className="text-secondary text-sm mt-1">Great job! Next sign coming up…</p>
                    </motion.div>
                  )}

                  {feedback === 'try-again' && (
                    <motion.div
                      key="try-again"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      className="text-center"
                    >
                      <XCircle className="w-16 h-16 text-pink-400 mx-auto" />
                      <h3 className="font-heading text-2xl font-bold text-pink-400 mt-4">Try Again</h3>
                      <p className="text-secondary text-sm mt-1">That's not quite right. Keep practicing!</p>
                    </motion.div>
                  )}

                  {feedback === 'idle' && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center"
                    >
                      <Sparkles className="w-12 h-12 text-violet-400 mx-auto mb-3" />
                      <h3 className="font-heading text-lg font-semibold text-primary mb-1">Show the sign!</h3>
                      <p className="text-secondary text-sm">Perform "{targetSign.name}" with your hand</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="glass-button flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-primary w-full"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Session
              </button>
            </div>
          </div>

          {/* Hint */}
          <div className="mt-6">
            <GlassCard className="p-4 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0" />
              <p className="text-secondary text-sm">
                Practice mode works with the 5 demo gestures: Hello (open palm), Yes (fist), Good (thumbs up), You (pointing), Peace (victory).
                <Link to="/dictionary" className="text-cyan-400 hover:underline ml-1">Browse all signs</Link>
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
