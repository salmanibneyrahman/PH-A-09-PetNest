import { Card, CardBody } from "@heroui/card";

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
    <section className="py-24 bg-[var(--color-surface)] border-t border-b border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label">Why Choose Us</p>
          <h2 className="section-title mb-4">Why Adopt Through PetNest?</h2>
          <p className="text-base text-[var(--color-text-secondary)] max-w-[520px] mx-auto leading-relaxed">
            We have reimagined the adoption experience from the ground up,
            making it safer, more transparent, and more joyful for both
            you and your future companion.
          </p>
        </div>

        {/* Reasons Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-5">
          {REASONS.map((reason) => (
            <ReasonCard key={reason.title} reason={reason} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonCard({ reason }) {
  return (
    <Card className="bg-[var(--color-bg)] border border-[var(--color-border)] transition-all duration-300 hover:-translate-y-0.5 group">
      <CardBody
        className="p-7 transition-all duration-300"
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = reason.border;
          e.currentTarget.style.background = reason.bg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.background = "var(--color-bg)";
        }}
      >
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 flex-shrink-0"
          style={{
            background: reason.bg,
            border: `1px solid ${reason.border}`,
            color: reason.color,
          }}
        >
          {reason.icon}
        </div>
        <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2.5 tracking-tight">
          {reason.title}
        </h3>
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
          {reason.description}
        </p>
      </CardBody>
    </Card>
  );
}