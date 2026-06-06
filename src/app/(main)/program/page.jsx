import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";

export const metadata = {
  title: "Our Program - PetNest",
  description:
    "Learn about how PetNest works, our adoption process, and how we verify every pet listing on our platform.",
};

const STEPS = [
  {
    number: "01",
    title: "Browse and Discover",
    description:
      "Explore hundreds of verified pet profiles. Use our advanced filters to search by species, breed, age, and location. Every profile includes health records and behavioral notes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    color: "var(--color-lime)",
    bg: "rgba(217,249,157,0.08)",
    border: "rgba(217,249,157,0.2)",
  },
  {
    number: "02",
    title: "Submit Your Request",
    description:
      "Found your perfect companion? Submit an adoption request directly through our secure platform. Include your preferred pickup date and a personal message to the owner.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    color: "var(--color-purple)",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
  },
  {
    number: "03",
    title: "Owner Review",
    description:
      "The pet owner or shelter reviews your request. They can view your profile, ask follow-up questions, and determine if you are the right match for their companion.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    color: "var(--color-coral)",
    bg: "rgba(251,113,133,0.08)",
    border: "rgba(251,113,133,0.2)",
  },
  {
    number: "04",
    title: "Approval and Pickup",
    description:
      "Once approved, coordinate the pickup directly with the owner. Our support team is available around the clock to assist with any questions or concerns throughout the process.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: "var(--color-lime)",
    bg: "rgba(217,249,157,0.08)",
    border: "rgba(217,249,157,0.2)",
  },
];

const FAQS = [
  {
    question: "Is it free to list a pet for adoption?",
    answer:
      "Yes, creating a pet listing on PetNest is completely free. You can set your own adoption fee or list your pet for free. We never charge shelters or individual owners to use our platform.",
  },
  {
    question: "How do you verify pet listings?",
    answer:
      "Every listing goes through our manual review process. We verify that health information is accurate and that photos match the pet. Shelters undergo an additional organizational verification step.",
  },
  {
    question: "Can I adopt a pet from another city?",
    answer:
      "Yes. Many of our adopters successfully adopt pets from different cities. You will coordinate logistics directly with the owner. Our support team can also connect you with verified pet transport services.",
  },
  {
    question: "What happens after my request is approved?",
    answer:
      "After approval, you will receive a notification and can coordinate pickup details with the owner. The pet status is marked as adopted, and all other pending requests for that pet are automatically closed.",
  },
  {
    question: "Can I cancel my adoption request?",
    answer:
      "Yes. You can cancel a pending adoption request at any time from your My Requests dashboard. Once a request is approved, please contact the owner directly to discuss any changes.",
  },
  {
    question: "How many pets can I list?",
    answer:
      "There is no limit to the number of pets you can list. Whether you are an individual rehoming a single pet or a shelter managing dozens of animals, our platform scales to your needs.",
  },
];

export default function ProgramPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Hero Section */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-20 pb-16 relative overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(217,249,157,0.05) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-[1280px] mx-auto px-6 text-center relative">
          <p className="section-label mb-4">How It Works</p>
          <h1 className="text-[clamp(36px,5vw,60px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)] mb-5 leading-tight">
            The PetNest
            <br />
            <span
              className="bg-gradient-to-br from-[#d9f99d] to-[#a3e635] bg-clip-text text-transparent"
            >
              Adoption Program
            </span>
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-[520px] mx-auto mb-8 leading-relaxed">
            A transparent, secure, and compassionate adoption experience built
            for both pets and people. Here is everything you need to know.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/all-pets">
              <Button className="bg-[var(--color-lime)] text-black font-bold">
                Browse Available Pets
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="bordered" className="border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--color-lime)]">
                Create an Account
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 pt-20">
        {/* How It Works Section */}
        <div className="text-center mb-14">
          <p className="section-label">Process</p>
          <h2 className="section-title">How Adoption Works</h2>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-5 mb-24">
          {STEPS.map((step, index) => (
            <StepCard key={step.number} step={step} isLast={index === STEPS.length - 1} />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="border-t border-[var(--color-border)] pt-20 mb-24">
          <div className="text-center mb-14">
            <p className="section-label">FAQ</p>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 max-w-[960px] mx-auto">
            {FAQS.map((faq) => (
              <FAQCard key={faq.question} faq={faq} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-[var(--color-surface)] border border-[rgba(217,249,157,0.15)] relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(217,249,157,0.4), transparent)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(217,249,157,0.04) 0%, transparent 70%)",
            }}
          />
          <CardBody className="p-16 px-12 text-center relative">
            <p className="section-label mb-4">Ready to Begin</p>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-[var(--color-text-primary)] tracking-tight mb-4">
              Find Your Perfect Companion Today
            </h2>
            <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[480px] mx-auto mb-8 leading-relaxed">
              Join thousands of families who have already found their perfect
              companion through PetNest. Your new best friend is waiting.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/all-pets">
                <Button className="bg-[var(--color-lime)] text-black font-bold min-w-[180px]">
                  Start Adopting
                </Button>
              </Link>
              <Link href="/dashboard/add-pet">
                <Button variant="bordered" className="border-[var(--color-border)] text-[var(--color-text-primary)] min-w-[180px] hover:border-[var(--color-lime)]">
                  List a Pet
                </Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function StepCard({ step, isLast }) {
  return (
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] relative transition-all duration-300 hover:-translate-y-0.5 group">
      <CardBody className="p-7 px-6">
        <div
          className="absolute top-5 right-5 text-[40px] font-extrabold text-white/[0.03] tracking-tighter leading-none"
        >
          {step.number}
        </div>

        <div
          className="w-13 h-13 rounded-lg flex items-center justify-center mb-5 transition-all"
          style={{
            background: step.bg,
            border: `1px solid ${step.border}`,
            color: step.color,
          }}
        >
          {step.icon}
        </div>

        <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2.5 tracking-tight">
          {step.title}
        </h3>
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
          {step.description}
        </p>

        {!isLast && (
          <div className="absolute top-12 -right-3.5 z-10 text-[var(--color-text-muted)] lg:hidden">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function FAQCard({ faq }) {
  return (
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] transition-all duration-300 hover:border-[rgba(217,249,157,0.2)]">
      <CardBody className="p-6">
        <div className="flex gap-3 items-start mb-2.5">
          <div className="w-5 h-5 rounded-full bg-[rgba(217,249,157,0.12)] border border-[rgba(217,249,157,0.25)] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-[11px] font-extrabold text-[var(--color-lime)]">
              Q
            </span>
          </div>
          <h3 className="text-sm font-bold text-[var(--color-text-primary)] leading-snug">
            {faq.question}
          </h3>
        </div>
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed pl-8">
          {faq.answer}
        </p>
      </CardBody>
    </Card>
  );
}