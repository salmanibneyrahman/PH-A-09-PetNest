"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeroBanner() {
  const [searchValue, setSearchValue] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/all-pets?search=${encodeURIComponent(searchValue.trim())}`;
    } else {
      window.location.href = "/all-pets";
    }
  };

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        background: "var(--color-bg)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "-10%",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(217, 249, 157, 0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "-5%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "64px",
          alignItems: "center",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
        className="hero-grid"
      >
        <div
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "rgba(217, 249, 157, 0.08)",
              border: "1px solid rgba(217, 249, 157, 0.2)",
              borderRadius: "var(--radius-full)",
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--color-lime)",
                boxShadow: "0 0 8px var(--color-lime)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-lime)",
              }}
            >
              Empowering Companionships
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: "700",
              lineHeight: "1.08",
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
              marginBottom: "8px",
            }}
          >
            Find Your Perfect
          </h1>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: "700",
              lineHeight: "1.08",
              letterSpacing: "-0.03em",
              marginBottom: "8px",
              background: "linear-gradient(135deg, #d9f99d, #a3e635)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Furry Companion,
          </h1>
          <h1
            style={{
              fontSize: "clamp(40px, 6vw, 72px)",
              fontWeight: "700",
              lineHeight: "1.08",
              letterSpacing: "-0.03em",
              color: "var(--color-text-primary)",
              marginBottom: "28px",
            }}
          >
            Securely.
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "var(--color-text-secondary)",
              lineHeight: "1.7",
              maxWidth: "440px",
              marginBottom: "40px",
            }}
          >
            Join the next generation of pet adoption. Every pet profile is
            verified and transparent, giving you complete peace of mind as you
            find your new best friend.
          </p>

          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              padding: "4px 4px 4px 16px",
              marginBottom: "32px",
              maxWidth: "480px",
              transition: "border-color 0.2s ease",
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = "rgba(217,249,157,0.4)";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(217,249,157,0.08)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-text-muted)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search by name, breed, or personality..."
              style={{
                flex: 1,
                padding: "10px 12px",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--color-text-primary)",
                fontSize: "14px",
                fontFamily: "var(--font-sans)",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "var(--color-lime)",
                border: "none",
                borderRadius: "2px",
                color: "#000",
                fontSize: "12px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                cursor: "pointer",
                flexShrink: 0,
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-lime-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-lime)";
              }}
            >
              Search
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/all-pets" className="btn-primary">
              Adopt Now
            </Link>
            <Link href="/program" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
          }}
          className="hero-image-panel"
        >
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              aspectRatio: "4/5",
              maxHeight: "560px",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80"
              alt="Beautiful dog available for adoption"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.85)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: "24px",
                left: "24px",
                right: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 16px",
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(217,249,157,0.2)",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(217,249,157,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
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
                  <p
                    style={{
                      fontSize: "18px",
                      fontWeight: "800",
                      color: "var(--color-lime)",
                      lineHeight: 1,
                      marginBottom: "2px",
                    }}
                  >
                    2.4k+
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "600",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    Success Matches
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(217,249,157,0.12) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .hero-image-panel {
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}