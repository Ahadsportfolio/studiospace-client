"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  User,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { Booking, BookingStatus } from "@/types/booking";
import type { Studio } from "@/types/studio";
import { DeclineBookingModal } from "./decline-booking-modal";
import { BookingNotesModal } from "./booking-notes-modal";

const FALLBACK_STUDIO_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";

type FilterTab = "ALL" | BookingStatus;

const FILTER_TABS: { label: string; value: FilterTab }[] = [
  { label: "All Requests", value: "ALL" },
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

function getStatusBadgeConfig(status: BookingStatus) {
  switch (status) {
    case "Pending":
      return {
        label: "Pending",
        badgeClass:
          "border border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold",
        icon: Clock,
      };
    case "Confirmed":
      return {
        label: "Confirmed",
        badgeClass:
          "border border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold",
        icon: CheckCircle2,
      };
    case "Completed":
      return {
        label: "Completed",
        badgeClass:
          "border border-sky-500/40 bg-sky-500/15 text-sky-700 dark:text-sky-300 font-semibold",
        icon: CheckCheck,
      };
    case "Cancelled":
      return {
        label: "Cancelled",
        badgeClass:
          "border border-rose-500/40 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-semibold",
        icon: XCircle,
      };
    default:
      return {
        label: status,
        badgeClass: "border border-base-300 bg-base-200 text-base-content/80",
        icon: Clock,
      };
  }
}

export function DashboardContent() {
  const { user } = useAuth();

  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [myStudios, setMyStudios] = useState<Studio[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterTab>("ALL");

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [decliningBooking, setDecliningBooking] = useState<Booking | null>(null);
  const [isDeclining, setIsDeclining] = useState(false);
  const [viewingNotesBooking, setViewingNotesBooking] =
    useState<Booking | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const [hostRes, studiosRes, myRes] = await Promise.all([
        apiFetch<Booking[]>("api/bookings/host"),
        apiFetch<Studio[]>("api/studios/mine"),
        apiFetch<Booking[]>("api/bookings/my"),
      ]);

      setHostBookings(Array.isArray(hostRes) ? hostRes : []);
      setMyStudios(Array.isArray(studiosRes) ? studiosRes : []);
      setMyBookings(Array.isArray(myRes) ? myRes : []);
      toast.success("Dashboard data updated.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to refresh dashboard data.";
      setError(message);
      toast.error(message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      apiFetch<Booking[]>("api/bookings/host"),
      apiFetch<Studio[]>("api/studios/mine"),
      apiFetch<Booking[]>("api/bookings/my"),
    ])
      .then(([hostRes, studiosRes, myRes]) => {
        if (isMounted) {
          setHostBookings(Array.isArray(hostRes) ? hostRes : []);
          setMyStudios(Array.isArray(studiosRes) ? studiosRes : []);
          setMyBookings(Array.isArray(myRes) ? myRes : []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          const message =
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Failed to load dashboard data.";
          setError(message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Status counts for stats and filters
  const pendingRequestsCount = useMemo(
    () => hostBookings.filter((b) => b.status === "Pending").length,
    [hostBookings]
  );

  const confirmedBookingsCount = useMemo(
    () => hostBookings.filter((b) => b.status === "Confirmed").length,
    [hostBookings]
  );

  const completedBookingsCount = useMemo(
    () => hostBookings.filter((b) => b.status === "Completed").length,
    [hostBookings]
  );

  const cancelledBookingsCount = useMemo(
    () => hostBookings.filter((b) => b.status === "Cancelled").length,
    [hostBookings]
  );

  // Filtered list of incoming booking requests
  const filteredBookings = useMemo(() => {
    let list = hostBookings;

    if (selectedFilter !== "ALL") {
      list = list.filter((b) => b.status === selectedFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (b) =>
          b.studioTitle.toLowerCase().includes(q) ||
          b.userName.toLowerCase().includes(q) ||
          b.userEmail.toLowerCase().includes(q) ||
          b.date.includes(q)
      );
    }

    return list;
  }, [hostBookings, selectedFilter, searchQuery]);

  // Confirm booking handler
  const handleConfirm = async (booking: Booking) => {
    setActionLoadingId(booking._id);
    try {
      const updated = await apiFetch<Booking>(
        `api/bookings/${booking._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Confirmed" }),
        }
      );

      toast.success(
        `Booking request for "${booking.studioTitle}" confirmed! The shoot slot is now scheduled.`
      );

      setHostBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id
            ? updated || { ...b, status: "Confirmed" }
            : b
        )
      );
    } catch (err) {
      if (err instanceof ApiError) {
        // Show the 409 message as a toast when confirming a conflicting slot!
        toast.error(err.message);
      } else {
        toast.error("Failed to confirm booking request. Please try again.");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Mark Completed booking handler
  const handleMarkCompleted = async (booking: Booking) => {
    setActionLoadingId(booking._id);
    try {
      const updated = await apiFetch<Booking>(
        `api/bookings/${booking._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Completed" }),
        }
      );

      toast.success(
        `Shoot session for "${booking.studioTitle}" marked as completed!`
      );

      setHostBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id
            ? updated || { ...b, status: "Completed" }
            : b
        )
      );
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to mark booking as completed.");
      }
    } finally {
      setActionLoadingId(null);
    }
  };

  // Decline booking confirmation handler
  const handleDeclineConfirm = async () => {
    if (!decliningBooking) return;
    setIsDeclining(true);
    try {
      const updated = await apiFetch<Booking>(
        `api/bookings/${decliningBooking._id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "Cancelled" }),
        }
      );

      toast.success(
        `Booking request from ${decliningBooking.userName} has been declined.`
      );

      setHostBookings((prev) =>
        prev.map((b) =>
          b._id === decliningBooking._id
            ? updated || { ...b, status: "Cancelled" }
            : b
        )
      );
      setDecliningBooking(null);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message);
      } else {
        toast.error("Failed to decline booking request.");
      }
    } finally {
      setIsDeclining(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Workspace Operations</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
            Creator & Host Dashboard
          </h1>
          <p className="mt-2 text-sm text-base-content/70 sm:text-base">
            Review incoming booking requests, manage your studio availability, and track scheduled production sessions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading || isRefreshing}
            className="btn btn-outline btn-sm rounded-xl gap-2 shadow-xs"
            title="Refresh dashboard data"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <Link
            href="/add-studio"
            className="btn btn-primary btn-sm rounded-xl gap-2 shadow-xs"
          >
            <Plus className="h-4 w-4" /> Add Studio
          </Link>
        </div>
      </div>

      {/* Account overview bar */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-bold text-primary-content shadow-xs">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base-content text-base">
                  {user?.name || "Studio Member"}
                </span>
                <span className="badge badge-sm badge-success gap-1">
                  <UserCheck className="h-3 w-3" /> Host & Creator
                </span>
              </div>
              <p className="text-xs text-base-content/65">{user?.email}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-base-content/70">
            <Link
              href="/my-listings"
              className="link link-hover inline-flex items-center gap-1 font-medium text-primary"
            >
              My Listings <ArrowRight className="h-3 w-3" />
            </Link>
            <span>•</span>
            <Link
              href="/my-bookings"
              className="link link-hover inline-flex items-center gap-1 font-medium text-secondary"
            >
              My Bookings <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="mb-8 flex items-center justify-between rounded-2xl border border-error/30 bg-error/10 p-4 text-error">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            className="btn btn-ghost btn-xs text-error underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Stats Cards Section (All cards equal height and width) */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl font-medium tracking-tight text-base-content">
            Performance & Schedule Stats
          </h2>
          <span className="text-xs text-base-content/60">Real-time overview</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="card h-44 animate-pulse rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-base-300" />
                  <div className="h-5 w-16 rounded-full bg-base-300" />
                </div>
                <div className="mt-4 h-8 w-20 rounded-md bg-base-300" />
                <div className="mt-2 h-4 w-32 rounded-md bg-base-300" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: My Listings */}
            <div className="card h-full rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <span className="badge badge-sm badge-ghost text-xs">Host inventory</span>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold tracking-tight text-base-content">
                    {myStudios.length}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-base-content/80">
                    My Listings
                  </h3>
                  <p className="mt-1 text-xs text-base-content/60">
                    Active creative workspaces published on StudioSpace.
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-base-200 pt-3">
                <Link
                  href="/my-listings"
                  className="link link-hover inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
                >
                  Manage Listings <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Card 2: Pending Requests */}
            <div className="card h-full rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all hover:border-amber-500/40 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <span
                    className={`badge badge-sm ${
                      pendingRequestsCount > 0
                        ? "badge-warning font-medium"
                        : "badge-ghost"
                    } text-xs`}
                  >
                    {pendingRequestsCount > 0 ? "Awaiting review" : "Up to date"}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                    {pendingRequestsCount}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-base-content/80">
                    Pending Requests
                  </h3>
                  <p className="mt-1 text-xs text-base-content/60">
                    {pendingRequestsCount === 1
                      ? "1 reservation request waiting for your action."
                      : `${pendingRequestsCount} requests awaiting host confirmation.`}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-base-200 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedFilter("Pending")}
                  className="link link-hover inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
                >
                  Review Pending <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Card 3: Confirmed Bookings */}
            <div className="card h-full rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all hover:border-emerald-500/40 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="badge badge-sm badge-success text-xs font-medium">
                    Scheduled
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {confirmedBookingsCount}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-base-content/80">
                    Confirmed Bookings
                  </h3>
                  <p className="mt-1 text-xs text-base-content/60">
                    Confirmed production sessions ready for creator check-in.
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-base-200 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedFilter("Confirmed")}
                  className="link link-hover inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
                >
                  View Confirmed <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Card 4: My Bookings */}
            <div className="card h-full rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm transition-all hover:border-secondary/40 hover:shadow-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <span className="badge badge-sm badge-ghost text-xs">Creator role</span>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-bold tracking-tight text-base-content">
                    {myBookings.length}
                  </span>
                  <h3 className="mt-1 text-sm font-semibold text-base-content/80">
                    My Bookings
                  </h3>
                  <p className="mt-1 text-xs text-base-content/60">
                    Studios you reserved as a guest creator or producer.
                  </p>
                </div>
              </div>
              <div className="mt-5 border-t border-base-200 pt-3">
                <Link
                  href="/my-bookings"
                  className="link link-hover inline-flex items-center gap-1.5 text-xs font-semibold text-secondary"
                >
                  My Reserved Slots <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Incoming Booking Requests Table Section */}
      <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        {/* Table Title & Filter bar */}
        <div className="border-b border-base-300 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-serif text-2xl font-medium tracking-tight text-base-content">
                Incoming Booking Requests
              </h2>
              <p className="mt-1 text-xs text-base-content/70 sm:text-sm">
                Reservations requested by creators for your studios. Confirm availability, decline conflicts, or mark completed sessions.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72 lg:w-80">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search studio, creator, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm w-full rounded-xl pl-10 pr-8 text-xs focus:outline-primary"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {FILTER_TABS.map((tab) => {
              const isActive = selectedFilter === tab.value;
              let count = hostBookings.length;
              if (tab.value === "Pending") count = pendingRequestsCount;
              else if (tab.value === "Confirmed") count = confirmedBookingsCount;
              else if (tab.value === "Completed") count = completedBookingsCount;
              else if (tab.value === "Cancelled") count = cancelledBookingsCount;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setSelectedFilter(tab.value)}
                  className={`btn btn-xs sm:btn-sm rounded-xl font-medium transition-colors ${
                    isActive
                      ? "btn-primary shadow-xs"
                      : "btn-ghost text-base-content/75 hover:bg-base-200"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1.5 rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? "bg-primary-content/20 text-primary-content"
                        : "bg-base-300 text-base-content/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area: Loading, Empty, or Table */}
        {isLoading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-16 animate-pulse items-center justify-between rounded-xl bg-base-200/60 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 rounded-lg bg-base-300" />
                    <div className="space-y-2">
                      <div className="h-4 w-36 rounded bg-base-300" />
                      <div className="h-3 w-24 rounded bg-base-300" />
                    </div>
                  </div>
                  <div className="h-8 w-28 rounded-lg bg-base-300" />
                </div>
              ))}
            </div>
          </div>
        ) : hostBookings.length === 0 ? (
          /* Empty state when no host bookings exist */
          <div className="p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <CalendarDays className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-serif text-xl font-medium text-base-content">
              No Incoming Booking Requests Yet
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
              {myStudios.length === 0
                ? "You haven't listed any creative workspaces yet. Create your first studio listing to start receiving shoot booking requests from creators."
                : "Your studio listings are active! When creators book slots for photo shoots, music sessions, or video productions, their requests will appear here for your confirmation."}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {myStudios.length === 0 ? (
                <Link
                  href="/add-studio"
                  className="btn btn-primary rounded-xl gap-2 shadow-xs"
                >
                  <Plus className="h-4 w-4" /> Add Your First Studio
                </Link>
              ) : (
                <Link
                  href="/my-listings"
                  className="btn btn-outline rounded-xl gap-2 shadow-xs"
                >
                  <Building2 className="h-4 w-4" /> View Your Studio Listings
                </Link>
              )}
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          /* Empty state for search/filter mismatch */
          <div className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-base-content/50">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-serif text-lg font-medium text-base-content">
              No Booking Requests Found
            </h3>
            <p className="mx-auto mt-1 max-w-md text-xs text-base-content/65 sm:text-sm">
              No requests match your current search &quot;{searchQuery}&quot; or status filter &quot;{selectedFilter}&quot;.
            </p>
            <div className="mt-5">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedFilter("ALL");
                }}
                className="btn btn-sm btn-ghost underline"
              >
                Clear all filters
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Desktop / Tablet Table View */}
            <div className="hidden overflow-x-auto md:block">
              <table className="table table-md w-full">
                <thead>
                  <tr className="border-b border-base-300 bg-base-200/40 text-xs uppercase tracking-wider text-base-content/60">
                    <th className="py-4 pl-6">Studio Space</th>
                    <th className="py-4">Creator / Booker</th>
                    <th className="py-4">Shoot Schedule</th>
                    <th className="py-4">Financials</th>
                    <th className="py-4">Status</th>
                    <th className="py-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 text-sm">
                  {filteredBookings.map((booking) => {
                    const statusConfig = getStatusBadgeConfig(booking.status);
                    const StatusIcon = statusConfig.icon;
                    const isBusy = actionLoadingId === booking._id;

                    const imageSrc =
                      booking.studioImage || FALLBACK_STUDIO_IMAGE;
                    const isRemoteOptimized =
                      imageSrc.includes("images.unsplash.com") ||
                      imageSrc.includes("i.ibb.co");

                    return (
                      <tr
                        key={booking._id}
                        className="transition-colors hover:bg-base-200/30"
                      >
                        {/* Studio info */}
                        <td className="py-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-300">
                              <Image
                                src={imageSrc}
                                alt={booking.studioTitle}
                                fill
                                sizes="64px"
                                className="object-cover"
                                unoptimized={!isRemoteOptimized}
                              />
                            </div>
                            <div className="min-w-0 max-w-[200px] xl:max-w-[260px]">
                              <Link
                                href={`/studios/${booking.studioId}`}
                                className="group inline-flex items-center gap-1 font-semibold text-base-content transition-colors hover:text-primary"
                                title="View studio public listing"
                              >
                                <span className="truncate">{booking.studioTitle}</span>
                                <ExternalLink className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                              </Link>
                              <p className="mt-0.5 text-xs text-base-content/60">
                                {booking.hours} {booking.hours === 1 ? "hour" : "hours"} reserved
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Creator info */}
                        <td className="py-4">
                          <div className="min-w-0 max-w-[180px]">
                            <div className="flex items-center gap-1.5 font-medium text-base-content">
                              <User className="h-3.5 w-3.5 shrink-0 text-primary/70" />
                              <span className="truncate">{booking.userName}</span>
                            </div>
                            <p className="truncate text-xs text-base-content/65">
                              {booking.userEmail}
                            </p>
                            {booking.notes && (
                              <button
                                type="button"
                                onClick={() => setViewingNotesBooking(booking)}
                                className="mt-1 inline-flex items-center gap-1 text-xs text-primary underline hover:text-primary-focus"
                              >
                                <FileText className="h-3 w-3" /> View Shoot Notes
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Shoot Schedule */}
                        <td className="py-4">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-base-content">
                              <Calendar className="h-3.5 w-3.5 text-primary" />
                              <span>{formatDisplayDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-base-content/70">
                              <Clock className="h-3.5 w-3.5 text-secondary" />
                              <span>
                                {formatTimeDisplay(booking.startTime)} – {formatTimeDisplay(booking.endTime)}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Financials */}
                        <td className="py-4">
                          <div>
                            <div className="font-semibold text-base-content">
                              ${booking.totalPrice}
                            </div>
                            <div className="text-xs text-base-content/60">
                              Deposit: ${booking.securityDeposit}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${statusConfig.badgeClass}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5 shrink-0" />
                            <span>{statusConfig.label}</span>
                          </span>
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 pr-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {booking.status === "Pending" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleConfirm(booking)}
                                  disabled={isBusy}
                                  className="btn btn-success btn-sm rounded-lg gap-1.5 text-white shadow-xs"
                                  title="Confirm booking and lock slot"
                                >
                                  {isBusy ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                  <span>Confirm</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDecliningBooking(booking)}
                                  disabled={isBusy}
                                  className="btn btn-outline btn-error btn-sm rounded-lg gap-1.5"
                                  title="Decline this booking request"
                                >
                                  <XCircle className="h-3.5 w-3.5" />
                                  <span>Decline</span>
                                </button>
                              </>
                            )}

                            {booking.status === "Confirmed" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleMarkCompleted(booking)}
                                  disabled={isBusy}
                                  className="btn btn-outline btn-primary btn-sm rounded-lg gap-1.5 shadow-xs"
                                  title="Mark production session as completed"
                                >
                                  {isBusy ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <CheckCheck className="h-3.5 w-3.5" />
                                  )}
                                  <span>Mark Completed</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDecliningBooking(booking)}
                                  disabled={isBusy}
                                  className="btn btn-ghost btn-xs text-error hover:bg-error/10"
                                  title="Cancel confirmed booking"
                                >
                                  Decline
                                </button>
                              </>
                            )}

                            {booking.status === "Completed" && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400">
                                <CheckCheck className="h-3.5 w-3.5" />
                                <span>Fulfilled</span>
                              </span>
                            )}

                            {booking.status === "Cancelled" && (
                              <span className="inline-flex items-center gap-1 text-xs text-base-content/50">
                                <XCircle className="h-3.5 w-3.5" />
                                <span>Cancelled</span>
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Visible on small screens) */}
            <div className="divide-y divide-base-300 md:hidden">
              {filteredBookings.map((booking) => {
                const statusConfig = getStatusBadgeConfig(booking.status);
                const StatusIcon = statusConfig.icon;
                const isBusy = actionLoadingId === booking._id;

                const imageSrc =
                  booking.studioImage || FALLBACK_STUDIO_IMAGE;
                const isRemoteOptimized =
                  imageSrc.includes("images.unsplash.com") ||
                  imageSrc.includes("i.ibb.co");

                return (
                  <div key={booking._id} className="p-4 space-y-3.5">
                    {/* Header: Studio + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-300">
                          <Image
                            src={imageSrc}
                            alt={booking.studioTitle}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized={!isRemoteOptimized}
                          />
                        </div>
                        <div>
                          <Link
                            href={`/studios/${booking.studioId}`}
                            className="font-semibold text-base-content hover:underline line-clamp-1 text-sm"
                          >
                            {booking.studioTitle}
                          </Link>
                          <p className="text-xs text-base-content/60">
                            {booking.userName} • {booking.userEmail}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusConfig.badgeClass}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{statusConfig.label}</span>
                      </span>
                    </div>

                    {/* Schedule & Price Row */}
                    <div className="grid grid-cols-2 gap-2 rounded-xl bg-base-200/50 p-3 text-xs">
                      <div>
                        <span className="text-base-content/60 block">Date & Time</span>
                        <span className="font-medium text-base-content">
                          {formatDisplayDate(booking.date)}
                        </span>
                        <div className="text-base-content/70">
                          {formatTimeDisplay(booking.startTime)} – {formatTimeDisplay(booking.endTime)}
                        </div>
                      </div>
                      <div>
                        <span className="text-base-content/60 block">Financials</span>
                        <span className="font-semibold text-base-content">
                          Total: ${booking.totalPrice}
                        </span>
                        <div className="text-base-content/70">
                          Deposit: ${booking.securityDeposit}
                        </div>
                      </div>
                    </div>

                    {/* Creator Notes link if present */}
                    {booking.notes && (
                      <div className="flex justify-start">
                        <button
                          type="button"
                          onClick={() => setViewingNotesBooking(booking)}
                          className="inline-flex items-center gap-1 text-xs text-primary underline"
                        >
                          <FileText className="h-3 w-3" /> View Creator Shoot Notes
                        </button>
                      </div>
                    )}

                    {/* Actions on Mobile */}
                    <div className="flex items-center justify-end gap-2 pt-1">
                      {booking.status === "Pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleConfirm(booking)}
                            disabled={isBusy}
                            className="btn btn-success btn-sm flex-1 rounded-lg gap-1 text-white shadow-xs"
                          >
                            {isBusy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            <span>Confirm</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDecliningBooking(booking)}
                            disabled={isBusy}
                            className="btn btn-outline btn-error btn-sm flex-1 rounded-lg gap-1"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Decline</span>
                          </button>
                        </>
                      )}

                      {booking.status === "Confirmed" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleMarkCompleted(booking)}
                            disabled={isBusy}
                            className="btn btn-outline btn-primary btn-sm flex-1 rounded-lg gap-1"
                          >
                            {isBusy ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCheck className="h-3.5 w-3.5" />
                            )}
                            <span>Mark Completed</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDecliningBooking(booking)}
                            disabled={isBusy}
                            className="btn btn-ghost btn-sm text-error"
                          >
                            Decline
                          </button>
                        </>
                      )}

                      {booking.status === "Completed" && (
                        <div className="w-full text-right text-xs font-medium text-sky-600 dark:text-sky-400">
                          Session Completed
                        </div>
                      )}

                      {booking.status === "Cancelled" && (
                        <div className="w-full text-right text-xs text-base-content/50">
                          Reservation Declined / Cancelled
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Decline Booking Custom Modal */}
      <DeclineBookingModal
        isOpen={Boolean(decliningBooking)}
        booking={decliningBooking}
        isDeclining={isDeclining}
        onClose={() => setDecliningBooking(null)}
        onConfirm={handleDeclineConfirm}
      />

      {/* View Creator Shoot Notes Modal */}
      <BookingNotesModal
        isOpen={Boolean(viewingNotesBooking)}
        booking={viewingNotesBooking}
        onClose={() => setViewingNotesBooking(null)}
      />
    </div>
  );
}
