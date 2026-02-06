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
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { AnimatedProgress, AnimatedNumber } from "@/components/ui/AnimatedProgress";
import { Sparkles } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center relative">
        <FloatingOrbs variant="subtle" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!profile?.onboardingComplete) {
    return null;
  }

  const firstName = profile.name.split(" ")[0];
  const greeting = getGreeting();

  return (
    <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
      {/* Floating background orbs */}
      <FloatingOrbs variant="default" />

      {/* Hero Section */}
      <header className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
        {/* Greeting */}
        <div className="flex items-center gap-2 mb-2">
          <p className="text-muted-foreground text-xs sm:text-sm">
            {greeting}, {firstName}
          </p>
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-pulse" />
        </div>

        {/* Hero Card with Income Display */}
        <div className="glass-card-3d p-4 sm:p-6 mt-3 sm:mt-4 glow-teal">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            {/* Main balance display */}
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Monthly Income</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold gradient-text break-all">
                  {formatCurrency(profile.monthlyIncome)}
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                {formatCurrency(profile.monthlyIncome * 12)}/year
              </p>
            </div>

            {/* Quick stats */}
            <div className="flex gap-4 sm:gap-6 md:gap-8">
              <div className="text-center min-w-0">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-accent animate-savings-pulse">
                  <AnimatedNumber value={derivedFinancials?.actualSavingsRate ?? 0} suffix="%" />
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Saved</p>
              </div>
              <div className="text-center min-w-0">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-success truncate">
                  <AnimatedNumber value={derivedFinancials?.dailyBudget ?? 0} prefix={symbol} />
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Daily Budget</p>
              </div>
              <div className="text-center min-w-0">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                  {derivedFinancials?.daysLeft ?? 0}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Days Left</p>
              </div>
            </div>
          </div>

          {/* Progress bar for month */}
          <div className="mt-4 sm:mt-6">
            <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
              <span>Month Progress</span>
              <span>{Math.round(((derivedFinancials?.daysInMonth ?? 30) - (derivedFinancials?.daysLeft ?? 0)) / (derivedFinancials?.daysInMonth ?? 30) * 100)}%</span>
            </div>
            <AnimatedProgress
              value={((derivedFinancials?.daysInMonth ?? 30) - (derivedFinancials?.daysLeft ?? 0)) / (derivedFinancials?.daysInMonth ?? 30) * 100}
              color="primary"
              size="md"
              showGlow={true}
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 px-4 sm:px-6 space-y-4 sm:space-y-6">
        {/* Money Snapshot */}
        <div className="animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          <MoneySnapshot />
        </div>

        {/* Cash Flow Trend */}
        <div className="animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <CashFlowTrend />
        </div>

        {/* AI Insight */}
        <div className="animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <InsightCard />
        </div>

        {/* Quick Actions */}
        <div className="animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
            What would you like to do?
          </h3>
          <QuickActions />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
