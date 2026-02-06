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
  "emergency-fund": "hsl(175, 65%, 50%)",
  vacation: "hsl(260, 50%, 60%)",
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

  // Calculate months to goal (assuming equal monthly contributions)
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
    <div className="glass-card-3d p-4 sm:p-5 card-3d-hover">
      {/* Header */}
      <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm sm:text-base truncate">{goal.name}</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {formatCurrency(goal.currentAmount)} of {formatCurrency(goal.targetAmount)}
          </p>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8"
            onClick={onEdit}
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 sm:h-8 sm:w-8 text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-3 sm:mb-4">
        <Progress value={Math.min(percentage, 100)} className="h-2 sm:h-3" />
        <div className="flex justify-between mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-muted-foreground">
          <span>{percentage}% complete</span>
          <span>
            {isComplete ? "Goal reached!" : `${formatCurrency(remaining)} to go`}
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex items-center justify-between text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary shrink-0" />
          <span className="truncate">
            {isComplete ? (
              <span className="text-success font-medium">Completed!</span>
            ) : monthsUntilDeadline > 0 ? (
              <>
                <span className="font-semibold text-primary">
                  {formatCurrency(monthlyNeeded)}/mo
                </span>{" "}
                <span className="hidden xs:inline">needed</span>
              </>
            ) : (
              <span className="text-warning font-medium">Deadline passed</span>
            )}
          </span>
        </div>
        <span
          className={cn(
            "text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full shrink-0",
            isComplete
              ? "bg-success/20 text-success"
              : isOnTrack
              ? "bg-primary/20 text-primary"
              : "bg-warning/20 text-warning"
          )}
        >
          {isComplete
            ? "Done"
            : monthsUntilDeadline > 0
            ? `${monthsUntilDeadline}mo left`
            : "Overdue"}
        </span>
      </div>

      {/* Deadline */}
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border/50">
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          Target date:{" "}
          {new Date(goal.deadline).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

function AddExtraSavings({
  goals,
  addExtraToGoal,
}: {
  goals: Goal[];
  addExtraToGoal: (goalId: string, amount: number) => void;
}) {
  const { formatCurrency } = useCurrency();
  const [extraAmount, setExtraAmount] = useState<string>("");
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [successMessage]);

  if (goals.length === 0) {
    return null;
  }

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
    setSuccessMessage(
      `Added ${formatCurrency(effectiveAmount)} to "${selectedGoal.name}"`
    );
    setExtraAmount("");
  };

  return (
    <div className="glass-card-3d p-4 sm:p-5">
      <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">Add Extra Savings</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
        Boost a goal by adding extra savings directly.
      </p>

      {/* Goal selector */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        <Select value={selectedGoalId} onValueChange={setSelectedGoalId}>
          <SelectTrigger className="w-full text-sm">
            <SelectValue placeholder="Select a goal" />
          </SelectTrigger>
          <SelectContent>
            {goals.map((goal) => (
              <SelectItem key={goal.id} value={goal.id}>
                {goal.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Amount input */}
        <Input
          type="number"
          min={0}
          step={1}
          placeholder="Extra amount to add"
          value={extraAmount}
          onChange={(e) => setExtraAmount(e.target.value)}
          className="w-full text-sm"
        />

        <Button onClick={handleAdd} disabled={!canAdd} className="w-full text-xs sm:text-sm">
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          Add to Goal
        </Button>
      </div>

      {/* Success message */}
      {successMessage ? (
        <div className="flex items-center gap-1.5 sm:gap-2 bg-success/10 text-success rounded-lg p-2.5 sm:p-3 mb-3 sm:mb-4">
          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          <p className="text-xs sm:text-sm font-medium">{successMessage}</p>
        </div>
      ) : null}

      {/* Selected goal progress */}
      {selectedGoal ? (
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <div className="flex justify-between items-center mb-1.5 sm:mb-2">
            <span className="text-xs sm:text-sm font-medium truncate">{selectedGoal.name}</span>
            <span className="text-xs sm:text-sm text-muted-foreground shrink-0 ml-2">
              {selectedPercentage}%
            </span>
          </div>
          <Progress
            value={Math.min(selectedPercentage, 100)}
            className="h-1.5 sm:h-2 mb-1.5 sm:mb-2"
          />
          <div className="flex justify-between text-[10px] sm:text-xs text-muted-foreground">
            <span>{formatCurrency(selectedGoal.currentAmount)} saved</span>
            <span>{formatCurrency(selectedGoal.targetAmount)} target</span>
          </div>
          {selectedRemaining > 0 ? (
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2">
              {formatCurrency(selectedRemaining)} remaining to reach this goal
            </p>
          ) : (
            <p className="text-[10px] sm:text-xs text-success font-medium mt-1.5 sm:mt-2">
              This goal has been reached!
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

function EmptyState({ onAddGoal }: { onAddGoal: () => void }) {
  return (
    <div className="glass-card-3d p-6 sm:p-8 text-center">
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
        <Target className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
      </div>
      <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2">No goals yet</h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-xs mx-auto">
        Set your first savings goal to start tracking your progress toward the things
        that matter to you.
      </p>
      <Button onClick={onAddGoal} className="text-xs sm:text-sm">
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
        Create Your First Goal
      </Button>
    </div>
  );
}

export default function Goals() {
  const { profile, addGoal, updateGoal, deleteGoal, addExtraToGoal, derivedFinancials } = useUserProfile();
  const { formatCurrency } = useCurrency();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [editingGoal, setEditingGoal] = useState<Goal | undefined>(undefined);
  const [deleteConfirmGoal, setDeleteConfirmGoal] = useState<Goal | null>(null);

  if (!profile) {
    return null;
  }

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
    } else if (editingGoal) {
      updateGoal(editingGoal.id, goalData);
    }
  };

  const handleDeleteGoal = (goal: Goal) => {
    setDeleteConfirmGoal(goal);
  };

  const confirmDelete = () => {
    if (deleteConfirmGoal) {
      deleteGoal(deleteConfirmGoal.id);
      setDeleteConfirmGoal(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
      <FloatingOrbs variant="subtle" />

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8 pb-3 sm:pb-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">Savings Goals</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {goals.length > 0
            ? "Track progress and adjust your plan"
            : "Set goals to track your savings"}
        </p>
      </header>

      <main className="relative z-10 px-4 sm:px-6 space-y-4 sm:space-y-6">
        {goals.length > 0 ? (
          <>
            {/* Summary */}
            <div className="glass-card-3d p-4 sm:p-6 text-center glow-teal">
              <p className="text-xs sm:text-sm text-muted-foreground mb-0.5 sm:mb-1">
                Total Saved Across Goals
              </p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                {formatCurrency(totalSaved)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                of {formatCurrency(totalTarget)} target
              </p>
              {totalTarget > 0 && (
                <div className="mt-3 sm:mt-4">
                  <Progress
                    value={Math.min((totalSaved / totalTarget) * 100, 100)}
                    className="h-1.5 sm:h-2"
                  />
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                    {Math.round((totalSaved / totalTarget) * 100)}% overall progress
                  </p>
                </div>
              )}
            </div>

            {/* Goals */}
            <div>
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Your Goals ({goals.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary/80 text-xs sm:text-sm"
                  onClick={handleAddGoal}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                  Add Goal
                </Button>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {goals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={() => handleEditGoal(goal)}
                    onDelete={() => handleDeleteGoal(goal)}
                  />
                ))}
              </div>
            </div>

            {/* Add Extra Savings */}
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
                Add Extra Savings
              </h3>
              <AddExtraSavings goals={goals} addExtraToGoal={addExtraToGoal} />
            </div>

            {/* AI tip based on real data */}
            {derivedFinancials && (
              <div className="glass-card p-4 sm:p-5 bg-primary/5 border-primary/20">
                <p className="text-xs sm:text-sm">
                  <span className="font-semibold text-primary">Tip:</span>{" "}
                  {derivedFinancials.actualSavingsRate >= 20
                    ? `You're saving ${derivedFinancials.actualSavingsRate}% of your income this month - excellent! Keep this up and you'll reach your goals faster than planned.`
                    : derivedFinancials.actualSavingsRate >= 10
                    ? `You're saving ${derivedFinancials.actualSavingsRate}% of your income. Try to hit ${profile.savingsTargetPercentage}% to stay on track with your goals.`
                    : `Your savings rate is ${derivedFinancials.actualSavingsRate}% this month. Consider reviewing your expenses to find ways to save more toward your goals.`}
                </p>
              </div>
            )}
          </>
        ) : (
          <EmptyState onAddGoal={handleAddGoal} />
        )}
      </main>

      {/* Goal Form Sheet */}
      <GoalForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingGoal}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteConfirmGoal}
        onOpenChange={(open) => !open && setDeleteConfirmGoal(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirmGoal?.name}"? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
}
