"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WelcomeStep } from "@/components/onboarding/WelcomeStep";
import { InputsStep } from "@/components/onboarding/InputsStep";
import { AIIntroStep } from "@/components/onboarding/AIIntroStep";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { FinancialVibe, ExpenseItem } from "@/lib/types";

type OnboardingStep = "welcome" | "inputs" | "intro";

interface OnboardingData {
  name: string;
  monthlyIncome: number;
  fixedExpenses: number;
  expenseBreakdown: ExpenseItem[];
  savingsTargetPercentage: number;
  financialVibe: FinancialVibe;
}

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>("welcome");
  const [data, setData] = useState<OnboardingData | null>(null);
  const { completeOnboarding } = useUserProfile();
  const navigate = useNavigate();

  const handleInputsComplete = (inputData: OnboardingData) => {
    setData(inputData);
    setStep("intro");
  };

  const handleComplete = () => {
    if (data) {
      completeOnboarding(data);
      // Small delay to ensure localStorage write completes before navigation
      setTimeout(() => {
        navigate("/");
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {step === "welcome" ? (
        <WelcomeStep onNext={() => setStep("inputs")} />
      ) : step === "inputs" ? (
        <InputsStep
          onNext={handleInputsComplete}
          onBack={() => setStep("welcome")}
        />
      ) : (
        <AIIntroStep
          name={data?.name ?? ""}
          onComplete={handleComplete}
          onBack={() => setStep("inputs")}
        />
      )}
    </div>
  );
}
