"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AnimatedNumber } from "@/components/ui/AnimatedProgress";

const COLORS = {
  spent: "hsl(217, 91%, 60%)", // Primary Blue
  saved: "hsl(217, 91%, 40%)", // Darker Blue for contrast
  fixed: "hsl(240, 5%, 30%)",  // Muted Grey
};

export function MoneySnapshot() {
  const { profile, derivedFinancials } = useUserProfile();
  const { formatCurrency, symbol } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!profile || !derivedFinancials) return null;

  const { spent, saved, actualSavingsRate, daysLeft } = derivedFinancials;
  const { fixedExpenses, monthlyIncome, savingsTargetPercentage } = profile;

  // Data for the donut chart
  const variableSpent = Math.max(0, spent - fixedExpenses);
  const data = [
    { name: "Fixed", value: fixedExpenses, color: COLORS.fixed },
    { name: "Variable", value: variableSpent, color: COLORS.spent },
    { name: "Saved", value: saved, color: COLORS.saved },
  ].filter((d) => d.value > 0);

  // Calculate trend (comparing to target)
  const savingsDiff = actualSavingsRate - savingsTargetPercentage;
  const trend = savingsDiff > 2 ? "up" : savingsDiff < -2 ? "down" : "stable";

  const now = new Date();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysSpent = now.getDate();

  return (
    <div className="glass-card-3d p-4 md:p-6 card-3d-hover group">
      <h3 className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
        Money Overview
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
      </h3>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* 3D Ring Chart with glow */}
        <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0 flex items-center justify-center">
          {/* Pulsed Core Glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/5 border border-primary/10 animate-pulse" />
            <div className="absolute w-24 h-24 rounded-full bg-primary/[0.02] animate-ping" />
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id="retainedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 60%)" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 40%)" />
                </linearGradient>
                <linearGradient id="operationalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 70%)" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 50%)" />
                </linearGradient>
                <linearGradient id="fixedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2a2e37" />
                  <stop offset="100%" stopColor="#161b22" />
                </linearGradient>
              </defs>

              {/* Background Tracks */}
              <Pie
                data={[{ value: 100 }]}
                cx="50%"
                cy="50%"
                innerRadius="84%"
                outerRadius="96%"
                dataKey="value"
                stroke="none"
                fill="rgba(255,255,255,0.03)"
                isAnimationActive={false}
              />
              <Pie
                data={[{ value: 100 }]}
                cx="50%"
                cy="50%"
                innerRadius="68%"
                outerRadius="80%"
                dataKey="value"
                stroke="none"
                fill="rgba(255,255,255,0.03)"
                isAnimationActive={false}
              />
              <Pie
                data={[{ value: 100 }]}
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="64%"
                dataKey="value"
                stroke="none"
                fill="rgba(255,255,255,0.03)"
                isAnimationActive={false}
              />

              {/* Active Progress Rings */}
              <Pie
                data={[{ value: (saved / Math.max(1, monthlyIncome)) * 100 }, { value: 100 - ((saved / Math.max(1, monthlyIncome)) * 100) }]}
                cx="50%"
                cy="50%"
                innerRadius="84%"
                outerRadius="96%"
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                <Cell fill="url(#retainedGrad)" />
                <Cell fill="transparent" />
              </Pie>
              <Pie
                data={[{ value: (variableSpent / Math.max(1, monthlyIncome)) * 100 }, { value: 100 - ((variableSpent / Math.max(1, monthlyIncome)) * 100) }]}
                cx="50%"
                cy="50%"
                innerRadius="68%"
                outerRadius="80%"
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                <Cell fill="url(#operationalGrad)" />
                <Cell fill="transparent" />
              </Pie>
              <Pie
                data={[{ value: (fixedExpenses / Math.max(1, monthlyIncome)) * 100 }, { value: 100 - ((fixedExpenses / Math.max(1, monthlyIncome)) * 100) }]}
                cx="50%"
                cy="50%"
                innerRadius="52%"
                outerRadius="64%"
                startAngle={90}
                endAngle={450}
                dataKey="value"
                stroke="none"
                cornerRadius={10}
              >
                <Cell fill="url(#fixedGrad)" />
                <Cell fill="transparent" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text with glow */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl md:text-2xl font-black text-primary shimmer-text leading-none">
              {actualSavingsRate}%
            </span>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 mt-1">SAVED</span>
          </div>
        </div>
      </div>

      {/* Stats with animated values */}
      <div className="flex-1 w-full grid grid-cols-1 xs:grid-cols-2 gap-4 md:block md:space-y-6">
        {/* Fixed Expenses */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 md:bg-transparent md:border-none md:p-0">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.fixed }} />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Fixed Base</span>
          </div>
          <p className="text-lg md:text-xl font-black text-white tracking-tighter truncate">
            <AnimatedNumber value={fixedExpenses} prefix={symbol} />
          </p>
        </div>

        {/* Operational Outflow */}
        <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 md:bg-transparent md:border-none md:p-0">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.spent }} />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Spending</span>
          </div>
          <p className="text-lg md:text-xl font-black text-white tracking-tighter truncate">
            <AnimatedNumber value={variableSpent} prefix={symbol} />
          </p>
        </div>

        {/* Retained Capital Indicator */}
        <div className="w-full col-span-1 xs:col-span-2 md:col-span-1 pt-4 border-t border-white/5 md:border-none md:pt-0">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.saved }} />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary">Savings</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xl md:text-2xl font-black text-primary tracking-tighter truncate">
              <AnimatedNumber value={saved} prefix={symbol} />
            </p>
            <span
              className={cn(
                "flex items-center text-[8px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-full whitespace-nowrap border",
                trend === "up" && "text-primary bg-primary/10 border-primary/20",
                trend === "down" && "text-warning bg-warning/10 border-warning/20",
                trend === "stable" && "text-muted-foreground bg-secondary/50 border-white/5"
              )}
            >
              {trend === "up" ? (
                <TrendingUp className="w-3 h-3 mr-1" />
              ) : trend === "down" ? (
                <TrendingDown className="w-3 h-3 mr-1" />
              ) : (
                <Minus className="w-3 h-3 mr-1" />
              )}
              {trend === "up" ? "ABOVE" : trend === "down" ? "BELOW" : "ON"} TARGET
            </span>
          </div>
        </div>
      </div>

      {/* Days left indicator with progress */}
      <div className="mt-4 pt-4 border-t border-white/5 col-span-1 xs:col-span-2 md:col-span-1">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-2">
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            {daysLeft} days left this month
          </p>
          <p className="text-[9px] font-black uppercase tracking-[0.1em] text-primary">
            Goal: {savingsTargetPercentage}%
          </p>
        </div>
        <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary shimmer-text transition-all duration-1000"
            style={{ width: `${Math.min(100, (daysSpent / totalDays) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
