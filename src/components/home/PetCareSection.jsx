const TIPS = [
  {
    number: "01",
    title: "Establish a Routine Early",
    description:
      "Pets thrive on consistency. Set fixed times for feeding, walks, play, and sleep from the very first day. A stable schedule reduces anxiety and builds trust faster than any treat.",
    tag: "Behavior",
    tagColor: "var(--color-purple)",
    tagBg: "rgba(168, 85, 247, 0.1)",
  },
  {
    number: "02",
    title: "Socialization is Non-Negotiable",
    description:
      "Gradually expose your new pet to different people, sounds, environments, and other animals. The critical socialization window is short, and early positive experiences last a lifetime.",
    tag: "Social",
    tagColor: "var(--color-lime)",
    tagBg: "rgba(217, 249, 157, 0.1)",
  },
  {
    number: "03",
    title: "Schedule Preventive Vet Visits",
    description:
      "Do not wait until your pet is sick. Quarterly check-ups catch issues early, keep vaccinations current, and build a medical history that will be invaluable throughout their life.",
    tag: "Health",
    tagColor: "var(--color-coral)",
    tagBg: "rgba(251, 113, 133, 0.1)",
  },
  {
    number: "04",
    title: "Mental Stimulation Matters",
    description:
      "Physical exercise alone is not enough. Puzzle feeders, training sessions, and interactive play keep your pet mentally sharp and prevent destructive boredom behaviors.",
    tag: "Enrichment",
    tagColor: "var(--color-lime)",
    tagBg: "rgba(217, 249, 157, 0.1)",
  },
  {
    number: "05",
    title: "Nutrition is the Foundation",
    description:
      "Every species has unique dietary requirements. Consult a veterinary nutritionist to build a species-appropriate meal plan, and always ensure access to fresh, clean water.",
    tag: "Nutrition",
    tagColor: "var(--color-purple)",
    tagBg: "rgba(168, 85, 247, 0.1)",
  },
  {
    number: "06",
    title: "Patience is Your Greatest Tool",
    description:
      "Adjustment takes time. Some pets settle in within days, others need months. Never punish fear or confusion. Build trust incrementally and celebrate every small milestone.",
    tag: "Mindset",
    tagColor: "var(--color-coral)",
    tagBg: "rgba(251, 113, 133, 0.1)",
  },
];

export default function PetCareSection() {
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
        <div style={{ textAlign: "center", marginBottom: "64px" }}>
          <p className="section-label">Expert Advice</p>
          <h2 className="section-title" style={{ marginBottom: "16px" }}>
            Pet Care Tips
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "var(--color-text-secondary)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: "1.7",
            }}
          >
            Insights from our team of veterinarians and behavioral specialists
            to help you and your new companion thrive from day one.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
          className="tips-grid"
        >
          {TIPS.map((tip) => (
            <div
              key={tip.number}
              style={{
                padding: "28px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(217,249,157,0.2)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--color-border)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  fontSize: "48px",
                  fontWeight: "800",
                  color: "rgba(255,255,255,0.03)",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                }}
              >
                {tip.number}
              </div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "4px 10px",
                  background: tip.tagBg,
                  borderRadius: "var(--radius-full)",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "700",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: tip.tagColor,
                  }}
                >
                  {tip.tag}
                </span>
              </div>

              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "var(--color-text-primary)",
                  marginBottom: "12px",
                  letterSpacing: "-0.01em",
                  lineHeight: "1.3",
                }}
              >
                {tip.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.7",
                }}
              >
                {tip.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .tips-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .tips-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}