"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@heroui/button";

export default function HeroBanner() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-pets?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[var(--color-bg)]">
      {/* Background Gradient Blobs */}
      <div className="absolute top-0 -right-[20%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(217,249,157,0.08)_0%,transparent_70%)] pointer-events-none blur-3xl" />
      <div className="absolute bottom-0 -left-[10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.06)_0%,transparent_70%)] pointer-events-none blur-3xl" />

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-26 items-center">
          
          {/* Left Content (Text and Search) */}
          <div className="flex flex-col items-start gap-8 pt-2">
            
            {/* Glassmorphic Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg"
              style={{
                background: "rgba(217, 249, 157, 0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(217, 249, 157, 0.2)",
              }}
            >
              <div className="w-2 h-2 rounded-full bg-[var(--color-lime)] animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-[var(--color-lime)]">
                Empowering Companionships
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-[clamp(42px,5vw,68px)] font-extrabold leading-[1.15] tracking-[-0.03em] text-[var(--color-text-primary)]">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-br from-[#d9f99d] to-[#a3e635] bg-clip-text text-transparent">
                Furry Companion
              </span>
              , Securely
            </h1>

            <p className="text-base text-[var(--color-text-secondary)] leading-relaxed max-w-[520px]">
              Connect with loving pets waiting for their forever home. Our secure platform makes adoption safe, transparent, and joyful.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full max-w-[560px]">
              <div 
                className="flex items-center gap-0 rounded-xl overflow-hidden border shadow-2xl transition-all duration-200 focus-within:border-[rgba(217,249,157,0.5)] focus-within:shadow-[0_0_30px_rgba(217,249,157,0.1)]"
                style={{
                  background: "rgba(10, 10, 10, 0.7)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                }}
              >
                <div className="pl-5 pr-3 flex items-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, breed, or personality..."
                  className="flex-1 py-4 bg-transparent border-none outline-none text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)]"
                />
                <Button
                  type="submit"
                  className="m-1.5 px-6 h-11 bg-[var(--color-lime)] text-black font-bold text-xs tracking-wider uppercase hover:bg-[var(--color-lime-dark)] rounded-lg"
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-2">
              {[
                { value: "2,500+", label: "Pets Adopted" },
                { value: "98%", label: "Success Rate" },
                { value: "1,200+", label: "Happy Families" },
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-2xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
                    {stat.value}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider font-semibold mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content (Image Layout) */}
          <div className="relative w-full aspect-[4/5] max-w-[500px] mx-auto lg:ml-auto pl-4">
            {/* Decorative Elements */}
            <div className="absolute top-[10%] right-[10%] w-32 h-32 rounded-full bg-[var(--color-lime)] opacity-20 blur-3xl animate-pulse" />
            <div className="absolute bottom-[15%] left-[15%] w-40 h-40 rounded-full bg-[var(--color-purple)] opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            
            {/* Main Image Wrapper */}
            <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80"
                alt="Happy dog"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between z-20">
                
                {/* Badge Left side */}
                <div 
                  className="flex items-center gap-3 py-2.5 px-4 rounded-xl border border-[rgba(217,249,157,0.2)] shadow-2xl transition-transform hover:scale-105"
                  style={{
                    background: "rgba(10,10,10,0.85)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <div className="w-9 h-9 rounded-full bg-[rgba(217,249,157,0.15)] flex items-center justify-center flex-shrink-0">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-lime)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-extrabold text-[var(--color-lime)] leading-none mb-1">
                      2.4k+
                    </p>
                    <p className="text-[10px] font-semibold tracking-wider uppercase text-gray-300 leading-none">
                      Success Matches
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
