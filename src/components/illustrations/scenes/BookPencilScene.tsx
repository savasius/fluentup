import { cn } from "@/lib/cn";
import {
  ScenePuffs,
  SceneSparkles,
  type SceneProps,
} from "../scene-primitives";

/** Sentence building / writing modes — yazma vurgusu. */
export function BookPencilScene({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("w-full h-full", className)}
      aria-hidden
    >
      <SceneSparkles color="#FBBF24" />

      {/* Book stack: red / yellow / blue */}
      <rect
        x="30"
        y="72"
        width="60"
        height="14"
        rx="2"
        fill="#EF4444"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <rect
        x="33"
        y="58"
        width="54"
        height="14"
        rx="2"
        fill="#FBBF24"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <rect
        x="28"
        y="44"
        width="64"
        height="14"
        rx="2"
        fill="#2563EB"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* Spine tick marks (depth hint) */}
      <line x1="40" y1="65" x2="44" y2="65" stroke="#B45309" strokeWidth="2" />
      <line x1="40" y1="79" x2="44" y2="79" stroke="#991B1B" strokeWidth="2" />

      {/* Pencil, tilted -20deg */}
      <g transform="rotate(-20 60 30)">
        <rect
          x="42"
          y="26"
          width="36"
          height="8"
          fill="#FBBF24"
          stroke="#1E293B"
          strokeWidth="2"
          rx="1"
        />
        <rect
          x="76"
          y="26"
          width="6"
          height="8"
          fill="#EF4444"
          stroke="#1E293B"
          strokeWidth="2"
          rx="1"
        />
        <path
          d="M42 26 L36 30 L42 34 Z"
          fill="#F1F5F9"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M38 29 L36 30 L38 31 Z" fill="#1E293B" />
      </g>

      <ScenePuffs />
    </svg>
  );
}
