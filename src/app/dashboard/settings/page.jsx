"use client";

import { useState, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/lib/toast";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Switch } from "@heroui/switch";

const NOTIFICATION_OPTIONS = [
  {
    key: "newRequests",
    label: "New Adoption Requests",
    description: "Get notified when someone submits a request for your listed pets",
  },
  {
    key: "requestUpdates",
    label: "Request Status Updates",
    description: "Receive updates when your adoption requests are approved or rejected",
  },
  {
    key: "weeklyDigest",
    label: "Weekly Digest",
    description: "A weekly summary of new pets matching your preferences",
  },
  {
    key: "marketingEmails",
    label: "Marketing Emails",
    description: "Promotional content, tips, and platform announcements",
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [notifSettings, setNotifSettings] = useState({
    newRequests: true,
    requestUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  const handleNotifChange = useCallback((key) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

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
    <div className="animate-[fadeIn_0.3s_ease] max-w-[640px]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1">
          Settings
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Manage your account preferences and notifications
        </p>
      </div>

      {/* Account Information */}
      <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] mb-5">
        <CardBody className="p-6">
          <h2 className="text-[15px] font-bold text-[var(--color-text-primary)] mb-5 pb-4 border-b border-[var(--color-border)]">
            Account Information
          </h2>
          <div className="flex flex-col gap-4">
            <Input
              type="text"
              label="Display Name"
              placeholder="Your name"
              defaultValue={user?.name || ""}
              classNames={{
                label: "text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider",
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)]",
              }}
            />
            <div>
              <Input
                type="email"
                label="Email Address"
                value={user?.email || ""}
                isReadOnly
                classNames={{
                  label: "text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider",
                  inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] opacity-50 cursor-not-allowed",
                }}
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Email cannot be changed. Contact support if needed.
              </p>
            </div>
            <Input
              type="url"
              label="Photo URL"
              placeholder="https://example.com/photo.jpg"
              defaultValue={user?.image || ""}
              classNames={{
                label: "text-[var(--color-text-secondary)] text-xs font-semibold uppercase tracking-wider",
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)]",
              }}
            />
          </div>
        </CardBody>
      </Card>

      {/* Notification Preferences */}
      <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] mb-5">
        <CardBody className="p-6">
          <h2 className="text-[15px] font-bold text-[var(--color-text-primary)] mb-1">
            Notification Preferences
          </h2>
          <p className="text-[13px] text-[var(--color-text-muted)] mb-2">
            Choose what updates you receive from PetNest
          </p>

          {NOTIFICATION_OPTIONS.map((option, index) => (
            <NotificationToggle
              key={option.key}
              option={option}
              checked={notifSettings[option.key]}
              onChange={() => handleNotifChange(option.key)}
              isLast={index === NOTIFICATION_OPTIONS.length - 1}
            />
          ))}
        </CardBody>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-danger/[0.04] border border-danger/15 mb-7">
        <CardBody className="p-6">
          <h2 className="text-[15px] font-bold text-[var(--color-error)] mb-2">
            Danger Zone
          </h2>
          <p className="text-[13px] text-[var(--color-text-secondary)] mb-4 leading-relaxed">
            Deleting your account is permanent. All your listings, requests, and
            account data will be permanently removed.
          </p>
          <Button
            variant="bordered"
            onPress={handleDeleteAccount}
            className="border-danger/30 text-[var(--color-error)] text-[13px] font-semibold hover:bg-danger/8"
          >
            Delete Account
          </Button>
        </CardBody>
      </Card>

      {/* Save Button */}
      <Button
        onPress={handleSave}
        isDisabled={isSaving}
        isLoading={isSaving}
        className="bg-[var(--color-lime)] text-black font-bold text-[13px] tracking-wider uppercase px-7 hover:bg-[var(--color-lime-dark)]"
      >
        {isSaving ? "Saving..." : "Save Settings"}
      </Button>
    </div>
  );
}

function NotificationToggle({ option, checked, onChange, isLast }) {
  return (
    <div
      className={`flex items-start justify-between gap-6 py-4 ${
        !isLast ? "border-b border-[var(--color-border)]" : ""
      }`}
    >
      <div>
        <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
          {option.label}
        </p>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          {option.description}
        </p>
      </div>
      <Switch
        isSelected={checked}
        onValueChange={onChange}
        classNames={{
          wrapper: "group-data-[selected=true]:bg-[var(--color-lime)]",
          thumb: "group-data-[selected=true]:bg-black bg-[var(--color-text-muted)]",
        }}
        className="flex-shrink-0 mt-0.5"
      />
    </div>
  );
}