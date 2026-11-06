"use client";

import Link from "next/link";
import { Plus, Sparkles, UserCheck, Layers } from "lucide-react";
import { PrivateRoute } from "@/components/private-route";
import { useAuth } from "@/providers/auth-provider";

function MyListingsContent() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Studio Management</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
            My Studio Listings
          </h1>
          <p className="mt-2 text-sm text-base-content/70 sm:text-base">
            Review, edit, and monitor creative workspaces listed under your host account.
          </p>
        </div>

        <div>
          <Link
            href="/add-studio"
            className="btn btn-primary rounded-xl gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add New Studio
          </Link>
        </div>
      </div>

      {/* Host identity banner */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-secondary-content font-semibold">
              {user?.name ? user.name[0].toUpperCase() : "H"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-base-content">{user?.name || "Host"}</span>
                <span className="badge badge-sm badge-success gap-1">
                  <UserCheck className="h-3 w-3" /> Host Account
                </span>
              </div>
              <p className="text-xs text-base-content/65">Owner email: {user?.email}</p>
            </div>
          </div>
          <div className="text-xs text-base-content/60">
            Protected private route • Session verified
          </div>
        </div>
      </div>

      {/* Overview shell */}
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-primary">
          <Layers className="h-7 w-7" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-medium text-base-content">
          Host Listings Inventory
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
          Your production studios, cyc walls, and recording suites will be displayed here with real-time status, quick updates, and booking requests.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/add-studio" className="btn btn-primary btn-sm rounded-lg gap-2">
            <Plus className="h-4 w-4" /> Add Your First Studio
          </Link>
          <Link href="/dashboard" className="btn btn-outline btn-sm rounded-lg">
            Host Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MyListingsPage() {
  return (
    <PrivateRoute message="Retrieving your studio listings...">
      <MyListingsContent />
    </PrivateRoute>
  );
}
