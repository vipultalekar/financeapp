"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wallet, ArrowLeft, Edit2, Shield, TrendingUp, Zap } from "lucide-react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { BudgetCard } from "@/components/dashboard/BudgetCard";
import { AddExpenseDialog } from "@/components/dashboard/AddExpenseDialog";
import { AddCategoryDialog } from "@/components/dashboard/AddCategoryDialog";
import { SpendingHistory } from "@/components/dashboard/SpendingHistory";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AnimatedProgress, AnimatedNumber } from "@/components/ui/AnimatedProgress";
import type { BudgetLimit, SpendingEntry, BudgetCategory } from "@/lib/types";
import { budgetLimits as mockBudgetLimits, spendingEntries as mockSpendingEntries } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { useConfetti } from "@/components/effects/Confetti";
import { Spotlight } from "@/components/effects/Spotlight";

export default function MoneyTracker() {
    const navigate = useNavigate();
    const { formatCurrency, symbol } = useCurrency();
    const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
    const [entries, setEntries] = useState<SpendingEntry[]>([]);
    const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
    const [editingEntry, setEditingEntry] = useState<SpendingEntry | undefined>(undefined);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);
    const [editingBudget, setEditingBudget] = useState<BudgetLimit | null>(null);
    const [totalBudgetGoal, setTotalBudgetGoal] = useState<number>(0);
    const [showSetTotalGoalDialog, setShowSetTotalGoalDialog] = useState(false);
    const [tempGoal, setTempGoal] = useState("");
    const { fire, ConfettiComponent } = useConfetti();

    // Load data from localStorage or use mock data
    useEffect(() => {
        const savedBudgets = localStorage.getItem("budgetLimits");
        const savedEntries = localStorage.getItem("spendingEntries");

        if (savedBudgets) {
            setBudgets(JSON.parse(savedBudgets));
        }

        if (savedEntries) {
            setEntries(JSON.parse(savedEntries));
        }

        const savedGoal = localStorage.getItem("totalBudgetGoal");
        if (savedGoal) {
            setTotalBudgetGoal(parseFloat(savedGoal));
        }
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        if (budgets.length > 0) {
            localStorage.setItem("budgetLimits", JSON.stringify(budgets));
        }
    }, [budgets]);

    useEffect(() => {
        if (entries.length > 0) {
            localStorage.setItem("spendingEntries", JSON.stringify(entries));
        }
    }, [entries]);

    useEffect(() => {
        if (totalBudgetGoal > 0) {
            localStorage.setItem("totalBudgetGoal", totalBudgetGoal.toString());
        }
    }, [totalBudgetGoal]);

    // Calculate totals
    const sumOfCategoryLimits = budgets.reduce((sum, b) => sum + b.limit, 0);
    const totalLimit = totalBudgetGoal > 0 ? totalBudgetGoal : sumOfCategoryLimits;
    const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
    const totalRemaining = totalLimit - totalSpent;
    const percentageSpent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

    const handleAddExpense = (budgetId: string) => {
        setSelectedBudgetId(budgetId);
        setEditingEntry(undefined);
        setShowAddDialog(true);
    };

    const handleViewHistory = (budgetId: string) => {
        setSelectedBudgetId(budgetId);
        setShowHistoryDialog(true);
    };

    const handleSaveExpense = (newEntry: Omit<SpendingEntry, "id" | "createdAt">) => {
        if (editingEntry) {
            const updatedEntries = entries.map((e) =>
                e.id === editingEntry.id
                    ? { ...e, ...newEntry }
                    : e
            );
            setEntries(updatedEntries);
            recalculateBudgetSpent(updatedEntries);
        } else {
            const entry: SpendingEntry = {
                ...newEntry,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };
            const updatedEntries = [...entries, entry];
            setEntries(updatedEntries);
            recalculateBudgetSpent(updatedEntries);
        }
    };

    const handleEditEntry = (entry: SpendingEntry) => {
        setEditingEntry(entry);
        setSelectedBudgetId(entry.budgetId);
        setShowHistoryDialog(false);
        setShowAddDialog(true);
    };

    const handleDeleteEntry = (entryId: string) => {
        const updatedEntries = entries.filter((e) => e.id !== entryId);
        setEntries(updatedEntries);
        recalculateBudgetSpent(updatedEntries);
    };

    const recalculateBudgetSpent = (currentEntries: SpendingEntry[]) => {
        const updatedBudgets = budgets.map((budget) => {
            const budgetEntries = currentEntries.filter((e) => e.budgetId === budget.id);
            const spent = budgetEntries.reduce((sum, e) => sum + e.amount, 0);
            return { ...budget, spent };
        });
        setBudgets(updatedBudgets);
    };

    const handleAddCategory = (category: { categoryName: string; limit: number; icon: string; color: string }) => {
        if (editingBudget) {
            const updatedBudgets = budgets.map((b) =>
                b.id === editingBudget.id
                    ? { ...b, ...category, category: category.categoryName.toLowerCase().replace(/\s+/g, "-") as BudgetCategory }
                    : b
            );
            setBudgets(updatedBudgets);
            localStorage.setItem("budgetLimits", JSON.stringify(updatedBudgets));
            setEditingBudget(null);
        } else {
            const newBudget: BudgetLimit = {
                id: Date.now().toString(),
                category: category.categoryName.toLowerCase().replace(/\s+/g, "-") as BudgetCategory,
                categoryName: category.categoryName,
                limit: category.limit,
                spent: 0,
                icon: category.icon,
                color: category.color,
                createdAt: new Date().toISOString(),
            };
            const updatedBudgets = [...budgets, newBudget];
            setBudgets(updatedBudgets);
            localStorage.setItem("budgetLimits", JSON.stringify(updatedBudgets));
            fire();
        }
    };

    const handleEditCategory = (budget: BudgetLimit) => {
        setEditingBudget(budget);
        setShowAddCategoryDialog(true);
    };

    const handleDeleteCategory = (budgetId: string) => {
        if (window.confirm("Are you sure you want to delete this category and its entries?")) {
            const updatedBudgets = budgets.filter((b) => b.id !== budgetId);
            const updatedEntries = entries.filter((e) => e.budgetId !== budgetId);
            setBudgets(updatedBudgets);
            setEntries(updatedEntries);
            localStorage.setItem("budgetLimits", JSON.stringify(updatedBudgets));
            localStorage.setItem("spendingEntries", JSON.stringify(updatedEntries));
        }
    };

    const handleSaveTotalGoal = () => {
        const goal = parseFloat(tempGoal);
        if (!isNaN(goal) && goal >= 0) {
            setTotalBudgetGoal(goal);
            setShowSetTotalGoalDialog(false);
        }
    };

    const selectedBudget = budgets.find((b) => b.id === selectedBudgetId);
    const selectedEntries = entries.filter((e) => e.budgetId === selectedBudgetId);

    // Group entries by budgetId for performance
    const entriesByBudgetId = useMemo(() => {
        const map: Record<string, SpendingEntry[]> = {};
        entries.forEach((entry) => {
            if (!map[entry.budgetId]) map[entry.budgetId] = [];
            map[entry.budgetId].push(entry);
        });
        return map;
    }, [entries]);

    return (
        <AnimatePage>
            <ConfettiComponent />
            <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
                <FloatingOrbs variant="default" />

                {/* Header */}
                <header className="relative z-10 px-6 pt-10 pb-6">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight shimmer-text">Budget</h1>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Track your spending</p>
                        </div>
                    </div>

                    {/* Summary Master Card */}
                    <HoverScale>
                        <Spotlight className="glass-card-3d p-6 glow-teal bg-primary/5 border-primary/20">
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Budget Overview</h2>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 sm:gap-6 mb-6 sm:mb-8">
                                    <div className="col-span-2 sm:col-span-1 relative group">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Total Budget</span>
                                            <button
                                                onClick={() => {
                                                    setTempGoal(totalLimit.toString());
                                                    setShowSetTotalGoalDialog(true);
                                                }}
                                                className="p-2 hover:bg-primary/10 rounded-md transition-colors opacity-60 hover:opacity-100"
                                            >
                                                <Edit2 className="w-4 h-4 text-primary" />
                                            </button>
                                        </div>
                                        <p className="text-3xl sm:text-2xl font-black text-white tracking-tighter">
                                            {formatCurrency(totalLimit)}
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <TrendingUp className="w-3 h-3 text-primary" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Spent</span>
                                        </div>
                                        <p className="text-xl sm:text-2xl font-black text-primary tracking-tighter">
                                            <AnimatedNumber value={totalSpent} prefix={symbol} />
                                        </p>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Zap className="w-3 h-3 text-primary" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Remaining</span>
                                        </div>
                                        <p className={cn(
                                            "text-xl sm:text-2xl font-black tracking-tighter",
                                            totalRemaining < 0 ? "text-destructive" : "text-white"
                                        )}>
                                            {formatCurrency(totalRemaining)}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                                        <span className="opacity-60">Budget Used</span>
                                        <span className={cn(percentageSpent > 100 ? "text-warning" : "text-primary")}>
                                            {Math.round(percentageSpent)}%
                                        </span>
                                    </div>
                                    <AnimatedProgress
                                        value={Math.min(percentageSpent, 100)}
                                        color={percentageSpent > 100 ? "warning" : "primary"}
                                        size="md"
                                        showGlow={true}
                                    />
                                </div>
                            </div>
                        </Spotlight>
                    </HoverScale>
                </header>

                {/* Grid Clusters */}
                <main className="relative z-10 px-6 space-y-4 pb-40 sm:pb-28">
                    <div className="flex items-center justify-between gap-3 px-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Categories ({budgets.length})
                        </h3>
                        <HoverScale>
                            <Button
                                onClick={() => setShowAddCategoryDialog(true)}
                                size="sm"
                                className="btn-3d h-8 px-3 bg-primary font-black uppercase tracking-widest text-[9px]"
                            >
                                <Plus className="w-3.5 h-3.5 mr-1.5" />
                                New Category
                            </Button>
                        </HoverScale>
                    </div>

                    {budgets.length === 0 ? (
                        <div className="empty-state-calm py-20 bg-card/20 rounded-[2.5rem] border border-white/5 backdrop-blur-sm text-center">
                            <div className="empty-icon w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-primary/5 rounded-full">
                                <Wallet className="w-10 h-10 text-primary animate-gentle-float" />
                            </div>
                            <h3 className="empty-title text-xl font-black text-white tracking-tight">No Budgets Yet</h3>
                            <p className="empty-description text-sm opacity-60 max-w-[260px] mx-auto mb-8 font-medium">
                                Create a category to start tracking your spending.
                            </p>
                            <HoverScale>
                                <Button onClick={() => setShowAddCategoryDialog(true)} className="btn-3d px-10 bg-primary font-black uppercase tracking-widest text-xs h-12">
                                    Create Category
                                </Button>
                            </HoverScale>
                        </div>
                    ) : (
                        <AnimateList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {budgets.map((budget) => (
                                <AnimateItem key={budget.id}>
                                    <BudgetCard
                                        budget={budget}
                                        entries={entriesByBudgetId[budget.id] || []}
                                        onAddExpense={handleAddExpense}
                                        onViewHistory={handleViewHistory}
                                        onEditCategory={handleEditCategory}
                                        onDeleteCategory={handleDeleteCategory}
                                    />
                                </AnimateItem>
                            ))}
                        </AnimateList>
                    )}
                </main>

                {/* System Overlays */}
                {selectedBudget && (
                    <AddExpenseDialog
                        open={showAddDialog}
                        onOpenChange={setShowAddDialog}
                        budget={selectedBudget}
                        existingEntry={editingEntry}
                        onSave={handleSaveExpense}
                    />
                )}

                <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                    <DialogContent className="glass-card-3d border-white/10 sm:max-w-[500px] h-[90vh] sm:h-auto max-h-[90vh] w-[95vw] sm:w-full flex flex-col p-0 overflow-hidden">
                        <DialogHeader className="flex-none p-6 pb-2">
                            <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight shimmer-text">
                                History: {selectedBudget?.categoryName}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 overflow-y-auto min-h-0 p-6 pt-0">
                            <SpendingHistory
                                entries={selectedEntries}
                                onEdit={handleEditEntry}
                                onDelete={handleDeleteEntry}
                            />
                        </div>
                    </DialogContent>
                </Dialog>

                <AddCategoryDialog
                    open={showAddCategoryDialog}
                    onOpenChange={(open) => {
                        setShowAddCategoryDialog(open);
                        if (!open) setEditingBudget(null);
                    }}
                    onSave={handleAddCategory}
                    initialData={editingBudget ? {
                        categoryName: editingBudget.categoryName,
                        limit: editingBudget.limit,
                        icon: editingBudget.icon,
                        color: editingBudget.color
                    } : undefined}
                />

                <Dialog open={showSetTotalGoalDialog} onOpenChange={setShowSetTotalGoalDialog}>
                    <DialogContent className="glass-card-3d border-white/10 sm:max-w-[400px] w-[92vw] p-6 sm:p-8">
                        <DialogHeader>
                            <DialogTitle className="font-black text-xl tracking-tight">Set Total Budget</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6 py-6 font-bold">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                                    Total Budget Limit
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-2xl">{symbol}</span>
                                    <input
                                        type="number"
                                        value={tempGoal}
                                        onChange={(e) => setTempGoal(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-12 pr-4 py-8 rounded-[2rem] bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-black text-3xl sm:text-4xl tracking-tighter"
                                        autoFocus
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground opacity-60 uppercase font-black tracking-widest leading-relaxed">
                                    This sets the maximum amount you want to spend each month.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <Button
                                variant="ghost"
                                onClick={() => setShowSetTotalGoalDialog(false)}
                                className="flex-1 font-black uppercase tracking-widest text-[10px] border border-white/5 rounded-2xl h-14"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSaveTotalGoal}
                                className="flex-1 btn-3d bg-primary font-black uppercase tracking-widest text-[10px] rounded-2xl h-14"
                            >
                                Save
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>

                <BottomNav />
            </div>
        </AnimatePage>
    );
}
