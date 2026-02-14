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
  Pencil,
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
import type { VariableExpenseCategory, MonthlyExpenseEntry } from "@/lib/types";

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
    updateMonthlyExpense,
  } = useUserProfile();
  const { formatCurrency, symbol } = useCurrency();
  const { fire, ConfettiComponent } = useConfetti();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<VariableExpenseCategory>("food");
  const [editingExpense, setEditingExpense] = useState<MonthlyExpenseEntry | null>(null);

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
  }, [profile, derivedFinancials, fixedExpenses, savingsRate, currentMonthExpenses, variableExpensesTotal, formatCurrency, profile?.monthlyIncome, profile?.savingsTargetPercentage]);

  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (!expenseName.trim() || isNaN(amount) || amount <= 0) return;

    if (editingExpense) {
      updateMonthlyExpense(editingExpense.id, {
        name: expenseName.trim(),
        amount,
        category: expenseCategory,
      });
    } else {
      addMonthlyExpense({
        name: expenseName.trim(),
        amount,
        category: expenseCategory,
        date: new Date().toISOString(),
      });
    }

    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("food");
    setEditingExpense(null);
    setSheetOpen(false);
    fire();
  };

  const handleEditClick = (expense: MonthlyExpenseEntry) => {
    setEditingExpense(expense);
    setExpenseName(expense.name);
    setExpenseAmount(expense.amount.toString());
    setExpenseCategory(expense.category);
    setSheetOpen(true);
  };

  if (!profile || !derivedFinancials) return null;

  return (
    <AnimatePage>
      <ConfettiComponent />
      <div className="min-h-screen bg-[#07090e] pb-nav relative overflow-hidden text-foreground">
        <FloatingOrbs variant="default" />

        {/* Header */}
        <header className="relative z-10 px-6 pt-10 md:pt-12 pb-4 md:pb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter shimmer-text uppercase leading-none">Spending</h1>
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-muted-foreground opacity-40 mt-1 md:mt-2">Your spending overview</p>
          </div>
          <HoverScale>
            <button
              onClick={() => setSheetOpen(true)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary text-white flex items-center justify-center shadow-[0_10px_30px_rgba(37,99,235,0.3)] btn-3d"
            >
              <Plus className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </HoverScale>
        </header>

        <main className="relative z-10 px-6 space-y-12 pb-32">
          {/* Monthly Summary Card */}
          <HoverScale>
            <Spotlight className="glass-card-3d p-6 md:p-8 glow-teal bg-primary/5 border-primary/20">
              <div className="relative z-10">
                <div className="flex items-center gap-2 md:gap-3 mb-6 md:mb-8">
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-primary" />
                  <h3 className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] md:tracking-[0.4em]">
                    Monthly Summary
                  </h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4 md:gap-8">
                    <div>
                      <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 mb-1 md:mb-2">Total Income</p>
                      <p className="text-xl md:text-2xl font-black text-white tracking-tight">
                        {formatCurrency(totalIncome)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40 mb-1 md:mb-2">Total Spent</p>
                      <p className="text-xl md:text-2xl font-black text-primary tracking-tight">
                        <AnimatedNumber value={totalSpent} prefix={symbol} />
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 md:pt-6 border-t border-white/5">
                    <div className="flex items-center justify-between mb-2 md:mb-3">
                      <span className="text-[8px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-40">Savings Rate</span>
                      <span className={cn(
                        "text-xl md:text-2xl font-black tracking-tighter",
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

          {/* Recent Expenses */}
          <section>
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Recent Expenses</h3>
              </div>
              <span className="text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full tracking-widest uppercase">
                {currentMonthExpenses.length} Entries
              </span>
            </div>

            {sortedMonthExpenses.length > 0 ? (
              <AnimateList className="space-y-4">
                {sortedMonthExpenses.map((expense) => {
                  const Icon = categoryIconMap[expense.category];
                  const color = categoryColorMap[expense.category];
                  return (
                    <AnimateItem key={expense.id}>
                      <HoverScale>
                        <Spotlight className="glass-card-3d p-4 md:p-6 group border-white/10 bg-white/[0.02]" color={`${color}20`}>
                          <div className="flex items-center gap-3 md:gap-5 relative z-10">
                            <div
                              className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 group-hover:scale-110 shadow-inner border border-white/5"
                              style={{ backgroundColor: `${color}15` }}
                            >
                              <Icon className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-6" style={{ color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-black text-xs md:text-sm uppercase tracking-tight truncate text-white">
                                  {expense.name}
                                </span>
                                <span className="font-black text-sm md:text-base text-white tabular-nums">
                                  {formatCurrency(expense.amount)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 md:gap-3">
                                <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-muted-foreground/40">
                                  {categoryLabels[expense.category]}
                                </span>
                                <div className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-white/10" />
                                <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground/30 flex items-center gap-1 uppercase tracking-widest">
                                  {new Date(expense.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditClick(expense);
                                }}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-primary/50 text-white"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeMonthlyExpense(expense.id);
                                }}
                                className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center bg-destructive/10 hover:bg-destructive/20 transition-all border border-destructive/20 text-destructive"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </Spotlight>
                      </HoverScale>
                    </AnimateItem>
                  );
                })}
              </AnimateList>
            ) : (
              <div className="text-center py-16 bg-white/[0.02] rounded-[2.5rem] border border-white/5 border-dashed">
                <div className="w-16 h-16 bg-white/5 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-white/5">
                  <Plus className="w-8 h-8 text-muted-foreground opacity-20" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-8 px-8">No expenses tracked this month yet.</p>
                <HoverScale>
                  <Button
                    onClick={() => setSheetOpen(true)}
                    className="rounded-2xl bg-primary font-black uppercase text-[10px] tracking-[0.2em] h-12 px-8 btn-3d"
                  >
                    Track Expense
                  </Button>
                </HoverScale>
              </div>
            )}
          </section>

          {/* Fixed Costs Breakdown */}
          {spendingCategories.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Fixed Costs Breakdown</h3>
              </div>
              <Spotlight className="glass-card-3d p-6 md:p-8 border-white/10 bg-white/[0.02]" color="hsla(217, 91%, 60%, 0.05)">
                <AnimateList className="space-y-6 md:space-y-8 relative z-10">
                  {spendingCategories.map((category) => {
                    const Icon = fixedIconMap[category.category] || MoreHorizontal;
                    const color = category.color;
                    return (
                      <AnimateItem key={category.id} className="group">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div
                            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner border border-white/5"
                            style={{ backgroundColor: `${color}15` }}
                          >
                            <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1.5 md:mb-2 text-white">
                              <span className="font-black text-[10px] md:text-xs uppercase tracking-wider">{category.name}</span>
                              <span className="font-black text-xs md:text-sm tabular-nums">{formatCurrency(category.amount)}</span>
                            </div>
                            <AnimatedProgress
                              value={category.percentage}
                              size="sm"
                              color="primary"
                              className="h-1 md:h-1.5"
                            />
                            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.1em] text-muted-foreground/40 mt-1.5 md:mt-2">
                              {category.percentage}% of fixed costs
                            </p>
                          </div>
                        </div>
                      </AnimateItem>
                    );
                  })}
                </AnimateList>
              </Spotlight>
            </section>
          )}

          {/* Smart Insights */}
          {insights.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-6 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Smart Insights</h3>
              </div>
              <AnimateList className="space-y-4">
                {insights.map((item, index) => (
                  <AnimateItem key={index}>
                    <Spotlight className="glass-card-3d p-6 md:p-8 border-white/10 bg-white/[0.02] relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
                      <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/5 blur-[80px] rounded-full transition-all duration-500 group-hover:bg-primary/10" />
                      <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4 md:mb-6">
                          <div className="w-2 md:w-3 h-px bg-primary" />
                          <p className="text-[8px] md:text-[10px] text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">
                            {item.category}
                          </p>
                        </div>
                        <p className="text-sm md:text-base font-bold text-white mb-4 md:mb-6 leading-relaxed">
                          {item.insight}
                        </p>
                        <div className="bg-white/[0.03] rounded-xl md:rounded-2xl p-3 md:p-4 border border-white/5 backdrop-blur-sm">
                          <p className="text-[10px] md:text-xs text-muted-foreground/80 font-medium leading-relaxed">
                            <span className="text-primary font-black uppercase tracking-widest text-[8px] md:text-[10px] mr-2">Tip:</span>
                            {item.suggestion}
                          </p>
                        </div>
                      </div>
                    </Spotlight>
                  </AnimateItem>
                ))}
              </AnimateList>
            </section>
          )}

          {/* Trackers */}
          <section className="space-y-8 pt-4">
            <div className="flex items-center gap-3 mb-2 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">Trackers</h3>
            </div>
            <SubscriptionTracker />
            <BillReminders />
          </section>
        </main>

        <BottomNav />
      </div>

      {/* Expense Tracking Sheet */}
      <Sheet open={sheetOpen} onOpenChange={(open) => {
        setSheetOpen(open);
        if (!open) {
          setEditingExpense(null);
          setExpenseName("");
          setExpenseAmount("");
          setExpenseCategory("food");
        }
      }}>
        <SheetContent side="bottom" className="rounded-t-[2.5rem] md:rounded-t-[3rem] border-t border-white/10 bg-background/95 backdrop-blur-2xl h-[85vh] p-6 md:p-8 z-[100] overflow-y-auto">
          <SheetHeader className="text-left mb-8 md:mb-10">
            <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Plus className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <SheetTitle className="text-xl md:text-2xl font-black tracking-tight text-white uppercase tabular-nums truncate">
                  {editingExpense ? "Update Expense" : "Add Expense"}
                </SheetTitle>
                <SheetDescription className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60 truncate">
                  {editingExpense ? "Edit your expense details" : "Log a new expense"}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          <div className="space-y-6 md:space-y-8">
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="expense-name" className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/60 ml-1">Expense Name</Label>
              <Input
                id="expense-name"
                placeholder="e.g. Amazon Transaction"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="rounded-xl md:rounded-2xl border-white/10 bg-white/[0.03] h-14 md:h-16 font-bold px-5 md:px-6 focus:ring-primary/20 text-white text-base md:text-lg placeholder:text-muted-foreground/20"
              />
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label htmlFor="expense-amount" className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/60 ml-1">Amount ({symbol})</Label>
              <div className="relative">
                <span className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-primary font-black text-lg md:text-xl">{symbol}</span>
                <Input
                  id="expense-amount"
                  type="number"
                  placeholder="0"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="rounded-xl md:rounded-2xl border-white/10 bg-white/[0.03] h-16 md:h-20 font-black text-3xl md:text-4xl pl-10 md:pl-12 focus:ring-primary/20 text-white tabular-nums placeholder:text-muted-foreground/10"
                />
              </div>
            </div>
            <div className="space-y-2 md:space-y-3">
              <Label className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary/60 ml-1">Category</Label>
              <Select
                value={expenseCategory}
                onValueChange={(val) => setExpenseCategory(val as VariableExpenseCategory)}
              >
                <SelectTrigger className="rounded-xl md:rounded-2xl border-white/10 bg-white/[0.03] h-14 md:h-16 font-black uppercase tracking-widest text-[10px] md:text-xs px-5 md:px-6 text-white transition-all hover:bg-white/[0.05]">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl md:rounded-3xl bg-[#0d1117] border-white/10 p-2">
                  {ALL_CATEGORIES.map((cat) => {
                    const Icon = categoryIconMap[cat];
                    return (
                      <SelectItem key={cat} value={cat} className="rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 focus:bg-primary/20 focus:text-white transition-colors cursor-pointer mb-1 last:mb-0">
                        <span className="flex items-center gap-3 font-black text-[10px] md:text-xs uppercase tracking-widest">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/5">
                            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" style={{ color: categoryColorMap[cat] }} />
                          </div>
                          {categoryLabels[cat]}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <HoverScale>
              <Button
                className="w-full mt-6 md:mt-10 btn-3d bg-primary rounded-[1.5rem] md:rounded-[2rem] h-16 md:h-20 font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-xs md:text-sm text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)]"
                onClick={handleAddExpense}
                disabled={!expenseName.trim() || !expenseAmount || parseFloat(expenseAmount) <= 0}
              >
                {editingExpense ? "Save Changes" : "Add Expense"}
              </Button>
            </HoverScale>
            <div className="flex items-center justify-center gap-2 md:gap-3 py-4 md:py-6 opacity-20">
              <Shield className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Your data stays private & secure</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </AnimatePage>
  );
}
