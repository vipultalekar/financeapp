"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, AlertTriangle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
  const { signOut, user } = useAuth();

  // Local state for editable form fields
  const [name, setName] = useState(profile?.name ?? "");
  const [monthlyIncome, setMonthlyIncome] = useState(profile?.monthlyIncome ?? 0);
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

  const [resetAlertOpen, setResetAlertOpen] = useState(false);

  const handleResetAll = () => {
    resetProfile();
    navigate("/onboarding");
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden text-foreground">
      <FloatingOrbs variant="subtle" />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border/50 px-3 sm:px-4 py-3 sm:py-4">
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

      <main className="relative z-10 px-4 sm:px-6 py-4 sm:py-6 space-y-6 sm:space-y-8 pb-32 max-w-2xl mx-auto">
        {/* Account Section - TOP for visibility */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4 px-1">
            Account
          </h2>
          <div className="glass-card-3d p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <span className="text-sm font-black text-primary">{user?.email?.[0]?.toUpperCase() || '?'}</span>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">
                    Signed in as
                  </p>
                  <p className="font-bold text-sm text-white">{user?.email || 'Not signed in'}</p>
                </div>
              </div>
            </div>
            <Button
              variant="destructive"
              onClick={async () => {
                await signOut();
                navigate('/login');
              }}
              className="w-full h-12 rounded-xl font-black uppercase tracking-widest text-[10px] bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </section>

        {/* Personal Info Section */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4 px-1">
            Personal Info
          </h2>
          <div className="glass-card-3d p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Your Name
              </Label>
              <div className="flex gap-2 mt-1.5 sm:mt-2">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 rounded-xl bg-white/5 border-white/5 h-11 text-sm"
                />
                <Button
                  onClick={handleSaveName}
                  disabled={name === profile.name}
                  className="rounded-xl px-4 font-black uppercase tracking-widest text-[10px] h-11"
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Currency Section */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4 px-1">
            Currency
          </h2>
          <div className="glass-card-3d p-4 sm:p-5">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Choose your currency</Label>
            <Select value={profile.currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-full h-11 rounded-xl bg-white/5 border-white/5 text-sm">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="glass-card-3d">
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code} className="rounded-lg">
                    <span className="flex items-center gap-2 text-xs">
                      <span className="font-black text-primary">{currency.symbol}</span>
                      <span className="font-bold">{currency.name}</span>
                      <span className="text-muted-foreground opacity-60">({currency.code})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[9px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest mt-3">
              All amounts will be shown in your chosen currency
            </p>
          </div>
        </section>

        {/* Financial Info Section */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4 px-1">
            Income & Savings
          </h2>
          <div className="glass-card-3d p-4 sm:p-5 space-y-6 sm:space-y-8">
            {/* Monthly Income */}
            <div>
              <Label htmlFor="income" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Monthly Income
              </Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="income"
                  type="number"
                  value={monthlyIncome || ""}
                  onChange={(e) => setMonthlyIncome(parseInt(e.target.value) || 0)}
                  placeholder="Enter Income"
                  className="flex-1 rounded-xl bg-white/5 border-white/5 h-11 text-sm font-bold"
                />
                <Button
                  onClick={handleSaveIncome}
                  disabled={monthlyIncome === profile.monthlyIncome}
                  className="rounded-xl px-4 font-black uppercase tracking-widest text-[10px] h-11"
                >
                  Update
                </Button>
              </div>
            </div>

            {/* Savings Target */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Savings Goal</Label>
                <span className="text-xl font-black text-primary tracking-tighter">{savingsTarget}%</span>
              </div>
              <div className="px-1">
                <Slider
                  value={[savingsTarget]}
                  onValueChange={(value) => setSavingsTarget(value[0])}
                  min={5}
                  max={50}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-[8px] font-black text-muted-foreground opacity-40">MIN: 5%</span>
                  <span className="text-[8px] font-black text-muted-foreground opacity-40">MAX: 50%</span>
                </div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 space-y-3">
                <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-wider">
                  Your savings target: <span className="text-white">{formatCurrency(Math.round(monthlyIncome * (savingsTarget / 100)))}/month</span>
                </p>
                <Button
                  size="sm"
                  onClick={handleSaveSavingsTarget}
                  disabled={savingsTarget === profile.savingsTargetPercentage}
                  className="w-full font-black uppercase tracking-widest text-[9px] h-10 rounded-xl"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Expense Management Section */}
        <section>
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 sm:mb-4 px-1">
            Fixed Expenses
          </h2>
          <div className="glass-card-3d p-4 sm:p-5 space-y-4">
            {/* Existing Expenses */}
            {expenses.length > 0 && (
              <div className="space-y-2">
                {expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-primary/20 transition-all"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{expense.name}</p>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                        {expense.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <p className="font-black text-xs text-white tracking-tighter">{formatCurrency(expense.amount)}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive/40 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
                        onClick={() => handleRemoveExpense(expense.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between px-1">
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Monthly Fixed</p>
                  <p className="font-black text-sm text-primary tracking-tighter">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            )}

            {/* Add New Expense */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Add New Expense</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase text-muted-foreground/60 ml-1">Name</Label>
                  <Input
                    placeholder="e.g. Server Cost"
                    value={newExpenseName}
                    onChange={(e) => setNewExpenseName(e.target.value)}
                    className="bg-white/5 border-white/5 h-11 rounded-xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[8px] font-black uppercase text-muted-foreground/60 ml-1">Amount</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    className="bg-white/5 border-white/5 h-11 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Select
                  value={newExpenseCategory}
                  onValueChange={(value) =>
                    setNewExpenseCategory(value as ExpenseItem["category"])
                  }
                >
                  <SelectTrigger className="flex-1 h-11 rounded-xl bg-white/5 border-white/5 text-xs font-bold">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="glass-card-3d">
                    <SelectItem value="rent" className="text-xs font-medium">Rent/Housing</SelectItem>
                    <SelectItem value="utilities" className="text-xs font-medium">Utilities/Comms</SelectItem>
                    <SelectItem value="subscriptions" className="text-xs font-medium">Recurring Subs</SelectItem>
                    <SelectItem value="insurance" className="text-xs font-medium">Insurance</SelectItem>
                    <SelectItem value="other" className="text-xs font-medium">Miscellaneous</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddExpense}
                  disabled={!newExpenseName.trim() || !newExpenseAmount}
                  className="px-6 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] btn-3d bg-primary"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </section>


        {/* Danger Zone */}
        <section className="pt-4">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-destructive/60 mb-3 sm:mb-4 px-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </h2>
          <div className="glass-card-3d p-5 border-destructive/20 bg-destructive/5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="font-black text-xs text-white uppercase tracking-tight">Delete All Data</p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 leading-relaxed">
                  Permanently delete all your profile, goals, and spending data. This can't be undone.
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setResetAlertOpen(true)}
                className="font-black uppercase tracking-widest text-[10px] h-11 px-8 rounded-xl bg-destructive hover:bg-destructive/90 shadow-lg shadow-destructive/20"
              >
                Delete All
              </Button>
            </div>
          </div>
        </section>
      </main>

      <AlertDialog open={resetAlertOpen} onOpenChange={setResetAlertOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-white/10 bg-background/95 backdrop-blur-xl p-8 z-[100] w-[90vw] max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl tracking-tight text-white text-center">Delete All Data?</AlertDialogTitle>
            <AlertDialogDescription className="text-center font-medium text-muted-foreground">
              This can't be undone. All your profile, goals, expenses, and budgets will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 mt-6">
            <AlertDialogAction
              onClick={handleResetAll}
              className="w-full h-12 bg-destructive hover:bg-destructive/90 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-lg shadow-destructive/20"
            >
              Yes, Delete Everything
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-12 border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
