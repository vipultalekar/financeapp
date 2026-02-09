"use client";

import { useState, useMemo } from "react";
import {
  Home as HomeIcon,
  Zap,
  Tv,
  Shield,
  MoreHorizontal,
  Plus,
  X,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Heart,
  GraduationCap,
  Calendar,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";
import { AnimatedProgress, AnimatedNumber } from "@/components/ui/AnimatedProgress";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { useConfetti } from "@/components/effects/Confetti";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubscriptionTracker } from "@/components/dashboard/SubscriptionTracker";
import { BillReminders } from "@/components/dashboard/BillReminders";
import type { VariableExpenseCategory } from "@/lib/types";

const fixedIconMap: Record<string, typeof HomeIcon> = {
  rent: HomeIcon,
  utilities: Zap,
  subscriptions: Tv,
  insurance: Shield,
  other: MoreHorizontal,
};

const categoryIconMap: Record<VariableExpenseCategory, typeof Utensils> = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  entertainment: Gamepad2,
  health: Heart,
  education: GraduationCap,
  other: MoreHorizontal,
};

const categoryColorMap: Record<VariableExpenseCategory, string> = {
  food: "hsl(217, 91%, 60%)",
  transport: "hsl(217, 91%, 70%)",
  shopping: "hsl(217, 91%, 50%)",
  entertainment: "hsl(217, 91%, 80%)",
  health: "hsl(217, 91%, 40%)",
  education: "hsl(217, 91%, 60%)",
  other: "hsl(240, 5%, 50%)",
};

const categoryLabels: Record<VariableExpenseCategory, string> = {
  food: "Food",
  transport: "Transport",
  shopping: "Shopping",
  entertainment: "Entertainment",
  health: "Health",
  education: "Education",
  other: "Other",
};

const FIXED_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(217, 91%, 45%)",
  "hsl(217, 91%, 75%)",
  "hsl(240, 5%, 40%)",
  "hsl(217, 91%, 30%)",
  "hsl(240, 5%, 60%)",
];

const ALL_CATEGORIES: VariableExpenseCategory[] = [
  "food",
  "transport",
  "shopping",
  "entertainment",
  "health",
  "education",
  "other",
];

