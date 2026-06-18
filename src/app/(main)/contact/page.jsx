"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "@/lib/toast";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";

const CONTACT_ITEMS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "support@petnest.com",
    sub: "We reply within 24 hours",
    color: "var(--color-lime)",
    bg: "rgba(217,249,157,0.1)",
    border: "rgba(217,249,157,0.3)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: "+1 (555) PETNEST",
    sub: "Mon to Fri, 9am to 6pm",
    color: "var(--color-purple)",
    bg: "rgba(168,85,247,0.1)",
    border: "rgba(168,85,247,0.3)",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Office",
    value: "123 Pawsome Street",
    sub: "Pet City, PC 10001",
    color: "var(--color-coral)",
    bg: "rgba(251,113,133,0.1)",
    border: "rgba(251,113,133,0.3)",
  },
];

// Updated to include answers for the interactive accordion
const COMMON_TOPICS = [
  {
    q: "Questions about a specific pet listing",
    a: "Please include the pet's name or ID in your message so our team can pull up their profile and assist you quickly."
  },
  {
    q: "Help with the adoption process",
    a: "Our adoption process includes a brief background check and a virtual meet-and-greet. Let us know which step you need help with."
  },
  {
    q: "Reporting a listing issue",
    a: "If you found a suspicious, duplicate, or outdated listing, please provide details and we will investigate it immediately."
  },
  {
    q: "Account or payment support",
    a: "For account recovery or billing issues, please ensure you use your registered email address. Do not share credit card details here."
  },
  {
    q: "Partnership and shelter inquiries",
    a: "We love partnering with verified shelters! Mention your shelter's name, location, and official website in your message."
  }
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
  const [activeFaq, setActiveFaq] = useState(null);

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

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validate()) return;
      setIsSubmitting(true);
      await new Promise((r) => setTimeout(r, 1200));
      toast.success(
        "Message sent successfully! We will get back to you within 24 hours."
      );
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    },
    [validate]
  );

  const characterCount = useMemo(
    () => formData.message.length,
    [formData.message]
  );

  return (
    <div className="min-h-screen bg-[var(--color-bg)] relative overflow-hidden pb-24">
      {/* Subtle Background Glow Orbs for Glass Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-lime)] opacity-[0.03] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-purple)] opacity-[0.03] blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 md:pt-28 md:pb-20 z-10">
        <div className="max-w-[1280px] mx-auto px-6 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-surface-2)]/50 border border-[var(--color-border)] backdrop-blur-md mb-6">
            <span className="w-2 h-2 rounded-full bg-[var(--color-lime)] animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-[var(--color-text-secondary)]">Get in Touch</span>
          </div>
          <h1 className="text-[clamp(40px,6vw,64px)] font-extrabold tracking-tight text-[var(--color-text-primary)] mb-6 leading-[1.1]">
            How can we <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-lime)] to-emerald-400">
              help you?
            </span>
          </h1>
          <p className="text-base md:text-lg text-[var(--color-text-secondary)] max-w-[540px] leading-relaxed">
            Whether you have a question about adoption, need help with a listing, or just want to say hello—we are ready to listen.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-6 relative z-10">
        {/* Contact Info Glass Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-16">
          {CONTACT_ITEMS.map((item) => (
            <ContactInfoCard key={item.label} item={item} />
          ))}
        </div>

        {/* Form and Sidebar Split */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-12 items-start">

          {/* Glass Form Section */}
          <Card className="bg-[var(--color-surface)]/60 backdrop-blur-2xl border border-[var(--color-border)]/50 shadow-2xl shadow-black/5 rounded-2xl overflow-visible">
            <CardBody className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight mb-2">
                  Send us a message
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Fill out the form below and our team will respond within one business day.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-name" className="text-[var(--color-text-secondary)] text-[11px] font-bold uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full bg-[var(--color-surface-2)]/40 hover:bg-[var(--color-surface-2)]/80 border ${errors.name ? "border-[var(--color-error)]" : "border-[var(--color-border)]/50"} rounded-xl px-4 py-3.5 outline-none focus:border-[var(--color-lime)] focus:bg-transparent text-[var(--color-text-primary)] text-sm transition-all duration-300 placeholder:text-[var(--color-text-muted)]`}
                    />
                    {errors.name && <span className="text-[11px] text-[var(--color-error)] font-medium">{errors.name}</span>}
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="contact-email" className="text-[var(--color-text-secondary)] text-[11px] font-bold uppercase tracking-wider">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full bg-[var(--color-surface-2)]/40 hover:bg-[var(--color-surface-2)]/80 border ${errors.email ? "border-[var(--color-error)]" : "border-[var(--color-border)]/50"} rounded-xl px-4 py-3.5 outline-none focus:border-[var(--color-lime)] focus:bg-transparent text-[var(--color-text-primary)] text-sm transition-all duration-300 placeholder:text-[var(--color-text-muted)]`}
                    />
                    {errors.email && <span className="text-[11px] text-[var(--color-error)] font-medium">{errors.email}</span>}
                  </div>
                </div>

                {/* Subject Input */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="contact-subject" className="text-[var(--color-text-secondary)] text-[11px] font-bold uppercase tracking-wider">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full bg-[var(--color-surface-2)]/40 hover:bg-[var(--color-surface-2)]/80 border ${errors.subject ? "border-[var(--color-error)]" : "border-[var(--color-border)]/50"} rounded-xl px-4 py-3.5 outline-none focus:border-[var(--color-lime)] focus:bg-transparent text-[var(--color-text-primary)] text-sm transition-all duration-300 placeholder:text-[var(--color-text-muted)]`}
                  />
                  {errors.subject && <span className="text-[11px] text-[var(--color-error)] font-medium">{errors.subject}</span>}
                </div>

                {/* Message TextArea */}
                <div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <label htmlFor="contact-message" className="text-[var(--color-text-secondary)] text-[11px] font-bold uppercase tracking-wider">
                        Message
                      </label>
                      <span className={`text-[10px] font-medium ${characterCount > 500 ? 'text-[var(--color-error)]' : 'text-[var(--color-text-muted)]'}`}>
                        {characterCount} / 500
                      </span>
                    </div>
                    <textarea
                      id="contact-message"
                      name="message"
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full bg-[var(--color-surface-2)]/40 hover:bg-[var(--color-surface-2)]/80 border ${errors.message ? "border-[var(--color-error)]" : "border-[var(--color-border)]/50"} rounded-xl px-4 py-3.5 outline-none focus:border-[var(--color-lime)] focus:bg-transparent text-[var(--color-text-primary)] text-sm resize-y transition-all duration-300 placeholder:text-[var(--color-text-muted)]`}
                    />
                    {errors.message && <span className="text-[11px] text-[var(--color-error)] font-medium">{errors.message}</span>}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto h-12 px-8 bg-[var(--color-lime)] text-black font-extrabold text-[13px] tracking-widest uppercase rounded-xl hover:bg-[#c9f17d] transition-transform hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(217,249,157,0.2)]"
                    startContent={
                      !isSubmitting && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      )
                    }
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Sidebar / FAQ */}
          <div className="flex flex-col gap-6">
            <div className="mb-2">
              <h3 className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight mb-2">
                Frequently Asked
              </h3>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Find quick answers to common questions before reaching out.
              </p>
            </div>

            {/* Interactive Accordion */}
            <div className="flex flex-col gap-3">
              {COMMON_TOPICS.map((topic, index) => {
                const isActive = activeFaq === index;
                return (
                  <div
                    key={index}
                    className={`rounded-xl border transition-all duration-300 overflow-hidden cursor-pointer ${isActive ? 'bg-[var(--color-surface)]/80 border-[var(--color-lime)]/30 backdrop-blur-md shadow-lg' : 'bg-[var(--color-surface)]/30 border-[var(--color-border)]/50 hover:bg-[var(--color-surface)]/60'}`}
                    onClick={() => setActiveFaq(isActive ? null : index)}
                  >
                    <div className="p-4 md:p-5 flex items-center justify-between gap-4">
                      <h4 className={`text-sm font-semibold transition-colors ${isActive ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                        {topic.q}
                      </h4>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${isActive ? 'bg-[var(--color-lime)] text-black rotate-180' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>

                    {/* Animated Answer Section */}
                    <div
                      className="transition-all duration-400 ease-in-out"
                      style={{
                        maxHeight: isActive ? '150px' : '0',
                        opacity: isActive ? 1 : 0
                      }}
                    >
                      <div className="p-4 md:p-5 pt-0 text-[13px] text-[var(--color-text-muted)] leading-relaxed border-t border-[var(--color-border)]/30 mt-1">
                        {topic.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sleek Status Widget */}
            <div className="mt-4 p-5 rounded-xl bg-[var(--color-surface)]/40 backdrop-blur-xl border border-[var(--color-border)]/50 flex items-center gap-4">
              <div className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </div>
              <div>
                <p className="text-sm font-bold text-[var(--color-text-primary)]">All systems operational</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Average support wait time: ~2 hrs</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ContactInfoCard({ item }) {
  return (
    <Card className="bg-[var(--color-surface)]/40 backdrop-blur-2xl border border-[var(--color-border)]/40 shadow-lg shadow-black/5 transition-all duration-400 hover:-translate-y-1 hover:shadow-xl group overflow-visible">
      <CardBody className="p-6 md:p-8 flex flex-col items-start relative z-10">
        {/* Glow effect behind icon */}
        <div
          className="absolute top-8 left-8 w-12 h-12 rounded-full blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
          style={{ background: item.color }}
        />

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:scale-110 relative z-10"
          style={{
            background: item.bg,
            border: `1px solid ${item.border}`,
            color: item.color,
          }}
        >
          {item.icon}
        </div>

        <p className="text-[10px] font-extrabold tracking-widest uppercase text-[var(--color-text-muted)] mb-2">
          {item.label}
        </p>
        <p className="text-base md:text-lg font-bold text-[var(--color-text-primary)] mb-1">
          {item.value}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] font-medium">
          {item.sub}
        </p>
      </CardBody>
    </Card>
  );
}