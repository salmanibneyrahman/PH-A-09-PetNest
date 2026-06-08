"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "@/lib/toast";
import { Button } from "@heroui/button";
import { Input, TextArea } from "@heroui/react";
import { Card, CardBody } from "@heroui/card";

const CONTACT_ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "support@petnest.com",
    sub: "We reply within 24 hours",
    color: "var(--color-lime)",
    bg: "rgba(217,249,157,0.08)",
    border: "rgba(217,249,157,0.2)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+1 (555) PETNEST",
    sub: "Mon to Fri, 9am to 6pm",
    color: "var(--color-purple)",
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.2)",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Office",
    value: "123 Pawsome Street",
    sub: "Pet City, PC 10001",
    color: "var(--color-coral)",
    bg: "rgba(251,113,133,0.08)",
    border: "rgba(251,113,133,0.2)",
  },
];

const COMMON_TOPICS = [
  "Questions about a specific pet listing",
  "Help with the adoption process",
  "Reporting a listing issue",
  "Account or payment support",
  "Partnership and shelter inquiries",
  "Press and media requests",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success(
      "Message sent successfully! We will get back to you within 24 hours."
    );
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  }, [validate]);

  const characterCount = useMemo(() => formData.message.length, [formData.message]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pb-24">
      {/* Hero Section */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-20 pb-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <p className="section-label mb-4">Get in Touch</p>
          <h1 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.03em] text-[var(--color-text-primary)] mb-4 leading-tight">
            We are here to help
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-[480px] mx-auto leading-relaxed">
            Have a question about an adoption, a listing, or our platform? Send
            us a message and our team will get back to you shortly.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 pt-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-4 mb-16">
          {CONTACT_ITEMS.map((item) => (
            <ContactInfoCard key={item.label} item={item} />
          ))}
        </div>

        {/* Form and Sidebar */}
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-10 items-start">
          {/* Form Section */}
          <div>
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight mb-2">
              Send us a message
            </h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-8 leading-relaxed">
              Fill out the form below and a member of our team will respond
              within one business day.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-name" className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                    Your Name
                  </label>
                  <Input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? "border-danger" : ""}
                  />
                  {errors.name && (
                    <p className="text-xs text-danger mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-email" className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                    Email Address
                  </label>
                  <Input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? "border-danger" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-danger mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-subject" className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                  Subject
                </label>
                <Input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  placeholder="What is your message about?"
                  value={formData.subject}
                  onChange={handleChange}
                  className={errors.subject ? "border-danger" : ""}
                />
                {errors.subject && (
                  <p className="text-xs text-danger mt-1">{errors.subject}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="contact-message" className="text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider">
                  Message
                </label>
                <TextArea
                  id="contact-message"
                  name="message"
                  aria-label="Message"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  style={{ resize: "vertical" }}
                  className={errors.message ? "border-danger" : ""}
                />
                {errors.message && (
                  <p className="text-xs text-danger mt-1">{errors.message}</p>
                )}
                <p className="text-xs text-[var(--color-text-muted)] mt-1">
                  {characterCount} / 500 characters
                </p>
              </div>

              <Button
                type="submit"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
                className="bg-[var(--color-lime)] text-black font-bold text-[13px] tracking-wider uppercase self-start min-w-[180px] hover:bg-[var(--color-lime-dark)] hover:shadow-[0_4px_20px_rgba(217,249,157,0.2)]"
                startContent={
                  !isSubmitting && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )
                }
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Common Topics */}
            <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
              <CardBody className="p-7">
                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-4">
                  Common Topics
                </h3>
                <div className="flex flex-col gap-2.5">
                  {COMMON_TOPICS.map((topic) => (
                    <div
                      key={topic}
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
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      {topic}
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Status Card */}
            <Card className="bg-[rgba(217,249,157,0.05)] border border-[rgba(217,249,157,0.15)]">
              <CardBody className="p-6">
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full bg-success/12 border border-success/25 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
                      All systems operational
                    </p>
                    <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">
                      Our platform is running normally. Average response time is
                      under 4 hours for support tickets.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactInfoCard({ item }) {
  return (
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] transition-all duration-300 hover:-translate-y-0.5 group">
      <CardBody
        className="p-7 transition-all duration-300"
        style={{
          borderColor: "var(--color-border)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = item.border;
          e.currentTarget.style.background = item.bg;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.background = "var(--color-surface)";
        }}
      >
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
          style={{
            background: item.bg,
            border: `1px solid ${item.border}`,
            color: item.color,
          }}
        >
          {item.icon}
        </div>
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-1.5">
          {item.label}
        </p>
        <p className="text-base font-semibold text-[var(--color-text-primary)] mb-1">
          {item.value}
        </p>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          {item.sub}
        </p>
      </CardBody>
    </Card>
  );
}