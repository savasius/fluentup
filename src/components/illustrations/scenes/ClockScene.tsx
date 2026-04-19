import { cn } from "@/lib/cn";
import {
  ScenePuffs,
  SceneSparkles,
  type SceneProps,
} from "../scene-primitives";

/** Spaced repetition / review modes — zaman vurgusu. */
export function ClockScene({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("w-full h-full", className)}
      aria-hidden
    >
      <SceneSparkles color="#FBBF24" />

      {/* Bells */}
      <path
        d="M40 30 L35 22 L45 22 Z"
        fill="#FBBF24"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M80 30 L75 22 L85 22 Z"
        fill="#FBBF24"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Top strap */}
      <path
        d="M45 30 Q60 22 75 30"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Clock body */}
      <circle
        cx="60"
        cy="65"
        r="28"
        fill="#FBBF24"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <circle
        cx="60"
        cy="65"
        r="22"
        fill="#FEF3C7"
        stroke="#1E293B"
        strokeWidth="2"
      />

      {/* Hands */}
      <line
        x1="60"
        y1="65"
        x2="60"
        y2="50"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="65"
        x2="72"
        y2="68"
        stroke="#EF4444"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="60" cy="65" r="2.5" fill="#1E293B" />

      {/* Tick marks (12/3/6/9) */}
      <circle cx="60" cy="48" r="1" fill="#1E293B" />
      <circle cx="77" cy="65" r="1" fill="#1E293B" />
      <circle cx="60" cy="82" r="1" fill="#1E293B" />
      <circle cx="43" cy="65" r="1" fill="#1E293B" />

      {/* Feet */}
      <path
        d="M42 90 L38 98 L46 95 Z"
        fill="#FBBF24"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M78 90 L82 98 L74 95 Z"
        fill="#FBBF24"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <ScenePuffs />
    </svg>
  );
}
