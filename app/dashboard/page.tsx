"use client";

import Link from "next/link";
import {
  Sparkles,
  UserCheck,
  Plus,
  FileText,
  CalendarDays,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { PrivateRoute } from "@/components/private-route";
import { useAuth } from "@/providers/auth-provider";

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Workspace Operations</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
            Creator & Host Dashboard
          </h1>
          <p className="mt-2 text-sm text-base-content/70 sm:text-base">
            Manage your creative bookings, studio inquiries, calendar availability, and production revenue.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/add-studio"
            className="btn btn-primary rounded-xl gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add Studio
          </Link>
        </div>
      </div>

      {/* Account overview banner */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-content font-semibold">
              {user?.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-base-content">{user?.name || "Studio Member"}</span>
                <span className="badge badge-sm badge-success gap-1">
                  <UserCheck className="h-3 w-3" /> Authenticated
                </span>
              </div>
              <p className="text-xs text-base-content/65">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-base-content/60">
            <ShieldCheck className="h-4 w-4 text-success" />
            <span>Protected private route • Session active</span>
          </div>
        </div>
      </div>

      {/* Quick navigation cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card border border-base-300 bg-base-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Plus className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-base-content">
              Host a Studio
            </h3>
            <p className="text-xs text-base-content/70">
              List new creative spaces, sound stages, podcast rooms, or photo cyc walls.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/add-studio"
              className="btn btn-outline btn-sm w-full rounded-lg gap-2"
            >
              Add Studio <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-base-content">
              My Studio Listings
            </h3>
            <p className="text-xs text-base-content/70">
              Update pricing, adjust technical equipment lists, and manage existing listings.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/my-listings"
              className="btn btn-outline btn-sm w-full rounded-lg gap-2"
            >
              Manage Listings <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="card border border-base-300 bg-base-100 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
              <CalendarDays className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-lg font-medium text-base-content">
              My Bookings
            </h3>
            <p className="text-xs text-base-content/70">
              View upcoming shoot dates, reservation approvals, and booking schedule history.
            </p>
          </div>
          <div className="mt-6">
            <Link
              href="/my-bookings"
              className="btn btn-outline btn-sm w-full rounded-lg gap-2"
            >
              View Bookings <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PrivateRoute message="Loading your dashboard...">
      <DashboardContent />
    </PrivateRoute>
  );
}
