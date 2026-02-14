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
import { TrendingUp, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { Logo } from "@/components/global/Logo";

export default function Home() {
  const { profile, isLoading, derivedFinancials } = useUserProfile();
  const { formatCurrency, symbol } = useCurrency();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && profile && !profile.onboardingComplete) {
      navigate("/onboarding");
    }
  }, [isLoading, profile, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
        <FloatingOrbs variant="default" />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
          </div>
          <p className="text-white text-sm font-black uppercase tracking-[0.4em] text-primary shimmer-text">Loading your dashboard</p>
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
      <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
        <FloatingOrbs variant="default" />

        {/* Header */}
        <header className="relative z-10 px-6 pt-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-xl">
                  <Logo size="sm" />
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
            </div>
          </motion.div>

          {/* Hero Command Center */}
          <HoverScale>
            <Spotlight className="glass-card-3d p-6 sm:p-8 glow-teal bg-primary/5 border-primary/20">
              <div className="relative z-10">
                <div className="space-y-6">
                  {/* Main metric */}
                  <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-60">Monthly Income</p>
                      <div className="flex items-center gap-1.5 bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                        <span className="text-[8px] font-black text-primary uppercase tracking-widest">Synced</span>
                      </div>
                    </div>
                    <div className="text-2xl sm:text-5xl lg:text-6xl font-black text-white tracking-tighter flex items-baseline gap-1">
                      <AnimatedNumber value={profile.monthlyIncome} prefix={symbol} />
                    </div>
                    <p className="text-[8px] md:text-[10px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-[0.2em]">Monthly Summary</p>
                  </div>

                  {/* Sub-metrics */}
                  <div className="grid grid-cols-3 gap-1 md:gap-2 pt-2 md:pt-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-primary opacity-60" />
                        <span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-wider opacity-60">Saved</span>
                      </div>
                      <p className="text-base sm:text-xl font-black text-white tracking-tighter">
                        <AnimatedNumber value={derivedFinancials?.actualSavingsRate ?? 0} suffix="%" />
                      </p>
                    </div>
                    <div className="space-y-1 border-x border-white/5 px-2 md:px-3">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-primary opacity-60" />
                        <span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-wider opacity-60">Daily Budget</span>
                      </div>
                      <p className="text-base sm:text-xl font-black text-white tracking-tighter">
                        <AnimatedNumber value={derivedFinancials?.dailyBudget ?? 0} prefix={symbol} />
                      </p>
                    </div>
                    <div className="space-y-1 pl-1">
                      <div className="flex items-center gap-1.5 justify-end">
                        <Calendar className="w-3 h-3 text-primary opacity-60" />
                        <span className="text-[8px] md:text-[9px] font-black text-muted-foreground uppercase tracking-wider opacity-60">Days Left</span>
                      </div>
                      <p className="text-base sm:text-xl font-black text-white tracking-tighter text-right">
                        {derivedFinancials?.daysLeft ?? 0}<span className="text-[8px] sm:text-[10px] opacity-40 ml-0.5 md:ml-1">D</span>
                      </p>
                    </div>
                  </div>

                  {/* Timeline Progress */}
                  <div className="pt-2 md:pt-4">
                    <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground mb-2 md:mb-3">
                      <span className="opacity-40">This Month's Progress</span>
                      <span className="text-primary font-bold tracking-tighter">{monthProgress}%</span>
                    </div>
                    <AnimatedProgress value={monthProgress} color="primary" size="md" showGlow={true} />
                  </div>
                </div>
              </div>
            </Spotlight>
          </HoverScale>
        </header>

        {/* Dashboard Modules */}
        <main className="relative z-10 px-6 space-y-6 pb-32">
          <AnimateList className="space-y-6">
            <AnimateItem>
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1 mb-2">Money Overview</h3>
              <HoverScale>
                <MoneySnapshot />
              </HoverScale>
            </AnimateItem>

            <AnimateItem>
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1 mb-2">Total Spent</h3>
              <HoverScale>
                <CashFlowTrend />
              </HoverScale>
            </AnimateItem>

            <AnimateItem>
              <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1 mb-2">Quick Tip</h3>
              <HoverScale>
                <InsightCard />
              </HoverScale>
            </AnimateItem>

            <AnimateItem>
              <div className="pt-2">
                <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-1 mb-4">Shortcuts</h3>
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
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}
