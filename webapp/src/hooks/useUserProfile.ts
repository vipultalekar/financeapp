import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { UserProfile, FinancialVibe, ExpenseItem, DerivedFinancials, Goal, CurrencyCode, MonthlyExpenseEntry, Subscription, Bill, BudgetLimit, SpendingEntry, VariableExpenseCategory } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Per-user localStorage key so different users don't share local data
function getStorageKey(uid?: string): string {
  return uid ? `clarity-user-profile-${uid}` : "clarity-user-profile-guest";
}

const defaultProfile: UserProfile = {
  id: crypto.randomUUID(),
  name: "",
  onboardingComplete: false,
  monthlyIncome: 0,
  fixedExpenses: 15000,
  expenseBreakdown: [] as ExpenseItem[],
  savingsTargetPercentage: 20,
  financialVibe: "figuring-out",
  currency: "INR",
  goals: [],
  monthlyExpenses: [],
  subscriptions: [],
  bills: [],
  budgetLimits: [],
  spendingEntries: [],
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

  const targetSavingsAmount = Math.round(profile.monthlyIncome * (profile.savingsTargetPercentage / 100));
  const availableForSpending = profile.monthlyIncome - profile.fixedExpenses - targetSavingsAmount;

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

function migrateProfile(parsed: any): UserProfile {
  return {
    ...defaultProfile,
    ...parsed,
    expenseBreakdown: parsed.expenseBreakdown ?? [],
    savingsTargetPercentage: parsed.savingsTargetPercentage ?? 20,
    currency: parsed.currency ?? "INR",
    goals: parsed.goals ?? [],
    monthlyExpenses: parsed.monthlyExpenses ?? [],
    subscriptions: parsed.subscriptions ?? [],
    bills: parsed.bills ?? [],
    budgetLimits: parsed.budgetLimits ?? [],
    spendingEntries: parsed.spendingEntries ?? [],
    totalBudgetGoal: parsed.totalBudgetGoal ?? 0,
  };
}

// ====== FIRESTORE HELPERS ======

// Debounced save to Firestore
let saveTimer: ReturnType<typeof setTimeout> | null = null;

function saveToCloud(userId: string, profile: UserProfile) {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      const userRef = doc(db, "users", userId);
      const data = JSON.parse(JSON.stringify(profile));
      delete data.updatedAt; // Remove old timestamp
      await setDoc(userRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      console.log("[CloudSync] ✅ Saved to Firestore");
    } catch (err) {
      console.error("[CloudSync] ❌ Failed to save to Firestore:", err);
    }
  }, 500);
}

async function loadFromCloud(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      console.log("[CloudSync] ✅ Loaded profile from Firestore");
      return migrateProfile(snap.data());
    }
    console.log("[CloudSync] ℹ️ No cloud profile found for user");
    return null;
  } catch (err) {
    console.error("[CloudSync] ❌ Failed to load from Firestore:", err);
    return null;
  }
}

// ====== MAIN HOOK ======

// Load initial profile from localStorage synchronously to prevent blank screens
function getInitialProfile(): UserProfile {
  // Try user-specific key first (if we have a cached uid)
  const oldStored = localStorage.getItem("clarity-user-profile");
  if (oldStored) {
    try {
      return migrateProfile(JSON.parse(oldStored));
    } catch {
      // fall through
    }
  }
  return { ...defaultProfile };
}

