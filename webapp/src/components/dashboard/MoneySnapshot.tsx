"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";

const COLORS = {
  spent: "hsl(217, 91%, 60%)", // Primary Blue
  saved: "hsl(217, 91%, 40%)", // Darker Blue for contrast
  fixed: "hsl(240, 5%, 30%)",  // Muted Grey
};

export function MoneySnapshot() {
  const { profile, derivedFinancials } = useUserProfile();
  const { formatCurrency } = useCurrency();
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

  return (
    <div className="glass-card-3d p-4 sm:p-6 card-3d-hover group">
      <h3 className="text-sm font-medium text-muted-foreground mb-3 sm:mb-4 flex items-center gap-2">
        Money Snapshot
        <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
      </h3>

      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6">
        {/* 3D Ring Chart with glow */}
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0">
          {/* Glow effect behind chart */}
          <div
            className={cn(
              "absolute inset-0 rounded-full transition-opacity duration-700",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{
              background: `radial-gradient(circle, hsla(217, 91%, 60%, 0.2) 0%, transparent 70%)`,
              transform: "scale(1.2)",
            }}
          />

          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {/* Drop shadow filter for 3D effect */}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.3)" />
                </filter>
                {/* Simple Blue Gradients */}
                <linearGradient id="savedGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 50%)" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 35%)" />
                </linearGradient>
                <linearGradient id="spentGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="hsl(217, 91%, 70%)" />
                  <stop offset="100%" stopColor="hsl(217, 91%, 55%)" />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
                animationBegin={0}
                animationDuration={1000}
                style={{ filter: "url(#shadow)" }}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "Saved"
                        ? "url(#savedGradient)"
                        : entry.name === "Variable"
                          ? "url(#spentGradient)"
                          : entry.color
                    }
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text with glow */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-primary">
              {actualSavingsRate}%
            </span>
            <span className="text-xs text-muted-foreground">saved</span>
          </div>
        </div>

        {/* Stats with animated values */}
        <div className="flex-1 w-full grid grid-cols-2 gap-3 sm:gap-4 sm:block sm:space-y-4">
          {/* Fixed Expenses */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.fixed }} />
              <span className="text-xs sm:text-sm text-muted-foreground">Fixed</span>
            </div>
            <p className="text-sm sm:text-lg font-semibold truncate">
              {formatCurrency(fixedExpenses)}
            </p>
          </div>

          {/* Variable Spending */}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-xs sm:text-sm text-muted-foreground">Variable</span>
            </div>
            <p className="text-sm sm:text-lg font-semibold truncate">
              {formatCurrency(variableSpent)}
            </p>
          </div>

          {/* Saved */}
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs sm:text-sm text-muted-foreground">Saved</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-base sm:text-lg font-semibold text-primary truncate">
                {formatCurrency(saved)}
              </p>
              <span
                className={cn(
                  "flex items-center text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap",
                  trend === "up" && "text-primary bg-primary/10",
                  trend === "down" && "text-destructive bg-destructive/10",
                  trend === "stable" && "text-muted-foreground bg-secondary"
                )}
              >
                {trend === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                ) : trend === "down" ? (
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                ) : (
                  <Minus className="w-3 h-3 mr-0.5" />
                )}
                {trend === "up" ? "Above" : trend === "down" ? "Below" : "On"} target
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Days left indicator with progress */}
      <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-2">
          <p className="text-xs sm:text-sm text-muted-foreground">
            <span className="text-foreground font-medium text-sm sm:text-base">{daysLeft}</span> days left
          </p>
          <p className="text-xs sm:text-sm">
            <span className="text-muted-foreground">Target: </span>
            <span className="text-primary font-medium">{savingsTargetPercentage}%</span>
          </p>
        </div>
      </div>
    </div>
  );
}
