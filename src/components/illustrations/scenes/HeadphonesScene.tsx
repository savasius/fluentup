import { cn } from "@/lib/cn";
import {
  ScenePuffs,
  SceneSparkles,
  type SceneProps,
} from "../scene-primitives";

/** Listening / audio-based modes — ses vurgusu. Sparkles mavi (tech/cool). */
export function HeadphonesScene({ className }: SceneProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("w-full h-full", className)}
      aria-hidden
    >
      <SceneSparkles color="#60A5FA" />

      {/* Headband */}
      <path
        d="M35 65 Q35 35 60 35 Q85 35 85 65"
        fill="none"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M37 65 Q37 37 60 37 Q83 37 83 65"
        fill="none"
        stroke="#2563EB"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Left ear cup */}
      <rect
        x="26"
        y="58"
        width="18"
        height="28"
        rx="6"
        fill="#EF4444"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <rect x="30" y="63" width="10" height="18" rx="3" fill="#FCA5A5" />

      {/* Right ear cup */}
      <rect
        x="76"
        y="58"
        width="18"
        height="28"
        rx="6"
        fill="#EF4444"
        stroke="#1E293B"
        strokeWidth="2.5"
      />
      <rect x="80" y="63" width="10" height="18" rx="3" fill="#FCA5A5" />

      {/* Sound waves */}
      <path
        d="M100 70 Q106 65 106 75 Q106 85 100 80"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M14 70 Q8 65 8 75 Q8 85 14 80"
        fill="none"
        stroke="#2563EB"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <ScenePuffs />
    </svg>
  );
}
