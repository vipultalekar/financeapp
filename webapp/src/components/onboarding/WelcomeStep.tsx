"use client";

import { Sparkles, TrendingUp, PiggyBank, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { motion } from "framer-motion";
import { HoverScale, FloatAnimation } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";
import { Logo } from "@/components/global/Logo";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#07090e]">
      {/* Dynamic Background Elements */}
      <FloatingOrbs variant="default" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05)_0%,transparent_50%)]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-5xl mx-auto py-12 md:py-20">
        {/* Animated Logo Assembly */}
        <FloatAnimation>
          <div className="mb-10 md:mb-16 relative">
            <div className="absolute inset-0 rounded-[2rem] md:rounded-[3rem] bg-primary/20 blur-[60px] md:blur-[100px] scale-150 animate-pulse" />

            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <Spotlight
                className="relative w-24 h-24 md:w-40 md:h-40 rounded-[2.5rem] md:rounded-[4rem] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.2)] overflow-hidden group"
                color="hsla(217, 91%, 60%, 0.3)"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 opacity-50" />
                <Logo size="xl" className="relative z-10 transition-all duration-700 group-hover:scale-110" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 md:w-12 md:h-12 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              </Spotlight>

              {/* Orbital Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-3 md:-inset-4 rounded-[3rem] md:rounded-[4rem] border border-dashed border-primary/20 opacity-40 pointer-events-none"
              />
            </motion.div>
          </div>
        </FloatAnimation>

        {/* Hero Typography */}
        <div className="space-y-4 md:space-y-6 mb-10 md:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-3xl sm:text-5xl md:text-8xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-white">
              <span className="block shimmer-text">RUPIYO</span>
              <span className="block text-white">MADE SIMPLE</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center gap-3 md:gap-4"
          >
            <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-primary/50" />
            <span className="text-[8px] sm:text-xs font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-primary">Take control of your money</span>
            <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-primary/50" />
          </motion.div>
        </div>

        {/* Value Proposition */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-2xl text-muted-foreground/80 font-medium max-w-2xl mb-12 md:mb-16 leading-relaxed px-4"
        >
          Smart tools to help you track spending, set goals, and save more. No lectures, no judgment—just clarity on your journey to wealth.
        </motion.p>

        {/* Feature Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 md:mb-20"
        >
          <FeaturePill icon={TrendingUp} text="Smart Insights" color="text-primary" />
          <FeaturePill icon={PiggyBank} text="Savings Goals" color="text-accent" />
          <FeaturePill icon={Shield} text="100% Private" color="text-white" />
        </motion.div>

        {/* Action Assembly */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group w-full max-w-xs md:max-w-none"
        >
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          <HoverScale>
            <Button
              size="lg"
              onClick={onNext}
              className="relative group w-full md:w-auto md:px-12 h-14 md:h-18 text-sm md:text-lg rounded-xl md:rounded-2xl bg-primary text-white font-black uppercase tracking-[0.1em] md:tracking-[0.2em] transition-all duration-700 shadow-[0_15px_40px_rgba(37,99,235,0.25)] btn-3d overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative z-10 flex items-center justify-center">
                Get Started
                <ArrowRight className="w-4 h-4 md:w-6 md:h-6 ml-2 group-hover:translate-x-3 transition-transform duration-500" />
              </span>
            </Button>
          </HoverScale>
        </motion.div>

        {/* Status Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-12 md:mt-16 flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-muted-foreground/60">Secure & Private</span>
          </div>
          <p className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
            100% Encrypted
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function FeaturePill({ icon: Icon, text, color }: { icon: typeof TrendingUp; text: string; color: string }) {
  return (
    <HoverScale>
      <div className="flex items-center gap-3 px-8 py-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-2xl group transition-all duration-500 hover:bg-white/10 hover:border-primary/30">
        <Icon className={cn("w-5 h-5 transition-all duration-700 group-hover:scale-125 group-hover:rotate-12", color)} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90">{text}</span>
      </div>
    </HoverScale>
  );
}
