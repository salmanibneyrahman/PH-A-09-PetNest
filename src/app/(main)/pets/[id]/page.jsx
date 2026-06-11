"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPetById, submitAdoptionRequest, incrementPetView } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/lib/toast";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import Image from "next/image";

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

    const fetchPet = async () => {
      setIsLoading(true);
      try {
        const data = await getPetById(id);
        setPet(data);
        await incrementPetView(id);
      } catch (error) {
        console.error("Failed to fetch pet:", error);
        toast.error("Failed to load pet details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner fullPage message="Loading pet details..." />;
  }

  if (!pet) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] gap-5 px-6">
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
    <div className="min-h-screen bg-[var(--color-bg)] pb-20">
      {/* Breadcrumb */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-5">
        <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-2">
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
          <span className="text-[13px] text-[var(--color-text-primary)] font-medium">
            {pet.name}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1280px] mx-auto px-6 py-10 grid grid-cols-[1fr_420px] lg:grid-cols-1 gap-10 items-start">
        {/* Left Column */}
        <div>
          {/* Pet Image */}
          <div className="relative rounded-lg overflow-hidden border border-[var(--color-border)] bg-[var(--color-surface-2)] mb-8 aspect-video">
            {!imgError && pet.imageURL ? (
              <Image
                src={pet.imageURL}
                alt={pet.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw"
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {pet.species === "Dog" ? "🐕" :
                 pet.species === "Cat" ? "🐈" :
                 pet.species === "Bird" ? "🦜" :
                 pet.species === "Rabbit" ? "🐇" : "🐾"}
              </div>
            )}

            <div className="absolute top-4 left-4">
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

          {/* Pet Details Card */}
          <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] mb-6">
            <CardBody className="p-8">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h1 className="text-[clamp(28px,4vw,40px)] font-bold text-[var(--color-text-primary)] tracking-tight mb-1.5">
                    {pet.name}
                  </h1>
                  <p className="text-[13px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)]">
                    {pet.species}
                    {pet.breed && ` • ${pet.breed}`}
                    {pet.age && ` • ${pet.age}`}
                  </p>
                </div>
                {pet.adoptionFee !== undefined && (
                  <div className="text-right">
                    <p className="text-[11px] text-[var(--color-text-muted)] tracking-wider uppercase mb-0.5">
                      Adoption Fee
                    </p>
                    <p className="text-[28px] font-bold text-[var(--color-lime)] tracking-tight">
                      {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
                    </p>
                  </div>
                )}
              </div>

              {/* Pet Stats Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-2 gap-4 mb-7">
                {[
                  { label: "Gender", value: pet.gender || "Not specified" },
                  { label: "Age", value: pet.age || "Not specified" },
                  {
                    label: "Vaccinated",
                    value: pet.vaccinationStatus ? "Yes" : "No",
                    highlight: pet.vaccinationStatus,
                  },
                  { label: "Health", value: pet.healthStatus || "Not specified" },
                  { label: "Location", value: pet.location || "Not specified" },
                  { label: "Species", value: pet.species },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-4 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-border)]"
                  >
                    <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-1.5">
                      {item.label}
                    </p>
                    <p className={`text-sm font-semibold ${item.highlight ? "text-[var(--color-success)]" : "text-[var(--color-text-primary)]"}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Description */}
              {pet.description && (
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--color-text-muted)] mb-3">
                    About {pet.name}
                  </h3>
                  <p className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed">
                    {pet.description}
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Owner Info Card */}
          <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
            <CardBody className="p-6">
              <h3 className="text-[13px] font-bold tracking-wider uppercase text-[var(--color-text-muted)] mb-4">
                Listed by
              </h3>
              <div className="flex items-center gap-3.5">
                <Avatar
                  name={pet.ownerEmail?.charAt(0)?.toUpperCase() || "O"}
                  className="w-11 h-11 flex-shrink-0"
                  style={{
                    background: colors.bg,
                    border: `1px solid ${colors.accent}30`,
                    color: colors.accent,
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">
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

        {/* Right Column - Sticky Sidebar */}
        <div className="sticky top-[84px]">
          {!showAdoptForm ? (
            <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-0.5"
                style={{
                  background: `linear-gradient(90deg, transparent, ${colors.accent}60, transparent)`,
                }}
              />
              <CardBody className="p-7">
                <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-1.5 tracking-tight">
                  Ready to adopt?
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-7">
                  {isAdopted
                    ? `${pet.name} has already found a loving home. Browse our other available pets.`
                    : isOwner
                    ? "You are the owner of this listing."
                    : `Submit an adoption request for ${pet.name} and we will get back to you within 24 hours.`}
                </p>

                <div className="flex flex-col gap-3 mb-6">
                  {[
                    "Verified health records provided",
                    "Secure adoption process",
                    "Post-adoption support included",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 text-[13px] text-[var(--color-text-secondary)]"
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

                <div className="h-px bg-[var(--color-border)] mb-6" />

                {isAdopted ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="py-3 px-4 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-sm text-center text-sm font-semibold text-[var(--color-text-muted)]">
                      This pet has been adopted
                    </div>
                    <Link href="/all-pets">
                      <Button
                        variant="bordered"
                        className="w-full border-[var(--color-border)] text-[var(--color-text-primary)]"
                      >
                        Browse Other Pets
                      </Button>
                    </Link>
                  </div>
                ) : isOwner ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="py-3 px-4 bg-[rgba(217,249,157,0.08)] border border-[rgba(217,249,157,0.2)] rounded-sm text-center text-[13px] text-[var(--color-lime)]">
                      You own this listing
                    </div>
                    <Link href="/dashboard/my-listings">
                      <Button
                        variant="bordered"
                        className="w-full border-[var(--color-border)] text-[var(--color-text-primary)]"
                      >
                        Manage Listing
                      </Button>
                    </Link>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="flex flex-col gap-2.5">
                    <Link href={`/login?callbackUrl=/pets/${pet._id}`}>
                      <Button className="w-full bg-[var(--color-lime)] text-black font-bold">
                        Login to Adopt
                      </Button>
                    </Link>
                    <Link href="/register">
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

      <CardHeader className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
        <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">
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

      <CardBody className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            label="Pet Name"
            value={pet.name}
            isReadOnly
            classNames={{
              label: "text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider",
              input: "text-[var(--color-text-primary)] opacity-60",
              inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] cursor-not-allowed",
            }}
          />

          <Input
            type="text"
            label="Your Name"
            value={user?.name || ""}
            isReadOnly
            classNames={{
              label: "text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider",
              input: "text-[var(--color-text-primary)] opacity-60",
              inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] cursor-not-allowed",
            }}
          />

          <Input
            type="email"
            label="Your Email"
            value={user?.email || ""}
            isReadOnly
            classNames={{
              label: "text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider",
              input: "text-[var(--color-text-primary)] opacity-60",
              inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] cursor-not-allowed",
            }}
          />

          <Input
            id="pickupDate"
            name="pickupDate"
            type="date"
            label="Preferred Pickup Date"
            value={formData.pickupDate}
            onChange={handleChange}
            min={minDate}
            isInvalid={!!errors.pickupDate}
            errorMessage={errors.pickupDate}
            classNames={{
              label: "text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider",
              input: "text-[var(--color-text-primary)] [color-scheme:dark]",
              inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)]",
            }}
          />

          <Textarea
            id="message"
            name="message"
            label={
              <span>
                Message to Owner{" "}
                <span className="text-[11px] font-normal text-[var(--color-text-muted)] normal-case tracking-normal">
                  (optional)
                </span>
              </span>
            }
            value={formData.message}
            onChange={handleChange}
            placeholder={`Tell the owner why you would be a great match for ${pet.name}...`}
            minRows={4}
            classNames={{
              label: "text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider",
              input: "text-[var(--color-text-primary)] resize-y min-h-[100px]",
              inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)]",
            }}
          />

          <div className="flex flex-col gap-2.5 pt-2">
            <Button
              type="submit"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
              className="w-full bg-[var(--color-lime)] text-black font-bold text-[13px] tracking-wider uppercase hover:bg-[var(--color-lime-dark)]"
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
            <Button
              type="button"
              variant="bordered"
              onPress={onClose}
              className="w-full border-[var(--color-border)] text-[var(--color-text-primary)]"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}