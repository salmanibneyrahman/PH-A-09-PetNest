"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllPets } from "@/lib/api";
import PetCard from "@/components/PetCard";
import { Button, Select, Card, Skeleton, ListBox, Label } from "@heroui/react";
import Image from "next/image";

const SPECIES_LIST = [
  {
    key: "Dog",
    label: "Dogs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5" />
        <path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5" />
        <path d="M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z" />
        <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309m-9.243-6.082A8.801 8.801 0 0 1 12 5c.78 0 1.5.108 2.161.306" />
      </svg>
    ),
  },
  {
    key: "Cat",
    label: "Cats",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 17 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5z" />
        <path d="M8 14v.5M16 14v.5M11.25 16.25h1.5L12 17l-.75-.75z" />
      </svg>
    ),
  },
  {
    key: "Bird",
    label: "Birds",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 7h.01" />
        <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
        <path d="m20 7 2 .5-2 .5" />
        <path d="M10 18v3M14 17.75V21" />
        <path d="M7 18a6 6 0 0 0 3.84-10.61" />
      </svg>
    ),
  },
  {
    key: "Reptile",
    label: "Reptiles",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
  },
  {
    key: "Rabbit",
    label: "Rabbits",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 4a3 3 0 0 1 0 6M6 4a3 3 0 0 0 0 6M12 7v5" />
        <path d="M6 10a6 6 0 0 0 12 0" />
        <path d="M12 17a5 5 0 0 1-5 5h10a5 5 0 0 1-5-5z" />
      </svg>
    ),
  },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function AllPetsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [pets, setPets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || ""
  );
  const [activeSpecies, setActiveSpecies] = useState(
    searchParams.get("species") || ""
  );
  const [sortBy, setSortBy] = useState("newest");
  const [totalCount, setTotalCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPets = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (searchInput.trim()) params.search = searchInput.trim();
      if (activeSpecies) params.species = activeSpecies;
      if (sortBy) params.sort = sortBy;
      const data = await getAllPets(params);
      setPets(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error("Failed to fetch pets:", error);
      setPets([]);
      setTotalCount(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchInput, activeSpecies, sortBy]);

  useEffect(() => {
    if (!mounted) return;
    const debounce = setTimeout(() => {
      fetchPets();
    }, 400);
    return () => clearTimeout(debounce);
  }, [fetchPets, mounted]);

  useEffect(() => {
    const urlSpecies = searchParams.get("species") || "";
    const urlSearch = searchParams.get("search") || "";
    setActiveSpecies(urlSpecies);
    setSearchInput(urlSearch);
  }, [searchParams]);

  const handleSpeciesFilter = (speciesKey) => {
    const newSpecies = activeSpecies === speciesKey ? "" : speciesKey;
    setActiveSpecies(newSpecies);
    const params = new URLSearchParams();
    if (newSpecies) params.set("species", newSpecies);
    if (searchInput.trim()) params.set("search", searchInput.trim());
    router.push(`/all-pets?${params.toString()}`, { scroll: false });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput.trim()) params.set("search", searchInput.trim());
    if (activeSpecies) params.set("species", activeSpecies);
    router.push(`/all-pets?${params.toString()}`, { scroll: false });
  };

  const handleClearFilters = () => {
    setActiveSpecies("");
    setSearchInput("");
    setSortBy("newest");
    router.push("/all-pets", { scroll: false });
  };

  const hasFilters = activeSpecies || searchInput.trim();

  const speciesLabel = activeSpecies
    ? SPECIES_LIST.find((s) => s.key === activeSpecies)?.label || activeSpecies
    : "All Pets";

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-background border-b border-default-200 pt-12 pb-10">
        <div className="max-w-[1280px] mx-auto px-6">
          <h1 className="text-[clamp(36px,5vw,56px)] font-bold tracking-[-0.03em] leading-[1.1] text-foreground mb-2">
            Find your new{" "}
            <span className="bg-gradient-to-br from-[#d9f99d] to-[#a3e635] bg-clip-text text-transparent">
              partner
            </span>{" "}
            in
            <br />
            adventure.
          </h1>

          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-0 bg-content2 border border-default-200 rounded-md p-1 pl-4 mt-7 max-w-[560px] transition-all duration-200 focus-within:border-[#d9f99d]/40 focus-within:shadow-[0_0_0_3px_rgba(217,249,157,0.08)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-default-400 shrink-0"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, breed, or personality..."
              className="flex-1 py-2.5 px-3 bg-transparent border-none outline-none text-foreground text-sm font-sans"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput("")}
                className="bg-transparent border-none text-default-400 cursor-pointer py-1 px-2 flex items-center hover:text-foreground transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <Button
              type="submit"
              className="px-5 bg-[#d9f99d] hover:bg-[#c9f17d] rounded-sm text-black text-xs font-bold tracking-wider uppercase shrink-0 font-sans transition-colors ml-1"
            >
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto pt-10 px-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-sm font-semibold tracking-wider uppercase text-default-400">
            Browse by Category
          </h2>
          {hasFilters && (
            <button
              onClick={handleClearFilters}
              className="bg-transparent border-none text-[#d9f99d] text-[13px] font-semibold cursor-pointer font-sans flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              Clear all filters
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-10">
          {SPECIES_LIST.map((species) => {
            const isActive = activeSpecies === species.key;
            return (
              <button
                key={species.key}
                onClick={() => handleSpeciesFilter(species.key)}
                className={`py-6 px-4 border rounded-md cursor-pointer flex flex-col items-center gap-2.5 transition-all duration-200 font-sans relative ${isActive
                  ? "bg-[#d9f99d] border-[#d9f99d] text-black"
                  : "bg-content1 border-default-200 text-default-500 hover:border-[#d9f99d]/30 hover:text-foreground hover:bg-content2"
                  }`}
              >
                {isActive && (
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-black" />
                )}
                <div className={isActive ? "text-black" : "text-current"}>
                  {species.icon}
                </div>
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase">
                  {species.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mb-7 flex-wrap gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-wider uppercase text-default-400 mb-1">
              Results
            </p>
            <h3 className="text-[22px] font-bold text-foreground tracking-[-0.01em]">
              {isLoading
                ? "Loading..."
                : `${totalCount} ${speciesLabel} Found`}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-default-400 whitespace-nowrap">
              Sort by:
            </span>
            <Select
              className="w-auto min-w-[160px]"
              value={sortBy}
              onChange={(key) => setSortBy(key)}
            >
              <Select.Trigger className="h-9 min-h-9">
                <Select.Value />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {SORT_OPTIONS.map((opt) => (
                    <ListBox.Item key={opt.value} id={opt.value} textValue={opt.label}>
                      {opt.label}
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
            <button
              aria-label="Filter options"
              className="w-9 h-9 bg-content1 border border-default-200 rounded-md flex items-center justify-center cursor-pointer text-default-400 shrink-0 hover:bg-content2 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="16" y2="12" />
                <line x1="10" y1="18" x2="14" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border border-default-200 bg-content1 rounded-lg overflow-hidden shadow-none">
                <Skeleton className="h-[220px] w-full" />
                <div className="p-5">
                  <Skeleton className="h-[22px] w-[55%] mb-2.5 rounded-md" />
                  <Skeleton className="h-[13px] w-[75%] mb-2 rounded-md" />
                  <Skeleton className="h-[13px] w-[60%] mb-5 rounded-md" />
                  <Skeleton className="h-[38px] w-full rounded-md" />
                </div>
              </Card>
            ))}
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-24 px-6 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-content1 border border-default-200 flex items-center justify-center text-4xl">
              🐾
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No pets found
            </h3>
            <p className="text-sm text-default-500 max-w-[360px] leading-[1.6]">
              We could not find any pets matching your search. Try adjusting
              your filters or clearing the search term.
            </p>
            <Button
              onPress={handleClearFilters}
              className="mt-2 bg-primary text-primary-foreground font-semibold"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 mb-10">
              {pets
                .filter((_, i) => i < pets.length - 1 || pets.length % 4 !== 1)
                .slice(0, 3)
                .map((pet) => (
                  <PetCard key={pet._id} pet={pet} />
                ))}
            </div>

            {pets.length > 3 && (
              <FeaturedSpotlight pet={pets[3]} />
            )}

            {pets.length > 4 && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5 mt-10">
                {pets.slice(4).map((pet) => (
                  <PetCard key={pet._id} pet={pet} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FeaturedSpotlight({ pet }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  if (!pet) return null;

  return (
    <Card className="grid grid-cols-1 md:grid-cols-2 bg-content1 border border-default-200 rounded-lg overflow-hidden mt-2 shadow-none">
      <div className="relative min-h-[320px] bg-content2">
        {!imgError && pet.imageURL ? (
          <Image
            src={pet.imageURL}
            alt={pet.name}
            className="w-full h-full object-cover absolute inset-0"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[64px] absolute inset-0">
            🐦
          </div>
        )}
      </div>

      <div className="p-10 flex flex-col justify-center">
        <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#d9f99d] mb-3">
          Featured Spotlight
        </p>
        <h2 className="text-[clamp(24px,3vw,36px)] font-bold text-foreground tracking-[-0.02em] leading-[1.2] mb-4">
          {pet.name} the {pet.breed || pet.species}
        </h2>
        <p className="text-sm text-default-500 leading-[1.7] mb-6">
          {pet.description ||
            `${pet.name} is looking for a loving forever home. This wonderful ${pet.species.toLowerCase()} has so much love to give.`}
        </p>

        {pet.healthStatus && (
          <div className="flex gap-2.5 flex-wrap mb-7">
            <div className="flex items-center gap-1.5 py-1.5 px-3 bg-content2 border border-default-200 rounded-md text-xs text-default-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d9f99d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              {pet.healthStatus}
            </div>
            <div className="flex items-center gap-1.5 py-1.5 px-3 bg-content2 border border-default-200 rounded-md text-xs text-default-500">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d9f99d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {pet.gender || "Friendly"}
            </div>
          </div>
        )}

        <Button
          onPress={() => router.push(`/pets/${pet._id}`)}
          className="self-start bg-primary text-primary-foreground font-semibold"
        >
          Adopt {pet.name}
        </Button>
      </div>
    </Card>
  );
}