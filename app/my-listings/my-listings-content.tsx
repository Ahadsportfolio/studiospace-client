"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  Camera,
  ExternalLink,
  Eye,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Star,
  Trash2,
  UserCheck,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Studio, StudioCategory } from "@/types/studio";
import { DeleteStudioModal } from "./delete-studio-modal";

const CANONICAL_CATEGORIES: { label: string; value: StudioCategory | "" }[] = [
  { label: "All Categories", value: "" },
  { label: "Photo Studio", value: "Photo Studio" },
  { label: "Film Stage", value: "Film Stage" },
  { label: "Podcast Lounge", value: "Podcast Lounge" },
  { label: "Music Suite", value: "Music Suite" },
  { label: "Workshop", value: "Workshop" },
];

const FALLBACK_STUDIO_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";

function getCategoryBadgeClass(category: StudioCategory): string {
  switch (category) {
    case "Photo Studio":
      return "badge-primary bg-primary/10 text-primary border-primary/20";
    case "Film Stage":
      return "badge-secondary bg-secondary/10 text-secondary border-secondary/20";
    case "Podcast Lounge":
      return "badge-accent bg-accent/10 text-accent border-accent/20";
    case "Music Suite":
      return "badge-info bg-info/10 text-info border-info/20";
    case "Workshop":
      return "badge-warning bg-warning/10 text-warning border-warning/20";
    default:
      return "badge-primary";
  }
}

interface StudioImageThumbnailProps {
  src: string;
  alt: string;
}

