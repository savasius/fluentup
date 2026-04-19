import { cn } from "@/lib/cn";
import {
  ScenePuffs,
  SceneSparkles,
  type SceneProps,
} from "../scene-primitives";

/** Gap fill / matching modes — eşleştirme vurgusu. */
export function PuzzleScene({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("w-full h-full", className)}
      aria-hidden
    >
      <SceneSparkles color="#FBBF24" />

      {/* Yellow piece, tilted -10deg */}
      <g transform="rotate(-10 45 55)">
        <path
          d="M25 40 L55 40 L55 50 Q62 50 62 55 Q62 60 55 60 L55 75 L40 75 Q40 68 35 68 Q30 68 30 75 L25 75 Z"
          fill="#FBBF24"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Blue piece, tilted +15deg */}
      <g transform="rotate(15 80 65)">
        <path
          d="M60 50 L90 50 Q90 43 95 43 Q100 43 100 50 L100 85 L65 85 L65 75 Q58 75 58 70 Q58 65 65 65 Z"
          fill="#2563EB"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>

      <ScenePuffs />
    </svg>
  );
}
