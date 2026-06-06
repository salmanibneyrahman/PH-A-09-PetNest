"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const SPECIES = [
  {
    name: "Dogs",
    key: "Dog",
    description: "Faithful, energetic, and always ready for an adventure.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5" />
        <path d="M8 14v.5" />
        <path d="M16 14v.5" />
        <path d="M11.25 16.25h1.5L12 17l-.75-.75z" />
        <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
      </svg>
    ),
    colorClass: "dogs",
    accentColor: "var(--color-purple)",
    bgColor: "rgba(168, 85, 247, 0.06)",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80",
  },
  {
    name: "Reptiles",
    key: "Reptile",
    description: "Unique, low-maintenance companions with fascinating personalities.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    colorClass: "reptiles",
    accentColor: "var(--color-coral)",
    bgColor: "rgba(251, 113, 133, 0.06)",
    image: "https://images.unsplash.com/photo-1591025207163-942350e47db2?w=400&q=80",
  },
  {
    name: "Birds",
    key: "Bird",
    description: "Intelligent and melodic avian friends for a lively home.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 7h.01" />
        <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
        <path d="m20 7 2 .5-2 .5" />
        <path d="M10 18v3" />
        <path d="M14 17.75V21" />
        <path d="M7 18a6 6 0 0 0 3.84-10.61" />
      </svg>
    ),
    colorClass: "birds",
    accentColor: "var(--color-lime)",
    bgColor: "rgba(217, 249, 157, 0.06)",
    image: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&q=80",
  },
  {
    name: "Cats",
    key: "Cat",
    description: "Independent, graceful, and endlessly entertaining companions.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 17 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5z" />
        <path d="M8 14v.5" />
        <path d="M16 14v.5" />
        <path d="M11.25 16.25h1.5L12 17l-.75-.75z" />
      </svg>
    ),
    colorClass: "cats",
    accentColor: "var(--color-coral)",
    bgColor: "rgba(251, 113, 133, 0.06)",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&q=80",
  },
  {
    name: "Rabbits",
    key: "Rabbit",
    description: "Gentle and curious, perfect for families and quiet homes.",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 4a3 3 0 0 1 0 6" />
        <path d="M6 4a3 3 0 0 0 0 6" />
        <path d="M12 7v5" />
        <path d="M6 10a6 6 0 0 0 12 0" />
        <path d="M12 17a5 5 0 0 1-5 5h10a5 5 0 0 1-5-5z" />
      </svg>
    ),
    colorClass: "rabbits",
    accentColor: "var(--color-lime)",
    bgColor: "rgba(217, 249, 157, 0.06)",
    image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&q=80",
  },
];

export default function SpeciesSection() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(1);
  const [scrollOffset, setScrollOffset] = useState(0);

  const handleExplore = (speciesKey) => {
    router.push(`/all-pets?species=${speciesKey}`);
  };

  const handlePrev = () => {
    setScrollOffset((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setScrollOffset((prev) => Math.min(prev + 1, SPECIES.length - 3));
  };

  return (
    <section
      style={{
        padding: "96px 0",
        background: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p className="section-label">Categories</p>
            <h2 className="section-title">Species of PetNest</h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                marginTop: "8px",
              }}
            >
              Find your perfect match among our curated species
            </p>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={handlePrev}
              disabled={scrollOffset === 0}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color:
                  scrollOffset === 0
                    ? "var(--color-text-muted)"
                    : "var(--color-text-primary)",
                cursor: scrollOffset === 0 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={scrollOffset >= SPECIES.length - 3}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
                color:
                  scrollOffset >= SPECIES.length - 3
                    ? "var(--color-text-muted)"
                    : "var(--color-text-primary)",
                cursor:
                  scrollOffset >= SPECIES.length - 3 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s ease",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            overflow: "hidden",
          }}
          className="species-grid"
        >
          {SPECIES.slice(scrollOffset, scrollOffset + 3).map((species, index) => {
            const isActive = index === 1;
            return (
              <div
                key={species.key}
                onClick={() => {
                  setActiveIndex(index);
                  handleExplore(species.key);
                }}
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  cursor: "pointer",
                  border: isActive
                    ? `1px solid ${species.accentColor}40`
                    : "1px solid var(--color-border)",
                  background: isActive
                    ? species.bgColor
                    : "var(--color-surface)",
                  transition: "all 0.3s ease",
                  minHeight: "300px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${species.accentColor}60`;
                  e.currentTarget.style.background = species.bgColor;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.background = "var(--color-surface)";
                  }
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: "200px",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src={species.image}
                    alt={species.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.75)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      left: "16px",
                      width: "40px",
                      height: "40px",
                      borderRadius: "var(--radius-md)",
                      background: "rgba(0,0,0,0.6)",
                      backdropFilter: "blur(8px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: species.accentColor,
                      border: `1px solid ${species.accentColor}30`,
                    }}
                  >
                    {species.icon}
                  </div>
                </div>

                <div style={{ padding: "20px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "var(--color-text-primary)",
                      marginBottom: "6px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {species.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--color-text-secondary)",
                      lineHeight: "1.5",
                      marginBottom: isActive ? "16px" : "0",
                    }}
                  >
                    {species.description}
                  </p>
                  {isActive && (
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "none",
                        border: "none",
                        color: species.accentColor,
                        fontSize: "13px",
                        fontWeight: "700",
                        letterSpacing: "0.04em",
                        cursor: "pointer",
                        padding: "0",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      EXPLORE
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .species-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .species-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}