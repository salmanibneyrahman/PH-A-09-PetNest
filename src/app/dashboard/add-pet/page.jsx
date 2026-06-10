"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { addPet } from "@/lib/api";
import { toast } from "@/lib/toast";
import Image from "next/image";

const SPECIES_OPTIONS = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Fish", "Guinea Pig", "Hamster", "Other"];
const GENDER_OPTIONS = ["Male", "Female"];
const HEALTH_OPTIONS = ["Excellent", "Good", "Fair", "Needs Care"];

export default function AddPetPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    gender: "",
    imageURL: "",
    healthStatus: "",
    vaccinationStatus: false,
    location: "",
    adoptionFee: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Pet name is required";
    if (!formData.species) newErrors.species = "Species is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (formData.imageURL && formData.imageURL.trim()) {
      try {
        new URL(formData.imageURL);
      } catch {
        newErrors.imageURL = "Please enter a valid image URL";
      }
    }
    if (formData.adoptionFee !== "" && isNaN(parseFloat(formData.adoptionFee))) {
      newErrors.adoptionFee = "Please enter a valid number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "imageURL" && value.trim()) {
      setImagePreview(value.trim());
    } else if (name === "imageURL") {
      setImagePreview("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    setIsSubmitting(true);
    try {
      await addPet({
        ...formData,
        adoptionFee: formData.adoptionFee === "" ? 0 : parseFloat(formData.adoptionFee),
        ownerEmail: user?.email,
      });
      toast.success(`${formData.name} has been listed successfully!`);
      router.push("/dashboard/my-listings");
    } catch (error) {
      toast.error(error.message || "Failed to add pet listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const InputField = ({
    label,
    name,
    type = "text",
    placeholder,
    required = false,
    children,
    hint,
  }) => (
    <div>
      <label
        htmlFor={name}
        style={{
          display: "block",
          fontSize: "12px",
          fontWeight: "600",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: errors[name]
            ? "var(--color-error)"
            : "var(--color-text-secondary)",
          marginBottom: "8px",
        }}
      >
        {label}
        {required && (
          <span style={{ color: "var(--color-lime)", marginLeft: "3px" }}>*</span>
        )}
      </label>
      {children || (
        <input
          id={name}
          name={name}
          type={type}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="input-field"
          style={{
            borderColor: errors[name] ? "var(--color-error)" : undefined,
          }}
        />
      )}
      {errors[name] && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-error)",
            marginTop: "5px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {errors[name]}
        </p>
      )}
      {hint && !errors[name] && (
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-text-muted)",
            marginTop: "5px",
          }}
        >
          {hint}
        </p>
      )}
    </div>
  );

  return (
    <div style={{ animation: "fadeIn 0.3s ease", maxWidth: "800px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "var(--color-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "4px",
          }}
        >
          Add New Pet
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
          Create a listing to find your pet a loving forever home
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(217,249,157,0.12)",
                border: "1px solid rgba(217,249,157,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-lime)",
                fontSize: "13px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              1
            </div>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "var(--color-text-primary)",
              }}
            >
              Basic Information
            </h2>
          </div>

          <div
            style={{
              padding: "24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
            className="form-grid-2"
          >
            <InputField
              label="Pet Name"
              name="name"
              placeholder="e.g. Buddy, Luna, Max"
              required
            />

            <div>
              <label
                htmlFor="species"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: errors.species
                    ? "var(--color-error)"
                    : "var(--color-text-secondary)",
                  marginBottom: "8px",
                }}
              >
                Species <span style={{ color: "var(--color-lime)" }}>*</span>
              </label>
              <select
                id="species"
                name="species"
                value={formData.species}
                onChange={handleChange}
                className="select-field"
                style={{
                  borderColor: errors.species
                    ? "var(--color-error)"
                    : undefined,
                }}
              >
                <option value="">Select species...</option>
                {SPECIES_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.species && (
                <p style={{ fontSize: "12px", color: "var(--color-error)", marginTop: "5px" }}>
                  {errors.species}
                </p>
              )}
            </div>

            <InputField
              label="Breed"
              name="breed"
              placeholder="e.g. Golden Retriever, Persian"
              hint="Leave blank if mixed breed or unknown"
            />

            <InputField
              label="Age"
              name="age"
              placeholder="e.g. 2 years, 6 months"
              required
            />

            <div>
              <label
                htmlFor="gender"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: errors.gender
                    ? "var(--color-error)"
                    : "var(--color-text-secondary)",
                  marginBottom: "8px",
                }}
              >
                Gender <span style={{ color: "var(--color-lime)" }}>*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="select-field"
                style={{
                  borderColor: errors.gender
                    ? "var(--color-error)"
                    : undefined,
                }}
              >
                <option value="">Select gender...</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.gender && (
                <p style={{ fontSize: "12px", color: "var(--color-error)", marginTop: "5px" }}>
                  {errors.gender}
                </p>
              )}
            </div>

            <InputField
              label="Location"
              name="location"
              placeholder="e.g. New York, NY"
              required
            />
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(217,249,157,0.12)",
                border: "1px solid rgba(217,249,157,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-lime)",
                fontSize: "13px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              2
            </div>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "var(--color-text-primary)",
              }}
            >
              Health & Medical
            </h2>
          </div>

          <div
            style={{
              padding: "24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
            className="form-grid-2"
          >
            <div>
              <label
                htmlFor="healthStatus"
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
                Health Status
              </label>
              <select
                id="healthStatus"
                name="healthStatus"
                value={formData.healthStatus}
                onChange={handleChange}
                className="select-field"
              >
                <option value="">Select status...</option>
                {HEALTH_OPTIONS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0",
              }}
            >
              <div style={{ paddingTop: "20px", width: "100%" }}>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: "pointer",
                    padding: "14px 16px",
                    background: formData.vaccinationStatus
                      ? "rgba(34,197,94,0.08)"
                      : "var(--color-surface-2)",
                    border: `1px solid ${formData.vaccinationStatus ? "rgba(34,197,94,0.25)" : "var(--color-border)"}`,
                    borderRadius: "var(--radius-sm)",
                    transition: "all 0.2s ease",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "4px",
                      border: `2px solid ${formData.vaccinationStatus ? "var(--color-success)" : "var(--color-border)"}`,
                      background: formData.vaccinationStatus
                        ? "var(--color-success)"
                        : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {formData.vaccinationStatus && (
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <input
                    type="checkbox"
                    name="vaccinationStatus"
                    checked={formData.vaccinationStatus}
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: "600",
                        color: formData.vaccinationStatus
                          ? "var(--color-success)"
                          : "var(--color-text-primary)",
                        marginBottom: "1px",
                      }}
                    >
                      Vaccinated
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      Check if up-to-date on vaccinations
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(217,249,157,0.12)",
                border: "1px solid rgba(217,249,157,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-lime)",
                fontSize: "13px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              3
            </div>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "var(--color-text-primary)",
              }}
            >
              Photo & Description
            </h2>
          </div>

          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label
                htmlFor="imageURL"
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "600",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: errors.imageURL
                    ? "var(--color-error)"
                    : "var(--color-text-secondary)",
                  marginBottom: "8px",
                }}
              >
                Image URL
              </label>
              <input
                id="imageURL"
                name="imageURL"
                type="url"
                value={formData.imageURL}
                onChange={handleChange}
                placeholder="https://example.com/pet-photo.jpg"
                className="input-field"
                style={{
                  borderColor: errors.imageURL
                    ? "var(--color-error)"
                    : undefined,
                }}
              />
              {errors.imageURL && (
                <p style={{ fontSize: "12px", color: "var(--color-error)", marginTop: "5px" }}>
                  {errors.imageURL}
                </p>
              )}
              {imagePreview && !errors.imageURL && (
                <div
                  style={{
                    marginTop: "12px",
                    position: "relative",
                    width: "120px",
                    height: "90px",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={() => setImagePreview("")}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      left: "4px",
                      padding: "2px 6px",
                      background: "rgba(0,0,0,0.7)",
                      borderRadius: "2px",
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "var(--color-lime)",
                    }}
                  >
                    PREVIEW
                  </div>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
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
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder={`Tell potential adopters about ${formData.name || "your pet"}'s personality, habits, favorite activities, and what makes them special...`}
                rows={5}
                className="input-field"
                style={{ resize: "vertical", minHeight: "120px" }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  marginTop: "5px",
                }}
              >
                {formData.description.length} characters
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "rgba(217,249,157,0.12)",
                border: "1px solid rgba(217,249,157,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--color-lime)",
                fontSize: "13px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              4
            </div>
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "700",
                color: "var(--color-text-primary)",
              }}
            >
              Listing Details
            </h2>
          </div>

          <div
            style={{
              padding: "24px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
            className="form-grid-2"
          >
            <InputField
              label="Adoption Fee ($)"
              name="adoptionFee"
              type="number"
              placeholder="0 for free"
              hint="Enter 0 if you are listing for free"
            />

            <div>
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
                Owner Email
              </label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className="input-field"
                style={{ opacity: 0.5, cursor: "not-allowed" }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-muted)",
                  marginTop: "5px",
                }}
              >
                Auto-filled from your account
              </p>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <button
            type="button"
            onClick={() => router.push("/dashboard/my-listings")}
            className="btn-secondary"
            style={{ minWidth: "120px" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              minWidth: "160px",
              padding: "12px 24px",
              background: isSubmitting
                ? "rgba(217,249,157,0.5)"
                : "var(--color-lime)",
              border: "none",
              borderRadius: "var(--radius-sm)",
              color: "#000",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: isSubmitting ? "not-allowed" : "pointer",
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = "var(--color-lime-dark)";
                e.currentTarget.style.boxShadow =
                  "0 4px 20px rgba(217,249,157,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) {
                e.currentTarget.style.background = "var(--color-lime)";
                e.currentTarget.style.boxShadow = "none";
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
                Publishing...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Publish Listing
              </>
            )}
          </button>
        </div>
      </form>

      <style jsx>{`
        @media (max-width: 640px) {
          .form-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}