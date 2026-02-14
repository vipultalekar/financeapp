"use client";

import { useState, useEffect } from "react";
import {
  Shield,
  Plane,
  Car,
  Home,
  GraduationCap,
  Landmark,
  MoreHorizontal,
  Plus,
  TrendingUp,
  Edit,
  Trash2,
  Target,
  CheckCircle2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/navigation/BottomNav";
import { GoalForm } from "@/components/goals/GoalForm";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import type { Goal, GoalCategory } from "@/lib/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";
import { useConfetti } from "@/components/effects/Confetti";
import { AnimatedProgress, AnimatedNumber } from "@/components/ui/AnimatedProgress";

const categoryIcons: Record<GoalCategory, typeof Shield> = {
  "emergency-fund": Shield,
  vacation: Plane,
  car: Car,
  house: Home,
  education: GraduationCap,
  retirement: Landmark,
  other: MoreHorizontal,
};

const categoryColors: Record<GoalCategory, string> = {
  "emergency-fund": "hsl(217, 91%, 60%)",
  vacation: "hsl(217, 91%, 60%)",
  car: "hsl(210, 60%, 55%)",
  house: "hsl(35, 70%, 55%)",
  education: "hsl(320, 45%, 55%)",
  retirement: "hsl(150, 50%, 50%)",
  other: "hsl(220, 15%, 50%)",
};

function GoalCard({
  goal,
  onEdit,
  onDelete,
}: {
  goal: Goal;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const { formatCurrency } = useCurrency();
  const Icon = categoryIcons[goal.category] || MoreHorizontal;
  const color = categoryColors[goal.category] || categoryColors.other;

  const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
  const remaining = goal.targetAmount - goal.currentAmount;

  const deadline = new Date(goal.deadline);
  const now = new Date();
  const monthsUntilDeadline = Math.max(
    0,
    (deadline.getFullYear() - now.getFullYear()) * 12 +
    (deadline.getMonth() - now.getMonth())
  );
  const monthlyNeeded =
    monthsUntilDeadline > 0 ? Math.ceil(remaining / monthsUntilDeadline) : remaining;

  const isOnTrack = remaining <= 0 || (monthsUntilDeadline > 0 && monthlyNeeded <= remaining);
  const isComplete = percentage >= 100;

  return (
    <Spotlight
      className={cn(
        "glass-card-3d p-4 sm:p-5 transition-all duration-300 group",
        isComplete && "border-primary/40 bg-primary/5"
      )}
      color={isComplete ? "hsla(217, 91%, 60%, 0.1)" : "hsla(217, 91%, 60%, 0.05)"}
    >
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base truncate tracking-tight">{goal.name}</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider opacity-60">
              {formatCurrency(goal.currentAmount)} OF {formatCurrency(goal.targetAmount)}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-white/5 rounded-lg"
              onClick={onEdit}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-lg"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between mb-2 text-[11px] font-black uppercase tracking-widest">
            <span className={cn(isComplete ? "text-primary" : "text-muted-foreground")}>
              {percentage}% Complete
            </span>
            <span className="text-white">
              {isComplete ? "GOAL REACHED!" : `${formatCurrency(remaining)} TO GO`}
            </span>
          </div>
          <AnimatedProgress
            value={Math.min(percentage, 100)}
            color={isComplete ? "primary" : "primary"}
            size="md"
            showGlow={isComplete}
          />
        </div>

        {/* Timeline & Meta */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center bg-white/5",
              isComplete && "bg-primary/20"
            )}>
              {isComplete ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <TrendingUp className="w-4 h-4 text-muted-foreground" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground opacity-60">Monthly Target</span>
              <span className="text-xs font-bold text-white">
                {isComplete ? "Success" : monthsUntilDeadline > 0 ? `${formatCurrency(monthlyNeeded)}/mo` : "Overdue"}
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground opacity-60">Target Date</p>
            <p className="text-xs font-bold text-white">
              {new Date(goal.deadline).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </Spotlight>
  );
}

function AddExtraSavings({
  goals,
  addExtraToGoal,
  onSuccess,
}: {
  goals: Goal[];
  addExtraToGoal: (goalId: string, amount: number) => void;
  onSuccess: () => void;
}) {
  const { formatCurrency } = useCurrency();
  const [extraAmount, setExtraAmount] = useState<string>("");
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  if (goals.length === 0) return null;

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);
  const selectedPercentage = selectedGoal
    ? Math.round((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100)
    : 0;
  const selectedRemaining = selectedGoal
    ? Math.max(0, selectedGoal.targetAmount - selectedGoal.currentAmount)
    : 0;

  const parsedAmount = parseFloat(extraAmount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;
  const canAdd = isValidAmount && selectedGoalId !== "";

  const handleAdd = () => {
    if (!canAdd || !selectedGoal) return;
    const effectiveAmount = Math.min(parsedAmount, selectedRemaining);
    addExtraToGoal(selectedGoalId, parsedAmount);
    setSuccessMessage(`Added ${formatCurrency(effectiveAmount)} to "${selectedGoal.name}"`);
    setExtraAmount("");
    onSuccess();
  };

  return (
    <Spotlight className="glass-card-3d p-5 sm:p-6" color="hsla(217, 91%, 60%, 0.1)">
      <div className="relative z-10">
        <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Quick Add
        </h3>
        <p className="text-xs text-muted-foreground/60 font-medium mb-6">
          Add extra savings directly to a specific goal.
        </p>

        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Select Goal</label>
            <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
              <SelectTrigger className="w-full bg-white/5 border-white/5 rounded-xl h-11 text-xs">
                <SelectValue placeholder="Which goal?" />
              </SelectTrigger>
              <SelectContent className="glass-card-3d">
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id} className="text-xs">
                    {goal.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Amount</label>
            <div className="relative">
              <Input
                type="number"
                min={0}
                placeholder="0.00"
                value={extraAmount}
                onChange={(e) => setExtraAmount(e.target.value)}
                className="w-full bg-white/5 border-white/5 rounded-xl h-11 h-12 text-lg font-black tracking-tight pl-4"
              />
            </div>
          </div>

          <HoverScale>
            <Button onClick={handleAdd} disabled={!canAdd} className="w-full btn-3d bg-primary font-black uppercase tracking-widest text-xs h-12">
              Add Savings
            </Button>
          </HoverScale>
        </div>

        {successMessage && (
          <div className="flex items-center gap-2 bg-success/10 text-white rounded-xl p-4 mb-6 border border-success/20 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <p className="text-xs font-bold">{successMessage}</p>
          </div>
        )}

        {selectedGoal && (
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold truncate text-muted-foreground">{selectedGoal.name}</span>
              <span className="text-xs font-black text-white">{selectedPercentage}%</span>
            </div>
            <AnimatedProgress
              value={Math.min(selectedPercentage, 100)}
              size="sm"
              className="mb-3"
            />
            <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter text-muted-foreground opacity-60">
              <span>{formatCurrency(selectedGoal.currentAmount)} SAVED</span>
              <span>{formatCurrency(selectedGoal.targetAmount)} TARGET</span>
            </div>
          </div>
        )}
      </div>
    </Spotlight>
  );
}

export default function Goals() {
  const { profile, addGoal, updateGoal, deleteGoal, addExtraToGoal, derivedFinancials } = useUserProfile();
  const { formatCurrency, symbol } = useCurrency();
  const { fire, ConfettiComponent } = useConfetti();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [deleteConfirmGoal, setDeleteConfirmGoal] = useState<Goal | null>(null);

  if (!profile) return null;

  const goals = profile.goals;
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);

  const handleAddGoal = () => {
    setFormMode("add");
    setEditingGoal(undefined);
    setIsFormOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setFormMode("edit");
    setEditingGoal(goal);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (goalData: Omit<Goal, "id" | "createdAt">) => {
    if (formMode === "add") {
      addGoal(goalData);
      fire();
    } else if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
      fire();
    }
  };

  return (
    <AnimatePage>
      <ConfettiComponent />
      <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
        <FloatingOrbs variant="default" />

        {/* Header */}
        <header className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8 pb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight shimmer-text">Savings Goals</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">
            {goals.length > 0 ? "Track your financial freedom" : "Set your first target"}
          </p>
        </header>

        <main className="relative z-10 px-4 sm:px-6 space-y-6 pb-24">
          {goals.length > 0 ? (
            <>
              {/* Summary */}
              <HoverScale>
                <div className="glass-card-3d p-6 sm:p-8 text-center glow-teal border-primary/20 bg-primary/5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2">
                    Total Funds Saved
                  </p>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 shimmer-text">
                    <AnimatedNumber value={totalSaved} prefix={symbol} />
                  </div>
                  <p className="text-xs font-bold text-muted-foreground/60 mb-6">
                    Out of {formatCurrency(totalTarget)} target
                  </p>
                  {totalTarget > 0 && (
                    <div className="max-w-xs mx-auto space-y-2">
                      <AnimatedProgress
                        value={Math.min((totalSaved / totalTarget) * 100, 100)}
                        size="md"
                        showGlow={true}
                        className="h-2.5"
                      />
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {Math.round((totalSaved / totalTarget) * 100)}% OVERALL PROGRESS
                      </p>
                    </div>
                  )}
                </div>
              </HoverScale>

              {/* Goals List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                    Active Goals ({goals.length})
                  </h3>
                  <HoverScale>
                    <Button
                      onClick={handleAddGoal}
                      variant="ghost"
                      size="sm"
                      className="h-8 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      New Goal
                    </Button>
                  </HoverScale>
                </div>

                <AnimateList className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => (
                    <AnimateItem key={goal.id}>
                      <HoverScale className="h-full">
                        <GoalCard
                          goal={goal}
                          onEdit={() => handleEditGoal(goal)}
                          onDelete={() => setDeleteConfirmGoal(goal)}
                        />
                      </HoverScale>
                    </AnimateItem>
                  ))}
                </AnimateList>
              </div>

              {/* Quick Add */}
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">
                  Add Savings
                </h3>
                <AddExtraSavings goals={goals} addExtraToGoal={addExtraToGoal} onSuccess={fire} />
              </div>

              {/* AI Insight */}
              {derivedFinancials && (
                <div className="glass-card-3d p-6 bg-primary/5 border-primary/20 shadow-xl">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-primary">Smart Analysis</p>
                      <p className="text-sm font-bold leading-relaxed text-foreground">
                        {derivedFinancials.actualSavingsRate >= 20
                          ? `Exceptional! You're saving ${derivedFinancials.actualSavingsRate}% of your income. You're well on your way to hitting all targets ahead of schedule.`
                          : derivedFinancials.actualSavingsRate >= 10
                            ? `Solid progress. At a ${derivedFinancials.actualSavingsRate}% savings rate, you're tracking well, though reaching ${profile.savingsTargetPercentage}% would accelerate your freedom.`
                            : `Your savings rate is ${derivedFinancials.actualSavingsRate}%. We recommend reviewing non-essential spending to give your goals the momentum they deserve.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-state-calm py-20 bg-card/20 rounded-3xl border border-white/5 backdrop-blur-sm text-center">
              <div className="empty-icon w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-primary/5 rounded-full">
                <Target className="w-10 h-10 text-primary animate-gentle-float" />
              </div>
              <h3 className="empty-title text-xl font-black text-white tracking-tight">Start Saving</h3>
              <p className="empty-description text-sm opacity-60 max-w-[280px] mx-auto mb-8 font-medium">
                Set a goal to start saving for what matters.
              </p>
              <HoverScale>
                <Button onClick={handleAddGoal} className="btn-3d px-8 bg-primary font-black uppercase tracking-widest text-xs h-12">
                  Add Goal
                </Button>
              </HoverScale>
            </div>
          )}
        </main>

        <GoalForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleFormSubmit}
          initialData={editingGoal}
          mode={formMode}
        />

        <AlertDialog open={!!deleteConfirmGoal} onOpenChange={(open) => !open && setDeleteConfirmGoal(null)}>
          <AlertDialogContent className="glass-card-3d border-white/10">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-black text-xl tracking-tight">Discard Goal?</AlertDialogTitle>
              <AlertDialogDescription className="font-medium text-muted-foreground">
                This will permanently remove "{deleteConfirmGoal?.name}" and all tracked progress.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel className="font-bold border-white/10">Keep It</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteConfirmGoal) {
                    deleteGoal(deleteConfirmGoal.id);
                    setDeleteConfirmGoal(null);
                  }
                }}
                className="bg-destructive hover:bg-destructive/90 font-bold"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <BottomNav />
      </div>
    </AnimatePage>
  );
}
