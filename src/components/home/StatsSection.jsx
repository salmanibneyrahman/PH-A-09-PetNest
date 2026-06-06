"use client";

import { useState, useEffect, useRef } from "react";

const STATS = [
  {
    value: 12000,
    suffix: "+",
    label: "Lives Saved",
    description: "Pets successfully rehomed",
    color: "var(--color-lime)",
  },
  {
    value: 98,
    suffix: "%",
    label: "Success Rate",
    description: "Verified adoption completions",
    color: "var(--color-lime)",
  },
  {
    value: 450,
    suffix: "+",
    label: "Verified Shelters",
    description: "Trusted partner organizations",
    color: "var(--color-lime)",
  },
  {
    value: 24,
    suffix: "/7",
    label: "Guardian Support",
    description: "Always here when you need us",
    color: "var(--color-lime)",
  },
];

function useCountUp(target, duration = 2000, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const startValue = 0;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(startValue + (target - startValue) * eased));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration, started]);

  return count;
}

function StatItem({ stat, started }) {
  const count = useCountUp(stat.value, 1800, started);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 0) + "k";
    }
    return num.toString();
  };

  return (
    <div
      style={{
        textAlign: "center",
        padding: "32px 24px",
      }}
    >
      <div
        style={{
          fontSize: "clamp(48px, 6vw, 72px)",
          fontWeight: "800",
          letterSpacing: "-0.04em",
          color: stat.color,
          lineHeight: 1,
          marginBottom: "8px",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {formatNumber(count)}
        {stat.suffix}
      </div>
      <div
        style={{
          fontSize: "13px",
          fontWeight: "700",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-text-primary)",
          marginBottom: "4px",
        }}
      >
        {stat.label}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "var(--color-text-muted)",
        }}
      >
        {stat.description}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
        padding: "0",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
        className="stats-grid"
      >
        {STATS.map((stat, index) => (
          <div
            key={stat.label}
            style={{
              borderRight:
                index < STATS.length - 1
                  ? "1px solid var(--color-border)"
                  : "none",
            }}
            className="stat-cell"
          >
            <StatItem stat={stat} started={isVisible} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .stat-cell:nth-child(2) {
            border-right: none !important;
          }
          .stat-cell:nth-child(1),
          .stat-cell:nth-child(2) {
            border-bottom: 1px solid var(--color-border);
          }
        }
        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
          .stat-cell {
            border-right: none !important;
            border-bottom: 1px solid var(--color-border) !important;
          }
          .stat-cell:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
    </section>
  );
}