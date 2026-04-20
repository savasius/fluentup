import { cn } from "@/lib/cn";

export type MascotMood = "happy" | "thinking" | "celebrating" | "sad";

interface MascotProps {
  /** Pixel boyutu. 48 (avatar), 100 (küçük hero), 180-200 (büyük hero). */
  size?: number;
  /** Yüz ifadesi — bağlama göre farklı mood'lar. */
  mood?: MascotMood;
  className?: string;
}

/**
 * Figgy — FluentUp'ın mascot karakteri.
 *
 * Tasarım mantığı: robot + graduation cap = "öğrenen ama asla yıpranmayan dost".
 * Mood'lar farklı bağlamlar için: default happy, thinking (404, empty state),
 * celebrating (level up, achievement), sad (error, streak kırıldı).
 */
export function Mascot({
  size = 180,
  mood = "happy",
  className,
}: MascotProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={cn(className)}
      aria-hidden
    >
      {/* Floating sparkles */}
      <path
        d="M20 50 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z"
        fill="#FBBF24"
      />
      <path
        d="M180 40 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z"
        fill="#FBBF24"
      />
      <path
        d="M170 120 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 z"
        fill="#60A5FA"
      />
      <circle cx="30" cy="110" r="3" fill="#60A5FA" />
      <circle cx="185" cy="80" r="2.5" fill="#FBBF24" />

      {/* Celebrating extras: hands-up & extra sparkles */}
      {mood === "celebrating" && (
        <>
          <path
            d="M45 75 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 z"
            fill="#F59E0B"
          />
          <path
            d="M160 85 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z"
            fill="#F59E0B"
          />
          <line
            x1="55"
            y1="140"
            x2="45"
            y2="120"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <line
            x1="145"
            y1="140"
            x2="155"
            y2="120"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Ground shadow */}
      <ellipse cx="100" cy="175" rx="55" ry="18" fill="#DBEAFE" opacity="0.5" />

      {/* Body */}
      <path
        d="M70 165 Q70 130 100 130 Q130 130 130 165 L130 175 Q130 180 125 180 L75 180 Q70 180 70 175 Z"
        fill="#2563EB"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M78 130 Q100 140 122 130"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      <circle
        cx="100"
        cy="158"
        r="4"
        fill="#FBBF24"
        stroke="#1E293B"
        strokeWidth="2"
      />

      {/* Head */}
      <circle
        cx="100"
        cy="95"
        r="45"
        fill="white"
        stroke="#1E293B"
        strokeWidth="3"
      />

      {/* Face plate */}
      <rect
        x="68"
        y="80"
        width="64"
        height="34"
        rx="15"
        fill="#EFF6FF"
        stroke="#1E293B"
        strokeWidth="2.5"
      />

      {/* Eyes — mood-dependent */}
      {mood === "happy" && (
        <>
          <circle cx="85" cy="97" r="8" fill="#1E293B" />
          <circle cx="115" cy="97" r="8" fill="#1E293B" />
          <circle cx="87" cy="94" r="2.5" fill="white" />
          <circle cx="117" cy="94" r="2.5" fill="white" />
        </>
      )}
      {mood === "thinking" && (
        <>
          <circle cx="85" cy="99" r="7" fill="#1E293B" />
          <circle cx="115" cy="99" r="7" fill="#1E293B" />
          <circle cx="86" cy="96" r="2" fill="white" />
          <circle cx="116" cy="96" r="2" fill="white" />
          {/* Raised right eyebrow */}
          <path
            d="M107 84 L123 82"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      )}
      {mood === "celebrating" && (
        <>
          {/* Closed-happy eyes: curved lines */}
          <path
            d="M78 98 Q85 92 92 98"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M108 98 Q115 92 122 98"
            fill="none"
            stroke="#1E293B"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Eye sparkles above */}
          <path
            d="M82 78 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1 z"
            fill="#F59E0B"
          />
          <path
            d="M118 78 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1 z"
            fill="#F59E0B"
          />
        </>
      )}
      {mood === "sad" && (
        <>
          <circle cx="85" cy="100" r="7" fill="#1E293B" />
          <circle cx="115" cy="100" r="7" fill="#1E293B" />
          <circle cx="84" cy="103" r="2" fill="white" />
          <circle cx="114" cy="103" r="2" fill="white" />
          {/* Drooping eyebrows */}
          <path
            d="M77 88 L92 91"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M108 91 L123 88"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Cheeks */}
      <circle cx="72" cy="108" r="4" fill="#FCA5A5" opacity="0.8" />
      <circle cx="128" cy="108" r="4" fill="#FCA5A5" opacity="0.8" />

      {/* Mouth — mood-dependent */}
      {mood === "happy" && (
        <path
          d="M92 122 Q100 128 108 122"
          fill="none"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {mood === "thinking" && (
        <path
          d="M94 124 L106 124"
          fill="none"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}
      {mood === "celebrating" && (
        <path
          d="M88 118 Q100 132 112 118 Q108 126 100 126 Q92 126 88 118 Z"
          fill="#1E293B"
          stroke="#1E293B"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      )}
      {mood === "sad" && (
        <path
          d="M92 126 Q100 120 108 126"
          fill="none"
          stroke="#1E293B"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      )}

      {/* Thinking: hand to chin */}
      {mood === "thinking" && (
        <>
          <circle
            cx="140"
            cy="135"
            r="8"
            fill="#2563EB"
            stroke="#1E293B"
            strokeWidth="2.5"
          />
          <line
            x1="132"
            y1="128"
            x2="138"
            y2="118"
            stroke="#1E293B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </>
      )}

      {/* Graduation cap */}
      <rect
        x="65"
        y="54"
        width="70"
        height="6"
        fill="#1E40AF"
        stroke="#1E293B"
        strokeWidth="2.5"
        rx="1"
      />
      <path
        d="M100 38 L140 54 L100 60 L60 54 Z"
        fill="#1E40AF"
        stroke="#1E293B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="100" cy="47" r="2" fill="#FBBF24" />

      {/* Tassel */}
      <line
        x1="138"
        y1="52"
        x2="142"
        y2="68"
        stroke="#FBBF24"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle
        cx="142"
        cy="70"
        r="3.5"
        fill="#FBBF24"
        stroke="#1E293B"
        strokeWidth="1.5"
      />

      {/* Antenna */}
      <line
        x1="100"
        y1="54"
        x2="100"
        y2="46"
        stroke="#1E293B"
        strokeWidth="2"
      />
    </svg>
  );
}
