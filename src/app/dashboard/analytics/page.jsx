"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "@/lib/AuthContext";
import { getOwnerPets, getUserRequests } from "@/lib/api";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import Image from "next/image";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const [petsData, requestsData] = await Promise.all([
        getOwnerPets(user.email),
        getUserRequests(user.email),
      ]);
      setPets(petsData);
      setRequests(requestsData);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const displayPets = useMemo(() => pets.slice(0, 8), [pets]);

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1">
          Analytics
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          Overview of your listings and adoption activity
        </p>
      </div>

      {/* Metrics Grid */}
      {isLoading ? (
        <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)]">
              <CardBody className="p-6">
                <Skeleton className="h-3.5 w-1/2 mb-4 rounded" />
                <Skeleton className="h-9 w-2/5 rounded" />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-4 mb-8">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>

          {/* Performance Table */}
          {pets.length > 0 && (
            <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
              <div className="px-6 py-4 border-b border-[var(--color-border)]">
                <h2 className="text-[15px] font-bold text-[var(--color-text-primary)]">
                  Performance by Listing
                </h2>
              </div>
              <div>
                {displayPets.map((pet, index) => (
                  <PetPerformanceRow
                    key={pet._id}
                    pet={pet}
                    isLast={index === displayPets.length - 1}
                  />
                ))}
              </div>
            </Card>
          )}
        </>
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
        className="p-6 transition-all duration-200"
        onMouseEnter={(e) => {
          e.currentTarget.parentElement.style.borderColor = `${metric.color}40`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.parentElement.style.borderColor = "var(--color-border)";
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
            {metric.label}
          </p>
          <div
            className="w-8 h-8 rounded-sm flex items-center justify-center"
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
          className="text-4xl font-extrabold tracking-tighter leading-none"
          style={{ color: metric.color }}
        >
          {metric.value}
        </p>
      </CardBody>
    </Card>
  );
}

function PetPerformanceRow({ pet, isLast }) {
  const getStatusConfig = useCallback((status) => {
    switch (status) {
      case "adopted":
        return {
          bg: "var(--color-surface-3)",
          color: "var(--color-text-muted)",
        };
      case "available":
        return {
          bg: "rgba(217,249,157,0.12)",
          color: "var(--color-lime)",
        };
      default:
        return {
          bg: "rgba(168,85,247,0.12)",
          color: "var(--color-purple)",
        };
    }
  }, []);

  const statusConfig = useMemo(() => getStatusConfig(pet.status || "available"), [pet.status, getStatusConfig]);

  return (
    <div
      className={`flex items-center gap-4 px-6 py-4 ${
        !isLast ? "border-b border-[var(--color-border)]" : ""
      }`}
    >
      {/* Pet Image */}
      <div className="w-10 h-10 rounded-sm bg-[var(--color-surface-2)] border border-[var(--color-border)] overflow-hidden flex-shrink-0">
        {pet.imageURL ? (
          <Image
            src={pet.imageURL}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-lg">
            🐾
          </div>
        )}
      </div>

      {/* Pet Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
          {pet.name}
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          {pet.species}{pet.breed ? ` • ${pet.breed}` : ""}
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-8 flex-shrink-0">
        <div className="text-right">
          <p className="text-[11px] text-[var(--color-text-muted)] mb-0.5 tracking-wider uppercase">
            Views
          </p>
          <p className="text-[15px] font-bold text-[var(--color-text-primary)]">
            {(pet.views || 0).toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-[var(--color-text-muted)] mb-0.5 tracking-wider uppercase">
            Status
          </p>
          <Chip
            size="sm"
            className="text-[11px] font-bold capitalize"
            style={{
              background: statusConfig.bg,
              color: statusConfig.color,
            }}
          >
            {pet.status || "available"}
          </Chip>
        </div>
      </div>
    </div>
  );
}