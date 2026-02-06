"use client";

import { useState } from "react";
import {
  Sparkles,
  PieChart,
  Target,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { cn } from "@/lib/utils";

interface AIIntroStepProps {
  name: string;
  onComplete: () => void;
  onBack: () => void;
}

const features = [
  {
    icon: Sparkles,
    title: "Personalized insights",
    description: "Get smart tips and patterns tailored to your spending habits.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    glowColor: "group-hover:shadow-primary/20",
  },
  {
    icon: PieChart,
    title: "Understand your spending",
    description: "See where your money goes with visual breakdowns and pattern insights.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    glowColor: "group-hover:shadow-accent/20",
  },
  {
    icon: Target,
    title: "Set realistic goals",
    description: "I'll help you figure out what's achievable and celebrate small wins.",
    color: "text-success",
    bgColor: "bg-success/10",
    glowColor: "group-hover:shadow-success/20",
  },
  {
    icon: BookOpen,
    title: "Learn at your pace",
    description: "Investing basics, explained like you're smart but new to this.",
    color: "text-warning",
    bgColor: "bg-warning/10",
    glowColor: "group-hover:shadow-warning/20",
  },
];

export function AIIntroStep({ name, onComplete, onBack }: AIIntroStepProps) {
  const firstName = name.split(" ")[0];
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Floating background orbs */}
      <FloatingOrbs variant="subtle" />

      <div className="relative z-10 px-6 py-8 pb-32">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 animate-fade-in">
            Nice to meet you, <span className="gradient-text">{firstName}</span>
          </h1>
          <p className="text-muted-foreground text-lg animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
            Here's how I can help you
          </p>
        </div>

        {/* Features list with 3D cards */}
        <div className="space-y-4 mb-10">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={feature.title}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={cn(
                  "glass-card-3d p-5 transition-all duration-300 group cursor-default animate-fade-in-up",
                  "hover:shadow-lg",
                  feature.glowColor
                )}
                style={{
                  animationDelay: `${index * 0.1 + 0.2}s`,
                  opacity: 0,
                  transform: isHovered ? 'translateY(-2px) scale(1.01)' : undefined,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                    feature.bgColor,
                    isHovered && "scale-110"
                  )}>
                    <Icon className={cn(
                      "w-6 h-6 transition-transform duration-300",
                      feature.color,
                      isHovered && "scale-110"
                    )} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy note with icon */}
        <div
          className="mb-8 p-4 rounded-xl bg-secondary/50 border border-border/50 animate-fade-in-up"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              Your data stays on your device. I'm here to help, not to judge.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-50">
        <Button
          size="lg"
          onClick={onComplete}
          className="w-full py-6 text-lg rounded-2xl font-semibold group bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-accent transition-all duration-300 btn-3d"
        >
          Let's do this
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
