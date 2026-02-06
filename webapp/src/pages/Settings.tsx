"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import { CURRENCIES, type CurrencyCode, type ExpenseItem } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";

export default function Settings() {
  const navigate = useNavigate();
  const { profile, setProfile, updateCurrency, resetProfile } = useUserProfile();
  const { formatCurrency } = useCurrency();

  // Local state for editable form fields
  const [name, setName] = useState(profile?.name ?? "");
  const [monthlyIncome, setMonthlyIncome] = useState(profile?.monthlyIncome ?? 4000);
  const [savingsTarget, setSavingsTarget] = useState(profile?.savingsTargetPercentage ?? 20);
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCategory, setNewExpenseCategory] = useState<ExpenseItem["category"]>("other");

  if (!profile) {
    return null;
  }

  // Always read expenses from profile directly (not local state) to avoid sync bugs
  const expenses = profile.expenseBreakdown;

  const handleSaveName = () => {
    setProfile({ name });
  };

  const handleSaveIncome = () => {
    setProfile({ monthlyIncome });
  };

  const handleSaveSavingsTarget = () => {
    setProfile({ savingsTargetPercentage: savingsTarget });
  };

  const handleCurrencyChange = (value: string) => {
    updateCurrency(value as CurrencyCode);
  };

  const handleAddExpense = () => {
    if (!newExpenseName.trim() || !newExpenseAmount) return;

    const newExpense: ExpenseItem = {
      id: crypto.randomUUID(),
      name: newExpenseName.trim(),
      amount: parseFloat(newExpenseAmount),
      category: newExpenseCategory,
    };

    const updatedExpenses = [...expenses, newExpense];
    setProfile({
      expenseBreakdown: updatedExpenses,
      fixedExpenses: updatedExpenses.reduce((sum, e) => sum + e.amount, 0),
    });

    setNewExpenseName("");
    setNewExpenseAmount("");
    setNewExpenseCategory("other");
  };

  const handleRemoveExpense = (id: string) => {
    const updatedExpenses = expenses.filter((e) => e.id !== id);
    setProfile({
      expenseBreakdown: updatedExpenses,
      fixedExpenses: updatedExpenses.reduce((sum, e) => sum + e.amount, 0),
    });
  };

  const handleResetAll = () => {
    resetProfile();
    navigate("/onboarding");
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingOrbs variant="subtle" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50 px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-1 sm:-ml-2 hover:bg-secondary rounded-xl transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-base sm:text-lg">Settings</h1>
        </div>
      </header>

      <main className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-32">
        {/* Personal Info Section */}
        <section>
          <h2 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4 uppercase tracking-wide">
            Personal Info
          </h2>
          <div className="glass-card-3d p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="name" className="text-xs sm:text-sm">
                Name
              </Label>
              <div className="flex gap-2 mt-1.5 sm:mt-2">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 text-sm sm:text-base"
                />
                <Button
                  onClick={handleSaveName}
                  disabled={name === profile.name}
                  className="text-xs sm:text-sm px-3 sm:px-4"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Currency Section */}
        <section>
          <h2 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4 uppercase tracking-wide">
            Currency
          </h2>
          <div className="glass-card-3d p-4 sm:p-5">
            <Label className="text-xs sm:text-sm mb-1.5 sm:mb-2 block">Preferred Currency</Label>
            <Select value={profile.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-full text-sm">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <span className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{currency.symbol}</span>
                      <span>{currency.name}</span>
                      <span className="text-muted-foreground">({currency.code})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
              All amounts will be displayed in your selected currency.
            </p>
          </div>
        </section>

        {/* Financial Info Section */}
        <section>
          <h2 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4 uppercase tracking-wide">
            Financial Info
          </h2>
          <div className="glass-card-3d p-4 sm:p-5 space-y-5 sm:space-y-6">
            {/* Monthly Income */}
            <div>
              <Label htmlFor="income" className="text-xs sm:text-sm">
                Monthly Income
              </Label>
              <div className="flex gap-2 mt-1.5 sm:mt-2">
                <Input
                  id="income"
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(parseInt(e.target.value) || 0)}
                  placeholder="Your monthly income"
                  className="flex-1 text-sm sm:text-base"
                />
                <Button
                  onClick={handleSaveIncome}
                  disabled={monthlyIncome === profile.monthlyIncome}
                  className="text-xs sm:text-sm px-3 sm:px-4"
                >
                  Save
                </Button>
              </div>
            </div>

            {/* Savings Target */}
            <div>
              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                <Label className="text-xs sm:text-sm">Savings Target</Label>
                <span className="text-base sm:text-lg font-bold text-primary">{savingsTarget}%</span>
              </div>
              <Slider
                value={[savingsTarget]}
                onValueChange={(value) => setSavingsTarget(value[0])}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between mt-1 text-[10px] sm:text-xs text-muted-foreground">
                <span>5%</span>
                <span>50%</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mt-2 sm:mt-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  Target: {formatCurrency(Math.round(monthlyIncome * (savingsTarget / 100)))}/month
                </p>
                <Button
                  size="sm"
                  onClick={handleSaveSavingsTarget}
                  disabled={savingsTarget === profile.savingsTargetPercentage}
                  className="text-xs sm:text-sm w-full sm:w-auto"
                >
                  Save Target
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Expense Management Section */}
        <section>
          <h2 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4 uppercase tracking-wide">
            Fixed Expenses
          </h2>
          <div className="glass-card-3d p-4 sm:p-5 space-y-3 sm:space-y-4">
            {/* Existing Expenses */}
            {expenses.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-2.5 sm:p-3 bg-secondary/50 rounded-xl"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs sm:text-sm truncate">{expense.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">
                        {expense.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                      <p className="font-semibold text-xs sm:text-sm">{formatCurrency(expense.amount)}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleRemoveExpense(expense.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-2 sm:pt-3 border-t border-border/50 flex items-center justify-between">
                  <p className="font-medium text-xs sm:text-sm">Total Fixed Expenses</p>
                  <p className="font-bold text-accent text-xs sm:text-sm">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-muted-foreground text-center py-3 sm:py-4">
                No fixed expenses added yet.
              </p>
            )}

            {/* Add New Expense */}
            <div className="pt-3 sm:pt-4 border-t border-border/50 space-y-2 sm:space-y-3">
              <p className="text-xs sm:text-sm font-medium">Add New Expense</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Input
                  placeholder="Expense name"
                  value={newExpenseName}
                  onChange={(e) => setNewExpenseName(e.target.value)}
                  className="text-sm"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Select
                  value={newExpenseCategory}
                  onValueChange={(value) =>
                    setNewExpenseCategory(value as ExpenseItem["category"])
                  }
                >
                  <SelectTrigger className="flex-1 text-sm">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddExpense}
                  disabled={!newExpenseName.trim() || !newExpenseAmount}
                  className="text-xs sm:text-sm w-full sm:w-auto"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section>
          <h2 className="text-xs sm:text-sm font-medium text-destructive/80 mb-3 sm:mb-4 uppercase tracking-wide flex items-center gap-1.5 sm:gap-2">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Danger Zone
          </h2>
          <div className="glass-card p-4 sm:p-5 border-destructive/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="font-medium text-xs sm:text-sm">Reset All Data</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                  Clear profile, goals, and all saved data. Cannot be undone.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                    Reset
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      data including your profile, goals, and expense breakdown.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleResetAll}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, reset everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
