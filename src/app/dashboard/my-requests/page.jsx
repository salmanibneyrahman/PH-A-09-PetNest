"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { getUserRequests, cancelRequest, getPetById } from "@/lib/api";
import { toast } from "@/lib/toast";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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
        className: "bg-warning/20 text-[var(--color-warning)] border-warning/30",
      },
      approved: {
        color: "success",
        className: "bg-success/20 text-[var(--color-success)] border-success/30",
      },
      rejected: {
        color: "danger",
        className: "bg-danger/20 text-[var(--color-error)] border-danger/30",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Chip
        variant="bordered"
        size="sm"
        className={`${config.className} font-bold text-[10px] md:text-[11px] uppercase tracking-wider backdrop-blur-md px-3 border`}
        startContent={
          <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0 me-1.5 shadow-[0_0_8px_currentColor]" />
        }
      >
        {status}
      </Chip>
    );
  };

  const handleImageError = (petId) => {
    setImageErrors((prev) => ({ ...prev, [petId]: true }));
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-24">
      {/* Background Glows for Glass Effect */}
      <div className="absolute top-[-5%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-[var(--color-lime)] opacity-[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-[var(--color-purple)] opacity-[0.04] blur-[100px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-6 relative z-10 pt-8 md:pt-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-5"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">
              My Requests
            </h1>
            <p className="text-sm md:text-base text-[var(--color-text-secondary)]">
              Track and manage your adoption applications.
            </p>
          </div>
          <Link href="/all-pets">
            <Button
              className="bg-[var(--color-lime)] text-black font-extrabold text-xs tracking-wider uppercase px-6 py-3 h-auto rounded-xl hover:bg-[#c9f17d] transition-transform hover:-translate-y-0.5 shadow-[0_10px_30px_rgba(217,249,157,0.15)]"
              startContent={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              }
            >
              Browse Pets
            </Button>
          </Link>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mb-10"
        >
          {[
            {
              key: "all",
              label: "Total Requests",
              color: "var(--color-lime)",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              )
            },
            {
              key: "pending",
              label: "Pending",
              color: "var(--color-warning)",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              )
            },
            {
              key: "approved",
              label: "Approved",
              color: "var(--color-success)",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              )
            },
            {
              key: "rejected",
              label: "Rejected",
              color: "var(--color-error)",
              icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              )
            },
          ].map((stat) => {
            const isActive = filterStatus === stat.key;
            return (
              <motion.button
                variants={itemVariants}
                key={stat.key}
                onClick={() => setFilterStatus(stat.key)}
                className={`relative overflow-hidden p-5 md:p-6 rounded-2xl text-center cursor-pointer transition-all duration-400 border backdrop-blur-xl ${isActive
                  ? "bg-[var(--color-surface)]/80 shadow-xl scale-[1.02]"
                  : "bg-[var(--color-surface)]/30 hover:bg-[var(--color-surface)]/50"
                  }`}
                style={{
                  borderColor: isActive ? stat.color : "var(--color-border)",
                  boxShadow: isActive ? `0 10px 40px -10px ${stat.color}40` : "none"
                }}
              >
                {/* Subtle top gradient for active card */}
                {isActive && (
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }}
                  />
                )}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${stat.color}15`,
                      border: `1px solid ${stat.color}30`,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </div>
                  {isActive && (
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: stat.color }}
                    />
                  )}
                </div>

                <p className="text-[10px] md:text-[11px] font-extrabold tracking-[0.15em] uppercase text-[var(--color-text-muted)] mb-2">
                  {stat.label}
                </p>
                <p
                  className="text-3xl md:text-4xl font-black tracking-tighter leading-none"
                  style={{ color: stat.color }}
                >
                  {statusCounts[stat.key]}
                </p>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Requests List Area */}
        <div className="relative">
          {isLoading ? (
            <div className="flex flex-col gap-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-[var(--color-surface)]/40 backdrop-blur-xl border border-[var(--color-border)]/50 rounded-2xl shadow-none">
                  <CardBody className="p-5 md:p-6 flex flex-row gap-5 items-center">
                    <div className="w-16 h-16 rounded-xl bg-[var(--color-surface-2)] animate-pulse flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 w-1/3 bg-[var(--color-surface-2)] rounded-md mb-3 animate-pulse" />
                      <div className="h-4 w-1/2 bg-[var(--color-surface-2)] rounded-md animate-pulse" />
                    </div>
                    <div className="w-24 h-8 bg-[var(--color-surface-2)] rounded-full animate-pulse" />
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="bg-[var(--color-surface)]/40 backdrop-blur-2xl border border-[var(--color-border)]/50 rounded-3xl shadow-2xl">
                <CardBody className="py-24 px-6 text-center flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-[var(--color-surface-2)]/50 border border-[var(--color-border)] flex items-center justify-center mb-6 text-5xl shadow-inner">
                    {filterStatus === "pending" ? "⏳" : filterStatus === "approved" ? "🎉" : filterStatus === "rejected" ? "💔" : "📋"}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] mb-3">
                    {filterStatus === "all"
                      ? "No adoption requests yet"
                      : `No ${filterStatus} requests found`}
                  </h3>
                  <p className="text-sm md:text-base text-[var(--color-text-secondary)] mb-8 max-w-md mx-auto leading-relaxed">
                    {filterStatus === "all"
                      ? "Your journey starts here! Browse our wonderful pets and submit an adoption request to see it appear on this page."
                      : "Try switching to a different status filter to view your other applications."}
                  </p>
                  {filterStatus === "all" && (
                    <Link href="/all-pets">
                      <Button className="bg-[var(--color-lime)] text-black font-extrabold tracking-wide px-8 py-6 rounded-xl hover:scale-105 transition-transform">
                        Find a Companion
                      </Button>
                    </Link>
                  )}
                </CardBody>
              </Card>
            </motion.div>
          ) : (
            <Card className="bg-[var(--color-surface)]/60 backdrop-blur-2xl border border-[var(--color-border)]/40 rounded-3xl shadow-2xl overflow-hidden">
              {/* Table Header */}
              <div className="px-6 py-5 border-b border-[var(--color-border)]/40 bg-[var(--color-surface)]/30 flex items-center justify-between">
                <p className="text-xs md:text-sm font-semibold text-[var(--color-text-secondary)]">
                  Showing{" "}
                  <span className="text-[var(--color-text-primary)] font-bold">
                    {filteredRequests.length}
                  </span>{" "}
                  {filterStatus === "all" ? "total" : filterStatus} request
                  {filteredRequests.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Table Body / List */}
              <motion.div variants={containerVariants} initial="hidden" animate="show">
                <AnimatePresence>
                  {filteredRequests.map((request, index) => (
                    <motion.div
                      variants={itemVariants}
                      layout
                      key={request._id}
                      className={`group relative px-6 py-6 flex flex-col md:flex-row md:items-center gap-5 md:gap-6 transition-colors duration-300 hover:bg-[var(--color-surface-2)]/30 ${index < filteredRequests.length - 1 ? "border-b border-[var(--color-border)]/30" : ""
                        }`}
                    >
                      {/* Pet Image / Avatar */}
                      <div className="w-[64px] h-[64px] md:w-[72px] md:h-[72px] rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative group-hover:shadow-md transition-shadow">
                        {petImages[request.petId] && !imageErrors[request.petId] ? (
                          <Image
                            src={petImages[request.petId]}
                            alt={request.petName}
                            fill
                            sizes="72px"
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => handleImageError(request.petId)}
                          />
                        ) : (
                          <span className="text-3xl">{getPetEmoji(request.petName)}</span>
                        )}
                      </div>

                      {/* Request Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg md:text-[19px] font-bold text-[var(--color-text-primary)] mb-2 truncate group-hover:text-[var(--color-lime)] transition-colors">
                          {request.petName}
                        </h4>
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="text-xs font-medium text-[var(--color-text-secondary)] flex items-center gap-1.5 bg-[var(--color-surface-2)]/50 px-2.5 py-1 rounded-md">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                              <line x1="16" y1="2" x2="16" y2="6" />
                              <line x1="8" y1="2" x2="8" y2="6" />
                              <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            Req: {formatDate(request.requestDate)}
                          </span>
                          <span className="text-xs font-medium text-[var(--color-text-secondary)] flex items-center gap-1.5 bg-[var(--color-surface-2)]/50 px-2.5 py-1 rounded-md">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="3" width="15" height="13" />
                              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                              <circle cx="5.5" cy="18.5" r="2.5" />
                              <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                            Pickup: {formatDate(request.pickupDate)}
                          </span>
                        </div>
                      </div>

                      {/* Status & Actions */}
                      <div className="flex items-center gap-4 flex-wrap md:flex-nowrap mt-2 md:mt-0 pt-4 md:pt-0 border-t border-[var(--color-border)]/30 md:border-t-0">
                        <div className="flex-shrink-0">
                          {getStatusChip(request.status)}
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/pets/${request.petId}`}>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="bordered"
                              className="w-[36px] h-[36px] rounded-xl bg-[var(--color-surface-2)]/50 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-lime)] hover:text-[var(--color-lime)] hover:bg-[var(--color-lime)]/10 transition-all"
                              title="View Pet Profile"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                            </Button>
                          </Link>

                          {request.status === "pending" && (
                            <>
                              {confirmCancelId === request._id ? (
                                <motion.div
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 bg-[var(--color-surface-2)]/80 p-1 rounded-xl backdrop-blur-md border border-[var(--color-border)]"
                                >
                                  <span className="text-[11px] font-bold text-[var(--color-text-primary)] px-2">
                                    Cancel?
                                  </span>
                                  <Button
                                    size="sm"
                                    onPress={() => handleCancel(request._id)}
                                    isDisabled={cancellingId === request._id}
                                    isLoading={cancellingId === request._id}
                                    className="min-w-[40px] h-[28px] bg-danger text-white text-[11px] font-bold rounded-lg"
                                  >
                                    Yes
                                  </Button>
                                  <Button
                                    size="sm"
                                    onPress={() => setConfirmCancelId(null)}
                                    className="min-w-[40px] h-[28px] bg-transparent text-[var(--color-text-secondary)] text-[11px] font-bold rounded-lg hover:bg-white/10"
                                  >
                                    No
                                  </Button>
                                </motion.div>
                              ) : (
                                <Button
                                  isIconOnly
                                  size="sm"
                                  onPress={() => setConfirmCancelId(request._id)}
                                  className="w-[36px] h-[36px] rounded-xl bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white transition-all"
                                  title="Cancel Request"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                  </svg>
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}