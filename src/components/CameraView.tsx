import { useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, AlertTriangle, Hand, Loader2 } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { useCamera } from '@/hooks/useCamera';
import { useHandDetection, type HandResult } from '@/hooks/useHandDetection';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraViewProps {
  onHandsDetected?: (hands: HandResult[]) => void;
  onPrediction?: (label: string | null, confidence: number) => void;
  showOverlay?: boolean;
  className?: string;
  cardGlowWhenHand?: boolean;
}

export function CameraView({
  onHandsDetected,
  showOverlay = true,
  className = '',
  cardGlowWhenHand = true,
}: CameraViewProps) {
  const { videoRef, isActive, error, facingMode, start, stop, switchCamera } = useCamera();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isLoaded, detect, drawLandmarks } = useHandDetection();
  const animationRef = useRef<number | null>(null);
  const fpsRef = useRef({ frames: 0, lastTime: performance.now() });

  useEffect(() => {
    if (!isActive || !isLoaded) return;
    let lastDetectTime = 0;
    const TARGET_FPS = 30;
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    const loop = (time: number) => {
      if (!isActive) return;
      if (time - lastDetectTime >= FRAME_INTERVAL) {
        const video = videoRef.current;
        if (video && video.readyState >= 2) {
          const hands = detect(video);
          if (showOverlay && canvasRef.current) {
            drawLandmarks(canvasRef.current, video, hands);
          }
          if (onHandsDetected) {
            onHandsDetected(hands);
          }
        }
        lastDetectTime = time;
        fpsRef.current.frames++;
        const now = performance.now();
        if (now - fpsRef.current.lastTime >= 1000) {
          fpsRef.current.frames = 0;
          fpsRef.current.lastTime = now;
        }
      }
      animationRef.current = requestAnimationFrame(loop);
    };
    animationRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, isLoaded, detect, drawLandmarks, showOverlay, onHandsDetected, videoRef]);

  return (
    <GlassCard
      className={`p-4 sm:p-6 ${cardGlowWhenHand ? 'transition-all duration-300' : ''} ${className}`}
    >
      {/* Status chip */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
              error
                ? 'bg-pink-500/20 text-pink-300'
                : !isActive
                ? 'bg-white/10 text-secondary'
                : 'bg-teal-500/20 text-teal-300'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${error ? 'bg-pink-400' : !isActive ? 'bg-gray-400' : 'bg-teal-400 animate-pulse'}`} />
            {error ? 'Camera Error' : !isActive ? 'Camera Off' : isLoaded ? 'Looking for hands…' : 'Loading…'}
          </span>
        </div>
        {isActive && (
          <button
            onClick={switchCamera}
            className="glass-button flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary"
            aria-label="Switch camera"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Flip
          </button>
        )}
      </div>

      {/* Video container */}
      <div
        className={`relative rounded-2xl overflow-hidden bg-black/40 aspect-[4/3] flex items-center justify-center ${
          cardGlowWhenHand ? 'glow-border' : ''
        }`}
        style={{ minHeight: '280px' }}
      >
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        {showOverlay && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        )}

        {/* Not active state */}
        {!isActive && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
            <div className="w-20 h-20 rounded-full glass flex items-center justify-center">
              <Camera className="w-10 h-10 text-secondary" />
            </div>
            <p className="text-secondary text-sm text-center max-w-xs px-4">
              Camera is off. Press the Start Camera button to begin detecting sign language gestures.
            </p>
          </div>
        )}

        {/* Loading state */}
        {isActive && !isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 glass">
            <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
            <p className="text-secondary text-sm">Loading hand detection model…</p>
          </div>
        )}

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 glass-strong"
            >
              <div className="w-16 h-16 rounded-full bg-pink-500/20 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-pink-400" />
              </div>
              <p className="text-primary text-sm text-center max-w-xs">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hand detected indicator */}
        {isActive && isLoaded && (
          <div className="absolute top-3 right-3 glass-button px-2.5 py-1 flex items-center gap-1 text-xs">
            <Hand className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-secondary">{facingMode === 'user' ? 'Front' : 'Back'}</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mt-4">
        {!isActive ? (
          <button
            onClick={start}
            className="accent-button flex items-center gap-2 px-5 py-2.5 text-sm font-semibold flex-1 sm:flex-none"
          >
            <Camera className="w-4 h-4" />
            Start Camera
          </button>
        ) : (
          <button
            onClick={stop}
            className="glass-button flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-primary flex-1 sm:flex-none"
          >
            <CameraOff className="w-4 h-4" />
            Stop Camera
          </button>
        )}
      </div>
    </GlassCard>
  );
}
