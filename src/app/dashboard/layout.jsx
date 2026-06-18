"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { AuthProvider } from "@/lib/AuthContext";
import { toast } from "@/lib/toast";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import Navbar from "@/components/Navbar";

function DashboardSidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const navSections = [
    {
      title: null,
      items: [
        {
          label: "My Requests",
          href: "/dashboard/my-requests",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          ),
        },
        {
          label: "Add Pet",
          href: "/dashboard/add-pet",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="16" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          ),
        },
        {
          label: "My Listings",
          href: "/dashboard/my-listings",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          ),
        },
      ],
    },
    {
      title: "Management",
      items: [
        {
          label: "Analytics",
          href: "/dashboard/analytics",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          ),
        },
        {
          label: "Settings",
          href: "/dashboard/settings",
          icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          ),
        },
      ],
    },
  ];

  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      {/* Mobile Overlay*/}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 top-[64px] bg-black/60 z-[39] lg:hidden"
        />
      )}

      {/*Sidebar Layout*/}
      <aside
        className={`w-[260px] h-[calc(100vh-64px)] bg-[var(--color-surface)] border-r border-[var(--color-border)] fixed top-[64px] left-0 flex flex-col z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 pb-5 border-b border-[var(--color-border)]">
          {/* User Info Card & Avatar*/}
          {user && (
            <Card className="bg-[var(--color-surface-2)] border border-[var(--color-border)] p-3">
              <div className="flex items-center gap-2.5">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={34}
                    height={34}
                    className="w-[34px] h-[34px] rounded-full object-cover border border-[var(--color-border)] flex-shrink-0"
                  />
                ) : (
                  <div className="w-[34px] h-[34px] rounded-full bg-[var(--color-lime)] text-black font-bold text-[13px] flex items-center justify-center flex-shrink-0">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-[var(--color-text-primary)] truncate">{user.name || "User"}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] truncate">{user.email}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {navSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-2">
              {section.title && (
                <p className="text-[10px] font-bold tracking-[0.12em] uppercase text-[var(--color-text-muted)] px-5 py-2 pb-1.5">{section.title}</p>
              )}
              {section.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-5 py-2.5 mx-3 my-0.5 text-sm rounded-sm no-underline transition-all duration-200 relative ${active ? "font-semibold text-[var(--color-text-primary)] bg-[rgba(217,249,157,0.08)] border border-[rgba(217,249,157,0.15)]" : "font-medium text-[var(--color-text-secondary)] border border-transparent hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]"
                      }`}
                  >
                    <span className={`flex items-center transition-colors duration-200 ${active ? "text-[var(--color-lime)]" : "text-[var(--color-text-muted)]"}`}>{item.icon}</span>
                    {item.label}
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-lime)] flex-shrink-0" />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 pt-4 border-t border-[var(--color-border)]">
          <Link href="/" className="flex items-center gap-3 px-5 py-2.5 text-[13px] font-medium text-[var(--color-text-secondary)] rounded-sm no-underline transition-all duration-200 mb-1 hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Back to Home
          </Link>
          <Button onPress={handleSignOut} variant="light" className="w-full justify-start gap-3 px-5 text-[13px] font-medium text-[var(--color-error)] hover:bg-danger/8" startContent={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>}>
            Sign Out
          </Button>
        </div>
      </aside>
    </>
  );
}

function DashboardContent({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?callbackUrl=${pathname}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" color="success" />
          <p className="text-sm text-[var(--color-text-muted)]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    // FIXED: Added padding-top to prevent hiding under the global navbar
    <div className="flex min-h-screen bg-[var(--color-bg)] pt-[64px]">
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* FIXED: Content wrapper correctly pushes to the right on desktop */}
      <div className="ml-0 lg:ml-[260px] flex-1 min-h-[calc(100vh-64px)] flex flex-col">
        {/* FIXED: Mobile Header - hidden on desktop, flex on mobile */}
        <div className="h-14 bg-[var(--color-surface)] border-b border-[var(--color-border)] flex lg:hidden items-center px-5 gap-4 sticky top-[64px] z-30">
          <Button isIconOnly variant="bordered" size="sm" onPress={() => setSidebarOpen(true)} className="border-[var(--color-border)] text-[var(--color-text-primary)]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[var(--color-lime)] rounded flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            </div>
            <span className="text-[15px] font-bold text-white">PetNest</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <AuthProvider>
      <div className="dashboard-navbar-override">
        <Navbar />
      </div>

      <style jsx global>{`
        .dashboard-navbar-override header > div {
          max-width: 100% !important;
          width: 100% !important;
        }

        @media (min-width: 1024px) {
          .dashboard-navbar-override header > div {
            padding-left: 24px !important;  
            padding-right: 40px !important; 
          }
        }
      `}</style>

      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
