"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
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

// Updated HeroUI v3 Imports
import { Button } from "@heroui/button";
import { Input, TextArea } from "@heroui/react";
import { Select, ListBox, Modal, Checkbox } from "@heroui/react";
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

  const [deleteModal, setDeleteModal] = useState({ open: false, pet: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const [editModal, setEditModal] = useState({ open: false, pet: null });

  const [requestsModal, setRequestsModal] = useState({ open: false, pet: null });
  const [petRequests, setPetRequests] = useState([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [updatingRequestId, setUpdatingRequestId] = useState(null);

  // FIXED: Changed dependency from [user?.email] to [user] for React Compiler
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
        (pet.species && pet.species.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [pets, filterStatus, searchQuery]);

  const stats = useMemo(() => ({
    total: pets.length,
    available: pets.filter((p) => p.status === "available").length,
    adopted: pets.filter((p) => p.status === "adopted").length,
    pending: pets.filter((p) => p.status === "pending").length,
  }), [pets]);

  const handleDelete = useCallback(async () => {
    if (!deleteModal.pet) return;
    setIsDeleting(true);
    try {
      await deletePet(deleteModal.pet._id);
      toast.success(`${deleteModal.pet.name} has been removed from your listings`);
      setPets((prev) => prev.filter((p) => p._id !== deleteModal.pet._id));
      setDeleteModal({ open: false, pet: null });
    } catch (error) {
      toast.error(error.message || "Failed to delete listing");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteModal.pet]);

  const handleOpenRequests = useCallback(async (pet) => {
    setRequestsModal({ open: true, pet });
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

  const handleUpdateRequestStatus = useCallback(async (requestId, status) => {
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
            p._id === requestsModal.pet._id ? { ...p, status: "adopted" } : p
          )
        );
      }
    } catch (error) {
      toast.error(error.message || `Failed to ${status} request`);
    } finally {
      setUpdatingRequestId(null);
    }
  }, [requestsModal.pet]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  const getStatusColor = useCallback((status) => {
    if (status === "available") return "success";
    if (status === "adopted") return "default";
    if (status === "pending") return "secondary";
    return "success";
  }, []);

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-[var(--color-text-primary)] tracking-tight mb-1">
            My Listings
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage your current pet availability and status.
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pets..."
            className="w-[160px]"
            startcontent={
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
            classnames={{
              inputWrapper: "bg-[var(--color-surface)] border-[var(--color-border)]",
              input: "text-[13px]",
            }}
          />
          <Link href="/dashboard/add-pet">
            <Button
              className="bg-[var(--color-lime)] text-black font-bold text-xs tracking-wider uppercase whitespace-nowrap hover:bg-[var(--color-lime-dark)]"
              startcontent={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              }
            >
              New Listing
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-4 mb-8">
        <StatCard
          label="Active Listings"
          value={stats.available}
          subtitle={`+${Math.max(0, stats.available - 10)} this week`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-lime)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
          iconColor="var(--color-lime)"
        />
        <StatCard
          label="Views Today"
          value={pets.reduce((sum, p) => sum + (p.views || 0), 0).toLocaleString()}
          subtitle={`${stats.pending} pending requests`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          }
          iconColor="var(--color-purple)"
        />
        <StatCard
          label="Successful Adoptions"
          value={stats.adopted}
          subtitle={`${stats.adopted > 0 ? Math.round((stats.adopted / Math.max(stats.total, 1)) * 100) : 0}% rate`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-coral)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          }
          iconColor="var(--color-coral)"
        />
      </div>

      {/* Filter Section */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-base font-bold text-[var(--color-text-primary)]">
          Current Pets
        </h2>
        <div className="flex gap-2">
          {["all", "available", "pending", "adopted"].map((status) => (
            <Chip
              key={status}
              variant={filterStatus === status ? "solid" : "bordered"}
              onClick={() => setFilterStatus(status)}
              className={`cursor-pointer capitalize text-xs font-semibold ${
                filterStatus === status
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
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-[var(--color-surface)] border border-[var(--color-border)]">
              <CardBody className="p-0 flex flex-row gap-0">
                <div className="w-[180px] min-h-[180px] bg-[var(--color-surface-2)] animate-pulse flex-shrink-0" />
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
        <Card className="bg-[var(--color-surface)] border border-[var(--color-border)]">
          <CardBody className="p-20 text-center">
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
              <Link href="/dashboard/add-pet">
                <Button className="bg-[var(--color-lime)] text-black font-bold">
                  Add Your First Pet
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet._id}
              pet={pet}
              onOpenRequests={handleOpenRequests}
              onEdit={() => setEditModal({ open: true, pet })}
              onDelete={() => setDeleteModal({ open: true, pet })}
              router={router}
            />
          ))}
        </div>
      )}

      {/* FIXED: Delete Modal v3 Syntax */}
      <Modal
        isOpen={deleteModal.open}
        onOpenChange={(isOpen) => {
          if (!isOpen && !isDeleting) setDeleteModal({ open: false, pet: null });
        }}
      >
        <Modal.Backdrop className="bg-black/60">
          <Modal.Container>
            <Modal.Dialog className="bg-[var(--color-surface)] border border-[var(--color-border)]">
              <Modal.Body className="p-7 text-center">
                <div className="w-13 h-13 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center mx-auto mb-5 text-[var(--color-error)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                  Delete Listing
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-7">
                  Are you sure you want to remove{" "}
                  <strong className="text-[var(--color-text-primary)]">
                    {deleteModal.pet?.name}
                  </strong>{" "}
                  from your listings? This action cannot be undone.
                </p>
                <div className="flex gap-2.5">
                  <Button
                    variant="bordered"
                    onPress={() => setDeleteModal({ open: false, pet: null })}
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
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      {/* Requests Modal */}
      {requestsModal.open && (
        <RequestsModal
          pet={requestsModal.pet}
          requests={petRequests}
          isLoading={isLoadingRequests}
          updatingRequestId={updatingRequestId}
          onClose={() => {
            setRequestsModal({ open: false, pet: null });
            setPetRequests([]);
          }}
          onUpdateStatus={handleUpdateRequestStatus}
          formatDate={formatDate}
        />
      )}

      {/* Edit Modal */}
      {editModal.open && (
        <EditPetModal
          pet={editModal.pet}
          onClose={() => setEditModal({ open: false, pet: null })}
          onSuccess={(updatedPet) => {
            setPets((prev) =>
              prev.map((p) => (p._id === updatedPet._id ? { ...p, ...updatedPet } : p))
            );
            setEditModal({ open: false, pet: null });
            toast.success("Listing updated successfully!");
          }}
        />
      )}
    </div>
  );
}

const PetCard = ({ pet, onOpenRequests, onEdit, onDelete, router }) => {
  const isAdopted = pet.status === "adopted";

  return (
    <Card
      className={`bg-[var(--color-surface)] border transition-all duration-200 ${
        isAdopted
          ? "opacity-75 border-[var(--color-border)]"
          : "border-[var(--color-border)] hover:border-[rgba(217,249,157,0.2)]"
      }`}
    >
      <CardBody className="p-0 flex flex-row gap-0">
        <div className="w-[180px] min-h-[180px] relative flex-shrink-0 bg-[var(--color-surface-2)] overflow-hidden">
          {pet.imageURL ? (
            <Image
              src={pet.imageURL}
              alt={pet.name}
              className={`w-full h-full object-cover absolute inset-0 ${isAdopted ? "grayscale-[0.4]" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl absolute inset-0">
              {pet.species === "Dog" ? "🐕" :
               pet.species === "Cat" ? "🐈" :
               pet.species === "Bird" ? "🦜" :
               pet.species === "Rabbit" ? "🐇" : "🐾"}
            </div>
          )}
          <Chip
            size="sm"
            className={`absolute top-2.5 left-2.5 font-extrabold text-[9px] uppercase tracking-wider ${
              pet.status === "available"
                ? "bg-[var(--color-lime)] text-black"
                : pet.status === "adopted"
                ? "bg-[var(--color-surface-3)] text-[var(--color-text-muted)]"
                : "bg-[var(--color-purple)] text-white"
            }`}
          >
            {pet.status || "available"}
          </Chip>
        </div>

        <div className="flex-1 p-4.5 px-5 flex flex-col min-w-0">
          <div className="flex items-start justify-between mb-1 gap-2">
            <h3 className={`text-[17px] font-bold tracking-tight truncate ${
              isAdopted ? "text-[var(--color-text-secondary)]" : "text-[var(--color-text-primary)]"
            }`}>
              {pet.name}
            </h3>
            <Button isIconOnly size="sm" variant="light" className="text-[var(--color-text-muted)] min-w-0 w-auto h-auto p-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="1" />
                <circle cx="12" cy="12" r="1" />
                <circle cx="12" cy="19" r="1" />
              </svg>
            </Button>
          </div>

          <p className="text-xs text-[var(--color-text-muted)] mb-3 tracking-wide">
            {pet.breed || pet.species}
            {pet.age && ` • ${pet.age}`}
            {pet.gender && ` • ${pet.gender}`}
          </p>

          <div className="flex gap-5 mb-4">
            <div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)] mb-0.5">
                Views
              </p>
              <p className={`text-base font-bold ${isAdopted ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-primary)]"}`}>
                {(pet.views || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)] mb-0.5">
                Saves
              </p>
              <p className={`text-base font-bold ${isAdopted ? "text-[var(--color-text-muted)]" : "text-[var(--color-text-primary)]"}`}>
                {(pet.saves || 0).toLocaleString()}
              </p>
            </div>
            {pet.adoptionFee !== undefined && (
              <div>
                <p className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-muted)] mb-0.5">
                  Fee
                </p>
                <p className={`text-base font-bold ${isAdopted ? "text-[var(--color-text-muted)]" : "text-[var(--color-lime)]"}`}>
                  {pet.adoptionFee === 0 ? "Free" : `$${pet.adoptionFee}`}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-auto">
            {!isAdopted ? (
              <>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => onOpenRequests(pet)}
                  className="flex-1 bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)] text-xs font-semibold whitespace-nowrap hover:border-[rgba(217,249,157,0.3)] hover:text-[var(--color-lime)]"
                >
                  Requests
                </Button>
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={onEdit}
                  className="flex-1 bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-primary)] text-xs font-semibold hover:border-[rgba(217,249,157,0.3)]"
                >
                  Edit
                </Button>
                <Button
                  isIconOnly
                  size="sm"
                  onPress={onDelete}
                  className="w-[34px] h-[34px] bg-danger/8 border border-danger/20 text-[var(--color-error)] hover:bg-danger/15"
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
                onPress={onDelete}
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

const StatCard = ({ label, value, subtitle, icon, iconColor }) => {
  return (
    <Card className="bg-[var(--color-surface)] border border-[var(--color-border)] relative overflow-hidden">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${iconColor}40, transparent)`,
        }}
      />
      <CardBody className="p-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[var(--color-text-muted)]">
            {label}
          </p>
          <div
            className="w-9 h-9 rounded-sm flex items-center justify-center"
            style={{
              background: `${iconColor}15`,
              border: `1px solid ${iconColor}25`,
            }}
          >
            {icon}
          </div>
        </div>
        <p className="text-[32px] font-extrabold text-[var(--color-text-primary)] tracking-tighter leading-none mb-1.5">
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

// FIXED: Requests Modal v3 Syntax
function RequestsModal({ pet, requests, isLoading, updatingRequestId, onClose, onUpdateStatus, formatDate }) {
  const hasApproved = useMemo(() => requests.some((r) => r.status === "approved"), [requests]);

  return (
    <Modal isOpen={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <Modal.Backdrop className="bg-black/60">
        <Modal.Container>
          <Modal.Dialog className="bg-[var(--color-surface)] border border-[var(--color-border)] max-w-2xl overflow-hidden">
            <Modal.CloseTrigger />
            <Modal.Header className="px-6 py-5 border-b border-[var(--color-border)] flex flex-col gap-0.5">
              <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">
                Adoption Requests
              </h2>
              <p className="text-[13px] text-[var(--color-text-muted)] font-normal">
                {pet?.name} • {requests.length} request{requests.length !== 1 ? "s" : ""}
              </p>
            </Modal.Header>
            <Modal.Body className="p-0 max-h-[500px] overflow-y-auto">
              {isLoading ? (
                <div className="p-10 flex flex-col gap-3">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="p-5 bg-[var(--color-surface-2)] rounded-sm">
                      <div className="h-4 w-1/2 bg-[var(--color-surface-3)] rounded mb-2 animate-pulse" />
                      <div className="h-3 w-2/3 bg-[var(--color-surface-3)] rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : requests.length === 0 ? (
                <div className="p-15 text-center text-[var(--color-text-muted)]">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-[15px] font-semibold text-[var(--color-text-secondary)]">
                    No requests yet
                  </p>
                  <p className="text-[13px] mt-1.5">
                    Requests will appear here when people apply to adopt {pet?.name}
                  </p>
                </div>
              ) : (
                requests.map((request, index) => (
                  <div
                    key={request._id}
                    className={`px-6 py-5 ${
                      index < requests.length - 1 ? "border-b border-[var(--color-border)]" : ""
                    } ${
                      request.status === "approved"
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
                          <p className="text-xs text-[var(--color-text-muted)]">
                            {request.userEmail}
                          </p>
                        </div>
                      </div>

                      <Chip
                        variant="bordered"
                        size="sm"
                        className={`font-bold text-[11px] uppercase tracking-wider ${
                          request.status === "approved"
                            ? "bg-success/12 text-[var(--color-success)] border-success/25"
                            : request.status === "rejected"
                            ? "bg-danger/12 text-[var(--color-error)] border-danger/25"
                            : "bg-warning/12 text-[var(--color-warning)] border-warning/25"
                        }`}
                      >
                        {request.status}
                      </Chip>
                    </div>

                    <div className="flex gap-4 mb-3 flex-wrap">
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
                      <Card className="bg-[var(--color-surface-2)] border border-[var(--color-border)] mb-3.5">
                        <CardBody className="p-3.5">
                          <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed italic">
                            "{request.message}"
                          </p>
                        </CardBody>
                      </Card>
                    )}

                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onPress={() => onUpdateStatus(request._id, "approved")}
                          isDisabled={!!updatingRequestId || hasApproved}
                          isLoading={updatingRequestId === request._id}
                          className="flex-1 bg-success/12 border border-success/25 text-[var(--color-success)] text-xs font-bold"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onPress={() => onUpdateStatus(request._id, "rejected")}
                          isDisabled={!!updatingRequestId}
                          className="flex-1 bg-danger/8 border border-danger/20 text-[var(--color-error)] text-xs font-bold"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

// FIXED: Edit Modal v3 Syntax (TextArea and Select -> ListBox conversion)
function EditPetModal({ pet, onClose, onSuccess }) {
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
      onSuccess({ ...pet, ...formData, adoptionFee: formData.adoptionFee === "" ? 0 : parseFloat(formData.adoptionFee) });
    } catch (error) {
      toast.error(error.message || "Failed to update listing");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, pet, validate, onSuccess]);

  return (
    <Modal
      isOpen={true}
      onOpenChange={(isOpen) => {
        if (!isOpen && !isSubmitting) onClose();
      }}
    >
      <Modal.Backdrop className="bg-black/60">
        <Modal.Container>
          <Modal.Dialog className="bg-[var(--color-surface)] border border-[var(--color-border)] max-w-2xl">
            <Modal.CloseTrigger />
            <Modal.Header className="px-6 py-5 border-b border-[var(--color-border)]">
              <h2 className="text-[17px] font-bold text-[var(--color-text-primary)]">
                Edit {pet.name}
              </h2>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
              <Modal.Body className="p-6 grid grid-cols-2 sm:grid-cols-1 gap-4 overflow-y-auto max-h-[60vh]">
                {[
                  { label: "Pet Name", name: "name", placeholder: "e.g. Buddy" },
                  { label: "Age", name: "age", placeholder: "e.g. 2 years" },
                  { label: "Breed", name: "breed", placeholder: "e.g. Golden Retriever" },
                  { label: "Location", name: "location", placeholder: "e.g. New York" },
                  { label: "Adoption Fee ($)", name: "adoptionFee", type: "number", placeholder: "0 for free" },
                  { label: "Image URL", name: "imageURL", placeholder: "https://..." },
                ].map((field) => (
                  <Input
                    key={field.name}
                    label={field.label}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name]}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    isInvalid={!!errors[field.name]}
                    errorMessage={errors[field.name]}
                    classnames={{
                      label: `text-[11px] font-semibold uppercase tracking-wider ${errors[field.name] ? "text-[var(--color-error)]" : "text-[var(--color-text-secondary)]"}`,
                      inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)]",
                    }}
                  />
                ))}

                <Select
                  label="Species"
                  selectedKeys={new Set(formData.species ? [formData.species] : [])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (selected) handleChange("species", selected);
                  }}
                  isInvalid={!!errors.species}
                  errorMessage={errors.species}
                  classnames={{
                    label: "text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]",
                  }}
                >
                  <Select.Trigger className="bg-[var(--color-surface-2)] border-[var(--color-border)]">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {SPECIES_OPTIONS.map((s) => (
                        <ListBox.Item key={s} id={s} textValue={s}>
                          {s}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  label="Gender"
                  selectedKeys={new Set(formData.gender ? [formData.gender] : [])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (selected) handleChange("gender", selected);
                  }}
                  isInvalid={!!errors.gender}
                  errorMessage={errors.gender}
                  classnames={{
                    label: "text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]",
                  }}
                >
                  <Select.Trigger className="bg-[var(--color-surface-2)] border-[var(--color-border)]">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {GENDER_OPTIONS.map((g) => (
                        <ListBox.Item key={g} id={g} textValue={g}>
                          {g}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <Select
                  label="Health Status"
                  selectedKeys={new Set(formData.healthStatus ? [formData.healthStatus] : [])}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0];
                    if (selected) handleChange("healthStatus", selected);
                  }}
                  classnames={{
                    label: "text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]",
                  }}
                >
                  <Select.Trigger className="bg-[var(--color-surface-2)] border-[var(--color-border)]">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {HEALTH_OPTIONS.map((h) => (
                        <ListBox.Item key={h} id={h} textValue={h}>
                          {h}
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                </Select>

                <div className="flex items-center mt-4">
                  <Checkbox
                    isSelected={formData.vaccinationStatus}
                    onValueChange={(checked) => handleChange("vaccinationStatus", checked)}
                    classnames={{
                      base: `p-3 px-3.5 rounded-sm w-full transition-all ${
                        formData.vaccinationStatus
                          ? "bg-success/8 border-success/25"
                          : "bg-[var(--color-surface-2)] border-[var(--color-border)]"
                      }`,
                      label: `text-[13px] font-semibold ${
                        formData.vaccinationStatus
                          ? "text-[var(--color-success)]"
                          : "text-[var(--color-text-primary)]"
                      }`,
                    }}
                  >
                    Vaccinated
                  </Checkbox>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <TextArea
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Describe this pet..."
                    minRows={4}
                    classnames={{
                      label: "text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]",
                      inputWrapper: "bg-[var(--color-surface-2)] border-[var(--color-border)]",
                    }}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer className="px-6 py-4 border-t border-[var(--color-border)] gap-2.5">
                <Button
                  variant="bordered"
                  onPress={() => !isSubmitting && onClose()}
                  isDisabled={isSubmitting}
                  className="border-[var(--color-border)] text-[var(--color-text-primary)]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isDisabled={isSubmitting}
                  isLoading={isSubmitting}
                  className="bg-[var(--color-lime)] text-black font-bold"
                >
                  Save Changes
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}