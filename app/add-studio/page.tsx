"use client";

import Link from "next/link";
import { Sparkles, Building2, UserCheck, ArrowRight } from "lucide-react";
import { PrivateRoute } from "@/components/private-route";
import { useAuth } from "@/providers/auth-provider";

function AddStudioContent() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Host Studio Workspace</span>
        </div>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
          List Your Creative Studio
        </h1>
        <p className="mt-2 text-sm text-base-content/70 sm:text-base">
          Share your photo cyclorama, sound stage, podcast booth, or music suite with verified creators worldwide.
        </p>
      </div>

      {/* Host identity card */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-content font-semibold">
              {user?.name ? user.name[0].toUpperCase() : "H"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-base-content">{user?.name || "Studio Host"}</span>
                <span className="badge badge-sm badge-success gap-1">
                  <UserCheck className="h-3 w-3" /> Verified Host
                </span>
              </div>
              <p className="text-xs text-base-content/65">{user?.email}</p>
            </div>
          </div>
          <div className="text-xs text-base-content/60">
            Ownership verified via secure session token
          </div>
        </div>
      </div>

      {/* Form shell / roadmap preview */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-base-content">
              Studio Listing Registration
            </h2>
            <p className="text-sm text-base-content/75 leading-relaxed">
              Prepare your space details including category (Photo Studio, Film Stage, Podcast Lounge, Music Suite, Workshop), hourly pricing, security deposit, max creator capacity, equipment amenities, and high-resolution photo showcase.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-base-200 pt-6">
          <span className="text-xs text-base-content/60">
            Protected private route • Session verified
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/my-listings"
              className="btn btn-outline btn-sm rounded-lg"
            >
              View My Listings
            </Link>
            <Link
              href="/studios"
              className="btn btn-primary btn-sm rounded-lg gap-2"
            >
              Explore Studios <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddStudioPage() {
  return (
    <PrivateRoute message="Accessing studio submission portal...">
      <AddStudioContent />
    </PrivateRoute>
  );
}
