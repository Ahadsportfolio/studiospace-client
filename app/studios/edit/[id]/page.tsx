"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import { ArrowLeft, Edit3, Sparkles, UserCheck } from "lucide-react";
import { BrandedSpinner } from "@/components/branded-spinner";
import { PrivateRoute } from "@/components/private-route";
import { useAuth } from "@/providers/auth-provider";

type EditStudioProps = {
  params: Promise<{ id: string }>;
};

function EditStudioContent({ id }: { id: string }) {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back button and badges */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/my-listings"
          className="inline-flex items-center gap-2 text-sm font-medium text-base-content/75 hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to My Listings
        </Link>
        <div className="inline-flex items-center gap-2 rounded-full bg-base-200 px-3.5 py-1 text-xs font-mono text-base-content/75">
          <span>Studio ID:</span>
          <span className="font-semibold text-primary">{id}</span>
        </div>
      </div>

      {/* Header section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Edit Studio Details</span>
        </div>
        <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
          Update Studio Specification
        </h1>
        <p className="mt-2 text-sm text-base-content/70 sm:text-base">
          Modify your creative workspace pricing, equipment specs, amenities, and booking rules.
        </p>
      </div>

      {/* Host identity card */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-content font-semibold">
              {user?.name ? user.name[0].toUpperCase() : "H"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-base-content">{user?.name || "Studio Host"}</span>
                <span className="badge badge-sm badge-success gap-1">
                  <UserCheck className="h-3 w-3" /> Verified Owner
                </span>
              </div>
              <p className="text-xs text-base-content/65">Authorized host: {user?.email}</p>
            </div>
          </div>
          <div className="text-xs text-base-content/60">
            Ownership permissions verified
          </div>
        </div>
      </div>

      {/* Form shell */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Edit3 className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif text-xl font-medium text-base-content">
              Studio Configuration Editor
            </h2>
            <p className="text-sm text-base-content/75 leading-relaxed">
              Updating space parameters for studio reference <code className="rounded bg-base-200 px-1.5 py-0.5 text-xs font-mono">{id}</code>. You can configure hourly rates, security deposit, category, and equipment amenities.
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
              Cancel
            </Link>
            <Link
              href="/my-listings"
              className="btn btn-primary btn-sm rounded-lg"
            >
              Return to Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditStudioInner({ params }: EditStudioProps) {
  const { id } = use(params);
  return <EditStudioContent id={id} />;
}

export default function EditStudioPage({ params }: EditStudioProps) {
  return (
    <PrivateRoute message="Verifying host permissions for this studio...">
      <Suspense
        fallback={
          <BrandedSpinner
            message="Loading studio specifications..."
            submessage="Preparing editor for this studio space."
          />
        }
      >
        <EditStudioInner params={params} />
      </Suspense>
    </PrivateRoute>
  );
}
