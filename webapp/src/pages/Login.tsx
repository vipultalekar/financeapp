"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, TrendingUp, PiggyBank, Shield, ArrowRight, Mail, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';
import { motion } from 'framer-motion';
import { HoverScale, FloatAnimation } from '@/components/effects/AnimatePage';
import { Spotlight } from '@/components/effects/Spotlight';
import { Logo } from "@/components/global/Logo";

const Login = () => {
    const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            toast.success('Welcome back!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmail(email, password);
            toast.success('Signed in successfully!');
            navigate('/');
        } catch (error: any) {
            toast.error(error.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signUpWithEmail(email, password);
            toast.success('Account created!');
            navigate('/onboarding');
        } catch (error: any) {
            toast.error(error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-[#07090e]">
            {/* Dynamic Background Elements */}
            <FloatingOrbs variant="default" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.05)_0%,transparent_50%)]" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center max-w-lg mx-auto py-12 w-full">
                {/* Animated Logo Assembly */}
                <FloatAnimation>
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 rounded-[2rem] bg-primary/20 blur-[60px] scale-150 animate-pulse" />

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="relative"
                        >
                            <Spotlight
                                className="relative w-24 h-24 rounded-[2.5rem] bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.2)] overflow-hidden group"
                                color="hsla(217, 91%, 60%, 0.3)"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 opacity-50" />
                                <Logo size="lg" className="relative z-10 transition-all duration-700 group-hover:scale-110" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                            </Spotlight>

                            {/* Orbital Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-3 rounded-[3rem] border border-dashed border-primary/20 opacity-40 pointer-events-none"
                            />
                        </motion.div>
                    </div>
                </FloatAnimation>

                {/* Hero Typography */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-6"
                >
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-[0.85] text-white mb-3">
                        <span className="block shimmer-text">RUPIYO</span>
                    </h1>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px w-8 bg-gradient-to-r from-transparent to-primary/50" />
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] text-primary">Your Money, Your Way</span>
                        <div className="h-px w-8 bg-gradient-to-l from-transparent to-primary/50" />
                    </div>
                </motion.div>

                {/* Google Sign In - Primary CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="w-full max-w-sm mb-6"
                >
                    <HoverScale>
                        <Button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={loading}
                            className="w-full h-14 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 text-white font-black uppercase tracking-[0.1em] text-xs transition-all duration-500 shadow-[0_15px_40px_rgba(37,99,235,0.1)] group"
                        >
                            <svg className="w-5 h-5 mr-3 transition-transform duration-500 group-hover:scale-110" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            {loading ? 'Signing in...' : 'Continue with Google'}
                        </Button>
                    </HoverScale>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="w-full max-w-sm flex items-center gap-4 mb-6"
                >
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/10" />
                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/40">Or use credentials</span>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/10" />
                </motion.div>

                {/* Email/Password Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="w-full max-w-sm"
                >
                    <Spotlight className="glass-card-3d p-6 space-y-5">
                        {/* Mode Toggle */}
                        <div className="flex items-center bg-white/5 rounded-xl border border-white/5 p-1">
                            <button
                                onClick={() => setMode('signin')}
                                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'signin'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setMode('signup')}
                                className={`flex-1 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${mode === 'signup'
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <form onSubmit={mode === 'signin' ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    <Mail className="w-3 h-3 inline mr-1.5 opacity-60" />
                                    Email
                                </Label>
                                <Input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/5 border-white/5 h-12 rounded-xl text-sm font-bold placeholder:text-muted-foreground/30 focus:border-primary/30 focus:ring-primary/10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                                    <Lock className="w-3 h-3 inline mr-1.5 opacity-60" />
                                    Password
                                </Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    className="bg-white/5 border-white/5 h-12 rounded-xl text-sm font-bold placeholder:text-muted-foreground/30 focus:border-primary/30 focus:ring-primary/10"
                                />
                            </div>

                            <HoverScale>
                                <Button
                                    type="submit"
                                    className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase tracking-[0.15em] text-[10px] transition-all duration-500 shadow-[0_15px_40px_rgba(37,99,235,0.25)] btn-3d overflow-hidden group"
                                    disabled={loading}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                                    <span className="relative z-10 flex items-center justify-center">
                                        <LogIn className="w-4 h-4 mr-2" />
                                        {loading
                                            ? 'Processing...'
                                            : mode === 'signin'
                                                ? 'Sign In'
                                                : 'Sign Up'}
                                    </span>
                                </Button>
                            </HoverScale>
                        </form>
                    </Spotlight>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap justify-center gap-2 mt-8"
                >
                    <FeaturePill icon={TrendingUp} text="Smart Insights" color="text-primary" />
                    <FeaturePill icon={PiggyBank} text="Savings Goals" color="text-accent" />
                    <FeaturePill icon={Shield} text="100% Private" color="text-white" />
                </motion.div>

                {/* Status Indicators */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="mt-10 flex flex-col items-center gap-3"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Your data is safe & encrypted</span>
                    </div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
                        Encrypted end-to-end · Cloud synced
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

function FeaturePill({ icon: Icon, text, color }: { icon: typeof TrendingUp; text: string; color: string }) {
    return (
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-3xl">
            <Icon className={`w-3.5 h-3.5 ${color}`} />
            <span className="text-[8px] font-black uppercase tracking-[0.15em] text-white/80">{text}</span>
        </div>
    );
}

export default Login;
