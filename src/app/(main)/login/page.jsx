"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { toast } from "@/lib/toast";
import { useAuth } from "@/lib/AuthContext";

// Bypass the HeroUI umbrella package to prevent invisible rendering bugs
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";

export default function LoginPage() {
    const router = useRouter();
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

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, isLoading, router]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
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
                email: formData.email.trim(),
                password: formData.password,
            });

            if (result.error) {
                toast.error(result.error.message || "Invalid email or password");
                setErrors({ general: "Invalid email or password" });
                return;
            }

            toast.success("Welcome back to PetNest!");
            router.replace("/");
        } catch (error) {
            toast.error(error.message || "Login failed. Please try again.");
            setErrors({ general: "Login failed. Please try again." });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signIn.social({
                provider: "google",
                callbackURL: "/",
            });
        } catch (error) {
            toast.error("Google sign-in failed. Please try again.");
            setIsGoogleLoading(false);
        }
    };

    if (!mounted || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Spinner size="lg" className="text-[#d9f99d]" color="current" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-start justify-center pt-20 pb-10 px-6 relative overflow-hidden">
            {/* Decorative Background Blobs */}
            <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(217,249,157,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-[5%] -right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] pointer-events-none" />

            <div className="w-full max-w-[480px] py-5 z-10 relative">
                {/* Header Section */}
                <div className="text-center mb-9">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 no-underline mb-7 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-9 h-9 bg-[#d9f99d] rounded-xl flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            PetNest
                        </span>
                    </Link>

                    <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2 uppercase">
                        Welcome Back
                    </h1>
                    <p className="text-sm text-default-500">
                        Sign in to continue your adoption journey
                    </p>
                </div>

                {/* Form Wrapper Card */}
                <Card className="bg-content1 border border-default-200 shadow-sm relative overflow-visible w-full block">
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#d9f99d]/30 to-transparent rounded-t-xl" />

                    <CardBody className="p-8">
                        <Button
                            onPress={handleGoogleSignIn}
                            isLoading={isGoogleLoading}
                            variant="bordered"
                            className="w-full h-12 mb-6 border-default-200 text-foreground font-semibold flex items-center justify-center gap-2.5 transition-colors hover:bg-default-100"
                        >
                            {!isGoogleLoading && (
                                <svg width="18" height="18" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            {isGoogleLoading ? "Signing in..." : "Continue with Google"}
                        </Button>

                        <div className="flex items-center gap-4 mb-6">
                            <Divider className="flex-1" />
                            <span className="text-xs text-default-400 font-medium whitespace-nowrap">
                                or sign in with email
                            </span>
                            <Divider className="flex-1" />
                        </div>

                        {errors.general && (
                            <div className="bg-danger/10 border border-danger/20 rounded-md p-3 mb-5 flex items-center gap-2.5">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-danger shrink-0">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span className="text-[13px] text-danger">
                                    {errors.general}
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            {/* Email Input */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="login-email" className="text-[13px] font-semibold text-foreground">
                                    Email Address
                                </label>
                                <Input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    color={errors.email ? "danger" : "default"}
                                    startContent={
                                        <svg className="text-default-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    }
                                />
                                {errors.email && <span className="text-[11px] text-danger">{errors.email}</span>}
                            </div>

                            {/* Password Input */}
                            <div className="flex flex-col gap-1.5 pb-2">
                                <label htmlFor="login-password" className="text-[13px] font-semibold text-foreground">
                                    Password
                                </label>
                                <Input
                                    id="login-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    color={errors.password ? "danger" : "default"}
                                    startContent={
                                        <svg className="text-default-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    }
                                    endContent={
                                        <button
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (
                                                <svg className="text-default-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            ) : (
                                                <svg className="text-default-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    }
                                />
                                {errors.password && <span className="text-[11px] text-danger">{errors.password}</span>}
                            </div>

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                className="w-full h-12 bg-[#d9f99d] text-black text-[13px] font-bold tracking-wider uppercase transition-all hover:bg-[#c9f17d] hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(217,249,157,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>

                        <p className="text-center mt-6 text-[13px] text-default-500">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-[#d9f99d] font-semibold no-underline hover:underline">
                                Register now
                            </Link>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}