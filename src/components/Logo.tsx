// src/components/Logo.tsx
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconPx = size === 'sm' ? 30 : size === 'lg' ? 44 : 36;

  return (
    <div className={`inline-flex items-center gap-3 group select-none ${className}`}>
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={iconPx}
          height={iconPx}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-500 ease-out group-hover:rotate-[8deg] group-hover:scale-105"
        >
          {/* Outer Precision Squircle Frame */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="24"
            fill="var(--ink-primary)"
          />
          {/* Inner Architectural Orbit Ring */}
          <circle
            cx="50"
            cy="50"
            r="31"
            stroke="var(--bg-canvas)"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
          {/* Sculptural Geometric 'A' Blade */}
          <path
            d="M50 20 L74 76 H63.5 L50 43 L36.5 76 H26 L50 20 Z"
            fill="var(--bg-canvas)"
          />
          {/* Dynamic Cross-Cut Cantilever Bar */}
          <path
            d="M28 58 L72 46"
            stroke="#FF331F"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Solar Vermilion Focal Core */}
          <circle cx="50" cy="20" r="4.5" fill="#FF331F" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="font-display font-extrabold tracking-[-0.04em] text-lg sm:text-xl uppercase">
              ATELIER
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-signal)]" />
          </div>
          <span className="font-mono-tech text-[9px] uppercase tracking-[0.26em] text-[var(--ink-muted)] mt-0.5">
            STUDIO LAB
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
