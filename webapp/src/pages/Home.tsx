"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MoneySnapshot } from "@/components/dashboard/MoneySnapshot";
import { CashFlowTrend } from "@/components/dashboard/CashFlowTrend";
import { InsightCard } from "@/components/dashboard/InsightCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AnimatedProgress, AnimatedNumber } from "@/components/ui/AnimatedProgress";
import { Sparkles, TrendingUp, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { useConfetti } from "@/components/effects/Confetti";
import { Spotlight } from "@/components/effects/Spotlight";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";

export default function Home() {
  const { profile, isLoading, derivedFinancials } = useUserProfile();
  const { formatCurrency, symbol } = useCurrency();
  const navigate = useNavigate();
  const { fire, ConfettiComponent } = useConfetti();

  useEffect(() => {
    if (!isLoading && profile && !profile.onboardingComplete) {
      navigate("/onboarding");
    }
    const hasWelcomed = sessionStorage.getItem("hasWelcomed");
    if (!isLoading && profile?.onboardingComplete && !hasWelcomed) {
      fire();
      sessionStorage.setItem("hasWelcomed", "true");
    }
  }, [isLoading, profile, navigate, fire]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
        <FloatingOrbs variant="default" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
          </div>
          <p className="text-white text-sm font-black uppercase tracking-[0.3em] shimmer-text">Syncing Intelligence</p>
        </div>
      </div>
    );
  }

  if (!profile?.onboardingComplete) return null;

  const firstName = profile.name.split(" ")[0];
  const greeting = getGreeting();
  const monthProgress = derivedFinancials ? Math.round(((derivedFinancials.daysInMonth - derivedFinancials.daysLeft) / derivedFinancials.daysInMonth) * 100) : 0;

  return (
    <AnimatePage>
      <ConfettiComponent />
      <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
        <FloatingOrbs variant="default" />

        {/* Header */}
        <header className="relative z-10 px-6 pt-10 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{greeting}</p>
                <h2 className="text-xl font-black text-white tracking-tight">{firstName}</h2>
              </div>
            </div>
            <HoverScale>
              <button onClick={() => navigate("/profile")} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="text-xs font-black text-primary">{profile.name[0]}</div>
              </button>
            </HoverScale>
          </motion.div>

          {/* Hero Command Center */}
          <HoverScale>
            <Spotlight className="glass-card-3d p-6 sm:p-8 glow-teal bg-primary/5 border-primary/20">
              <div className="relative z-10">
                <div className="space-y-8">
                  {/* Main metric */}
                  <div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2 opacity-60">Capital Influx</p>
                    <div className="text-4xl sm:text-5xl font-black text-white tracking-tighter shimmer-text">
                      <AnimatedNumber value={profile.monthlyIncome} prefix={symbol} />
                    </div>
                  </div>

                  {/* Sub-metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Saved</span>
                      </div>
                      <p className="text-lg font-black text-white tracking-tighter">
                        <AnimatedNumber value={derivedFinancials?.actualSavingsRate ?? 0} suffix="%" />
                      </p>
                    </div>
                    <div className="space-y-1 border-x border-white/5 px-4">
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Quota</span>
                      </div>
                      <p className="text-lg font-black text-white tracking-tighter">
                        <AnimatedNumber value={derivedFinancials?.dailyBudget ?? 0} prefix={symbol} />
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <Calendar className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">Cycle</span>
                      </div>
                      <p className="text-lg font-black text-white tracking-tighter">
                        {derivedFinancials?.daysLeft ?? 0} <span className="text-[10px] opacity-40">DAYS</span>
                      </p>
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  <div className="pt-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2.5">
                      <span className="opacity-60">Monthly Cycle progress</span>
                      <span className="text-primary">{monthProgress}%</span>
                    </div>
                    <AnimatedProgress value={monthProgress} color="primary" size="md" showGlow={true} />
                  </div>
                </div>
              </div>
            </Spotlight>
          </HoverScale>
        </header>

        {/* Dashboard Modules */}
        <main className="relative z-10 px-6 space-y-8 pb-32">
          <AnimateList className="space-y-8">
            <AnimateItem>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Asset Distribution</h3>
              <HoverScale>
                <MoneySnapshot />
              </HoverScale>
            </AnimateItem>

            <AnimateItem>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Capital Velocity</h3>
              <HoverScale>
                <CashFlowTrend />
              </HoverScale>
            </AnimateItem>

            <AnimateItem>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Direct Insights</h3>
              <HoverScale>
                <InsightCard />
              </HoverScale>
            </AnimateItem>

            <AnimateItem>
              <div className="pt-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1 mb-6">Execution Modules</h3>
                <QuickActions />
              </div>
            </AnimateItem>
          </AnimateList>
        </main>

        <BottomNav />
      </div>
    </AnimatePage>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "MORNING COHORT";
  if (hour < 18) return "AFTERNOON OPS";
  return "EVENING SUMMARY";
}
