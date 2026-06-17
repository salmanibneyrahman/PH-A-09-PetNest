"use client";

import { useEffect, useState } from "react";
import { toastState } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const unsubscribe = toastState.subscribe(setToasts);
        return unsubscribe;
    }, []);

    const removeToast = (id) => {
        toastState.toasts = toastState.toasts.filter((t) => t.id !== id);
        toastState.notify();
    };


    useEffect(() => {
        const timers = [];
        toasts.forEach((toast) => {
            if (toast.duration) {
                const timer = setTimeout(() => {
                    removeToast(toast.id);
                }, toast.duration);
                timers.push(timer);
            }
        });

        return () => {
            timers.forEach((timer) => clearTimeout(timer));
        };
    }, [toasts]);

    const toastStyles = {
        success: {
            background: "linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            icon: "✓",
            iconColor: "#22c55e",
        },
        error: {
            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            icon: "✕",
            iconColor: "#ef4444",
        },
        warning: {
            background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.05) 100%)",
            border: "1px solid rgba(251, 191, 36, 0.3)",
            icon: "⚠",
            iconColor: "#fbbf24",
        },
        info: {
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            icon: "ℹ",
            iconColor: "#3b82f6",
        },
    };

    if (!mounted) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: "20px",
                right: "20px",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                maxWidth: "400px",
                width: "calc(100% - 40px)",
            }}
        >
            <AnimatePresence>
                {toasts.map((toast) => {
                    if (!toast) return null;
                    const style = toastStyles[toast.type] || toastStyles.info;
                    return (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 100, scale: 0.95 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            style={{
                                background: style.background,
                                border: style.border,
                                borderRadius: "12px",
                                padding: "16px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                                backdropFilter: "blur(12px)",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            <div
                                style={{
                                    width: "24px",
                                    height: "24px",
                                    borderRadius: "50%",
                                    background: `${style.iconColor}20`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "14px",
                                    fontWeight: "bold",
                                    color: style.iconColor,
                                    flexShrink: 0,
                                }}
                            >
                                {style.icon}
                            </div>
                            <p
                                style={{
                                    flex: 1,
                                    margin: 0,
                                    fontSize: "14px",
                                    color: "var(--color-text-primary)",
                                    fontWeight: "500",
                                    lineHeight: "1.4",
                                }}
                            >
                                {toast.message}
                            </p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--color-text-muted)",
                                    cursor: "pointer",
                                    padding: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: "4px",
                                    transition: "all 0.2s",
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                    e.currentTarget.style.color = "var(--color-text-primary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "var(--color-text-muted)";
                                }}
                            >
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
