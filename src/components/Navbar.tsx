import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Hand, Home, Camera, Mic, BookOpen, GraduationCap, History, Info, Moon, Sun, Menu, X } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/translator', label: 'Translator', icon: Camera },
  { to: '/speak', label: 'Speak to Text', icon: Mic },
  { to: '/dictionary', label: 'Dictionary', icon: BookOpen },
  { to: '/learn', label: 'Learn', icon: GraduationCap },
  { to: '/history', label: 'History', icon: History },
  { to: '/about', label: 'About', icon: Info },
];

export function Navbar() {
  const { theme, toggleTheme } = useSettings();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <div className="glass-strong mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 no-select" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <Hand className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-lg text-primary">ISL Vision</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to;
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-white/15 text-primary'
                      : 'text-secondary hover:text-primary hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="glass-button w-10 h-10 flex items-center justify-center"
              aria-label="Toggle dark or light mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-violet-600" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="glass-button w-10 h-10 flex items-center justify-center lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-strong mx-auto max-w-7xl mt-2 p-4 lg:hidden"
            >
              <div className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map((link) => {
                  const active = location.pathname === link.to;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-white/15 text-primary'
                          : 'text-secondary hover:text-primary hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-3 lg:hidden">
        <div className="glass-strong mx-auto max-w-md flex items-center justify-around px-2 py-2">
          {NAV_LINKS.slice(0, 5).map((link) => {
            const active = location.pathname === link.to;
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all ${
                  active ? 'text-primary' : 'text-muted'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-violet-400' : ''}`} />
                <span className="text-[10px] font-medium">{link.label.split(' ')[0]}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
