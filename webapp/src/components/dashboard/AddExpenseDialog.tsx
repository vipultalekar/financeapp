"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { SpendingEntry, BudgetLimit } from "@/lib/types";

interface AddExpenseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    budget: BudgetLimit;
    existingEntry?: SpendingEntry;
    onSave: (entry: Omit<SpendingEntry, "id" | "createdAt">) => void;
}

export function AddExpenseDialog({
    open,
    onOpenChange,
    budget,
    existingEntry,
    onSave,
}: AddExpenseDialogProps) {
    const { symbol } = useCurrency();
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [errors, setErrors] = useState<{ amount?: string; description?: string }>({});

    useEffect(() => {
        if (existingEntry) {
            setAmount(existingEntry.amount.toString());
            setDescription(existingEntry.description);
            setDate(existingEntry.date.split("T")[0]);
        } else {
            setAmount("");
            setDescription("");
            setDate(new Date().toISOString().split("T")[0]);
        }
        setErrors({});
    }, [existingEntry, open]);

    const validateForm = () => {
        const newErrors: { amount?: string; description?: string } = {};

        if (!amount || parseFloat(amount) <= 0) {
            newErrors.amount = "Please enter a valid amount";
        }

        if (!description.trim()) {
            newErrors.description = "Please enter a description";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        const dateTime = new Date(date);
        dateTime.setHours(12, 0, 0, 0); // Set to noon to avoid timezone issues

        onSave({
            budgetId: budget.id,
            amount: parseFloat(amount),
            description: description.trim(),
            date: dateTime.toISOString(),
        });

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="glass-card-3d border-border/50 sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        {existingEntry ? "Edit Expense" : "Add Expense"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {existingEntry
                            ? `Update your expense for ${budget.categoryName}`
                            : `Record a new expense for ${budget.categoryName}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Amount Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="amount" className="text-sm font-medium">
                            Amount ({symbol})
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className={errors.amount ? "border-destructive" : ""}
                            step="0.01"
                            min="0"
                        />
                        {errors.amount && (
                            <p className="text-xs text-destructive">{errors.amount}</p>
                        )}
                    </div>

                    {/* Description Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Description
                        </Label>
                        <Input
                            id="description"
                            type="text"
                            placeholder="e.g., Lunch at restaurant"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={errors.description ? "border-destructive" : ""}
                            maxLength={100}
                        />
                        {errors.description && (
                            <p className="text-xs text-destructive">{errors.description}</p>
                        )}
                    </div>

                    {/* Date Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="date" className="text-sm font-medium">
                            Date
                        </Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={new Date().toISOString().split("T")[0]}
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="btn-3d bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {existingEntry ? "Update" : "Add"} Expense
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
