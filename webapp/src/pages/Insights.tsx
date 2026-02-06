"use client";

import { useState, useMemo } from "react";
import {
  Home as HomeIcon,
  Zap,
  Tv,
  Shield,
  MoreHorizontal,
  Info,
  Plus,
  X,
  Utensils,
  Car,
  ShoppingBag,
  Gamepad2,
  Heart,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/navigation/BottomNav";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Fixed expense icon map
const fixedIconMap: Record<string, typeof HomeIcon> = {
  rent: HomeIcon,
  utilities: Zap,
  subscriptions: Tv,
  insurance: Shield,
  other: MoreHorizontal,
};

// Variable expense category icon map
const categoryIconMap: Record<VariableExpenseCategory, typeof Utensils> = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  entertainment: Gamepad2,
  health: Heart,
  education: GraduationCap,
  other: MoreHorizontal,
};

// Variable expense category colors
const categoryColorMap: Record<VariableExpenseCategory, string> = {
  food: "hsl(35, 70%, 55%)",
  transport: "hsl(210, 60%, 55%)",
  shopping: "hsl(320, 45%, 55%)",
  entertainment: "hsl(260, 50%, 60%)",
  health: "hsl(0, 50%, 55%)",
  education: "hsl(175, 65%, 50%)",
  other: "hsl(220, 15%, 50%)",
};

