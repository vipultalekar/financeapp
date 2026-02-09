"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

export function CashFlowTrend() {
  const { profile, derivedFinancials } = useUserProfile();
  const { formatCurrency } = useCurrency();

  function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-3d px-4 py-3 glow-teal">
          <p className="text-xs text-muted-foreground mb-1">{label}</p>
          <p className="text-lg font-bold text-primary">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  }

  // Generate cash flow data based on user's actual income
  const cashFlowData = useMemo(() => {
    if (!profile || !derivedFinancials) return [];

    const { monthlyIncome } = profile;
    const { daysInMonth, daysLeft, spent } = derivedFinancials;
    const currentDay = daysInMonth - daysLeft;

    // Generate data points for the month
    const data: Array<{ date: string; balance: number }> = [];
    const dailySpendRate = spent / currentDay;

    for (let day = 1; day <= currentDay; day++) {
      const date = day === currentDay ? "Today" : `Day ${day}`;
      // Simulate balance decreasing over time
      const spentSoFar = dailySpendRate * day * (0.8 + Math.random() * 0.4); // Some variation
      const balance = Math.max(0, monthlyIncome - spentSoFar);

      if (day === 1 || day === Math.floor(currentDay / 4) || day === Math.floor(currentDay / 2) || day === Math.floor(currentDay * 3 / 4) || day === currentDay) {
        data.push({
          date: day === 1 ? "Start" : day === currentDay ? "Today" : `Day ${day}`,
          balance: Math.round(balance),
        });
      }
    }

    return data;
  }, [profile, derivedFinancials]);

  if (!profile || !derivedFinancials || cashFlowData.length === 0) return null;

  const minBalance = Math.min(...cashFlowData.map((d) => d.balance));
  const maxBalance = Math.max(...cashFlowData.map((d) => d.balance));

  return (
    <div className="glass-card-3d p-6 card-3d-hover group">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Cash Balance Trend
        </h3>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Current:</span>
          <span className="text-primary font-semibold">
            {formatCurrency(cashFlowData[cashFlowData.length - 1]?.balance ?? 0)}
          </span>
        </div>
      </div>

      <div className="h-44 relative">
        {/* Glow effect behind chart */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 80% 50% at 50% 100%, hsla(217, 91%, 60%, 0.15) 0%, transparent 70%)`,
          }}
        />

        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={cashFlowData}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              {/* Enhanced gradient with glow effect */}
              <linearGradient id="cashGradientEnhanced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.4} />
                <stop offset="50%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
              </linearGradient>
              {/* Glow filter for the line */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(220, 10%, 50%)", fontSize: 13 }}
              dy={8}
            />
            <YAxis
              hide
              domain={[minBalance * 0.9, maxBalance * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Reference line for starting balance */}
            <ReferenceLine
              y={cashFlowData[0]?.balance}
              stroke="hsl(220, 15%, 25%)"
              strokeDasharray="3 3"
              strokeOpacity={0.5}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={3}
              fill="url(#cashGradientEnhanced)"
              style={{ filter: "url(#glow)" }}
              animationDuration={1500}
              animationBegin={200}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Started</p>
          <p className="text-base font-semibold">{formatCurrency(profile.monthlyIncome)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Spent</p>
          <p className="text-base font-semibold text-accent">{formatCurrency(derivedFinancials.spent)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="text-base font-semibold text-primary">{formatCurrency(derivedFinancials.saved)}</p>
        </div>
      </div>
    </div>
  );
}
