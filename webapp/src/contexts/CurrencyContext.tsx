"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { CURRENCIES, type CurrencyCode } from "@/lib/types";

interface CurrencyContextType {
  currency: CurrencyCode;
  symbol: string;
  formatCurrency: (amount: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { profile } = useUserProfile();

  const currencyCode = profile?.currency ?? "USD";
  const currencyData = CURRENCIES.find((c) => c.code === currencyCode) ?? CURRENCIES[0];

  const contextValue = useMemo<CurrencyContextType>(() => {
    const formatCurrency = (amount: number): string => {
      // Handle JPY differently (no decimals)
      const decimals = currencyCode === "JPY" ? 0 : 2;

      // Use Intl.NumberFormat for proper formatting
      try {
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: currencyCode,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format(amount);
      } catch {
        // Fallback if currency code is not supported
        return `${currencyData.symbol}${amount.toLocaleString(undefined, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}`;
      }
    };

    return {
      currency: currencyCode,
      symbol: currencyData.symbol,
      formatCurrency,
    };
  }, [currencyCode, currencyData.symbol]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
