"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "teal" | "purple" | "blue" | "gradient";
  enableTilt?: boolean;
  enableGlow?: boolean;
}

export function GlowingCard({
  children,
  className,
  glowColor = "teal",
  enableTilt = true,
  enableGlow = true,
}: GlowingCardProps) {
  const [transform, setTransform] = useState("");
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const glowColors = {
    teal: "from-primary/20 via-primary/10 to-transparent",
    purple: "from-accent/20 via-accent/10 to-transparent",
    blue: "from-chart-3/20 via-chart-3/10 to-transparent",
    gradient: "from-primary/20 via-accent/15 to-chart-3/10",
  };

  const borderColors = {
    teal: "border-primary/30",
    purple: "border-accent/30",
    blue: "border-chart-3/30",
    gradient: "border-primary/20",
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !enableTilt) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleMouseLeave = () => {
    setTransform("");
    setGlowPosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative rounded-2xl transition-all duration-200 ease-out",
        "bg-card/80 backdrop-blur-xl border",
        borderColors[glowColor],
        className
      )}
      style={{
        transform: transform || undefined,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Animated glow effect */}
      {enableGlow && (
        <div
          className={cn(
            "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            "bg-gradient-radial",
            glowColors[glowColor]
          )}
          style={{
            background: `radial-gradient(circle at ${glowPosition.x}% ${glowPosition.y}%, var(--glow-color, hsla(217, 91%, 60%, 0.15)) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Gradient border animation */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div
          className="absolute inset-[-1px] rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, hsla(217, 91%, 60%, 0.3), hsla(217, 91%, 60%, 0.3), hsla(210, 60%, 55%, 0.3))`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskComposite: "xor",
            padding: "1px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
