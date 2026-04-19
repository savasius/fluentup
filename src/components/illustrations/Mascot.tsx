import { cn } from "@/lib/cn";

interface MascotProps {
  /** Pixel boyutu. 48 (avatar), 100 (küçük hero), 180-200 (büyük hero). */
  size?: number;
  className?: string;
}

/**
 * Figgy — FluentUp'ın mascot karakteri.
 *
 * Tasarım mantığı: robot + graduation cap = "öğrenen ama asla yıpranmayan dost".
 * Yüz anlamlıca nötr (arkadaşça bir gülümseme) — farklı sayfalardaki bağlamlarda
 * (hero / avatar / empty state) hep uygun düşsün.
 *
 * Kullanım:
 *   <Mascot size={180} />           // Dashboard hero
 *   <Mascot size={100} />           // Practice header
 *   <Mascot size={48} />            // AI Tutor avatar
 */
export function Mascot({ size = 180, className }: MascotProps) {
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

      {/* Ground shadow (yumuşak oval) */}
      <ellipse cx="100" cy="175" rx="55" ry="18" fill="#DBEAFE" opacity="0.5" />

      {/* Body */}
      <path
        d="M70 165 Q70 130 100 130 Q130 130 130 165 L130 175 Q130 180 125 180 L75 180 Q70 180 70 175 Z"
        fill="#2563EB"
        stroke="#1E293B"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      {/* Collar line */}
      <path
        d="M78 130 Q100 140 122 130"
        fill="none"
        stroke="white"
        strokeWidth="3"
      />
      {/* Chest button */}
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

      {/* Face plate (glasses-like inner frame) */}
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

      {/* Eyes */}
      <circle cx="85" cy="97" r="8" fill="#1E293B" />
      <circle cx="115" cy="97" r="8" fill="#1E293B" />
      <circle cx="87" cy="94" r="2.5" fill="white" />
      <circle cx="117" cy="94" r="2.5" fill="white" />

      {/* Cheeks (yanak kızarıklığı — sıcak hissiyat) */}
      <circle cx="72" cy="108" r="4" fill="#FCA5A5" opacity="0.8" />
      <circle cx="128" cy="108" r="4" fill="#FCA5A5" opacity="0.8" />

      {/* Smile */}
      <path
        d="M92 122 Q100 128 108 122"
        fill="none"
        stroke="#1E293B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

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

      {/* Antenna (ince) */}
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
