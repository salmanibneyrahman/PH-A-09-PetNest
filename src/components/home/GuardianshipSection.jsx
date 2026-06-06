import Image from "next/image";

const BLUEPRINT_ITEMS = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    title: "Health Verification",
    description:
      "Every pet undergoes a rigorous 20-point medical examination before being listed on our platform.",
    color: "var(--color-lime)",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4l3 3" />
      </svg>
    ),
    title: "Behavioral Insights",
    description:
      "AI-driven personality matching ensures your lifestyle aligns perfectly with your pet's natural needs and temperament.",
    color: "var(--color-lime)",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
    title: "Nutritional Paths",
    description:
      "Personalized meal plans curated by veterinary nutritionists for every species, breed, and life stage.",
    color: "var(--color-lime)",
  },
];

export default function GuardianshipSection() {
  return (
    <section
      style={{
        padding: "96px 0",
        background: "var(--color-bg)",
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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
          className="guardian-grid"
        >
          <div>
            <p className="section-label">Ownership Guide</p>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: "700",
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                marginBottom: "8px",
              }}
            >
              Pet Guardianship
            </h2>
            <h2
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: "700",
                lineHeight: "1.15",
                letterSpacing: "-0.02em",
                background: "linear-gradient(135deg, #d9f99d, #a3e635)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "24px",
              }}
            >
              Blueprint
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                lineHeight: "1.7",
                marginBottom: "40px",
                maxWidth: "420px",
              }}
            >
              Adoption is the beginning of a lifelong journey. Our comprehensive
              care guide ensures you and your new companion thrive together from
              day one.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {BLUEPRINT_ITEMS.map((item, index) => (
                <div
                  key={item.title}
                  style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "rgba(217, 249, 157, 0.1)",
                      border: "1px solid rgba(217, 249, 157, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: item.color,
                      flexShrink: 0,
                      marginTop: "2px",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <h4
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "var(--color-text-primary)",
                        marginBottom: "4px",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--color-text-secondary)",
                        lineHeight: "1.6",
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              aspectRatio: "4/5",
            }}
            className="guardian-image"
          >
            <Image
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80"
              alt="Pet owner with companion"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(0.7)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(135deg, rgba(217,249,157,0.05) 0%, transparent 60%)",
              }}
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .guardian-grid {
            grid-template-columns: 1fr !important;
            gap: 48px !important;
          }
          .guardian-image {
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}