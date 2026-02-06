"use client";

import { useState } from "react";
import {
    Tv,
    Music,
    Gamepad2,
    Laptop,
    Dumbbell,
    Newspaper,
    Cloud,
    MoreHorizontal,
    Plus,
    Trash2,
    AlertTriangle,
    Check,
    X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalmEmptyState } from "@/components/ui/CalmEmptyState";
import { SuccessToast, useSuccessToast } from "@/components/ui/SuccessToast";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { SubscriptionCategory, Subscription } from "@/lib/types";

// Category icon map
const categoryIconMap: Record<SubscriptionCategory, typeof Tv> = {
    streaming: Tv,
    music: Music,
    gaming: Gamepad2,
    productivity: Laptop,
    fitness: Dumbbell,
    news: Newspaper,
    cloud: Cloud,
    other: MoreHorizontal,
};

// Category colors
const categoryColorMap: Record<SubscriptionCategory, string> = {
    streaming: "hsl(0, 70%, 55%)",
    music: "hsl(120, 50%, 50%)",
    gaming: "hsl(260, 60%, 55%)",
    productivity: "hsl(210, 60%, 55%)",
    fitness: "hsl(35, 70%, 55%)",
    news: "hsl(175, 65%, 50%)",
    cloud: "hsl(220, 50%, 55%)",
    other: "hsl(220, 15%, 50%)",
};

// Category labels
const categoryLabels: Record<SubscriptionCategory, string> = {
    streaming: "Streaming",
    music: "Music",
    gaming: "Gaming",
    productivity: "Productivity",
    fitness: "Fitness",
    news: "News",
    cloud: "Cloud Storage",
    other: "Other",
};

const ALL_CATEGORIES: SubscriptionCategory[] = [
    "streaming",
    "music",
    "gaming",
    "productivity",
    "fitness",
    "news",
    "cloud",
    "other",
];

const BILLING_CYCLES = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly" },
    { value: "yearly", label: "Yearly" },
];

