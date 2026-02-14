"use client";

import { useState } from "react";
import {
  Sparkles,
  PieChart,
  Target,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  Lock,
  Shield,
  Zap,
  Activity
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
    icon: Activity,
    title: "Smart Insights",
    description: "I'll help you spot ways to save money and optimize your spending habits.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    glowColor: "hsla(217, 91%, 60%, 0.15)",
  },
  {
    icon: Zap,
    title: "Helpful Tips",
    description: "Get real-time alerts and suggestions to keep your budget on track.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    glowColor: "hsla(262, 80%, 60%, 0.15)",
  },
  {
    icon: Target,
    title: "Future Growth",
    description: "Visualize your financial future and see how your savings can grow over time.",
    color: "text-white",
    bgColor: "bg-white/10",
    glowColor: "hsla(0, 0%, 100%, 0.1)",
  },
];

export function AIIntroStep({ name, onComplete, onBack }: AIIntroStepProps) {
  const firstName = name.split(" ")[0];

  return (
    <AnimatePage>
      <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#07090e]">
        <FloatingOrbs variant="default" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05)_0%,transparent_50%)]" />

        <div className="relative z-10 px-6 py-10 flex-1 overflow-y-auto pb-44">
          {/* Header Assembly */}
          <div className="mb-16">
            <HoverScale className="w-fit mb-10">
              <button
                onClick={onBack}
                className="group flex items-center gap-2 text-muted-foreground/40 hover:text-primary font-black text-[10px] uppercase tracking-[0.3em] transition-all"
              >
                <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5">
                  <ChevronLeft className="w-4 h-4" />
                </div>
                Return to Setup
              </button>
            </HoverScale>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-primary/50" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Overview</span>
              </div>
              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white tracking-tighter shimmer-text leading-[0.9]">
                ALL SET<br />
                <span className="text-white">{firstName.toUpperCase()}</span>
              </h1>
              <p className="text-muted-foreground/60 font-bold text-sm md:text-lg max-w-sm uppercase tracking-wide">
                Let's get started on your journey to financial clarity.
              </p>
            </div>
          </div>

          {/* Capabilities Grid */}
          <AnimateList className="space-y-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <AnimateItem key={feature.title}>
                  <HoverScale>
                    <Spotlight className="glass-card-3d p-8 border-white/10 bg-white/[0.02]" color={feature.glowColor}>
                      <div className="flex items-start gap-6 relative z-10">
                        <div className={cn(
                          "w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 border border-white/5 transition-all duration-500",
                          feature.bgColor
                        )}>
                          <Icon className={cn("w-8 h-8", feature.color)} />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-black text-sm uppercase tracking-[0.1em] text-white">{feature.title}</h3>
                          <p className="text-xs text-muted-foreground/60 font-medium leading-relaxed max-w-xs">
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

          {/* Data Security Protocol */}
          <div className="mt-16 p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
            <div className="flex items-start gap-5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Privacy First</p>
                <p className="text-xs text-muted-foreground/60 font-medium leading-relaxed">
                  Your financial data is stored securely on your device. We prioritize your privacy and security above all else.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deployment Trigger */}
        <div className="fixed bottom-0 left-0 right-0 p-6 md:p-8 pt-10 md:pt-12 bg-gradient-to-t from-[#07090e] via-[#07090e] to-transparent z-50">
          <HoverScale>
            <Button
              size="lg"
              onClick={onComplete}
              className="w-full h-14 md:h-18 flex items-center justify-center gap-2 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] group bg-white text-black shadow-[0_15px_40px_rgba(255,255,255,0.1)] hover:bg-white/90 btn-3d overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="text-[10px] md:text-lg relative z-10 flex items-center justify-center font-black">
                {/* Responsive text to avoid overflow */}
                <span className="md:hidden">GO TO DASHBOARD</span>
                <span className="hidden md:inline">GO TO DASHBOARD</span>
              </span>
              <ArrowRight className="w-4 h-4 md:w-6 md:h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
            </Button>
          </HoverScale>
        </div>
      </div>
    </AnimatePage>
  );
}
