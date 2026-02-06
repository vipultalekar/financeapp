"use client";

import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Moon, Sparkles, CreditCard, Coffee, Lightbulb, TrendingUp, PiggyBank } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { AIInsight } from "@/lib/types";

const iconMap: Record<string, typeof Moon> = {
  moon: Moon,
  sparkles: Sparkles,
  "credit-card": CreditCard,
  coffee: Coffee,
  lightbulb: Lightbulb,
  "trending-up": TrendingUp,
  "piggy-bank": PiggyBank,
};

export function InsightCard() {
  const { profile, derivedFinancials } = useUserProfile();
  const { formatCurrency } = useCurrency();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [transform, setTransform] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  // Generate dynamic insights based on user data
  const generateInsights = (): AIInsight[] => {
    if (!profile || !derivedFinancials) return [];

    const { monthlyIncome, fixedExpenses, savingsTargetPercentage, name } = profile;
    const { actualSavingsRate, saved, dailyBudget } = derivedFinancials;

    const insights: AIInsight[] = [];

    // Celebration if beating savings target
    if (actualSavingsRate > savingsTargetPercentage) {
      insights.push({
        id: "beating-target",
        type: "celebration",
        title: "You're crushing it!",
        message: `You're saving ${actualSavingsRate}% this month - that's ${actualSavingsRate - savingsTargetPercentage}% above your ${savingsTargetPercentage}% target. Keep it up, ${name.split(" ")[0]}!`,
        icon: "sparkles",
      });
    }

    // Tip about daily budget
    if (dailyBudget > 0) {
      insights.push({
        id: "daily-budget",
        type: "tip",
        title: "Daily spending power",
        message: `You have ${formatCurrency(dailyBudget)} per day to spend while hitting your savings goal. That's ${dailyBudget > 50 ? "pretty comfortable" : "tight but doable"} - plan accordingly!`,
        icon: "lightbulb",
        action: { label: "See breakdown", href: "/insights" },
      });
    }

    // Pattern about fixed expenses ratio
    const fixedRatio = Math.round((fixedExpenses / monthlyIncome) * 100);
    if (fixedRatio > 50) {
      insights.push({
        id: "fixed-expenses",
        type: "pattern",
        title: "Fixed costs check",
        message: `${fixedRatio}% of your income goes to fixed expenses. The 50/30/20 rule suggests keeping this around 50%. Consider reviewing for potential savings.`,
        icon: "credit-card",
        action: { label: "Review expenses", href: "/insights" },
      });
    }

    // Savings milestone
    if (saved >= 1000) {
      insights.push({
        id: "savings-milestone",
        type: "celebration",
        title: `${formatCurrency(Math.floor(saved / 1000) * 1000)}+ saved!`,
        message: `You've saved ${formatCurrency(saved)} this month. At this rate, that's ${formatCurrency(saved * 12)} per year. Your future self is grateful.`,
        icon: "piggy-bank",
      });
    }

    // Investment suggestion if saving well
    if (actualSavingsRate >= 20) {
      insights.push({
        id: "invest-suggestion",
        type: "suggestion",
        title: "Ready to invest?",
        message: `With ${actualSavingsRate}% savings rate, you might be ready to put some money to work. Even ${formatCurrency(50)}/month into index funds can grow significantly over time.`,
        icon: "trending-up",
        action: { label: "Learn about investing", href: "/learn" },
      });
    }

    // Default insight if none generated
    if (insights.length === 0) {
      insights.push({
        id: "default",
        type: "tip",
        title: "Building good habits",
        message: "Tracking your money is the first step. Keep checking in, and I'll help you spot patterns and opportunities to save more.",
        icon: "lightbulb",
      });
    }

    return insights;
  };

  // Generate insights based on user data
  const insights = generateInsights();

  const insight: AIInsight | undefined = insights[currentIndex];
  const Icon = insight ? (iconMap[insight.icon] || Sparkles) : Sparkles;

  // Auto-rotate insights
  useEffect(() => {
    if (insights.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % insights.length);
        setIsVisible(true);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [insights.length]);

  // 3D tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`);
  };

  const handleMouseLeave = () => {
    setTransform("");
  };

  if (!insight) return null;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "glass-card-3d p-5 transition-all duration-300 cursor-default group",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
      style={{
        transform: transform || undefined,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Gradient glow on hover */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, hsla(175, 65%, 50%, 0.1) 0%, transparent 70%)`,
        }}
      />

      {/* Header */}
      <div className="flex items-start gap-3 mb-3 relative z-10">
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-lg",
            insight.type === "celebration" && "bg-primary/20 group-hover:shadow-primary/20",
            insight.type === "pattern" && "bg-accent/20 group-hover:shadow-accent/20",
            insight.type === "suggestion" && "bg-warning/20 group-hover:shadow-warning/20",
            insight.type === "tip" && "bg-chart-3/20 group-hover:shadow-chart-3/20"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5 transition-transform duration-300 group-hover:scale-110",
              insight.type === "celebration" && "text-primary",
              insight.type === "pattern" && "text-accent",
              insight.type === "suggestion" && "text-warning",
              insight.type === "tip" && "text-chart-3"
            )}
          />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">
            {insight.type === "celebration"
              ? "Win"
              : insight.type === "pattern"
              ? "Pattern"
              : insight.type === "suggestion"
              ? "Check-in"
              : "Tip"}
          </p>
          <h4 className="font-semibold">{insight.title}</h4>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 relative z-10">
        {insight.message}
      </p>

      {/* Action */}
      {insight.action ? (
        <Link
          to={insight.action.href}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link relative z-10"
        >
          {insight.action.label}
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/link:translate-x-1" />
        </Link>
      ) : null}

      {/* Indicator dots */}
      {insights.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-4 relative z-10">
          {insights.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsVisible(true);
                }, 300);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50 w-1.5"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
