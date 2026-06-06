import Image from "next/image";
import { Card } from "@heroui/card";

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
    <section className="py-24 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-20 lg:gap-12 items-center">
          {/* Content Column */}
          <div>
            <p className="section-label">Ownership Guide</p>
            <h2 className="text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight text-[var(--color-text-primary)] mb-2">
              Pet Guardianship
            </h2>
            <h2 className="text-[clamp(32px,4vw,48px)] font-bold leading-tight tracking-tight bg-gradient-to-br from-[#d9f99d] to-[#a3e635] bg-clip-text text-transparent mb-6">
              Blueprint
            </h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed mb-10 max-w-[420px]">
              Adoption is the beginning of a lifelong journey. Our comprehensive
              care guide ensures you and your new companion thrive together from
              day one.
            </p>

            {/* Blueprint Items */}
            <div className="flex flex-col gap-6">
              {BLUEPRINT_ITEMS.map((item) => (
                <BlueprintItem key={item.title} item={item} />
              ))}
            </div>
          </div>

          {/* Image Column */}
          <Card className="relative rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface)] aspect-[4/5] lg:max-w-[480px] lg:mx-auto lg:w-full">
            <Image
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&q=80"
              alt="Pet owner with companion"
              fill
              className="object-cover brightness-[0.7]"
              sizes="(max-width: 1024px) 480px, 640px"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(217,249,157,0.05) 0%, transparent 60%)",
              }}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}

function BlueprintItem({ item }) {
  return (
    <div className="flex gap-4 items-start">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{
          background: "rgba(217, 249, 157, 0.1)",
          border: "1px solid rgba(217, 249, 157, 0.2)",
          color: item.color,
        }}
      >
        {item.icon}
      </div>
      <div>
        <h4 className="text-[15px] font-bold text-[var(--color-text-primary)] mb-1">
          {item.title}
        </h4>
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
}