import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";

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
];

export default function SuccessStories() {
  return (
    <section className="py-24 bg-[var(--color-surface)] border-t border-b border-[var(--color-border)]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title mb-4">Success Stories</h2>
          <p className="text-[15px] text-[var(--color-text-secondary)] max-w-[480px] mx-auto leading-relaxed">
            Real families, real transformations. Hear from the people who
            found their perfect companions through PetNest.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-5">
          {STORIES.map((story) => (
            <StoryCard key={story.adopter} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryCard({ story }) {
  return (
    <Card className="bg-[var(--color-bg)] border border-[var(--color-border)] relative transition-all duration-300 hover:border-[rgba(217,249,157,0.2)] hover:-translate-y-0.5">
      <CardBody className="p-8">
        {/* Quote Mark */}
        <div className="absolute top-6 right-6 text-[40px] text-[rgba(217,249,157,0.1)] font-serif leading-none">
          "
        </div>

        {/* Rating Stars */}
        <div className="flex gap-1 mb-5">
          {[...Array(story.rating)].map((_, i) => (
            <svg
              key={i}
              width="14"
              height="14"
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
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-7 italic">
          "{story.quote}"
        </p>

        {/* Divider */}
        <div className="h-px bg-[var(--color-border)] mb-5" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              name={story.avatar}
              className="w-10 h-10 flex-shrink-0 text-[13px] font-bold"
              style={{
                background: story.avatarColor,
                color: story.avatarColor === "var(--color-lime)" ? "#000" : "#fff",
              }}
            />
            <div>
              <p className="text-sm font-bold text-[var(--color-text-primary)] mb-0.5">
                {story.adopter}
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Adopted {story.petName} • {story.species}
              </p>
            </div>
          </div>
          <span className="text-[11px] text-[var(--color-text-muted)]">
            {story.timeAgo}
          </span>
        </div>
      </CardBody>
    </Card>
  );
}