import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Volume2, Copy, Trash2, History, X, Inbox, Clock } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { PageTransition } from '@/components/PageTransition';
import { useHistory } from '@/hooks/useHistory';
import { useSpeech } from '@/hooks/useSpeech';
import { useToast } from '@/context/ToastContext';

function formatTime(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - ts;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function HistoryPage() {
  const { entries, loading, deleteEntry, clearAll } = useHistory();
  const { speak, speaking, supported: speechSupported } = useSpeech();
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return entries;
    return entries.filter((e) => e.text.toLowerCase().includes(search.toLowerCase()));
  }, [entries, search]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard', 'success');
    } catch {
      showToast('Failed to copy', 'error');
    }
  };

  const handleSpeak = (text: string) => {
    if (speechSupported) {
      speak(text);
    } else {
      showToast('Text-to-speech not supported', 'error');
    }
  };

  const handleClearAll = () => {
    clearAll();
    setConfirmClear(false);
    showToast('History cleared', 'success');
  };

  return (
    <PageTransition>
      <div className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary">History</h1>
              <p className="text-secondary text-sm mt-1">{entries.length} saved translation{entries.length !== 1 ? 's' : ''}</p>
            </div>
            {entries.length > 0 && (
              <button
                onClick={() => setConfirmClear(true)}
                className="glass-button flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {/* Search */}
          {entries.length > 0 && (
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history…"
                className="glass-input w-full pl-10 pr-10 py-3 text-sm"
                aria-label="Search history"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Loading state */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass p-4 flex items-center gap-4">
                  <div className="skeleton w-10 h-10 rounded-xl flex-shrink-0" />
                  <div className="flex-1">
                    <div className="skeleton h-4 rounded-full mb-2" style={{ width: '60%' }} />
                    <div className="skeleton h-3 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="w-20 h-20 rounded-full glass flex items-center justify-center">
                  <Inbox className="w-10 h-10 text-muted" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-primary mb-2">No History Yet</h3>
                  <p className="text-secondary text-sm max-w-md">
                    Your saved translations will appear here. Use the Translator or Speak to Text page and press "Speak" to save entries.
                  </p>
                </div>
              </motion.div>
            </GlassCard>
          ) : (
            /* List */
            <div className="space-y-3">
              <AnimatePresence>
                {filtered.map((entry) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                  >
                    <GlassCard className="p-4 flex items-center gap-4 card-hover">
                      <div className="flex-shrink-0">
                        {entry.type === 'sign' ? (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                            <History className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                            <Volume2 className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-primary text-sm font-medium truncate">{entry.text}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="w-3 h-3 text-muted" />
                          <span className="text-xs text-muted">{formatTime(entry.timestamp)}</span>
                          <span className="text-xs text-muted">·</span>
                          <span className="text-xs text-muted capitalize">{entry.type === 'sign' ? 'Sign' : 'Speech'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          onClick={() => handleSpeak(entry.text)}
                          className="glass-button w-9 h-9 flex items-center justify-center text-primary"
                          aria-label="Speak again"
                          disabled={!speechSupported}
                        >
                          {speaking ? (
                            <span className="sound-wave"><span /><span /><span /></span>
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleCopy(entry.text)}
                          className="glass-button w-9 h-9 flex items-center justify-center text-primary"
                          aria-label="Copy"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="glass-button w-9 h-9 flex items-center justify-center text-pink-400"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Clear confirmation modal */}
        <AnimatePresence>
          {confirmClear && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmClear(false)}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-strong p-6 max-w-sm w-full"
              >
                <h3 className="font-heading text-lg font-bold text-primary mb-2">Clear all history?</h3>
                <p className="text-secondary text-sm mb-6">This will permanently delete all saved translations. This cannot be undone.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="glass-button flex-1 py-3 text-sm font-medium text-primary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white"
                  >
                    Delete All
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
