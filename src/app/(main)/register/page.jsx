"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { generateAndStoreToken, registerUserInDB } from "@/lib/api";
import { toast } from "@/lib/toast";
import { useAuth } from "@/lib/AuthContext";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Spinner } from "@heroui/spinner";

export default function RegisterPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        photoURL: "",
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({
        hasMinLength: false,
        hasUppercase: false,
        hasLowercase: false,
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace("/");
        }
    }, [isAuthenticated, isLoading, router]);

    useEffect(() => {
        setPasswordStrength({
            hasMinLength: formData.password.length >= 6,
            hasUppercase: /[A-Z]/.test(formData.password),
            hasLowercase: /[a-z]/.test(formData.password),
        });
    }, [formData.password]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Full name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.photoURL && formData.photoURL.trim()) {
            try {
                new URL(formData.photoURL);
            } catch {
                newErrors.photoURL = "Please enter a valid URL";
            }
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else {
            if (formData.password.length < 6) {
                newErrors.password = "Password must be at least 6 characters";
            } else if (!/[A-Z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one uppercase letter";
            } else if (!/[a-z]/.test(formData.password)) {
                newErrors.password = "Password must contain at least one lowercase letter";
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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
            const result = await signUp.email({
                name: formData.name.trim(),
                email: formData.email.trim(),
                password: formData.password,
                image: formData.photoURL.trim() || undefined,
            });

            if (result.error) {
                toast.error(result.error.message || "Registration failed");
                setErrors({ general: result.error.message || "Registration failed" });
                return;
            }

            try {
                await registerUserInDB({
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    photoURL: formData.photoURL.trim() || "",
                });
            } catch (dbError) {
                console.error("DB registration error (non-critical):", dbError);
            }

            await generateAndStoreToken(formData.email.trim());
            toast.success("Account created successfully! Welcome to PetNest.");
            router.replace("/");
        } catch (error) {
            toast.error(error.message || "Registration failed. Please try again.");
            setErrors({ general: error.message || "Registration failed" });
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

    const PasswordRequirement = ({ met, text }) => (
        <div
            className={`flex items-center gap-1.5 text-xs transition-colors duration-200 ${met ? "text-success" : "text-default-400"
                }`}
        >
            <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${met
                    ? "bg-success/15 border border-success/40"
                    : "bg-default-100 border border-default-200"
                    }`}
            >
                {met && (
                    <svg
                        width="8"
                        height="8"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-success"
                    >
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                )}
            </div>
            {text}
        </div>
    );

    const isConfirmSuccess =
        formData.confirmPassword &&
        formData.password === formData.confirmPassword &&
        !errors.confirmPassword;

    return (
        <div className="min-h-screen bg-background flex items-start justify-center pt-20 pb-10 px-6 relative overflow-hidden">
            <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(217,249,157,0.05)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-[5%] -right-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] pointer-events-none" />

            <div
                className={`w-full max-w-[480px] py-5 transition-all duration-400 ease-in-out ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
            >
                <div className="text-center mb-9">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2.5 no-underline mb-7 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-9 h-9 bg-[#d9f99d] rounded-xl flex items-center justify-center">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#000"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-foreground tracking-tight">
                            PetNest
                        </span>
                    </Link>

                    <h1 className="text-2xl font-bold text-foreground tracking-tight mb-2">
                        Create your account
                    </h1>
                    <p className="text-sm text-default-500">
                        Join thousands of families finding their perfect companion
                    </p>
                </div>

                <Card className="bg-content1 border border-default-200 shadow-sm relative overflow-visible">
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
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                            )}
                            {isGoogleLoading ? "Signing up..." : "Continue with Google"}
                        </Button>

                        <div className="flex items-center gap-4 mb-6">
                            <Divider className="flex-1" />
                            <span className="text-xs text-default-400 font-medium whitespace-nowrap">
                                or register with email
                            </span>
                            <Divider className="flex-1" />
                        </div>

                        {errors.general && (
                            <div className="bg-danger/10 border border-danger/20 rounded-md p-3 mb-5 flex items-center gap-2.5">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-danger shrink-0"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span className="text-[13px] text-danger">
                                    {errors.general}
                                </span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} noValidate className="space-y-6">
                            {/* Full Name */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="name" className="text-[13px] font-semibold text-foreground">
                                    Full Name
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Your full name"
                                    autoComplete="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    color={errors.name ? "danger" : "default"}
                                    classNames={{
                                        innerWrapper: "flex items-center gap-2",
                                        input: "pl-1"
                                    }}
                                    startContent={
                                        <svg className="text-default-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    }
                                />
                                {errors.name && <span className="text-[11px] text-danger">{errors.name}</span>}
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="reg-email" className="text-[13px] font-semibold text-foreground">
                                    Email Address
                                </label>
                                <Input
                                    id="reg-email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    color={errors.email ? "danger" : "default"}
                                    classNames={{
                                        innerWrapper: "flex items-center gap-2",
                                        input: "pl-1"
                                    }}
                                    startContent={
                                        <svg className="text-default-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    }
                                />
                                {errors.email && <span className="text-[11px] text-danger">{errors.email}</span>}
                            </div>

                            {/* Photo URL */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="photoURL" className="text-[13px] font-semibold text-foreground">
                                    Photo URL <span className="text-[11px] font-normal text-default-400 tracking-normal">(optional)</span>
                                </label>
                                <Input
                                    id="photoURL"
                                    name="photoURL"
                                    type="url"
                                    placeholder="https://example.com/photo.jpg"
                                    value={formData.photoURL}
                                    onChange={handleChange}
                                    color={errors.photoURL ? "danger" : "default"}
                                    classNames={{
                                        innerWrapper: "flex items-center gap-2",
                                        input: "pl-1"
                                    }}
                                    startContent={
                                        <svg className="text-default-400 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <polyline points="21 15 16 10 5 21" />
                                        </svg>
                                    }
                                />
                                {errors.photoURL && <span className="text-[11px] text-danger">{errors.photoURL}</span>}
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="reg-password" className="text-[13px] font-semibold text-foreground">
                                    Password
                                </label>
                                <Input
                                    id="reg-password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    autoComplete="new-password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    color={errors.password ? "danger" : "default"}
                                    classNames={{
                                        innerWrapper: "flex items-center gap-2",
                                        input: "pl-1"
                                    }}
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

                                {formData.password.length > 0 && (
                                    <div className="mt-2 p-3 bg-content2 rounded-md flex flex-col gap-2">
                                        <PasswordRequirement met={passwordStrength.hasMinLength} text="At least 6 characters" />
                                        <PasswordRequirement met={passwordStrength.hasUppercase} text="One uppercase letter (A-Z)" />
                                        <PasswordRequirement met={passwordStrength.hasLowercase} text="One lowercase letter (a-z)" />
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-1.5 pb-2">
                                <label htmlFor="confirmPassword" className="text-[13px] font-semibold text-foreground">
                                    Confirm Password
                                </label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Repeat your password"
                                    autoComplete="new-password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    color={
                                        errors.confirmPassword
                                            ? "danger"
                                            : isConfirmSuccess
                                                ? "success"
                                                : "default"
                                    }
                                    classNames={{
                                        innerWrapper: "flex items-center gap-2",
                                        input: "pl-1"
                                    }}
                                    startContent={
                                        <svg className={`${isConfirmSuccess ? "text-success" : "text-default-400"} w-4 h-4`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                        </svg>
                                    }
                                    endContent={
                                        <button
                                            className="focus:outline-none"
                                            type="button"
                                            onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (
                                                <svg className={`${isConfirmSuccess ? "text-success" : "text-default-400"} w-4 h-4`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            ) : (
                                                <svg className={`${isConfirmSuccess ? "text-success" : "text-default-400"} w-4 h-4`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    }
                                />
                                {errors.confirmPassword && <span className="text-[11px] text-danger">{errors.confirmPassword}</span>}
                                {isConfirmSuccess && !errors.confirmPassword && <span className="text-[11px] text-success">Passwords match</span>}
                            </div>

                            <Button
                                type="submit"
                                isLoading={isSubmitting}
                                className="w-full h-12 bg-[#d9f99d] text-black text-[13px] font-bold tracking-wider uppercase transition-all hover:bg-[#c9f17d] hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(217,249,157,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Creating Account..." : "Create Account"}
                            </Button>
                        </form>

                        <p className="text-center mt-6 text-[13px] text-default-500">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="text-[#d9f99d] font-semibold no-underline hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}