"use client";

import { useState } from "react";
import {
  CalendarCheck,
  Clock,
  Heart,
  Info,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import type { Studio } from "@/types/studio";

interface BookingPanelProps {
  studio: Studio;
  onBookClick?: () => void;
}

export function BookingPanel({ studio, onBookClick }: BookingPanelProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [selectedHours, setSelectedHours] = useState(4);

  const subtotal = studio.hourlyRate * selectedHours;
  const deposit = studio.securityDeposit || 0;
  const total = subtotal + deposit;

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Studio link copied to clipboard!", {
          description: "Share this link with your crew or clients.",
        });
      }
    } catch {
      toast.error("Could not copy link to clipboard.");
    }
  };

  const handleToggleSave = () => {
    setIsSaved((prev) => {
      const next = !prev;
      if (next) {
        toast.success("Saved to your StudioSpace wishlist!", {
          description: studio.title,
        });
      } else {
        toast.info("Removed from your wishlist.");
      }
      return next;
    });
  };

  const handleBookNow = () => {
    if (onBookClick) {
      onBookClick();
    } else {
      toast.info("Opening booking calendar...", {
        description:
          "Reserve shoot hours, review availability, and submit your reservation.",
      });
    }
  };

  return (
    <>
      {/* Desktop Sticky Card */}
      <aside
        aria-label="Booking and pricing specifications"
        className="rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-7 shadow-lg lg:sticky lg:top-24"
      >
        {/* Rate & Deposit Header */}
        <div className="flex items-start justify-between gap-4 border-b border-base-200 pb-5">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Workspace Rate
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="font-display text-3xl font-bold tracking-tight text-base-content sm:text-4xl">
                ${Number(studio.hourlyRate).toFixed(0)}
              </span>
              <span className="text-sm font-medium text-base-content/65">
                / hour
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Security Deposit
            </span>
            <div className="mt-1 text-sm font-semibold text-base-content">
              ${deposit}
              <span className="ml-1 text-[11px] font-normal text-base-content/60">
                (refundable)
              </span>
            </div>
          </div>
        </div>

        {/* Shoot Estimate Duration Selector */}
        <div className="mt-5 rounded-2xl bg-base-200/60 p-4 border border-base-300/80">
          <div className="flex items-center justify-between text-xs font-semibold text-base-content">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Estimated Shoot Duration</span>
            </span>
            <span className="text-primary font-bold">{selectedHours} hours</span>
          </div>

          <div className="mt-3 flex items-center gap-1.5">
            {[2, 4, 8, 10].map((hrs) => (
              <button
                key={hrs}
                type="button"
                onClick={() => setSelectedHours(hrs)}
                className={`flex-1 rounded-xl py-1.5 text-xs font-semibold transition-all ${
                  selectedHours === hrs
                    ? "bg-primary text-primary-content shadow-xs"
                    : "bg-base-100 text-base-content/80 hover:bg-base-300"
                }`}
              >
                {hrs} hrs
              </button>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="mt-4 space-y-2 border-t border-base-300/60 pt-3 text-xs text-base-content/75">
            <div className="flex justify-between">
              <span>
                ${studio.hourlyRate} × {selectedHours} hours
              </span>
              <span className="font-medium text-base-content">
                ${subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="inline-flex items-center gap-1">
                <span>Refundable deposit</span>
                <span
                  title="Returned within 48 hours post-shoot subject to inspection"
                  className="cursor-help text-base-content/50"
                >
                  <Info className="h-3 w-3" />
                </span>
              </span>
              <span className="font-medium text-base-content">
                ${deposit.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>StudioSpace protection fee</span>
              <span className="font-medium text-success">$0 (Free)</span>
            </div>

            <div className="flex items-center justify-between border-t border-base-300/80 pt-2.5 text-sm font-bold text-base-content">
              <span>Estimated Total</span>
              <span className="text-base text-primary">
                ${total.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Main CTA Button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleBookNow}
            className="button-primary w-full shadow-lg shadow-primary/25 cursor-pointer !py-3.5 text-base font-bold tracking-wide"
          >
            <span>Book Workspace Now</span>
          </button>
          <p className="mt-2 text-center text-[11px] text-base-content/60">
            You won&apos;t be charged until the host accepts your slot
          </p>
        </div>

        {/* Action Row: Wishlist & Share */}
        <div className="mt-4 flex items-center gap-2 border-t border-base-200 pt-4">
          <button
            type="button"
            onClick={handleToggleSave}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border py-2 text-xs font-semibold transition-all ${
              isSaved
                ? "border-rose-400 bg-rose-50 text-rose-600 dark:bg-rose-950/30"
                : "border-base-300 bg-base-100 text-base-content/75 hover:bg-base-200 hover:text-base-content"
            }`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${
                isSaved ? "fill-rose-500 text-rose-500" : ""
              }`}
            />
            <span>{isSaved ? "Saved" : "Save Space"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 py-2 text-xs font-semibold text-base-content/75 hover:bg-base-200 hover:text-base-content transition-all"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </button>
        </div>

        {/* Protection Perks */}
        <div className="mt-6 space-y-2.5 border-t border-base-200 pt-5 text-xs text-base-content/70">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 shrink-0 text-success mt-0.5" />
            <span>$1,000,000 StudioSpace space & equipment liability protection</span>
          </div>
          <div className="flex items-start gap-2.5">
            <CalendarCheck className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <span>Free cancellation up to 48 hours prior to reservation time</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Sparkles className="h-4 w-4 shrink-0 text-accent mt-0.5" />
            <span>Studio verified for sound, power, and lighting readiness</span>
          </div>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Bar (Fixed on small screens) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between border-t border-base-300 bg-base-100/95 px-4 py-3 shadow-2xl backdrop-blur-md lg:hidden">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-bold text-base-content">
              ${studio.hourlyRate}
            </span>
            <span className="text-xs text-base-content/70">/ hr</span>
          </div>
          <span className="text-[10px] text-base-content/60">
            ${deposit} deposit • {studio.maxCapacity} creators
          </span>
        </div>

        <button
          type="button"
          onClick={handleBookNow}
          className="button-primary !min-h-10 !px-5 !py-2 text-sm font-semibold shadow-md shadow-primary/20"
        >
          <span>Book Workspace Now</span>
        </button>
      </div>
    </>
  );
}
