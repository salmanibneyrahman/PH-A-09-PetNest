import { Card, CardBody } from "@heroui/card";

const STORIES = [
  {
    adopter: "Sarah Mitchell",
    petName: "Buddy",
    species: "Golden Retriever",
    quote:
      "The entire process was incredibly smooth. Within two weeks of submitting my request, Buddy was home. He has completely transformed our family dynamic for the better.",
    avatar: "SM",
    timeAgo: "2 months ago",
    rating: 5,
    avatarColor: "var(--color-lime)",
  },
  {
    adopter: "James Okafor",
    petName: "Luna",
    species: "Domestic Shorthair Cat",
    quote:
      "I was skeptical about online adoption, but PetNest made every step transparent. Luna arrived healthy, vaccinated, and full of personality. Could not be happier.",
    avatar: "JO",
    timeAgo: "3 weeks ago",
    rating: 5,
    avatarColor: "var(--color-purple)",
  },
  {
    adopter: "Priya Sharma",
    petName: "Rio",
    species: "African Grey Parrot",
    quote:
      "The detailed profile and health certificate gave me full confidence. Rio is settling in beautifully and already learning new words. The support team was phenomenal.",
    avatar: "PS",
    timeAgo: "1 month ago",
    rating: 5,
    avatarColor: "var(--color-coral)",
  },
  {
    adopter: "Anika Rahman",
    petName: "Milo",
    species: "Persian Cat",
    quote:
      "The seamless adoption process and clear background checks made everything so easy. Milo is incredibly playful and has already found his favorite spot on the couch. Highly recommend this platform!",
    avatar: "AR",
    timeAgo: "2 weeks ago",
    rating: 5,
    avatarColor: "var(--color-warning)", // Changed from amber to a standard CSS var or color
  },
];

export default function SuccessStories() {
  return (
    <section className="py-24 bg-[var(--color-bg)] border-t border-b border-[var(--color-border)] relative overflow-hidden">
      {/* Subtle Background Glow for Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[var(--color-lime)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 relative z-10">

        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-[var(--color-lime)] mb-3">
            Testimonials
          </p>
          <h2 className="text-[clamp(28px,4vw,48px)] font-bold leading-[1.15] tracking-[-0.02em] text-[var(--color-text-primary)] mb-4">
            Success Stories
          </h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[500px] mx-auto leading-relaxed">
            Real families, real transformations. Hear from the people who
            found their perfect companions through PetNest.
          </p>
        </div>

        {/* Stories Grid - Perfectly balanced 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STORIES.map((story) => (
            <StoryCard key={story.adopter} story={story} />
          ))}
        </div>

      </div>
    </section>
  );
}

function StoryCard({ story }) {
  // Use a fallback color for warning/amber if the CSS var isn't defined
  const bgAvatarColor = story.avatarColor === "var(--color-warning)" ? "#f59e0b" : story.avatarColor;

  return (
    <div className="group h-full">
      <Card className="h-full bg-[rgba(15,15,15,0.6)] backdrop-blur-xl border border-[rgba(255,255,255,0.08)] transition-all duration-300 hover:border-[rgba(217,249,157,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(217,249,157,0.06)]">
        <CardBody className="p-7 flex flex-col h-full relative overflow-hidden">

          {/* SVG Quote Mark (Fixed visual asset rendering) */}
          <div className="absolute top-6 right-6 text-[rgba(255,255,255,0.05)] group-hover:text-[rgba(217,249,157,0.15)] transition-colors duration-300">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
          </div>

          {/* Rating Stars */}
          <div className="flex gap-1 mb-5 relative z-10">
            {[...Array(story.rating)].map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="var(--color-lime)"
                stroke="var(--color-lime)"
                strokeWidth="1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>

          {/* Quote */}
          <p className="text-[14px] text-gray-300 leading-relaxed mb-8 italic flex-grow relative z-10">
            "{story.quote}"
          </p>

          {/* Divider */}
          <div className="h-px bg-[rgba(255,255,255,0.06)] w-full mb-5 mt-auto relative z-10" />

          {/* Footer & Fixed Custom Avatar */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              {/* Custom HTML Avatar guarantees initials rendering */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-extrabold flex-shrink-0"
                style={{
                  backgroundColor: bgAvatarColor,
                  color: bgAvatarColor === "var(--color-lime)" ? "#000" : "#fff",
                  boxShadow: `0 0 15px ${bgAvatarColor}40`
                }}
              >
                {story.avatar}
              </div>

              <div>
                <p className="text-sm font-bold text-white mb-0.5 tracking-tight">
                  {story.adopter}
                </p>
                <p className="text-[11px] font-medium text-[var(--color-lime)]">
                  Adopted {story.petName}
                </p>
              </div>
            </div>
          </div>

        </CardBody>
      </Card>
    </div>
  );
}