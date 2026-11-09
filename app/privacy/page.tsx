import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock, Shield, Database, EyeOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy — StudioSpace | Rent & Host Creative Workspaces",
  description:
    "Learn how StudioSpace protects user data, manages creator accounts, stores studio listing information, and ensures secure reservation handling.",
};

export default function PrivacyPage() {
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
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-base-content">
              Privacy Policy
            </h1>
            <p className="text-sm text-base-content/60">Effective date: November 2026</p>
          </div>
        </div>

        <div className="space-y-6 text-base-content/80 text-sm leading-relaxed">
          <section className="rounded-xl border border-base-300 bg-base-200/50 p-6">
            <h2 className="text-lg font-semibold text-base-content mb-2 flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              1. Information We Collect
            </h2>
            <p>
              When you sign in using Google OAuth or email registration via Better Auth, we store your name, email address, and profile photo. For hosts, we collect studio listings, gear specs, pricing, and uploaded studio photographs. For creators, we store booking dates, scheduled hours, and reservation status.
            </p>
          </section>

          <section className="rounded-xl border border-base-300 bg-base-200/50 p-6">
            <h2 className="text-lg font-semibold text-base-content mb-2 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              2. How We Use Your Information
            </h2>
            <p>
              Your data is used solely to provide production workspace marketplace services: enabling host-creator messaging, verifying studio ownership, calculating hourly and security deposit totals, enforcing double-booking prevention, and issuing confirmed booking receipts.
            </p>
          </section>

          <section className="rounded-xl border border-base-300 bg-base-200/50 p-6">
            <h2 className="text-lg font-semibold text-base-content mb-2 flex items-center gap-2">
              <EyeOff className="h-5 w-5 text-primary" />
              3. Data Protection & No Sale of Data
            </h2>
            <p>
              We do not sell, rent, or monetize personal user data to third-party advertisers. All authentication tokens and communication between your browser and StudioSpace are transmitted over encrypted TLS connections. You can request deletion of your account and studio listings at any time.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}

