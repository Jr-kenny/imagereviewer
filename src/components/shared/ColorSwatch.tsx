import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface ColorSwatchProps {
  color: string;
  size?: 'sm' | 'md' | 'lg';
  showHex?: boolean;
  copyable?: boolean;
  className?: string;
}

export function ColorSwatch({ color, size = 'md', showHex = false, copyable = false, className }: ColorSwatchProps) {
  const [copied, setCopied] = useState(false);

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const handleCopy = async () => {
    if (!copyable) return;

    try {
      await navigator.clipboard.writeText(color);
      setCopied(true);
      toast.success(`Copied ${color}`);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy color');
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <button
        onClick={handleCopy}
        disabled={!copyable}
        className={cn(
          'rounded-lg border-2 border-white/20 shadow-lg transition-all duration-200 relative overflow-hidden',
          sizes[size],
          copyable && 'cursor-pointer hover:scale-110 hover:border-white/40'
        )}
        style={{ backgroundColor: color }}
        aria-label={`Color ${color}`}
      >
        {copied && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </button>
      {showHex && (
        <span className="text-xs text-gray-400 font-mono">{color}</span>
      )}
    </div>
  );
}
