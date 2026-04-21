interface Props {
  variant: "no-data" | "no-results" | "error" | "offline";
  size?: number;
  className?: string;
}

export function EmptyStateIllustration({
  variant,
  size = 160,
  className,
}: Props) {
  const illustrations = {
    "no-data": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={className}
        aria-hidden
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="var(--color-primary-tint)"
          opacity="0.3"
        />
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="var(--color-primary-soft)"
          opacity="0.5"
        />
        <rect
          x="70"
          y="70"
          width="60"
          height="80"
          rx="8"
          fill="white"
          stroke="var(--color-line)"
          strokeWidth="2"
        />
        <line
          x1="80"
          y1="90"
          x2="120"
          y2="90"
          stroke="var(--color-line)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="80"
          y1="105"
          x2="115"
          y2="105"
          stroke="var(--color-line)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="80"
          y1="120"
          x2="110"
          y2="120"
          stroke="var(--color-line)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
    "no-results": (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={className}
        aria-hidden
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="var(--color-primary-tint)"
          opacity="0.3"
        />
        <circle
          cx="85"
          cy="85"
          r="30"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="4"
        />
        <line
          x1="105"
          y1="105"
          x2="125"
          y2="125"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <text
          x="100"
          y="150"
          textAnchor="middle"
          fontSize="12"
          fill="var(--color-ink-muted)"
          fontWeight="700"
        >
          No matches
        </text>
      </svg>
    ),
    error: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={className}
        aria-hidden
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="var(--color-action-soft)"
          opacity="0.5"
        />
        <circle cx="100" cy="100" r="40" fill="var(--color-action)" />
        <line
          x1="85"
          y1="85"
          x2="115"
          y2="115"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="115"
          y1="85"
          x2="85"
          y2="115"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    ),
    offline: (
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className={className}
        aria-hidden
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="var(--color-ink-muted)"
          opacity="0.2"
        />
        <path
          d="M60 100 Q100 60 140 100"
          fill="none"
          stroke="var(--color-ink-muted)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M75 115 Q100 90 125 115"
          fill="none"
          stroke="var(--color-ink-muted)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="100" cy="130" r="5" fill="var(--color-ink-muted)" />
        <line
          x1="50"
          y1="50"
          x2="150"
          y2="150"
          stroke="var(--color-action)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    ),
  };

  return illustrations[variant];
}
