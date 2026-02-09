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
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";

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
    glowColor: "hsla(217, 91%, 60%, 0.15)",
  },
  {
    icon: PieChart,
    title: "Understand your spending",
    description: "See where your money goes with visual breakdowns and pattern insights.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    glowColor: "hsla(262, 80%, 60%, 0.15)",
  },
  {
    icon: Target,
    title: "Set realistic goals",
    description: "I'll help you figure out what's achievable and celebrate small wins.",
    color: "text-white",
    bgColor: "bg-success/10",
    glowColor: "hsla(150, 50%, 50%, 0.1)",
  },
  {
    icon: BookOpen,
    title: "Learn at your pace",
    description: "Investing basics, explained like you're smart but new to this.",
    color: "text-warning",
    bgColor: "bg-warning/10",
    glowColor: "hsla(35, 91%, 60%, 0.15)",
  },
];

export function AIIntroStep({ name, onComplete, onBack }: AIIntroStepProps) {
  const firstName = name.split(" ")[0];

  return (
    <AnimatePage>
      <div className="min-h-screen relative overflow-hidden flex flex-col">
        <FloatingOrbs variant="subtle" />

        <div className="relative z-10 px-6 py-10 flex-1 overflow-y-auto pb-40">
          {/* Header */}
          <div className="mb-10">
            <HoverScale className="w-fit mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-muted-foreground/60 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            </HoverScale>
            <h1 className="text-3xl md:text-5xl font-black mb-2 text-white tracking-tighter shimmer-text">
              Mission briefing, <span className="text-primary">{firstName}</span>.
            </h1>
            <p className="text-muted-foreground font-medium text-lg max-w-md">
              Here is how we will transform your financial habits together.
            </p>
          </div>

          {/* Features list */}
          <AnimateList className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <AnimateItem key={feature.title}>
                  <HoverScale>
                    <Spotlight className="glass-card-3d p-6 border-white/5" color={feature.glowColor}>
                      <div className="flex items-start gap-5 relative z-10">
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500",
                          feature.bgColor
                        )}>
                          <Icon className={cn("w-7 h-7", feature.color)} />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-black text-sm uppercase tracking-wider text-white">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Spotlight>
                  </HoverScale>
                </AnimateItem>
              );
            })}
          </AnimateList>

          {/* Privacy note */}
          <div className="mt-12 p-6 rounded-[2rem] bg-white/5 border border-white/5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-bold leading-relaxed">
              Your financial data is private and remains on your device. We use it only to empower you.
            </p>
          </div>
        </div>

        {/* Fixed CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-background via-background to-transparent z-50">
          <HoverScale>
            <Button
              size="lg"
              onClick={onComplete}
              className="w-full h-20 text-xl rounded-[2.5rem] font-black uppercase tracking-[0.2em] group bg-primary text-white shadow-2xl btn-3d"
            >
              Launch App
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
          </HoverScale>
        </div>
      </div>
    </AnimatePage>
  );
}
