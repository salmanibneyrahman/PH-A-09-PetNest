"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPetById, submitAdoptionRequest, incrementPetView } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/lib/toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PetDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [pet, setPet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAdoptForm, setShowAdoptForm] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPetData = async () => {
      setIsLoading(true);
      
      // Step 1: Fetch Pet Details first
      try {
        const data = await getPetById(id);
        setPet(data);
      } catch (error) {
        console.error("Failed to fetch pet:", error);
        toast.error("Failed to load pet details");
        setIsLoading(false);
        return; // Stop execution if pet is not found
      }

      // Step 2: Increment View (Silently handle if it fails)
      try {
        await incrementPetView(id);
      } catch (error) {
        console.warn("View increment failed, but pet is loaded:", error.message);
      }

      setIsLoading(false);
    };

    fetchPetData();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading pet details..." />;
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center bg-[var(--color-bg)] gap-5 px-6">
          <div className="text-6xl">🐾</div>
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Pet not found
          </h2>
          <p className="text-[var(--color-text-secondary)] text-[15px]">
            This pet may have been removed or does not exist.
          </p>
          <Link href="/all-pets">
            <Button className="bg-[var(--color-lime)] text-black font-bold">
              Browse All Pets
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwner = user?.email === pet.ownerEmail;
  const isAdopted = pet.status === "adopted";

  const speciesColors = {
    Dog: { accent: "var(--color-purple)", bg: "rgba(168,85,247,0.08)" },
    Cat: { accent: "var(--color-coral)", bg: "rgba(251,113,133,0.08)" },
    Bird: { accent: "var(--color-lime)", bg: "rgba(217,249,157,0.08)" },
    Reptile: { accent: "var(--color-coral)", bg: "rgba(251,113,133,0.08)" },
    Rabbit: { accent: "var(--color-lime)", bg: "rgba(217,249,157,0.08)" },
  };
  const colors = speciesColors[pet.species] || {
    accent: "var(--color-lime)",
    bg: "rgba(217,249,157,0.08)",
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-4 mt-16">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex items-center gap-2">
          <Link
            href="/all-pets"
            className="flex items-center gap-1.5 text-[13px] text-[var(--color-text-muted)] no-underline transition-colors hover:text-[var(--color-text-primary)]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            All Pets
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-[13px] text-[var(--color-text-primary)] font-medium truncate">
            {pet.name}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="space-y-5 sm:space-y-6">
            {/* Pet Image */}
            <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] aspect-[4/3]">
              {!imgError && pet.imageURL ? (
                <Image
                  src={pet.imageURL}
                  alt={pet.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 700px"
                  className="object-cover"
                  onError={() => setImgError(true)}
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl sm:text-8xl">
                  {pet.species === "Dog" ? "🐕" :
                    pet.species === "Cat" ? "🐈" :
                      pet.species === "Bird" ? "🦜" :
                        pet.species === "Rabbit" ? "🐇" : "🐾"}
                </div>
              )}

              <div className="absolute top-3 left-3">
                {isAdopted ? (
                  <Chip className="bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] font-bold text-[11px] uppercase tracking-wider">
                    Adopted
                  </Chip>
                ) : (
                  <Chip className="bg-[var(--color-lime)] text-black font-bold text-[11px] uppercase tracking-wider">
                    Available
                  </Chip>
                )}
              </div>
            </div>

            {/* Pet Name & Basic Info */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] tracking-tight mb-2">
                {pet.name}
              </h1>
              <p className="text-[13px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">
                {pet.species}
                {pet.breed && ` • ${pet.breed}`}
              </p>
            </div>

            {/* Description */}
            {pet.description && (
              <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
                <CardBody className="p-4 sm:p-5">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-muted)] mb-3">
                    About {pet.name}
                  </h3>
                  <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                    {pet.description}
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Owner Info Card */}
            <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
              <CardBody className="p-4 sm:p-5">
                <h3 className="text-xs font-bold tracking-wider uppercase text-[var(--color-text-muted)] mb-3">
                  Listed by
                </h3>
                <div className="flex items-center gap-3">
                  <Avatar
                    name={pet.ownerEmail?.charAt(0)?.toUpperCase() || "O"}
                    className="w-10 h-10 flex-shrink-0"
                    style={{
                      background: colors.bg,
                      border: `1px solid ${colors.accent}30`,
                      color: colors.accent,
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                      {pet.ownerEmail?.split("@")[0] || "Owner"}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Verified Lister
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Right Sidebar - Sticky */}
          <div className="lg:sticky lg:top-[88px] space-y-4 h-fit">
            {/* Price Card */}
            {pet.adoptionFee !== undefined && (
              <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
                <CardBody className="p-4 sm:p-5">
                  <p className="text-[11px] text-[var(--color-text-muted)] tracking-wider uppercase mb-1">
                    Adoption Fee
                  </p>
                  <p className="text-2xl font-bold text-[var(--color-lime)] tracking-tight">
                    {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Pet Stats Grid */}
            <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
              <CardBody className="p-4 sm:p-5">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Age", value: pet.age || "Not specified" },
                    { label: "Gender", value: pet.gender || "Not specified" },
                    {
                      label: "Vaccinated",
                      value: pet.vaccinationStatus ? "Yes" : "No",
                      highlight: pet.vaccinationStatus,
                    },
                    { label: "Health", value: pet.healthStatus || "Good" },
                  ].map((item) => (
                    <div key={item.label} className="p-3 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-border)]">
                      <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-1">
                        {item.label}
                      </p>
                      <p className={`text-sm font-semibold truncate ${item.highlight ? "text-[var(--color-success)]" : "text-[var(--color-text-primary)]"}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {pet.location && (
                  <div className="mt-3 p-3 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-border)]">
                    <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-1">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {pet.location}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Adoption CTA */}
            {!showAdoptForm ? (
              <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${colors.accent}60, transparent)`,
                  }}
                />
                <CardBody className="p-4 sm:p-5">
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 tracking-tight">
                    Ready to adopt?
                  </h2>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-5">
                    {isAdopted
                      ? `${pet.name} has already found a loving home.`
                      : isOwner
                        ? "You are the owner of this listing."
                        : `Submit an adoption request for ${pet.name}.`}
                  </p>

                  <div className="flex flex-col gap-2 mb-5">
                    {[
                      "Verified health records",
                      "Secure adoption process",
                      "Post-adoption support",
                    ].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--color-lime)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="flex-shrink-0"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>

                  {isAdopted ? (
                    <div className="flex flex-col gap-2">
                      <div className="py-2.5 px-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-sm text-center text-sm font-semibold text-[var(--color-text-muted)]">
                        This pet has been adopted
                      </div>
                      <Link href="/all-pets" className="block">
                        <Button
                          variant="bordered"
                          className="w-full border-[var(--color-border)] text-[var(--color-text-primary)]"
                        >
                          Browse Other Pets
                        </Button>
                      </Link>
                    </div>
                  ) : isOwner ? (
                    <div className="flex flex-col gap-2">
                      <div className="py-2.5 px-3 bg-[rgba(217,249,157,0.08)] border border-[rgba(217,249,157,0.2)] rounded-sm text-center text-xs text-[var(--color-lime)]">
                        You own this listing
                      </div>
                      <Link href="/dashboard/my-listings" className="block">
                        <Button
                          variant="bordered"
                          className="w-full border-[var(--color-border)] text-[var(--color-text-primary)]"
                        >
                          Manage Listing
                        </Button>
                      </Link>
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <Link href={`/login?callbackUrl=/pets/${pet._id}`} className="block">
                        <Button className="w-full bg-[var(--color-lime)] text-black font-bold">
                          Login to Adopt
                        </Button>
                      </Link>
                      <Link href="/register" className="block">
                        <Button
                          variant="bordered"
                          className="w-full border-[var(--color-border)] text-[var(--color-text-primary)]"
                        >
                          Create Account
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <Button
                      onPress={() => setShowAdoptForm(true)}
                      className="w-full bg-[var(--color-lime)] text-black font-bold"
                    >
                      Submit Adoption Request
                    </Button>
                  )}
                </CardBody>
              </Card>
            ) : (
              <AdoptionForm
                pet={pet}
                user={user}
                onClose={() => setShowAdoptForm(false)}
                onSuccess={() => {
                  setShowAdoptForm(false);
                  toast.success(`Your adoption request for ${pet.name} has been submitted!`);
                }}
              />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function AdoptionForm({ pet, user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    pickupDate: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0];

  const validate = () => {
    const newErrors = {};
    if (!formData.pickupDate) {
      newErrors.pickupDate = "Please select a pickup date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await submitAdoptionRequest({
        petId: pet._id,
        petName: pet.name,
        ownerEmail: pet.ownerEmail,
        userName: user?.name || "",
        userEmail: user?.email || "",
        pickupDate: formData.pickupDate,
        message: formData.message,
      });
      onSuccess();
    } catch (error) {
      toast.error(error.message || "Failed to submit adoption request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-[var(--color-surface)] border border-[rgba(217,249,157,0.2)] relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(217,249,157,0.6), transparent)",
        }}
      />

      <CardHeader className="px-4 sm:px-5 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">
          Adopt {pet.name}
        </h2>
        <Button
          isIconOnly
          variant="light"
          size="sm"
          onPress={onClose}
          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Button>
      </CardHeader>

      <CardBody className="p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Pet Name Field */}
          <div className="space-y-2">
            <label className="block text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider pb-2">
              Pet Name
            </label>
            <div className="w-full h-10 px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md flex items-center cursor-not-allowed">
              <span className="text-[var(--color-text-primary)] opacity-60 text-sm">
                {pet.name}
              </span>
            </div>
          </div>

          {/* Your Name Field */}
          <div className="space-y-2">
            <label className="block text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider pt-3 pb-2">
              Your Name
            </label>
            <div className="w-full h-10 px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md flex items-center cursor-not-allowed">
              <span className="text-[var(--color-text-primary)] opacity-60 text-sm">
                {user?.name || ""}
              </span>
            </div>
          </div>

          {/* Your Email Field */}
          <div className="space-y-2">
            <label className="block text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider pt-3 pb-2">
              Your Email
            </label>
            <div className="w-full h-10 px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md flex items-center cursor-not-allowed">
              <span className="text-[var(--color-text-primary)] opacity-60 text-sm truncate">
                {user?.email || ""}
              </span>
            </div>
          </div>

          {/* Pickup Date Field */}
          <div className="space-y-2">
            <label htmlFor="pickupDate" className="block text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider pt-3 pb-2">
              Preferred Pickup Date
            </label>
            <input
              id="pickupDate"
              name="pickupDate"
              type="date"
              value={formData.pickupDate}
              onChange={handleChange}
              min={minDate}
              className={`w-full h-10 px-3 py-2 bg-[var(--color-surface-2)] border rounded-md text-[var(--color-text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-all [color-scheme:dark] ${
                errors.pickupDate ? "border-red-500" : "border-[var(--color-border)]"
              }`}
            />
            {errors.pickupDate && (
              <p className="text-xs text-red-500 mt-1">{errors.pickupDate}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <label htmlFor="message" className="block text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider pt-3 pb-2">
              Message to Owner{" "}
              <span className="text-[11px] font-normal text-[var(--color-text-muted)] normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={`Tell the owner why you would be a great match for ${pet.name}...`}
              rows={4}
              className="w-full px-3 py-2 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-md text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-muted)] placeholder:opacity-50 focus:outline-none focus:ring-2 focus:ring-[var(--color-lime)] focus:border-transparent transition-all resize-y min-h-[80px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full bg-[var(--color-lime)] text-black font-bold text-sm tracking-wider uppercase hover:bg-[var(--color-lime-dark)] transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
            <Button
              type="button"
              variant="bordered"
              onPress={onClose}
              className="w-full border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)] transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}