"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { getWishlist, removeFromWishlist } from "@/lib/api";
import { toast } from "@/lib/toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function WishlistPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const data = await getWishlist(user.email);
      setWishlist(data);
    } catch (error) {
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

const handleRemove = async (petId, petName) => {
  setRemovingId(petId);
  try {
    // নতুন এপিআই ফরম্যাট অনুযায়ী petId এবং ইউজার ইমেইল পাঠানো হলো
    await removeFromWishlist(petId, user?.email);
    
    // স্টেট থেকে প্যাটটি ফিল্টার করে রিমুভ করার লজিক
    setWishlist((prev) => prev.filter((pet) => pet._id !== petId));
    toast.success(`${petName} removed from wishlist`);
  } catch (error) {
    toast.error("Failed to remove from wishlist");
  } finally {
    setRemovingId(null);
  }
};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
    exit: { x: -300, opacity: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 md:mb-8"
      >
        <h1 className="text-2xl md:text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1">
          My Wishlist 💚
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          {wishlist.length === 0 ? "No saved pets yet" : `${wishlist.length} pet${wishlist.length > 1 ? "s" : ""} saved`}
        </p>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <div style={{ height: "200px", background: "var(--color-surface-2)", animation: "pulse 2s infinite" }} />
              <div style={{ padding: "16px" }}>
                <div style={{ height: "20px", width: "70%", background: "var(--color-surface-2)", borderRadius: "4px", marginBottom: "8px", animation: "pulse 2s infinite" }} />
                <div style={{ height: "16px", width: "50%", background: "var(--color-surface-2)", borderRadius: "4px", animation: "pulse 2s infinite" }} />
              </div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "64px", marginBottom: "16px" }}
          >
            💚
          </motion.div>
          <h3 style={{ fontSize: "20px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "8px" }}>
            Your wishlist is empty
          </h3>
          <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", marginBottom: "24px" }}>
            Start saving pets you're interested in!
          </p>
          <button
            onClick={() => router.push("/all-pets")}
            style={{
              padding: "12px 24px",
              background: "var(--color-lime)",
              color: "#000",
              border: "none",
              borderRadius: "var(--radius-sm)",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Browse Pets
          </button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}
        >
          <AnimatePresence mode="popLayout">
            {wishlist.map((pet) => (
              <WishlistCard
                key={pet.wishlistId}
                pet={pet}
                onRemove={handleRemove}
                isRemoving={removingId === pet.wishlistId}
                variants={itemVariants}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

function WishlistCard({ pet, onRemove, isRemoving, variants }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div variants={variants} layout exit="exit">
      <div style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-md)", overflow: "hidden", transition: "all 0.2s ease" }}>
        <div style={{ position: "relative", height: "200px", background: "var(--color-surface-2)" }}>
          {!imgError && pet.imageURL ? (
            <Image
              src={pet.imageURL}
              alt={pet.name}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              style={{ objectFit: "cover" }}
              onError={() => setImgError(true)}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px" }}>
              {pet.species === "Dog" ? "🐕" : pet.species === "Cat" ? "🐈" : "🐾"}
            </div>
          )}
          <span
            style={{
              position: "absolute",
              top: "8px",
              left: "8px",
              padding: "4px 12px",
              background: "var(--color-lime)",
              color: "#000",
              fontSize: "9px",
              fontWeight: "800",
              textTransform: "uppercase",
              borderRadius: "12px",
            }}
          >
            {pet.status || "Available"}
          </span>
        </div>

        <div style={{ padding: "16px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "4px" }}>
            {pet.name}
          </h3>
          <p style={{ fontSize: "11px", color: "var(--color-text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {pet.breed || pet.species} {pet.age && `• ${pet.age}`}
          </p>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => router.push(`/pets/${pet._id}`)}
              style={{
                flex: 1,
                padding: "10px",
                background: "var(--color-lime)",
                color: "#000",
                border: "none",
                borderRadius: "var(--radius-sm)",
                fontWeight: "700",
                fontSize: "11px",
                textTransform: "uppercase",
                cursor: "pointer",
                letterSpacing: "0.05em",
              }}
            >
              View Details
            </button>
            <button
              // onClick={() => onRemove(pet.wishlistId, pet.name)}
              onClick={() => onRemove(pet._id, pet.name)}
              disabled={isRemoving}
              style={{
                width: "40px",
                padding: "10px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "var(--radius-sm)",
                color: "var(--color-error)",
                cursor: isRemoving ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14H6L5 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}