import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FloatingOrbs } from "@/components/effects/FloatingOrbs";
import { AnimatePage, HoverScale } from "@/components/effects/AnimatePage";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <AnimatePage>
      <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden p-6">
        <FloatingOrbs variant="intense" />

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-destructive/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="w-24 h-24 rounded-3xl bg-secondary border border-white/10 flex items-center justify-center mx-auto shadow-2xl relative z-10">
              <ShieldAlert className="w-12 h-12 text-destructive" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-6xl font-black text-white tracking-tighter shimmer-text">404</h1>
            <p className="text-xl font-bold text-white/80 tracking-tight">Page not found</p>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest opacity-60">
              The coordinates <code className="text-destructive bg-destructive/10 px-2 py-0.5 rounded">{location.pathname}</code> do not exist in the databanks.
            </p>
          </div>

          <HoverScale>
            <Button
              onClick={() => navigate("/")}
              className="btn-3d px-10 bg-primary font-black uppercase tracking-widest text-xs h-14 rounded-2xl w-full"
            >
              Return to Base
            </Button>
          </HoverScale>
        </div>
      </div>
    </AnimatePage>
  );
};

export default NotFound;
