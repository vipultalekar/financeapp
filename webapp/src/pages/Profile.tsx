"use client";

import { useNavigate } from "react-router-dom";
import { Settings, LogOut, TrendingUp, PiggyBank, Wallet, BookOpen, ChevronRight, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import { BottomNav } from "@/components/navigation/BottomNav";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { downloadMonthlyReport, getCurrentMonthReportData } from "@/lib/reportGenerator";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Profile() {
  const { profile, derivedFinancials, resetProfile, currentMonthExpenses } = useUserProfile();
  const { formatCurrency } = useCurrency();
  const navigate = useNavigate();

  if (!profile) {
    return null;
  }

  const handleLogout = () => {
    resetProfile();
    navigate("/onboarding");
  };

  const handleDownloadReport = () => {
    if (profile && derivedFinancials) {
      const reportData = getCurrentMonthReportData(profile, derivedFinancials, currentMonthExpenses);
      downloadMonthlyReport(reportData);
    }
  };

  const totalExpenses = profile.expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalGoalsSaved = profile.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalGoalsTarget = profile.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <div className="min-h-screen bg-background pb-nav relative overflow-hidden">
      <FloatingOrbs variant="subtle" />

      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold">Profile</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="rounded-xl min-w-[44px] min-h-[44px]"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 px-4 sm:px-6 space-y-4 sm:space-y-6">
        {/* Profile Card */}
        <div className="glass-card-3d p-4 sm:p-6 text-center glow-teal">
          {/* Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl font-bold text-primary">
              {getInitials(profile.name || "User")}
            </span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold mb-1">{profile.name || "User"}</h2>
          <p className="text-xs sm:text-sm text-muted-foreground capitalize">
            {profile.financialVibe === "figuring-out"
              ? "Figuring things out"
              : `Focused on ${profile.financialVibe}ing`}
          </p>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border/50">
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Member since{" "}
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Learn Section - Prominent Card */}
        <div
          className="glass-card-3d p-4 sm:p-5 cursor-pointer hover:scale-[1.02] transition-transform"
          onClick={() => navigate("/learn")}
        >
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base">Learn About Money</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Financial tips, guides, and education
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </div>
        </div>

        {/* Financial Summary */}
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
            Financial Summary
          </h3>
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {/* Monthly Income */}
            <div className="glass-card p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-success/20 flex items-center justify-center">
                  <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-success" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Monthly Income</p>
              <p className="text-sm sm:text-lg font-semibold text-success truncate">
                {formatCurrency(profile.monthlyIncome)}
              </p>
            </div>

            {/* Fixed Expenses */}
            <div className="glass-card p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Fixed Expenses</p>
              <p className="text-sm sm:text-lg font-semibold text-accent truncate">
                {formatCurrency(totalExpenses)}
              </p>
            </div>

            {/* Savings Rate */}
            <div className="glass-card p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <PiggyBank className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Savings Rate</p>
              <p className="text-sm sm:text-lg font-semibold text-primary">
                {derivedFinancials?.actualSavingsRate ?? 0}%
              </p>
            </div>

            {/* Goals Progress */}
            <div className="glass-card p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-chart-3/20 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-chart-3" />
                </div>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Goals Progress</p>
              <p className="text-sm sm:text-lg font-semibold text-chart-3">
                {totalGoalsTarget > 0
                  ? `${Math.round((totalGoalsSaved / totalGoalsTarget) * 100)}%`
                  : "No goals"}
              </p>
            </div>
          </div>
        </div>

        {/* Expense Breakdown */}
        {profile.expenseBreakdown.length > 0 && (
          <div>
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 sm:mb-3">
              Expense Breakdown
            </h3>
            <div className="glass-card p-3 sm:p-4">
              <div className="space-y-2 sm:space-y-3">
                {profile.expenseBreakdown.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs sm:text-sm truncate">{expense.name}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">
                        {expense.category}
                      </p>
                    </div>
                    <p className="font-semibold text-xs sm:text-sm shrink-0 ml-2">{formatCurrency(expense.amount)}</p>
                  </div>
                ))}
                <div className="pt-2 sm:pt-3 border-t border-border/50 flex items-center justify-between">
                  <p className="font-medium text-xs sm:text-sm">Total</p>
                  <p className="font-bold text-primary text-xs sm:text-sm">{formatCurrency(totalExpenses)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2 sm:space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 sm:gap-3 h-11 sm:h-12 text-xs sm:text-sm"
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            Edit Profile & Settings
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 sm:gap-3 h-11 sm:h-12 text-xs sm:text-sm border-primary/50 text-primary hover:bg-primary/10"
            onClick={handleDownloadReport}
          >
            <FileDown className="w-4 h-4 sm:w-5 sm:h-5" />
            Download Monthly Report
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start gap-2 sm:gap-3 h-11 sm:h-12 border-destructive/50 text-destructive hover:bg-destructive/10 text-xs sm:text-sm"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                Logout & Reset Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all your data including your profile, goals, and chat
                  history. You will need to complete onboarding again.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Reset & Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
