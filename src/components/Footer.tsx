import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-auto pt-12 pb-24 lg:pb-8 px-4">
      <div className="glass mx-auto max-w-7xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-secondary">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>All processing happens in your browser. No video is uploaded.</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted">
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
          <Link to="/dictionary" className="hover:text-primary transition-colors">Dictionary</Link>
          <span>ISL Vision &copy; 2026</span>
        </div>
      </div>
    </footer>
  );
}
