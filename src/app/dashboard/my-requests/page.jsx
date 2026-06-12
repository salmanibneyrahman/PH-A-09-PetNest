"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { getUserRequests, cancelRequest, getPetById } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";

export default function MyRequestsPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmCancelId, setConfirmCancelId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [petImages, setPetImages] = useState({});
  const [imageErrors, setImageErrors] = useState({});

  const fetchRequests = useCallback(async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const data = await getUserRequests(user.email);
      setRequests(data);

      // Fetch pet images for each request
      const images = {};
      for (const request of data) {
        try {
          const pet = await getPetById(request.petId);
          if (pet?.imageURL) {
            images[request.petId] = pet.imageURL;
          }
        } catch (err) {
          console.error(`Failed to fetch pet ${request.petId}:`, err);
        }
      }
      setPetImages(images);
    } catch (error) {
      toast.error("Failed to load your requests");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleCancel = async (requestId) => {
    setCancellingId(requestId);
    try {
      await cancelRequest(requestId);
      toast.success("Request cancelled successfully");
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
      setConfirmCancelId(null);
    } catch (error) {
      toast.error(error.message || "Failed to cancel request");
    } finally {
      setCancellingId(null);
    }
  };

  const filteredRequests =
    filterStatus === "all"
      ? requests
      : requests.filter((r) => r.status === filterStatus);

  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: {
        color: "warning",
        className: "bg-warning/12 text-[var(--color-warning)] border-warning/25 px-2.5",
      },
      approved: {
        color: "success",
        className: "bg-success/12 text-[var(--color-success)] border-success/25 px-2.5",
      },
      rejected: {
        color: "danger",
        className: "bg-danger/12 text-[var(--color-error)] border-danger/25 px-2.5",
      },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Chip
        variant="bordered"
        size="sm"
        className={`${config.className} font-bold text-[11px] uppercase tracking-wider`}
        startContent={
          <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
        }
      >
        {status}
      </Chip>
    );
  };

  const handleImageError = (petId) => {
    setImageErrors(prev => ({ ...prev, [petId]: true }));
  };

  const getPetEmoji = (petName) => {
    const name = petName?.toLowerCase() || "";
    if (name.includes("dog") || name.includes("pup")) return "🐕";
    if (name.includes("cat") || name.includes("kitten")) return "🐈";
    if (name.includes("bird") || name.includes("parrot")) return "🦜";
    if (name.includes("rabbit") || name.includes("bunny")) return "🐇";
    if (name.includes("fish")) return "🐠";
    return "🐾";
  };

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1">
            My Requests
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Track the status of your adoption requests
          </p>
        </div>
        <Link href="/all-pets">
          <Button
            className="bg-[var(--color-lime)] text-black font-bold text-xs px-4.5 py-2.5"
            startContent={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
          >
            Browse Pets
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { key: "all", label: "Total", color: "var(--color-lime)" },
          { key: "pending", label: "Pending", color: "var(--color-warning)" },
          { key: "approved", label: "Approved", color: "var(--color-success)" },
          { key: "rejected", label: "Rejected", color: "var(--color-error)" },
        ].map((stat) => (
          <button
            key={stat.key}
            onClick={() => setFilterStatus(stat.key)}
            className={`p-5 bg-[var(--color-surface)] rounded-lg text-left cursor-pointer transition-all duration-200 ${
              filterStatus === stat.key
                ? `shadow-[0_0_20px_${stat.color}10]`
                : ""
            }`}
            style={{
              border: `1px solid ${filterStatus === stat.key ? stat.color + "40" : "var(--color-border)"}`,
            }}
            onMouseEnter={(e) => {
              if (filterStatus !== stat.key) {
                e.currentTarget.style.borderColor = stat.color + "30";
              }
            }}
            onMouseLeave={(e) => {
              if (filterStatus !== stat.key) {
                e.currentTarget.style.borderColor = "var(--color-border)";
              }
            }}
          >
            <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)] mb-2">
              {stat.label}
            </p>
            <p
              className="text-[28px] font-extrabold tracking-tighter leading-none"
              style={{ color: stat.color }}
            >
              {statusCounts[stat.key]}
            </p>
          </button>
        ))}
      </div>

      {/* Requests List */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)]">
              <CardBody className="p-6 flex flex-row gap-4 items-center">
                <div className="w-14 h-14 rounded-lg bg-[var(--color-surface-2)] animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <div className="h-4.5 w-2/5 bg-[var(--color-surface-2)] rounded mb-2 animate-pulse" />
                  <div className="h-3.5 w-3/5 bg-[var(--color-surface-2)] rounded animate-pulse" />
                </div>
                <div className="w-20 h-7 bg-[var(--color-surface-2)] rounded-full animate-pulse" />
              </CardBody>
            </Card>
          ))}
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
          <CardBody className="p-20 text-center">
            <div className="w-18 h-18 rounded-full bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center mx-auto mb-5 text-3xl">
              📋
            </div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              {filterStatus === "all"
                ? "No adoption requests yet"
                : `No ${filterStatus} requests`}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed">
              {filterStatus === "all"
                ? "Start browsing pets and submit adoption requests to see them here."
                : "Try switching to a different status filter."}
            </p>
            <Link href="/all-pets">
              <Button className="bg-[var(--color-lime)] text-black font-bold">
                Browse Available Pets
              </Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
            <p className="text-[13px] font-semibold text-[var(--color-text-secondary)]">
              Showing{" "}
              <span className="text-[var(--color-text-primary)]">
                {filteredRequests.length}
              </span>{" "}
              {filterStatus === "all" ? "total" : filterStatus} request
              {filteredRequests.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Table Body */}
          <div>
            {filteredRequests.map((request, index) => (
              <div
                key={request._id}
                className={`px-6 py-5 flex items-center gap-4 flex-wrap transition-colors duration-200 hover:bg-white/[0.02] ${
                  index < filteredRequests.length - 1
                    ? "border-b border-[var(--color-border)]"
                    : ""
                }`}
              >
                {/* Pet Image */}
                <div className="w-[52px] h-[52px] rounded-lg bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {petImages[request.petId] && !imageErrors[request.petId] ? (
                    <Image
                      src={petImages[request.petId]}
                      alt={request.petName}
                      width={52}
                      height={52}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(request.petId)}
                    />
                  ) : (
                    <span className="text-2xl">{getPetEmoji(request.petName)}</span>
                  )}
                </div>

                {/* Request Info */}
                <div className="flex-1 min-w-[160px]">
                  <h4 className="text-[15px] font-bold text-[var(--color-text-primary)] mb-1">
                    {request.petName}
                  </h4>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      Requested {formatDate(request.requestDate)}
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="3" width="15" height="13" />
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                        <circle cx="5.5" cy="18.5" r="2.5" />
                        <circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                      Pickup: {formatDate(request.pickupDate)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 flex-shrink-0 flex-wrap">
                  {getStatusChip(request.status)}

                  <Link href={`/pets/${request.petId}`}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="bordered"
                      className="w-[34px] h-[34px] bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[rgba(217,249,157,0.3)] hover:text-[var(--color-lime)]"
                      title="View Pet"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </Button>
                  </Link>

                  {request.status === "pending" && (
                    <>
                      {confirmCancelId === request._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[var(--color-text-muted)] whitespace-nowrap">
                            Cancel request?
                          </span>
                          <Button
                            size="sm"
                            onPress={() => handleCancel(request._id)}
                            isDisabled={cancellingId === request._id}
                            isLoading={cancellingId === request._id}
                            className="px-3 bg-danger/12 border border-danger/25 text-[var(--color-error)] text-xs font-semibold whitespace-nowrap"
                          >
                            Yes
                          </Button>
                          <Button
                            size="sm"
                            variant="bordered"
                            onPress={() => setConfirmCancelId(null)}
                            className="px-3 bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-secondary)] text-xs font-semibold"
                          >
                            No
                          </Button>
                        </div>
                      ) : (
                        <Button
                          isIconOnly
                          size="sm"
                          onPress={() => setConfirmCancelId(request._id)}
                          className="w-[34px] h-[34px] bg-danger/8 border border-danger/20 text-[var(--color-error)] hover:bg-danger/15"
                          title="Cancel Request"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}