"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AddCategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (category: { categoryName: string; limit: number; icon: string; color: string }) => void;
    initialData?: { categoryName: string; limit: number; icon: string; color: string };
}

const availableIcons = [
    { name: "utensils", emoji: "🍽️", label: "Food & Dining" },
    { name: "car", emoji: "🚗", label: "Transport" },
    { name: "shopping-bag", emoji: "🛍️", label: "Shopping" },
    { name: "gamepad-2", emoji: "🎮", label: "Entertainment" },
    { name: "heart-pulse", emoji: "❤️", label: "Health" },
    { name: "zap", emoji: "⚡", label: "Utilities" },
    { name: "home", emoji: "🏠", label: "Housing" },
    { name: "plane", emoji: "✈️", label: "Travel" },
    { name: "graduation-cap", emoji: "🎓", label: "Education" },
    { name: "dumbbell", emoji: "💪", label: "Fitness" },
    { name: "coffee", emoji: "☕", label: "Coffee" },
    { name: "gift", emoji: "🎁", label: "Gifts" },
];

const availableColors = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Purple", value: "#8b5cf6" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Teal", value: "#14b8a6" },
    { name: "Red", value: "#ef4444" },
    { name: "Yellow", value: "#eab308" },
];

export function AddCategoryDialog({ open, onOpenChange, onSave, initialData }: AddCategoryDialogProps) {
    const [categoryName, setCategoryName] = useState("");
    const [limit, setLimit] = useState("");
    const [selectedIcon, setSelectedIcon] = useState("utensils");
    const [selectedColor, setSelectedColor] = useState("#3b82f6");
    const [errors, setErrors] = useState<{ name?: string; limit?: string }>({});

    // Sync with initialData when it changes or dialog opens
    useEffect(() => {
        if (open) {
            if (initialData) {
                setCategoryName(initialData.categoryName);
                setLimit(initialData.limit.toString());
                setSelectedIcon(initialData.icon);
                setSelectedColor(initialData.color);
            } else {
                setCategoryName("");
                setLimit("");
                setSelectedIcon("utensils");
                setSelectedColor("#3b82f6");
            }
            setErrors({});
        }
    }, [initialData, open]);

    const handleSave = () => {
        const newErrors: { name?: string; limit?: string } = {};

        if (!categoryName.trim()) {
            newErrors.name = "Category name is required";
        }

        const limitNum = parseFloat(limit);
        if (!limit || isNaN(limitNum) || limitNum <= 0) {
            newErrors.limit = "Please enter a valid budget limit";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave({
            categoryName: categoryName.trim(),
            limit: limitNum,
            icon: selectedIcon,
            color: selectedColor,
        });

        // Reset form
        setCategoryName("");
        setLimit("");
        setSelectedIcon("utensils");
        setSelectedColor("#3b82f6");
        setErrors({});
        onOpenChange(false);
    };

    const handleCancel = () => {
        setCategoryName("");
        setLimit("");
        setSelectedIcon("utensils");
        setSelectedColor("#3b82f6");
        setErrors({});
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
            <DialogContent className="!fixed !left-1/2 !top-1/2 !-translate-x-1/2 !-translate-y-1/2 glass-card-3d border-border/50 sm:max-w-[500px] max-h-[85vh] w-[95vw] sm:w-full flex flex-col !p-0 gap-0 overflow-hidden">

                {/* Header - Fixed at top */}
                <DialogHeader className="flex-none p-6 pb-2">
                    <DialogTitle className="text-xl font-semibold">
                        {initialData ? "Edit Budget Category" : "Create Budget Category"}
                    </DialogTitle>
                </DialogHeader>

                {/* Body - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0 space-y-5 p-6 py-2">
                    {/* Category Name */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Category Name
                        </label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => {
                                setCategoryName(e.target.value);
                                setErrors({ ...errors, name: undefined });
                            }}
                            placeholder="e.g., Groceries, Rent, etc."
                            className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        {errors.name && (
                            <p className="text-destructive text-xs mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Budget Limit */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                            Monthly Budget Limit ($)
                        </label>
                        <input
                            type="number"
                            value={limit}
                            onChange={(e) => {
                                setLimit(e.target.value);
                                setErrors({ ...errors, limit: undefined });
                            }}
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        {errors.limit && (
                            <p className="text-destructive text-xs mt-1">{errors.limit}</p>
                        )}
                    </div>

                    {/* Icon Selection */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Choose Icon
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                            {availableIcons.map((icon) => (
                                <button
                                    key={icon.name}
                                    type="button"
                                    onClick={() => setSelectedIcon(icon.name)}
                                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${selectedIcon === icon.name
                                        ? "border-primary bg-primary/10"
                                        : "border-border/30 bg-muted/30 hover:border-border"
                                        }`}
                                    title={icon.label}
                                >
                                    <span className="text-2xl">{icon.emoji}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="block text-sm font-medium text-foreground mb-3">
                            Choose Color
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                            {availableColors.map((color) => (
                                <button
                                    key={color.value}
                                    type="button"
                                    onClick={() => setSelectedColor(color.value)}
                                    className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-105 ${selectedColor === color.value
                                        ? "border-foreground scale-105"
                                        : "border-border/30"
                                        }`}
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                        <p className="text-xs text-muted-foreground mb-2">Preview</p>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                                style={{ backgroundColor: `${selectedColor}20` }}
                            >
                                {availableIcons.find((i) => i.name === selectedIcon)?.emoji || "💰"}
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">
                                    {categoryName || "Category Name"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Limit: ${limit || "0.00"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions - Sticky Footer */}
                <div className="flex-none flex gap-3 p-6 pt-4 border-t border-border/50 bg-background/50 backdrop-blur-xl">
                    <Button
                        variant="ghost"
                        onClick={handleCancel}
                        className="flex-1 h-11"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className="flex-1 h-11 btn-3d bg-primary hover:bg-primary/90"
                    >
                        {initialData ? "Save Changes" : "Create Category"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
