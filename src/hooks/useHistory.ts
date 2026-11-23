import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface HistoryEntry {
  id: string;
  text: string;
  timestamp: number;
  type: 'sign' | 'speech';
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('translations')
      .select('id, text, type, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      // Fall back to localStorage if the database is unreachable
      try {
        const stored = localStorage.getItem('isl-vision-history');
        if (stored) setEntries(JSON.parse(stored));
      } catch {
        // ignore
      }
    } else if (data) {
      setEntries(
        data.map((row) => ({
          id: row.id,
          text: row.text,
          type: row.type as 'sign' | 'speech',
          timestamp: new Date(row.created_at).getTime(),
        }))
      );
    }
    setLoading(false);
  }, []);

  const addEntry = useCallback(async (text: string, type: HistoryEntry['type']) => {
    const tempId = Date.now().toString() + Math.random().toString(36).slice(2);
    const entry: HistoryEntry = {
      id: tempId,
      text,
      timestamp: Date.now(),
      type,
    };

    // Optimistic update
    setEntries((prev) => [entry, ...prev].slice(0, 100));

    const { data, error } = await supabase
      .from('translations')
      .insert({ text, type })
      .select('id, text, type, created_at')
      .single();

    if (error) {
      // Fall back to localStorage
      try {
        const stored = localStorage.getItem('isl-vision-history');
        const items = stored ? JSON.parse(stored) : [];
        items.unshift(entry);
        localStorage.setItem('isl-vision-history', JSON.stringify(items.slice(0, 100)));
      } catch {
        // ignore
      }
    } else if (data) {
      // Replace temp entry with real one
      setEntries((prev) =>
        prev.map((e) =>
          e.id === tempId
            ? { id: data.id, text: data.text, type: data.type, timestamp: new Date(data.created_at).getTime() }
            : e
        )
      );
    }
    return entry;
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    // Optimistic update
    setEntries((prev) => prev.filter((e) => e.id !== id));

    const { error } = await supabase.from('translations').delete().eq('id', id);

    if (error) {
      // Fall back to localStorage
      try {
        const stored = localStorage.getItem('isl-vision-history');
        const items = stored ? JSON.parse(stored) : [];
        const filtered = items.filter((e: HistoryEntry) => e.id !== id);
        localStorage.setItem('isl-vision-history', JSON.stringify(filtered));
      } catch {
        // ignore
      }
    }
  }, []);

  const clearAll = useCallback(async () => {
    // Optimistic update
    setEntries([]);

    const { error } = await supabase.from('translations').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) {
      try {
        localStorage.setItem('isl-vision-history', '[]');
      } catch {
        // ignore
      }
    }
  }, []);

  return { entries, loading, addEntry, deleteEntry, clearAll };
}
