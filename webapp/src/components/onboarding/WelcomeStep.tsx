"use client";

import { Sparkles, TrendingUp, PiggyBank, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating background orbs */}
      <FloatingOrbs variant="default" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-fade-in">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl scale-150 animate-pulse" />

            {/* Main logo container */}
            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-xl border border-primary/30 flex items-center justify-center glow-teal-intense">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Main headline with staggered animation */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          <span className="block animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <span className="gradient-text-animated">No lectures.</span>
          </span>
          <span className="block animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <span className="text-foreground">No judgment.</span>
          </span>
          <span className="block animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <span className="text-muted-foreground">Just clarity.</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-md mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          Your AI finance coach that helps you understand your money - without making you feel bad about it.
        </p>

        {/* Feature pills */}
        <div
          className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          <FeaturePill icon={TrendingUp} text="Track spending" />
          <FeaturePill icon={PiggyBank} text="Build savings" />
          <FeaturePill icon={Shield} text="Zero judgment" />
        </div>

        {/* CTA Button with glow */}
        <div
          className="animate-fade-in-up"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          <Button
            size="lg"
            onClick={onNext}
            className="px-10 py-7 text-lg rounded-2xl bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-accent text-primary-foreground font-semibold transition-all duration-300 hover:scale-105 btn-3d"
          >
            Let's get started
          </Button>
        </div>

        {/* Trust indicator */}
        <p
          className="mt-8 text-sm text-muted-foreground/70 animate-fade-in-up"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          Takes about 2 minutes to set up
        </p>
      </div>
    </div>
  );
}

function FeaturePill({ icon: Icon, text }: { icon: typeof TrendingUp; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm text-foreground/80">{text}</span>
    </div>
  );
}
