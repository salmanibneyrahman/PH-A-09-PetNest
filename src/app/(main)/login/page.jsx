"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { generateAndStoreToken } from "@/lib/api";
import { toast } from "@/lib/toast";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { isAuthenticated, isLoading } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mounted, setMounted] = useState(false);

    const callbackUrl = searchParams.get("callbackUrl") || "/";

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace(callbackUrl);
        }
    }, [isAuthenticated, isLoading, router, callbackUrl]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            const result = await signIn.email({
                email: formData.email,
                password: formData.password,
            });

            if (result.error) {
                toast.error(result.error.message || "Invalid email or password");
                setErrors({ general: result.error.message || "Invalid credentials" });
                return;
            }

            await generateAndStoreToken(formData.email);
            toast.success("Welcome back to PetNest!");
            router.replace(callbackUrl);
        } catch (error) {
            toast.error(error.message || "Login failed. Please try again.");
            setErrors({ general: error.message || "Login failed" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signIn.social({
                provider: "google",
                callbackURL: callbackUrl,
            });
        } catch (error) {
            toast.error("Google sign-in failed. Please try again.");
            setIsGoogleLoading(false);
        }
    };

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="w-10 h-10 border-3 border-zinc-800 border-t-[var(--vibrant-lime)] rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center px-6 py-20 relative overflow-hidden select-none">
            {/* Background Glowing Ambient Orbs */}
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(173,255,47,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(138,43,226,0.04)_0%,transparent_70%)] pointer-events-none" />

            <div className={`w-full max-w-[440px] transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                {/* Header Section */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-2.5 no-underline mb-8 group">
                        <div className="w-9 h-9 bg-[var(--vibrant-lime)] rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Pet<span className="text-[var(--vibrant-lime)]">Nest</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">
                        Welcome back
                    </h1>
                    <p className="text-sm text-zinc-500 uppercase tracking-wide">
                        Sign in to continue your adoption journey
                    </p>
                </div>
            </div>
        </div>)
    {/* Main Card Interface */ }
    <div className="bg-[#0A0A0A] border border-zinc-900 rounded-2xl p-8 relative shadow-2xl group hover:border-zinc-800/80 transition-all duration-300">
        {/* Neon Top Decorative Line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(173,255,47,0.3)] to-transparent rounded-t-2xl" />

        {/* Google Identity Provider Connection Button */}
        <button
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading}
            className="w-full py-3 bg-[#111111] border border-zinc-800 rounded-lg text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all duration-200 mb-6 hover:bg-[#161616] hover:border-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isGoogleLoading ? (
                <div className="w-[18px] h-[18px] border-2 border-zinc-700 border-t-white rounded-full animate-spin" />
            ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
            )}
            {isGoogleLoading ? "Signing in..." : "Continue with Google"}
        </button>
    </div>

    {/* Separator Layer */ }
    <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-[1px] bg-zinc-900" />
        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest whitespace-nowrap">
            or continue with email
        </span>
        <div className="flex-1 h-[1px] bg-zinc-900" />
    </div>

    {/* Validation General Error Notification */ }
    {
        errors.general && (
            <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg mb-5 flex items-center gap-2.5 animate-fadeIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="text-xs font-semibold text-red-400">
                    {errors.general}
                </span>
            </div>
        )
    }

    {/* Core Input Credentials Processing Form */ }
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2" htmlFor="email">
                Email Address
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                </div>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="operator@petnest.io"
                    autoComplete="email"
                    className={`w-full bg-black border text-white pl-11 pr-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-zinc-800 focus:border-[var(--vibrant-lime)] focus:ring-[var(--vibrant-lime)]"
                        }`}
                />
            </div>
            {errors.email && (
                <p className="text-[11px] text-red-400 font-medium mt-1.5 pl-1">{errors.email}</p>
            )}
        </div>

        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2" htmlFor="password">
                Password
            </label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                </div>
                <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className={`w-full bg-black border text-white pl-11 pr-12 py-3 rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.password
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-zinc-800 focus:border-[var(--vibrant-lime)] focus:ring-[var(--vibrant-lime)]"
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors duration-200 bg-transparent border-none p-0 flex items-center justify-center cursor-pointer focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                >
                    {showPassword ? (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                    ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                    )}
                </button>
            </div>
            {errors.password && (
                <p className="text-[11px] text-red-400 font-medium mt-1.5 pl-1">{errors.password}</p>
            )}
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-lg text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border-none transition-all duration-300 transform active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none glow-btn-lime"
        >
            {isSubmitting ? (
                <>
                    <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing In...
                </>
            ) : (
                "Sign In"
            )}
        </button>
    </form>
    {/* Footer Routing Interface */ }
    <p className="text-center mt-6 text-xs text-zinc-500 font-medium tracking-wide">
        Don't have an account?{" "}
        <Link href="/register" className="text-[var(--vibrant-lime)] font-bold no-underline transition-opacity duration-200 hover:opacity-80 uppercase text-[11px] ml-1 tracking-wider">
            Create account
        </Link>
    </p>
}