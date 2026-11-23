import { useState, useCallback, useRef, useEffect } from 'react';

interface UseSignModelReturn {
  modelLoaded: boolean;
  modelError: string | null;
  isDemoMode: boolean;
  labels: string[];
  predict: (input: number[]) => { label: string; confidence: number } | null;
}

export function useSignModel(): UseSignModelReturn {
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [labels, setLabels] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const modelRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    async function loadModel() {
      try {
        const labelsRes = await fetch('/model/labels.json');
        if (!labelsRes.ok) throw new Error('Labels file not found');
        const labelData = await labelsRes.json();
        const labelList: string[] = labelData.labels || labelData;
        setLabels(labelList);

        try {
          const tf = await import('@tensorflow/tfjs');
          const model = await tf.loadLayersModel('/model/model.json');
          if (!cancelled) {
            modelRef.current = model;
            setModelLoaded(true);
            setIsDemoMode(false);
          }
        } catch {
          if (!cancelled) {
            setIsDemoMode(true);
            setModelLoaded(true);
            setLabels(['Hello', 'Yes', 'Good', 'You', 'Peace']);
          }
        }
      } catch {
        if (!cancelled) {
          setIsDemoMode(true);
          setModelLoaded(true);
          setLabels(['Hello', 'Yes', 'Good', 'You', 'Peace']);
        }
      }
    }
    loadModel();
    return () => { cancelled = true; };
  }, []);

  const predict = useCallback((input: number[]): { label: string; confidence: number } | null => {
    if (isDemoMode || !modelRef.current) return null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tf = (window as any).__tfjs;
      if (!tf) return null;
      const tensor = tf.tensor2d([input]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = (modelRef.current as any).predict(tensor);
      const data = result.dataSync();
      let maxIdx = 0;
      for (let i = 1; i < data.length; i++) {
        if (data[i] > data[maxIdx]) maxIdx = i;
      }
      tensor.dispose();
      result.dispose();
      return { label: labels[maxIdx] || 'Unknown', confidence: data[maxIdx] };
    } catch {
      return null;
    }
  }, [isDemoMode, labels]);

  return { modelLoaded, modelError, isDemoMode, labels, predict };
}
