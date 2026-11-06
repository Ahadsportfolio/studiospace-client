"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, ShieldAlert, UserX, Compass } from "lucide-react";

interface EditStudio403Props {
  studioId: string;
  studioTitle?: string;
  studioCategory?: string;
  ownerEmail?: string;
  currentEmail?: string;
}

export function EditStudio403({
  studioId,
  studioTitle,
  studioCategory,
  ownerEmail,
  currentEmail,
}: EditStudio403Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24">
      {/* Icon badge */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-error/30 bg-error/10 text-error shadow-inner">
        <ShieldAlert className="h-10 w-10 stroke-[1.5]" />
      </div>

      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-error/30 bg-error/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-error">
          <span>Error 403 • Access Forbidden</span>
        </div>

        <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
          Host Permission Required
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-base-content/75">
          You do not have permission to modify this studio listing. StudioSpace enforces strict host ownership security — only the verified account that created this creative space may update its specifications and pricing.
        </p>
      </div>

      {/* Security ownership audit box */}
      <div className="mt-8 rounded-2xl border border-base-300 bg-base-200/50 p-5 text-sm space-y-3">
        <div className="flex items-center gap-2 border-b border-base-300 pb-2.5 text-xs font-semibold uppercase tracking-wider text-base-content/70">
          <UserX className="h-4 w-4 text-error" />
          <span>Ownership Verification Details</span>
        </div>

        {studioTitle && (
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-base-content/60">Target Studio:</span>
            <span className="font-semibold text-base-content text-right truncate max-w-[60%]">
              {studioTitle}
            </span>
          </div>
        )}

        {studioCategory && (
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-base-content/60">Category:</span>
            <span className="badge badge-sm badge-outline font-medium">
              {studioCategory}
            </span>
          </div>
        )}

        {ownerEmail && (
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-base-content/60">Registered Host:</span>
            <span className="font-mono text-xs text-base-content/80 text-right truncate max-w-[60%]">
              {ownerEmail}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-xs sm:text-sm pt-2 border-t border-base-300">
          <span className="text-base-content/60">Your Signed-in Account:</span>
          <span className="font-mono text-xs font-semibold text-error text-right truncate max-w-[60%]">
            {currentEmail || "Unknown"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/my-listings"
          className="btn btn-primary rounded-xl gap-2 font-medium shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Go to My Studio Listings</span>
        </Link>
        <Link
          href={`/studios/${studioId}`}
          className="btn btn-outline rounded-xl gap-2 font-medium"
        >
          <ExternalLink className="h-4 w-4" />
          <span>View Public Studio Page</span>
        </Link>
        <Link
          href="/studios"
          className="btn btn-ghost rounded-xl gap-2 font-medium"
        >
          <Compass className="h-4 w-4" />
          <span>Explore Studios</span>
        </Link>
      </div>
    </div>
  );
}

