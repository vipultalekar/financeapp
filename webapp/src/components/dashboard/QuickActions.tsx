"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, ArrowRight, Target, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const nudges = [
  {
    icon: PieChart,
    label: "Understand your spending",
    description: "See where your money goes",
    href: "/insights",
    color: "text-accent",
    bgColor: "bg-accent/10",
    glowColor: "group-hover:shadow-accent/20",
    gradientFrom: "from-accent/20",
    gradientTo: "to-accent/5",
  },
  {
    icon: Target,
    label: "Set a savings goal",
    description: "Track your progress",
    href: "/goals",
    color: "text-primary",
    bgColor: "bg-primary/10",
    glowColor: "group-hover:shadow-primary/20",
    gradientFrom: "from-primary/20",
    gradientTo: "to-primary/5",
  },
  {
    icon: Wallet,
    label: "Track your budget",
    description: "Set limits & monitor spending",
    href: "/money-tracker",
    color: "text-success",
    bgColor: "bg-success/10",
    glowColor: "group-hover:shadow-success/20",
    gradientFrom: "from-success/20",
    gradientTo: "to-success/5",
  },
];

interface ActionCardProps {
  nudge: typeof nudges[0];
  index: number;
}

function ActionCard({ nudge, index }: ActionCardProps) {
  const [transform, setTransform] = useState("");
  const Icon = nudge.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  return (
    <Link
      to={nudge.href}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "glass-card-3d p-3 sm:p-4 flex items-center gap-3 sm:gap-4 transition-all duration-200 group",
        "hover:shadow-lg",
        nudge.glowColor
      )}
      style={{
        transform: transform || undefined,
        transformStyle: "preserve-3d",
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {/* Icon with glow effect */}
      <div className={cn(
        "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center relative overflow-hidden transition-all duration-300 shrink-0",
        nudge.bgColor,
        "group-hover:scale-110"
      )}>
        {/* Gradient background on hover */}
        <div className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br",
          nudge.gradientFrom,
          nudge.gradientTo
        )} />
        <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-300 group-hover:scale-110", nudge.color)} />
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm sm:text-base text-foreground group-hover:text-foreground/90 transition-colors truncate">
          {nudge.label}
        </p>
        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
          {nudge.description}
        </p>
      </div>

      {/* Arrow with animation */}
      <div className="relative shrink-0">
        <ArrowRight className={cn(
          "w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground transition-all duration-300",
          "group-hover:translate-x-1 group-hover:text-foreground"
        )} />
        {/* Glow behind arrow on hover */}
        <div className={cn(
          "absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300",
          nudge.bgColor
        )} />
      </div>
    </Link>
  );
}

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
      {nudges.map((nudge, index) => (
        <ActionCard key={nudge.href} nudge={nudge} index={index} />
      ))}
    </div>
  );
}
