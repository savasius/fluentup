import { cn } from "@/lib/cn";
import {
  ScenePuffs,
  SceneSparkles,
  type SceneProps,
} from "../scene-primitives";

/** Duel / battle / competitive modes — rekabet vurgusu. */
export function SwordsScene({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("w-full h-full", className)}
      aria-hidden
    >
      <SceneSparkles color="#FBBF24" />

      {/* Sword 1 — blue handle, rotated -30deg */}
      <g transform="rotate(-30 60 60)">
        <rect
          x="57"
          y="25"
          width="6"
          height="55"
          fill="#E5E7EB"
          stroke="#1E293B"
          strokeWidth="2"
        />
        <path
          d="M57 26 L60 20 L63 26 Z"
          fill="#F1F5F9"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect
          x="50"
          y="78"
          width="20"
          height="5"
          fill="#FBBF24"
          stroke="#1E293B"
          strokeWidth="2"
          rx="1"
        />
        <rect
          x="55"
          y="83"
          width="10"
          height="14"
          fill="#2563EB"
          stroke="#1E293B"
          strokeWidth="2"
          rx="1.5"
        />
        <circle
          cx="60"
          cy="100"
          r="3"
          fill="#FBBF24"
          stroke="#1E293B"
          strokeWidth="2"
        />
      </g>

      {/* Sword 2 — red handle, rotated +30deg */}
      <g transform="rotate(30 60 60)">
        <rect
          x="57"
          y="25"
          width="6"
          height="55"
          fill="#E5E7EB"
          stroke="#1E293B"
          strokeWidth="2"
        />
        <path
          d="M57 26 L60 20 L63 26 Z"
          fill="#F1F5F9"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <rect
          x="50"
          y="78"
          width="20"
          height="5"
          fill="#FBBF24"
          stroke="#1E293B"
          strokeWidth="2"
          rx="1"
        />
        <rect
          x="55"
          y="83"
          width="10"
          height="14"
          fill="#EF4444"
          stroke="#1E293B"
          strokeWidth="2"
          rx="1.5"
        />
        <circle
          cx="60"
          cy="100"
          r="3"
          fill="#FBBF24"
          stroke="#1E293B"
          strokeWidth="2"
        />
      </g>

      <ScenePuffs />
    </svg>
  );
}
