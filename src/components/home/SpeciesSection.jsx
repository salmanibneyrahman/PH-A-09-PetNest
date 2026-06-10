"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SPECIES = [
  {
    name: "Dogs",
    key: "Dog",
    description: "Faithful, energetic, and always ready for an adventure.",
    accentColor: "var(--color-purple)",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
  },
  {
    name: "Cats",
    key: "Cat",
    description: "Independent, graceful, and endlessly entertaining companions.",
    accentColor: "var(--color-coral)",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80",
  },
  {
    name: "Birds",
    key: "Bird",
    description: "Intelligent and melodic avian friends for a lively home.",
    accentColor: "var(--color-lime)",
    image: "https://images.unsplash.com/photo-1719514160332-8a887399a2b4?w=600&auto=format",
  },
  {
    name: "Reptiles",
    key: "Reptile",
    description: "Unique, low-maintenance companions with fascinating personalities.",
    accentColor: "var(--color-coral)",
    image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=600&q=80",
  },
  {
    name: "Rabbits",
    key: "Rabbit",
    description: "Gentle and curious, perfect for families and quiet homes.",
    accentColor: "var(--color-lime)",
    image: "https://images.unsplash.com/photo-1589933767411-38a58367efd7?q=80&w=858",
  },
];

export default function SpeciesSection() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const scrollerRef = useRef(null);

  const handleExplore = (speciesKey) => {
    router.push(`/all-pets?species=${speciesKey}`);
  };

  // Continuous Auto-play Marquee Logic
  useEffect(() => {
    if (isPaused) return;

    let animationFrameId;
    const scroll = () => {
      if (scrollerRef.current) {
        scrollerRef.current.scrollLeft += 0.5; // Adjust number for speed (1.5 is a nice smooth pace)

        // Seamless Infinite Loop Reset:
        // When we scroll exactly halfway through our duplicated list, instantly jump back to 0.
        if (scrollerRef.current.scrollLeft >= scrollerRef.current.scrollWidth / 2) {
          scrollerRef.current.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  // Infinite Manual Navigation
  const handlePrev = useCallback(() => {
    if (scrollerRef.current) {
      if (scrollerRef.current.scrollLeft <= 0) {
        scrollerRef.current.scrollLeft = scrollerRef.current.scrollWidth / 2;
      }
      const cardWidth = scrollerRef.current.children[0].offsetWidth + 24; // 24px is the gap-6
      scrollerRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  }, []);

  const handleNext = useCallback(() => {
    if (scrollerRef.current) {
      const cardWidth = scrollerRef.current.children[0].offsetWidth + 24;
      scrollerRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  }, []);

  // We duplicate the array 4 times to ensure there is always a long enough track for the seamless infinite loop
  const duplicatedSpecies = [...SPECIES, ...SPECIES, ...SPECIES, ...SPECIES];

  return (
    <section className="py-24 bg-[var(--color-bg)] border-t border-[var(--color-border)] relative">
      <div className="max-w-[1280px] mx-auto px-6">
        
        {/* CENTERED HEADER & ARROWS */}
        <div 
          className="flex flex-col items-center text-center mb-14"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-lime)] mb-3">
            Categories
          </p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--color-text-primary)]">
            Species of PetNest
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] mt-3 max-w-[500px]">
            Find your perfect match among our curated species. Click explore to see available pets waiting for a home.
          </p>

          {/* Infinite Manual Arrows */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.08)] hover:scale-105 transition-all cursor-pointer"
              aria-label="Previous species"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full border border-[rgba(255,255,255,0.15)] flex items-center justify-center text-white hover:bg-[rgba(255,255,255,0.08)] hover:scale-105 transition-all cursor-pointer"
              aria-label="Next species"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* Continuous Marquee Container */}
        <div 
          ref={scrollerRef}
          className="flex gap-6 overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {duplicatedSpecies.map((species, index) => (
            <div
              key={`${species.key}-${index}`}
              onClick={() => handleExplore(species.key)}
              // Widths strictly match the previous grid columns (1 on mobile, 2 on md, 3 on lg)
              className="group cursor-pointer shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.08)] bg-[rgba(10,10,10,0.6)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(217,249,157,0.3)] hover:shadow-[0_10px_40px_rgba(217,249,157,0.05)] flex flex-col"
            >
              {/* Image Section */}
              <div className="relative w-full h-[220px] overflow-hidden bg-zinc-900">
                <Image
                  src={species.image}
                  alt={species.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Glassmorphic Card Content */}
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="text-[20px] font-bold text-white mb-2 tracking-tight">
                    {species.name}
                  </h3>
                  <p className="text-[14px] text-gray-400 leading-relaxed">
                    {species.description}
                  </p>
                </div>
                
                {/* Explore Button */}
                <button
                  className="flex items-center gap-2 text-[13px] font-bold tracking-wide uppercase transition-colors"
                  style={{ color: species.accentColor }}
                >
                  Explore {species.name}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}