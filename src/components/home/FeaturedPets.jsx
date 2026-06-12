"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFeaturedPets } from "@/lib/api";
import Image from "next/image";

export default function FeaturedPets() {
  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const data = await getFeaturedPets();
        setPets(data);
      } catch (error) {
        console.error("Failed to fetch featured pets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPets();
  }, []);

  const speciesColors = {
    Dog: "var(--color-purple)",
    Cat: "var(--color-coral)",
    Bird: "var(--color-lime)",
    Reptile: "var(--color-coral)",
    Rabbit: "var(--color-lime)",
  };

  return (
    <section
      style={{
        padding: "96px 0",
        background: "var(--color-bg)",
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
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "48px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p className="section-label">Featured</p>
            <h2 className="section-title">The Ledger of Love</h2>
            <p
              style={{
                fontSize: "15px",
                color: "var(--color-text-secondary)",
                marginTop: "8px",
              }}
            >
              Meet pets waiting for their forever home
            </p>
          </div>
          <Link
            href="/all-pets"
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "var(--color-lime)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "gap 0.2s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.gap = "10px"; }}
            onMouseLeave={(e) => { e.currentTarget.style.gap = "6px"; }}
          >
            View All Available Pets
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>

        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="skeleton"
                  style={{ height: "240px", width: "100%" }}
                />
                <div style={{ padding: "20px" }}>
                  <div className="skeleton" style={{ height: "20px", width: "60%", marginBottom: "8px" }} />
                  <div className="skeleton" style={{ height: "14px", width: "80%", marginBottom: "20px" }} />
                  <div className="skeleton" style={{ height: "36px", width: "100%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 24px",
              color: "var(--color-text-muted)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🐾</div>
            <p style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-text-secondary)" }}>
              No featured pets yet
            </p>
            <p style={{ fontSize: "14px", marginTop: "8px" }}>
              Check back soon for new arrivals
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "20px",
            }}
          >
            {pets.map((pet, index) => {
              const accentColor = speciesColors[pet.species] || "var(--color-lime)";
              const isAdopted = pet.status === "adopted";
              return (
                <div
                  key={pet._id}
                  style={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    opacity: isAdopted ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isAdopted) {
                      e.currentTarget.style.borderColor = `${accentColor}40`;
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = `0 8px 32px ${accentColor}10`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--color-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      height: "240px",
                      overflow: "hidden",
                      background: "var(--color-surface-2)",
                    }}
                  >
                    {pet.imageURL ? (
                      <Image
                        src={pet.imageURL}
                        alt={pet.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 700px"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "56px",
                        }}
                      >
                        {pet.species === "Dog" ? "🐕" :
                         pet.species === "Cat" ? "🐈" :
                         pet.species === "Bird" ? "🦜" :
                         pet.species === "Rabbit" ? "🐇" : "🐾"}
                      </div>
                    )}

                    {index === 0 && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          padding: "4px 10px",
                          background: "var(--color-lime)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "10px",
                          fontWeight: "700",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "#000",
                        }}
                      >
                        New Arrival
                      </div>
                    )}
                    {isAdopted && (
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          padding: "4px 10px",
                          background: "var(--color-surface-3)",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "10px",
                          fontWeight: "700",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--color-text-muted)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        Adopted
                      </div>
                    )}

                    <button
                      style={{
                        position: "absolute",
                        top: "12px",
                        right: "12px",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        background: "rgba(0,0,0,0.6)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.7)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--color-coral)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      }}
                      aria-label="Save"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>

                  <div style={{ padding: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "17px",
                          fontWeight: "700",
                          color: "var(--color-text-primary)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {pet.name}
                      </h3>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--color-text-muted)",
                        marginBottom: "16px",
                      }}
                    >
                      {pet.age && `${pet.age} old`}
                      {pet.breed && ` • ${pet.breed}`}
                    </p>

                    <Link
                      href={`/pets/${pet._id}`}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px",
                        background: "transparent",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "var(--radius-sm)",
                        color: "var(--color-text-primary)",
                        fontSize: "11px",
                        fontWeight: "700",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        textAlign: "center",
                        textDecoration: "none",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                      }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}