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
          <p className="section-label">Testimonials</p>
          <h2 className="section-title" style={{ marginBottom: "16px" }}>
            Success Stories
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
            Real families, real transformations. Hear from the people who
            found their perfect companions through PetNest.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
          }}
          className="stories-grid"
        >
          {STORIES.map((story) => (
            <div
              key={story.adopter}
              style={{
                padding: "32px",
                background: "var(--color-bg)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                transition: "all 0.3s ease",
                position: "relative",
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
                  top: "24px",
                  right: "24px",
                  fontSize: "40px",
                  color: "rgba(217,249,157,0.1)",
                  fontFamily: "Georgia, serif",
                  lineHeight: 1,
                }}
              >
                "
              </div>

              <div style={{ display: "flex", gap: "4px", marginBottom: "20px" }}>
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

              <p
                style={{
                  fontSize: "14px",
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.75",
                  marginBottom: "28px",
                  fontStyle: "italic",
                }}
              >
                "{story.quote}"
              </p>

              <div
                style={{
                  height: "1px",
                  background: "var(--color-border)",
                  marginBottom: "20px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: story.avatarColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: "700",
                      color: story.avatarColor === "var(--color-lime)" ? "#000" : "#fff",
                      flexShrink: 0,
                    }}
                  >
                    {story.avatar}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "var(--color-text-primary)",
                        marginBottom: "2px",
                      }}
                    >
                      {story.adopter}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Adopted {story.petName} • {story.species}
                    </p>
                  </div>
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--color-text-muted)",
                  }}
                >
                  {story.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .stories-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 640px) {
          .stories-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}