const REASONS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Save a Life",
    description:
      "Every adoption directly saves a life and creates space for another pet in need. You become part of a chain of compassion that extends far beyond your household.",
    color: "var(--color-coral)",
    bg: "rgba(251, 113, 133, 0.08)",
    border: "rgba(251, 113, 133, 0.2)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Verified Health Records",
    description:
      "Every pet in our system undergoes a rigorous 20-point medical examination before listing. You receive complete and transparent health documentation.",
    color: "var(--color-lime)",
    bg: "rgba(217, 249, 157, 0.08)",
    border: "rgba(217, 249, 157, 0.2)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Lifetime Support",
    description:
      "Our commitment does not end at adoption. Our team of veterinary advisors and behavioral specialists remains available 24 hours a day, 7 days a week.",
    color: "var(--color-purple)",
    bg: "rgba(168, 85, 247, 0.08)",
    border: "rgba(168, 85, 247, 0.2)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Community Network",
    description:
      "Join over 12,000 PetNest families. Share experiences, tips, and milestones in a supportive community of like-minded pet companions.",
    color: "var(--color-lime)",
    bg: "rgba(217, 249, 157, 0.08)",
    border: "rgba(217, 249, 157, 0.2)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    title: "Free Delivery Support",
    description:
      "We coordinate with verified transport partners to ensure your new companion arrives safely, with proper climate control and care throughout the journey.",
    color: "var(--color-purple)",
    bg: "rgba(168, 85, 247, 0.08)",
    border: "rgba(168, 85, 247, 0.2)",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Secure Process",
    description:
      "All adoption requests, payments, and communications are encrypted and processed through our secure, verified platform to protect all parties involved.",
    color: "var(--color-coral)",
    bg: "rgba(251, 113, 133, 0.08)",
    border: "rgba(251, 113, 133, 0.2)",
  },
];

export default function WhyAdoptSection() {
  return (
    <section
      style={{
        padding: "96px 0",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 24px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p className="section-label">Why Choose Us</p>
          <h2 className="section-title" style={{ marginBottom: "16px" }}>
            Why Adopt Through PetNest?
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--color-text-secondary)",
              maxWidth: "520px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            We have reimagined the adoption experience from the ground up,
            making it safer, more transparent, and more joyful for both
            you and your future companion.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
          className="why-grid"
        >
          {REASONS.map((reason) => (
            <div
              key={reason.title}
              style={{
                padding: "28px",
                background: "var(--color-bg)",
                border: `1px solid var(--color-border)`,
                borderRadius: "var(--radius-md)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = reason.border;
                e.currentTarget.style.background = reason.bg;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.background = "var(--color-bg)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "var(--radius-md)",
                  background: reason.bg,
                  border: `1px solid ${reason.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: reason.color,
                  marginBottom: "20px",
                  flexShrink: 0,
                }}
              >
                {reason.icon}
              </div>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                  marginBottom: "10px",
                  letterSpacing: "-0.01em",
                }}
              >
                {reason.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.65",
                }}
              >
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .why-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .why-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}