// Category display labels
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
  "hsl(175, 65%, 50%)",
  "hsl(260, 50%, 60%)",
  "hsl(210, 60%, 55%)",
  "hsl(35, 70%, 55%)",
  "hsl(320, 45%, 55%)",
  "hsl(220, 15%, 40%)",
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

  // Add expense form state
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState<VariableExpenseCategory>("food");

  // Fixed expenses breakdown
  const spendingCategories = useMemo(() => {
    if (!profile || profile.expenseBreakdown.length === 0) return [];

    const totalExpenses = profile.expenseBreakdown.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    return profile.expenseBreakdown.map((item, index) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      amount: item.amount,
      percentage:
        totalExpenses > 0
          ? Math.round((item.amount / totalExpenses) * 100)
          : 0,
      color: FIXED_COLORS[index % FIXED_COLORS.length],
    }));
  }, [profile]);

  // Variable expenses total
  const variableExpensesTotal = useMemo(() => {
    return currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [currentMonthExpenses]);

  // Sorted expenses (most recent first)
  const sortedMonthExpenses = useMemo(() => {
    return [...currentMonthExpenses].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [currentMonthExpenses]);

  // Monthly summary values
  const totalIncome = profile?.monthlyIncome ?? 0;
  const fixedExpenses = profile?.fixedExpenses ?? 0;
  const totalSpent = fixedExpenses + variableExpensesTotal;
  const amountSaved = Math.max(0, totalIncome - totalSpent);
  const savingsRate =
    totalIncome > 0 ? Math.round((amountSaved / totalIncome) * 100) : 0;

  // Generate insights based on actual data
  const insights = useMemo(() => {
    if (!profile || !derivedFinancials) return [];

    const result: Array<{
      category: string;
      insight: string;
      suggestion: string;
    }> = [];

    // Fixed expenses ratio insight
    const fixedRatio = Math.round(
      (fixedExpenses / profile.monthlyIncome) * 100
    );
    if (fixedRatio > 50) {
      result.push({
        category: "Fixed Expenses",
        insight: `Your fixed expenses are ${fixedRatio}% of your income, which is above the recommended 50%.`,
        suggestion:
          "Consider reviewing subscriptions or negotiating bills to reduce fixed costs.",
      });
    }

    // Savings rate insight
    if (savingsRate < profile.savingsTargetPercentage) {
      result.push({
        category: "Savings",
        insight: `You're saving ${savingsRate}% but targeting ${profile.savingsTargetPercentage}%.`,
        suggestion: `Try to reduce variable spending by ${formatCurrency(
          ((profile.savingsTargetPercentage - savingsRate) *
            profile.monthlyIncome) /
          100
        )} to hit your goal.`,
      });
    } else if (savingsRate > profile.savingsTargetPercentage) {
      result.push({
        category: "Great Progress",
        insight: `You're saving ${savingsRate}% - that's ${savingsRate - profile.savingsTargetPercentage
          }% above your target!`,
        suggestion:
          "Consider putting the extra savings toward your goals or an emergency fund.",
      });
    }

    // Variable spending insights by category
    if (currentMonthExpenses.length > 0) {
      const categoryTotals: Partial<Record<VariableExpenseCategory, number>> =
        {};
      for (const expense of currentMonthExpenses) {
        categoryTotals[expense.category] =
          (categoryTotals[expense.category] ?? 0) + expense.amount;
      }

      // Find highest spending category
      let highestCategory: VariableExpenseCategory | null = null;
      let highestAmount = 0;
      for (const [cat, amount] of Object.entries(categoryTotals)) {
        if (amount > highestAmount) {
          highestAmount = amount;
          highestCategory = cat as VariableExpenseCategory;
        }
      }

      if (highestCategory && variableExpensesTotal > 0) {
        const pct = Math.round(
          (highestAmount / variableExpensesTotal) * 100
        );
        if (pct > 40) {
          result.push({
            category: `${categoryLabels[highestCategory]} Spending`,
            insight: `${categoryLabels[highestCategory]} accounts for ${pct}% of your variable spending this month (${formatCurrency(highestAmount)}).`,
            suggestion:
              "Look for ways to optimize here - meal prep, carpooling, or finding deals.",
          });
        }
      }

      // Total variable vs available budget
      const targetSavings = Math.round(
        profile.monthlyIncome * (profile.savingsTargetPercentage / 100)
      );
      const budget =
        profile.monthlyIncome - profile.fixedExpenses - targetSavings;
      if (variableExpensesTotal > budget && budget > 0) {
        result.push({
          category: "Over Budget",
          insight: `You've spent ${formatCurrency(variableExpensesTotal)} on variable expenses, which is ${formatCurrency(variableExpensesTotal - budget)} over your budget.`,
          suggestion:
            "Try to limit spending for the rest of the month to get back on track.",
        });
      }
    }

    // Expense breakdown insight
    const sortedCategories = [...spendingCategories].sort(
      (a, b) => b.amount - a.amount
    );
    const largestExpense = sortedCategories[0];
    if (largestExpense && largestExpense.percentage > 40) {
      result.push({
        category: largestExpense.name,
        insight: `${largestExpense.name} makes up ${largestExpense.percentage}% of your fixed expenses.`,
        suggestion:
          "This is a significant portion. Make sure you're getting good value here.",
      });
    }

    return result;
  }, [
    profile,
    derivedFinancials,
    fixedExpenses,
    savingsRate,
    spendingCategories,
    currentMonthExpenses,
    variableExpensesTotal,
    formatCurrency,
  ]);

  // Handle add expense form submit
  const handleAddExpense = () => {
    const amount = parseFloat(expenseAmount);
    if (!expenseName.trim() || isNaN(amount) || amount <= 0) return;

    addMonthlyExpense({
      name: expenseName.trim(),
      amount,
      category: expenseCategory,
      date: new Date().toISOString(),
    });

    // Reset form
    setExpenseName("");
    setExpenseAmount("");
    setExpenseCategory("food");
    setSheetOpen(false);
  };

  // Format date for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  if (!profile || !derivedFinancials) {
    return null;
  }

  const hasFixedExpenses = spendingCategories.length > 0;

  return (
    <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
      <FloatingOrbs variant="subtle" />

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">Spending Insights</h1>
            <p className="text-xs sm:text-sm text-muted-foreground truncate">
              Where your money goes this month
            </p>
          </div>
          <Button
            size="sm"
            className="gap-1 sm:gap-1.5 text-xs sm:text-sm shrink-0"
            onClick={() => setSheetOpen(true)}
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Add</span> Expense
          </Button>
        </div>
      </header>

      {/* Add Expense Sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader className="text-left">
            <SheetTitle>Add Variable Expense</SheetTitle>
            <SheetDescription>
              Track a new expense for this month.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="expense-name">Name</Label>
              <Input
                id="expense-name"
                placeholder="e.g. Lunch, Uber ride, Netflix"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expense-amount">Amount ({symbol})</Label>
              <Input
                id="expense-amount"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={expenseCategory}
                onValueChange={(val) =>
                  setExpenseCategory(val as VariableExpenseCategory)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {ALL_CATEGORIES.map((cat) => {
                    const Icon = categoryIconMap[cat];
                    return (
                      <SelectItem key={cat} value={cat}>
                        <span className="flex items-center gap-2">
                          <Icon
                            className="w-4 h-4"
                            style={{ color: categoryColorMap[cat] }}
                          />
                          {categoryLabels[cat]}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full mt-2"
              onClick={handleAddExpense}
              disabled={
                !expenseName.trim() ||
                !expenseAmount ||
                parseFloat(expenseAmount) <= 0
              }
            >
              Add Expense
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <main className="relative z-10 px-4 sm:px-6 space-y-4 sm:space-y-6">
        {/* Monthly Summary Card */}
        <div className="glass-card-3d p-4 sm:p-6 glow-teal">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">
            Monthly Summary
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Total Income</span>
              <span className="font-semibold text-success text-sm sm:text-base">
                {formatCurrency(totalIncome)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Fixed Expenses</span>
              <span className="font-semibold text-sm sm:text-base">
                {formatCurrency(fixedExpenses)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Variable Expenses</span>
              <span className="font-semibold text-sm sm:text-base">
                {formatCurrency(variableExpensesTotal)}
              </span>
            </div>
            <div className="h-px bg-border/50" />
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Total Spent</span>
              <span className="font-semibold text-accent text-sm sm:text-base">
                {formatCurrency(totalSpent)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-muted-foreground">Amount Saved</span>
              <span className="font-semibold text-primary text-sm sm:text-base">
                {formatCurrency(amountSaved)}
              </span>
            </div>
            <div className="pt-2 sm:pt-3 border-t border-border/50 flex items-center justify-between">
              <span className="font-medium text-xs sm:text-sm">Savings Rate</span>
              <span
                className={cn(
                  "font-bold text-base sm:text-lg",
                  savingsRate >= profile.savingsTargetPercentage
                    ? "text-success"
                    : "text-warning"
                )}
              >
                {savingsRate}%
              </span>
            </div>
          </div>
        </div>

        {/* This Month's Variable Expenses */}
        <div className="glass-card-3d p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
              This Month's Expenses
            </h3>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {currentMonthExpenses.length} item
              {currentMonthExpenses.length !== 1 ? "s" : ""}
            </span>
          </div>
          {sortedMonthExpenses.length > 0 ? (
            <div className="space-y-2 sm:space-y-3">
              {sortedMonthExpenses.map((expense) => {
                const Icon = categoryIconMap[expense.category];
                const color = categoryColorMap[expense.category];
                return (
                  <div
                    key={expense.id}
                    className="flex items-center gap-2 sm:gap-3 group"
                  >
                    <div
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        style={{ color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-xs sm:text-sm truncate">
                          {expense.name}
                        </span>
                        <span className="font-semibold text-xs sm:text-sm ml-2 shrink-0">
                          {formatCurrency(expense.amount)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
                        <span
                          className="text-[10px] sm:text-xs font-medium"
                          style={{ color }}
                        >
                          {categoryLabels[expense.category]}
                        </span>
                        <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-0.5 sm:gap-1">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {formatDate(expense.date)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeMonthlyExpense(expense.id)}
                      className="p-1 sm:p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all shrink-0"
                      aria-label={`Delete ${expense.name}`}
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6">
              <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-1.5 sm:mb-2 opacity-50" />
              <p className="text-xs sm:text-sm text-muted-foreground">
                No expenses tracked yet this month.
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1.5 sm:mt-2 text-xs sm:text-sm"
                onClick={() => setSheetOpen(true)}
              >
                Add your first expense
              </Button>
            </div>
          )}
        </div>

        {/* Fixed Expenses Breakdown */}
        {hasFixedExpenses ? (
          <div className="glass-card-3d p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">
              Fixed Expenses Breakdown
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {spendingCategories.map((category, index) => {
                const Icon =
                  fixedIconMap[category.category] || MoreHorizontal;
                return (
                  <div key={category.id}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                      <div
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: `${FIXED_COLORS[index % FIXED_COLORS.length]}20`,
                        }}
                      >
                        <Icon
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                          style={{
                            color: FIXED_COLORS[index % FIXED_COLORS.length],
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-xs sm:text-sm truncate">
                            {category.name}
                          </span>
                          <span className="font-semibold text-xs sm:text-sm">
                            {formatCurrency(category.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor:
                            FIXED_COLORS[index % FIXED_COLORS.length],
                        }}
                      />
                    </div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                      {category.percentage}% of fixed expenses
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="glass-card-3d p-4 sm:p-6 text-center">
            <Info className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground mx-auto mb-2 sm:mb-3" />
            <h3 className="font-medium text-sm sm:text-base mb-1.5 sm:mb-2">No expense breakdown yet</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Add your fixed expenses in Settings to see a detailed breakdown
              here.
            </p>
          </div>
        )}

        {/* Insights */}
        {insights.length > 0 ? (
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
              Insights
            </h3>
            <div className="space-y-2 sm:space-y-3">
              {insights.map((item, index) => (
                <div key={index} className="glass-card p-4 sm:p-5">
                  <p className="text-[10px] sm:text-xs text-accent font-medium uppercase tracking-wide mb-1.5 sm:mb-2">
                    {item.category}
                  </p>
                  <p className="text-xs sm:text-sm text-foreground mb-1.5 sm:mb-2">
                    {item.insight}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {item.suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Subscription Tracker */}
        <div className="glass-card-3d p-4 sm:p-6">
          <SubscriptionTracker />
        </div>

        {/* Bill Reminders */}
        <div className="glass-card-3d p-4 sm:p-6">
          <BillReminders />
        </div>

        {/* First Month Message */}
        {!hasFixedExpenses && currentMonthExpenses.length === 0 ? (
          <div className="glass-card p-4 sm:p-5 bg-primary/5 border-primary/20">
            <p className="text-xs sm:text-sm">
              <span className="font-semibold text-primary">Welcome!</span>{" "}
              This is your first month using the app. Add your fixed expenses
              in Settings and track your variable expenses here to get detailed
              spending insights and personalized tips.
            </p>
          </div>
        ) : null}
      </main>

      <BottomNav />
    </div>
  );
}
