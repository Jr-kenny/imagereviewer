import React from 'react';
import { cn, getRarityColor, getRarityIcon } from '../../lib/utils';

interface BadgeProps {
  variant?: 'default' | 'rarity' | 'tag' | 'filter';
  rarity?: 'unique' | 'rare' | 'common';
  className?: string;
  children: React.ReactNode;
  onRemove?: () => void;
}

export function Badge({ variant = 'default', rarity, className, children, onRemove }: BadgeProps) {
  const baseStyles = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200';

  const variants = {
    default: 'bg-white/10 text-gray-300 hover:bg-white/20',
    rarity: rarity ? `bg-gradient-to-r ${getRarityColor(rarity)} text-white shadow-lg` : 'bg-gray-500 text-white',
    tag: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30',
    filter: 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30',
  };

  return (
    <span className={cn(baseStyles, variants[variant], className)}>
      {variant === 'rarity' && rarity && <span>{getRarityIcon(rarity)}</span>}
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-white transition-colors"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </span>
  );
}