export function SubscriptionTracker() {
    const {
        profile,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        forgottenSubscriptions,
    } = useUserProfile();
    const { formatCurrency, symbol } = useCurrency();
    const { showToast, toastProps } = useSuccessToast();

    // Form state
    const [sheetOpen, setSheetOpen] = useState(false);
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState<SubscriptionCategory>("streaming");
    const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly" | "quarterly" | "yearly">("monthly");
    const [nextBillingDate, setNextBillingDate] = useState("");

    if (!profile) return null;

    const subscriptions = profile.subscriptions;
    const activeSubscriptions = subscriptions.filter((s) => s.isActive);

    // Calculate monthly cost
    const monthlyTotal = activeSubscriptions.reduce((total, sub) => {
        switch (sub.billingCycle) {
            case "weekly":
                return total + sub.amount * 4.33;
            case "monthly":
                return total + sub.amount;
            case "quarterly":
                return total + sub.amount / 3;
            case "yearly":
                return total + sub.amount / 12;
            default:
                return total + sub.amount;
        }
    }, 0);

    const handleAddSubscription = () => {
        if (!name.trim() || !amount || parseFloat(amount) <= 0) return;

        addSubscription({
            name: name.trim(),
            amount: parseFloat(amount),
            category,
            billingCycle,
            nextBillingDate: nextBillingDate || new Date().toISOString(),
            isActive: true,
        });

        // Show success toast
        showToast(`${name} added`);

        // Reset form
        setName("");
        setAmount("");
        setCategory("streaming");
        setBillingCycle("monthly");
        setNextBillingDate("");
        setSheetOpen(false);
    };

    const handleMarkUsed = (id: string, subName: string) => {
        updateSubscription(id, { lastUsed: new Date().toISOString() });
        showToast(`${subName} marked as used`);
    };

    const handleToggleActive = (id: string, currentlyActive: boolean) => {
        updateSubscription(id, { isActive: !currentlyActive });
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Subscriptions</h3>
                    <p className="text-lg font-bold text-primary">
                        {formatCurrency(monthlyTotal)}<span className="text-xs font-normal text-muted-foreground">/month</span>
                    </p>
                </div>
                <Button size="sm" onClick={() => setSheetOpen(true)} className="gap-1">
                    <Plus className="w-4 h-4" />
                    Add
                </Button>
            </div>

            {/* Forgotten Subscriptions Alert */}
            {forgottenSubscriptions.length > 0 && (
                <div className="glass-card p-4 border-warning/30 bg-warning/5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-warning">
                                Still paying for this?
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {forgottenSubscriptions.length} subscription{forgottenSubscriptions.length > 1 ? "s" : ""} you haven't used in 30+ days:
                            </p>
                            <div className="mt-2 space-y-1">
                                {forgottenSubscriptions.map((sub) => {
                                    const Icon = categoryIconMap[sub.category];
                                    return (
                                        <div key={sub.id} className="flex items-center justify-between text-xs">
                                            <span className="flex items-center gap-2">
                                                <Icon className="w-3 h-3" style={{ color: categoryColorMap[sub.category] }} />
                                                {sub.name}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground">{formatCurrency(sub.amount)}</span>
                                                <button
                                                    onClick={() => handleMarkUsed(sub.id, sub.name)}
                                                    className="text-primary hover:underline"
                                                >
                                                    Mark used
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Subscription List */}
            {activeSubscriptions.length > 0 ? (
                <div className="glass-card-3d p-4 space-y-3">
                    {activeSubscriptions.map((sub) => {
                        const Icon = categoryIconMap[sub.category];
                        const color = categoryColorMap[sub.category];
                        const isForgotten = forgottenSubscriptions.some((f) => f.id === sub.id);

                        return (
                            <div
                                key={sub.id}
                                className={cn(
                                    "flex items-center gap-3 group hover-scale-subtle",
                                    isForgotten && "opacity-75"
                                )}
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${color}20` }}
                                >
                                    <Icon className="w-4 h-4" style={{ color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm truncate">{sub.name}</span>
                                        <span className="font-semibold text-sm ml-2 shrink-0">
                                            {formatCurrency(sub.amount)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-xs" style={{ color }}>
                                            {categoryLabels[sub.category]}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            • {sub.billingCycle}
                                        </span>
                                        {isForgotten && (
                                            <span className="text-xs text-warning">• Unused</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleToggleActive(sub.id, sub.isActive)}
                                        className="p-1.5 rounded-md hover:bg-secondary"
                                        title="Pause subscription"
                                    >
                                        <X className="w-4 h-4 text-muted-foreground" />
                                    </button>
                                    <button
                                        onClick={() => deleteSubscription(sub.id)}
                                        className="p-1.5 rounded-md hover:bg-destructive/10"
                                    >
                                        <Trash2 className="w-4 h-4 text-destructive" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <CalmEmptyState
                    icon={Tv}
                    title="No subscriptions tracked yet"
                    description="Add your streaming services, apps, and memberships to track monthly costs"
                    actionLabel="Add your first subscription"
                    onAction={() => setSheetOpen(true)}
                    className="glass-card"
                />
            )}

            {/* Paused Subscriptions */}
            {subscriptions.filter((s) => !s.isActive).length > 0 && (
                <div className="pt-2">
                    <p className="text-xs text-muted-foreground mb-2">Paused</p>
                    <div className="space-y-2">
                        {subscriptions.filter((s) => !s.isActive).map((sub) => (
                            <div
                                key={sub.id}
                                className="flex items-center justify-between text-sm text-muted-foreground bg-secondary/30 rounded-lg px-3 py-2"
                            >
                                <span>{sub.name}</span>
                                <button
                                    onClick={() => handleToggleActive(sub.id, sub.isActive)}
                                    className="text-xs text-primary hover:underline"
                                >
                                    Resume
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Subscription Sheet */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent side="bottom" className="rounded-t-2xl">
                    <SheetHeader className="text-left">
                        <SheetTitle>Add Subscription</SheetTitle>
                        <SheetDescription>
                            Track a recurring subscription.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="sub-name">Name</Label>
                            <Input
                                id="sub-name"
                                placeholder="e.g. Netflix, Spotify, Xbox Game Pass"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="sub-amount">Amount ({symbol})</Label>
                                <Input
                                    id="sub-amount"
                                    type="number"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Billing Cycle</Label>
                                <Select
                                    value={billingCycle}
                                    onValueChange={(val) => setBillingCycle(val as typeof billingCycle)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BILLING_CYCLES.map((cycle) => (
                                            <SelectItem key={cycle.value} value={cycle.value}>
                                                {cycle.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={category}
                                onValueChange={(val) => setCategory(val as SubscriptionCategory)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ALL_CATEGORIES.map((cat) => {
                                        const Icon = categoryIconMap[cat];
                                        return (
                                            <SelectItem key={cat} value={cat}>
                                                <span className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4" style={{ color: categoryColorMap[cat] }} />
                                                    {categoryLabels[cat]}
                                                </span>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="w-full mt-2"
                            onClick={handleAddSubscription}
                            disabled={!name.trim() || !amount || parseFloat(amount) <= 0}
                        >
                            Add Subscription
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>

            {/* Success Toast */}
            <SuccessToast {...toastProps} />
        </div>
    );
}
