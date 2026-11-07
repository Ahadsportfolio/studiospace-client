"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  FileText,
  Mail,
  User,
  X,
} from "lucide-react";
import type { Booking } from "@/types/booking";

interface BookingNotesModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
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

export function BookingNotesModal({
  isOpen,
  booking,
  onClose,
}: BookingNotesModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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
      aria-labelledby="booking-notes-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        onClick={onClose}
      />

      {/* Dialog content */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-6 shadow-2xl transition-all sm:p-7 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="btn btn-ghost btn-circle btn-sm absolute right-4 top-4 text-base-content/60 hover:text-base-content"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal header */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h2
              id="booking-notes-title"
              className="font-serif text-xl font-medium tracking-tight text-base-content"
            >
              Creator Shoot Notes & Instructions
            </h2>
            <p className="mt-1 text-xs text-base-content/70 sm:text-sm">
              Specific shoot requirements or crew notes submitted by the creator.
            </p>
          </div>
        </div>

        {/* Studio & Creator Summary */}
        <div className="mt-5 rounded-xl border border-base-300 bg-base-200/50 p-4">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-base-300 bg-base-300">
              <Image
                src={imageSrc}
                alt={booking.studioTitle}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized={!isRemoteOptimized}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-semibold text-base-content">
                {booking.studioTitle}
              </h3>
              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-base-content/70">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-base-content/50" />
                  {booking.userName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-base-content/50" />
                  {booking.userEmail}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-base-300/60 pt-2.5 text-xs text-base-content/75">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {formatDisplayDate(booking.date)}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-secondary" />
              {formatTimeDisplay(booking.startTime)} – {formatTimeDisplay(booking.endTime)}
            </span>
          </div>
        </div>

        {/* Creator's Message */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
            Creator Message
          </h4>
          <div className="mt-2 rounded-xl border border-base-300 bg-base-100 p-4 text-sm text-base-content leading-relaxed whitespace-pre-wrap">
            {booking.notes ? booking.notes : (
              <span className="italic text-base-content/50">
                No special shoot notes provided with this reservation.
              </span>
            )}
          </div>
        </div>

        {/* Modal actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary rounded-xl px-6"
          >
            Close Notes
          </button>
        </div>
      </div>
    </div>
  );
}

