"use client";

import { Plus, MoreVertical, Pencil, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AnimatedProgress } from "@/components/ui/AnimatedProgress";
import type { BudgetLimit, SpendingEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spotlight } from "@/components/effects/Spotlight";

interface BudgetCardProps {
    budget: BudgetLimit;
    entries: SpendingEntry[];
    onAddExpense: (budgetId: string) => void;
    onViewHistory: (budgetId: string) => void;
    onEditCategory: (budget: BudgetLimit) => void;
    onDeleteCategory: (budgetId: string) => void;
}

export function BudgetCard({ budget, entries, onAddExpense, onViewHistory, onEditCategory, onDeleteCategory }: BudgetCardProps) {
    const { formatCurrency } = useCurrency();

    const remaining = budget.limit - budget.spent;
    const percentageSpent = (budget.spent / budget.limit) * 100;
    const isOverBudget = budget.spent > budget.limit;
    const isNearLimit = percentageSpent >= 80 && !isOverBudget;

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case "utensils": return "🍽️";
            case "car": return "🚗";
            case "shopping-bag": return "🛍️";
            case "gamepad-2": return "🎮";
            case "heart-pulse": return "❤️";
            case "zap": return "⚡";
            default: return "💰";
        }
    };

    return (
        <Spotlight
            className={cn(
                "glass-card-3d p-4 sm:p-5 transition-all duration-300 group cursor-pointer h-full",
                "hover:shadow-2xl",
                isOverBudget && "border-destructive/30",
                isNearLimit && "border-warning/30"
            )}
            color={isOverBudget ? "hsla(0, 84%, 60%, 0.1)" : isNearLimit ? "hsla(35, 91%, 60%, 0.1)" : "hsla(217, 91%, 60%, 0.1)"}
        >
            <div onClick={() => onViewHistory(budget.id)} className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                            className={cn(
                                "w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 flex-shrink-0 group-hover:scale-110 group-hover:rotate-3",
                            )}
                            style={{ backgroundColor: `${budget.color}20` }}
                        >
                            {getIcon(budget.icon)}
                        </div>
                        <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-sm sm:text-base text-foreground truncate tracking-tight">
                                {budget.categoryName}
                            </h3>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                {formatCurrency(budget.limit)} limit
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 ml-2 relative z-20">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-primary/10 rounded-lg transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAddExpense(budget.id);
                            }}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-primary/10 rounded-lg">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-card-3d min-w-[140px] z-50">
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditCategory(budget);
                                    }}
                                    className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    <span>Edit Category</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteCategory(budget.id);
                                    }}
                                    className="flex items-center gap-2 text-destructive focus:text-destructive font-bold text-xs uppercase tracking-wider"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Amounts */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">Spent</p>
                        <p className={cn(
                            "text-lg sm:text-xl font-black tracking-tighter shimmer-text",
                            isOverBudget ? "text-destructive" : "text-foreground"
                        )}>
                            {formatCurrency(budget.spent)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-1">Left</p>
                        <div className="flex items-center gap-1">
                            <p className={cn(
                                "text-lg sm:text-xl font-black tracking-tighter",
                                isOverBudget ? "text-destructive" : remaining < budget.limit * 0.2 ? "text-warning" : "text-white"
                            )}>
                                {formatCurrency(Math.abs(remaining))}
                            </p>
                            {isOverBudget && <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />}
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <span className={cn(isOverBudget ? "text-destructive" : isNearLimit ? "text-warning" : "text-primary")}>
                            {Math.round(percentageSpent)}% USED
                        </span>
                        <span className="opacity-60">{entries.length} items</span>
                    </div>
                    <AnimatedProgress
                        value={Math.min(percentageSpent, 100)}
                        color={isOverBudget ? "warning" : isNearLimit ? "warning" : "primary"}
                        size="md"
                        showGlow={true}
                    />
                </div>

                {/* Over budget warning */}
                {isOverBudget && (
                    <div className="mt-4 p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 animate-pulse">
                        <p className="text-[10px] text-destructive font-black uppercase tracking-widest text-center">
                            Over budget by {formatCurrency(Math.abs(remaining))}
                        </p>
                    </div>
                )}
            </div>
        </Spotlight>
    );
}
