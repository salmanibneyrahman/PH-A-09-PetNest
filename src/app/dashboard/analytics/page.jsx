"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import { getOwnerPets, getUserRequests } from "@/lib/api";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import Link from "next/link";

export default function AnalyticsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.email || hasFetched) return;

    setIsLoading(true);
    try {
      const [petsData, requestsData] = await Promise.all([
        getOwnerPets(user.email),
        getUserRequests(user.email),
      ]);
      setPets(petsData);
      setRequests(requestsData);
      setHasFetched(true);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && user?.email) {
      fetchData();
    }
  }, [authLoading, user?.email, fetchData]);

  const metrics = useMemo(() => {
    const totalViews = pets.reduce((sum, p) => sum + (p.views || 0), 0);
    const totalListings = pets.length;
    const adoptedCount = pets.filter((p) => p.status === "adopted").length;
    const availableCount = pets.filter((p) => p.status === "available").length;
    const adoptionRate =
      totalListings > 0 ? Math.round((adoptedCount / totalListings) * 100) : 0;
    const myRequestsPending = requests.filter((r) => r.status === "pending").length;
    const myRequestsApproved = requests.filter((r) => r.status === "approved").length;

    return [
      {
        label: "Total Views",
        value: totalViews.toLocaleString(),
        color: "var(--color-lime)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ),
      },
      {
        label: "Active Listings",
        value: availableCount,
        color: "var(--color-lime)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        ),
      },
      {
        label: "Adoption Rate",
        value: `${adoptionRate}%`,
        color: "var(--color-purple)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
      },
      {
        label: "My Pending Requests",
        value: myRequestsPending,
        color: "var(--color-warning)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        ),
      },
      {
        label: "Approved Requests",
        value: myRequestsApproved,
        color: "var(--color-success)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        ),
      },
      {
        label: "Successful Adoptions",
        value: adoptedCount,
        color: "var(--color-coral)",
        icon: (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        ),
      },
    ];
  }, [pets, requests]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Spinner size="lg" color="success" />
        <p className="text-sm text-[var(--color-text-muted)] mt-4">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1">
          Analytics
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Overview of your listings and adoption activity
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Listings Performance Table */}
      {pets.length > 0 ? (
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-sm md:text-[15px] font-bold text-[var(--color-text-primary)]">
              Listings Performance
            </h2>
            <div className="text-xs text-[var(--color-text-muted)] font-medium">
              {pets.length} Total Listing{pets.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Table Header - Hidden on mobile */}
          <div className="px-4 md:px-6 py-3 bg-[var(--color-surface-2)] border-b border-[var(--color-border)] hidden md:grid md:grid-cols-[1fr_100px_90px_110px_90px] gap-4">
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
              Pet
            </div>
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
              Views
            </div>
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
              Status
            </div>
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
              Date Listed
            </div>
            <div className="text-[10px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] text-right">
              Actions
            </div>
          </div>

          {/* Table Body */}
          <div>
            {pets.map((pet, index) => (
              <PetPerformanceRow
                key={pet._id}
                pet={pet}
                isLast={index === pets.length - 1}
              />
            ))}
          </div>
        </Card>
      ) : (
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
          <CardBody className="p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center text-3xl mx-auto mb-4">
              🐾
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              No listings yet
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              Create your first pet listing to see analytics here
            </p>
            <Link
              href="/dashboard/add-pet"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[var(--color-lime)] text-black text-sm font-bold rounded-sm hover:bg-[var(--color-lime-dark)] transition-colors no-underline"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="8" y1="12" x2="16" y2="12" />
              </svg>
              Add Pet
            </Link>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function MetricCard({ metric }) {
  return (
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden transition-all duration-200 hover:-translate-y-px group">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${metric.color}40, transparent)`,
        }}
      />
      <CardBody
        className="p-5 md:p-6 transition-all duration-200"
        onMouseEnter={(e) => {
          e.currentTarget.parentElement.style.borderColor = `${metric.color}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.parentElement.style.borderColor = "var(--color-border)";
        }}
      >
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
            {metric.label}
          </p>
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{
              background: `${metric.color}15`,
              border: `1px solid ${metric.color}25`,
              color: metric.color,
            }}
          >
            {metric.icon}
          </div>
        </div>
        <p
          className="text-3xl md:text-4xl font-extrabold tracking-tighter leading-none"
          style={{ color: metric.color }}
        >
          {metric.value}
        </p>
      </CardBody>
    </Card>
  );
}

function PetPerformanceRow({ pet, isLast }) {
  const [imgError, setImgError] = useState(false);

  const getStatusConfig = useCallback((status) => {
    switch (status) {
      case "adopted":
        return {
          bg: "rgba(100,100,100,0.12)",
          color: "var(--color-text-muted)",
          label: "Adopted",
        };
      case "available":
        return {
          bg: "rgba(217,249,157,0.12)",
          color: "var(--color-lime)",
          label: "Available",
        };
      default:
        return {
          bg: "rgba(168,85,247,0.12)",
          color: "var(--color-purple)",
          label: "Pending",
        };
    }
  }, []);

  const statusConfig = useMemo(
    () => getStatusConfig(pet.status || "available"),
    [pet.status, getStatusConfig]
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div
      className={`px-4 md:px-6 py-4 ${!isLast ? "border-b border-[var(--color-border)]" : ""
        } hover:bg-[var(--color-surface-2)] transition-colors`}
    >
      <div className="flex flex-col md:grid md:grid-cols-[1fr_100px_90px_110px_90px] gap-4 items-start md:items-center">
        <div className="flex items-center gap-3 min-w-0 w-full md:w-auto">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] overflow-hidden flex-shrink-0 relative">
            {!imgError && pet.imageURL ? (
              <Image
                src={pet.imageURL}
                alt={pet.name}
                fill
                sizes="(max-width: 768px) 56px, 48px"
                className="object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl md:text-2xl">
                {pet.species === "Dog" ? "🐶" : pet.species === "Cat" ? "🐱" : pet.species === "Bird" ? "🦜" : pet.species === "Rabbit" ? "🐰" : "🐾"}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
              {pet.name}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] truncate">
              {pet.species} {pet.breed && ` • ${pet.breed}`}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between w-full md:contents border-t border-[var(--color-border)]/30 pt-3 md:pt-0 mt-2 md:mt-0 text-xs md:text-sm">
          <div>
            <span className="text-[var(--color-text-muted)] md:hidden">Views: </span>
            <span className="font-bold text-[var(--color-text-primary)] md:text-base">
              {(pet.views || 0).toLocaleString()}
            </span>
          </div>
          <div>
            <Chip
              size="sm"
              className="px-2 text-[9px] md:text-[10px] font-bold uppercase tracking-wider"
              style={{
                background: statusConfig.bg,
                color: statusConfig.color,
                border: `1px solid ${statusConfig.color}30`,
              }}
            >
              {statusConfig.label}
            </Chip>
          </div>

          <div className="text-[var(--color-text-muted)] md:text-[var(--color-text-secondary)] md:text-xs">
            {formatDate(pet.createdAt)}
          </div>

          <div className="flex md:justify-end">
            <Link
              href={`/pets/${pet._id}`}
              className="font-semibold md:font-semibold text-[var(--color-lime)] hover:text-[var(--color-lime-dark)] transition-colors no-underline"
            >
              View <span className="hidden md:inline">Details →</span>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );

}