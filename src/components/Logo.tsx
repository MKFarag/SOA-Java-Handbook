import React from 'react';

interface LogoProps {
  variant?: 'desktop' | 'compact' | 'icon-only';
  className?: string;
  onClick?: () => void;
  title?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'desktop',
  className = '',
  onClick,
  title = 'SOA Java Handbook'
}) => {
  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
      title={title}
    >
      {/* Modern Developer Vector Icon Mark */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 sm:w-9 sm:h-9 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
        >
          <defs>
            {/* Steam Gradient: Cyan to Indigo */}
            <linearGradient id="soaSteamGrad" x1="0%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Cup Body Gradient: Deep Slate-Navy Base */}
            <linearGradient id="soaCupBase" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* Cup Accent Rim Gradient: Cyan to Blue */}
            <linearGradient id="soaRimGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>

            {/* Base Saucer Sweep Gradient */}
            <linearGradient id="soaSaucerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="70%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#c084fc" />
            </linearGradient>

            {/* Code Symbol Gradient */}
            <linearGradient id="soaCodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>

          {/* Steaming Vapor Curves (Elegant Modern Stylized Steam) */}
          <path
            d="M17 19C16 14 20 11 18 7C17.5 6 16.5 5 15.5 4"
            stroke="url(#soaSteamGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <path
            d="M24 18C22 12.5 28 9.5 25 4.5C24.2 3.2 23 2.5 22 2"
            stroke="url(#soaSteamGrad)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M30 19C31 15 27 12 29 8"
            stroke="url(#soaSteamGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Cup Rim Halo */}
          <ellipse
            cx="24"
            cy="23"
            rx="14"
            ry="3.2"
            stroke="url(#soaRimGrad)"
            strokeWidth="2.2"
            fill="none"
          />

          {/* Cup Main Body Envelope */}
          <path
            d="M12 24.5C12.5 32 17.5 37 24 37C30.5 37 35.5 32 36 24.5"
            stroke="url(#soaRimGrad)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cup Handle (Right side) */}
          <path
            d="M34.5 25.5C39 26 41 29.5 38.5 33C36.8 35.4 34 35 33 34.5"
            stroke="url(#soaRimGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />

          {/* Embedded Developer Code Symbol </ > inside Cup */}
          <g transform="translate(14.5, 27) scale(0.8)">
            {/* Left angle < */}
            <path
              d="M6 3L2 6.5L6 10"
              stroke="url(#soaCodeGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Slash / */}
            <path
              d="M13 2.5L10 10.5"
              stroke="url(#soaCodeGrad)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Right angle > */}
            <path
              d="M17 3L21 6.5L17 10"
              stroke="url(#soaCodeGrad)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Aerodynamic Saucer Base Curve */}
          <path
            d="M9 41C15 45 33 45 39 41"
            stroke="url(#soaSaucerGrad)"
            strokeWidth="2.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {variant !== 'icon-only' && (
        <div className="flex items-center gap-2">
          {/* Main Title: SOA Java */}
          <div className="flex items-baseline gap-1.5">
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
              SOA
            </span>
            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent font-sans">
              Java
            </span>
          </div>

          {/* Vertical Divider & Subtitle (Desktop / Full) */}
          {variant === 'desktop' && (
            <div className="hidden sm:flex items-center border-l border-zinc-300 dark:border-zinc-700/80 pl-2">
              <span className="text-xs sm:text-sm font-medium tracking-wide text-zinc-500 dark:text-zinc-400 font-sans">
                Handbook
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
