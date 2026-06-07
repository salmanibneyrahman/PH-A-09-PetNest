"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { Chip } from "@heroui/chip";
import { Card } from "@heroui/card";

export default function HeroBanner() {
  const [searchValue, setSearchValue] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/all-pets?search=${encodeURIComponent(searchValue.trim())}`;
    } else {
      window.location.href = "/all-pets";
    }
  }, [searchValue]);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[var(--color-bg)]">
      {/* Background Gradients */}
      <div
        className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(217, 249, 157, 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
        }}
      />

      {/* Main Content Grid */}
      <div className="max-w-[1280px] mx-auto px-6 w-full grid grid-cols-2 lg:grid-cols-1 gap-16 lg:gap-12 items-center py-20">
        {/* Left Column - Content */}
        <div
          className={`transition-all duration-600 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          {/* Badge */}
          <Chip
            variant="bordered"
            className="mb-7 border-[rgba(217,249,157,0.2)] bg-[rgba(217,249,157,0.08)]"
            startContent={
              <div
                className="w-1.5 h-1.5 rounded-full bg-[var(--color-lime)] flex-shrink-0"
                style={{ boxShadow: "0 0 8px var(--color-lime)" }}
              />
            }
          >
            <span className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-lime)]">
              Empowering Companionships
            </span>
          </Chip>

          {/* Headings */}
          <h1 className="text-[clamp(40px,6vw,72px)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--color-text-primary)] mb-2">
            Find Your Perfect
          </h1>
          <h1 className="text-[clamp(40px,6vw,72px)] font-bold leading-[1.08] tracking-[-0.03em] mb-2 bg-gradient-to-br from-[#d9f99d] to-[#a3e635] bg-clip-text text-transparent">
            Furry Companion,
          </h1>
          <h1 className="text-[clamp(40px,6vw,72px)] font-bold leading-[1.08] tracking-[-0.03em] text-[var(--color-text-primary)] mb-7">
            Securely.
          </h1>

          {/* Description */}
          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-[440px] mb-10">
            Join the next generation of pet adoption. Every pet profile is
            verified and transparent, giving you complete peace of mind as you
            find your new best friend.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8 max-w-[480px]">
            <Input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name, breed, or personality..."
              startContent={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--color-text-muted)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
              endContent={
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[var(--color-lime)] text-black font-bold text-xs tracking-wider uppercase hover:bg-[var(--color-lime-dark)]"
                >
                  Search
                </Button>
              }
              classNames={{
                base: "max-w-full",
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] hover:border-[rgba(217,249,157,0.4)] focus-within:border-[rgba(217,249,157,0.4)] focus-within:shadow-[0_0_0_3px_rgba(217,249,157,0.08)]",
                input: "text-sm",
              }}
            />
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/all-pets">
              <Button className="bg-[var(--color-lime)] text-black font-bold hover:bg-[var(--color-lime-dark)]">
                Adopt Now
              </Button>
            </Link>
            <Link href="/program">
              <Button variant="bordered" className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-lime)]">
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column - Image */}
        <div
          className={`relative lg:max-w-[480px] lg:mx-auto lg:w-full transition-all duration-800 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <Card className="relative rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] aspect-[4/5] max-h-[560px]">
            <Image
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80"
              alt="Beautiful dog available for adoption"
              fill
              className="object-cover brightness-[0.85]"
              sizes="(max-width: 1024px) 480px, 640px"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
              }}
            />

            {/* Stats Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div
                className="flex items-center gap-2.5 py-2.5 px-4 rounded-lg border border-[rgba(217,249,157,0.2)]"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div className="w-8 h-8 rounded-full bg-[rgba(217,249,157,0.15)] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-lime)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-extrabold text-[var(--color-lime)] leading-none mb-0.5">
                    2.4k+
                  </p>
                  <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">
                    Success Matches
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Decorative Gradient */}
          <div
            className="absolute top-[-20px] right-[-20px] w-[140px] h-[140px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(217,249,157,0.12) 0%, transparent 70%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}