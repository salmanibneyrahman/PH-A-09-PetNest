"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "@/lib/toast";
import Image from "next/image";

export default function Navbar() {
    const { user, isAuthenticated, isLoading, signOut } = useAuth();
    const pathname = usePathname();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest("#mobile-toggle-btn")
            ) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
    }, [pathname]);

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("Signed out successfully");
            router.push("/");
        } catch (error) {
            toast.error("Failed to sign out");
        }
    };

    const isActive = (path) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    const navLinks = [
        { label: "Home", href: "/" },
        { label: "All Pets", href: "/all-pets" },
        { label: "Our Program", href: "/program" },
        { label: "Contact", href: "/contact" },
    ];

    const privateNavLinks = [
        { label: "My Requests", href: "/dashboard/my-requests" },
    ];

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                background: isScrolled
                    ? "rgba(0, 0, 0, 0.92)"
                    : "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: isScrolled
                    ? "1px solid rgba(255,255,255,0.08)"
                    : "1px solid transparent",
                transition: "all 0.3s ease",
            }}
        >
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "0 24px",
                    height: "64px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "24px",
                }}
            >
                <Link
                    href="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        textDecoration: "none",
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            background: "var(--color-lime)",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#000"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </div>
                    <div>
                        <span
                            style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "#ffffff",
                                letterSpacing: "-0.02em",
                                display: "block",
                                lineHeight: 1.1,
                            }}
                        >
                            PetNest
                        </span>
                    </div>
                </Link>

                <nav
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "32px",
                    }}
                    className="desktop-nav"
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`nav-link ${isActive(link.href) ? "active" : ""}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Link
                            href="/dashboard/my-requests"
                            className={`nav-link ${isActive("/dashboard/my-requests") ? "active" : ""}`}
                        >
                            My Requests
                        </Link>
                    )}
                </nav>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flexShrink: 0,
                    }}
                >
                    {isAuthenticated ? (
                        <div style={{ position: "relative" }} ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    background: "var(--color-surface-2)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-full)",
                                    padding: "4px 12px 4px 4px",
                                    cursor: "pointer",
                                    transition: "all 0.2s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "rgba(217, 249, 157, 0.3)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "var(--color-border)";
                                }}
                            >
                                {user?.image ? (
                                    <Image
                                        src={user.image}
                                        alt={user.name || "User"}
                                        width={28}
                                        height={28}
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "50%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: "28px",
                                            height: "28px",
                                            borderRadius: "50%",
                                            background: "var(--color-lime)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: "#000",
                                        }}
                                    >
                                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                                <span
                                    style={{
                                        fontSize: "13px",
                                        fontWeight: "500",
                                        color: "var(--color-text-primary)",
                                        maxWidth: "100px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {user?.name?.split(" ")[0] || "User"}
                                </span>
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-text-secondary)"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{
                                        transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                                        transition: "transform 0.2s ease",
                                    }}
                                >
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>

                            {isDropdownOpen && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "calc(100% + 8px)",
                                        right: "0",
                                        background: "var(--color-surface)",
                                        border: "1px solid var(--color-border)",
                                        borderRadius: "var(--radius-md)",
                                        minWidth: "200px",
                                        overflow: "hidden",
                                        boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
                                        animation: "fadeIn 0.15s ease",
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "16px",
                                            borderBottom: "1px solid var(--color-border)",
                                        }}
                                    >
                                        <p
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                color: "var(--color-text-primary)",
                                                marginBottom: "2px",
                                            }}
                                        >
                                            {user?.name || "User"}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: "12px",
                                                color: "var(--color-text-muted)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {user?.email}
                                        </p>
                                    </div>

                                    <div style={{ padding: "8px" }}>
                                        <DropdownItem
                                            href="/dashboard"
                                            icon={
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="3" y="3" width="7" height="7" />
                                                    <rect x="14" y="3" width="7" height="7" />
                                                    <rect x="14" y="14" width="7" height="7" />
                                                    <rect x="3" y="14" width="7" height="7" />
                                                </svg>
                                            }
                                            label="Dashboard"
                                        />
                                        <DropdownItem
                                            href="/dashboard/my-listings"
                                            icon={
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                    <line x1="16" y1="13" x2="8" y2="13" />
                                                    <line x1="16" y1="17" x2="8" y2="17" />
                                                    <polyline points="10 9 9 9 8 9" />
                                                </svg>
                                            }
                                            label="My Listings"
                                        />
                                        <DropdownItem
                                            href="/dashboard/add-pet"
                                            icon={
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="8" x2="12" y2="16" />
                                                    <line x1="8" y1="12" x2="16" y2="12" />
                                                </svg>
                                            }
                                            label="Add Pet"
                                        />
                                        <DropdownItem
                                            href="/dashboard/my-requests"
                                            icon={
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                                </svg>
                                            }
                                            label="My Requests"
                                        />
                                    </div>

                                    <div
                                        style={{
                                            padding: "8px",
                                            borderTop: "1px solid var(--color-border)",
                                        }}
                                    >
                                        <button
                                            onClick={handleSignOut}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "10px",
                                                width: "100%",
                                                padding: "10px 12px",
                                                background: "none",
                                                border: "none",
                                                borderRadius: "var(--radius-sm)",
                                                color: "var(--color-error)",
                                                fontSize: "13px",
                                                fontWeight: "500",
                                                cursor: "pointer",
                                                transition: "background 0.2s ease",
                                                textAlign: "left",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "none";
                                            }}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors duration-200"
                            >
                                Login
                            </Link>

                            <Link href="/all-pets" className="btn-primary" style={{ fontSize: "12px", padding: "8px 16px" }}> ADOPT NOW </Link>
                        </>
                    )}

                    <button
                        id="mobile-toggle-btn" 
                        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                        className="mobile-menu-btn"
                        style={{
                            background: "none",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-sm)",
                            padding: "8px",
                            cursor: "pointer",
                            color: "var(--color-text-primary)",
                            display: "none",
                            position: "relative", 
                            zIndex: 150,         
                        }}
                        aria-label="Toggle mobile menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    style={{
                        background: "var(--color-surface)",
                        borderTop: "1px solid var(--color-border)",
                        padding: "16px 24px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        animation: "fadeIn 0.2s ease",
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                display: "block",
                                padding: "12px 16px",
                                fontSize: "14px",
                                fontWeight: "600",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: isActive(link.href)
                                    ? "var(--color-lime)"
                                    : "var(--color-text-secondary)",
                                borderRadius: "var(--radius-sm)",
                                background: isActive(link.href)
                                    ? "var(--color-lime-glow)"
                                    : "transparent",
                                transition: "all 0.2s ease",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {isAuthenticated && (
                        <Link
                            href="/dashboard/my-requests"
                            style={{
                                display: "block",
                                padding: "12px 16px",
                                fontSize: "14px",
                                fontWeight: "600",
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                                color: isActive("/dashboard/my-requests")
                                    ? "var(--color-lime)"
                                    : "var(--color-text-secondary)",
                                borderRadius: "var(--radius-sm)",
                                background: isActive("/dashboard/my-requests")
                                    ? "var(--color-lime-glow)"
                                    : "transparent",
                            }}
                        >
                            My Requests
                        </Link>
                    )}

                    <div
                        style={{
                            height: "1px",
                            background: "var(--color-border)",
                            margin: "12px 0",
                        }}
                    />

                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard"
                                style={{
                                    display: "block",
                                    padding: "12px 16px",
                                    fontSize: "14px",
                                    fontWeight: "500",
                                    color: "var(--color-text-secondary)",
                                    borderRadius: "var(--radius-sm)",
                                }}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={handleSignOut}
                                style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "12px 16px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "var(--color-error)",
                                    background: "rgba(239,68,68,0.08)",
                                    border: "none",
                                    borderRadius: "var(--radius-sm)",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    marginTop: "4px",
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <Link
                                href="/login"
                                style={{
                                    display: "block",
                                    padding: "12px 16px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    color: "var(--color-text-primary)",
                                    background: "var(--color-surface-2)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "var(--radius-sm)",
                                    textAlign: "center",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.06em",
                                }}
                            >
                                Login
                            </Link>
                            <Link
                                href="/all-pets"
                                className="btn-primary"
                                style={{ textAlign: "center" }}
                            >
                                Adopt Now
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .desktop-only-login {
            display: block !important;
          }
        }
        @media (max-width: 1023px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .desktop-only-login {
            display: none !important;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </header>
    );
}

function DropdownItem({ href, icon, label }) {
    const pathname = usePathname();
    const isActive = pathname === href || pathname.startsWith(href + "/");

    return (
        <Link
            href={href}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px 12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "13px",
                fontWeight: "500",
                color: isActive ? "var(--color-lime)" : "var(--color-text-secondary)",
                background: isActive ? "var(--color-lime-glow)" : "transparent",
                transition: "all 0.2s ease",
                textDecoration: "none",
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.currentTarget.style.color = "var(--color-text-primary)";
                    e.currentTarget.style.background = "var(--color-surface-2)";
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
                    e.currentTarget.style.color = "var(--color-text-secondary)";
                    e.currentTarget.style.background = "transparent";
                }
            }}
        >
            {icon}
            {label}
        </Link>
    );
}