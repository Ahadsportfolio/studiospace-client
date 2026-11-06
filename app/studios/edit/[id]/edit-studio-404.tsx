"use client";

import Link from "next/link";
import { ArrowLeft, Building2, Compass, Home, Search } from "lucide-react";

interface EditStudio404Props {
  studioId: string;
}

export function EditStudio404({ studioId }: EditStudio404Props) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24">
      {/* Icon badge */}
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-warning/30 bg-warning/10 text-warning shadow-inner">
        <Building2 className="h-10 w-10 stroke-[1.5]" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-base-content/70">
        <span>Error 404 • Studio Not Found</span>
      </div>

      <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
        Studio Workspace Not Found
      </h1>

      <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-base-content/75">
        The studio space you are trying to edit does not exist, has an invalid identifier, or may have been permanently deleted by its host.
      </p>

      {studioId && (
        <div className="mx-auto mt-4 inline-flex items-center gap-1.5 rounded-lg border border-base-300 bg-base-200/60 px-3 py-1.5 text-xs text-base-content/70">
          <span className="font-semibold text-base-content/50">Requested ID:</span>
          <code className="font-mono text-primary font-semibold">{studioId}</code>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/my-listings"
          className="btn btn-primary rounded-xl gap-2 font-medium shadow-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to My Listings</span>
        </Link>
        <Link
          href="/studios"
          className="btn btn-outline rounded-xl gap-2 font-medium"
        >
          <Compass className="h-4 w-4" />
          <span>Explore Studios</span>
        </Link>
      </div>
    </div>
  );
}
