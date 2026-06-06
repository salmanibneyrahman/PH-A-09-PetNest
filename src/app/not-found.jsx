"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  const setMounted = () => {
    setMountedState(true);
  };

  // Call the setMounted function after a short delay
  setTimeout(setMounted, 0);
}, []);

  const quickLinks = useMemo(() => [
    { label: "Home", href: "/" },
    { label: "All Pets", href: "/all-pets" },
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "Dashboard", href: "/dashboard" },
  ], []);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-6 relative overflow-hidden flex-col">
      {/* Background Gradient */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(217,249,157,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Content Container */}
      <div
        className={`text-center max-w-[520px] w-full transition-all duration-500 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {/* Logo */}
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 no-underline mb-12"
        >
          <div className="w-9 h-9 bg-[var(--color-lime)] rounded-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            PetNest
          </span>
        </Link>

        {/* 404 Number with Glow Effect */}
        <div className="text-[clamp(80px,15vw,140px)] font-extrabold tracking-tighter leading-none mb-6 relative inline-block">
          <span
            className="relative z-[1]"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </span>
          <div
            className="absolute inset-0 flex items-center justify-center text-[clamp(80px,15vw,140px)] font-extrabold tracking-tighter opacity-15 blur-[20px]"
            style={{
              background: "linear-gradient(135deg, #d9f99d 0%, #a3e635 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </div>
        </div>

        {/* Paw Icon */}
        <div className="text-[56px] mb-6">🐾</div>

        {/* Title */}
        <h1 className="text-[clamp(22px,3vw,32px)] font-bold text-[var(--color-text-primary)] tracking-tight mb-3">
          This page has wandered off
        </h1>

        {/* Description */}
        <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-10 max-w-[380px] mx-auto">
          The page you are looking for has escaped its enclosure. It may have
          been moved, deleted, or perhaps it is out on an adventure. Let us help
          you find your way back.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/">
            <Button
              className="bg-[var(--color-lime)] text-black font-bold min-w-[160px]"
              startContent={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              }
            >
              Back to Home
            </Button>
          </Link>
          <Link href="/all-pets">
            <Button
              variant="bordered"
              className="border-[var(--color-border)] text-[var(--color-text-primary)] min-w-[160px] hover:border-[var(--color-lime)] hover:text-[var(--color-lime)]"
            >
              Browse Pets
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <Card className="mt-16 bg-[var(--color-surface)] border border-[var(--color-border)]">
          <div className="p-5 px-6 flex gap-6 justify-center flex-wrap">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-semibold text-[var(--color-text-muted)] no-underline transition-colors duration-200 hover:text-[var(--color-lime)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}