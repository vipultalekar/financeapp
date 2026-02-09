"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Wallet, TrendingUp, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { BudgetCard } from "@/components/dashboard/BudgetCard";
import { AddExpenseDialog } from "@/components/dashboard/AddExpenseDialog";
import { AddCategoryDialog } from "@/components/dashboard/AddCategoryDialog";
import { SpendingHistory } from "@/components/dashboard/SpendingHistory";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AnimatedProgress, AnimatedNumber } from "@/components/ui/AnimatedProgress";
import type { BudgetLimit, SpendingEntry } from "@/lib/types";
import { budgetLimits as mockBudgetLimits, spendingEntries as mockSpendingEntries } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function MoneyTracker() {
    const navigate = useNavigate();
    const { formatCurrency } = useCurrency();
    const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
    const [entries, setEntries] = useState<SpendingEntry[]>([]);
    const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);
    const [editingEntry, setEditingEntry] = useState<SpendingEntry | undefined>(undefined);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [showAddCategoryDialog, setShowAddCategoryDialog] = useState(false);

    // Load data from localStorage or use mock data
    useEffect(() => {
        const savedBudgets = localStorage.getItem("budgetLimits");
        const savedEntries = localStorage.getItem("spendingEntries");

        if (savedBudgets) {
            setBudgets(JSON.parse(savedBudgets));
        } else {
            setBudgets(mockBudgetLimits);
        }

        if (savedEntries) {
            setEntries(JSON.parse(savedEntries));
        } else {
            setEntries(mockSpendingEntries);
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

    // Calculate totals
    const totalLimit = budgets.reduce((sum, b) => sum + b.limit, 0);
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
            // Update existing entry
            const updatedEntries = entries.map((e) =>
                e.id === editingEntry.id
                    ? { ...e, ...newEntry }
                    : e
            );
            setEntries(updatedEntries);

            // Recalculate budget spent amounts
            recalculateBudgetSpent(updatedEntries);
        } else {
            // Add new entry
            const entry: SpendingEntry = {
                ...newEntry,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
            };
            const updatedEntries = [...entries, entry];
            setEntries(updatedEntries);

            // Recalculate budget spent amounts
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
        const newBudget: BudgetLimit = {
            id: Date.now().toString(),
            category: category.categoryName.toLowerCase().replace(/\s+/g, "-") as any,
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
    };

    const selectedBudget = budgets.find((b) => b.id === selectedBudgetId);
    const selectedEntries = entries.filter((e) => e.budgetId === selectedBudgetId);

    return (
        <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
            {/* Floating background orbs */}
            <FloatingOrbs variant="default" />

            {/* Header */}
            <header className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/")}
                        className="h-9 w-9 p-0 hover:bg-muted"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Money Tracker</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            Set limits & track your spending
                        </p>
                    </div>
                </div>

                {/* Summary Card */}
                <div className="glass-card-3d p-4 sm:p-6 glow-teal">
                    <div className="flex items-center gap-2 mb-3">
                        <Wallet className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-medium text-muted-foreground">Total Budget Overview</h2>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Limit</p>
                            <p className="text-lg sm:text-xl font-bold text-foreground">
                                {formatCurrency(totalLimit)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Spent</p>
                            <p className="text-lg sm:text-xl font-bold text-accent">
                                <AnimatedNumber value={totalSpent} prefix={formatCurrency(0).replace(/[\d.]/g, "")} />
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                            <p className={cn(
                                "text-lg sm:text-xl font-bold",
                                totalRemaining < 0 ? "text-destructive" : "text-success"
                            )}>
                                {formatCurrency(totalRemaining)}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-2">
                            <span>Budget Used</span>
                            <span>{Math.round(percentageSpent)}%</span>
                        </div>
                        <AnimatedProgress
                            value={Math.min(percentageSpent, 100)}
                            color={percentageSpent > 100 ? "warning" : percentageSpent >= 80 ? "warning" : "primary"}
                            size="md"
                            showGlow={true}
                        />
                    </div>
                </div>
            </header>

            {/* Budget Categories */}
            <main className="relative z-10 px-4 sm:px-6 space-y-4 pb-40 sm:pb-28">
                <div className="flex items-center justify-between gap-3">
                    <h3 className="text-sm font-medium text-muted-foreground">
                        Budget Categories ({budgets.length})
                    </h3>
                    <Button
                        onClick={() => setShowAddCategoryDialog(true)}
                        size="sm"
                        className="btn-3d h-9 px-3 sm:px-4"
                    >
                        <Plus className="w-4 h-4 sm:mr-2" />
                        <span className="hidden sm:inline">Add Category</span>
                    </Button>
                </div>

                {budgets.length === 0 ? (
                    <div className="empty-state-calm py-16">
                        <div className="empty-icon w-20 h-20 mx-auto mb-4">
                            <div className="text-7xl">💰</div>
                        </div>
                        <h3 className="empty-title text-base">No budgets yet</h3>
                        <p className="empty-description">
                            Start tracking your spending by creating your first budget category
                        </p>
                        <Button onClick={() => setShowAddCategoryDialog(true)} className="mt-6 btn-3d">
                            <Plus className="w-4 h-4 mr-2" />
                            Create Budget
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-stagger-in">
                        {budgets.map((budget, index) => (
                            <div key={budget.id} style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }} className="animate-fade-in-up">
                                <BudgetCard
                                    budget={budget}
                                    entries={entries.filter((e) => e.budgetId === budget.id)}
                                    onAddExpense={handleAddExpense}
                                    onViewHistory={handleViewHistory}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add/Edit Expense Dialog */}
            {selectedBudget && (
                <AddExpenseDialog
                    open={showAddDialog}
                    onOpenChange={setShowAddDialog}
                    budget={selectedBudget}
                    existingEntry={editingEntry}
                    onSave={handleSaveExpense}
                />
            )}

            {/* Spending History Dialog */}
            <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
                <DialogContent className="!fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 glass-card-3d border-border/50 sm:max-w-[500px] max-h-[85vh] w-[95vw] sm:w-full flex flex-col !p-0 gap-0 overflow-hidden">
                    <DialogHeader className="flex-none p-6 pb-2">
                        <DialogTitle className="text-xl font-semibold">
                            {selectedBudget?.categoryName} History
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

            {/* Add Category Dialog */}
            <AddCategoryDialog
                open={showAddCategoryDialog}
                onOpenChange={setShowAddCategoryDialog}
                onSave={handleAddCategory}
            />

            <BottomNav />
        </div>
    );
}
