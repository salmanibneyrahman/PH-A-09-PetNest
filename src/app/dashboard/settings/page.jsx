"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/lib/toast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    photoURL: user?.image || "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success("Settings saved successfully");
    setIsSaving(false);
  }, []);

  const handleDeleteAccount = useCallback(() => {
    toast.error("Please contact support@petnest.com to delete your account.");
  }, []);

  return (
<div className="w-full flex justify-center py-4 px-4 sm:px-6"> 
  {/* 👈 w-full এবং flex justify-center দিয়ে পুরো সেটিংস এরিয়াকে স্ক্রিনের মাঝখানে আনা হলো */}
  <div className="animate-[fadeIn_0.3s_ease] w-full max-w-[720px] mx-auto">
    {/* 👈 max-w-[720px] এর সাথে mx-auto থাকায় এটি সাইডবারের পাশের খালি জায়গার একদম সেন্টারে লক থাকবে */}

    {/* Header */}
    <div className="mb-8">
      <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1">
        Settings
      </h1>
      <p className="text-sm text-[var(--color-text-secondary)]">
        Manage your account preferences
      </p>
    </div>

    {/* Account Information */}
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] mb-8">
      {/* 👈 mb-6 থেকে বাড়িয়ে mb-8 করা হলো যাতে নিচের কার্ড থেকে গ্যাপ বাড়ে */}
      <CardBody className="p-6">
        <div className="pb-4 mb-6 border-b border-[var(--color-border)] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[rgba(217,249,157,0.12)] border border-[rgba(217,249,157,0.25)] flex items-center justify-center text-[var(--color-lime)] text-sm font-bold flex-shrink-0">
            1
          </div>
          <h2 className="text-[15px] font-bold text-[var(--color-text-primary)]">
            Account Information
          </h2>
        </div>

        {/* space-y-7 দিয়ে ইনপুট ফিল্ডগুলোর ইন্টারনাল ভার্টিক্যাল গ্যাপ আরও বাড়ানো হলো */}
        <div className="space-y-7">
          {/* DISPLAY NAME BLOCK */}
          <div>
            <label
              htmlFor="displayName"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2.5" // mb-2.5 দিয়ে লেবেল থেকে বক্সের দূরত্ব একটু বাড়ানো হলো
            >
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] text-sm font-sans transition-all outline-none focus:border-[var(--color-lime)] focus:shadow-[0_0_0_3px_rgba(217,249,157,0.08)]"
            />
          </div>

          {/* EMAIL ADDRESS BLOCK */}
          <div className="pt-6">
            {/* pt-2 দিয়ে ইনপুটগুলোর মাঝে অতিরিক্ত ব্রেদিং স্পেস তৈরি করা হলো */}
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2.5"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] text-sm font-sans opacity-50 cursor-not-allowed"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          {/* PROFILE PHOTO URL BLOCK */}
          <div className="pt-6">
            <label
              htmlFor="photoURL"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-2.5"
            >
              Profile Photo URL
            </label>
            <input
              id="photoURL"
              type="url"
              value={formData.photoURL}
              onChange={(e) => handleChange("photoURL", e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-3 bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[var(--color-text-primary)] text-sm font-sans transition-all outline-none focus:border-[var(--color-lime)] focus:shadow-[0_0_0_3px_rgba(217,249,157,0.08)]"
            />
            <p className="text-xs text-[var(--color-text-muted)] mt-2">
              Enter a valid image URL to update your profile picture
            </p>
          </div>
        </div>
      </CardBody>
    </Card>

    {/* Danger Zone */}
    <Card className="bg-[rgba(239,68,68,0.04)] border border-[rgba(239,68,68,0.15)] mb-8">
      {/* 👈 mb-7 থেকে বাড়িয়ে mb-8 করা হলো যাতে নিচের সেভ বাটন থেকে দূরত্ব সমান থাকে */}
      <CardBody className="p-6">
        <div className="pb-4 mb-4 border-b border-[rgba(239,68,68,0.15)] flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.25)] flex items-center justify-center text-[var(--color-error)] flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h2 className="text-[15px] font-bold text-[var(--color-error)]">
            Danger Zone
          </h2>
        </div>

        <p className="text-[13px] text-[var(--color-text-secondary)] mb-5 leading-relaxed">
          Deleting your account is permanent. All your listings, requests, and
          account data will be permanently removed and cannot be recovered.
        </p>

        <Button
          variant="bordered"
          onPress={handleDeleteAccount}
          className="border-[rgba(239,68,68,0.3)] text-[var(--color-error)] text-[13px] font-semibold hover:bg-[rgba(239,68,68,0.08)] transition-colors"
          startContent={
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          }
        >
          Delete Account
        </Button>
      </CardBody>
    </Card>

    {/* Save Button */}
    <div className="flex justify-end pb-6">
      <Button
        onPress={handleSave}
        isDisabled={isSaving}
        isLoading={isSaving}
        className="bg-[var(--color-lime)] text-black font-bold text-[13px] tracking-wider uppercase px-8 hover:bg-[var(--color-lime-dark)] transition-colors"
        startContent={
          !isSaving && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
          )
        }
      >
        {isSaving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  </div>
</div>

  );
}