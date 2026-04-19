import { cn } from "@/lib/cn";

interface QuestSceneProps {
  className?: string;
}

/**
 * "The Tower of Tongues" — Seasonal Quest banner'ının arka plan sahnesi.
 *
 * Format: 400×200 (wide). `preserveAspectRatio` ile esnek — hem mobilde dar
 * banner'da, hem desktop'ta geniş banner'da düzgün oturur.
 *
 * İçerik: 2 katman dağ silueti → yeşil tepe → trophy + treasure chest + ağaç.
 * "Sadece ders değil, bir macera" hissi vermek için.
 *
 * NOT: Parent container'ın arka planı sky (genelde primary-tint) olmalı —
 * SVG'nin içinde sky yok, transparent.
 */
export function QuestScene({ className }: QuestSceneProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      className={cn(className)}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      {/* Distant mountains (arkada, soluk) */}
      <path
        d="M0 140 L60 80 L120 130 L180 70 L240 120 L300 90 L360 125 L400 100 L400 200 L0 200 Z"
        fill="#93C5FD"
        opacity="0.6"
      />

      {/* Closer mountains (önde, koyu) */}
      <path
        d="M0 160 L50 110 L110 155 L170 100 L230 150 L290 115 L340 155 L400 135 L400 200 L0 200 Z"
        fill="#60A5FA"
        opacity="0.75"
      />

      {/* Foreground hill (yeşil) */}
      <path
        d="M0 175 Q80 155 180 170 Q280 185 400 165 L400 200 L0 200 Z"
        fill="#10B981"
        stroke="#047857"
        strokeWidth="2"
      />

      {/* Grass blades */}
      <path d="M30 172 L32 165 L34 172 Z" fill="#059669" />
      <path d="M130 170 L132 162 L134 170 Z" fill="#059669" />
      <path d="M320 168 L322 160 L324 168 Z" fill="#059669" />

      {/* Clouds */}
      <ellipse cx="80" cy="45" rx="22" ry="8" fill="white" opacity="0.9" />
      <ellipse cx="65" cy="45" rx="10" ry="6" fill="white" opacity="0.9" />
      <ellipse cx="320" cy="60" rx="20" ry="7" fill="white" opacity="0.9" />
      <ellipse cx="335" cy="60" rx="10" ry="5" fill="white" opacity="0.9" />

      {/* Sparkles */}
      <path
        d="M140 40 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 z"
        fill="#FBBF24"
      />
      <path
        d="M260 30 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 z"
        fill="#FBBF24"
      />

      {/* Trophy on podium */}
      <g transform="translate(290 115)">
        {/* Base */}
        <rect
          x="-18"
          y="40"
          width="36"
          height="10"
          rx="1"
          fill="#B45309"
          stroke="#78350F"
          strokeWidth="2"
        />
        <rect
          x="-10"
          y="30"
          width="20"
          height="10"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="2"
        />
        {/* Cup */}
        <path
          d="M-14 0 L14 0 L12 25 Q12 30 6 30 L-6 30 Q-12 30 -12 25 Z"
          fill="#FBBF24"
          stroke="#78350F"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Handles */}
        <path
          d="M-14 5 Q-22 8 -22 16 Q-22 22 -14 22"
          fill="none"
          stroke="#78350F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M14 5 Q22 8 22 16 Q22 22 14 22"
          fill="none"
          stroke="#78350F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* Star */}
        <path
          d="M0 7 l2 5 l5 0 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 l5 0 z"
          fill="#EF4444"
        />
        {/* Highlight */}
        <path
          d="M-4 4 Q-6 10 -4 16"
          stroke="white"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      {/* Treasure chest */}
      <g transform="translate(340 145)">
        <rect
          x="0"
          y="5"
          width="40"
          height="22"
          rx="2"
          fill="#B45309"
          stroke="#78350F"
          strokeWidth="2"
        />
        <path
          d="M0 5 Q0 -5 20 -5 Q40 -5 40 5"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect
          x="17"
          y="10"
          width="6"
          height="8"
          fill="#FBBF24"
          stroke="#78350F"
          strokeWidth="1.5"
        />
        <circle cx="20" cy="14" r="1" fill="#78350F" />
        {/* Spilled coins */}
        <circle
          cx="-4"
          cy="24"
          r="3"
          fill="#FBBF24"
          stroke="#78350F"
          strokeWidth="1.5"
        />
        <circle
          cx="44"
          cy="22"
          r="2.5"
          fill="#FBBF24"
          stroke="#78350F"
          strokeWidth="1.5"
        />
      </g>

      {/* Small tree */}
      <g transform="translate(60 155)">
        <rect x="-2" y="6" width="5" height="14" fill="#78350F" />
        <circle
          cx="0"
          cy="6"
          r="10"
          fill="#059669"
          stroke="#047857"
          strokeWidth="2"
        />
        <circle
          cx="-5"
          cy="2"
          r="6"
          fill="#10B981"
          stroke="#047857"
          strokeWidth="2"
        />
        <circle
          cx="6"
          cy="4"
          r="5"
          fill="#10B981"
          stroke="#047857"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
