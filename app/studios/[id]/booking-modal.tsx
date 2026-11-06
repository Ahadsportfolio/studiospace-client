"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch, ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth-provider";
import type { AvailabilityRange } from "@/types/booking";
import type { Studio } from "@/types/studio";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  studio: Studio;
  initialHours?: number;
}

// Generate standard 24h time slots in 30-minute intervals from 07:00 to 23:00
const TIME_SLOTS: string[] = [];
for (let hour = 7; hour <= 23; hour++) {
  const hStr = hour < 10 ? `0${hour}` : `${hour}`;
  TIME_SLOTS.push(`${hStr}:00`);
  if (hour < 23) {
    TIME_SLOTS.push(`${hStr}:30`);
  }
}

// Format 24h HH:mm to 12h display with AM/PM
function formatTimeDisplay(timeStr: string): string {
  if (!timeStr) return "";
  const [h, m] = timeStr.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return timeStr;
  const period = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 === 0 ? 12 : h % 12;
  const displayMin = m < 10 ? `0${m}` : `${m}`;
  return `${displayHour}:${displayMin} ${period}`;
}

// Format local date to YYYY-MM-DD
function getLocalDateString(offsetDays = 0): string {
  const date = new Date();
  if (offsetDays > 0) {
    date.setDate(date.getDate() + offsetDays);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper to convert HH:mm to total minutes
function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Helper to add hours to HH:mm string
function addHoursToTime(timeStr: string, hours: number): string {
  const [h, m] = timeStr.split(":").map(Number);
  const totalHours = Math.min(23, h + hours);
  const hStr = totalHours < 10 ? `0${totalHours}` : `${totalHours}`;
  const mStr = m < 10 ? `0${m}` : `${m}`;
  return `${hStr}:${mStr}`;
}

export function BookingModal({
  isOpen,
  onClose,
  studio,
  initialHours = 4,
}: BookingModalProps) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const todayStr = useMemo(() => getLocalDateString(0), []);

  // Form states
  const [date, setDate] = useState<string>(todayStr);
  const [startTime, setStartTime] = useState<string>("10:00");
  const [endTime, setEndTime] = useState<string>(() =>
    addHoursToTime("10:00", initialHours),
  );
  const [notes, setNotes] = useState<string>("");

  // Availability states
  const [availability, setAvailability] = useState<AvailabilityRange[]>([]);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(true);
  const [availabilityLoaded, setAvailabilityLoaded] = useState(false);

  // Submission & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  // Lock body scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSubmitting, onClose]);

  // Fetch availability when date changes or modal opens
  useEffect(() => {
    if (!isOpen || !date || !studio._id) return;
    let ignore = false;

    async function loadAvailability() {
      try {
        const ranges = await apiFetch<AvailabilityRange[]>(
          `api/studios/${studio._id}/availability?date=${date}`,
        );
        if (ignore) return;
        setAvailability(ranges || []);
        setAvailabilityLoaded(true);
      } catch (err) {
        if (ignore) return;
        console.warn("Could not load studio availability:", err);
        setAvailability([]);
        setAvailabilityLoaded(true);
      } finally {
        if (!ignore) {
          setIsLoadingAvailability(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      ignore = true;
    };
  }, [isOpen, date, studio._id]);

  // Clear inline error on any input change
  const handleDateChange = (newDate: string) => {
    setDate(newDate);
    setIsLoadingAvailability(true);
    setInlineError(null);
  };

  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);
    setInlineError(null);
    // If current end is earlier or equal, bump end time automatically
    if (timeToMinutes(endTime) <= timeToMinutes(newStart)) {
      setEndTime(addHoursToTime(newStart, 2));
    }
  };

  const handleEndTimeChange = (newEnd: string) => {
    setEndTime(newEnd);
    setInlineError(null);
  };

  const handleApplyPreset = (durationHrs: number) => {
    setEndTime(addHoursToTime(startTime, durationHrs));
    setInlineError(null);
  };

  // Duration calculation
  const { hours, isValidDuration, durationError } = useMemo(() => {
    if (!startTime || !endTime) {
      return {
        hours: 0,
        isValidDuration: false,
        durationError: "Please choose both start and end times.",
      };
    }

    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);

    if (endMin <= startMin) {
      return {
        hours: 0,
        isValidDuration: false,
        durationError: "End time must be later than start time.",
      };
    }

    const diff = endMin - startMin;
    const calculatedHours = diff / 60;

    if (diff < 60) {
      return {
        hours: calculatedHours,
        isValidDuration: false,
        durationError: "Minimum booking duration is 1 hour.",
      };
    }

    return {
      hours: calculatedHours,
      isValidDuration: true,
      durationError: null,
    };
  }, [startTime, endTime]);

  // Check if selected time slot collides with any confirmed booking
  const conflictingSlot = useMemo(() => {
    if (!isValidDuration || !availability.length) return null;

    const selectedStartMin = timeToMinutes(startTime);
    const selectedEndMin = timeToMinutes(endTime);

    for (const range of availability) {
      const bookedStartMin = timeToMinutes(range.startTime);
      const bookedEndMin = timeToMinutes(range.endTime);

      // Overlap formula: start1 < end2 && end1 > start2
      if (selectedStartMin < bookedEndMin && selectedEndMin > bookedStartMin) {
        return range;
      }
    }

    return null;
  }, [isValidDuration, availability, startTime, endTime]);

  // Pricing calculations
  const rentalTotal = isValidDuration ? hours * studio.hourlyRate : 0;
  const deposit = studio.securityDeposit || 0;
  const grandTotal = rentalTotal + deposit;

  // Check host restriction
  const isHost = Boolean(
    user?.email &&
      studio.ownerEmail &&
      user.email.toLowerCase() === studio.ownerEmail.toLowerCase(),
  );

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Check authentication
    if (!user && !authLoading) {
      toast.info("Please sign in to reserve this studio.", {
        description: "You'll be redirected back to complete your reservation.",
      });
      router.push(
        `/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`,
      );
      return;
    }

    // 2. Check host cannot book own studio
    if (isHost) {
      const msg = "Hosts cannot book their own studio spaces.";
      setInlineError(msg);
      toast.error(msg);
      return;
    }

    // 3. Validation
    if (!date) {
      setInlineError("Please select a reservation date.");
      return;
    }

    if (date < todayStr) {
      setInlineError("Booking date cannot be in the past.");
      return;
    }

    if (!isValidDuration) {
      setInlineError(
        durationError || "Please select a valid booking time range.",
      );
      return;
    }

    setIsSubmitting(true);
    setInlineError(null);

    try {
      await apiFetch("api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime,
          endTime,
          notes: notes.trim(),
        }),
      });

      // 201 Success flow
      toast.success("Studio booking submitted successfully!", {
        description: `Your reservation request for "${studio.title}" is pending host confirmation.`,
      });
      onClose();
      router.push("/my-bookings");
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        // Required: on 409 show the server message in an error toast and inline
        const serverMessage =
          error.message ||
          "This time slot is already booked. Please choose a different time.";
        setInlineError(serverMessage);
        toast.error(serverMessage);
      } else if (error instanceof ApiError && error.status === 401) {
        toast.error("Your session has expired. Please sign in again.");
        router.push(
          `/login?redirect=${encodeURIComponent(`/studios/${studio._id}`)}`,
        );
      } else if (error instanceof ApiError && error.status === 403) {
        const msg = error.message || "Hosts cannot book their own studio.";
        setInlineError(msg);
        toast.error(msg);
      } else {
        const fallbackMsg =
          error instanceof Error
            ? error.message
            : "Could not submit your booking request. Please try again.";
        setInlineError(fallbackMsg);
        toast.error(fallbackMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border border-base-300 bg-base-100 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-base-200 px-6 py-4.5 bg-base-100 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-200">
              <Image
                src={studio.image || studio.gallery?.[0] || "/placeholder.jpg"}
                alt={studio.title}
                fill
                sizes="48px"
                className="object-cover"
                unoptimized={
                  !studio.image?.includes("images.unsplash.com") &&
                  !studio.image?.includes("i.ibb.co")
                }
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary badge-outline text-[11px] font-semibold py-0.5">
                  {studio.category}
                </span>
                <span className="text-xs text-base-content/60 truncate">
                  ${studio.hourlyRate}/hr
                </span>
              </div>
              <h2
                id="booking-modal-title"
                className="font-serif text-lg sm:text-xl font-medium tracking-tight text-base-content truncate"
                title={studio.title}
              >
                Reserve {studio.title}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close booking modal"
            className="rounded-full p-2 text-base-content/60 hover:bg-base-200 hover:text-base-content transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-6"
        >
          {/* Host Warning if logged-in user is host */}
          {isHost && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-700 dark:text-amber-300 flex items-start gap-3 text-sm">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Host Workspace Notice</p>
                <p className="text-xs mt-0.5 opacity-90">
                  You are registered as the host of this workspace. Host accounts cannot create client reservations for their own studios.
                </p>
              </div>
            </div>
          )}

          {/* Inline Error Notice (Mandatory for 409 and other errors) */}
          {inlineError && (
            <div
              role="alert"
              className="rounded-2xl border border-error/30 bg-error/10 p-4 text-error flex items-start gap-3 text-sm transition-all animate-in fade-in"
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold tracking-tight">
                  Reservation Conflict
                </div>
                <div className="mt-0.5 text-xs text-error/95 leading-relaxed">
                  {inlineError}
                </div>
              </div>
            </div>
          )}

          {/* Date Picker Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="booking-date"
                className="text-xs font-semibold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5"
              >
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>1. Select Shoot Date</span>
              </label>
              <span className="text-xs text-base-content/60">
                Today or future date
              </span>
            </div>

            <div className="relative">
              <input
                id="booking-date"
                type="date"
                min={todayStr}
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                required
                className="w-full rounded-2xl border border-base-300 bg-base-100 px-4 py-3 text-sm font-medium text-base-content shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Availability & Blocked Ranges Panel */}
          <div className="rounded-2xl border border-base-300 bg-base-200/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-secondary" />
                <span>Studio Availability for {date || "Selected Date"}</span>
              </span>

              {isLoadingAvailability && (
                <span className="inline-flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Checking calendar...</span>
                </span>
              )}
            </div>

            {/* Blocked Ranges List */}
            <div className="mt-3">
              {isLoadingAvailability ? (
                <div className="h-8 animate-pulse rounded-xl bg-base-300/60" />
              ) : availability.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-error font-medium">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {availability.length}{" "}
                      {availability.length === 1
                        ? "time slot is"
                        : "time slots are"}{" "}
                      currently blocked or booked:
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {availability.map((range, idx) => (
                      <span
                        key={`${range.startTime}-${range.endTime}-${idx}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-error/25 bg-error/10 px-3 py-1 text-xs font-semibold text-error"
                      >
                        <Clock className="h-3 w-3" />
                        <span>
                          {range.startTime} ({formatTimeDisplay(range.startTime)})
                          {" — "}
                          {range.endTime} ({formatTimeDisplay(range.endTime)})
                        </span>
                        <span className="text-[10px] uppercase tracking-wider opacity-80">
                          Blocked
                        </span>
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-base-content/60">
                    Please select a start and end time outside of these blocked ranges to avoid overlap conflict.
                  </p>
                </div>
              ) : availabilityLoaded ? (
                <div className="flex items-center gap-2 text-xs text-success font-medium">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>All day slots are currently available for this date.</span>
                </div>
              ) : null}
            </div>

            {/* Pre-submission Overlap Warning */}
            {conflictingSlot && (
              <div className="mt-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-warning text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Overlap Detected:</span> Your
                  selected hours ({startTime} — {endTime}) collide with an
                  existing booking ({conflictingSlot.startTime} —{" "}
                  {conflictingSlot.endTime}). The server will reject this slot.
                </div>
              </div>
            )}
          </div>

          {/* Time Selection Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-base-content/75 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>2. Select Shoot Hours</span>
              </label>
              <span className="text-xs text-base-content/60">
                Minimum 1 hour duration
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Time Select */}
              <div>
                <label
                  htmlFor="booking-start-time"
                  className="block text-xs font-medium text-base-content/70 mb-1.5"
                >
                  Start Time
                </label>
                <select
                  id="booking-start-time"
                  value={startTime}
                  onChange={(e) => handleStartTimeChange(e.target.value)}
                  className="w-full rounded-2xl border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm font-medium text-base-content shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {TIME_SLOTS.slice(0, -1).map((slot) => (
                    <option key={`start-${slot}`} value={slot}>
                      {slot} ({formatTimeDisplay(slot)})
                    </option>
                  ))}
                </select>
              </div>

              {/* End Time Select */}
              <div>
                <label
                  htmlFor="booking-end-time"
                  className="block text-xs font-medium text-base-content/70 mb-1.5"
                >
                  End Time
                </label>
                <select
                  id="booking-end-time"
                  value={endTime}
                  onChange={(e) => handleEndTimeChange(e.target.value)}
                  className="w-full rounded-2xl border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm font-medium text-base-content shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={`end-${slot}`} value={slot}>
                      {slot} ({formatTimeDisplay(slot)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Duration Preset Chips */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-medium text-base-content/60">
                Quick preset:
              </span>
              {[2, 4, 8].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleApplyPreset(h)}
                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold transition-all ${
                    hours === h && isValidDuration
                      ? "bg-primary text-primary-content"
                      : "bg-base-200 text-base-content/75 hover:bg-base-300"
                  }`}
                >
                  +{h} hrs {h === 4 ? "(Half-day)" : h === 8 ? "(Full-day)" : ""}
                </button>
              ))}
            </div>

            {/* Duration Error or Confirmation */}
            {durationError ? (
              <p className="mt-2 text-xs text-error font-medium">
                {durationError}
              </p>
            ) : (
              <p className="mt-2 text-xs text-success font-medium flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5" />
                <span>
                  Total shoot duration:{" "}
                  <strong>
                    {hours} {hours === 1 ? "hour" : "hours"}
                  </strong>{" "}
                  ({startTime} to {endTime})
                </span>
              </p>
            )}
          </div>

          {/* Notes & Shoot Details */}
          <div>
            <label
              htmlFor="booking-notes"
              className="text-xs font-semibold uppercase tracking-wider text-base-content/75 flex items-center justify-between mb-1.5"
            >
              <span>3. Production Notes & Special Requests (Optional)</span>
              <span className="text-[11px] font-normal text-base-content/50">
                {notes.length}/500
              </span>
            </label>
            <textarea
              id="booking-notes"
              rows={3}
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 4-person commercial fashion shoot; bring our own continuous lighting kit; quiet sound recording required between 11:00 and 13:00; need freight elevator access."
              className="w-full rounded-2xl border border-base-300 bg-base-100 p-3.5 text-sm text-base-content placeholder:text-base-content/40 shadow-xs focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Live Pricing Summary Box */}
          <div className="rounded-2xl border border-base-300 bg-base-200/60 p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-base-content/70">
              Live Price Summary
            </h3>

            <div className="mt-3 space-y-2.5 text-xs sm:text-sm text-base-content/80">
              <div className="flex justify-between items-center">
                <span className="text-base-content/70">
                  Rate breakdown ({hours || 0} hrs × ${studio.hourlyRate}/hr)
                </span>
                <span className="font-semibold text-base-content">
                  ${rentalTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="inline-flex items-center gap-1 text-base-content/70">
                  <span>Security deposit</span>
                  <span
                    title="100% refundable within 48 hours post-production following host space check"
                    className="cursor-help text-base-content/50"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="font-semibold text-base-content">
                  ${deposit.toFixed(2)}
                  <span className="ml-1 text-[11px] font-normal text-success">
                    (Refundable)
                  </span>
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-base-content/70">
                  Platform protection & support
                </span>
                <span className="font-semibold text-success">
                  $0.00 (Free)
                </span>
              </div>

              <div className="border-t border-base-300/80 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-sm sm:text-base font-bold text-base-content">
                    Estimated Total
                  </span>
                  <p className="text-[11px] text-base-content/60">
                    Includes workspace rental and refundable security deposit
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl sm:text-3xl font-bold text-primary">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Trust Badges */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-base-300/60 bg-base-100 p-3 text-xs text-base-content/70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-success shrink-0" />
              <span>$1M Host & Equipment Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-accent shrink-0" />
              <span>Instant Confirmation Workflow</span>
            </div>
          </div>
        </form>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-base-200 px-6 py-4 bg-base-100 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold text-base-content/75 hover:bg-base-200 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !isValidDuration ||
              Boolean(isHost) ||
              isLoadingAvailability
            }
            className="button-primary !py-2.5 !px-6 text-xs sm:text-sm font-bold shadow-md shadow-primary/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Submitting Reservation...</span>
              </>
            ) : (
              <span>Confirm & Book Workspace</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
