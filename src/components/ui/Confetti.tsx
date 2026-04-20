"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  size: number;
}

// Design token hex kopyaları — canvas-free particle rendering için inline'da
// gereksinim. Bu değerler globals.css @theme ile senkron kalmalı.
const CONFETTI_COLORS = [
  "#2563EB",
  "#EF4444",
  "#F59E0B",
  "#10B981",
  "#8B5CF6",
  "#14B8A6",
];

export function Confetti({ trigger }: { trigger: boolean }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastTriggerRef = useRef(false);

  useEffect(() => {
    if (!trigger || lastTriggerRef.current) return;
    lastTriggerRef.current = true;

    const newParticles: Particle[] = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: 50,
      y: 40,
      vx: (Math.random() - 0.5) * 10,
      vy: -(Math.random() * 15 + 5),
      color:
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ??
        CONFETTI_COLORS[0]!,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      size: Math.random() * 8 + 6,
    }));
    setParticles(newParticles);

    const interval = window.setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.1,
            y: p.y + p.vy * 0.1,
            vy: p.vy + 0.3,
            rotation: p.rotation + p.rotationSpeed,
          }))
          .filter((p) => p.y < 120),
      );
    }, 30);

    const timeout = window.setTimeout(() => {
      setParticles([]);
      window.clearInterval(interval);
      lastTriggerRef.current = false;
    }, 3000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [trigger]);

  useEffect(() => {
    if (!trigger) {
      lastTriggerRef.current = false;
    }
  }, [trigger]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            borderRadius: "2px",
            transition: "none",
          }}
        />
      ))}
    </div>
  );
}
