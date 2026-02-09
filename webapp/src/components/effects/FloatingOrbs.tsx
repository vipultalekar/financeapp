"use client";

import { cn } from "@/lib/utils";

interface FloatingOrbsProps {
  className?: string;
  variant?: "default" | "subtle" | "intense";
}

export function FloatingOrbs({ className, variant = "default" }: FloatingOrbsProps) {
  const intensity = {
    default: { opacity: 0.15, blur: "blur-3xl" },
    subtle: { opacity: 0.08, blur: "blur-[100px]" },
    intense: { opacity: 0.25, blur: "blur-2xl" },
  };

  const { opacity, blur } = intensity[variant];

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Primary teal orb - top left */}
      <div
        className={cn(
          "absolute w-[400px] h-[400px] rounded-full",
          blur,
          "animate-float-slow"
        )}
        style={{
          background: `radial-gradient(circle, hsla(217, 91%, 60%, ${opacity}) 0%, transparent 70%)`,
          top: "-10%",
          left: "-10%",
        }}
      />

      {/* Accent purple orb - bottom right */}
      <div
        className={cn(
          "absolute w-[500px] h-[500px] rounded-full",
          blur,
          "animate-float-medium"
        )}
        style={{
          background: `radial-gradient(circle, hsla(217, 91%, 60%, ${opacity}) 0%, transparent 70%)`,
          bottom: "-15%",
          right: "-15%",
          animationDelay: "2s",
        }}
      />

      {/* Blue orb - center right */}
      <div
        className={cn(
          "absolute w-[300px] h-[300px] rounded-full",
          blur,
          "animate-float-fast"
        )}
        style={{
          background: `radial-gradient(circle, hsla(210, 60%, 55%, ${opacity * 0.7}) 0%, transparent 70%)`,
          top: "30%",
          right: "-5%",
          animationDelay: "1s",
        }}
      />

      {/* Small accent orb - top right */}
      <div
        className={cn(
          "absolute w-[200px] h-[200px] rounded-full",
          blur,
          "animate-float-slow"
        )}
        style={{
          background: `radial-gradient(circle, hsla(217, 91%, 60%, ${opacity * 0.5}) 0%, transparent 70%)`,
          top: "10%",
          right: "20%",
          animationDelay: "3s",
        }}
      />

      {/* Mesh gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, hsla(220, 20%, 15%, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 100% 100%, hsla(260, 50%, 20%, 0.2) 0%, transparent 50%)
          `,
        }}
      />
    </div>
  );
}
