import { useState, useCallback, useMemo } from "react";
import type { UserProfile, FinancialVibe, ExpenseItem, DerivedFinancials, Goal, CurrencyCode, MonthlyExpenseEntry, Subscription, Bill } from "@/lib/types";

const STORAGE_KEY = "clarity-user-profile";

const defaultProfile: UserProfile = {
  id: crypto.randomUUID(),
  name: "",
  onboardingComplete: false,
  monthlyIncome: 4000,
  fixedExpenses: 1500,
  expenseBreakdown: [],
  savingsTargetPercentage: 20,
  financialVibe: "figuring-out",
  currency: "USD",
  goals: [],
  monthlyExpenses: [],
  subscriptions: [],
  bills: [],
  createdAt: new Date().toISOString(),
};

// Get current month key like "2026-02"
function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

// Filter expenses to current month only
function getCurrentMonthExpenses(expenses: MonthlyExpenseEntry[]): MonthlyExpenseEntry[] {
  const monthKey = getCurrentMonthKey();
  return expenses.filter((e) => e.date.startsWith(monthKey));
}

// Calculate derived financial data from user profile
function calculateDerivedFinancials(profile: UserProfile): DerivedFinancials {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysLeft = daysInMonth - currentDay;

  // Calculate target savings
  const targetSavingsAmount = Math.round(profile.monthlyIncome * (profile.savingsTargetPercentage / 100));
  const availableForSpending = profile.monthlyIncome - profile.fixedExpenses - targetSavingsAmount;

  // Use real tracked variable expenses for current month
  const currentMonthExpenses = getCurrentMonthExpenses(profile.monthlyExpenses);
  const totalVariableSpent = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSpent = profile.fixedExpenses + totalVariableSpent;
  const saved = Math.max(0, profile.monthlyIncome - totalSpent);
  const actualSavingsRate = profile.monthlyIncome > 0 ? Math.round((saved / profile.monthlyIncome) * 100) : 0;

  const remainingBudget = profile.monthlyIncome - totalSpent - targetSavingsAmount;
  const dailyBudget = daysLeft > 0 ? Math.round(Math.max(0, remainingBudget) / daysLeft) : 0;

  return {
    availableForSpending,
    targetSavingsAmount,
    actualSavingsRate,
    spent: totalSpent,
    saved,
    daysInMonth,
    daysLeft,
    dailyBudget: Math.max(0, dailyBudget),
  };
}

