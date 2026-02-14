import React from "react";
import { cn } from "@/lib/utils";

interface FloatingOrbsProps {
  className?: string;
  variant?: "default" | "subtle" | "intense";
}

export const FloatingOrbs = React.memo(function FloatingOrbs({ className, variant = "default" }: FloatingOrbsProps) {
  const intensity = {
    default: { opacity: 0.15, blur: "" },
    subtle: { opacity: 0.08, blur: "" },
    intense: { opacity: 0.25, blur: "" },
  };

  const { opacity, blur } = intensity[variant];

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {/* Primary teal orb - top left */}
      <div
        className={cn(
          "absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full",
          blur,
          "animate-float-slow"
        )}
        style={{
          background: `radial-gradient(circle, hsla(217, 91%, 60%, ${opacity}) 0%, transparent 70%)`,
          top: "-10%",
          left: "-10%",
          willChange: "transform",
        }}
      />

      {/* Accent purple orb - bottom right */}
      <div
        className={cn(
          "absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full",
          blur,
          "animate-float-medium"
        )}
        style={{
          background: `radial-gradient(circle, hsla(217, 91%, 60%, ${opacity}) 0%, transparent 70%)`,
          bottom: "-15%",
          right: "-15%",
          animationDelay: "2s",
          willChange: "transform",
        }}
      />

      {/* Blue orb - center right - hidden on mobile */}
      <div
        className={cn(
          "absolute w-[200px] sm:w-[300px] h-[200px] sm:h-[300px] rounded-full hidden sm:block",
          blur,
          "animate-float-fast"
        )}
        style={{
          background: `radial-gradient(circle, hsla(210, 60%, 55%, ${opacity * 0.7}) 0%, transparent 70%)`,
          top: "30%",
          right: "-5%",
          animationDelay: "1s",
          willChange: "transform",
        }}
      />

      {/* Small accent orb - top right - hidden on mobile */}
      <div
        className={cn(
          "absolute w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] rounded-full hidden sm:block",
          blur,
          "animate-float-slow"
        )}
        style={{
          background: `radial-gradient(circle, hsla(217, 91%, 60%, ${opacity * 0.5}) 0%, transparent 70%)`,
          top: "10%",
          right: "20%",
          animationDelay: "3s",
          willChange: "transform",
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
});
