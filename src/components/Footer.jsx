"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-border)",
        paddingTop: "64px",
        paddingBottom: "32px",
        marginTop: "auto",
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
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "48px",
            marginBottom: "64px",
          }}
        >
          <div style={{ maxWidth: "280px" }}>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  background: "var(--color-lime)",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#ffffff",
                  letterSpacing: "-0.02em",
                }}
              >
                PetNest
              </span>
            </Link>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text-secondary)",
                lineHeight: "1.7",
                marginBottom: "24px",
              }}
            >
              Empowering companionships. We connect pets in need with loving
              families across the country through a transparent and verified
              adoption process.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              <SocialLink
                href="https://twitter.com"
                aria="Twitter"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://instagram.com"
                aria="Instagram"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                }
              />
              <SocialLink
                href="https://facebook.com"
                aria="Facebook"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                }
              />
              <SocialLink
                href="https://youtube.com"
                aria="YouTube"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                  </svg>
                }
              />
            </div>
          </div>

          <div>
            <h4
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "20px",
              }}
            >
              Explore
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Dogs", href: "/all-pets?species=Dog" },
                { label: "Cats", href: "/all-pets?species=Cat" },
                { label: "Birds", href: "/all-pets?species=Bird" },
                { label: "Reptiles", href: "/all-pets?species=Reptile" },
                { label: "Rabbits", href: "/all-pets?species=Rabbit" },
                { label: "All Pets", href: "/all-pets" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: "14px",
                      color: "var(--color-text-secondary)",
                      transition: "color 0.2s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-lime)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "20px",
              }}
            >
              Company
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "About Us", href: "/about" },
                { label: "Our Program", href: "/program" },
                { label: "Blog", href: "/blog" },
                { label: "Contact", href: "/contact" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    style={{
                      fontSize: "14px",
                      color: "var(--color-text-secondary)",
                      transition: "color 0.2s ease",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-text-muted)",
                marginBottom: "20px",
              }}
            >
              Join Our Pack
            </h4>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text-secondary)",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}
            >
              Get updates on new available companions and adoption events.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <input
                type="email"
                placeholder="Email address"
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  background: "var(--color-surface-2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--color-text-primary)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--color-lime)";
                  e.target.style.boxShadow = "0 0 0 3px var(--color-lime-glow)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--color-border)";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 14px",
                  background: "var(--color-lime)",
                  border: "none",
                  borderRadius: "var(--radius-sm)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-lime-dark)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-lime)"; }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#000"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </form>

            <div style={{ marginTop: "32px" }}>
              <h4
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--color-text-muted)",
                  marginBottom: "12px",
                }}
              >
                Contact Info
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <ContactItem
                  icon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  }
                  text="support@petnest.com"
                />
                <ContactItem
                  icon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  }
                  text="+1 (555) PETNEST"
                />
                <ContactItem
                  icon={
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  }
                  text="123 Pawsome Street, Pet City"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            height: "1px",
            background: "var(--color-border)",
            marginBottom: "32px",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-text-muted)",
            }}
          >
            {currentYear} PetNest. All rights reserved. Empowering companionships.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {["Privacy", "Terms", "API", "Support"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                style={{
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "var(--color-text-muted)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                  letterSpacing: "0.04em",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; }}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--color-text-muted)",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--color-success)",
                boxShadow: "0 0 8px var(--color-success)",
              }}
            />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, aria, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={aria}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "var(--radius-sm)",
        background: "var(--color-surface-2)",
        border: "1px solid var(--color-border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-text-secondary)",
        transition: "all 0.2s ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-lime)";
        e.currentTarget.style.borderColor = "rgba(217, 249, 157, 0.3)";
        e.currentTarget.style.background = "var(--color-lime-glow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-text-secondary)";
        e.currentTarget.style.borderColor = "var(--color-border)";
        e.currentTarget.style.background = "var(--color-surface-2)";
      }}
    >
      {icon}
    </a>
  );
}

function ContactItem({ icon, text }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "var(--color-text-secondary)",
        fontSize: "13px",
      }}
    >
      <span style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>{icon}</span>
      {text}
    </div>
  );
}