import { useState, useEffect, useRef, useCallback } from 'react';
import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

export interface Landmark {
  x: number;
  y: number;
  z: number;
}

export interface HandResult {
  landmarks: Landmark[];
  handedness: string;
}

interface UseHandDetectionReturn {
  handLandmarker: HandLandmarker | null;
  isLoaded: boolean;
  loadingError: string | null;
  detect: (video: HTMLVideoElement) => HandResult[];
  drawLandmarks: (canvas: HTMLCanvasElement, video: HTMLVideoElement, results: HandResult[]) => void;
}

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
];

export function useHandDetection(): UseHandDetectionReturn {
  const [handLandmarker, setHandLandmarker] = useState<HandLandmarker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadModel() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
        );
        const landmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numHands: 2,
        });
        if (!cancelled) {
          setHandLandmarker(landmarker);
          setIsLoaded(true);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadingError('Failed to load hand detection model: ' + (err as Error).message);
          setIsLoaded(true);
        }
      }
    }
    loadModel();
    return () => { cancelled = true; };
  }, []);

  const detect = useCallback((video: HTMLVideoElement): HandResult[] => {
    if (!handLandmarker || video.readyState < 2) return [];
    try {
      const now = performance.now();
      const results = handLandmarker.detectForVideo(video, now);
      const hands: HandResult[] = [];
      if (results.landmarks && results.landmarks.length > 0) {
        for (let i = 0; i < results.landmarks.length; i++) {
          hands.push({
            landmarks: results.landmarks[i].map((lm) => ({ x: lm.x, y: lm.y, z: lm.z })),
            handedness: results.handednesses[i]?.[0]?.categoryName || 'Right',
          });
        }
      }
      return hands;
    } catch {
      return [];
    }
  }, [handLandmarker]);

  const drawLandmarks = useCallback((
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement,
    results: HandResult[]
  ) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    if (canvas.width !== w) canvas.width = w;
    if (canvas.height !== h) canvas.height = h;
    ctx.clearRect(0, 0, w, h);

    // Mirror the canvas to match the mirrored video display
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-w, 0);

    const colors = ['#7c3aed', '#06b6d4'];
    for (let handIdx = 0; handIdx < results.length; handIdx++) {
      const hand = results[handIdx];
      const color = colors[handIdx % colors.length];

      // Draw connections with neon glow
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      for (const [start, end] of HAND_CONNECTIONS) {
        const s = hand.landmarks[start];
        const e = hand.landmarks[end];
        if (s && e) {
          ctx.moveTo(s.x * w, s.y * h);
          ctx.lineTo(e.x * w, e.y * h);
        }
      }
      ctx.stroke();

      // Draw landmark points
      ctx.shadowBlur = 8;
      for (let i = 0; i < hand.landmarks.length; i++) {
        const lm = hand.landmarks[i];
        const isTip = [4, 8, 12, 16, 20].includes(i);
        ctx.fillStyle = isTip ? '#ec4899' : color;
        ctx.beginPath();
        ctx.arc(lm.x * w, lm.y * h, isTip ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }, []);

  return { handLandmarker, isLoaded, loadingError, detect, drawLandmarks };
}

// Normalize landmarks for model input: relative to wrist, scale-invariant
export function normalizeLandmarks(hands: HandResult[]): number[] {
  if (hands.length === 0) return new Array(126).fill(0);

  const result: number[] = [];
  for (let h = 0; h < 2; h++) {
    if (h < hands.length) {
      const landmarks = hands[h].landmarks;
      const wrist = landmarks[0];
      // Compute max distance from wrist for normalization
      let maxDist = 0;
      for (const lm of landmarks) {
        const dx = lm.x - wrist.x;
        const dy = lm.y - wrist.y;
        const dz = lm.z - wrist.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist > maxDist) maxDist = dist;
      }
      maxDist = maxDist || 1;

      for (const lm of landmarks) {
        result.push((lm.x - wrist.x) / maxDist);
        result.push((lm.y - wrist.y) / maxDist);
        result.push((lm.z - wrist.z) / maxDist);
      }
    } else {
      // Pad with zeros for missing hand
      for (let i = 0; i < 63; i++) result.push(0);
    }
  }
  return result;
}

// Rule-based gesture classification for demo mode
export function classifyDemoGesture(hands: HandResult[]): string | null {
  if (hands.length === 0) return null;

  const landmarks = hands[0].landmarks;
  if (landmarks.length < 21) return null;

  const fingerTips = [4, 8, 12, 16, 20];
  const fingerPips = [3, 6, 10, 14, 18];
  const fingerMcps = [2, 5, 9, 13, 17];

  const wrist = landmarks[0];
  const isExtended: boolean[] = [];
  for (let i = 0; i < 5; i++) {
    const tip = landmarks[fingerTips[i]];
    const pip = landmarks[fingerPips[i]];
    const mcp = landmarks[fingerMcps[i]];
    const tipDist = Math.sqrt((tip.x - wrist.x) ** 2 + (tip.y - wrist.y) ** 2);
    const pipDist = Math.sqrt((pip.x - wrist.x) ** 2 + (pip.y - wrist.y) ** 2);
    const mcpDist = Math.sqrt((mcp.x - wrist.x) ** 2 + (mcp.y - wrist.y) ** 2);
    isExtended.push(tipDist > pipDist && pipDist > mcpDist);
  }

  const extendedCount = isExtended.filter(Boolean).length;

  // Thumbs up: only thumb extended, thumb pointing up
  const thumbUp = landmarks[4].y < landmarks[3].y && landmarks[3].y < landmarks[2].y;
  if (isExtended[0] && !isExtended[1] && !isExtended[2] && !isExtended[3] && !isExtended[4] && thumbUp) {
    return 'Good';
  }

  // Victory / Peace: index and middle extended
  if (!isExtended[0] && isExtended[1] && isExtended[2] && !isExtended[3] && !isExtended[4]) {
    return 'Peace';
  }

  // Pointing: only index extended
  if (!isExtended[0] && isExtended[1] && !isExtended[2] && !isExtended[3] && !isExtended[4]) {
    return 'You';
  }

  // Open palm: all or most fingers extended
  if (extendedCount >= 4) {
    return 'Hello';
  }

  // Fist: no fingers extended
  if (extendedCount === 0) {
    return 'Yes';
  }

  return null;
}
