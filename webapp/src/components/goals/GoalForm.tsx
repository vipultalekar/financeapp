"use client";

import { useState, useEffect } from "react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { Goal, GoalCategory } from "@/lib/types";
import {
  Shield,
  Plane,
  Car,
  Home,
  GraduationCap,
  Landmark,
  MoreHorizontal,
} from "lucide-react";

interface GoalFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (goal: Omit<Goal, "id" | "createdAt">) => void;
  initialData?: Goal;
  mode: "add" | "edit";
}

const GOAL_CATEGORIES: { value: GoalCategory; label: string; icon: typeof Shield }[] = [
  { value: "emergency-fund", label: "Emergency Fund", icon: Shield },
  { value: "vacation", label: "Vacation", icon: Plane },
  { value: "car", label: "Car", icon: Car },
  { value: "house", label: "House", icon: Home },
  { value: "education", label: "Education", icon: GraduationCap },
  { value: "retirement", label: "Retirement", icon: Landmark },
  { value: "other", label: "Other", icon: MoreHorizontal },
];

export function GoalForm({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode,
}: GoalFormProps) {
  const { symbol } = useCurrency();

  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState<GoalCategory>("other");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when opening or when initialData changes
  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setTargetAmount(initialData.targetAmount.toString());
        setCurrentAmount(initialData.currentAmount.toString());
        setDeadline(initialData.deadline);
        setCategory(initialData.category);
      } else {
        setName("");
        setTargetAmount("");
        setCurrentAmount("0");
        setDeadline("");
        setCategory("other");
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Goal name is required";
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      newErrors.targetAmount = "Target amount must be greater than 0";
    }

    if (currentAmount && parseFloat(currentAmount) < 0) {
      newErrors.currentAmount = "Current amount cannot be negative";
    }

    if (
      currentAmount &&
      targetAmount &&
      parseFloat(currentAmount) > parseFloat(targetAmount)
    ) {
      newErrors.currentAmount = "Current amount cannot exceed target";
    }

    if (!deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate < today) {
        newErrors.deadline = "Deadline must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline,
      category,
    });

    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="text-left">
          <SheetTitle>{mode === "add" ? "Create New Goal" : "Edit Goal"}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? "Set a savings goal to track your progress"
              : "Update your goal details"}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Goal Name */}
          <div className="space-y-2">
            <Label htmlFor="goal-name">Goal Name</Label>
            <Input
              id="goal-name"
              placeholder="e.g., Emergency Fund, Vacation to Japan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name ? (
              <p className="text-xs text-destructive">{errors.name}</p>
            ) : null}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as GoalCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {GOAL_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {cat.label}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Target Amount */}
          <div className="space-y-2">
            <Label htmlFor="target-amount">Target Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {symbol}
              </span>
              <Input
                id="target-amount"
                type="number"
                placeholder="10000"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className={`pl-8 ${errors.targetAmount ? "border-destructive" : ""}`}
              />
            </div>
            {errors.targetAmount ? (
              <p className="text-xs text-destructive">{errors.targetAmount}</p>
            ) : null}
          </div>

          {/* Current Saved */}
          <div className="space-y-2">
            <Label htmlFor="current-amount">Already Saved</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {symbol}
              </span>
              <Input
                id="current-amount"
                type="number"
                placeholder="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                className={`pl-8 ${errors.currentAmount ? "border-destructive" : ""}`}
              />
            </div>
            {errors.currentAmount ? (
              <p className="text-xs text-destructive">{errors.currentAmount}</p>
            ) : null}
          </div>

          {/* Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline">Target Date</Label>
            <Input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={errors.deadline ? "border-destructive" : ""}
            />
            {errors.deadline ? (
              <p className="text-xs text-destructive">{errors.deadline}</p>
            ) : null}
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {mode === "add" ? "Create Goal" : "Save Changes"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
