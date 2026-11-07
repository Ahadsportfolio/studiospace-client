"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  User,
  X,
  XCircle,
} from "lucide-react";
import type { Booking } from "@/types/booking";

interface DeclineBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  isDeclining: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FALLBACK_STUDIO_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";

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

export function DeclineBookingModal({
  isOpen,
  booking,
  isDeclining,
  onClose,
  onConfirm,
}: DeclineBookingModalProps) {
  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeclining) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeclining, onClose]);

  if (!isOpen || !booking) {
    return null;
  }

  const imageSrc = booking.studioImage || FALLBACK_STUDIO_IMAGE;
  const isRemoteOptimized =
    imageSrc.includes("images.unsplash.com") ||
    imageSrc.includes("i.ibb.co");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="decline-booking-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        onClick={() => {
          if (!isDeclining) onClose();
        }}
      />

      {/* Dialog content */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl transition-all sm:p-7 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeclining}
          aria-label="Close dialog"
          className="btn btn-ghost btn-circle btn-sm absolute right-4 top-4 text-base-content/60 hover:text-base-content"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-error/10 text-error">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2
              id="decline-booking-title"
              className="font-serif text-xl font-medium tracking-tight text-base-content"
            >
              Decline Booking Request
            </h2>
            <p className="mt-1 text-xs text-base-content/70 sm:text-sm">
              Are you sure you want to decline this reservation? The creator will be notified and the reserved time slot will become available again.
            </p>
          </div>
        </div>

        {/* Booking details card */}
        <div className="mt-5 rounded-xl border border-base-300 bg-base-200/50 p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-lg border border-base-300 bg-base-300">
              <Image
                src={imageSrc}
                alt={booking.studioTitle}
                fill
                sizes="72px"
                className="object-cover"
                unoptimized={!isRemoteOptimized}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-base-content">
                {booking.studioTitle}
              </h3>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-base-content/70">
                <User className="h-3 w-3 shrink-0 text-base-content/60" />
                <span className="truncate">{booking.userName} ({booking.userEmail})</span>
              </div>
            </div>
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-2 border-t border-base-300/60 pt-3 text-xs">
            <div className="flex items-center gap-1.5 text-base-content/75">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span className="truncate">{formatDisplayDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-base-content/75">
              <Clock className="h-3.5 w-3.5 shrink-0 text-secondary" />
              <span className="truncate">
                {formatTimeDisplay(booking.startTime)} – {formatTimeDisplay(booking.endTime)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-base-content/75">
              <DollarSign className="h-3.5 w-3.5 shrink-0 text-success" />
              <span>
                Total: <strong className="text-base-content">${booking.totalPrice}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-base-content/75">
              <span className="text-base-content/50">Duration:</span>
              <span>{booking.hours} {booking.hours === 1 ? "hour" : "hours"}</span>
            </div>
          </div>
        </div>

        {/* Warning notice */}
        <div className="mt-4 rounded-xl border border-warning/30 bg-warning/10 p-3 text-xs text-warning-content">
          <p className="leading-relaxed">
            Declining sets the booking status to <strong>Cancelled</strong>. If the creator has special requirements or questions, you can also contact them directly at <strong>{booking.userEmail}</strong>.
          </p>
        </div>

        {/* Modal actions */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeclining}
            className="btn btn-ghost rounded-xl"
          >
            Keep Request
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeclining}
            className="btn btn-error rounded-xl gap-2 text-white shadow-sm"
          >
            {isDeclining ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Declining...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Decline Reservation
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

