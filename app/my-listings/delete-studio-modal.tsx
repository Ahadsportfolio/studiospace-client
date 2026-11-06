"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AlertTriangle, Loader2, MapPin, Trash2, X } from "lucide-react";
import type { Studio } from "@/types/studio";

interface DeleteStudioModalProps {
  isOpen: boolean;
  studio: Studio | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FALLBACK_STUDIO_IMAGE =
  "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80";

export function DeleteStudioModal({
  isOpen,
  studio,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteStudioModalProps) {
  const [hasImageError, setHasImageError] = useState(false);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isDeleting) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen || !studio) {
    return null;
  }

  const imageSrc =
    hasImageError || !studio.image ? FALLBACK_STUDIO_IMAGE : studio.image;

  const isRemoteOptimized =
    imageSrc.includes("images.unsplash.com") ||
    imageSrc.includes("i.ibb.co");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          aria-label="Close delete confirmation"
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
              id="delete-dialog-title"
              className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-base-content"
            >
              Delete Studio Listing
            </h2>
            <p id="delete-dialog-desc" className="mt-1 text-xs sm:text-sm text-base-content/70">
              This action cannot be undone. Please confirm you want to permanently remove this space.
            </p>
          </div>
        </div>

        {/* Studio Preview Snippet */}
        <div className="mt-5 rounded-2xl border border-base-300 bg-base-200/60 p-3.5 sm:p-4">
          <div className="flex items-center gap-3.5">
            <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl border border-base-300 bg-base-300">
              <Image
                src={imageSrc}
                alt={studio.title}
                fill
                sizes="80px"
                className="object-cover"
                unoptimized={!isRemoteOptimized}
                onError={() => setHasImageError(true)}
              />
            </div>
            <div className="min-w-0 flex-1">
              <span className="badge badge-primary badge-outline text-[11px] font-semibold py-0.5">
                {studio.category}
              </span>
              <h3 className="mt-1 font-serif text-sm sm:text-base font-medium text-base-content truncate">
                {studio.title}
              </h3>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-base-content/60 truncate">
                <MapPin className="h-3 w-3 shrink-0 text-primary" />
                <span className="truncate">{studio.location}</span>
                <span className="shrink-0 font-medium text-base-content ml-1">
                  • ${studio.hourlyRate}/hr
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="mt-4 rounded-xl border border-error/25 bg-error/5 p-3 text-xs leading-relaxed text-error/90">
          <span className="font-semibold text-error">Warning:</span> Once deleted, this studio listing will be immediately removed from marketplace discovery and creator search. Any pending reservation requests for this studio will also be automatically cancelled.
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="btn btn-ghost rounded-xl border border-base-300 hover:bg-base-200 font-medium"
          >
            Keep Studio
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="btn btn-error rounded-xl text-white gap-2 shadow-sm font-medium"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting Studio...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Confirm & Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
