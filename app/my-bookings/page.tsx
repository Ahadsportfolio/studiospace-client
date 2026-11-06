"use client";

import Link from "next/link";
import { CalendarDays, Sparkles, UserCheck, ArrowRight } from "lucide-react";
import { PrivateRoute } from "@/components/private-route";
import { useAuth } from "@/providers/auth-provider";

function MyBookingsContent() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header section */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Production Reservations</span>
          </div>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-base-content sm:text-4xl">
            My Studio Bookings
          </h1>
          <p className="mt-2 text-sm text-base-content/70 sm:text-base">
            Track your reserved photo shoots, recording sessions, and studio time slots in real time.
          </p>
        </div>

        <div>
          <Link
            href="/studios"
            className="btn btn-primary rounded-xl gap-2 shadow-sm"
          >
            Explore Studios <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Creator identity banner */}
      <div className="mb-8 rounded-2xl border border-base-300 bg-base-200/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info text-info-content font-semibold">
              {user?.name ? user.name[0].toUpperCase() : "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-base-content">{user?.name || "Creator"}</span>
                <span className="badge badge-sm badge-success gap-1">
                  <UserCheck className="h-3 w-3" /> Creator Account
                </span>
              </div>
              <p className="text-xs text-base-content/65">Bookings registered to: {user?.email}</p>
            </div>
          </div>
          <div className="text-xs text-base-content/60">
            Protected private route • Session verified
          </div>
        </div>
      </div>

      {/* Bookings shell */}
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100 p-8 text-center sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-base-200 text-primary">
          <CalendarDays className="h-7 w-7" />
        </div>
        <h2 className="mt-4 font-serif text-2xl font-medium text-base-content">
          Your Studio Schedule
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-base-content/70">
          All your confirmed and pending studio sessions will be listed here with instant status updates (Pending, Confirmed, Completed, Cancelled).
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/studios" className="btn btn-primary btn-sm rounded-lg gap-2">
            Find Workspaces to Book <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard" className="btn btn-outline btn-sm rounded-lg">
            Creator Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  return (
    <PrivateRoute message="Retrieving your studio bookings...">
      <MyBookingsContent />
    </PrivateRoute>
  );
}
