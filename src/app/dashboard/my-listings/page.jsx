"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  getOwnerPets,
  deletePet,
  updatePet,
  getPetRequests,
  updateRequestStatus,
} from "@/lib/api";
import { toast } from "@/lib/toast";

import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import Image from "next/image";

export default function MyListingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedPetForDelete, setSelectedPetForDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPetForEdit, setSelectedPetForEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [selectedPetForRequests, setSelectedPetForRequests] = useState(null);
  const [petRequests, setPetRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState(null);
  const [showRequestsModal, setShowRequestsModal] = useState(false);

  const fetchPets = useCallback(async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const data = await getOwnerPets(user.email);
      setPets(data);
    } catch (error) {
      toast.error("Failed to load your listings");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "available" && pet.status === "available") ||
        (filterStatus === "pending" && pet.status === "pending") ||
        (filterStatus === "adopted" && pet.status === "adopted");
      
      const matchesSearch =
        !searchQuery.trim() ||
        pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (pet.species && pet.species.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (pet.breed && pet.breed.toLowerCase().includes(searchQuery.toLowerCase()));
        
      return matchesStatus && matchesSearch;
    });
  }, [pets, filterStatus, searchQuery]);

  const stats = useMemo(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return {
      total: pets.length,
      available: pets.filter((p) => p.status === "available").length,
      adopted: pets.filter((p) => p.status === "adopted").length,
      newThisWeek: pets.filter((p) => new Date(p.createdAt) >= oneWeekAgo).length,
      totalPendingRequests: pets.reduce((sum, p) => sum + (p.pendingCount || 0), 0),
    };
  }, [pets]);

  const handleDelete = useCallback(async () => {
    if (!selectedPetForDelete) return;
    setIsDeleting(true);
    try {
      await deletePet(selectedPetForDelete._id);
      toast.success(`${selectedPetForDelete.name} has been removed from your listings`);
      setPets((prev) => prev.filter((p) => p._id !== selectedPetForDelete._id));
      setShowDeleteModal(false);
      setSelectedPetForDelete(null);
    } catch (error) {
      toast.error(error.message || "Failed to delete listing");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedPetForDelete]);

  const handleOpenRequests = useCallback(async (pet) => {
    setSelectedPetForRequests(pet);
    setShowRequestsModal(true);
    setIsLoadingRequests(true);
    setPetRequests([]);
    try {
      const data = await getPetRequests(pet._id);
      setPetRequests(data);
    } catch (error) {
      toast.error("Failed to load requests");
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  const handleUpdateRequestStatus = useCallback(
    async (requestId, status) => {
      setUpdatingRequestId(requestId);
      try {
        await updateRequestStatus(requestId, status);
        toast.success(
          status === "approved"
            ? "Request approved! Pet has been marked as adopted."
            : "Request rejected successfully."
        );
        setPetRequests((prev) =>
          prev.map((r) =>
            r._id === requestId
              ? { ...r, status }
              : status === "approved" && r.status === "pending"
                ? { ...r, status: "rejected" }
                : r
          )
        );
        if (status === "approved") {
          setPets((prev) =>
            prev.map((p) =>
              p._id === selectedPetForRequests._id 
                ? { ...p, status: "adopted", pendingCount: 0 } 
                : p
            )
          );
        } else {
          setPets((prev) =>
            prev.map((p) =>
              p._id === selectedPetForRequests._id 
                ? { ...p, pendingCount: Math.max(0, (p.pendingCount || 1) - 1) } 
                : p
            )
          );
        }
      } catch (error) {
        toast.error(error.message || `Failed to ${status} request`);
      } finally {
        setUpdatingRequestId(null);
      }
    },
    [selectedPetForRequests]
  );

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 md:mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1">
            My Listings
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage your current pet availability and status.
          </p>
        </div>
        <div className="flex gap-2 md:gap-3 items-center flex-wrap w-full sm:w-auto">
          <div className="relative flex items-center flex-1 sm:flex-initial sm:w-[160px]">
            <div className="absolute left-3 flex items-center pointer-events-none text-[var(--color-text-muted)] z-10">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pets..."
              className="w-full"
              classNames={{
                inputWrapper: "bg-[var(--color-surface)] border-[var(--color-border)] pl-9 h-10 shadow-none",
                input: "text-[13px]",
              }}
            />
          </div>
          <Button
            onPress={() => router.push('/dashboard/add-pet')}
            className="flex-1 sm:flex-initial bg-[var(--color-lime)] text-black font-bold text-xs tracking-wider uppercase whitespace-nowrap hover:bg-[var(--color-lime-dark)] w-full sm:w-auto h-10"
            startContent={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            }
          >
            New Listing
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
        <StatCard
          label="Active Listings"
          value={stats.available}
          subtitle={`+${stats.newThisWeek} added this week`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-lime)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
          iconColor="var(--color-lime)"
        />
        <StatCard
          label="Total Views"
          value={pets.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
          subtitle="Accumulated impressions"
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          iconColor="var(--color-purple)"
        />
        <StatCard
          label="Pending Requests"
          value={stats.totalPendingRequests}
          subtitle={stats.totalPendingRequests > 0 ? "Action required" : "All caught up"}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stats.totalPendingRequests > 0 ? "var(--color-error)" : "var(--color-coral)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          }
          iconColor={stats.totalPendingRequests > 0 ? "var(--color-error)" : "var(--color-coral)"}
          highlight={stats.totalPendingRequests > 0}
        />
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">Current Pets</h2>
        <div className="flex gap-2 flex-wrap">
          {["all", "available", "pending", "adopted"].map((status) => (
            <Chip
              key={status}
              variant={filterStatus === status ? "solid" : "bordered"}
              onClick={() => setFilterStatus(status)}
              className={`cursor-pointer capitalize text-xs font-semibold px-3 py-1 h-auto ${filterStatus === status
                ? "bg-[var(--color-surface-3)] text-[var(--color-text-primary)] border-white/20"
                : "bg-transparent text-[var(--color-text-secondary)] border-[var(--color-border)] hover:border-white/20"
                }`}
            >
              {status === "all" ? "All" : status}
            </Chip>
          ))}
        </div>
      </div>

      {/* Pets Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-none">
              <CardBody className="p-0 flex flex-col sm:flex-row gap-0">
                <div className="w-full sm:w-[180px] h-[200px] sm:h-auto sm:min-h-[180px] bg-[var(--color-surface-2)] animate-pulse flex-shrink-0" />
                <div className="flex-1 p-5">
                  <div className="h-5.5 w-3/5 bg-[var(--color-surface-2)] rounded mb-2 animate-pulse" />
                  <div className="h-3.5 w-4/5 bg-[var(--color-surface-2)] rounded mb-5 animate-pulse" />
                  <div className="h-9 w-full bg-[var(--color-surface-2)] rounded animate-pulse" />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : filteredPets.length === 0 ? (
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] shadow-none">
          <CardBody className="p-12 md:p-20 text-center">
            <div className="text-5xl mb-4">🐾</div>
            <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
              {searchQuery
                ? "No matching pets found"
                : filterStatus === "all"
                  ? "No listings yet"
                  : `No ${filterStatus} pets`}
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mb-6">
              {searchQuery
                ? "Try a different search term"
                : filterStatus === "all"
                  ? "Create your first pet listing to get started"
                  : "Switch to a different filter to see other pets"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <Button onPress={() => router.push("/dashboard/add-pet")} className="bg-[var(--color-lime)] text-black font-bold h-11 px-6">
                Add Your First Pet
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              onOpenRequests={handleOpenRequests}
              onEdit={(pet) => {
                setSelectedPetForEdit(pet);
                setShowEditModal(true);
              }}
              onDelete={(pet) => {
                setSelectedPetForDelete(pet);
                setShowDeleteModal(true);
              }}
              router={router}
            />
          ))}
        </div>
      )}

      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeleting && setShowDeleteModal(false)} />
          <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-2xl max-w-md w-full mx-auto">
            <div className="p-7 text-center">
              <div className="w-13 h-13 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-4 text-[var(--color-error)]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                Delete Listing
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-6">
                Are you sure you want to remove{" "}
                <strong className="text-[var(--color-text-primary)]">
                  {selectedPetForDelete?.name}
                </strong>{" "}
                from your listings? This action cannot be undone.
              </p>
              <div className="flex gap-2.5">
                <Button
                  variant="bordered"
                  onPress={() => setShowDeleteModal(false)}
                  isDisabled={isDeleting}
                  className="flex-1 border-[var(--color-border)] text-[var(--color-text-primary)]"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isDisabled={isDeleting}
                  isLoading={isDeleting}
                  className="flex-1 bg-[var(--color-error)] text-white font-bold"
                >
                  Delete Listing
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Requests Modal */}
      {showRequestsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRequestsModal(false)} />
          <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-2xl w-full max-w-2xl mx-auto my-8">
            <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">
                  Adoption Requests
                </h2>
                <p className="text-[13px] text-[var(--color-text-muted)] font-normal">
                  {selectedPetForRequests?.name} • {petRequests.length} request{petRequests.length !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={() => setShowRequestsModal(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoadingRequests ? (
                <div className="p-6 md:p-10 flex flex-col gap-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-5 bg-[var(--color-surface-2)] rounded-sm border border-[var(--color-border)]">
                      <div className="h-4 w-1/2 bg-[var(--color-surface-3)] rounded mb-2 animate-pulse" />
                      <div className="h-3 w-2/3 bg-[var(--color-surface-3)] rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : petRequests.length === 0 ? (
                <div className="p-12 md:p-15 text-center text-[var(--color-text-muted)]">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-[15px] font-semibold text-[var(--color-text-secondary)]">
                    No requests yet
                  </p>
                  <p className="text-[13px] mt-1.5">
                    Requests will appear here when people apply to adopt {selectedPetForRequests?.name}
                  </p>
                </div>
              ) : (
                petRequests.map((request, index) => (
                  <div
                    key={request._id}
                    className={`px-4 md:px-6 py-4 md:py-5 ${index < petRequests.length - 1 ? "border-b border-[var(--color-border)]" : ""
                      } ${request.status === "approved"
                        ? "bg-success/[0.03]"
                        : request.status === "rejected"
                          ? "bg-danger/[0.03]"
                          : ""
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3 gap-3 flex-wrap">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={request.userName?.charAt(0)?.toUpperCase() || "U"}
                          className="w-10 h-10 flex-shrink-0 bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-lime)] font-bold text-[15px]"
                        />
                        <div>
                          <p className="text-sm font-bold text-[var(--color-text-primary)] mb-0.5">
                            {request.userName || "Anonymous"}
                          </p>
                          <p className="text-xs text-[var(--color-text-muted)] break-all">
                            {request.userEmail}
                          </p>
                        </div>
                      </div>

                      <Chip
                        variant="bordered"
                        size="sm"
                        className={`font-bold text-[11px] uppercase tracking-wider flex-shrink-0 px-3 py-1 h-auto ${request.status === "approved"
                          ? "bg-success/12 text-[var(--color-success)] border-success/25"
                          : request.status === "rejected"
                            ? "bg-danger/12 text-[var(--color-error)] border-danger/25"
                            : "bg-warning/12 text-[var(--color-warning)] border-warning/25"
                          }`}
                      >
                        {request.status}
                      </Chip>
                    </div>

                    <div className="flex gap-3 md:gap-4 mb-3 flex-wrap">
                      <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Requested: {formatDate(request.requestDate)}
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

                    {request.message && (
                      <Card className="bg-[var(--color-surface-2)] border border-[var(--color-border)] mb-3.5 shadow-none">
                        <CardBody className="p-3.5">
                          <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed italic">
                            "{request.message}"
                          </p>
                        </CardBody>
                      </Card>
                    )}

                    {request.status === "pending" && (
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          onPress={() => handleUpdateRequestStatus(request._id, "approved")}
                          isDisabled={!!updatingRequestId || petRequests.some((r) => r.status === "approved")}
                          isLoading={updatingRequestId === request._id}
                          className="flex-1 min-w-[120px] bg-success/12 border border-success/25 text-[var(--color-success)] text-xs font-bold"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onPress={() => handleUpdateRequestStatus(request._id, "rejected")}
                          isDisabled={!!updatingRequestId}
                          className="flex-1 min-w-[120px] bg-danger/8 border border-danger/20 text-[var(--color-error)] text-xs font-bold"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {selectedPetForEdit && showEditModal && (
        <EditPetModal
          pet={selectedPetForEdit}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedPetForEdit(null);
          }}
          onSuccess={(updatedPet) => {
            setPets((prev) =>
              prev.map((p) => (p._id === updatedPet._id ? { ...p, ...updatedPet } : p))
            );
            setShowEditModal(false);
            setSelectedPetForEdit(null);
            toast.success("Listing updated successfully!");
          }}
        />
      )}
    </div>
  );
}

const PetCard = ({ pet, onOpenRequests, onEdit, onDelete }) => {
  const [imgError, setImgError] = useState(false);
  const isAdopted = pet.status === "adopted";
  const hasRequests = pet.pendingCount > 0;

  return (
    <Card
      className={`bg-[var(--color-surface)] border shadow-none transition-all duration-200 relative overflow-visible ${isAdopted
        ? "opacity-75 border-[var(--color-border)]"
        : hasRequests 
          ? "border-[var(--color-error)] shadow-[0_0_15px_rgba(239,68,68,0.15)]" 
          : "border-[var(--color-border)] hover:border-[rgba(217,249,157,0.2)]"
        }`}
    >
      {hasRequests && (
        <div className="absolute -top-2 -right-2 bg-[var(--color-error)] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full z-20 shadow-lg animate-bounce">
          {pet.pendingCount} New Request{pet.pendingCount > 1 ? "s" : ""}
        </div>
      )}

      <CardBody className="p-0 flex flex-col sm:flex-row gap-0">
        <div className="w-full sm:w-[180px] h-[220px] sm:h-auto sm:min-h-[180px] relative flex-shrink-0 bg-[var(--color-surface-2)] overflow-hidden rounded-t-xl sm:rounded-tr-none sm:rounded-l-xl">
          {!imgError && pet.imageURL ? (
            <Image
              src={pet.imageURL}
              alt={pet.name}
              fill
              sizes="(max-width: 640px) 100vw, 180px"
              className={`object-cover ${isAdopted ? "grayscale-[0.4]" : ""}`}
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {pet.species === "Dog" ? "🐕" : pet.species === "Cat" ? "🐈" : pet.species === "Bird" ? "🦜" : "🐾"}
            </div>
          )}
          <Chip
            size="sm"
            className={`absolute top-2.5 left-2.5 px-3 py-1 rounded-full font-extrabold text-[9px] uppercase tracking-wider h-auto ${pet.status === "available"
              ? "bg-[var(--color-lime)] text-black"
              : pet.status === "adopted"
                ? "bg-[var(--color-surface-3)] text-[var(--color-text-muted)]"
                : "bg-[var(--color-purple)] text-white"
              }`}
          >
            {pet.status || "available"}
          </Chip>
        </div>

        <div className="flex-1 p-4 md:p-5 flex flex-col min-w-0">
          <div className="flex items-start justify-between mb-1 gap-2">
            <h3
              className={`text-base md:text-[17px] font-bold tracking-tight truncate ${isAdopted ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-primary)]"
                }`}
            >
              {pet.name}
            </h3>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mb-3 tracking-wide">
            {pet.breed || pet.species}
            {pet.age && ` • ${pet.age}`}
            {pet.gender && ` • ${pet.gender}`}
          </p>

          <div className="flex gap-4 md:gap-5 mb-4 flex-wrap">
            <div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)] mb-0.5">
                Views
              </p>
              <p className={`text-sm md:text-base font-bold ${isAdopted ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-primary)]"}`}>
                {(pet.views || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)] mb-0.5">
                Saves
              </p>
              <p className={`text-sm md:text-base font-bold ${isAdopted ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-primary)]"}`}>
                {(pet.saves || 0).toLocaleString()}
              </p>
            </div>
            {pet.adoptionFee !== undefined && (
              <div>
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)] mb-0.5">
                  Fee
                </p>
                <p className={`text-sm md:text-base font-bold ${isAdopted ? "text-[var(--color-text-muted)]" : "text-[var(--color-lime)]"}`}>
                  {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-auto flex-wrap">
            {!isAdopted ? (
              <>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => onOpenRequests(pet)}
                  className={`flex-1 min-w-[80px] text-xs font-semibold whitespace-nowrap bg-[var(--color-surface-2)] ${hasRequests ? "border-[var(--color-error)] text-[var(--color-error)] hover:bg-danger/10" : "border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[rgba(217,249,157,0.3)] hover:text-[var(--color-lime)]"}`}
                >
                  Requests {hasRequests && `(${pet.pendingCount})`}
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => onEdit(pet)}
                  className="flex-1 min-w-[80px] bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)] text-xs font-semibold hover:border-[rgba(217,249,157,0.3)]"
                >
                  Edit
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  onPress={() => onDelete(pet)}
                  className="w-[34px] h-[34px] bg-danger/8 border border-danger/20 text-[var(--color-error)] hover:bg-danger/15 flex-shrink-0"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="bordered"
                onPress={() => onDelete(pet)}
                className="flex-1 border-[var(--color-border)] text-[var(--color-text-muted)] text-xs font-semibold"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

const StatCard = ({ label, value, subtitle, icon, iconColor, highlight }) => {
  return (
    <Card className={`bg-[var(--color-surface)] border ${highlight ? "border-[var(--color-error)] shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "border-[var(--color-border)]"} relative overflow-hidden shadow-none`}>
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${iconColor}40, transparent)`,
        }}
      />
      <CardBody className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-3 md:mb-4">
          <p className="text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
            {label}
          </p>
          <div
            className="w-8 h-8 md:w-9 md:h-9 rounded-sm flex items-center justify-center flex-shrink-0"
            style={{
              background: `${iconColor}15`,
              border: `1px solid ${iconColor}25`,
            }}
          >
            {icon}
          </div>
        </div>
        <p className="text-2xl md:text-[32px] font-extrabold text-[var(--color-text-primary)] tracking-tighter leading-none mb-1 md:mb-1.5">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs font-medium" style={{ color: iconColor }}>
            {subtitle}
          </p>
        )}
      </CardBody>
    </Card>
  );
};

function EditPetModal({ pet, isOpen, onClose, onSuccess }) {
  const SPECIES_OPTIONS = ["Dog", "Cat", "Bird", "Rabbit", "Reptile", "Fish", "Guinea Pig", "Hamster", "Other"];
  const GENDER_OPTIONS = ["Male", "Female"];
  const HEALTH_OPTIONS = ["Excellent", "Good", "Fair", "Needs Care"];

  const [formData, setFormData] = useState({
    name: pet.name || "",
    species: pet.species || "",
    breed: pet.breed || "",
    age: pet.age || "",
    gender: pet.gender || "",
    imageURL: pet.imageURL || "",
    healthStatus: pet.healthStatus || "",
    vaccinationStatus: pet.vaccinationStatus || false,
    location: pet.location || "",
    adoptionFee: pet.adoptionFee !== undefined ? String(pet.adoptionFee) : "",
    description: pet.description || "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Pet name is required";
    if (!formData.species) newErrors.species = "Species is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await updatePet(pet._id, {
        ...formData,
        adoptionFee: formData.adoptionFee === "" ? 0 : parseFloat(formData.adoptionFee),
      });
      onSuccess({
        ...pet,
        ...formData,
        adoptionFee: formData.adoptionFee === "" ? 0 : parseFloat(formData.adoptionFee),
      });
    } catch (error) {
      toast.error(error.message || "Failed to update listing");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, pet, validate, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isSubmitting && onClose()} />
      <div className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg shadow-2xl w-full max-w-2xl mx-auto my-8">
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">
              Edit {pet.name}
            </h2>
            <button
              type="button"
              onClick={() => !isSubmitting && onClose()}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 max-h-[70vh] overflow-y-auto">
            <Input
              label="Pet Name"
              name="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Buddy"
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              classNames={{
                label: `text-[11px] font-semibold uppercase tracking-wider ${errors.name ? "text-[var(--color-error)]" : "text-[var(--color-text-secondary)]"}`,
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] shadow-none h-11",
              }}
            />
            <Input
              label="Age"
              name="age"
              value={formData.age}
              onChange={(e) => handleChange("age", e.target.value)}
              placeholder="e.g. 2 years"
              isInvalid={!!errors.age}
              errorMessage={errors.age}
              classNames={{
                label: `text-[11px] font-semibold uppercase tracking-wider ${errors.age ? "text-[var(--color-error)]" : "text-[var(--color-text-secondary)]"}`,
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] shadow-none h-11",
              }}
            />
            <Input
              label="Breed"
              name="breed"
              value={formData.breed}
              onChange={(e) => handleChange("breed", e.target.value)}
              placeholder="e.g. Golden Retriever"
              classNames={{
                label: "text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]",
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] shadow-none h-11",
              }}
            />
            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. New York"
              isInvalid={!!errors.location}
              errorMessage={errors.location}
              classNames={{
                label: `text-[11px] font-semibold uppercase tracking-wider ${errors.location ? "text-[var(--color-error)]" : "text-[var(--color-text-secondary)]"}`,
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] shadow-none h-11",
              }}
            />
            <Input
              label="Adoption Fee ($)"
              name="adoptionFee"
              type="number"
              value={formData.adoptionFee}
              onChange={(e) => handleChange("adoptionFee", e.target.value)}
              placeholder="0 for free"
              classNames={{
                label: "text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]",
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] shadow-none h-11",
              }}
            />
            <Input
              label="Image URL"
              name="imageURL"
              value={formData.imageURL}
              onChange={(e) => handleChange("imageURL", e.target.value)}
              placeholder="https://..."
              classNames={{
                label: "text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]",
                inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] shadow-none h-11",
              }}
            />

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Species {errors.species && <span className="text-[var(--color-error)]">*</span>}
              </label>
              <select
                value={formData.species}
                onChange={(e) => handleChange("species", e.target.value)}
                className={`w-full h-11 px-3 rounded-md bg-[var(--color-surface-2)] border ${errors.species ? "border-[var(--color-error)]" : "border-[var(--color-border)]"} text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-lime)]`}
              >
                <option value="">Select species</option>
                {SPECIES_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.species && (
                <p className="text-xs text-[var(--color-error)] mt-1">{errors.species}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Gender {errors.gender && <span className="text-[var(--color-error)]">*</span>}
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
                className={`w-full h-11 px-3 rounded-md bg-[var(--color-surface-2)] border ${errors.gender ? "border-[var(--color-error)]" : "border-[var(--color-border)]"} text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-lime)]`}
              >
                <option value="">Select gender</option>
                {GENDER_OPTIONS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              {errors.gender && (
                <p className="text-xs text-[var(--color-error)] mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] mb-1.5">
                Health Status
              </label>
              <select
                value={formData.healthStatus}
                onChange={(e) => handleChange("healthStatus", e.target.value)}
                className="w-full h-11 px-3 rounded-md bg-[var(--color-surface-2)] border border-[var(--color-border)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-lime)]"
              >
                <option value="">Select health status</option>
                {HEALTH_OPTIONS.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center h-11 mt-6">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.vaccinationStatus}
                  onChange={(e) => handleChange("vaccinationStatus", e.target.checked)}
                  className="w-4 h-4 rounded border-[var(--color-border)] bg-[var(--color-surface-2)] checked:bg-[var(--color-lime)] checked:border-[var(--color-lime)] focus:ring-2 focus:ring-[var(--color-lime)] focus:ring-offset-0"
                />
                <span className={`text-sm font-semibold ${formData.vaccinationStatus ? "text-[var(--color-success)]" : "text-[var(--color-text-primary)]"}`}>
                  Vaccinated
                </span>
              </label>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <Textarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe this pet..."
                minRows={3}
                classNames={{
                  label: "text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]",
                  inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)] shadow-none",
                }}
              />
            </div>
          </div>
          <div className="px-6 py-4 border-t border-[var(--color-border)] flex gap-2.5 justify-end">
            <Button variant="bordered" onPress={() => !isSubmitting && onClose()} isDisabled={isSubmitting} className="border-[var(--color-border)] text-[var(--color-text-primary)] font-semibold h-11">
              Cancel
            </Button>
            <Button type="submit" isDisabled={isSubmitting} isLoading={isSubmitting} className="bg-[var(--color-lime)] text-black font-bold h-11 px-6">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}