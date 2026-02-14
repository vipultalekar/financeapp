"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
        if (open) {
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
        }
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
            {/* 
              Improved Layout for Sticky Footer:
              1. max-h-[85vh] prevents overflow on mobile
              2. flex flex-col enables sticky footer
              3. !p-0 overrides default padding to allow children to control spacing
              4. gap-0 removes default gap
              5. overflow-hidden clips content to border radius
            */}
            <DialogContent className="fixed bottom-0 left-0 right-0 top-auto translate-x-0 translate-y-0 w-full max-w-none h-auto max-h-[85vh] rounded-t-[1.25rem] rounded-b-none border-t border-white/10 bg-card/80 backdrop-blur-xl shadow-2xl flex flex-col p-0 overflow-hidden sm:fixed sm:left-[50%] sm:top-[50%] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:max-w-[425px] sm:w-full sm:rounded-[1.25rem] sm:border">
                <DialogHeader className="flex-none p-6 pb-2">
                    <DialogTitle className="text-xl font-semibold">
                        {existingEntry ? "Edit Expense" : "Add Expense"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {existingEntry
                            ? `Update your expense for ${budget.categoryName}`
                            : `Record a new expense for ${budget.categoryName}`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto min-h-0 p-6 py-2 space-y-4">
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

                <DialogFooter className="flex-none flex flex-row gap-2 p-6 pt-4 border-t border-border/50 bg-background/50 backdrop-blur-xl sm:flex-row sm:justify-end sm:space-x-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 sm:flex-none hover:bg-muted"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="flex-1 sm:flex-none btn-3d bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        {existingEntry ? "Update" : "Add"} <span className="hidden sm:inline ml-1">Expense</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
