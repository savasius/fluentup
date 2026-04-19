import { cn } from "@/lib/cn";
import {
  ScenePuffs,
  SceneSparkles,
  type SceneProps,
} from "../scene-primitives";

/** Sprint / speed-based practice modes — hız vurgusu. */
export function RocketScene({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("w-full h-full", className)}
      aria-hidden
    >
      <SceneSparkles color="#FBBF24" />

      {/* Flame */}
      <path
        d="M55 95 Q60 108 65 95 Q63 102 60 110 Q57 102 55 95 Z"
        fill="#F59E0B"
      />
      <path
        d="M57 92 Q60 100 63 92 Q61 97 60 102 Q59 97 57 92 Z"
        fill="#FEF08A"
      />

      {/* Body */}
      <path
        d="M60 25 Q72 40 72 70 L60 85 L48 70 Q48 40 60 25 Z"
        fill="white"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* Nose cone */}
      <path
        d="M60 25 Q66 32 72 42 L48 42 Q54 32 60 25 Z"
        fill="#EF4444"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* Window */}
      <circle
        cx="60"
        cy="52"
        r="6"
        fill="#60A5FA"
        stroke="#1E293B"
        strokeWidth="2"
      />
      <circle cx="58" cy="50" r="1.8" fill="white" opacity="0.9" />

      {/* Fins */}
      <path
        d="M48 70 L38 82 L48 78 Z"
        fill="#EF4444"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M72 70 L82 82 L72 78 Z"
        fill="#EF4444"
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      <ScenePuffs />
    </svg>
  );
}