export default function Insights() {
  const {
    profile,
    derivedFinancials,
    currentMonthExpenses,
    addMonthlyExpense,
    removeMonthlyExpense,
  } = useUserProfile();
  const { formatCurrency, symbol } = useCurrency();
  const { fire, ConfettiComponent } = useConfetti();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<VariableExpenseCategory>("food");

  const spendingCategories = useMemo(() => {
    if (!profile || profile.expenseBreakdown.length === 0) return [];
    const totalExpenses = profile.expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);
    return profile.expenseBreakdown.map((item, index) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      amount: item.amount,
      percentage: totalExpenses > 0 ? Math.round((item.amount / totalExpenses) * 100) : 0,
      color: FIXED_COLORS[index % FIXED_COLORS.length],
    }));
  }, [profile]);

  const variableExpensesTotal = useMemo(() => {
    return currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  const sortedMonthExpenses = useMemo(() => {
    return [...currentMonthExpenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [currentMonthExpenses]);

  const totalIncome = profile?.monthlyIncome ?? 0;
  const fixedExpenses = profile?.fixedExpenses ?? 0;
  const totalSpent = fixedExpenses + variableExpensesTotal;
  const amountSaved = Math.max(0, totalIncome - totalSpent);
  const savingsRate = totalIncome > 0 ? Math.round((amountSaved / totalIncome) * 100) : 0;

  const insights = useMemo(() => {
    if (!profile || !derivedFinancials) return [];
    const result: Array<{ category: string; insight: string; suggestion: string }> = [];

    const fixedRatio = Math.round((fixedExpenses / profile.monthlyIncome) * 100);
    if (fixedRatio > 50) {
      result.push({
        category: "Fixed Expenses",
        insight: `Your fixed expenses are ${fixedRatio}% of your income.`,
        suggestion: "Consider reviewing subscriptions to reduce fixed costs.",
      });
    }

    if (savingsRate < profile.savingsTargetPercentage) {
      result.push({
        category: "Savings Goal",
        insight: `You're saving ${savingsRate}% (target is ${profile.savingsTargetPercentage}%).`,
        suggestion: `Reduce spending by ${formatCurrency(((profile.savingsTargetPercentage - savingsRate) * profile.monthlyIncome) / 100)} to hit your goal.`,
      });
    } else if (savingsRate > profile.savingsTargetPercentage) {
      result.push({
        category: "Great Momentum",
        insight: `You're saving ${savingsRate}% - that's ${savingsRate - profile.savingsTargetPercentage}% above your target.`,
        suggestion: "Consider investing the extra savings toward your long-term goals.",
      });
    }

    if (currentMonthExpenses.length > 0) {
      const categoryTotals: Partial<Record<VariableExpenseCategory, number>> = {};
      for (const expense of currentMonthExpenses) {
        categoryTotals[expense.category] = (categoryTotals[expense.category] ?? 0) + expense.amount;
      }
      let highestCategory: VariableExpenseCategory | null = null;
      let highestAmount = 0;
      for (const [cat, amount] of Object.entries(categoryTotals)) {
        if (amount > highestAmount) {
          highestAmount = amount;
          highestCategory = cat as VariableExpenseCategory;
        }
      }
      if (highestCategory && variableExpensesTotal > 0) {
        const pct = Math.round((highestAmount / variableExpensesTotal) * 100);
        if (pct > 40) {
          result.push({
            category: `${categoryLabels[highestCategory]} Spike`,
            insight: `${categoryLabels[highestCategory]} accounts for ${pct}% of your variable spending.`,
            suggestion: "Look for opportunities to optimize meal prep or transport costs.",
          });
        }
      }
    }
    return result;
  }, [profile, derivedFinancials, fixedExpenses, savingsRate, currentMonthExpenses, variableExpensesTotal, formatCurrency]);

  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (!expenseName.trim() || isNaN(amount) || amount <= 0) return;
    addMonthlyExpense({
      name: expenseName.trim(),
      amount,
      category: expenseCategory,
      date: new Date().toISOString(),
    });
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("food");
    setSheetOpen(false);
    fire();
  };

  if (!profile || !derivedFinancials) return null;

  return (
    <AnimatePage>
      <ConfettiComponent />
      <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
        <FloatingOrbs variant="default" />

        {/* Header */}
        <header className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8 pb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight shimmer-text">Financial Insights</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
                AI analysis of your spending
              </p>
            </div>
            <HoverScale>
              <Button
                size="sm"
                className="btn-3d h-10 px-4 bg-primary rounded-xl font-black uppercase tracking-widest text-[10px]"
                onClick={() => setSheetOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Track
              </Button>
            </HoverScale>
          </div>
        </header>

        <main className="relative z-10 px-4 sm:px-6 space-y-6 pb-24">
          {/* Monthly Summary Card */}
          <HoverScale>
            <Spotlight className="glass-card-3d p-6 glow-teal bg-primary/5 border-primary/20">
              <div className="relative z-10">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-6">
                  Cash Flow Summary
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Income</p>
                      <p className="text-xl font-black text-white tracking-tight">
                        {formatCurrency(totalIncome)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">Total Spent</p>
                      <p className="text-xl font-black text-primary tracking-tight">
                        <AnimatedNumber value={totalSpent} prefix={symbol} />
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">Savings Rate</span>
                      <span className={cn(
                        "text-xl font-black tracking-tighter",
                        savingsRate >= profile.savingsTargetPercentage ? "text-primary shimmer-text" : "text-warning"
                      )}>
                        {savingsRate}%
                      </span>
                    </div>
                    <AnimatedProgress
                      value={Math.min(savingsRate, 100)}
                      color={savingsRate >= profile.savingsTargetPercentage ? "primary" : "warning"}
                      size="md"
                      showGlow={savingsRate >= profile.savingsTargetPercentage}
                    />
                  </div>
                </div>
              </div>
            </Spotlight>
          </HoverScale>

          {/* Transactions List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Recent Transactions
              </h3>
              <span className="text-[10px] font-black text-muted-foreground/40 bg-white/5 px-2 py-0.5 rounded-full">
                {currentMonthExpenses.length} ITEMS
              </span>
            </div>

            {sortedMonthExpenses.length > 0 ? (
              <AnimateList className="space-y-3">
                {sortedMonthExpenses.map((expense) => {
                  const Icon = categoryIconMap[expense.category];
                  const color = categoryColorMap[expense.category];
                  return (
                    <AnimateItem key={expense.id}>
                      <HoverScale>
                        <Spotlight className="glass-card-3d p-4 group" color={`${color}20`}>
                          <div className="flex items-center gap-4 relative z-10">
                            <div
                              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110 shadow-inner"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <Icon className="w-5 h-5" style={{ color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-sm sm:text-base truncate text-white">
                                  {expense.name}
                                </span>
                                <span className="font-black text-sm sm:text-base text-white">
                                  {formatCurrency(expense.amount)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground opacity-60">
                                  {categoryLabels[expense.category]}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-white/10" />
                                <span className="text-[10px] font-bold text-muted-foreground/60 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(expense.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMonthlyExpense(expense.id);
                              }}
                              className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-destructive/20 transition-all border border-white/5"
                            >
                              <X className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </Spotlight>
                      </HoverScale>
                    </AnimateItem>
                  );
                })}
              </AnimateList>
            ) : (
              <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/5">
                  <Plus className="w-6 h-6 text-muted-foreground opacity-40" />
                </div>
                <p className="text-xs font-bold text-muted-foreground/60 mb-6">No variable expenses tracked this month.</p>
                <HoverScale>
                  <Button onClick={() => setSheetOpen(true)} variant="outline" className="rounded-xl border-white/10 font-bold text-xs h-10 px-6">
                    Track Expense
                  </Button>
                </HoverScale>
              </div>
            )}
          </div>

          {/* Fixed Costs Breakdown */}
          {spendingCategories.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
                Fixed Commitments
              </h3>
              <Spotlight className="glass-card-3d p-6 border-white/5" color="hsla(217, 91%, 60%, 0.05)">
                <div className="space-y-6 relative z-10">
                  {spendingCategories.map((category, index) => {
                    const Icon = fixedIconMap[category.category] || MoreHorizontal;
                    const color = category.color;
                    return (
                      <div key={category.id} className="group">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            <Icon className="w-4 h-4" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-white">{category.name}</span>
                              <span className="font-black text-sm text-white">{formatCurrency(category.amount)}</span>
                            </div>
                            <AnimatedProgress
                              value={category.percentage}
                              size="sm"
                              color="primary"
                              className="h-1.5"
                            />
                            <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground/60 mt-1.5">
                              {category.percentage}% OF FIXED BILLS
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Spotlight>
            </div>
          )}

          {/* AI Insights Section */}
          {insights.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1">
                <BrainCircuit className="w-4 h-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Smart Insights
                </h3>
              </div>
              <AnimateList className="space-y-3">
                {insights.map((item, index) => (
                  <AnimateItem key={index}>
                    <Spotlight className="glass-card p-5 border-white/10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full" />
                      <div className="relative z-10">
                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" />
                          {item.category}
                        </p>
                        <p className="text-sm font-bold text-white mb-3 leading-relaxed">
                          {item.insight}
                        </p>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                          <p className="text-xs text-muted-foreground/80 font-medium leading-relaxed">
                            <span className="text-primary font-bold mr-1">Pro Tip:</span>
                            {item.suggestion}
                          </p>
                        </div>
                      </div>
                    </Spotlight>
                  </AnimateItem>
                ))}
              </AnimateList>
            </div>
          )}

          {/* Tracker Modules */}
          <div className="space-y-8 pt-4">
            <SubscriptionTracker />
            <BillReminders />
          </div>
        </main>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="bottom" className="rounded-t-[2.5rem] border-t border-white/10 glass-card-3d h-[85vh] p-8">
            <SheetHeader className="text-left mb-8">
              <SheetTitle className="text-2xl font-black tracking-tight">Track Spending</SheetTitle>
              <SheetDescription className="text-sm font-medium text-muted-foreground">
                Document your variable expenses to refine AI insights.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="expense-name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Name</Label>
                <Input
                  id="expense-name"
                  placeholder="e.g. Weekly Groceries"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="rounded-2xl border-white/5 bg-white/5 h-12 font-bold px-4 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expense-amount" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-black">{symbol}</span>
                  <Input
                    id="expense-amount"
                    type="number"
                    placeholder="0.00"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="rounded-2xl border-white/5 bg-white/5 h-12 font-black text-xl pl-10 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
                <Select
                  value={expenseCategory}
                  onValueChange={(val) => setExpenseCategory(val as VariableExpenseCategory)}
                >
                  <SelectTrigger className="rounded-2xl border-white/5 bg-white/5 h-12 font-bold px-4">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl glass-card-3d">
                    {ALL_CATEGORIES.map((cat) => {
                      const Icon = categoryIconMap[cat];
                      return (
                        <SelectItem key={cat} value={cat} className="rounded-xl">
                          <span className="flex items-center gap-2 font-bold text-xs">
                            <Icon className="w-4 h-4" style={{ color: categoryColorMap[cat] }} />
                            {categoryLabels[cat]}
                          </span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full mt-6 btn-3d bg-primary rounded-2xl h-14 font-black uppercase tracking-[0.2em] text-xs"
                onClick={handleAddExpense}
                disabled={!expenseName.trim() || !expenseAmount || parseFloat(expenseAmount) <= 0}
              >
                Track Expense
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <BottomNav />
      </div>
    </AnimatePage>
  );
}