export function useUserProfile() {
  const { user } = useAuth();
  // Initialize from localStorage synchronously — profile is NEVER null
  const [profile, setProfileState] = useState<UserProfile | null>(() => getInitialProfile());
  const [isLoading, setIsLoading] = useState(true);
  const currentUid = useRef<string | null>(null);

  // When the auth user changes (login/logout/switch), reload profile
  useEffect(() => {
    const uid = user?.uid ?? null;

    // Same user, skip reload
    if (uid === currentUid.current && profile !== null) {
      setIsLoading(false);
      return;
    }

    currentUid.current = uid;

    if (!uid) {
      // No user logged in — keep current localStorage profile
      setIsLoading(false);
      return;
    }

    // User is logged in — try to load from user-specific localStorage first (instant)
    const key = getStorageKey(uid);
    const localStored = localStorage.getItem(key);
    if (localStored) {
      try {
        const parsed = migrateProfile(JSON.parse(localStored));
        setProfileState(parsed);
        // If we found a local profile for this user, we can stop loading early to prevent jank
        setIsLoading(false);
      } catch {
        // keep existing profile
      }
    } else {
      // Check old non-uid key for migration from old version
      const oldStored = localStorage.getItem("clarity-user-profile");
      if (oldStored) {
        try {
          const oldProfile = migrateProfile(JSON.parse(oldStored));
          setProfileState(oldProfile);
          localStorage.setItem(key, JSON.stringify(oldProfile));
          // Found legacy data, unblock UI
          setIsLoading(false);
        } catch {
          // keep existing profile
        }
      }
    }

    // Then load from Firestore (async) — cloud overrides local
    let cancelled = false;

    (async () => {
      const cloudProfile = await loadFromCloud(uid);

      if (cancelled) return;

      if (cloudProfile) {
        // Cloud data exists → merge with local if necessary (don't let stale cloud data revert onboarding)
        setProfileState((prev) => {
          if (prev?.onboardingComplete && !cloudProfile.onboardingComplete) {
            console.log("[CloudSync] ℹ️ Cloud is stale regarding onboarding, keeping local 'complete' status");
            return { ...cloudProfile, onboardingComplete: true };
          }
          return cloudProfile;
        });
        localStorage.setItem(getStorageKey(uid), JSON.stringify(cloudProfile));
      } else {
        // No cloud data → push current local profile to cloud
        const currentKey = getStorageKey(uid);
        const currentStored = localStorage.getItem(currentKey);
        if (currentStored) {
          try {
            const localProfile = migrateProfile(JSON.parse(currentStored));
            saveToCloud(uid, localProfile);
            console.log("[CloudSync] ℹ️ Pushed local profile to cloud");
          } catch {
            // ignored
          }
        }
      }

      if (!cancelled) setIsLoading(false);
    })();



    return () => { cancelled = true; };
  }, [user?.uid]);

  // Save profile to localStorage and Firestore
  const persistProfile = useCallback((newProfile: UserProfile) => {
    const uid = user?.uid;
    const key = getStorageKey(uid);
    localStorage.setItem(key, JSON.stringify(newProfile));
    if (uid) {
      saveToCloud(uid, newProfile);
    }
  }, [user?.uid]);

  const setProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState((prev) => {
      const newProfile = { ...prev!, ...updates };
      persistProfile(newProfile);
      return newProfile;
    });
  }, [persistProfile]);

  // Internal setter for complex updates
  const setProfileFull = useCallback((updater: (prev: UserProfile | null) => UserProfile | null) => {
    setProfileState((prev) => {
      const newProfile = updater(prev);
      if (newProfile) {
        persistProfile(newProfile);
      }
      return newProfile;
    });
  }, [persistProfile]);

  // Reset profile
  const resetProfile = useCallback(() => {
    const uid = user?.uid;
    const key = getStorageKey(uid);
    localStorage.removeItem(key);
    const newProfile = { ...defaultProfile, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(newProfile));
    setProfileState(newProfile);
    if (uid) {
      saveToCloud(uid, newProfile);
    }
  }, [user?.uid]);

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

  // ===== GOAL MANAGEMENT =====

  const addGoal = useCallback((goal: Omit<Goal, "id" | "createdAt">) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      const newGoal: Goal = { ...goal, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      return { ...prev, goals: [...prev.goals, newGoal] };
    });
  }, [setProfileFull]);

  const updateGoal = useCallback((goalId: string, updates: Partial<Omit<Goal, "id" | "createdAt">>) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return { ...prev, goals: prev.goals.map((g) => g.id === goalId ? { ...g, ...updates } : g) };
    });
  }, [setProfileFull]);

  const deleteGoal = useCallback((goalId: string) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return { ...prev, goals: prev.goals.filter((g) => g.id !== goalId) };
    });
  }, [setProfileFull]);

  const addExtraToGoal = useCallback((goalId: string, amount: number) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === goalId ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g
        ),
      };
    });
  }, [setProfileFull]);

  // ===== MONTHLY EXPENSE MANAGEMENT =====

  const addMonthlyExpense = useCallback((expense: Omit<MonthlyExpenseEntry, "id">) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      const newEntry: MonthlyExpenseEntry = { ...expense, id: crypto.randomUUID() };
      return { ...prev, monthlyExpenses: [...prev.monthlyExpenses, newEntry] };
    });
  }, [setProfileFull]);

  const removeMonthlyExpense = useCallback((expenseId: string) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return { ...prev, monthlyExpenses: prev.monthlyExpenses.filter((e) => e.id !== expenseId) };
    });
  }, [setProfileFull]);

  const updateMonthlyExpense = useCallback((expenseId: string, updates: Partial<Omit<MonthlyExpenseEntry, "id">>) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return { ...prev, monthlyExpenses: prev.monthlyExpenses.map((e) => e.id === expenseId ? { ...e, ...updates } : e) };
    });
  }, [setProfileFull]);

  const currentMonthExpenses = useMemo(() => {
    if (!profile) return [];
    return getCurrentMonthExpenses(profile.monthlyExpenses);
  }, [profile]);

  // ===== SUBSCRIPTION MANAGEMENT =====

  const addSubscription = useCallback((subscription: Omit<Subscription, "id" | "createdAt">) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      const newSub: Subscription = { ...subscription, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
      return { ...prev, subscriptions: [...prev.subscriptions, newSub] };
    });
  }, [setProfileFull]);

  const updateSubscription = useCallback((id: string, updates: Partial<Subscription>) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return { ...prev, subscriptions: prev.subscriptions.map((s) => s.id === id ? { ...s, ...updates } : s) };
    });
  }, [setProfileFull]);

  const deleteSubscription = useCallback((id: string) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return { ...prev, subscriptions: prev.subscriptions.filter((s) => s.id !== id) };
    });
  }, [setProfileFull]);

  const forgottenSubscriptions = useMemo(() => {
    if (!profile) return [];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return profile.subscriptions.filter((sub) => {
      if (!sub.isActive) return false;
      if (!sub.lastUsed) return true;
      return new Date(sub.lastUsed) < thirtyDaysAgo;
    });
  }, [profile]);

  // ===== BILL MANAGEMENT =====

  const addBill = useCallback((bill: Omit<Bill, "id" | "createdAt" | "isPaid">) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      const newBill: Bill = { ...bill, id: crypto.randomUUID(), isPaid: false, createdAt: new Date().toISOString() };
      return { ...prev, bills: [...prev.bills, newBill] };
    });
  }, [setProfileFull]);

  const updateBill = useCallback((id: string, updates: Partial<Bill>) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return { ...prev, bills: prev.bills.map((b) => b.id === id ? { ...b, ...updates } : b) };
    });
  }, [setProfileFull]);

  const deleteBill = useCallback((id: string) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return { ...prev, bills: prev.bills.filter((b) => b.id !== id) };
    });
  }, [setProfileFull]);

  const markBillPaid = useCallback((id: string) => {
    setProfileFull((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        bills: prev.bills.map((b) =>
          b.id === id ? { ...b, isPaid: true, lastPaidDate: new Date().toISOString() } : b
        ),
      };
    });
  }, [setProfileFull]);

  const upcomingBills = useMemo(() => {
    if (!profile) return [];
    const today = new Date();
    const currentDay = today.getDate();
    return profile.bills.filter((bill) => {
      if (bill.isPaid) return false;
      let daysUntilDue = bill.dueDate - currentDay;
      if (daysUntilDue < 0) daysUntilDue = 0;
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
    updateMonthlyExpense,
    currentMonthExpenses,
    addSubscription,
    updateSubscription,
    deleteSubscription,
    forgottenSubscriptions,
    addBill,
    updateBill,
    deleteBill,
    markBillPaid,
    upcomingBills,
    // Budgets
    addBudgetCategory: (category: Omit<BudgetLimit, "id" | "spent" | "createdAt" | "spendingEntries">) => {
      setProfileFull((prev) => {
        if (!prev) return prev;
        const newBudget: BudgetLimit = { ...category, id: crypto.randomUUID(), spent: 0, createdAt: new Date().toISOString() };
        return { ...prev, budgetLimits: [...prev.budgetLimits, newBudget] };
      });
    },
    updateBudgetCategory: (id: string, updates: Partial<BudgetLimit>) => {
      setProfileFull((prev) => {
        if (!prev) return prev;
        return { ...prev, budgetLimits: prev.budgetLimits.map((b) => (b.id === id ? { ...b, ...updates } : b)) };
      });
    },
    deleteBudgetCategory: (id: string) => {
      setProfileFull((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          budgetLimits: prev.budgetLimits.filter((b) => b.id !== id),
          spendingEntries: prev.spendingEntries.filter((e) => e.budgetId !== id),
        };
      });
    },
    addSpendingEntry: (entry: Omit<SpendingEntry, "id" | "createdAt">) => {
      setProfileFull((prev) => {
        if (!prev) return prev;
        const newEntry: SpendingEntry = { ...entry, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        const newSpendingEntries = [...prev.spendingEntries, newEntry];
        const newBudgetLimits = prev.budgetLimits.map((b) => {
          if (b.id === entry.budgetId) {
            const budgetEntries = newSpendingEntries.filter((e) => e.budgetId === b.id);
            const spent = budgetEntries.reduce((sum, e) => sum + e.amount, 0);
            return { ...b, spent };
          }
          return b;
        });
        return {
          ...prev,
          spendingEntries: newSpendingEntries,
          budgetLimits: newBudgetLimits,
          monthlyExpenses: [
            ...prev.monthlyExpenses,
            { id: newEntry.id, name: newEntry.description, amount: newEntry.amount, category: "other" as VariableExpenseCategory, date: newEntry.date }
          ]
        };
      });
    },
    updateSpendingEntry: (id: string, updates: Partial<SpendingEntry>) => {
      setProfileFull((prev) => {
        if (!prev) return prev;
        const newSpendingEntries = prev.spendingEntries.map((e) => (e.id === id ? { ...e, ...updates } : e));
        const newBudgetLimits = prev.budgetLimits.map((b) => {
          const budgetEntries = newSpendingEntries.filter((e) => e.budgetId === b.id);
          const spent = budgetEntries.reduce((sum, e) => sum + e.amount, 0);
          return { ...b, spent };
        });
        return {
          ...prev,
          spendingEntries: newSpendingEntries,
          budgetLimits: newBudgetLimits,
          monthlyExpenses: prev.monthlyExpenses.map((me) => {
            if (me.id === id) {
              const updatedEntry = newSpendingEntries.find(e => e.id === id);
              return updatedEntry ? { ...me, name: updatedEntry.description, amount: updatedEntry.amount, date: updatedEntry.date } : me;
            }
            return me;
          })
        };
      });
    },
    deleteSpendingEntry: (id: string) => {
      setProfileFull((prev) => {
        if (!prev) return prev;
        const newSpendingEntries = prev.spendingEntries.filter((e) => e.id !== id);
        const newBudgetLimits = prev.budgetLimits.map((b) => {
          const budgetEntries = newSpendingEntries.filter((e) => e.budgetId === b.id);
          const spent = budgetEntries.reduce((sum, e) => sum + e.amount, 0);
          return { ...b, spent };
        });
        return {
          ...prev,
          spendingEntries: newSpendingEntries,
          budgetLimits: newBudgetLimits,
          monthlyExpenses: prev.monthlyExpenses.filter((me) => me.id !== id)
        };
      });
    },
    setTotalBudgetGoal: (goal: number) => {
      setProfile({ totalBudgetGoal: goal });
    }
  };
}
