"use client";

import { Link } from "react-router-dom";
import { PieChart, ArrowRight, Target, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/effects/Spotlight";
import { HoverScale } from "@/components/effects/AnimatePage";

const nudges = [
  {
    icon: PieChart,
    label: "Understand your spending",
    description: "See where your money goes",
    href: "/insights",
    color: "text-accent",
    bgColor: "bg-accent/10",
    glowColor: "hsla(262, 80%, 60%, 0.15)",
  },
  {
    icon: Target,
    label: "Set a savings goal",
    description: "Track your progress",
    href: "/goals",
    color: "text-primary",
    bgColor: "bg-primary/10",
    glowColor: "hsla(217, 91%, 60%, 0.15)",
  },
  {
    icon: Wallet,
    label: "Track your budget",
    description: "Set limits & monitor spending",
    href: "/money-tracker",
    color: "text-white",
    bgColor: "bg-primary/20",
    glowColor: "hsla(217, 91%, 60%, 0.1)",
  },
];

interface ActionCardProps {
  nudge: typeof nudges[0];
  index: number;
}

function ActionCard({ nudge }: ActionCardProps) {
  const Icon = nudge.icon;

  return (
    <HoverScale>
      <Link to={nudge.href} className="block">
        <Spotlight
          className={cn(
            "glass-card-3d p-4 sm:p-5 flex items-center gap-4 transition-all duration-300 group",
            "hover:shadow-2xl border-white/5 hover:border-white/10"
          )}
          color={nudge.glowColor}
        >
          {/* Icon with glow effect */}
          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-500 shrink-0",
            nudge.bgColor,
            "group-hover:scale-110 group-hover:rotate-6"
          )}>
            <Icon className={cn("w-5 h-5 relative z-10 transition-transform duration-300", nudge.color)} />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm sm:text-base text-white tracking-tight group-hover:text-primary transition-colors">
              {nudge.label}
            </p>
            <p className="text-xs text-muted-foreground/60 font-medium">
              {nudge.description}
            </p>
          </div>

          {/* Arrow with animation */}
          <div className="relative shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors">
            <ArrowRight className={cn(
              "w-4 h-4 text-muted-foreground transition-all duration-300",
              "group-hover:translate-x-0.5 group-hover:text-primary"
            )} />
          </div>
        </Spotlight>
      </Link>
    </HoverScale>
  );
}

export function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
      {nudges.map((nudge, index) => (
        <ActionCard key={nudge.href} nudge={nudge} index={index} />
      ))}
    </div>
  );
}
