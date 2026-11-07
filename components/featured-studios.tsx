"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { StudioCard } from "@/components/studio-card";
import { StudioCardSkeleton } from "@/components/studio-card-skeleton";
import type { Studio, StudiosApiResponse } from "@/types/studio";

async function fetchFeaturedStudios(): Promise<Studio[]> {
  const response = await apiFetch<StudiosApiResponse>(
    "/api/studios?limit=6&sort=rating",
  );

  if (!response || !Array.isArray(response.data)) {
    throw new Error("The featured studios response was invalid.");
  }

  return response.data.slice(0, 6);
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Featured studios could not be loaded.";
}

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetchFeaturedStudios()
      .then((items) => {
        if (active) {
          setStudios(items);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError));
          setStudios([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const retryFetch = async () => {
    setLoading(true);
    setError(null);

    try {
      setStudios(await fetchFeaturedStudios());
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setStudios([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      aria-labelledby="featured-studios-heading"
      className="w-full border-b border-base-300/60 bg-base-100 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-6 border-b border-base-300/70 pb-10 md:flex-row md:items-end md:justify-between sm:pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <Sparkles size={13} aria-hidden="true" />
              <span>Top-Rated Workspaces</span>
            </div>
            <h2
              id="featured-studios-heading"
              className="mt-3.5 font-display text-3xl font-normal tracking-tight text-base-content sm:text-4xl lg:text-5xl"
            >
              Featured Studios
            </h2>
            <p className="mt-3 text-base leading-relaxed text-base-content/75 sm:text-lg">
              Find a well-equipped space for your next shoot, session, or
              production.
            </p>
          </div>

          <Link
            href="/studios"
            className="button-secondary group shrink-0 !min-h-11 !px-5 text-sm font-semibold"
          >
            <span>Explore All Studios</span>
            <ArrowRight
              size={16}
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <div
          aria-busy={loading}
          aria-label={loading ? "Loading featured studios" : undefined}
          className="mt-10 sm:mt-12"
        >
          {loading ? (
            <div
              aria-hidden="true"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <StudioCardSkeleton key={index} />
              ))}
            </div>
          ) : error ? (
            <div
              role="alert"
              className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200/50 p-10 text-center"
            >
              <p className="font-semibold text-base-content">
                Featured studios could not be loaded.
              </p>
              <p className="mt-2 max-w-lg text-sm text-base-content/70">
                {error}
              </p>
              <button
                type="button"
                onClick={() => void retryFetch()}
                className="button-secondary mt-5 !min-h-10 !px-4 text-xs font-semibold"
              >
                <RefreshCw size={14} aria-hidden="true" />
                <span>Try again</span>
              </button>
            </div>
          ) : studios.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-100 p-8 sm:p-14 text-center shadow-xs">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Compass className="h-8 w-8" />
              </div>
              <h3 className="mt-4 font-serif text-xl sm:text-2xl font-medium text-base-content">
                No Featured Studios Currently Highlighted
              </h3>
              <p className="mt-2 max-w-md text-sm text-base-content/70">
                Browse our full directory of photo studios, film stages, sound suites, and workshops to find the perfect space for your production.
              </p>
              <Link
                href="/studios"
                className="button-primary mt-6 !min-h-11 !px-6 text-sm font-semibold inline-flex items-center gap-2 shadow-md shadow-primary/20"
              >
                <Compass className="h-4 w-4" />
                <span>Explore All Studios</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {studios.map((studio) => (
                <StudioCard key={studio._id} studio={studio} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
