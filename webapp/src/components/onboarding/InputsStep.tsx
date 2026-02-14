"use client";

import { useState } from "react";
import { IndianRupee, Wallet, Sparkles, Target, Compass, TrendingUp, Plus, X, Home, Zap, CreditCard, Shield, MoreHorizontal, PiggyBank, ChevronLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    { id: crypto.randomUUID(), name: "Primary Residence", amount: 0, category: "rent" },
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
    <div className="min-h-screen relative overflow-hidden flex flex-col bg-[#07090e]">
      <FloatingOrbs variant="subtle" />

      {/* Progress header */}
      <div className="relative z-30 px-4 md:px-6 pt-6 md:pt-10 pb-4 md:pb-6 border-b border-white/5 bg-background/50 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <HoverScale>
            <button
              onClick={goPrev}
              className="group flex items-center gap-2 text-muted-foreground/40 hover:text-primary font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all"
            >
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:border-primary/30 group-hover:bg-primary/5">
                <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              Back
            </button>
          </HoverScale>
          <div className="text-right">
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary shimmer-text">
              Step {currentIndex + 1} of {sections.length}
            </p>
            <p className="text-[8px] md:text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-0.5">
              Getting Started
            </p>
          </div>
        </div>
        <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_rgba(37,99,235,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 px-6 flex-1 overflow-y-auto pb-44">
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
              <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="w-10 h-1 md:w-12 md:h-1 bg-primary rounded-full" />
                  <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter shimmer-text leading-[1.1]">
                    Your Name
                  </h1>
                  <p className="text-muted-foreground/60 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs">
                    What should we call you?
                  </p>
                </div>

                <Spotlight className="glass-card-3d p-6 md:p-10 border-white/10 bg-white/[0.02]" color="hsla(217, 91%, 60%, 0.15)">
                  <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary mb-3 md:mb-4 block">Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="h-14 md:h-20 text-3xl md:text-5xl font-black bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/10 text-white p-0 tracking-tighter"
                    autoFocus
                  />
                  <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest italic">Private & Secure</span>
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary/40 animate-pulse" />
                  </div>
                </Spotlight>
              </div>
            )}

            {/* Income Section */}
            {currentSection === "income" && (
              <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="w-10 h-1 md:w-12 md:h-1 bg-primary rounded-full" />
                  <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter shimmer-text leading-[1.1]">
                    Monthly<br />Income
                  </h1>
                  <p className="text-muted-foreground/60 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs">
                    How much money comes in each month?
                  </p>
                </div>

                <Spotlight className="glass-card-3d p-6 md:p-10 border-white/10 bg-white/[0.02]" color="hsla(217, 91%, 60%, 0.15)">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-[1.5rem] bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
                      <IndianRupee className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary mb-1 block">Monthly Income (INR)</Label>
                      <Input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(e.target.value)}
                        placeholder="0"
                        className="h-12 md:h-20 text-3xl sm:text-6xl md:text-7xl font-black bg-transparent border-none focus-visible:ring-0 placeholder:text-muted-foreground/10 text-white p-0 tracking-tighter"
                        autoFocus
                      />
                    </div>
                  </div>
                </Spotlight>

                {incomeNum > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 xs:grid-cols-2 gap-3 md:gap-4"
                  >
                    <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                      <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-40">Yearly Income</p>
                      <p className="text-lg md:text-xl font-black text-white tracking-tight">
                        ₹{(incomeNum * 12).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2.5rem] bg-primary/5 border border-primary/10 backdrop-blur-sm">
                      <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-1">Daily Average</p>
                      <p className="text-lg md:text-xl font-black text-white tracking-tight">
                        ₹{(incomeNum / 30).toLocaleString(undefined, { maximumFractionDigits: 0 })}/day
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Expenses Section */}
            {currentSection === "expenses" && (
              <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="w-10 h-1 md:w-12 md:h-1 bg-primary rounded-full" />
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter shimmer-text leading-[1.1]">
                    Fixed<br />Expenses
                  </h1>
                  <p className="text-muted-foreground/60 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs">
                    Add your bills, rent, and subscriptions.
                  </p>
                </div>

                <AnimateList className="space-y-3 md:space-y-4">
                  {expenseBreakdown.map((expense) => (
                    <AnimateItem key={expense.id}>
                      <Spotlight className="glass-card-3d p-5 md:p-6 border-white/10 bg-white/[0.02]" color="hsla(217, 91%, 60%, 0.1)">
                        <div className="flex flex-col gap-4 relative z-10">
                          <div className="flex items-center justify-between">
                            <SelectCategory
                              value={expense.category}
                              onChange={(val) => updateExpense(expense.id, { category: val })}
                            />
                            {expenseBreakdown.length > 1 && (
                              <button onClick={() => removeExpense(expense.id)} className="w-8 h-8 flex items-center justify-center hover:bg-destructive/20 rounded-lg transition-all border border-transparent hover:border-destructive/20">
                                <X className="w-4 h-4 text-destructive" />
                              </button>
                            )}
                          </div>

                          <div className="flex items-end gap-3 md:gap-4">
                            <div className="flex-1">
                              <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1 block">Name</Label>
                              <Input
                                value={expense.name}
                                onChange={(e) => updateExpense(expense.id, { name: e.target.value })}
                                placeholder="e.g. Rent"
                                className="h-9 md:h-10 bg-transparent border-none focus-visible:ring-0 font-black text-base md:text-lg text-white p-0"
                              />
                            </div>
                            <div className="w-24 md:w-32">
                              <Label className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 mb-1 block text-right">Amount (INR)</Label>
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-xs md:text-sm font-black text-primary">₹</span>
                                <Input
                                  type="number"
                                  value={expense.amount || ""}
                                  onChange={(e) => updateExpense(expense.id, { amount: parseFloat(e.target.value) || 0 })}
                                  placeholder="0"
                                  className="w-full h-9 md:h-10 bg-transparent border-none focus-visible:ring-0 text-right font-black text-lg md:text-xl text-white p-0"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Spotlight>
                    </AnimateItem>
                  ))}
                </AnimateList>

                <HoverScale>
                  <Button
                    variant="ghost"
                    onClick={addExpense}
                    className="w-full h-12 md:h-14 border-2 border-dashed border-white/10 rounded-xl md:rounded-2xl hover:border-primary/50 hover:bg-primary/5 font-black uppercase tracking-widest text-[9px] md:text-[10px] text-muted-foreground hover:text-primary transition-all"
                  >
                    <Plus className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                    Add fixed expense
                  </Button>
                </HoverScale>

                <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-primary/5 border border-primary/20 shadow-[0_0_30px_rgba(37,99,235,0.1)] text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <p className="text-[9px] md:text-[10px] font-black text-primary uppercase tracking-[0.3em] md:tracking-[0.4em] mb-2 relative z-10">Total Fixed Expenses</p>
                  <p className="text-3xl md:text-4xl font-black text-white tracking-tighter shimmer-text relative z-10 tabular-nums">
                    ₹{totalExpenses.toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Savings Target Section */}
            {currentSection === "savings" && (
              <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="w-10 h-1 md:w-12 md:h-1 bg-primary rounded-full" />
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter shimmer-text leading-[1.1]">
                    Savings<br />Goal
                  </h1>
                  <p className="text-muted-foreground/60 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs">
                    What percentage of your income do you want to save?
                  </p>
                </div>

                <Spotlight className="glass-card-3d p-8 md:p-12 border-white/10 bg-white/[0.02] text-center" color="hsla(262, 80%, 60%, 0.15)">
                  <div className="relative inline-flex mb-8 md:mb-12">
                    <div className="absolute inset-0 bg-primary/20 blur-3xl animate-pulse" />
                    <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-2 border-primary/30 flex flex-col items-center justify-center bg-background/50 backdrop-blur-xl shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                      <span className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-widest mb-1">Target</span>
                      <span className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">{savingsTarget}%</span>
                    </div>
                  </div>

                  <div className="px-2 md:px-4">
                    <Slider
                      value={[savingsTarget]}
                      onValueChange={(value) => setSavingsTarget(value[0])}
                      min={5}
                      max={50}
                      step={5}
                      className="w-full h-8"
                    />
                    <div className="flex justify-between text-[8px] md:text-[10px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-muted-foreground/30 mt-6 overflow-hidden">
                      <span className="flex items-center gap-1.5 whitespace-nowrap"><div className="w-1 h-1 rounded-full bg-muted-foreground/20" /> Cons. 05%</span>
                      <span className="flex items-center gap-1.5 whitespace-nowrap">Aggr. 50% <div className="w-1 h-1 rounded-full bg-primary/40" /></span>
                    </div>
                  </div>
                </Spotlight>

                {incomeNum > 0 && (
                  <div className="grid grid-cols-1 gap-3 md:gap-4">
                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Monthly Savings</p>
                        <p className="text-2xl md:text-3xl font-black text-white tabular-nums">₹{savingsAmount.toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center">
                        <PiggyBank className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                      </div>
                    </div>

                    <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border flex items-center justify-between transition-colors duration-500"
                      style={{
                        backgroundColor: availableAfterSavings >= 0 ? 'hsla(217, 91%, 60%, 0.05)' : 'hsla(0, 91%, 60%, 0.05)',
                        borderColor: availableAfterSavings >= 0 ? 'hsla(217, 91%, 60%, 0.1)' : 'hsla(0, 91%, 60%, 0.1)'
                      }}>
                      <div className="space-y-1">
                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Left to Spend</p>
                        <p className={cn(
                          "text-2xl md:text-3xl font-black tabular-nums",
                          availableAfterSavings >= 0 ? "text-primary" : "text-destructive"
                        )}>₹{availableAfterSavings.toLocaleString()}</p>
                      </div>
                      <div className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center",
                        availableAfterSavings >= 0 ? "bg-primary/10" : "bg-destructive/10"
                      )}>
                        <TrendingUp className={cn("w-5 h-5 md:w-6 md:h-6", availableAfterSavings >= 0 ? "text-primary" : "text-destructive")} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Financial Vibe Section */}
            {currentSection === "vibe" && (
              <div className="space-y-8 md:space-y-12 pt-6 md:pt-8">
                <div className="space-y-3 md:space-y-4">
                  <div className="w-10 h-1 md:w-12 md:h-1 bg-primary rounded-full" />
                  <h1 className="text-2xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter shimmer-text leading-[1.1]">
                    Financial<br />Style
                  </h1>
                  <p className="text-muted-foreground/60 font-bold uppercase tracking-[0.1em] text-[10px] md:text-xs">
                    How do you want to approach your finances?
                  </p>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 md:gap-4">
                  {vibeOptions.map((option) => {
                    const vibe = vibeDescriptions[option.value];
                    const Icon = option.icon;
                    const isSelected = selectedVibe === option.value;

                    return (
                      <HoverScale key={option.value}>
                        <button
                          onClick={() => setSelectedVibe(option.value)}
                          className="w-full text-left"
                        >
                          <Spotlight
                            className={cn(
                              "glass-card-3d p-5 md:p-6 h-full transition-all duration-500 group relative overflow-hidden",
                              isSelected ? "border-primary/50 bg-primary/10 shadow-[0_0_30px_rgba(37,99,235,0.2)]" : "border-white/5 bg-white/[0.02]"
                            )}
                            color={isSelected ? "hsla(217, 91%, 60%, 0.2)" : "hsla(217, 91%, 60%, 0.05)"}
                          >
                            <div className={cn(
                              "w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-all duration-500",
                              isSelected ? "bg-primary text-white scale-110 rotate-3" : "bg-white/5 text-muted-foreground"
                            )}>
                              <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <h3 className="font-black text-[10px] md:text-xs uppercase tracking-[0.1em] md:tracking-[0.2em] text-white mb-1.5 leading-tight">{vibe.title}</h3>
                            <p className="text-[9px] md:text-[10px] font-medium text-muted-foreground/60 leading-relaxed">{vibe.description}</p>

                            {isSelected && (
                              <motion.div
                                layoutId="active-vibe"
                                className="absolute top-2 right-2"
                              >
                                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary animate-pulse" />
                              </motion.div>
                            )}
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
                    className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-primary/5 border border-primary/20 shadow-xl relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-primary/10 blur-[60px] md:blur-[80px] rounded-full" />
                    <div className="flex items-start gap-4 md:gap-5 relative z-10">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/20">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] md:text-[10px] font-black text-primary uppercase tracking-[0.2em] md:tracking-[0.3em]">How I'll Help</p>
                        <p className="text-xs md:text-sm font-bold text-white/90 leading-relaxed">
                          {vibeDescriptions[selectedVibe].aiHelp}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-8 pt-8 md:pt-12 bg-gradient-to-t from-[#07090e] via-[#07090e] to-transparent z-50">
        <HoverScale>
          <Button
            size="lg"
            onClick={goNext}
            disabled={!canProceed()}
            className="w-full h-14 md:h-18 flex items-center justify-center gap-2 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] group bg-primary text-white shadow-[0_15px_40px_rgba(37,99,235,0.25)] btn-3d overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <span className="text-xs md:text-lg relative z-10">
              <span className="md:hidden">Continue</span>
              <span className="hidden md:inline">{currentSection === "vibe" ? "Finish Setup" : "Next Step"}</span>
            </span>
            <ArrowRight className="w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform duration-500" />
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
      className="bg-white/5 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider border border-white/5 focus:ring-2 focus:ring-primary/40 text-muted-foreground hover:text-white transition-colors cursor-pointer appearance-none"
    >
      {expenseCategories.map((cat) => (
        <option key={cat.value} value={cat.value} className="bg-[#07090e] text-white">
          {cat.label}
        </option>
      ))}
    </select>
  );
}
