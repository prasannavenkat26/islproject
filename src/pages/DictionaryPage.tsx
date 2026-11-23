import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, GraduationCap, BookOpen } from 'lucide-react';
import { GlassCard } from '@/components/GlassCard';
import { PageTransition } from '@/components/PageTransition';
import { SIGNS, CATEGORIES, type Sign } from '@/data/signs';

export function DictionaryPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedSign, setSelectedSign] = useState<Sign | null>(null);

  const filteredSigns = useMemo(() => {
    return SIGNS.filter((sign) => {
      const matchesCategory = activeCategory === 'all' || sign.category === activeCategory;
      const matchesSearch = !search ||
        sign.name.toLowerCase().includes(search.toLowerCase()) ||
        sign.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <PageTransition>
      <div className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-primary mb-2">ISL Dictionary</h1>
            <p className="text-secondary text-sm">Browse {SIGNS.length} supported signs — alphabets, numbers, and common words</p>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for a sign…"
                className="glass-input w-full pl-10 pr-10 py-3 text-sm"
                aria-label="Search signs"
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
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.id ? 'accent-button' : 'glass-button text-secondary'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          {filteredSigns.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-primary mb-2">No signs found</h3>
              <p className="text-secondary text-sm">Try a different search term or category.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredSigns.map((sign, idx) => (
                <motion.button
                  key={sign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.03, 0.5) }}
                  onClick={() => setSelectedSign(sign)}
                  className="text-left"
                >
                  <GlassCard className="p-5 h-full card-hover flex flex-col items-center text-center">
                    <span className="text-3xl sm:text-4xl mb-3">{sign.emoji}</span>
                    <h3 className="font-heading font-semibold text-primary text-base mb-1">{sign.name}</h3>
                    <p className="text-xs text-secondary line-clamp-2">{sign.description}</p>
                  </GlassCard>
                </motion.button>
              ))}
            </div>
          )}
        </div>

        {/* Detail modal */}
        <AnimatePresence>
          {selectedSign && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSign(null)}
              className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-strong p-8 max-w-md w-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl">{selectedSign.emoji}</span>
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-primary">{selectedSign.name}</h2>
                      <span className="text-xs text-secondary capitalize">{selectedSign.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSign(null)}
                    className="glass-button w-9 h-9 flex items-center justify-center"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-primary" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">How to perform</h3>
                    <p className="text-primary text-sm leading-relaxed">{selectedSign.description}</p>
                  </div>
                  {selectedSign.tips && (
                    <div>
                      <h3 className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">Tips</h3>
                      <p className="text-secondary text-sm leading-relaxed">{selectedSign.tips}</p>
                    </div>
                  )}
                </div>

                <Link
                  to="/learn"
                  onClick={() => setSelectedSign(null)}
                  className="accent-button flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold w-full mt-6"
                >
                  <GraduationCap className="w-4 h-4" />
                  Practice this sign
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
