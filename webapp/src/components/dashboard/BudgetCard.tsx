"use client";

import { useState } from "react";
import { Pencil, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AnimatedProgress } from "@/components/ui/AnimatedProgress";
import type { BudgetLimit, SpendingEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface BudgetCardProps {
    budget: BudgetLimit;
    entries: SpendingEntry[];
    onAddExpense: (budgetId: string) => void;
    onViewHistory: (budgetId: string) => void;
}

export function BudgetCard({ budget, entries, onAddExpense, onViewHistory }: BudgetCardProps) {
    const [transform, setTransform] = useState("");
    const { formatCurrency } = useCurrency();

    const remaining = budget.limit - budget.spent;
    const percentageSpent = (budget.spent / budget.limit) * 100;
    const isOverBudget = budget.spent > budget.limit;
    const isNearLimit = percentageSpent >= 80 && !isOverBudget;

    // Get icon component dynamically
    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "utensils":
                return "🍽️";
            case "car":
                return "🚗";
            case "shopping-bag":
                return "🛍️";
            case "gamepad-2":
                return "🎮";
            case "heart-pulse":
                return "❤️";
            case "zap":
                return "⚡";
            default:
                return "💰";
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -3;
        const rotateY = ((x - centerX) / centerX) * 3;

        setTransform(`perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`);
    };

    const handleMouseLeave = () => {
        setTransform("");
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "glass-card-3d p-4 sm:p-5 transition-all duration-200 group cursor-pointer",
                "hover:shadow-lg",
                isOverBudget && "glow-border-red",
                isNearLimit && "glow-border-warning"
            )}
            style={{
                transform: transform || undefined,
                transformStyle: "preserve-3d",
            }}
            onClick={() => onViewHistory(budget.id)}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div
                        className={cn(
                            "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 flex-shrink-0",
                            "group-hover:scale-110"
                        )}
                        style={{ backgroundColor: `${budget.color}20` }}
                    >
                        {getIcon(budget.icon)}
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm sm:text-base text-foreground truncate">
                            {budget.categoryName}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Limit: {formatCurrency(budget.limit)}
                        </p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 hover:bg-primary/10 flex-shrink-0 ml-2"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddExpense(budget.id);
                    }}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            </div>

            {/* Amounts */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Spent</p>
                    <p className={cn(
                        "text-base sm:text-xl font-bold",
                        isOverBudget ? "text-destructive" : "text-foreground"
                    )}>
                        {formatCurrency(budget.spent)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                    <div className="flex items-center gap-1">
                        <p className={cn(
                            "text-base sm:text-xl font-bold",
                            isOverBudget ? "text-destructive" : remaining < budget.limit * 0.2 ? "text-warning" : "text-success"
                        )}>
                            {formatCurrency(Math.abs(remaining))}
                        </p>
                        {isOverBudget ? (
                            <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />
                        ) : remaining < budget.limit * 0.2 ? (
                            <TrendingDown className="w-4 h-4 text-warning flex-shrink-0" />
                        ) : (
                            <TrendingUp className="w-4 h-4 text-success flex-shrink-0" />
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>{Math.round(percentageSpent)}% used</span>
                    <span>{entries.length} {entries.length === 1 ? 'transaction' : 'transactions'}</span>
                </div>
                <AnimatedProgress
                    value={Math.min(percentageSpent, 100)}
                    color={isOverBudget ? "warning" : isNearLimit ? "warning" : "success"}
                    size="md"
                    showGlow={true}
                />
            </div>

            {/* Over budget warning */}
            {isOverBudget && (
                <div className="mt-3 p-2 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-xs text-destructive font-medium">
                        Over budget by {formatCurrency(Math.abs(remaining))}
                    </p>
                </div>
            )}
        </div>
    );
}
