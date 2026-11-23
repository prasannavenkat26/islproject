import { type ReactNode, type HTMLAttributes } from 'react';

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  strong?: boolean;
  glow?: boolean;
  className?: string;
}

export function GlassCard({ children, strong = false, glow = false, className = '', ...rest }: GlassCardProps) {
  const baseClass = strong ? 'glass-strong' : 'glass';
  const glowClass = glow ? 'glow-border' : '';
  return (
    <div className={`${baseClass} ${glowClass} ${className}`} {...rest}>
      {children}
    </div>
  );
}
