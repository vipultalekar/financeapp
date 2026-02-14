import { Suspense, lazy, useState } from "react";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GlobalLoader } from "@/components/ui/GlobalLoader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const Insights = lazy(() => import("./pages/Insights"));
const Goals = lazy(() => import("./pages/Goals"));
const Learn = lazy(() => import("./pages/Learn"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const MoneyTracker = lazy(() => import("./pages/MoneyTracker"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CurrencyProvider>
            <Sonner />
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            <BrowserRouter>
              <Suspense fallback={<GlobalLoader />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                  <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                  <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
                  <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
                  <Route path="/learn" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                  <Route path="/money-tracker" element={<ProtectedRoute><MoneyTracker /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CurrencyProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

