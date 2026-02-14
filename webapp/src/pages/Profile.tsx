"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, TrendingUp, PiggyBank, Wallet, BookOpen, ChevronRight, FileDown, Shield, Calendar, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrency } from "@/contexts/CurrencyContext";
import { BottomNav } from "@/components/navigation/BottomNav";
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
import { AnimatePage, AnimateList, AnimateItem, HoverScale } from "@/components/effects/AnimatePage";
import { Spotlight } from "@/components/effects/Spotlight";
import { AnimatedProgress, AnimatedNumber } from "@/components/ui/AnimatedProgress";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";

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
  const { formatCurrency, symbol } = useCurrency();
  const navigate = useNavigate();

  if (!profile) return null;

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
  const goalsPercentage = totalGoalsTarget > 0 ? Math.round((totalGoalsSaved / totalGoalsTarget) * 100) : 0;

  const [alertOpen, setAlertOpen] = useState(false);

  return (
    <AnimatePage>
      <div className="min-h-screen bg-background pb-nav relative overflow-hidden text-foreground">
        <FloatingOrbs variant="default" />

        {/* Header */}
        <header className="relative z-10 px-6 pt-10 pb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HoverScale>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:text-primary transition-all"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </Button>
            </HoverScale>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight shimmer-text">My Profile</h1>
              <p className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-60">Your personal details</p>
            </div>
          </div>
          <HoverScale>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/settings")}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/5 border border-white/5 hover:bg-primary/10 hover:text-primary transition-all"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </HoverScale>
        </header>

        <main className="relative z-10 px-6 space-y-8 pb-32 max-w-2xl mx-auto">
          {/* Profile Card */}
          <HoverScale>
            <Spotlight className="glass-card-3d p-6 sm:p-8 text-center glow-teal bg-primary/5 border-primary/20">
              <div className="relative z-10">
                {/* Avatar */}
                <div className="relative inline-block mb-4 sm:mb-6">
                  <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto shadow-2xl">
                    <span className="text-2xl sm:text-3xl font-black text-primary tracking-tighter shimmer-text">
                      {getInitials(profile.name || "User")}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-1">{profile.name || "User"}</h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    {profile.financialVibe === "figuring-out" ? "Style: Exploring" : `Style: ${profile.financialVibe}`}
                  </p>
                </div>

                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/5">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40 flex items-center justify-center gap-2">
                    <Calendar className="w-3 h-3" />
                    MEMBER SINCE {new Date(profile.createdAt).getFullYear()}
                  </p>
                </div>
              </div>
            </Spotlight>
          </HoverScale>

          {/* Core Metrics */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Key Numbers</h3>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { label: "Income", value: profile.monthlyIncome, icon: Wallet, color: "text-success", bgColor: "bg-success/10" },
                { label: "Expenses", value: totalExpenses, icon: TrendingUp, color: "text-accent", bgColor: "bg-accent/10" },
                { label: "Savings", value: `${derivedFinancials?.actualSavingsRate ?? 0}%`, icon: PiggyBank, color: "text-primary", bgColor: "bg-primary/10" },
                { label: "Goals", value: `${goalsPercentage}%`, icon: Shield, color: "text-chart-3", bgColor: "bg-chart-3/10" },
              ].map((item, idx) => (
                <AnimateItem key={idx}>
                  <HoverScale className="h-full">
                    <Spotlight className="glass-card-3d p-4 h-full border-white/5" color="hsla(217, 91%, 60%, 0.05)">
                      <div className="flex flex-col gap-3 relative z-10">
                        <div className={cn("w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-inner", item.bgColor)}>
                          <item.icon className={cn("w-4 h-4 sm:w-5 sm:h-5", item.color)} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-60 mb-0.5">{item.label}</p>
                          <p className="text-base sm:text-lg font-black text-white tracking-tighter">
                            {typeof item.value === 'number' ? formatCurrency(item.value) : item.value}
                          </p>
                        </div>
                      </div>
                    </Spotlight>
                  </HoverScale>
                </AnimateItem>
              ))}
            </div>
          </div>

          {/* Baseline Breakdown */}
          {profile.expenseBreakdown.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Fixed Expenses</h3>
              <Spotlight className="glass-card-3d p-5 sm:p-6 border-white/5" color="hsla(217, 91%, 60%, 0.05)">
                <AnimateList className="space-y-4 relative z-10">
                  {profile.expenseBreakdown.map((expense) => (
                    <AnimateItem key={expense.id} className="flex items-center justify-between group">
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm text-white group-hover:text-primary transition-colors">{expense.name}</p>
                        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">{expense.category}</p>
                      </div>
                      <p className="font-black text-sm text-white">{formatCurrency(expense.amount)}</p>
                    </AnimateItem>
                  ))}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Total Monthly Expenses</p>
                    <p className="font-black text-base sm:text-lg text-primary tracking-tighter shimmer-text">{formatCurrency(totalExpenses)}</p>
                  </div>
                </AnimateList>
              </Spotlight>
            </div>
          )}

          {/* System Actions */}
          <div className="space-y-3 pt-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground px-1">Quick Actions</h3>
            <div className="space-y-3">
              <HoverScale>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-14 bg-white/5 border border-white/5 rounded-2xl px-6 hover:bg-primary/10 hover:border-primary/20 group transition-all"
                  onClick={() => navigate("/settings")}
                >
                  <span className="flex items-center gap-4">
                    <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                    <span className="font-black text-xs uppercase tracking-widest text-white">Settings</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </HoverScale>

              <HoverScale>
                <Button
                  variant="ghost"
                  className="w-full justify-between h-14 bg-white/5 border border-white/5 rounded-2xl px-6 hover:bg-primary/10 hover:border-primary/20 group transition-all"
                  onClick={handleDownloadReport}
                >
                  <span className="flex items-center gap-4">
                    <FileDown className="w-5 h-5 text-primary" />
                    <span className="font-black text-xs uppercase tracking-widest text-white">Download Report</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Button>
              </HoverScale>

              <HoverScale>
                <Button
                  variant="ghost"
                  onClick={() => setAlertOpen(true)}
                  className="w-full justify-between h-14 bg-destructive/5 border border-destructive/10 rounded-2xl px-6 hover:bg-destructive/10 hover:border-destructive/20 group transition-all"
                >
                  <span className="flex items-center gap-4">
                    <LogOut className="w-5 h-5 text-destructive" />
                    <span className="font-black text-xs uppercase tracking-widest text-destructive">Reset All Data</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-destructive/40" />
                </Button>
              </HoverScale>
            </div>
          </div>
        </main>

        <BottomNav />
      </div>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent className="rounded-[2.5rem] border-white/10 bg-background/95 backdrop-blur-xl p-8 z-[100] w-[90vw] max-w-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black text-xl tracking-tight text-white text-center">Reset All Data?</AlertDialogTitle>
            <AlertDialogDescription className="font-medium text-center text-muted-foreground">
              This can't be undone. All your profile, goals, and spending data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 mt-6">
            <AlertDialogAction
              onClick={handleLogout}
              className="w-full h-12 bg-destructive hover:bg-destructive/90 rounded-2xl font-black text-xs uppercase tracking-widest text-white"
            >
              Yes, Reset
            </AlertDialogAction>
            <AlertDialogCancel className="w-full h-12 border-white/10 rounded-2xl font-bold text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AnimatePage>
  );
}