export function useUserProfile() {
  // Initialize profile synchronously from localStorage to prevent race conditions on reload
  const [profile, setProfileState] = useState<UserProfile | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserProfile;
        // Migrate old profiles that don't have new fields
        const migrated: UserProfile = {
          ...defaultProfile,
          ...parsed,
          expenseBreakdown: parsed.expenseBreakdown ?? [],
          savingsTargetPercentage: parsed.savingsTargetPercentage ?? 20,
          currency: parsed.currency ?? "USD",
          goals: parsed.goals ?? [],
          monthlyExpenses: parsed.monthlyExpenses ?? [],
          subscriptions: parsed.subscriptions ?? [],
          bills: parsed.bills ?? [],
        };
        return migrated;
      } catch {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });

  // isLoading is always false since we load synchronously
  const [isLoading] = useState(false);


  // Save profile to localStorage
  const setProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const newProfile = { ...prev!, ...updates };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Reset profile
  const resetProfile = useCallback(() => {
    const newProfile = { ...defaultProfile, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    setProfileState(newProfile);
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(
    (data: {
      name: string;
      monthlyIncome: number;
      fixedExpenses: number;
      expenseBreakdown: ExpenseItem[];
      savingsTargetPercentage: number;
      financialVibe: FinancialVibe;
    }) => {
      setProfile({
        ...data,
        onboardingComplete: true,
      });
    },
    [setProfile]
  );

  // Calculate derived financials
  const derivedFinancials = useMemo<DerivedFinancials | null>(() => {
    if (!profile) return null;
    return calculateDerivedFinancials(profile);
  }, [profile]);

  // Update currency
  const updateCurrency = useCallback((currency: CurrencyCode) => {
    setProfile({ currency });
  }, [setProfile]);

  // Add a new goal
  const addGoal = useCallback((goal: Omit<Goal, "id" | "createdAt">) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newGoal: Goal = {
        ...goal,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      const newProfile = {
        ...prev,
        goals: [...prev.goals, newGoal],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Update an existing goal
  const updateGoal = useCallback((goalId: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === goalId ? { ...g, ...updates } : g
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Delete a goal
  const deleteGoal = useCallback((goalId: string) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        goals: prev.goals.filter((g) => g.id !== goalId),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Add extra amount to a specific goal
  const addExtraToGoal = useCallback((goalId: string, amount: number) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === goalId
            ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
            : g
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Add a monthly variable expense
  const addMonthlyExpense = useCallback((expense: Omit<MonthlyExpenseEntry, "id">) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newEntry: MonthlyExpenseEntry = {
        ...expense,
        id: crypto.randomUUID(),
      };
      const newProfile = {
        ...prev,
        monthlyExpenses: [...prev.monthlyExpenses, newEntry],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Remove a monthly variable expense
  const removeMonthlyExpense = useCallback((expenseId: string) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        monthlyExpenses: prev.monthlyExpenses.filter((e) => e.id !== expenseId),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Get current month's variable expenses
  const currentMonthExpenses = useMemo(() => {
    if (!profile) return [];
    return getCurrentMonthExpenses(profile.monthlyExpenses);
  }, [profile]);

  // ===== SUBSCRIPTION MANAGEMENT =====

  // Add a subscription
  const addSubscription = useCallback((subscription: Omit<Subscription, "id" | "createdAt">) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newSubscription: Subscription = {
        ...subscription,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      const newProfile = {
        ...prev,
        subscriptions: [...prev.subscriptions, newSubscription],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Update a subscription
  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        subscriptions: prev.subscriptions.map((s) =>
          s.id === id ? { ...s, ...updates } : s
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Delete a subscription
  const deleteSubscription = useCallback((id: string) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        subscriptions: prev.subscriptions.filter((s) => s.id !== id),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Get forgotten subscriptions (not used in 30+ days)
  const forgottenSubscriptions = useMemo(() => {
    if (!profile) return [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return profile.subscriptions.filter((sub) => {
      if (!sub.isActive) return false;
      if (!sub.lastUsed) return true; // Never used = forgotten
      return new Date(sub.lastUsed) < thirtyDaysAgo;
    });
  }, [profile]);

  // ===== BILL MANAGEMENT =====

  // Add a bill
  const addBill = useCallback((bill: Omit<Bill, "id" | "createdAt" | "isPaid">) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newBill: Bill = {
        ...bill,
        id: crypto.randomUUID(),
        isPaid: false,
        createdAt: new Date().toISOString(),
      };
      const newProfile = {
        ...prev,
        bills: [...prev.bills, newBill],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Update a bill
  const updateBill = useCallback((id: string, updates: Partial<Bill>) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        bills: prev.bills.map((b) =>
          b.id === id ? { ...b, ...updates } : b
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Delete a bill
  const deleteBill = useCallback((id: string) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        bills: prev.bills.filter((b) => b.id !== id),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Mark bill as paid
  const markBillPaid = useCallback((id: string) => {
    setProfileState((prev) => {
      if (!prev) return prev;
      const newProfile = {
        ...prev,
        bills: prev.bills.map((b) =>
          b.id === id ? { ...b, isPaid: true, lastPaidDate: new Date().toISOString() } : b
        ),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  // Get upcoming bills (due in next 7 days or overdue)
  const upcomingBills = useMemo(() => {
    if (!profile) return [];
    const today = new Date();
    const currentDay = today.getDate();

    return profile.bills.filter((bill) => {
      if (bill.isPaid) return false;

      // Calculate days until due
      let daysUntilDue = bill.dueDate - currentDay;
      if (daysUntilDue < 0) {
        // Due date passed this month - either overdue or next month
        daysUntilDue = 0; // Treat as overdue
      }

      return daysUntilDue <= bill.reminderDays;
    }).sort((a, b) => a.dueDate - b.dueDate);
  }, [profile]);

  return {
    profile,
    isLoading,
    setProfile,
    resetProfile,
    completeOnboarding,
    derivedFinancials,
    updateCurrency,
    addGoal,
    updateGoal,
    deleteGoal,
    addExtraToGoal,
    addMonthlyExpense,
    removeMonthlyExpense,
    currentMonthExpenses,
    // Subscriptions
    addSubscription,
    updateSubscription,
    deleteSubscription,
    forgottenSubscriptions,
    // Bills
    addBill,
    updateBill,
    deleteBill,
    markBillPaid,
    upcomingBills,
  };
}
