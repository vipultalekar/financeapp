"use client";

import { Sparkles, TrendingUp, PiggyBank, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { motion } from "framer-motion";
import { HoverScale, FloatAnimation } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";

interface WelcomeStepProps {
  onNext: () => void;
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Floating background orbs */}
      <FloatingOrbs variant="default" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        {/* Animated Logo */}
        <FloatAnimation>
          <div className="mb-12">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-primary/20 blur-3xl scale-150 animate-pulse" />

              {/* Main logo container */}
              <Spotlight
                className="relative w-28 h-28 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden"
                color="hsla(217, 91%, 60%, 0.2)"
              >
                <Sparkles className="w-14 h-14 text-primary relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
              </Spotlight>
            </div>
          </div>
        </FloatAnimation>

        {/* Main headline */}
        <div className="space-y-4 mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter"
          >
            <span className="block shimmer-text">No lectures.</span>
            <span className="block text-white">No judgment.</span>
            <span className="block text-muted-foreground/40 italic">Just clarity.</span>
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-2xl text-muted-foreground font-medium max-w-xl mb-12 leading-relaxed"
        >
          The AI finance coach that understands your life - without making you feel bad about your choices.
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          <FeaturePill icon={TrendingUp} text="Smart Tracking" />
          <FeaturePill icon={PiggyBank} text="Goal Oriented" />
          <FeaturePill icon={Shield} text="Zero Pressure" />
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <HoverScale>
            <Button
              size="lg"
              onClick={onNext}
              className="group px-12 h-20 text-xl rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-[0_0_30px_rgba(37,99,235,0.3)] btn-3d"
            >
              Get Started
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </HoverScale>
        </motion.div>

        {/* Trust indicator */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40"
        >
          SETUP TAKES &lt; 2 MINUTES
        </motion.p>
      </div>
    </div>
  );
}

function FeaturePill({ icon: Icon, text }: { icon: typeof TrendingUp; text: string }) {
  return (
    <HoverScale>
      <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl shadow-xl group">
        <Icon className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
        <span className="text-xs font-black uppercase tracking-widest text-white/80">{text}</span>
      </div>
    </HoverScale>
  );
}
