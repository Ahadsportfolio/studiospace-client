"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CalendarX2,
  CheckCheck,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Loader2,
  Mail,
  MessageSquare,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Booking, BookingStatus } from "@/types/booking";
import { generateBookingInvoice } from "@/lib/invoice-generator";
import { CancelBookingModal } from "./cancel-booking-modal";

const FALLBACK_STUDIO_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";

type FilterTab = "ALL" | BookingStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All Bookings", value: "ALL" },
  { label: "Pending", value: "Pending" },
  { label: "Confirmed", value: "Confirmed" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
    if (y && m && d) {
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const displayMin = m < 10 ? `0${m}` : `${m}`;
  return `${displayHour}:${displayMin} ${period}`;
}

interface StatusBadgeConfig {
  label: string;
  badgeClass: string;
  icon: typeof Clock;
  description: string;
}

function getStatusBadgeConfig(status: BookingStatus): StatusBadgeConfig {
  switch (status) {
    case "Pending":
      return {
        label: "Pending",
        badgeClass:
          "border border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold",
        icon: Clock,
        description: "Awaiting host confirmation",
      };
    case "Confirmed":
      return {
        label: "Confirmed",
        badgeClass:
          "border border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold",
        icon: CheckCircle2,
        description: "Confirmed by studio host",
      };
    case "Completed":
      return {
        label: "Completed",
        badgeClass:
          "border border-sky-500/40 bg-sky-500/15 text-sky-700 dark:text-sky-300 font-semibold",
        icon: CheckCheck,
        description: "Production session completed",
      };
    case "Cancelled":
      return {
        label: "Cancelled",
        badgeClass:
          "border border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold",
        icon: XCircle,
        description: "Reservation cancelled",
      };
    default:
      return {
        label: status,
        badgeClass: "border border-base-300 bg-base-200 text-base-content/80",
        icon: Clock,
        description: "",
      };
  }
}

interface BookingCardProps {
  booking: Booking;
  onCancelRequest: (booking: Booking) => void;
}

function BookingCard({ booking, onCancelRequest }: BookingCardProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const [isDownloadingInvoice, setIsDownloadingInvoice] = useState(false);
  const statusConfig = getStatusBadgeConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  const handleDownloadInvoice = async () => {
    setIsDownloadingInvoice(true);
    try {
      generateBookingInvoice(booking);
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      console.error("Failed to generate PDF invoice:", err);
      toast.error("Failed to generate PDF invoice. Please try again.");
    } finally {
      setIsDownloadingInvoice(false);
    }
  };

  const imageSrc =
    hasImageError || !booking.studioImage
      ? FALLBACK_STUDIO_IMAGE
      : booking.studioImage;

  const isRemoteOptimized =
    imageSrc.includes("images.unsplash.com") ||
    imageSrc.includes("i.ibb.co");

  const hourlyEquivalent =
    booking.hours > 0
      ? Math.round((booking.totalPrice - booking.securityDeposit) / booking.hours)
      : 0;

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all duration-200 rounded-3xl overflow-hidden flex flex-col md:flex-row">
      {/* Studio Image & Visual Area */}
      <div className="relative h-52 md:h-auto md:w-72 shrink-0 overflow-hidden bg-base-300">
        <Image
          src={imageSrc}
          alt={booking.studioTitle}
          fill
          sizes="(max-width: 768px) 100vw, 288px"
          className="object-cover transition-transform duration-300 hover:scale-105"
          unoptimized={!isRemoteOptimized}
          onError={() => setHasImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />

        {/* Status Badge overlay on mobile */}
        <div className="absolute top-3.5 left-3.5 md:hidden">
          <span
            className={`badge gap-1.5 py-1 px-3 text-xs shadow-sm ${statusConfig.badgeClass}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {statusConfig.label}
          </span>
        </div>

        {/* Studio duration pill on image */}
        <div className="absolute bottom-3 left-3.5 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1 text-xs font-medium text-white flex items-center gap-1.5 shadow-sm">
          <Clock className="h-3 w-3 text-primary" />
          <span>
            {booking.hours} {booking.hours === 1 ? "hour" : "hours"} session
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between gap-5">
        <div>
          {/* Header Row: Title & Desktop Status Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-medium text-base-content/50 uppercase">
                  Ref: #{booking._id.slice(-6).toUpperCase()}
                </span>
                <span className="text-base-content/30">•</span>
                <span className="text-[11px] text-base-content/60">
                  Booked {formatDisplayDate(booking.createdAt)}
                </span>
              </div>
              <h2 className="mt-1 font-serif text-xl sm:text-2xl font-medium tracking-tight text-base-content hover:text-primary transition-colors">
                <Link href={`/studios/${booking.studioId}`}>
                  {booking.studioTitle}
                </Link>
              </h2>
            </div>

            {/* Desktop Status Badge */}
            <div className="hidden md:flex flex-col items-end shrink-0">
              <span
                className={`badge gap-1.5 py-1 px-3 text-xs shadow-xs ${statusConfig.badgeClass}`}
              >
                <StatusIcon className="h-3.5 w-3.5" />
                {statusConfig.label}
              </span>
              <span className="mt-1 text-[11px] text-base-content/55">
                {statusConfig.description}
              </span>
            </div>
          </div>

          {/* Schedule & Timing Grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-2xl border border-base-200 bg-base-200/40 p-3.5 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-base-content/60 uppercase tracking-wide">
                  Reserved Date
                </p>
                <p className="font-semibold text-base-content">
                  {formatDisplayDate(booking.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[11px] font-medium text-base-content/60 uppercase tracking-wide">
                  Time Slot
                </p>
                <p className="font-semibold text-base-content">
                  {formatTimeDisplay(booking.startTime)} –{" "}
                  {formatTimeDisplay(booking.endTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing & Host Contact Info */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-base-200 pt-4">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl font-semibold text-base-content">
                ${booking.totalPrice}
              </span>
              <span className="text-xs text-base-content/60">
                total ({booking.hours}h {hourlyEquivalent > 0 ? `@ $${hourlyEquivalent}/hr` : ""}
                {booking.securityDeposit > 0 ? ` + $${booking.securityDeposit} deposit` : ""})
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-base-content/70">
              <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
              <span className="font-medium">Host:</span>
              <span className="truncate max-w-[200px]" title={booking.hostEmail}>
                {booking.hostEmail}
              </span>
            </div>
          </div>

          {/* Creator Notes (if any) */}
          {booking.notes && booking.notes.trim() && (
            <div className="mt-3.5 flex items-start gap-2 rounded-xl bg-base-200/50 p-3 text-xs text-base-content/80">
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
              <div className="min-w-0">
                <span className="font-semibold text-base-content">
                  Shoot Notes:
                </span>{" "}
                <span className="italic">{booking.notes}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-200 pt-4 mt-2">
          {/* Status Message */}
          <div className="text-xs text-base-content/65">
            {booking.status === "Pending" && (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium">
                <Clock className="h-3.5 w-3.5" />
                Awaiting host acceptance. You can cancel free of charge.
              </span>
            )}
            {booking.status === "Confirmed" && (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Session confirmed! Please arrive 10 minutes prior to call time.
              </span>
            )}
            {booking.status === "Completed" && (
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400 font-medium">
                <CheckCheck className="h-3.5 w-3.5" />
                Production finished. Thank you for booking with StudioSpace!
              </span>
            )}
            {booking.status === "Cancelled" && (
              <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
                <XCircle className="h-3.5 w-3.5" />
                This reservation has been cancelled and the slot released.
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href={`/studios/${booking.studioId}`}
              className="btn btn-ghost btn-sm rounded-xl gap-1 text-xs font-medium hover:bg-base-200"
            >
              <span>View Studio</span>
              <ExternalLink className="h-3 w-3" />
            </Link>

            {/* Download Invoice for Confirmed (and Completed) bookings */}
            {(booking.status === "Confirmed" || booking.status === "Completed") && (
              <button
                type="button"
                onClick={handleDownloadInvoice}
                disabled={isDownloadingInvoice}
                className="btn btn-outline btn-primary btn-sm rounded-xl gap-1.5 text-xs font-medium hover:text-white transition-colors cursor-pointer"
                title="Download StudioSpace PDF Invoice"
              >
                {isDownloadingInvoice ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Download className="h-3.5 w-3.5" />
                )}
                <span>Download Invoice</span>
              </button>
            )}

            {/* Cancel Booking only for Pending status */}
            {booking.status === "Pending" && (
              <button
                type="button"
                onClick={() => onCancelRequest(booking)}
                className="btn btn-outline btn-error btn-sm rounded-xl gap-1.5 text-xs font-medium hover:text-white transition-colors cursor-pointer"
              >
                <XCircle className="h-3.5 w-3.5" />
                <span>Cancel Booking</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingsSkeletonList() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((key) => (
        <div
          key={key}
          className="card bg-base-100 border border-base-300 rounded-3xl overflow-hidden shadow-xs animate-pulse flex flex-col md:flex-row"
        >
          <div className="h-52 md:h-auto md:w-72 bg-base-300 shrink-0" />
          <div className="flex-1 space-y-4 p-5 sm:p-6">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <div className="h-3 w-28 bg-base-300 rounded-md" />
                <div className="h-6 w-3/4 bg-base-300 rounded-lg" />
              </div>
              <div className="h-7 w-24 bg-base-300 rounded-full" />
            </div>
            <div className="h-14 w-full bg-base-200 rounded-xl" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-32 bg-base-300 rounded-md" />
              <div className="h-8 w-28 bg-base-300 rounded-xl" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MyBookingsContent() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & search
  const [statusFilter, setStatusFilter] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Cancel modal state
  const [selectedBookingForCancel, setSelectedBookingForCancel] =
    useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Initial load via effect
  useEffect(() => {
    let isMounted = true;
    apiFetch<Booking[]>("api/bookings/my")
      .then((data) => {
        if (isMounted) {
          setBookings(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const message =
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Failed to load studio bookings.";
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

  // Manual refresh callback
  const refreshBookings = useCallback(() => {
    setIsLoading(true);
    setError(null);
    apiFetch<Booking[]>("api/bookings/my")
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to load studio bookings.";
        setError(message);
        toast.error(message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Handle Cancel Booking confirmation
  const handleConfirmCancel = async () => {
    if (!selectedBookingForCancel) return;

    setIsCancelling(true);
    try {
      const updated = await apiFetch<Booking>(
        `api/bookings/${selectedBookingForCancel._id}/cancel`,
        {
          method: "PATCH",
        },
      );

      // Update state locally so UI reflects "Cancelled" immediately
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBookingForCancel._id
            ? { ...b, status: (updated?.status || "Cancelled") as BookingStatus }
            : b,
        ),
      );

      toast.success("Booking cancelled successfully", {
        description: `Your reservation request for "${selectedBookingForCancel.studioTitle}" has been cancelled.`,
      });

      setSelectedBookingForCancel(null);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Could not cancel booking.";
      toast.error(message);
    } finally {
      setIsCancelling(false);
    }
  };

  // Status counts for tab pills
  const counts = useMemo(() => {
    const res = {
      ALL: bookings.length,
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
    };
    for (const b of bookings) {
      if (b.status in res) {
        res[b.status as BookingStatus]++;
      }
    }
    return res;
  }, [bookings]);

  // Filtered and searched bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      // Status match
      if (statusFilter !== "ALL" && b.status !== statusFilter) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = b.studioTitle.toLowerCase().includes(query);
        const matchesDate = b.date.toLowerCase().includes(query);
        const matchesRef = b._id.toLowerCase().includes(query);
        const matchesHost = b.hostEmail.toLowerCase().includes(query);
        return matchesTitle || matchesDate || matchesRef || matchesHost;
      }
      return true;
    });
  }, [bookings, statusFilter, searchQuery]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Production Reservations</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
            My Studio Bookings
          </h1>
          <p className="mt-2 text-sm text-base-content/70 sm:text-base max-w-2xl">
            Track your reserved photo shoots, film production blocks, and studio
            sessions with real-time status updates and cancellation management.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={refreshBookings}
            className="btn btn-ghost btn-sm rounded-xl gap-2 border border-base-300 hover:bg-base-200"
            title="Refresh bookings list"
            aria-label="Refresh bookings"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <Link
            href="/studios"
            className="btn btn-primary rounded-xl gap-2 font-medium shadow-sm"
          >
            Explore Studios <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Creator Identity Banner */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-content font-semibold text-lg">
              {user?.name ? user.name[0].toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base-content">
                  {user?.name || "Creative Producer"}
                </span>
                <span className="badge badge-sm badge-success gap-1 text-[11px] font-semibold text-white">
                  <UserCheck className="h-3 w-3" /> Creator Verified
                </span>
              </div>
              <p className="text-xs text-base-content/65">
                Reservations registered to: {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Protected route • Conflict-free guarantee</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs and Search Bar */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {FILTER_TABS.map((tab) => {
            const count = counts[tab.value];
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`btn btn-sm rounded-full gap-1.5 transition-all text-xs font-medium cursor-pointer ${
                  isActive
                    ? "btn-primary shadow-xs"
                    : "btn-ghost border border-base-300 hover:bg-base-200 text-base-content/75"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-base-300 text-base-content/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search studio or date..."
            className="input input-sm input-bordered w-full rounded-xl pl-9 pr-3 text-xs bg-base-100 placeholder:text-base-content/40 focus:outline-primary"
          />
        </div>
      </div>

      {/* Content Rendering: Loading / Error / Empty / List */}
      {isLoading ? (
        <BookingsSkeletonList />
      ) : error ? (
        <div className="rounded-3xl border border-error/30 bg-error/5 p-8 text-center sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-error/10 text-error">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-serif text-2xl font-medium text-base-content">
            Failed to Load Bookings
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
            {error}
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={refreshBookings}
              className="btn btn-primary btn-sm rounded-xl gap-2 font-medium"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        /* Empty state with "Explore Studios" CTA */
        <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 sm:p-14 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarX2 className="h-8 w-8" />
          </div>
          <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-medium text-base-content">
            No Studio Bookings Found
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm sm:text-base text-base-content/70 leading-relaxed">
            You haven&apos;t reserved any creative studios, film stages, or
            production workspaces yet. Discover spaces with transparent hourly
            pricing and instant booking.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/studios"
              className="btn btn-primary rounded-xl gap-2 font-medium shadow-sm"
            >
              Explore Studios <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        /* Empty search/filter result state */
        <div className="rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 sm:p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/60">
            <Search className="h-7 w-7" />
          </div>
          <h2 className="mt-4 font-serif text-xl sm:text-2xl font-medium text-base-content">
            No Matching Bookings
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
            No bookings match your current filter
            {statusFilter !== "ALL" ? ` (${statusFilter})` : ""}
            {searchQuery ? ` or search "${searchQuery}"` : ""}.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setStatusFilter("ALL");
                setSearchQuery("");
              }}
              className="btn btn-outline btn-sm rounded-xl gap-2 font-medium"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-5">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancelRequest={(b) => setSelectedBookingForCancel(b)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal for Cancelling Booking */}
      <CancelBookingModal
        isOpen={Boolean(selectedBookingForCancel)}
        booking={selectedBookingForCancel}
        isCancelling={isCancelling}
        onClose={() => setSelectedBookingForCancel(null)}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
