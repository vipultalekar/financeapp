"use client";

import { useState } from "react";
import { DollarSign, Wallet, Sparkles, Target, Compass, TrendingUp, Plus, X, Home, Zap, CreditCard, Shield, MoreHorizontal, PiggyBank, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { FinancialVibe, ExpenseItem } from "@/lib/types";
import { vibeDescriptions } from "@/data/mockData";

interface InputsStepProps {
  onNext: (data: {
    name: string;
    monthlyIncome: number;
    fixedExpenses: number;
    expenseBreakdown: ExpenseItem[];
    savingsTargetPercentage: number;
    financialVibe: FinancialVibe;
  }) => void;
  onBack: () => void;
}

const vibeOptions: { value: FinancialVibe; icon: typeof Compass }[] = [
  { value: "control", icon: Target },
  { value: "save", icon: Wallet },
  { value: "invest", icon: TrendingUp },
  { value: "figuring-out", icon: Compass },
];

const expenseCategories: { value: ExpenseItem["category"]; label: string; icon: typeof Home }[] = [
  { value: "rent", label: "Rent/Mortgage", icon: Home },
  { value: "utilities", label: "Utilities", icon: Zap },
  { value: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { value: "insurance", label: "Insurance", icon: Shield },
  { value: "other", label: "Other", icon: MoreHorizontal },
];

type InputSection = "name" | "income" | "expenses" | "savings" | "vibe";

export function InputsStep({ onNext, onBack }: InputsStepProps) {
  const [currentSection, setCurrentSection] = useState<InputSection>("name");
  const [name, setName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [expenseBreakdown, setExpenseBreakdown] = useState<ExpenseItem[]>([
    { id: crypto.randomUUID(), name: "Rent", amount: 0, category: "rent" },
  ]);
  const [savingsTarget, setSavingsTarget] = useState(20);
  const [selectedVibe, setSelectedVibe] = useState<FinancialVibe | null>(null);

  const totalExpenses = expenseBreakdown.reduce((sum, exp) => sum + exp.amount, 0);
  const incomeNum = parseFloat(monthlyIncome) || 0;
  const savingsAmount = Math.round(incomeNum * (savingsTarget / 100));
  const availableAfterSavings = incomeNum - totalExpenses - savingsAmount;

  const addExpense = () => {
    setExpenseBreakdown([
      ...expenseBreakdown,
      { id: crypto.randomUUID(), name: "", amount: 0, category: "other" },
    ]);
  };

  const removeExpense = (id: string) => {
    if (expenseBreakdown.length > 1) {
      setExpenseBreakdown(expenseBreakdown.filter((e) => e.id !== id));
    }
  };

  const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
    setExpenseBreakdown(
      expenseBreakdown.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleSubmit = () => {
    if (name && selectedVibe && incomeNum > 0) {
      onNext({
        name,
        monthlyIncome: incomeNum,
        fixedExpenses: totalExpenses,
        expenseBreakdown,
        savingsTargetPercentage: savingsTarget,
        financialVibe: selectedVibe,
      });
    }
  };

  const sections: InputSection[] = ["name", "income", "expenses", "savings", "vibe"];
  const currentIndex = sections.indexOf(currentSection);
  const progress = ((currentIndex + 1) / sections.length) * 100;

  const canProceed = () => {
    switch (currentSection) {
      case "name":
        return name.trim().length > 0;
      case "income":
        return incomeNum > 0;
      case "expenses":
        return true;
      case "savings":
        return true;
      case "vibe":
        return selectedVibe !== null;
      default:
        return false;
    }
  };

  const goNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < sections.length) {
      setCurrentSection(sections[nextIndex]);
    } else {
      handleSubmit();
    }
  };

  const goPrev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentSection(sections[prevIndex]);
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen px-6 py-8 pb-32 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 -right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Progress bar */}
      <div className="relative z-10 mb-6">
        <div className="h-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Step {currentIndex + 1} of {sections.length}
        </p>
      </div>

      {/* Back button */}
      <button
        onClick={goPrev}
        className="relative z-10 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </button>

      {/* Content */}
      <div className="relative z-10 animate-fade-in">
        {/* Name Section */}
        {currentSection === "name" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                What should I call you?
              </h1>
              <p className="text-muted-foreground">
                Let's make this personal.
              </p>
            </div>

            <div className="glass-card p-6 glow-teal">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="h-14 text-xl bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Income Section */}
        {currentSection === "income" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                What's your monthly income?
              </h1>
              <p className="text-muted-foreground">
                After taxes - the money that actually hits your account.
              </p>
            </div>

            <div className="glass-card p-6 glow-teal">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-primary" />
                <Input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="0"
                  className="h-16 text-4xl font-bold bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/30"
                  autoFocus
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">per month</p>
            </div>

            {incomeNum > 0 && (
              <p className="text-sm text-muted-foreground animate-fade-in">
                That's ${(incomeNum * 12).toLocaleString()} per year
              </p>
            )}
          </div>
        )}

        {/* Expenses Section */}
        {currentSection === "expenses" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                What are your fixed expenses?
              </h1>
              <p className="text-muted-foreground">
                The bills that come every month, no matter what.
              </p>
            </div>

            <div className="space-y-3">
              {expenseBreakdown.map((expense) => (
                <div
                  key={expense.id}
                  className="glass-card p-4 animate-fade-in"
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <select
                      value={expense.category}
                      onChange={(e) =>
                        updateExpense(expense.id, {
                          category: e.target.value as ExpenseItem["category"],
                        })
                      }
                      className="bg-secondary/50 rounded-lg px-3 py-2 text-sm border-none focus:ring-1 focus:ring-primary"
                    >
                      {expenseCategories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>

                    <Input
                      value={expense.name}
                      onChange={(e) =>
                        updateExpense(expense.id, { name: e.target.value })
                      }
                      placeholder="Name (optional)"
                      className="flex-1 min-w-[120px] h-10 bg-transparent border-none focus-visible:ring-0"
                    />

                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        type="number"
                        value={expense.amount || ""}
                        onChange={(e) =>
                          updateExpense(expense.id, {
                            amount: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                        className="w-24 h-10 bg-transparent border-none focus-visible:ring-0 text-right font-medium"
                      />
                    </div>

                    {expenseBreakdown.length > 1 && (
                      <button
                        onClick={() => removeExpense(expense.id)}
                        className="p-2 hover:bg-destructive/20 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addExpense}
                className="w-full border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add expense
              </Button>
            </div>

            <div className="glass-card p-4 bg-primary/5 border-primary/20">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total fixed expenses</span>
                <span className="text-xl font-bold text-primary">
                  ${totalExpenses.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Savings Target Section */}
        {currentSection === "savings" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                How much do you want to save?
              </h1>
              <p className="text-muted-foreground">
                Set a target percentage of your income.
              </p>
            </div>

            <div className="glass-card p-6 glow-purple">
              <div className="flex items-center justify-center gap-2 mb-6">
                <PiggyBank className="w-8 h-8 text-accent" />
                <span className="text-5xl font-bold text-accent">{savingsTarget}%</span>
              </div>

              <Slider
                value={[savingsTarget]}
                onValueChange={(value) => setSavingsTarget(value[0])}
                min={5}
                max={50}
                step={5}
                className="w-full"
              />

              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>5%</span>
                <span>50%</span>
              </div>
            </div>

            {incomeNum > 0 && (
              <div className="space-y-3 animate-fade-in">
                <div className="glass-card p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Monthly savings target</span>
                    <span className="text-lg font-semibold text-accent">
                      ${savingsAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Available for spending</span>
                    <span
                      className={cn(
                        "text-lg font-semibold",
                        availableAfterSavings >= 0 ? "text-success" : "text-destructive"
                      )}
                    >
                      ${availableAfterSavings.toLocaleString()}
                    </span>
                  </div>
                </div>

                {availableAfterSavings < 0 && (
                  <p className="text-sm text-warning">
                    Your expenses + savings target exceed your income. Consider adjusting.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Financial Vibe Section */}
        {currentSection === "vibe" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                What's your financial vibe?
              </h1>
              <p className="text-muted-foreground">
                This helps me personalize your experience.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {vibeOptions.map((option) => {
                const vibe = vibeDescriptions[option.value];
                const Icon = option.icon;
                const isSelected = selectedVibe === option.value;

                return (
                  <button
                    key={option.value}
                    onClick={() => setSelectedVibe(option.value)}
                    className={cn(
                      "glass-card p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
                      isSelected
                        ? "border-primary glow-teal"
                        : "hover:border-border/80"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6 mb-2",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <p className="font-medium text-sm">{vibe.title}</p>
                  </button>
                );
              })}
            </div>

            {selectedVibe && (
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 animate-fade-in">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground/80">
                    {vibeDescriptions[selectedVibe].aiHelp}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-50">
        <Button
          size="lg"
          onClick={goNext}
          disabled={!canProceed()}
          className="w-full py-6 text-lg rounded-2xl font-semibold bg-gradient-to-r from-primary to-primary hover:from-primary/90 hover:to-accent/90 transition-all duration-300"
        >
          {currentSection === "vibe" ? "Get Started" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
