import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck, Clock, Ban } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service — StudioSpace | Rent & Host Creative Workspaces",
  description:
    "Review StudioSpace terms of service, host standards, creator booking guidelines, cancellation policies, and workspace usage conditions.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-base-content/70 hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-base-content">
              Terms of Service
            </h1>
            <p className="text-sm text-base-content/60">Effective date: November 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-base-content/80 text-sm leading-relaxed">
          <section className="rounded-xl border border-base-300 bg-base-200/50 p-6">
            <h2 className="text-lg font-semibold text-base-content mb-2 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              1. Host Responsibilities & Listing Accuracy
            </h2>
            <p>
              Hosts must ensure that all studio listings—including photo cyc walls, sound stages, podcast lounges, music suites, and art workshops—accurately describe equipment, sound insulation, lighting grids, and capacity. Confirmed bookings must be honored conflict-free at the published hourly rate.
            </p>
          </section>

          <section className="rounded-xl border border-base-300 bg-base-200/50 p-6">
            <h2 className="text-lg font-semibold text-base-content mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              2. Creator Guidelines, Overruns & Security Deposits
            </h2>
            <p>
              Creators must adhere strictly to reserved shoot hours. Overrun time beyond the scheduled booking window is subject to additional hourly fees. Security deposits are held to safeguard host equipment, backdrops, and gear, and are refunded after checkout when the space is left in good condition.
            </p>
          </section>

          <section className="rounded-xl border border-base-300 bg-base-200/50 p-6">
            <h2 className="text-lg font-semibold text-base-content mb-2">
              3. Bookings & Cancellations
            </h2>
            <p>
              Reservations are submitted with Pending status. Creators may cancel Pending reservations without penalty. Once a host marks a slot Confirmed, double-booking prevention locks out the schedule to prevent booking collisions with other production crews.
            </p>
          </section>

          <section className="rounded-xl border border-base-300 bg-base-200/50 p-6">
            <h2 className="text-lg font-semibold text-base-content mb-2 flex items-center gap-2">
              <Ban className="h-5 w-5 text-primary" />
              4. Prohibited Uses & Safety
            </h2>
            <p>
              Hazardous materials, open flames without prior written host approval, structural alteration of sets, and exceeding posted crew occupancy limits are strictly prohibited across all facilities.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