function StudioImageThumbnail({ src, alt }: StudioImageThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = hasError || !src ? FALLBACK_STUDIO_IMAGE : src;
  const isRemoteOptimized =
    imageSrc.includes("images.unsplash.com") ||
    imageSrc.includes("i.ibb.co");

  return (
    <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-300">
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes="80px"
        className="object-cover"
        unoptimized={!isRemoteOptimized}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

interface MobileStudioCardProps {
  studio: Studio;
  onEditUrl: string;
  onDeleteRequest: (studio: Studio) => void;
}

function MobileStudioCard({
  studio,
  onEditUrl,
  onDeleteRequest,
}: MobileStudioCardProps) {
  const [hasError, setHasError] = useState(false);
  const imageSrc = hasError || !studio.image ? FALLBACK_STUDIO_IMAGE : studio.image;
  const isRemoteOptimized =
    imageSrc.includes("images.unsplash.com") ||
    imageSrc.includes("i.ibb.co");

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md">
      {/* Studio Image Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-base-300">
        <Image
          src={imageSrc}
          alt={studio.title}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover"
          unoptimized={!isRemoteOptimized}
          onError={() => setHasError(true)}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"
        />

        {/* Category Pill */}
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {studio.category}
        </span>

        {/* Price Pill */}
        <span className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-3 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
          ${studio.hourlyRate}
          <span className="text-[11px] font-normal text-white/80">/hr</span>
        </span>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/studios/${studio._id}`}
          className="group block"
        >
          <h3 className="font-serif text-lg font-medium tracking-tight text-base-content group-hover:text-primary transition-colors line-clamp-1">
            {studio.title}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-base-content/70">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
          <span className="truncate">{studio.location}</span>
        </div>

        {/* Specs Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-base-200/50 p-2.5 text-xs text-base-content/80">
          <div className="flex flex-col items-center justify-center text-center">
            <span className="flex items-center gap-1 text-[11px] font-medium text-base-content/60">
              <Users className="h-3 w-3 text-primary" /> Capacity
            </span>
            <span className="mt-0.5 font-semibold text-base-content">
              {studio.maxCapacity} ppl
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center border-x border-base-300">
            <span className="flex items-center gap-1 text-[11px] font-medium text-base-content/60">
              <Shield className="h-3 w-3 text-primary" /> Deposit
            </span>
            <span className="mt-0.5 font-semibold text-base-content">
              {studio.securityDeposit ? `$${studio.securityDeposit}` : "$0"}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <span className="flex items-center gap-1 text-[11px] font-medium text-base-content/60">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" /> Rating
            </span>
            <span className="mt-0.5 font-semibold text-base-content">
              {studio.rating ? Number(studio.rating).toFixed(1) : "New"}
            </span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-auto pt-4 border-t border-base-200 flex items-center justify-between gap-2">
          <Link
            href={`/studios/${studio._id}`}
            className="btn btn-sm btn-ghost rounded-xl gap-1.5 text-xs"
            title="View public details"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={onEditUrl}
              className="btn btn-sm btn-outline btn-primary rounded-xl gap-1.5 text-xs"
              title="Update studio information"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Update</span>
            </Link>

            <button
              type="button"
              onClick={() => onDeleteRequest(studio)}
              className="btn btn-sm btn-outline btn-error rounded-xl gap-1.5 text-xs"
              title="Delete studio"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function MyListingsContent() {
  const { user } = useAuth();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Category filters for easy host management
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<StudioCategory | "">("");

  // Deletion modal state
  const [deletingStudio, setDeletingStudio] = useState<Studio | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch host's own studios (safe for effects and manual reload)
  const refreshStudios = useCallback(() => {
    setIsLoading(true);
    setError(null);
    apiFetch<Studio[]>("/api/studios/mine")
      .then((data) => {
        setStudios(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        const message =
          err instanceof ApiError
            ? err.message
            : "Unable to load your studio listings. Please check your connection.";
        setError(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    apiFetch<Studio[]>("/api/studios/mine")
      .then((data) => {
        if (isMounted) {
          setStudios(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const message =
            err instanceof ApiError
              ? err.message
              : "Unable to load your studio listings. Please check your connection.";
          setError(message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Execute deletion when user confirms in modal
  const handleConfirmDelete = async () => {
    if (!deletingStudio) return;

    setIsDeleting(true);
    try {
      await apiFetch<{ message: string; id: string }>(
        `/api/studios/${deletingStudio._id}`,
        {
          method: "DELETE",
        }
      );

      // Toast notification for delete success
      toast.success(
        `"${deletingStudio.title}" has been deleted from your listings.`
      );

      // Update state to remove deleted studio immediately
      setStudios((prev) => prev.filter((s) => s._id !== deletingStudio._id));
      setDeletingStudio(null);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Failed to delete the studio listing. Please try again.";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered studios list based on search and category
  const filteredStudios = useMemo(() => {
    return studios.filter((studio) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        studio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        studio.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "" || studio.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [studios, searchQuery, categoryFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Host Management</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
            My Studio Listings
          </h1>
          <p className="mt-2 text-sm text-base-content/70 sm:text-base max-w-2xl">
            Review, update, and manage creative production spaces listed under your account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/add-studio"
            className="btn btn-primary rounded-xl gap-2 shadow-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Studio</span>
          </Link>
        </div>
      </div>

      {/* Host Summary & Identity Banner */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-content font-bold text-lg shadow-sm">
              {user?.name ? user.name[0].toUpperCase() : "H"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-base font-medium text-base-content">
                  {user?.name || "Studio Host"}
                </span>
                <span className="badge badge-sm badge-success gap-1 font-medium">
                  <UserCheck className="h-3 w-3" /> Verified Host
                </span>
              </div>
              <p className="text-xs text-base-content/65">
                Owner email: <span className="font-mono">{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-base-300 bg-base-100 px-4 py-2 text-center">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-base-content/60 block">
                Total Studios
              </span>
              <span className="text-lg font-serif font-bold text-primary">
                {studios.length}
              </span>
            </div>

            <Link
              href="/dashboard"
              className="btn btn-sm btn-ghost rounded-xl border border-base-300 text-xs"
            >
              Host Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div
          role="alert"
          className="mb-8 rounded-2xl border border-error/30 bg-error/10 p-5 text-error flex items-start justify-between gap-4 animate-in fade-in"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm">Failed to Load Studios</h3>
              <p className="mt-1 text-xs text-error/90 leading-relaxed">
                {error}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={refreshStudios}
            className="btn btn-sm btn-error btn-outline rounded-xl shrink-0 gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Try Again
          </button>
        </div>
      )}

      {/* Search and Filters Bar (Shown only if user has studios) */}
      {!isLoading && studios.length > 0 && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search your studios by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered input-sm sm:input-md w-full pl-10 rounded-xl bg-base-100 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value as StudioCategory | "")
              }
              className="select select-bordered select-sm sm:select-md rounded-xl bg-base-100 text-xs sm:text-sm"
              aria-label="Filter by studio category"
            >
              {CANONICAL_CATEGORIES.map((cat) => (
                <option key={cat.label} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={refreshStudios}
              className="btn btn-sm sm:btn-md btn-ghost rounded-xl border border-base-300"
              title="Refresh listings"
              aria-label="Refresh listings"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="space-y-4">
          {/* Desktop Table Skeleton */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm p-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b border-base-200 last:border-b-0 animate-pulse"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-20 rounded-xl bg-base-300" />
                    <div className="space-y-2">
                      <div className="h-4 w-48 rounded-md bg-base-300" />
                      <div className="h-3 w-32 rounded-md bg-base-200" />
                    </div>
                  </div>
                  <div className="h-6 w-24 rounded-full bg-base-200" />
                  <div className="h-4 w-16 rounded-md bg-base-300" />
                  <div className="h-4 w-16 rounded-md bg-base-300" />
                  <div className="flex gap-2">
                    <div className="h-8 w-16 rounded-xl bg-base-200" />
                    <div className="h-8 w-16 rounded-xl bg-base-200" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-base-300 bg-base-100 p-4 space-y-3 animate-pulse"
              >
                <div className="aspect-[16/10] w-full rounded-xl bg-base-300" />
                <div className="h-5 w-3/4 rounded-md bg-base-300" />
                <div className="h-3 w-1/2 rounded-md bg-base-200" />
                <div className="h-10 w-full rounded-xl bg-base-200" />
                <div className="flex justify-end gap-2 pt-2">
                  <div className="h-8 w-16 rounded-xl bg-base-200" />
                  <div className="h-8 w-16 rounded-xl bg-base-200" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State when host has zero studios */}
      {!isLoading && !error && studios.length === 0 && (
        <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 sm:p-14 text-center shadow-xs">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Camera className="h-8 w-8" />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-medium tracking-tight text-base-content sm:text-3xl">
            No Studio Listings Yet
          </h2>
          <p className="mx-auto mt-2.5 max-w-lg text-sm sm:text-base text-base-content/70 leading-relaxed">
            You haven&apos;t listed any creative workspaces yet. From high-ceiling photo cycloramas and film stages to intimate podcast lounges and music suites, publish your workspace to start accepting reservations from creators.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/add-studio"
              className="btn btn-primary rounded-xl gap-2 shadow-sm font-medium"
            >
              <Plus className="h-4 w-4" /> Add New Studio
            </Link>
            <Link
              href="/studios"
              className="btn btn-ghost rounded-xl border border-base-300 text-sm"
            >
              Explore Studio Catalog
            </Link>
          </div>
        </div>
      )}

      {/* No matching filter results */}
      {!isLoading && !error && studios.length > 0 && filteredStudios.length === 0 && (
        <div className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-base-200 text-base-content/60">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-3 font-serif text-lg font-medium text-base-content">
            No matching studios found
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-base-content/60">
            No studios match your filter criteria &ldquo;{searchQuery || categoryFilter}&rdquo;.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setCategoryFilter("");
            }}
            className="mt-4 btn btn-sm btn-outline rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Active Listings Display */}
      {!isLoading && !error && filteredStudios.length > 0 && (
        <div className="space-y-6">
          {/* Desktop Table View (visible on md and up) */}
          <div className="hidden md:block overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-base-200 bg-base-200/50 text-xs uppercase tracking-wider text-base-content/70">
                  <th className="py-4 pl-6 font-semibold">Studio Workspace</th>
                  <th className="py-4 font-semibold">Category</th>
                  <th className="py-4 font-semibold">Rate & Deposit</th>
                  <th className="py-4 font-semibold">Capacity</th>
                  <th className="py-4 font-semibold">Rating</th>
                  <th className="py-4 pr-6 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200 text-sm">
                {filteredStudios.map((studio) => (
                  <tr
                    key={studio._id}
                    className="hover:bg-base-200/40 transition-colors"
                  >
                    {/* Studio Image + Title + Location */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-3.5">
                        <StudioImageThumbnail
                          src={studio.image}
                          alt={studio.title}
                        />
                        <div className="min-w-0 max-w-xs lg:max-w-sm">
                          <Link
                            href={`/studios/${studio._id}`}
                            className="font-serif font-medium text-base-content hover:text-primary transition-colors block truncate"
                            title={studio.title}
                          >
                            {studio.title}
                          </Link>
                          <div className="mt-1 flex items-center gap-1 text-xs text-base-content/65 truncate">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                            <span className="truncate">{studio.location}</span>
                            {studio.city && (
                              <span className="shrink-0 text-base-content/50">
                                ({studio.city})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4">
                      <span
                        className={`badge badge-sm font-semibold py-2.5 px-3 border ${getCategoryBadgeClass(
                          studio.category
                        )}`}
                      >
                        {studio.category}
                      </span>
                    </td>

                    {/* Rate & Deposit */}
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-base-content">
                          ${studio.hourlyRate}
                          <span className="text-xs font-normal text-base-content/60">
                            {" "}/ hr
                          </span>
                        </span>
                        <span className="text-xs text-base-content/60">
                          {studio.securityDeposit
                            ? `+$${studio.securityDeposit} deposit`
                            : "Zero deposit"}
                        </span>
                      </div>
                    </td>

                    {/* Capacity */}
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-base-content font-medium">
                        <Users className="h-3.5 w-3.5 text-primary" />
                        {studio.maxCapacity} creators
                      </span>
                    </td>

                    {/* Rating & Reviews */}
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-semibold text-xs text-base-content">
                          {studio.rating ? Number(studio.rating).toFixed(1) : "New"}
                        </span>
                        <span className="text-[11px] text-base-content/60">
                          ({studio.reviewCount || 0})
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/studios/${studio._id}`}
                          className="btn btn-sm btn-ghost rounded-xl p-2 text-base-content/70 hover:text-base-content"
                          title="View live studio page"
                          aria-label={`View ${studio.title}`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/studios/edit/${studio._id}`}
                          className="btn btn-sm btn-outline btn-primary rounded-xl gap-1.5"
                          title="Update studio information"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Update</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeletingStudio(studio)}
                          className="btn btn-sm btn-outline btn-error rounded-xl gap-1.5"
                          title="Delete studio listing"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards View (visible on < md) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
            {filteredStudios.map((studio) => (
              <MobileStudioCard
                key={studio._id}
                studio={studio}
                onEditUrl={`/studios/edit/${studio._id}`}
                onDeleteRequest={(target) => setDeletingStudio(target)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (NO native alert/confirm) */}
      <DeleteStudioModal
        isOpen={deletingStudio !== null}
        studio={deletingStudio}
        isDeleting={isDeleting}
        onClose={() => {
          if (!isDeleting) {
            setDeletingStudio(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
