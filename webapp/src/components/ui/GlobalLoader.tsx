import { FloatingOrbs } from "../effects/FloatingOrbs";

export function GlobalLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center relative bg-background overflow-hidden">
            <FloatingOrbs variant="default" />
            <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse" />
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin relative z-10" />
                </div>
                <p className="text-white text-sm font-black uppercase tracking-[0.3em] shimmer-text">Syncing Data</p>
            </div>
        </div>
    );
}
