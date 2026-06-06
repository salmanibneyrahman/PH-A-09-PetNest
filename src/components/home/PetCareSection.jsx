import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";

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
          <p className="section-label">Expert Advice</p>
          <h2 className="section-title mb-4">Pet Care Tips</h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[480px] mx-auto leading-relaxed">
            Insights from our team of veterinarians and behavioral specialists
            to help you and your new companion thrive from day one.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-5">
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
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-[rgba(217,249,157,0.2)] group">
      <CardBody className="p-7">
        {/* Background Number */}
        <div className="absolute top-4 right-4 text-[48px] font-extrabold text-white/[0.03] leading-none tracking-tighter">
          {tip.number}
        </div>

        {/* Tag */}
        <Chip
          size="sm"
          className="mb-4 text-[11px] font-bold tracking-wider uppercase"
          style={{
            background: tip.tagBg,
            color: tip.tagColor,
          }}
        >
          {tip.tag}
        </Chip>

        {/* Title */}
        <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-3 tracking-tight leading-snug">
          {tip.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
          {tip.description}
        </p>
      </CardBody>
    </Card>
  );
}