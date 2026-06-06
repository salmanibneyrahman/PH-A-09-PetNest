"use client";

import { useState } from "react";
import { toast } from "@/lib/toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("You have joined the PetNest pack! Welcome aboard.");
    setEmail("");
    setIsSubmitting(false);
  };

  return (
    <section
      style={{
        padding: "96px 0",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
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
            background: "var(--color-bg)",
            border: "1px solid rgba(217,249,157,0.15)",
            borderRadius: "var(--radius-lg)",
            padding: "64px 48px",
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
          className="newsletter-inner"
        >
          <div
            style={{
              position: "absolute",
              top: "-50%",
              left: "-10%",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(217,249,157,0.04) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              right: "0",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, rgba(217,249,157,0.3), transparent)",
            }}
          />

          <div>
            <p className="section-label">Stay Updated</p>
            <h2
              style={{
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: "700",
                lineHeight: "1.2",
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary)",
                marginBottom: "16px",
              }}
            >
              Never Miss a New
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #d9f99d, #a3e635)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Companion
              </span>
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                lineHeight: "1.7",
              }}
            >
              Get weekly updates on newly available pets, adoption success
              stories, care tips from our veterinary team, and exclusive
              early access to featured listings.
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginTop: "28px",
              }}
            >
              {[
                "New pet alerts",
                "Care tips",
                "Adoption events",
                "Success stories",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--color-lime)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "600",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--color-text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--color-text-primary)",
                    fontSize: "14px",
                    fontFamily: "var(--font-sans)",
                    outline: "none",
                    transition: "all 0.2s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-lime)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(217,249,157,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: isSubmitting
                    ? "rgba(217,249,157,0.5)"
                    : "var(--color-lime)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  color: "#000",
                  fontSize: "13px",
                  fontWeight: "700",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = "var(--color-lime-dark)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) {
                    e.currentTarget.style.background = "var(--color-lime)";
                  }
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "2px solid rgba(0,0,0,0.3)",
                        borderTopColor: "#000",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                      }}
                    />
                    Joining...
                  </>
                ) : (
                  "Join Our Pack"
                )}
              </button>

              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  marginTop: "12px",
                  textAlign: "center",
                }}
              >
                No spam ever. Unsubscribe in one click. Read our{" "}
                <span
                  style={{
                    color: "var(--color-lime)",
                    cursor: "pointer",
                  }}
                >
                  Privacy Policy
                </span>
                .
              </p>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .newsletter-inner {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
            padding: 40px 32px !important;
          }
        }
        @media (max-width: 640px) {
          .newsletter-inner {
            padding: 32px 24px !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}