"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  AlertTriangle,
  Calendar,
  Clock,
  DollarSign,
  Loader2,
  X,
  XCircle,
} from "lucide-react";
import type { Booking } from "@/types/booking";

interface CancelBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  isCancelling: boolean;
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

export function CancelBookingModal({
  isOpen,
  booking,
  isCancelling,
  onClose,
  onConfirm,
}: CancelBookingModalProps) {
  const [hasImageError, setHasImageError] = useState(false);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isCancelling) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isCancelling, onClose]);

  if (!isOpen || !booking) {
    return null;
  }

  const imageSrc =
    hasImageError || !booking.studioImage
      ? FALLBACK_STUDIO_IMAGE
      : booking.studioImage;

  const isRemoteOptimized =
    imageSrc.includes("images.unsplash.com") ||
    imageSrc.includes("i.ibb.co");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-dialog-title"
      aria-describedby="cancel-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isCancelling) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isCancelling}
          aria-label="Close cancellation modal"
          className="absolute right-5 top-5 rounded-full p-1.5 text-base-content/60 hover:bg-base-200 hover:text-base-content transition-colors cursor-pointer disabled:opacity-50"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-error/10 text-error">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h2
              id="cancel-dialog-title"
              className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-base-content"
            >
              Cancel Studio Booking
            </h2>
            <p
              id="cancel-dialog-desc"
              className="mt-1 text-xs sm:text-sm text-base-content/70"
            >
              Are you sure you want to cancel your pending reservation request?
            </p>
          </div>
        </div>

        {/* Booking Details Preview */}
        <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/60 p-4">
          <div className="flex items-start gap-3.5">
            <div className="relative h-18 w-24 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-300">
              <Image
                src={imageSrc}
                alt={booking.studioTitle}
                fill
                sizes="96px"
                className="object-cover"
                unoptimized={!isRemoteOptimized}
                onError={() => setHasImageError(true)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="badge badge-warning badge-sm font-semibold py-0.5">
                  Pending Request
                </span>
                <span className="text-[11px] text-base-content/50 font-mono">
                  #{booking._id.slice(-6).toUpperCase()}
                </span>
              </div>

              <h3 className="mt-1 font-serif text-base font-medium text-base-content truncate">
                {booking.studioTitle}
              </h3>

              <div className="mt-1.5 flex flex-col gap-1 text-xs text-base-content/70">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-medium text-base-content">
                    {formatDisplayDate(booking.date)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span>
                    {formatTimeDisplay(booking.startTime)} –{" "}
                    {formatTimeDisplay(booking.endTime)} ({booking.hours}{" "}
                    {booking.hours === 1 ? "hr" : "hrs"})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold text-base-content">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>${booking.totalPrice} Total</span>
                  <span className="text-[11px] font-normal text-base-content/60">
                    (incl. ${booking.securityDeposit} deposit)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Callout */}
        <div className="mt-4 rounded-xl border border-warning/25 bg-warning/5 p-3 text-xs leading-relaxed text-warning-content dark:text-warning">
          <span className="font-semibold">Cancellation Policy:</span> Once
          cancelled, this reservation request will be marked as Cancelled,
          removed from the host&apos;s pending review queue, and the reserved
          slot will be made available to other creators.
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="btn btn-ghost rounded-xl border border-base-300 hover:bg-base-200 font-medium"
          >
            Keep Booking
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isCancelling}
            className="btn btn-error rounded-xl text-white gap-2 shadow-sm font-medium"
          >
            {isCancelling ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Cancelling Booking...</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                <span>Yes, Cancel Booking</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

