import { Card, CardBody } from "@heroui/card";

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
    <section className="py-24 bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-lime)] mb-3">
            Expert Advice
          </p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--color-text-primary)] mb-4">
            Pet Care Tips
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[480px] mx-auto leading-relaxed">
            Insights from our team of veterinarians and behavioral specialists
            to help you and your new companion thrive from day one.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TIPS.map((tip) => (
            <TipCard key={tip.number} tip={tip} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TipCard({ tip }) {
  return (
    <Card className="h-full bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-[rgba(217,249,157,0.3)] hover:shadow-[0_10px_30px_rgba(217,249,157,0.05)] group">
      <CardBody className="p-7 flex flex-col h-full relative">

        {/* Fixed Background Number - Positioned perfectly behind text */}
        <div className="absolute top-2 right-4 text-[72px] font-black text-[rgba(255,255,255,0.04)] leading-none tracking-tighter select-none pointer-events-none z-0">
          {tip.number}
        </div>

        {/* Fixed Tag Badge - Custom span replacing the warped Chip */}
        <div className="relative z-10 mb-5">
          <span
            className="inline-flex items-center px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase rounded-full"
            style={{
              backgroundColor: tip.tagBg,
              color: tip.tagColor,
            }}
          >
            {tip.tag}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-3 tracking-tight leading-snug relative z-10">
          {tip.title}
        </h3>

        {/* Description */}
        <p className="text-[14px] text-[var(--color-text-secondary)] leading-relaxed relative z-10 mt-auto">
          {tip.description}
        </p>

      </CardBody>
    </Card>
  );
}