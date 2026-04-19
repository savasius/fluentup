interface SceneProps {
  className?: string;
}

/**
 * Küçük beyaz bulut grupları — her sahnenin alt kısmında kullanılır.
 * Sahnelere "sky" hissi verir, figürü zemine bağlar.
 */
export function ScenePuffs() {
  return (
    <g>
      <circle cx="18" cy="95" r="10" fill="white" opacity="0.85" />
      <circle cx="30" cy="98" r="7" fill="white" opacity="0.85" />
      <circle cx="90" cy="92" r="8" fill="white" opacity="0.85" />
      <circle cx="102" cy="96" r="6" fill="white" opacity="0.85" />
    </g>
  );
}

/**
 * Dört köşeli yıldız + küçük noktalar — sahneye enerji ve hareket hissi katar.
 * color prop'u teması değiştirir (sarı = warm/reward, mavi = cool/tech).
 */
interface SceneSparklesProps {
  color?: string;
}

export function SceneSparkles({ color = "#FBBF24" }: SceneSparklesProps) {
  return (
    <g>
      <path
        d="M20 20 l2 4 l4 2 l-4 2 l-2 4 l-2 -4 l-4 -2 l4 -2 z"
        fill={color}
      />
      <path
        d="M95 15 l1.5 3 l3 1.5 l-3 1.5 l-1.5 3 l-1.5 -3 l-3 -1.5 l3 -1.5 z"
        fill={color}
      />
      <circle cx="100" cy="35" r="2" fill={color} />
      <circle cx="15" cy="45" r="1.5" fill="white" />
    </g>
  );
}

export type { SceneProps };
