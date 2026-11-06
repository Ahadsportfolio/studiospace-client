"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowUpDown,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Filter,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { StudioCard } from "@/components/studio-card";
import { StudioCardSkeleton } from "@/components/studio-card-skeleton";
import type { Studio, StudioCategory, StudiosApiResponse } from "@/types/studio";

const CANONICAL_CATEGORIES: { label: string; value: StudioCategory | "" }[] = [
  { label: "All Spaces", value: "" },
  { label: "Photo Studio", value: "Photo Studio" },
  { label: "Film Stage", value: "Film Stage" },
  { label: "Podcast Lounge", value: "Podcast Lounge" },
  { label: "Music Suite", value: "Music Suite" },
  { label: "Workshop", value: "Workshop" },
];

const SORT_OPTIONS: { label: string; value: string }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
];

const PRICE_PRESETS: { label: string; min: string; max: string }[] = [
  { label: "All Rates", min: "", max: "" },
  { label: "Under $60", min: "", max: "60" },
  { label: "$60 – $100", min: "60", max: "100" },
  { label: "$100 – $200", min: "100", max: "200" },
  { label: "$200+", min: "200", max: "" },
];

export function ExploreStudiosContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const studiosGridRef = useRef<HTMLDivElement>(null);

  // Read URL query params
  const categoryParam = searchParams.get("category") || "";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "newest";

  // Price handling: support minPrice/maxPrice as well as price (e.g. price=50-100 or price=75)
  let initialMinPrice = searchParams.get("minPrice") || "";
  let initialMaxPrice = searchParams.get("maxPrice") || "";
  const rawPrice = searchParams.get("price") || "";
  if (!initialMinPrice && !initialMaxPrice && rawPrice) {
    if (rawPrice.includes("-")) {
      const [pMin, pMax] = rawPrice.split("-");
      initialMinPrice = pMin.trim();
      initialMaxPrice = pMax.trim();
    } else if (!isNaN(Number(rawPrice))) {
      initialMaxPrice = rawPrice.trim();
    }
  }

  const pageParam = Math.max(
    1,
    parseInt(searchParams.get("page") || "1", 10) || 1
  );

  // Local inputs state
  const [searchInput, setSearchInput] = useState(searchParam);
  const [prevSearchParam, setPrevSearchParam] = useState(searchParam);
  if (prevSearchParam !== searchParam) {
    setPrevSearchParam(searchParam);
    setSearchInput(searchParam);
  }

  const [minPriceInput, setMinPriceInput] = useState(initialMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(initialMaxPrice);
  const [prevMinPrice, setPrevMinPrice] = useState(initialMinPrice);
  const [prevMaxPrice, setPrevMaxPrice] = useState(initialMaxPrice);
  if (
    prevMinPrice !== initialMinPrice ||
    prevMaxPrice !== initialMaxPrice
  ) {
    setPrevMinPrice(initialMinPrice);
    setPrevMaxPrice(initialMaxPrice);
    setMinPriceInput(initialMinPrice);
    setMaxPriceInput(initialMaxPrice);
  }

  const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);

  // Data fetching state
  const [studios, setStudios] = useState<Studio[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL query updater helper
  const updateFilters = useCallback(
    (newFilters: {
      category?: string | null;
      search?: string | null;
      sort?: string | null;
      minPrice?: string | null;
      maxPrice?: string | null;
      page?: number | null;
    }) => {
      setLoading(true);
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // If changing filters (other than page), reset page to 1
      if (!("page" in newFilters)) {
        params.delete("page");
      }

      // Clean up legacy 'price' param if minPrice or maxPrice are manipulated
      if ("minPrice" in newFilters || "maxPrice" in newFilters) {
        params.delete("price");
      }

      const queryString = params.toString();
      startTransition(() => {
        router.push(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    },
    [searchParams, pathname, router]
  );

  // Debounced search input sync
  useEffect(() => {
    if (searchInput.trim() === searchParam.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      updateFilters({ search: searchInput.trim() || null });
    }, 450);

    return () => clearTimeout(timer);
  }, [searchInput, searchParam, updateFilters]);

  // Fetch studios when URL params change
  useEffect(() => {
    let active = true;

    const queryParams = new URLSearchParams();
    queryParams.set("limit", "12");
    queryParams.set("page", String(pageParam));

    if (searchParam.trim()) {
      queryParams.set("search", searchParam.trim());
    }
    if (categoryParam.trim()) {
      queryParams.set("category", categoryParam.trim());
    }
    if (initialMinPrice.trim()) {
      queryParams.set("minPrice", initialMinPrice.trim());
    }
    if (initialMaxPrice.trim()) {
      queryParams.set("maxPrice", initialMaxPrice.trim());
    }
    if (sortParam.trim()) {
      queryParams.set("sort", sortParam.trim());
    }

    apiFetch<StudiosApiResponse>(`/api/studios?${queryParams.toString()}`)
      .then((res) => {
        if (!active) return;
        if (!res || !Array.isArray(res.data)) {
          throw new Error("Invalid response received from the studios service.");
        }
        setStudios(res.data);
        setTotal(res.total || 0);
        setTotalPages(Math.max(1, res.totalPages || 1));
        setError(null);
      })
      .catch((err: unknown) => {
        if (!active) return;
        const msg =
          err instanceof Error
            ? err.message
            : "Could not load studios. Please try again.";
        setError(msg);
        setStudios([]);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    searchParam,
    categoryParam,
    initialMinPrice,
    initialMaxPrice,
    sortParam,
    pageParam,
  ]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() || null });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateFilters({ search: null });
  };

  const handleApplyCustomPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateFilters({
      minPrice: minPriceInput.trim() || null,
      maxPrice: maxPriceInput.trim() || null,
    });
    setIsPriceFilterOpen(false);
  };

  const handlePricePreset = (min: string, max: string) => {
    setMinPriceInput(min);
    setMaxPriceInput(max);
    updateFilters({
      minPrice: min || null,
      maxPrice: max || null,
    });
    setIsPriceFilterOpen(false);
  };

  const handleClearAllFilters = () => {
    setSearchInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setIsPriceFilterOpen(false);
    updateFilters({
      category: null,
      search: null,
      minPrice: null,
      maxPrice: null,
      sort: null,
      page: 1,
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === pageParam) return;
    updateFilters({ page: newPage });
    if (studiosGridRef.current) {
      studiosGridRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Determine active price preset label (if any)
  const activePreset = PRICE_PRESETS.find(
    (p) => p.min === initialMinPrice && p.max === initialMaxPrice
  );

  const hasActiveFilters = Boolean(
    searchParam ||
      categoryParam ||
      initialMinPrice ||
      initialMaxPrice ||
      (sortParam && sortParam !== "newest")
  );

  return (
    <div className="w-full bg-base-100 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Page Header */}
        <div className="flex flex-col gap-4 border-b border-base-300/70 pb-8 sm:pb-10">
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles size={13} aria-hidden="true" />
            <span>Discover Creative Workspaces</span>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl font-normal tracking-tight text-base-content sm:text-4xl lg:text-5xl">
                Explore Studios
              </h1>
              <p className="mt-2.5 text-base leading-relaxed text-base-content/75 sm:text-lg">
                Find and reserve high-caliber photo cycloramas, sound stages,
                podcast rooms, music suites, and fabrication workshops.
              </p>
            </div>

            <Link
              href="/add-studio"
              className="button-primary group shrink-0 !min-h-11 !px-5 text-sm font-semibold shadow-sm shadow-primary/20"
            >
              <Plus size={16} aria-hidden="true" />
              <span>Host a Studio</span>
            </Link>
          </div>
        </div>

        {/* Search & Filter Controls Section */}
        <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-base-300 bg-base-200/40 p-5 sm:p-6">
          {/* Top row: Search input & Sort dropdown */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex-1"
              role="search"
            >
              <label htmlFor="studio-search" className="sr-only">
                Search studios by name or location
              </label>
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-base-content/50">
                <Search size={18} aria-hidden="true" />
              </div>
              <input
                id="studio-search"
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title, location, city (e.g. Cyc Wall, Brooklyn, Denver)..."
                className="w-full rounded-full border border-base-300 bg-base-100 py-3.5 pl-11 pr-24 text-sm text-base-content placeholder:text-base-content/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <div className="absolute inset-y-0 right-1.5 flex items-center gap-1">
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    aria-label="Clear search input"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-base-content/60 transition-colors hover:bg-base-200 hover:text-base-content"
                  >
                    <X size={15} aria-hidden="true" />
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-content transition-colors hover:bg-primary/90"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <label
                htmlFor="studio-sort"
                className="flex items-center gap-1.5 text-xs font-medium text-base-content/70 whitespace-nowrap"
              >
                <ArrowUpDown size={14} aria-hidden="true" />
                <span>Sort by:</span>
              </label>
              <select
                id="studio-sort"
                value={sortParam}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="select select-sm select-bordered rounded-full border-base-300 bg-base-100 text-xs font-medium text-base-content focus:border-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Middle row: Category pills & Price Filter Toggle */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Pills */}
            <div
              className="flex flex-wrap items-center gap-2"
              role="radiogroup"
              aria-label="Filter by studio category"
            >
              {CANONICAL_CATEGORIES.map(({ label, value }) => {
                const isSelected = categoryParam === value;
                return (
                  <button
                    key={label}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => updateFilters({ category: value || null })}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-content shadow-sm shadow-primary/20"
                        : "border border-base-300 bg-base-100 text-base-content/80 hover:border-primary/40 hover:bg-base-200/70 hover:text-base-content"
                    }`}
                  >
                    {isSelected && <Check size={13} aria-hidden="true" />}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Price Filter Toggle Button */}
            <div className="relative self-start lg:self-auto">
              <button
                type="button"
                onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                  initialMinPrice || initialMaxPrice
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-base-300 bg-base-100 text-base-content hover:border-primary/40 hover:bg-base-200"
                }`}
                aria-expanded={isPriceFilterOpen}
                aria-haspopup="dialog"
              >
                <DollarSign size={14} aria-hidden="true" />
                <span>
                  {activePreset && activePreset.label !== "All Rates"
                    ? `Rate: ${activePreset.label}`
                    : initialMinPrice || initialMaxPrice
                    ? `Rate: $${initialMinPrice || "0"} – $${initialMaxPrice || "any"}/hr`
                    : "Price Range"}
                </span>
                <Filter size={12} aria-hidden="true" />
              </button>

              {/* Price Filter Dropdown / Popover */}
              {isPriceFilterOpen && (
                <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:w-80">
                  <div className="flex items-center justify-between border-b border-base-300/70 pb-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-base-content">
                      Hourly Rate ($ / hr)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsPriceFilterOpen(false)}
                      className="text-base-content/60 hover:text-base-content"
                      aria-label="Close price filter"
                    >
                      <X size={14} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Quick presets */}
                  <div className="mt-3">
                    <span className="text-[11px] font-medium text-base-content/60">
                      Quick Presets
                    </span>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {PRICE_PRESETS.map((preset) => {
                        const isPresetSelected =
                          preset.min === initialMinPrice &&
                          preset.max === initialMaxPrice;
                        return (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() =>
                              handlePricePreset(preset.min, preset.max)
                            }
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                              isPresetSelected
                                ? "bg-primary text-primary-content"
                                : "border border-base-300 bg-base-200/60 text-base-content hover:border-primary/40"
                            }`}
                          >
                            {preset.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Min / Max inputs */}
                  <form
                    onSubmit={handleApplyCustomPrice}
                    className="mt-4 border-t border-base-300/70 pt-3"
                  >
                    <span className="text-[11px] font-medium text-base-content/60">
                      Custom Range
                    </span>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-base-content/50">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          placeholder="Min"
                          value={minPriceInput}
                          onChange={(e) => setMinPriceInput(e.target.value)}
                          className="w-full rounded-lg border border-base-300 bg-base-100 py-1.5 pl-6 pr-2 text-xs text-base-content focus:border-primary focus:outline-none"
                        />
                      </div>
                      <span className="text-xs text-base-content/50">–</span>
                      <div className="relative flex-1">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-xs text-base-content/50">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="5"
                          placeholder="Max"
                          value={maxPriceInput}
                          onChange={(e) => setMaxPriceInput(e.target.value)}
                          className="w-full rounded-lg border border-base-300 bg-base-100 py-1.5 pl-6 pr-2 text-xs text-base-content focus:border-primary focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setMinPriceInput("");
                          setMaxPriceInput("");
                          updateFilters({ minPrice: null, maxPrice: null });
                          setIsPriceFilterOpen(false);
                        }}
                        className="rounded-full px-3 py-1 text-[11px] font-medium text-base-content/70 hover:bg-base-200"
                      >
                        Reset
                      </button>
                      <button
                        type="submit"
                        className="rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-content hover:bg-primary/90"
                      >
                        Apply
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Summary Bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300/70 pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-base-content/70">
                  Active Filters:
                </span>

                {searchParam && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs text-base-content">
                    <span>Search: &ldquo;{searchParam}&rdquo;</span>
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="text-base-content/50 hover:text-base-content"
                      aria-label="Remove search filter"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </span>
                )}

                {categoryParam && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs text-base-content">
                    <span>Category: {categoryParam}</span>
                    <button
                      type="button"
                      onClick={() => updateFilters({ category: null })}
                      className="text-base-content/50 hover:text-base-content"
                      aria-label="Remove category filter"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </span>
                )}

                {(initialMinPrice || initialMaxPrice) && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs text-base-content">
                    <span>
                      Rate: ${initialMinPrice || "0"} – $
                      {initialMaxPrice || "any"} / hr
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setMinPriceInput("");
                        setMaxPriceInput("");
                        updateFilters({ minPrice: null, maxPrice: null });
                      }}
                      className="text-base-content/50 hover:text-base-content"
                      aria-label="Remove price filter"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </span>
                )}

                {sortParam && sortParam !== "newest" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-base-300 bg-base-100 px-3 py-1 text-xs text-base-content">
                    <span>
                      Sort:{" "}
                      {SORT_OPTIONS.find((o) => o.value === sortParam)?.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateFilters({ sort: null })}
                      className="text-base-content/50 hover:text-base-content"
                      aria-label="Reset sort order"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleClearAllFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:underline"
              >
                <RotateCcw size={12} aria-hidden="true" />
                <span>Clear all filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Results Count Header */}
        <div
          ref={studiosGridRef}
          className="mt-8 flex items-center justify-between text-xs text-base-content/70 sm:text-sm"
        >
          <span>
            {loading
              ? "Scanning studio spaces..."
              : total === 0
              ? "No spaces found"
              : `Showing ${studios.length} of ${total} creative ${
                  total === 1 ? "space" : "spaces"
                }`}
          </span>
          {totalPages > 1 && (
            <span>
              Page {pageParam} of {totalPages}
            </span>
          )}
        </div>

        {/* Studios Grid / Skeletons / Empty State / Error */}
        <div
          aria-busy={loading}
          aria-label={loading ? "Loading studios" : undefined}
          className="mt-6"
        >
          {loading ? (
            /* Skeleton Loading Grid */
            <div
              aria-hidden="true"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <StudioCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            /* Error State */
            <div
              role="alert"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-error/40 bg-error/5 p-12 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                <RefreshCw size={24} aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-2xl font-normal text-base-content">
                Unable to load studios
              </h3>
              <p className="mt-2 max-w-md text-sm text-base-content/70">
                {error}
              </p>
              <button
                type="button"
                onClick={() => {
                  setLoading(true);
                  updateFilters({ page: pageParam });
                }}
                className="button-primary mt-6 !min-h-10 !px-5 text-xs font-semibold"
              >
                <span>Try again</span>
              </button>
            </div>
          ) : studios.length === 0 ? (
            /* Friendly Empty State with CTA ("Clear filters" / "Host a studio") */
            <div
              role="status"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200/50 px-6 py-16 text-center sm:py-20"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Building2 size={32} aria-hidden="true" />
              </div>
              <h2 className="mt-5 font-display text-2xl font-normal text-base-content sm:text-3xl">
                No studios match your search
              </h2>
              <p className="mt-2.5 max-w-md text-sm leading-relaxed text-base-content/70 sm:text-base">
                We couldn&apos;t find any creative workspaces matching your
                current criteria. Try clearing your filters or adjusting your
                search terms to find available spaces.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="button-primary !min-h-11 !px-6 text-sm font-semibold shadow-sm shadow-primary/20"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                  <span>Clear filters</span>
                </button>

                <Link
                  href="/add-studio"
                  className="button-secondary !min-h-11 !px-6 text-sm font-semibold"
                >
                  <Plus size={15} aria-hidden="true" />
                  <span>Host a studio</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Studios Grid */
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
              {studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <nav
            aria-label="Studios pagination"
            className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-base-300/70 pt-8 sm:flex-row"
          >
            <div className="text-xs text-base-content/65 sm:text-sm">
              Page <span className="font-semibold">{pageParam}</span> of{" "}
              <span className="font-semibold">{totalPages}</span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Previous button */}
              <button
                type="button"
                onClick={() => handlePageChange(pageParam - 1)}
                disabled={pageParam <= 1}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-base-300 bg-base-100 px-3.5 text-xs font-semibold text-base-content transition-colors hover:border-primary/40 hover:bg-base-200 disabled:pointer-events-none disabled:opacity-40"
                aria-label="Go to previous page"
              >
                <ChevronLeft size={14} aria-hidden="true" />
                <span>Previous</span>
              </button>

              {/* Page Number Buttons */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    // Show first, last, current, and neighbours
                    if (totalPages <= 7) return true;
                    if (p === 1 || p === totalPages) return true;
                    if (Math.abs(p - pageParam) <= 1) return true;
                    return false;
                  })
                  .reduce<(number | string)[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1) {
                      acc.push(`ellipsis-${p}`);
                    }
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item) => {
                    if (typeof item === "string") {
                      return (
                        <span
                          key={item}
                          className="px-1 text-xs text-base-content/40"
                          aria-hidden="true"
                        >
                          &hellip;
                        </span>
                      );
                    }

                    const isCurrent = item === pageParam;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handlePageChange(item)}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                          isCurrent
                            ? "bg-primary text-primary-content shadow-sm shadow-primary/20"
                            : "border border-base-300 bg-base-100 text-base-content hover:border-primary/40 hover:bg-base-200"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
              </div>

              {/* Next button */}
              <button
                type="button"
                onClick={() => handlePageChange(pageParam + 1)}
                disabled={pageParam >= totalPages}
                className="inline-flex h-9 items-center gap-1 rounded-full border border-base-300 bg-base-100 px-3.5 text-xs font-semibold text-base-content transition-colors hover:border-primary/40 hover:bg-base-200 disabled:pointer-events-none disabled:opacity-40"
                aria-label="Go to next page"
              >
                <span>Next</span>
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
