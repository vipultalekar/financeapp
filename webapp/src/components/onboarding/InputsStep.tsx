"use client";

import { useState } from "react";
import { DollarSign, Wallet, Sparkles, Target, Compass, TrendingUp, Plus, X, Home, Zap, CreditCard, Shield, MoreHorizontal, PiggyBank, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { FinancialVibe, ExpenseItem } from "@/lib/types";
import { vibeDescriptions } from "@/data/mockData";
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";
import { AnimatedProgress, AnimatedNumber } from "@/components/ui/AnimatedProgress";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { AnimatePresence, motion } from "framer-motion";

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
      case "name": return name.trim().length > 0;
      case "income": return incomeNum > 0;
      case "expenses": return true;
      case "savings": return true;
      case "vibe": return selectedVibe !== null;
      default: return false;
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
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <FloatingOrbs variant="subtle" />

      {/* Progress header */}
      <div className="relative z-20 px-6 pt-10 pb-6">
        <div className="flex items-center justify-between mb-2">
          <HoverScale>
            <button
              onClick={goPrev}
              className="flex items-center gap-2 text-muted-foreground/60 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </HoverScale>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Phase {currentIndex + 1} of {sections.length}
          </p>
        </div>
        <AnimatedProgress value={progress} color="primary" size="sm" showGlow={true} />
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-6 flex-1 overflow-y-auto pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Name Section */}
            {currentSection === "name" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight shimmer-text">
                    What should I call you?
                  </h1>
                  <p className="text-muted-foreground font-medium mt-2">
                    Let's personalize your coaching experience.
                  </p>
                </div>

                <Spotlight className="glass-card-3d p-8 border-white/5" color="hsla(217, 91%, 60%, 0.1)">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="h-14 text-2xl font-black bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/20 text-white p-0"
                    autoFocus
                  />
                </Spotlight>
              </div>
            )}

            {/* Income Section */}
            {currentSection === "income" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight shimmer-text">
                    Monthly Income Breakdown
                  </h1>
                  <p className="text-muted-foreground font-medium mt-2">
                    After-tax income that fuels your life.
                  </p>
                </div>

                <Spotlight className="glass-card-3d p-8 border-white/5" color="hsla(217, 91%, 60%, 0.1)">
                  <div className="flex items-center gap-4">
                    <DollarSign className="w-10 h-10 text-primary shrink-0" />
                    <Input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      placeholder="0"
                      className="h-16 text-5xl font-black bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/20 text-white p-0 tracking-tighter"
                      autoFocus
                    />
                  </div>
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-4 opacity-60">NET MONTHLY REVENUE</p>
                </Spotlight>

                {incomeNum > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-[2rem] bg-white/5 border border-white/5 text-center"
                  >
                    <p className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-widest">ANNUAL EARNINGS</p>
                    <p className="text-2xl font-black text-white tracking-tighter shimmer-text">
                      ${(incomeNum * 12).toLocaleString()}
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Expenses Section */}
            {currentSection === "expenses" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight shimmer-text">
                    Fixed Commitments
                  </h1>
                  <p className="text-muted-foreground font-medium mt-2">
                    Obligations that define your baseline.
                  </p>
                </div>

                <AnimateList className="space-y-4">
                  {expenseBreakdown.map((expense) => (
                    <AnimateItem key={expense.id}>
                      <Spotlight className="glass-card-3d p-4 border-white/5" color="hsla(217, 91%, 60%, 0.05)">
                        <div className="flex items-center gap-4 relative z-10">
                          <SelectCategory
                            value={expense.category}
                            onChange={(val) => updateExpense(expense.id, { category: val })}
                          />
                          <Input
                            value={expense.name}
                            onChange={(e) => updateExpense(expense.id, { name: e.target.value })}
                            placeholder="Expense name"
                            className="flex-1 h-10 bg-transparent border-none focus-visible:ring-0 font-bold text-sm text-white px-2"
                          />
                          <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                            <span className="text-xs font-black text-primary">$</span>
                            <Input
                              type="number"
                              value={expense.amount || ""}
                              onChange={(e) => updateExpense(expense.id, { amount: parseFloat(e.target.value) || 0 })}
                              placeholder="0"
                              className="w-20 h-8 bg-transparent border-none focus-visible:ring-0 text-right font-black text-sm text-white p-0"
                            />
                          </div>
                          {expenseBreakdown.length > 1 && (
                            <button onClick={() => removeExpense(expense.id)} className="p-2 hover:bg-destructive/20 rounded-xl transition-all">
                              <X className="w-4 h-4 text-destructive" />
                            </button>
                          )}
                        </div>
                      </Spotlight>
                    </AnimateItem>
                  ))}
                </AnimateList>

                <HoverScale>
                  <Button
                    variant="ghost"
                    onClick={addExpense}
                    className="w-full h-14 border-2 border-dashed border-white/10 rounded-2xl hover:border-primary/50 hover:bg-primary/5 font-black uppercase tracking-widest text-[10px] text-muted-foreground hover:text-primary transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add fixed expense
                  </Button>
                </HoverScale>

                <div className="glass-card-3d p-6 bg-primary/5 border border-primary/20 shadow-xl text-center">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Total Baseline Debt</p>
                  <p className="text-2xl font-black text-primary tracking-tighter shimmer-text">
                    ${totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Savings Target Section */}
            {currentSection === "savings" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight shimmer-text">
                    Wealth Accelerator
                  </h1>
                  <p className="text-muted-foreground font-medium mt-2">
                    Set a percentage to reclaim your freedom.
                  </p>
                </div>

                <Spotlight className="glass-card-3d p-10 border-white/5 text-center" color="hsla(262, 80%, 60%, 0.1)">
                  <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-full mb-8 glow-teal">
                    <span className="text-6xl font-black text-primary tracking-tighter">{savingsTarget}%</span>
                  </div>

                  <Slider
                    value={[savingsTarget]}
                    onValueChange={(value) => setSavingsTarget(value[0])}
                    min={5}
                    max={50}
                    step={5}
                    className="w-full h-6"
                  />

                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mt-4">
                    <span>Conservative (5%)</span>
                    <span>Aggressive (50%)</span>
                  </div>
                </Spotlight>

                {incomeNum > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="glass-card-3d p-5 bg-white/5 border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">Savings Goal</p>
                      <p className="text-xl font-black text-white">${savingsAmount.toLocaleString()}</p>
                    </div>
                    <div className="glass-card-3d p-5 bg-white/5 border-white/5">
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mb-1">Spending Power</p>
                      <p className={cn(
                        "text-xl font-black",
                        availableAfterSavings >= 0 ? "text-primary" : "text-destructive"
                      )}>${availableAfterSavings.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Financial Vibe Section */}
            {currentSection === "vibe" && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight shimmer-text">
                    The Financial Identity
                  </h1>
                  <p className="text-muted-foreground font-medium mt-2">
                    How do you want to play the game?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {vibeOptions.map((option) => {
                    const vibe = vibeDescriptions[option.value];
                    const Icon = option.icon;
                    const isSelected = selectedVibe === option.value;

                    return (
                      <HoverScale key={option.value}>
                        <button
                          onClick={() => setSelectedVibe(option.value)}
                          className="w-full h-full text-left"
                        >
                          <Spotlight
                            className={cn(
                              "glass-card-3d p-6 h-full transition-all duration-300",
                              isSelected ? "border-primary bg-primary/10 shadow-2xl" : "border-white/5 bg-white/5"
                            )}
                            color={isSelected ? "hsla(217, 91%, 60%, 0.2)" : "hsla(217, 91%, 60%, 0.05)"}
                          >
                            <Icon className={cn("w-8 h-8 mb-4", isSelected ? "text-primary scale-110" : "text-muted-foreground")} />
                            <p className="font-black text-xs uppercase tracking-widest text-white">{vibe.title}</p>
                          </Spotlight>
                        </button>
                      </HoverScale>
                    );
                  })}
                </div>

                {selectedVibe && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-[2.5rem] bg-primary/5 border border-primary/20 shadow-xl"
                  >
                    <div className="flex items-start gap-4">
                      <Sparkles className="w-6 h-6 text-primary shrink-0" />
                      <p className="text-sm font-bold text-white leading-relaxed">
                        {vibeDescriptions[selectedVibe].aiHelp}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-8 pt-12 bg-gradient-to-t from-background via-background to-transparent z-50">
        <HoverScale>
          <Button
            size="lg"
            onClick={goNext}
            disabled={!canProceed()}
            className="w-full h-20 text-xl rounded-[2.5rem] font-black uppercase tracking-[0.2em] group bg-primary text-white shadow-2xl btn-3d"
          >
            {currentSection === "vibe" ? "Finalize Profile" : "Continue"}
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>
        </HoverScale>
      </div>
    </div>
  );
}

function SelectCategory({ value, onChange }: { value: ExpenseItem["category"], onChange: (val: ExpenseItem["category"]) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as ExpenseItem["category"])}
      className="bg-white/5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider border-none focus:ring-2 focus:ring-primary/40 text-muted-foreground hover:text-white transition-colors cursor-pointer"
    >
      {expenseCategories.map((cat) => (
        <option key={cat.value} value={cat.value} className="bg-background text-foreground">
          {cat.label}
        </option>
      ))}
    </select>
  );
}
