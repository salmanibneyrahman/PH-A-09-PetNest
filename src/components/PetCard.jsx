"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { addToWishlist, removeFromWishlist, getWishlist } from "@/lib/api";
import { toast } from "@/lib/toast";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PetCard({ pet }) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  const speciesColors = {
    Dog: { border: "rgba(168, 85, 247, 0.4)", glow: "rgba(168, 85, 247, 0.08)" },
    Cat: { border: "rgba(251, 113, 133, 0.4)", glow: "rgba(251, 113, 133, 0.08)" },
    Bird: { border: "rgba(217, 249, 157, 0.4)", glow: "rgba(217, 249, 157, 0.08)" },
    Reptile: { border: "rgba(251, 113, 133, 0.4)", glow: "rgba(251, 113, 133, 0.08)" },
    Rabbit: { border: "rgba(217, 249, 157, 0.4)", glow: "rgba(217, 249, 157, 0.08)" },
    default: { border: "rgba(217, 249, 157, 0.4)", glow: "rgba(217, 249, 157, 0.08)" },
  };

  const colors = speciesColors[pet.species] || speciesColors.default;

  // Check if pet is in user's wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !user?.email) return;
      try {
        const wishlistData = await getWishlist(user.email);
        const found = wishlistData.find((item) => item._id === pet._id);
        if (found && found.wishlistId) {
          setIsInWishlist(true);
          setWishlistId(found.wishlistId);
        }
      } catch (error) {
        // Silently fail - wishlist is optional feature
      }
    };
    checkWishlistStatus();
  }, [isAuthenticated, user, pet._id]);

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Please login to add to wishlist");
      router.push("/login");
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isInWishlist && wishlistId) {
        await removeFromWishlist(wishlistId);
        setIsInWishlist(false);
        setWishlistId(null);
        toast.success("Removed from wishlist");
      } else {
        const result = await addToWishlist(pet._id, user.email);
        setIsInWishlist(true);
        setWishlistId(result.id);
        toast.success("Added to wishlist");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update wishlist");
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=/pets/${pet._id}`);
      return;
    }
    router.push(`/pets/${pet._id}`);
  };

  const isAdopted = pet.status === "adopted";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "var(--color-surface)",
        border: `1px solid ${isHovered ? colors.border : "var(--color-border)"}`,
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        transition: "all 0.3s ease",
        boxShadow: isHovered ? `0 0 24px ${colors.glow}` : "none",
        opacity: isAdopted ? 0.7 : 1,
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "4/3",
          overflow: "hidden",
          background: "var(--color-surface-2)",
        }}
      >
        {!imgError && pet.imageURL ? (
          <Image
            src={pet.imageURL}
            alt={pet.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
              transform: isHovered ? "scale(1.04)" : "scale(1)",
            }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--color-surface-2)",
              color: "var(--color-text-muted)",
              fontSize: "48px",
            }}
          >
            {pet.species === "Dog" ? "🐕" :
             pet.species === "Cat" ? "🐈" :
             pet.species === "Bird" ? "🦜" :
             pet.species === "Rabbit" ? "🐇" :
             pet.species === "Reptile" ? "🦎" : "🐾"}
          </div>
        )}

        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
          }}
        >
          {isAdopted ? (
            <span className="badge badge-adopted">ADOPTED</span>
          ) : pet.status === "pending" ? (
            <span className="badge badge-pending">PENDING</span>
          ) : (
            <span className="badge badge-lime">AVAILABLE</span>
          )}
        </div>

        {/* WISHLIST HEART BUTTON WITH ANIMATION */}
        <motion.button
          onClick={handleWishlistToggle}
          disabled={isWishlistLoading}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: isWishlistLoading ? "wait" : "pointer",
            color: isInWishlist ? "var(--color-coral)" : "rgba(255,255,255,0.7)",
            transition: "all 0.2s ease",
            pointerEvents: isWishlistLoading ? "none" : "auto",
          }}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={isInWishlist ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={isInWishlist ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </motion.svg>
        </motion.button>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "8px" }}>
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "700",
              color: "var(--color-text-primary)",
              marginBottom: "4px",
              letterSpacing: "-0.01em",
            }}
          >
            {pet.name}
          </h3>
          <p
            style={{
              fontSize: "11px",
              fontWeight: "600",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-muted)",
            }}
          >
            {pet.breed && `${pet.breed} `}
            {pet.age && `• ${pet.age}`}
          </p>
        </div>

        {pet.description && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--color-text-secondary)",
              lineHeight: "1.5",
              marginBottom: "16px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {pet.description}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "16px",
          }}
        >
          {pet.location && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                color: "var(--color-text-muted)",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {pet.location}
            </div>
          )}
          {pet.adoptionFee !== undefined && (
            <div
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--color-lime)",
              }}
            >
              {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={handleViewDetails}
            style={{
              flex: 1,
              padding: "10px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-primary)",
              fontSize: "12px",
              fontWeight: "700",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            }}
          >
            View Profile
          </button>
          <button
            style={{
              width: "40px",
              height: "40px",
              background: "var(--color-surface-2)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-sm)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
              transition: "all 0.2s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--color-text-primary)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--color-text-muted)";
              e.currentTarget.style.borderColor = "var(--color-border)";
            }}
            aria-label="Share pet"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}